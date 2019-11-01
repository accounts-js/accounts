export interface CodeHash {
  hash(code: string): string;

  verify(code: string, hash: string): boolean;
}
