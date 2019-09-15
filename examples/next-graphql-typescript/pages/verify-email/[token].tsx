import React from 'react';
import Layout from '../../components/Layout';
import VerifyEmail from "../../components/VerifyEmail"
import { useRouter } from 'next/router';
// import Home from '../../components/Home';

const VeifyEmailPage: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;
    return (
  <Layout titleKey="Cruceritis">
    {/* <Home /> */}
    <p>Token: {token}</p>;
    <VerifyEmail token={token} />
  </Layout>
    );
};

export default VeifyEmailPage;

// const HomePage = () => (
//   <Layout titleKey="Cruceritis">
//     <Home />
//   </Layout>
// );

// export default HomePage;

// const LoginPage: React.FC = () => {
//   return (
//     <Layout titleKey="Login">
//       <Login />
//     </Layout>
//   );
// };

// export default LoginPage;