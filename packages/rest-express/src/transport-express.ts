import AccountsError from '@accounts/error'
import { ConnectionInformations } from '@accounts/types'

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
			.post(`/${this.path}/:service/:provider?/:action`, this.useService)
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

  private useService = async ( req: Request, res: Response ) => {
    const target: any = req.params;
    const params: any = {
      ...(req.query || {}),
      ...(req.body || {})
    };
    const connectionInfo: ConnectionInformations = getConnectionInformations(req);
    try{
      const result: any = await this.accountsServer.useService(target, params, connectionInfo);
      res.json(result);
    } catch(err) {
      this.sendError(res, err)
    }
  }

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
  
}