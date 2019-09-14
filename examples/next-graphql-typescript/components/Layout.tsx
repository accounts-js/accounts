import React from 'react';
import Head from 'next/head';
// import useTranslation from '../hooks/useTranslation'
// import Navigation from './Navigation'

interface Props {
  titleKey: string;
}

const Layout: React.FC<Props> = ({ titleKey, children }) => {
  // const { t } = useTranslation()
  return (
    <>
      <Head>
        <title>Title</title>
      </Head>
      {/* <Navigation /> */}
      <>{children}</>
    </>
  );
};

export default Layout;
