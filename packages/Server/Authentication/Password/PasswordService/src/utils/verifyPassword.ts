import * as bcrypt from 'bcryptjs';


export const verifyPassword = async ( password: string, hash: string ): Promise <boolean> => bcrypt.compare(password, hash);
