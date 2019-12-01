export interface CreateMfaChallenge {
  userId: string;
  authenticatorId?: string;
  token: string;
  scope?: 'associate';
}
