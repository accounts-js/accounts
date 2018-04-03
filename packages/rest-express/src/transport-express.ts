import AccountsError from '@accounts/error'

import AccountsServer from '@accounts/server';

import { Configuration } from './types/configuration';

import { Router, Request, Response, NextFunction } from 'express';

import { getConnectionInformations } from './utils/get-connection-informations';

interface RequestWithSession extends Request {
  session: { [key: string]: any };
}

export default class TransportExpress {

	public router: Router;
  
	private accountsServer: AccountsServer;
	
	private path: string;
	

	constructor( config: Configuration ){

		this.path = config.path || 'accounts';

		this.router = Router({ mergeParams: true })
			.post(`/${this.path}/impersonate`, this.impersonate)
			.post(`/${this.path}/user`, this.getUser)
			.post(`/${this.path}/refreshTokens`, this.refreshTokens)
			.post(`/${this.path}/logout`, this.logout)
      .post(`/${this.path}/:service/:authenticate`, this.serviceAuthenticate)
      .post(`/${this.path}/password/register`, this.registerPassword)
      .post(`/${this.path}/password/verifyEmail`, this.verifyEmail)
      .post(`/${this.path}/password/resetPassword`, this.resetPassword)
      .post(`/${this.path}/password/sendVerificationEmail`, this.sendVerificationEmail)
      .post(`/${this.path}/password/sendResetPasswordEmail`, this.sendResetPasswordEmail)
      .post(`/${this.path}/password/twoFactorSecret`, this.userLoader, this.twoFactorSecret)
      .post(`/${this.path}/password/twoFactorSet`, this.userLoader, this.twoFactorSet)
      .post(`/${this.path}/password/twoFactorUnset`, this.userLoader, this.twoFactorUnset)
      .post(`/${this.path}/oauth/:provider/callback`, this.providerCallback)
			// .post(`/${this.path}/:service/:provider?/:action`, this.useService)
  }

  public link = (accountsServer) => {
    this.accountsServer = accountsServer;
    return accountsServer;
  }

  public userLoader = async ( req: Request, res: Response, next: NextFunction ) => {
    const accessToken = req.headers['accounts-access-token'] || req.body.accessToken || undefined
    if(accessToken == null || accessToken === false ) { return next(); }
    try {
      const user = await this.accountsServer.resumeSession(accessToken);
      (req as any).user = user;
      (req as any).userId = user.id;
    } catch (e) {
      // Do nothing
    }
    next();
  }

  private sendError = (res: Response, err: any) =>  res.status(400).json({ message: err.message });

  private impersonate = async ( req: Request, res: Response ) => {
    try {
      const { username, accessToken } = req.body;
      const { userAgent, ip } = getConnectionInformations(req)
      const impersonateRes = await this.accountsServer.impersonate(accessToken, username, ip, userAgent);
      res.json(impersonateRes);
    } catch (err) {
      this.sendError(res, err);
    }
  }

  private getUser = async ( req: Request, res: Response ) => {
    try {
      const { accessToken } = req.body;
      const user = await this.accountsServer.resumeSession(accessToken);
      res.json(user);
    } catch (err) {
      this.sendError(res, err);
    }
  }

  private refreshTokens = async ( req: Request, res: Response ) => {
    try {
      const { accessToken, refreshToken } = req.body;
      const { userAgent, ip } = getConnectionInformations(req)
      const refreshedSession = await this.accountsServer.refreshTokens(
        accessToken,
        refreshToken,
        ip,
        userAgent
      );
      res.json(refreshedSession);
    } catch (err) {
      this.sendError(res, err);
    }
  };

  private logout = async ( req: Request, res: Response ) => {
    try {
      const { accessToken } = req.body;
      await this.accountsServer.logout(accessToken);
      res.json({ message: 'Logged out' });
    } catch (err) {
      this.sendError(res, err);
    }
  };
  
  private serviceAuthenticate = async ( req: Request, res: Response ) => {
    try {
      const serviceName = req.params.service;
      const { userAgent, ip } = getConnectionInformations(req)
      const loggedInUser = await this.accountsServer.loginWithService(serviceName, req.body, {
        ip,
        userAgent,
      });
      res.json(loggedInUser);
    } catch (err) {
      this.sendError(res, err);
    }
  };


  // PASSWORD
  private registerPassword = async ( req: Request, res: Response ) => {
    try {
      const password: any = this.accountsServer.getServices().password;
      const userId = await password.createUser(req.body.user);
      res.json({ userId });
    } catch (err) {
      this.sendError(res, err);
    }
  };

  private resetPassword = async ( req: Request, res: Response ) => {
    try {
      const { token, newPassword } = req.body;
      const password: any = this.accountsServer.getServices().password;
      await password.resetPassword(token, newPassword);
      res.json({ message: 'Password changed' });
    } catch (err) {
      this.sendError(res, err);
    }
  };

  private sendResetPasswordEmail = async ( req: Request, res: Response ) => {
    try {
      const { email } = req.body;
      const password: any = this.accountsServer.getServices().password;
      await password.sendResetPasswordEmail(email);
      res.json({ message: 'Email sent' });
    } catch (err) {
      this.sendError(res, err);
    }
  };

  private verifyEmail = async ( req: Request, res: Response ) => {
    try {
      const { token } = req.body;
      const password: any = this.accountsServer.getServices().password;
      await password.verifyEmail(token);
      res.json({ message: 'Email verified' });
    } catch (err) {
      this.sendError(res, err);
    }
  };

  private sendVerificationEmail = async ( req: Request, res: Response ) => {
    try {
      const { email } = req.body;
      const password: any = this.accountsServer.getServices().password;
      await password.sendVerificationEmail(email);
      res.json({ message: 'Email sent' });
    } catch (err) {
      this.sendError(res, err);
    }
  };

  private  twoFactorSecret = async ( req: Request, res: Response ) => {
    try {
      const password: any = this.accountsServer.getServices().password;
      const secret = await password.twoFactor.getNewAuthSecret();
      res.json({ secret });
    } catch (err) {
      this.sendError(res, err);
    }
  };

  private twoFactorSet = async ( req: Request, res: Response ) => {
    try {
      if (!(req as any).userId) {
        res.status(401);
        res.json({ message: 'Unauthorized' });
        return;
      }
      const password: any = this.accountsServer.getServices().password;
      const secret = await password.twoFactor.set(
        (req as any).userId,
        req.body.secret,
        req.body.code
      );
      res.json({});
    } catch (err) {
      this.sendError(res, err);
    }
  };
  
  private twoFactorUnset = async ( req: Request, res: Response ) => {
    try {
      if (!(req as any).userId) {
        res.status(401);
        res.json({ message: 'Unauthorized' });
        return;
      }
      const password: any = this.accountsServer.getServices().password;
      const secret = await password.twoFactor.unset((req as any).userId, req.body.code);
      res.json({});
    } catch (err) {
      this.sendError(res, err);
    }
  };
  
  private providerCallback = async ( req: Request, res: Response ) => {
    try {
      const { userAgent, ip } = getConnectionInformations(req)
      const loggedInUser = await this.accountsServer.loginWithService(
        'oauth',
        {
          ...(req.params || {}),
          ...(req.query || {}),
          ...(req.body || {}),
          ...((req as RequestWithSession).session || {}),
        },
        { ip, userAgent }
      );
      // TODO : OAUTH HOOKS ON OAUTH PACKAGE
      res.json(loggedInUser);
    } catch (err) {
      this.sendError(res, err);
    }
  };
  
}