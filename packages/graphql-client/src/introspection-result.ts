/* tslint:disable */

export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string;
      name: string;
      possibleTypes: {
        name: string;
      }[];
    }[];
  };
}

const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: 'UNION',
        name: 'LoginWithServiceResult',
        possibleTypes: [
          {
            name: 'LoginResult',
          },
          {
            name: 'MFALoginResult',
          },
        ],
      },
    ],
  },
};

export default result;
