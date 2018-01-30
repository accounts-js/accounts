import { HashAlgorithm } from "./HashAlgorithm";

export type Password =
	| string
	| {
			digest: string;
			algorithm: HashAlgorithm;
		};