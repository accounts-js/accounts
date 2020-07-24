import React from 'react';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { accountsClient, accountsGraphQL } from './utils/accounts';

const GET_USER_QUERY = gql`
  query getUser {
    getUser {
      id
      username
      emails {
        address
        verified
      }
      firstName
      lastName
    }
  }
`;

const Home = ({ history }: RouteComponentProps<{}>) => {
  const { loading, error, data } = useQuery(GET_USER_QUERY);

  const onResendEmail = async () => {
    await accountsGraphQL.sendVerificationEmail(data.getUser.emails[0].address);
  };

  const onLogout = async () => {
    await accountsClient.logout();
    history.push('/login');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // If user is not logged in we redirect him to the login page
  if (!data.getUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Typography gutterBottom>Hello {data.getUser.username}</Typography>
      <Typography gutterBottom>You are logged in</Typography>
      <Typography gutterBottom>Email: {data.getUser.emails[0].address}</Typography>
      <Typography gutterBottom>First name: {data.getUser.firstName}</Typography>
      <Typography gutterBottom>Last name: {data.getUser.lastName}</Typography>
      <Typography gutterBottom>
        You email is {data.getUser.emails[0].verified ? 'verified' : 'unverified'}
      </Typography>
      {!data.getUser.emails[0].verified && (
        <Button onClick={onResendEmail}>Resend verification email</Button>
      )}

      <Link to="two-factor">Set up 2fa</Link>

      <Button variant="contained" color="primary" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Home;
