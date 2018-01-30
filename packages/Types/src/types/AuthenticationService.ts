import { ConnectionInformations } from "./ConnectionInformations";


export interface AuthenticationService {

	name: string;

	useService( target: any, params: any, connectionInfos: ConnectionInformations) : any

	link( accountServer:any ):any

}

export interface AuthenticationServices {

	[ serviceName: string ]: AuthenticationService

}