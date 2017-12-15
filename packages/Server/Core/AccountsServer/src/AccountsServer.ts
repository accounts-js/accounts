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

import { AccountsServerConfiguration, ImpersonationAuthorize, ResumeSessionValidator } from "./types/AccountsServerConfiguration";


import { omit } from 'lodash';



export default class AccountsServer {
  
  public databaseInterface: DatabaseInterface;
  
	public tokenManager: TokenManagerInterface;

	public transport: any;

	private authenticationServices: AuthenticationServices;
	
	private notificationServices: NotificationServices;
  

	private impersonationAuthorize?: ImpersonationAuthorize;

	private resumeSessionValidator?: ResumeSessionValidator;
	
	
  constructor( config: AccountsServerConfiguration ){
  
    this.checkconfig(config);
		
		this.impersonationAuthorize = config.impersonationAuthorize;
		this.resumeSessionValidator = config.resumeSessionValidator;

		this.databaseInterface = config.databaseInterface;
		this.tokenManager = config.tokenManager;

		this.transport = config.transport.link(this)

		this.authenticationServices = config.authenticationServices.reduce(
      ( a: AuthenticationServices, authenticationService: AuthenticationService ) =>
    	({ ...a, [authenticationService.name]: authenticationService.link(this) })
		,{})

		this.notificationServices = config.notificationServices.reduce(
      ( a: NotificationServices, notificationService: NotificationService ) =>
    	({ ...a, [notificationService.name]: notificationService })
		,{})
		
	}
  
	private checkconfig = ( config: AccountsServerConfiguration ) : void => {

		if( !config.databaseInterface ) 
			throw new Error('[ Accounts - Server ] Init : A database interface is required');

		if( !config.authenticationServices ) 
			throw new Error('[ Accounts - Server ] Init : At least one Authentication Service is required');
		
	}

	public useNotificationService = ( notificationServiceName: string ) => {

		const notificationService: NotificationService = this.notificationServices[notificationServiceName]

		if( !notificationService ) 
			throw new Error(`[ Accounts - Server ] useNotificationService : notificationService ${notificationServiceName} not found`);

		return notificationService
	}


	public useService = ( target: any, params: any, connectionInfo: ConnectionInformations ) : any => {
		
		const { service, ...serviceParams } = target;

		const authenticationService: AuthenticationService = this.authenticationServices[ service ];

		if(!authenticationService) 
			throw new Error(`[ Accounts - AuthenticationManager ] useService : Service ${service} not found`);

		return authenticationService.useService( serviceParams, params, connectionInfo );
				
	}
  
  
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
  
	public impersonate = async ( accessToken: string, username: string, connectionInfo: ConnectionInformations ) : Promise <ImpersonationResult> => {

		if (typeof accessToken !== 'string' ) 
			throw new Error('[ Accounts - Server ] Impersonate : An accessToken is required');

		await this.tokenManager.decode(accessToken);

		const session: Session = await this.findSessionByAccessToken(accessToken);

		if (!session.valid) 
			throw new Error('Session is not valid for user')

		const dbUser: User = await this.databaseInterface.findUserById(session.userId);

		if (!dbUser) 
			throw new Error('User not found')

		const impersonatedUser: User = await this.databaseInterface.findUserByUsername(username);

		if (!impersonatedUser) 
			throw new Error(`User ${username} not found`)

		if (!this.impersonationAuthorize) return { authorized: false }

		const isAuthorized: boolean = await this.impersonationAuthorize( dbUser, impersonatedUser );

		if (!isAuthorized) return { authorized: false }

		const newSessionId: string = await this.databaseInterface.createSession( impersonatedUser.id, connectionInfo, { impersonatorUserId: dbUser.id });

		const impersonationTokens: Tokens = this.createTokens(newSessionId, true);

		const user: UserSafe = this.sanitizeUser(impersonatedUser);

		const impersonationResult: ImpersonationResult = {
				authorized: true,
				tokens: impersonationTokens,
				user,
		};

		return impersonationResult;

	}
      
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
				throw new Error('Session not found');

		if(!session.valid) 
				throw new Error('Session is no longer valid')

		const user: User = await this.databaseInterface.findUserById(session.userId);

		if(!user) 
				throw new Error('User not found');

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
			throw new Error('Session is no longer valid');

		const dbUser: User = await this.databaseInterface.findUserById(session.userId);

		if (!dbUser) 
			throw new Error('User not found');

		await this.databaseInterface.invalidateSession(session.sessionId);

	}
  
  
	public resumeSession = async ( accessToken: string ) : Promise <UserSafe> => {

		const session: Session = await this.findSessionByAccessToken(accessToken);

		if(!session.valid) 
			throw new Error('Session is no longer valid');

		const dbUser: User = await this.databaseInterface.findUserById(session.userId);

		if (!dbUser) 
			throw new Error('User not found');

		if (this.resumeSessionValidator) await this.resumeSessionValidator(dbUser, session);

		const user: UserSafe = this.sanitizeUser(dbUser);

		return user;
	}
  
  
	public findSessionByAccessToken = async ( accessToken: string ) : Promise <Session> =>  {

		if (typeof accessToken !== 'string' ) 
			throw new Error('An accessToken is required');

		const decodedAccessToken: any = await this.tokenManager.decode(accessToken);

		const sessionId: string = decodedAccessToken.data.sessionId;

		const session: Session = await this.databaseInterface.findSessionById(sessionId);

		if(!session) 
			throw new Error('Session not found');

		return session;

	}

	public sanitizeUser = ( user: User ) : UserSafe => {
		const { services, ...usersafe } = user;
		return usersafe
	}
  
      
  
}