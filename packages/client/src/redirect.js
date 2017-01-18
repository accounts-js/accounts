// eslint-disable-next-line import/no-named-as-default
import AccountsClient from './AccountsClient';

export default path => AccountsClient.options().history.push(path);
