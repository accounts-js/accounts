import AccountsCommon from './AccountsCommon';
import createStore from './createStore';
import reducer from './module';

class AccountsClient extends AccountsCommon {
  // TODO Handle options
  constructor(options) {
    super(options);
    this.store = createStore({
      reducers: {
        accounts: reducer,
      },
    });
  }
  loggingIn() {

  }
  logout(func) {

  }
  logoutOtherClients(func) {

  }
}

export default AccountsClient;
