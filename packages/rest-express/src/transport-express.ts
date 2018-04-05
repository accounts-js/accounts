import AccountsError from '@accounts/error'
import { ConnectionInformations, TokenTransport } from '@accounts/types'

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
  
  private tokenTransport: TokenTransport;


	constructor( config: Configuration ){

    this.path = config.path || 'accounts';
    
    this.tokenTransport = config.tokenTransport;

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
    const accessToken = this.tokenTransport.getAccessToken(req);
    if(!accessToken) { return next(); }
    try {
      const user = await this.accountsServer.resumeSession(accessToken);
      (req as any).user = user;
      (req as any).userId = user.id;
    } catch (e) {
      // Do nothing
    }
    next();
  }

  private sendError = (res: Response, err: any) => res.status(400).json({ message: err.message });

  private send = (res: Response, data: object) => {
    const bodyTokens = res.toSend || {};
    res.json({...bodyTokens, ...data})
  }

  private useService = async ( req: Request, res: Response ) => {
    const target: any = req.params;
    const params: any = {
      ...(req.query || {}),
      ...(req.body || {})
    };
    const connectionInfo: ConnectionInformations = getConnectionInformations(req);
    try{
      const { tokens, ...data }: any = await this.accountsServer.useService(target, params, connectionInfo);
      this.send(res, data)
    } catch(err) {
      this.sendError(res, err)
    }
  }

  private impersonate = async ( req: Request, res: Response ) => {
    try {
      const accessToken = this.tokenTransport.getAccessToken(req)
      const { username } = req.body;
      const { userAgent, ip } = getConnectionInformations(req)
      const { tokens, ...data } = await this.accountsServer.impersonate(accessToken, username, ip, userAgent);
      this.tokenTransport.setTokens(tokens, res);
      this.send(res, data)
    } catch (err) {
      this.sendError(res, err);
    }
  }

  private getUser = async ( req: Request, res: Response ) => {
    try {
      const accessToken = this.tokenTransport.getAccessToken(req)
      const user = await this.accountsServer.resumeSession(accessToken);
      this.send(res, user);
    } catch (err) {
      this.sendError(res, err);
    }
  }

  private refreshTokens = async ( req: Request, res: Response ) => {
    try {
      const { accessToken, refreshToken } = this.tokenTransport.getTokens(req)
      const { userAgent, ip } = getConnectionInformations(req)
      const refreshedSession = await this.accountsServer.refreshTokens(
        accessToken,
        refreshToken,
        ip,
        userAgent
      );
      const { tokens, ...data } = refreshedSession;
      this.tokenTransport.setTokens(tokens, res);
      this.send(res, data)
    } catch (err) {
      this.sendError(res, err);
    }
  };

  private logout = async ( req: Request, res: Response ) => {
    try {
      const accessToken = this.tokenTransport.getAccessToken(req)
      await this.accountsServer.logout(accessToken);
      this.tokenTransport.removeTokens(res);
      this.send(res, { message: 'Logged out' })
    } catch (err) {
      this.sendError(res, err);
    }
  };
  
}