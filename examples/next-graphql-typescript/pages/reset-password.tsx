import React from 'react';
import Layout from '../components/Layout';
import ResetPassword from '../components/ResetPassword';

const ResetPasswordPage: React.FC = () => {
  return (
    <Layout titleKey="resetPassword">
      <ResetPassword />
    </Layout>
  );
};

export default ResetPasswordPage;
