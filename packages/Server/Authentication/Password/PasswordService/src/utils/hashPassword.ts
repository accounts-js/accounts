import { Password } from '../types/Password';

import * as crypto from 'crypto';


export const getHashPassword = ( algorithm: string ) => ( password: Password ) => {

    if (typeof password !== 'string') return password.digest;

    const hash = crypto.createHash(algorithm);

    hash.update(password);

    return hash.digest('hex');
    
}
