import { 
	AuthenticationService,
	AuthenticationServices, 
	ConnectionInformations,
	DatabaseInterface,
	ImpersonationResult,
	LoginResult,
	NotificationService,
	NotificationServices,
	Session,
	TokenManagerInterface,
	TokenPayload,
	Tokens,
	User,
	UserSafe,
} from 'accounts';

import { Configuration, ImpersonationAuthorize, ResumeSessionValidator } from "./types/Configuration";


import { omit } from 'lodash';



export default class AccountsServer {

	public databaseInterface: DatabaseInterface;

	public tokenManager: TokenManagerInterface;

	public transport: any;

	private authenticationServices: AuthenticationServices;
	
	private notificationServices: NotificationServices;
	

	private impersonationAuthorize?: ImpersonationAuthorize;

	private resumeSessionValidator?: ResumeSessionValidator;
	
	
	constructor( config: Configuration ){
		// Check configuration for errors
		this.checkconfig(config);
		
		this.impersonationAuthorize = config.impersonationAuthorize;
		this.resumeSessionValidator = config.resumeSessionValidator;

		// Link the databaseInterface to the AccountsServer
		this.databaseInterface = config.databaseInterface;

		// Link the tokenManager to the AccountsServer
		this.tokenManager = config.tokenManager;

		// Link the transport to the AccountsServer
		this.transport = config.transport.link(this)

		// Link Authentication Services to the AccountsServer
		this.authenticationServices = config.authenticationServices.reduce(
			( a: AuthenticationServices, authenticationService: AuthenticationService ) =>
			({ ...a, [authenticationService.name]: authenticationService.link(this) })
		,{})

			// Link Notification Services to the AccountsServer
		this.notificationServices = config.notificationServices.reduce(
			( a: NotificationServices, notificationService: NotificationService ) =>
			({ ...a, [notificationService.name]: notificationService })
		,{})
		
	}
	
	// => Check the configuration object passed to AccountsServer for Errors
	private checkconfig = ( config: Configuration ) : void => {

		if( !config.databaseInterface ) 
			throw new Error('[ Accounts - Server ] Init : A database interface is required');

		if( !config.authenticationServices ) 
			throw new Error('[ Accounts - Server ] Init : At least one Authentication Service is required');
		
	}

	// => Retrieve the specified NotificationService
	public useNotificationService = ( notificationServiceName: string ) => {

		const notificationService: NotificationService = this.notificationServices[notificationServiceName]

		if( !notificationService )
			throw new Error(`[ Accounts - Server ] useNotificationService : notificationService ${notificationServiceName} not found`);

		return notificationService

	}

	// => Access a specified AuthenticationService and execute a specified method
	public useService = ( target: any, params: any, connectionInfo: ConnectionInformations ) : any => {
		
		const { service, ...serviceParams } = target;

		const authenticationService: AuthenticationService = this.authenticationServices[ service ];

		if(!authenticationService) 
			throw new Error(`[ Accounts - Server ] useService : Service ${service} not found`);

		return authenticationService.useService( serviceParams, params, connectionInfo );
				
	}
	
	// => Create Session and Tokens for a specified DbUser
	public loginWithUser = async ( dbUser: User, connectionInfo: ConnectionInformations ) : Promise <LoginResult>  => {

		const sessionId: string = await this.databaseInterface.createSession(dbUser.id, connectionInfo);

		const tokens = {
			accessToken: this.tokenManager.generateAccess({ sessionId }),
			refreshToken: this.tokenManager.generateRefresh()
		}

		const user: UserSafe = this.sanitizeUser(dbUser);

		const loginResult: LoginResult = { user, sessionId, tokens };

		return loginResult;

	}
	
