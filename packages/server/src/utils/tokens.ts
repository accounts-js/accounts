import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

/**
 * Generate a random token string
 */
export const generateRandomToken = (length = 43): string => randomBytes(length).toString('hex');

export const generateAccessToken = ({
  secret,
  payload = {},
  config,
}: {
  secret: jwt.Secret;
  payload?: any;
  config: jwt.SignOptions;
}) => jwt.sign(payload, secret, config);

export const generateRefreshToken = ({
  secret,
  payload = {},
  config,
}: {
  secret: jwt.Secret;
  payload?: any;
  config: jwt.SignOptions;
}) => jwt.sign(payload, secret, config);
