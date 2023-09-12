import AccountsServer from '@accounts/server';
import { IncomingMessage } from 'http';
import { getClientIp } from 'request-ip';
import { IContext, User } from '@accounts/types';
import { Application } from 'graphql-modules';

export interface AccountsContextOptions<Ctx extends object> {
  app: Application;
  ctx?: Ctx;
  headerName?: string;
  excludeAddUserInContext?: boolean;
}

export const context = async <IUser extends User = User, Ctx extends object = object>(
  {
    req,
  }: {
    req: IncomingMessage;
  },
  { app, ctx, ...options }: AccountsContextOptions<Ctx>
): AccountsContextOptions<Ctx> extends { ctx: any }
  ? Promise<IContext<IUser> & Ctx>
  : Promise<IContext<IUser>> => {
  // To inject the ExecutionContext into Providers which are called from the context
  const controller = app.createOperationController({
    context: { ...ctx },
    autoDestroy: true, // destroys the session when GraphQL Execution finishes
  });

  if (!req) {
    return {
      injector: controller.injector,
      ip: '',
      userAgent: '',
      infos: {
        ip: '',
        userAgent: '',
      },
      ...ctx,
    };
  }

  const headerName = options.headerName || 'Authorization';
  let authToken = (req.headers[headerName] || req.headers[headerName.toLowerCase()]) as string;
  authToken = authToken && authToken.replace('Bearer ', '');
  let user;

  if (authToken && !options.excludeAddUserInContext) {
    try {
      user = await controller.injector
        .get<AccountsServer<IUser>>(AccountsServer)
        .resumeSession(authToken);
    } catch (error) {
      // Empty catch
      console.error(error);
    }
  }

  const ip = getClientIp(req);
  let userAgent: string = (req.headers['user-agent'] as string) || '';
  if (req.headers['x-ucbrowser-ua']) {
    // special case of UC Browser
    userAgent = req.headers['x-ucbrowser-ua'] as string;
  }

  return {
    injector: controller.injector,
    authToken,
    user,
    userId: user && user.id,
    userAgent,
    ip,
    infos: {
      userAgent,
      ip,
    },
    ...ctx,
  };
};
