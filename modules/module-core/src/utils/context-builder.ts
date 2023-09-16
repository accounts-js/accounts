import AccountsServer from '@accounts/server';
import { IncomingMessage } from 'http';
import { getClientIp } from 'request-ip';
import { IContext, User } from '@accounts/types';
import { Application } from 'graphql-modules';

export type AccountsContextOptions<Ctx extends object> = {
  createOperationController: Application['createOperationController'];
  ctx?: Ctx;
  headerName?: string;
  excludeAddUserInContext?: boolean;
};

function isFetchRequest(request: Request | IncomingMessage): request is Request {
  return (request as Request).headers.get != null;
}

function getHeader(request: Request | IncomingMessage, headerName: string): string | null {
  const header = isFetchRequest(request)
    ? request.headers.get(headerName)
    : request.headers[headerName];
  if (Array.isArray(header)) {
    throw new Error('Header should be a string, not array');
  }
  return header ?? null;
}

export const context = async <IUser extends User = User, Ctx extends object = object>(
  {
    req,
    request,
  }:
    | {
        req: IncomingMessage;
        request?: undefined;
      }
    | {
        req?: undefined;
        request: Request;
      },
  { createOperationController, ctx, ...options }: AccountsContextOptions<Ctx>
): AccountsContextOptions<Ctx> extends { ctx: any }
  ? Promise<IContext<IUser> & Ctx>
  : Promise<IContext<IUser>> => {
  const reqOrRequest = request ?? req;
  if (!reqOrRequest) {
    return {
      ip: '',
      userAgent: '',
      infos: {
        ip: '',
        userAgent: '',
      },
      ...ctx,
    };
  }

  const controller = createOperationController({
    context: { ...ctx },
    autoDestroy: false,
  });

  const headerName = options.headerName || 'Authorization';
  let authToken =
    getHeader(reqOrRequest, headerName) ??
    getHeader(reqOrRequest, headerName.toLowerCase()) ??
    undefined;
  authToken = authToken && authToken.replace('Bearer ', '');
  let user;

  if (authToken && !options.excludeAddUserInContext) {
    /*const controller = createOperationController({
      context: { ...ctx },
      autoDestroy: false,
    });*/
    try {
      user = await controller.injector
        .get<AccountsServer<IUser>>(AccountsServer)
        .resumeSession(authToken);
    } catch (error) {
      // Empty catch
      console.error(error);
    }
    //controller.destroy();
  }

  const ip = getClientIp(req!); // TODO: we should be able to retrieve the ip from the request object as well
  const userAgent =
    /* special case of UC Browser */ getHeader(reqOrRequest, 'x-ucbrowser-ua') ??
    getHeader(reqOrRequest, 'user-agent') ??
    '';

  controller.destroy();

  return {
    authToken,
    user,
    userId: user?.id,
    userAgent,
    ip,
    infos: {
      userAgent,
      ip,
    },
    ...ctx,
  };
};
