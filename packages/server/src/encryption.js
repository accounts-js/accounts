import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export { hashPassword };

const shaPassword = password => {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  
  return hash.digest('hex');
}

const verifyPassword = async (password, hash) => bcrypt.compare(shaPassword(password), hash);

export { verifyPassword };
