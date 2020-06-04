import { Session } from './session';
import { ConnectionInformations } from '../connection-informations';

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

  invalidateAllSessions(userId: string, excludedSessionIds?: string[]): Promise<void>;
}
