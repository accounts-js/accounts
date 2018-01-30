import { HashAlgorithm } from "../types/HashAlgorithm";
import { Password } from "../types/Password";

import { bcryptPassword } from "./bcryptPassword";


export const getHashAndBcryptPassword = ( hashPasswordWithAlgorithm: Function ) => ( password: Password ) : Promise <string> => {

		const hashedPassword: string = hashPasswordWithAlgorithm( password );

		return bcryptPassword( hashedPassword )

}