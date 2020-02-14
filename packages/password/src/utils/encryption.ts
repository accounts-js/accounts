import * as bcrypt from 'bcryptjs';
import { createHash } from 'crypto';

export const bcryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const hashPassword = (password: string, algorithm: string) => {
  const hash = createHash(algorithm);
  hash.update(password);
  return hash.digest('hex');
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> =>
  bcrypt.compare(password, hash);
