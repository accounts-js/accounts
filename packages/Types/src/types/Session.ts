import { ConnectionInformations } from "./ConnectionInformations";


export interface Session {

  sessionId: string;

  userId: string;

  valid: boolean;

  connectionInfos: ConnectionInformations;

  createdAt: string;
  
  updatedAt: string;
}