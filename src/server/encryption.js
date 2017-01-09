import bcrypt from 'bcryptjs';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export { hashPassword };

const verifyPassword = (password, hash) => bcrypt.compareSync(password, hash);

export { verifyPassword };
