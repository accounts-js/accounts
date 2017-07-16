import AccountsClient from './accounts-client';

export default (path: string) => AccountsClient.options().history.push(path);
