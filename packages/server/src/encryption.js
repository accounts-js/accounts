import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const bcryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const hashPassword = (password, algorithm) => {
  const hash = crypto.createHash(algorithm);
  hash.update(password);
  return hash.digest('hex');
};

const verifyPassword = async (password, hash) => bcrypt.compare(password, hash);

export {
  bcryptPassword,
  hashPassword,
  verifyPassword,
};
