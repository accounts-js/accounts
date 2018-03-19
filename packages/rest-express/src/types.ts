import * as express from 'express';
import { LoginReturnType } from '@accounts/common';

export type OAuthSuccessCallback = (
  req: express.Request,
  res: express.Response,
  login: LoginReturnType
) => void;
export type OAuthErrorCallback = (req: express.Request, res: express.Response, error: any) => void;
export type TransformOAuthResponse<T = LoginReturnType> = (login: LoginReturnType) => T;

export interface AccountsExpressOptions {
  path?: string;
  onOAuthSuccess?: OAuthSuccessCallback;
  onOAuthError?: OAuthErrorCallback;
  transformOAuthResponse?: TransformOAuthResponse;
}
