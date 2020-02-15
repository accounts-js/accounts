import { genSalt, hash, compare } from 'bcryptjs';

export const bcryptPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> =>
  compare(password, hash);
