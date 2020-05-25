export interface Session {
  id: string;
  userId: string;
  token: string;
  valid: boolean;
  userAgent?: string | null;
  ip?: string | null;
  createdAt: string;
  updatedAt: string;
}
