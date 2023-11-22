import AccountsServer from '@accounts/server';
import { type IncomingHttpHeaders, type IncomingMessage } from 'http';
import { getClientIp } from 'request-ip';
import { type IContext, type User } from '@accounts/types';
import { type Application } from 'graphql-modules';
import { type Request as RequestGraphqlHttp, type RequestHeaders } from 'graphql-http';
import { type RequestContext } from 'graphql-http/lib/use/http';
import type http from 'http';

export type AccountsContextOptions<Ctx extends object> = {
  createOperationController: Application['createOperationController'];
  ctx?: Ctx;
  headerName?: string;
  excludeAddUserInContext?: boolean;
};

function isFetchHeaders(
  headers: Headers | IncomingHttpHeaders | RequestHeaders
): headers is Exclude<
  Headers | IncomingHttpHeaders | RequestHeaders,
  IncomingHttpHeaders | { [key: string]: string | string[] | undefined }
> {
  return headers.get != null;
}

function getHeader(
  request: Request | IncomingMessage | RequestGraphqlHttp<http.IncomingMessage, RequestContext>,
  headerName: string
): string | null {
  const header = isFetchHeaders(request.headers)
    ? request.headers.get(headerName)
    : request.headers[headerName];
  if (Array.isArray(header)) {
    throw new Error('Header should be a string, not array');
  }
  return header ?? null;
}

export const context = async <
  IUserOrContext extends object = User,
  Ctx extends object = object,
  _User_ extends User = IUserOrContext extends User ? IUserOrContext : User,
  _Context_ extends object = IUserOrContext extends User
    ? IContext<IUserOrContext>
    : IUserOrContext,
>(
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
        request: Request | RequestGraphqlHttp<http.IncomingMessage, RequestContext>;
      },
  { createOperationController, ctx, ...options }: AccountsContextOptions<Ctx>
): AccountsContextOptions<Ctx> extends { ctx: any }
  ? Promise<_Context_ & Ctx>
  : Promise<_Context_> => {
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
    } satisfies IContext<_User_> as _Context_;
  }

  const headerName = options.headerName || 'Authorization';
  let authToken =
    getHeader(reqOrRequest, headerName) ??
    getHeader(reqOrRequest, headerName.toLowerCase()) ??
    undefined;
  authToken = authToken && authToken.replace('Bearer ', '');
  let user;

  if (authToken && !options.excludeAddUserInContext) {
    const controller = createOperationController({
      context: { ...ctx },
      autoDestroy: false,
    });
    try {
      user = await controller.injector
        .get<AccountsServer<_User_>>(AccountsServer)
        .resumeSession(authToken);
    } catch (error) {
      // Empty catch
      console.error(error);
    }
    controller.destroy();
  }

  let ip: string | null = null;
  try {
    ip = getClientIp(req!); // TODO: we should be able to retrieve the ip from the fetch request object as well
  } catch (e) {
    console.error("Couldn't retrieve the IP from the headers");
  }
  const userAgent =
    /* special case of UC Browser */ getHeader(reqOrRequest, 'x-ucbrowser-ua') ??
    getHeader(reqOrRequest, 'user-agent') ??
    '';

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
  } satisfies IContext<_User_> as _Context_;
};
