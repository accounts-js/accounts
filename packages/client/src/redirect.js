// @flow
// eslint-disable-next-line import/no-named-as-default
import AccountsClient from './AccountsClient';

// $FlowFixMe
export default (path: string) => AccountsClient.options().history.push(path);
