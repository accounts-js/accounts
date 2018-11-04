import { servers } from './servers';

const user = {
  // TODO test with uppercase email
  email: 'johndoe@gmail.com',
  password: 'notSecure',
};
let userId: string;

Object.keys(servers).forEach(key => {
  const server = servers[key];
  describe(`${key} core`, () => {
    beforeAll(async () => {
      await server.start();
      userId = await server.accountsClientPassword.createUser({
        email: user.email,
        password: user.password,
      });
      await server.accountsClientPassword.login({
        user: {
          email: user.email,
        },
        password: user.password,
      });
    });

    describe('get user infos', () => {
      it('should get the user infos', async () => {
        const userInfos = await server.accountsClient.getUser();
        expect(userInfos.id).toBeTruthy();
        expect(userInfos.emails).toBeTruthy();
      });
    });

    describe('logout user', () => {
      it('should logout and not get the user infos', async () => {
        await server.accountsClient.logout();
        const userInfos = await server.accountsClient.getUser();
        expect(userInfos).toBeNull();
        await server.accountsClientPassword.login({
          user: {
            email: user.email,
          },
          password: user.password,
        });
      });
    });

    afterAll(async () => {
      await server.stop();
    });
  });
});
