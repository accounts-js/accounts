// @flow
import jwt from 'jsonwebtoken';

export const generateAccessToken = ({
  secret,
  data,
  config,
}: {
  secret: string,
  data: mixed,
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
  data: mixed,
  config: Object
}) => jwt.sign({
  data,
}, secret, config);
