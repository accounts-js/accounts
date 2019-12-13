import { ConnectionInformations } from '../connection-informations';
import { Session } from './session';

export interface DatabaseInterfaceSessions {
  findSessionById(sessionId: string): Promise<Session | null>;

  findSessionByToken(token: string): Promise<Session | null>;

  createSession(
    userId: string,
    token: string,
    connection: ConnectionInformations,
    extraData?: object
  ): Promise<string>;

  updateSession(
    sessionId: string,
    connection: ConnectionInformations,
    newToken?: string
  ): Promise<void>;

  invalidateSession(sessionId: string): Promise<void>;

  invalidateAllSessions(userId: string): Promise<void>;
}
