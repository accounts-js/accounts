// import React from 'react';
// import Layout from '../components/Layout';
// import HomeSSR from '../components/HomeSSR';

// const HomePage = () => (
//   <Layout titleKey="Cruceritis">
//     <HomeSSR />
//   </Layout>
// );

// export default HomePage;
import Layout from '../components/Layout';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import cookies from 'next-cookies';
import Router from 'next/router';
import { accountsClient, accountsGraphQL } from '../utils/accounts';
import { EmailRecord } from '@accounts/types';
function auth(ctx) {
  const allCookies = cookies(ctx);
  // console.log(allCookies);
  const token = allCookies.accounts_accessToken;
  /*
   * If `ctx.req` is available it means we are on the server.
   * Additionally if there's no token it means the user is not logged in.
   */
  if (ctx.req && !token) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
  }

  // We already checked for server. This should only happen on client.
  if (!token) {
    Router.push('/login');
  }
  // const user = await accountsGraphQL.getUser();
  // const token = await user;
  // console.log(token);
  return token;
}

async function getUser(token) {
  const user = await accountsGraphQL.getUser();
  console.log(user);
  return user;
}
type User = {
  username: string;
  id: string;
  emails: EmailRecord[];
};
const HomePage = (props: { token: string; user: User; username: string }) => (
  <Layout titleKey={'Shows'}>
    {/* <h1>Batman TV Shows</h1> */}
    <div>{props.username}</div>
    <div>{props.token}</div>
  </Layout>
);

HomePage.getInitialProps = async function(ctx) {
  const token = auth(ctx);
  const user = await getUser(token);
  const username = await user.username;
  console.log(username);
  //  user.username;
  // if (user) {

  // }
  // await this.setState({ user });
  // const getUser = await getUser(token);
  // /*
  //  * If `ctx.req` is available it means we are on the server.
  //  * Additionally if there's no token it means the user is not logged in.
  //  */
  // if (ctx.req && !token) {
  //   ctx.res.writeHead(302, { Location: '/login' });
  //   ctx.res.end();
  // }
  // // We already checked for server. This should only happen on client.
  // if (!token) {
  //   Router.push('/login')
  // }
  // console.log({token});
  // const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
  // const data = await res.json();
  // console.log(`Show data fetched. Count: ${data.length}`);

  return {
    token: token,
    user: (await user) as User,
    // username: username,
  };
};

export default HomePage;
