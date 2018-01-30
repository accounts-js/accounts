import { Tokens } from "./Tokens";
import { UserSafe } from "./UserSafe";

export interface LoginResult {
	
	sessionId: string;

	user: UserSafe;

	tokens: Tokens;
}