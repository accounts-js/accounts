/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Multiple transports</>,
    // imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Since accounts-js is very flexible, it can be used with multiple transports. For now we
        provide packages for both <a href="/docs/transports/graphql">GraphQL</a> and{' '}
        <a href="/docs/transports/rest-express">REST</a>.
      </>
    ),
  },
  {
    title: <>Databases agnostic</>,
    // imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        We provide a native <a href="/docs/databases/mongo">mongo</a> integration which is
        compatible with the meteor account system. We also have a{' '}
        <a href="/docs/databases/typeorm">Typeorm</a> integration which will let you use accounts-js
        with any kind of databases.
      </>
    ),
  },
  {
    title: <>Strategies</>,
    // imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        You can use multiple strategies to let your users access to your app. For now we support
        authentication via <a href="/docs/strategies/password">email/username and password</a>,{' '}
        <a href="/docs/strategies/oauth">Oauth</a> support is coming soon!
      </>
    ),
  },
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Fullstack authentication and accounts-management for Javascript"
    >
      <header className={classnames('hero', styles.heroBanner)}>
        <div className="container">
          <img className={styles.heroImage} src="/img/logo.png" />
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--primary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/introduction')}
            >
              Get Started
            </Link>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={siteConfig.customFields.repoUrl}
              target="_blank"
            >
              Github
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={classnames(styles.features, styles.section)}>
            <div className="container">
              <h2 className={styles.homeTitle}>
                <span>Why accounts-js?</span>
              </h2>
              <div className="row">
                {features.map(({ imageUrl, title, description }, idx) => (
                  <div key={idx} className={classnames('col col--4', styles.feature)}>
                    {imageUrl && (
                      <div className="text--center">
                        <img
                          className={styles.featureImage}
                          src={useBaseUrl(imageUrl)}
                          alt={title}
                        />
                      </div>
                    )}
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <section className={classnames(styles.section, styles.support)}>
        <h2 className={styles.homeTitle}>
          <span>Open Collective</span>
        </h2>

        <div className={styles.supportSponsors}>
          <h3 className={styles.supportTitle}>Sponsors</h3>
          <div className={styles.supportButton}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to="https://opencollective.com/accounts-js#sponsors"
              target="_blank"
            >
              Become a Sponsor
            </Link>
          </div>
        </div>

        <h3 className={styles.supportTitle}>Backers</h3>
        <div className="supportImage">
          <Link to="https://opencollective.com/accounts-js#backers" target="_blank">
            <img src="https://opencollective.com/accounts-js/backers.svg?width=890&button=false" />
          </Link>
        </div>
        <div className={styles.supportButton}>
          <Link
            className={classnames(
              'button button--outline button--secondary button--lg',
              styles.getStarted
            )}
            to="https://opencollective.com/accounts-js#backers"
            target="_blank"
          >
            Become a Backer
          </Link>
        </div>
      </section>

      <section className={classnames(styles.section, styles.example)}>
        <h2 className={styles.homeTitle}>
          <span>Try the examples</span>
        </h2>

        <div className="container">
          <div className={classnames('row', styles.exampleRow)}>
            <div className={classnames('col col--3')}>
              <div className={classnames(styles.exampleCard)}>
                <div>
                  <svg className={classnames(styles.exampleCardLogoGraphQL)} viewBox="0 0 400 400">
                    <path fill="#E535AB" d="M57.468 302.66l-14.376-8.3 160.15-277.38 14.376 8.3z" />
                    <path fill="#E535AB" d="M39.8 272.2h320.3v16.6H39.8z" />
                    <path
                      fill="#E535AB"
                      d="M206.348 374.026l-160.21-92.5 8.3-14.376 160.21 92.5zM345.522 132.947l-160.21-92.5 8.3-14.376 160.21 92.5z"
                    />
                    <path fill="#E535AB" d="M54.482 132.883l-8.3-14.375 160.21-92.5 8.3 14.376z" />
                    <path
                      fill="#E535AB"
                      d="M342.568 302.663l-160.15-277.38 14.376-8.3 160.15 277.38zM52.5 107.5h16.6v185H52.5z"
                    />
                    <path fill="#E535AB" d="M330.9 107.5h16.6v185h-16.6z" />
                    <path fill="#E535AB" d="M203.522 367l-7.25-12.558 139.34-80.45 7.25 12.557z" />
                    <path
                      fill="#E535AB"
                      d="M369.5 297.9c-9.6 16.7-31 22.4-47.7 12.8-16.7-9.6-22.4-31-12.8-47.7 9.6-16.7 31-22.4 47.7-12.8 16.8 9.7 22.5 31 12.8 47.7M90.9 137c-9.6 16.7-31 22.4-47.7 12.8-16.7-9.6-22.4-31-12.8-47.7 9.6-16.7 31-22.4 47.7-12.8 16.7 9.7 22.4 31 12.8 47.7M30.5 297.9c-9.6-16.7-3.9-38 12.8-47.7 16.7-9.6 38-3.9 47.7 12.8 9.6 16.7 3.9 38-12.8 47.7-16.8 9.6-38.1 3.9-47.7-12.8M309.1 137c-9.6-16.7-3.9-38 12.8-47.7 16.7-9.6 38-3.9 47.7 12.8 9.6 16.7 3.9 38-12.8 47.7-16.7 9.6-38.1 3.9-47.7-12.8M200 395.8c-19.3 0-34.9-15.6-34.9-34.9 0-19.3 15.6-34.9 34.9-34.9 19.3 0 34.9 15.6 34.9 34.9 0 19.2-15.6 34.9-34.9 34.9M200 74c-19.3 0-34.9-15.6-34.9-34.9 0-19.3 15.6-34.9 34.9-34.9 19.3 0 34.9 15.6 34.9 34.9 0 19.3-15.6 34.9-34.9 34.9"
                    />
                  </svg>
                </div>
                <div>
                  <a
                    className={classnames(styles.exampleCardLink)}
                    href="https://github.com/accounts-js/accounts/tree/master/examples/graphql-server-typescript"
                    target="_blank"
                  >
                    GraphQL API
                  </a>
                  <a
                    className={classnames(styles.exampleCardLink)}
                    href="https://github.com/accounts-js/accounts/tree/master/examples/react-graphql-typescript"
                    target="_blank"
                  >
                    React client
                  </a>
                </div>
              </div>
            </div>
            <div className={classnames('col col--3')}>
              <div className={classnames(styles.exampleCard)}>
                <div>
                  <svg className={classnames(styles.exampleCardLogoExpress)} viewBox="0 0 128 128">
                    <path d="M40.53 77.82V50.74H42V55a5.57 5.57 0 00.48-.6 7.28 7.28 0 016.64-4.12c3.35-.1 6.07 1.14 7.67 4.12a13.24 13.24 0 01.32 12.14c-1.49 3.34-5.17 5-9.11 4.39a7.37 7.37 0 01-5.88-3.88v10.77zM42 60.32c.13 1.32.18 2.26.33 3.18.58 3.62 2.72 5.77 6.08 6.16A6.91 6.91 0 0056 65.27a11.77 11.77 0 00-.26-9.68 6.77 6.77 0 00-7.13-3.94 6.59 6.59 0 00-5.89 4.87 33.4 33.4 0 00-.72 3.8zM88.41 64a7.92 7.92 0 01-7.74 7c-6.16.31-9.05-3.78-9.51-8.5a13.62 13.62 0 011.2-7.5 8.37 8.37 0 018.71-4.67 8 8 0 017.1 6.09 41.09 41.09 0 01.69 4.5H72.67c-.3 4.28 2 7.72 5.26 8.55 4.06 1 7.53-.76 8.79-4.62.28-.99.79-1.13 1.69-.85zm-15.74-4.45h14.47c-.09-4.56-2.93-7.86-6.78-7.91-4.36-.07-7.5 3.11-7.69 7.91zM91.39 64.1h1.42a5.69 5.69 0 003.34 4.9 8.73 8.73 0 007.58-.2 3.41 3.41 0 002-3.35 3.09 3.09 0 00-2.08-3.09c-1.56-.58-3.22-.9-4.81-1.41A35.25 35.25 0 0194 59.18c-2.56-1.25-2.72-6.12.18-7.66a10.21 10.21 0 019.76-.15 5.14 5.14 0 012.6 5.24h-1.22c0-.06-.11-.11-.11-.17-.15-3.89-3.41-5.09-6.91-4.75a9.17 9.17 0 00-3 .91 3 3 0 00-1.74 3 3 3 0 002 2.82c1.54.56 3.15.92 4.73 1.36 1.27.35 2.59.58 3.82 1a4.51 4.51 0 013.1 4.07 4.81 4.81 0 01-2.59 5c-3.34 1.89-8.84 1.39-11.29-1a6.67 6.67 0 01-1.94-4.75zM125.21 56.61h-1.33c0-.18-.07-.34-.09-.49a4.35 4.35 0 00-3.54-4.18 8.73 8.73 0 00-5.61.27 3.41 3.41 0 00-2.47 3.25 3.14 3.14 0 002.4 3.16c2 .62 4.05 1 6.08 1.56a17 17 0 011.94.59 5 5 0 01.27 9.31 11.13 11.13 0 01-9 .09 6.24 6.24 0 01-3.76-6.06h1.3a7.29 7.29 0 0011.1 4.64 3.57 3.57 0 001.92-3.34 3.09 3.09 0 00-2.11-3.07c-1.56-.58-3.22-.89-4.81-1.4a35.43 35.43 0 01-4.87-1.75c-2.5-1.23-2.7-6.06.15-7.6a10.07 10.07 0 019.92-.11 5.23 5.23 0 012.51 5.13zM38.1 70.51a2.29 2.29 0 01-2.84-1.08c-1.63-2.44-3.43-4.77-5.16-7.15l-.75-1c-2.06 2.76-4.12 5.41-6 8.16a2.2 2.2 0 01-2.7 1.06l7.73-10.37-7.19-9.37a2.39 2.39 0 012.85 1c1.67 2.44 3.52 4.77 5.36 7.24 1.85-2.45 3.68-4.79 5.39-7.21a2.15 2.15 0 012.68-1l-2.79 3.7c-1.25 1.65-2.48 3.31-3.78 4.92a1 1 0 000 1.49c2.39 3.17 4.76 6.35 7.2 9.61zM70.92 50.66v1.4a7.25 7.25 0 00-7.72 7.49v11h-1.43V50.74h1.4v4.06c1.73-2.96 4.4-4.06 7.75-4.14zM2.13 60c.21-1 .34-2.09.63-3.11 1.73-6.15 8.78-8.71 13.63-4.9 2.84 2.23 3.55 5.39 3.41 8.95h-16c-.26 6.36 4.33 10.2 10.2 8.24a6.09 6.09 0 003.87-4.31c.31-1 .81-1.17 1.76-.88a8.12 8.12 0 01-3.88 5.93 9.4 9.4 0 01-10.95-1.4 9.85 9.85 0 01-2.46-5.78c0-.34-.13-.68-.2-1q-.01-.89-.01-1.74zm1.69-.43h14.47c-.09-4.61-3-7.88-6.88-7.91-4.32-.06-7.41 3.14-7.6 7.89z" />
                  </svg>
                </div>
                <div>
                  <a
                    className={classnames(styles.exampleCardLink)}
                    href="https://github.com/accounts-js/accounts/tree/master/examples/rest-express-typescript"
                    target="_blank"
                  >
                    Rest API
                  </a>
                  <a
                    className={classnames(styles.exampleCardLink)}
                    href="https://github.com/accounts-js/accounts/tree/master/examples/react-rest-typescript"
                    target="_blank"
                  >
                    React client
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Home;
