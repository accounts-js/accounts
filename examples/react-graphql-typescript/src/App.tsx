import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './utils/accounts';
import Router from './Router';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router />
    </ApolloProvider>
  );
}

export default App;
