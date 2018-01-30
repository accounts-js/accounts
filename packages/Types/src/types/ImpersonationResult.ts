import { Tokens } from "./Tokens";
import { UserSafe } from "./UserSafe";

export interface ImpersonationResult {
	
	authorized: boolean;

	tokens?: Tokens;

	user?: UserSafe;

}