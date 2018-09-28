import accountsBoost from '@accounts/boost';

(async () => {
  const accounts = await accountsBoost({
    tokenSecret: 'terrible secret',
  } as any);

  const accountsServer = await accounts.listen();
})();
