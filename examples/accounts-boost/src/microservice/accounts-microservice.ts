import accountsBoost from '@accounts/boost';

(async () => {
  const accounts = await accountsBoost({
    tokenSecret: 'terrible secret',
  });

  const accountsServer = await accounts.listen();
})();
