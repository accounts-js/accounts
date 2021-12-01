// eslint-disable-next-line @typescript-eslint/no-unused-vars
import session from 'express-session'; // Because of https://stackoverflow.com/a/51114250

declare module 'express-session' {
  interface SessionData {
    [key: string]: any;
  }
}
