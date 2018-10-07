export interface Service {
  name: string;
}

export interface AccountsOptions {
  siteUrl?: string;
  siteTitle?: string;
  services?: [Service];
}
