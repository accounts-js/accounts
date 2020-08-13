import { AccountsModule } from './modules';

export default AccountsModule.forRoot({
  accountsServer: {
    getService: () => ({}),
  } as any,
}).typeDefs;
