import { AccountsModule } from './modules';

export default AccountsModule.forRoot({
  accountsServer: {
    getServices: () => ({
      password: {},
      token: {},
    }),
  } as any,
}).typeDefs;
