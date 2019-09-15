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
import nextCookie from 'next-cookies';
import Router from 'next/router';
function auth(ctx) {
  const { token } = nextCookie(ctx);

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

  return token;
}

const HomePage = props => (
  <Layout titleKey={'Shows'}>
    {/* <h1>Batman TV Shows</h1> */}
    <p>{props.token}</p>
    {/* <ul>
      {props.shows.map(show => (
        <li key={show.id}>
          <Link href="/p/[id]" as={`/p/${show.id}`}>
            <a>{show.name}</a>
          </Link>
        </li>
      ))}
    </ul> */}
  </Layout>
);

HomePage.getInitialProps = async function(ctx) {
  const token = auth(ctx);
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
    // shows: data.map(entry => entry.show),
  };
};

export default HomePage;