	// => Create Impersonation Session and Tokens
	public impersonate = async ( accessToken: string, username: string, connectionInfo: ConnectionInformations ) : Promise <ImpersonationResult> => {

		if (typeof accessToken !== 'string' ) 
			throw new Error('[ Accounts - Server ] Impersonate : An accessToken is required');
		// Decode the accessToken
		await this.tokenManager.decode(accessToken);
		// Retrieve the corresponding Session
		const session: Session = await this.findSessionByAccessToken(accessToken);

		if (!session.valid)	
			throw new Error('[ Accounts - Server ] Impersonate : Session is not valid for user')
		// Retrieve the impersonator from the session
		const dbUser: User = await this.databaseInterface.findUserById(session.userId);

		if (!dbUser) 
			throw new Error('[ Accounts - Server ] Impersonate : User not found')
		// Retrive the impersonatedUser from his username
		const impersonatedUser: User = await this.databaseInterface.findUserByUsername(username);

		if (!impersonatedUser) 
			throw new Error(`[ Accounts - Server ] Impersonate : User ${username} not found`)

		if (!this.impersonationAuthorize) return { authorized: false }
		// Check if the impersonator can impersonate the impersonatedUser
		const isAuthorized: boolean = await this.impersonationAuthorize( dbUser, impersonatedUser );

		if (!isAuthorized) return { authorized: false }
		// Create an impersonation session for the impersonator
		const newSessionId: string = await this.databaseInterface.createSession( impersonatedUser.id, connectionInfo, { impersonatorUserId: dbUser.id });
		// Create tokens for this impersonation session
		const impersonationTokens: Tokens = this.createTokens(newSessionId, true);
		// Sanitize the impersonated user
		const user: UserSafe = this.sanitizeUser(impersonatedUser);
		// Build the impersonation result
		const impersonationResult: ImpersonationResult = {
				authorized: true,
				tokens: impersonationTokens,
				user,
		};

		return impersonationResult;

	}
			
	// => Create Tokens for a Session
	public createTokens = ( sessionId: string, isImpersonated?: boolean ) : Tokens => {

		const accessToken: string = this.tokenManager.generateAccess({ sessionId, isImpersonated });

		const refreshToken: string = this.tokenManager.generateRefresh({ sessionId, isImpersonated });

		const tokens: Tokens = { accessToken, refreshToken }

		return tokens

	}

	public refreshTokens = async ( tokens: Tokens, connectionInfo: ConnectionInformations ) : Promise <LoginResult> => {

		const { accessToken, refreshToken } = tokens;

		if (!( typeof accessToken === "string" && typeof refreshToken === "string" ))
				throw new Error('[ Accounts - Server ] RefreshTokens : An accessToken and refreshToken are required')
		
		await this.tokenManager.decode(refreshToken);

		const { sessionId } : TokenPayload = await this.tokenManager.decode(accessToken);

		const session: Session = await this.databaseInterface.findSessionById(sessionId);

		if(!session) 
				throw new Error('[ Accounts - Server ] RefreshTokens : Session not found');

		if(!session.valid) 
				throw new Error('[ Accounts - Server ] RefreshTokens : Session is no longer valid')

		const user: User = await this.databaseInterface.findUserById(session.userId);

		if(!user) 
				throw new Error('[ Accounts - Server ] RefreshTokens : User not found');

		const newTokens: Tokens = this.createTokens(sessionId);

		await this.databaseInterface.updateSession(sessionId, connectionInfo);

		const loginResult: LoginResult = {
			sessionId, 
			tokens: newTokens,
			user: this.sanitizeUser(user),
		}

		return loginResult

	}
	
	
	public logout = async ( accessToken: string ) : Promise <void> => {

		const session: Session = await this.findSessionByAccessToken(accessToken);

		if(!session.valid) 
			throw new Error('[ Accounts - Server ] logout : Session is no longer valid');

		const dbUser: User = await this.databaseInterface.findUserById(session.userId);

		if (!dbUser) 
			throw new Error('[ Accounts - Server ] logout : User not found');

		await this.databaseInterface.invalidateSession(session.sessionId);

	}


	public resumeSession = async ( accessToken: string ) : Promise <UserSafe> => {

		const session: Session = await this.findSessionByAccessToken(accessToken);

		if(!session.valid) 
			throw new Error('[ Accounts - Server ] resumeSession : Session is no longer valid');

		const dbUser: User = await this.databaseInterface.findUserById(session.userId);

		if (!dbUser) 
			throw new Error('[ Accounts - Server ] resumeSession : User not found');

		if (this.resumeSessionValidator) await this.resumeSessionValidator(dbUser, session);

		const user: UserSafe = this.sanitizeUser(dbUser);

		return user;
	}


	public findSessionByAccessToken = async ( accessToken: string ) : Promise <Session> =>  {

		if (typeof accessToken !== 'string' ) 
			throw new Error('[ Accounts - Server ] findSessionByAccessToken : An accessToken is required');

		const decodedAccessToken: any = await this.tokenManager.decode(accessToken);

		const sessionId: string = decodedAccessToken.data.sessionId;

		const session: Session = await this.databaseInterface.findSessionById(sessionId);

		if(!session) 
			throw new Error('[ Accounts - Server ] findSessionByAccessToken : Session not found');

		return session;

	}

	public sanitizeUser = ( user: User ) : UserSafe => {

		const { services, ...usersafe } = user;

		return usersafe

	}

}