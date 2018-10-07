import accountsBoost from '@accounts/boost';

(async () => {
  const accounts = await accountsBoost({
    tokenSecret: 'terrible secret',
    siteTitle: 'Accounts Example',
    siteUrl: 'http://localhost:3000',
  } as any);

  const accountsServer = await accounts.listen();
})();
