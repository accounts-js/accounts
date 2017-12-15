import * as bcrypt from 'bcryptjs';


export const bcryptPassword = async ( password: string ): Promise <string> => {

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  return hash;

};