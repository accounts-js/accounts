import { AccountsModule } from './modules';

export default AccountsModule.forRoot({
  accountsServer: {
    getServices: () => ({
      password: {},
    }),
  } as any,
}).typeDefs;
