import gql from 'graphql-tag';

export const loginFieldsFragment = gql`
    fragment LoginFields on LoginReturn {
        tokens {
            refreshToken
            accessToken
        }
    }
  `;
