
export interface TimeStamps {

	createdAt: string;

	updatedAt: string;

}

export interface UseMongoId {

	user: boolean;

	session: boolean;

}


export interface Configuration {

	userCollectionName?: string;

	sessionCollectionName?: string;

	idProvider?: () => string | object;

	dateProvider?: (date?: Date) => any;

	caseSensitiveUserName?: boolean;

	timestamps?: TimeStamps;

	useMongoId?: UseMongoId;
	
}