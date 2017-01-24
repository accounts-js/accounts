import bcrypt from 'bcryptjs';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export { hashPassword };

const verifyPassword = async (password, hash) => bcrypt.compare(password, hash);

export { verifyPassword };
