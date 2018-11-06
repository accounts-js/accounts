import gql from 'graphql-tag';
import { IAccountsPasswordModuleConfig } from '..';

export default (config: IAccountsPasswordModuleConfig) => gql`
  ${config.extendTypeDefs ? 'extend' : ''} type ${config.rootQueryName || 'Query'} {
        twoFactorSecret: TwoFactorSecretKey
    }
`;
