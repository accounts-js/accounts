import gql from 'graphql-tag';
import { AccountsPasswordModuleConfig } from '..';

export default (config: AccountsPasswordModuleConfig) => gql`
  ${config.extendTypeDefs ? 'extend' : ''} type ${config.rootQueryName || 'Query'} {
        twoFactorSecret: TwoFactorSecretKey
    }
`;
