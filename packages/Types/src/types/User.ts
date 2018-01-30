import { EmailRecord } from "./EmailRecord";

export interface User {

	username?: string;

	emails?: EmailRecord[];

	id: string;

	services?: object;
	
}