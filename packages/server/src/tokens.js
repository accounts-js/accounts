// @flow
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateRandomToken = (length: number = 43) => crypto.randomBytes(length).toString('hex');

export const generateAccessToken = ({
  secret,
  data,
  config,
}: {
  secret: string,
  data?: mixed,
  config: Object
}) => jwt.sign({
  data,
}, secret, config);

export const generateRefreshToken = ({
  secret,
  data,
  config,
}: {
  secret: string,
  data?: mixed,
  config: Object
}) => jwt.sign({
  data,
}, secret, config);
