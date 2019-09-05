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
import withBaseUrl from '@docusaurus/withBaseUrl';
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
  console.log(siteConfig);
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
              to={withBaseUrl('docs/introduction')}
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
                          src={withBaseUrl(imageUrl)}
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
    </Layout>
  );
}

export default Home;
