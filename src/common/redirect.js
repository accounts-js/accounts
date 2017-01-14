// eslint-disable-next-line import/no-named-as-default
import AccountsClient from '../client/AccountsClient';

export default path => AccountsClient.options().history.push(path);
