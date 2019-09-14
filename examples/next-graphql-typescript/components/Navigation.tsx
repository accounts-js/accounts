import React from 'react';
import Link from 'next/link';
// import useTranslation from '../hooks/useTranslation'

const Navigation: React.FC = () => {
  // const Navigation = () => {
  // const t } = useTranslation()
  return (
    <ul className="root">
      <li>
        <Link href="" as={`/`}>
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/login" as={`/login`}>
          <a>Login</a>
        </Link>
      </li>
      <li>
        <Link href="/signup" as={`/signup`}>
          <a>Signup</a>
        </Link>
      </li>
      <li>
        <Link href="/reset-password" as={`/reset-password`}>
          <a>Reset Password</a>
        </Link>
      </li>
      <style jsx>{`
        .root {
          margin: 1rem 0 1rem 0;
          padding: 0;
          display: flex;
          list-style: none;
        }
        .root > li:not(:last-child) {
          margin-right: 1rem;
        }
        a:link,
        a:visited {
          text-decoration: none;
          color: navy;
          text-transform: uppercase;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </ul>
  );
};

export default Navigation;
