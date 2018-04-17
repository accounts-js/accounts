import { AccountsServer } from '@accounts/server';
import { Tokens, User } from '@accounts/types';
import { Request, Response, NextFunction } from 'express';
import * as requestIp from 'request-ip';
import 'express-session';
import { getUserAgent } from './utils/get-user-agent';

export interface AccountsSessionOptions {
  user: {
    name: string;
    resolve: (tokens: Tokens) => User | Promise<User>;
  };
  name?: string;
}

export class AccountsSession {
  constructor(private accountsServer: AccountsServer, private options: AccountsSessionOptions) {
    if (!this.options.name) {
      this.options.name = 'js-accounts-tokens';
    }
  }

  public middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await this.renew(req);

        const tokens = this.get(req);
        const user = await this.options.user.resolve(tokens);

        req[this.options.user.name] = user;

        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public async destroy(req?: Request, callback?: (err: any) => void): Promise<void> {
    req.session.destroy(async err => {
      const tokens = this.get(req);

      if (tokens && tokens.accessToken) {
        await this.accountsServer.logout(tokens.accessToken);
        await this.clear(req);
      }

      if (callback) {
        await callback(err);
      }
    });
  }

  public get(req?: Request): Tokens | undefined {
    if (!req) {
      return;
    }

    if (req.session && req.session[this.options.name]) {
      return req.session[this.options.name];
    }
  }

  public async renew(req: Request): Promise<Tokens | undefined> {
    const tokens = this.get(req);

    if (this.accountsServer && tokens && tokens.accessToken && tokens.refreshToken) {
      const result = await this.accountsServer.refreshTokens(
        tokens.accessToken,
        tokens.refreshToken,
        requestIp.getClientIp(req),
        getUserAgent(req)
      );

      this.set(req, result.tokens);

      return result.tokens;
    }
  }

  public set(req: Request, tokens: Tokens): void {
    if (!tokens) {
      this.clear(req);
      return;
    }

    if (req.session) {
      req.session[this.options.name] = tokens;
    }
  }

  public clear(req: Request): void {
    if (this.get(req)) {
      req.session[this.options.name] = null;
    }
  }
}
