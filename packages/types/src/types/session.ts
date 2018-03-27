export interface Session {
  id: string;
  userId: string;
  token: string;
  valid: boolean;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}
