import { type AccountsServer } from '@accounts/server';
import { type Tokens, type User, type LoginResult } from '@accounts/types';
import { type Request, type Response, type NextFunction } from 'express';
import { getClientIp } from 'request-ip';
import { merge } from 'lodash';
import 'express-session';
import { getUserAgent } from './utils/get-user-agent';

export interface AccountsSessionOptions {
  user?: {
    name: string;
    resolve?: (tokens: Tokens, request: Request, rawUser?: User) => User | Promise<User>;
  };
  name?: string;
}

export class AccountsSession {
  private options: Required<AccountsSessionOptions>;

  constructor(
    private accountsServer: AccountsServer,
    options?: AccountsSessionOptions
  ) {
    this.options = merge(
      {
        name: 'accounts-js-tokens',
        user: {
          name: 'user',
          resolve: null,
        },
      },
      options
    );
  }

  public middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const tokenResult = await this.renew(req);
        const tokens = this.get(req);

        if (tokens) {
          const user = this.options.user.resolve
            ? await this.options.user.resolve(tokens, req, tokenResult?.user)
            : tokenResult?.user;

          // eslint-disable-next-line
          // @ts-ignore
          req[this.options.user.name] = user;
        }

        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public async destroy(req: Request): Promise<void> {
    const tokens = this.get(req);

    if (tokens && tokens.accessToken) {
      await this.accountsServer.logout(tokens.accessToken);
      await this.clear(req);
    }

    return new Promise<void>((resolve, reject) => {
      req.session!.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
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

  public async renew(req: Request): Promise<LoginResult | undefined> {
    const tokens = this.get(req);

    if (this.accountsServer && tokens && tokens.accessToken && tokens.refreshToken) {
      const result = await this.accountsServer.refreshTokens(
        tokens.accessToken,
        tokens.refreshToken,
        { ip: getClientIp(req), userAgent: getUserAgent(req) }
      );

      this.set(req, result.tokens);

      return result;
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
      req.session![this.options.name] = null;
    }
  }
}

export default AccountsSession;
