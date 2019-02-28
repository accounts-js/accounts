/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl(img) {
  return siteConfig.baseUrl + 'img/' + img;
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a
          className={`button ${this.props.className || ''}`}
          href={this.props.href}
          target={this.props.target}
        >
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || '';
    return (
      <SplashContainer>
        <Logo img_src={imgUrl('logo.png')} />
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl('getting-started.html', language)} className="primary">
              Getting started
            </Button>
            <Button href={siteConfig.repoUrl}>Github</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Features = () => {
  return (
    <Container padding={['bottom', 'top']} className="grey features">
      <h2 className="homeTitle">
        <span>Why accounts-js?</span>
      </h2>

      <div className="gridBlock">
        <div className="blockElement alignCenter fourByGridBlock">
          <div className="blockContent">
            <h2>Multiple transports</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempor accumsan lectus,
              vitae cursus lorem aliquam et. Ut vulputate ligula eget nulla euismod, sit amet
              feugiat mi vestibulum. Ut aliquam luctus mi tristique consectetur.
            </p>
          </div>
        </div>
        <div className="blockElement alignCenter fourByGridBlock">
          <div className="blockContent">
            <h2>Databases agnostic</h2>
            <p>
              Integer ut sapien a ipsum posuere dignissim. Donec ac molestie est, vel posuere massa.
              Cras lorem felis, efficitur ac dui sit amet, ultrices finibus nisi. Duis dictum
              feugiat nisi sit amet venenatis. Cras iaculis dictum ex vel fringilla.
            </p>
          </div>
        </div>
        <div className="blockElement alignCenter fourByGridBlock">
          <div className="blockContent">
            <h2>Strategies</h2>
            <p>
              Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Nunc lobortis sit amet turpis ut pellentesque. In aliquet nec mauris ac luctus.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Bakers = () => (
  <Container padding={['bottom', 'top']} className="support">
    <h2 className="homeTitle">
      <span>Open Collective</span>
    </h2>

    <div className="supportSponsors">
      <h3 className="supportTitle">Sponsors</h3>
      {/*<div className="supportImage">
        <a href="https://opencollective.com/accounts-js#sponsors" target="_blank">
          <img src="https://opencollective.com/accounts-js/sponsors.svg?width=890&button=false" />
        </a>
</div>*/}
      <div className="supportButton">
        <Button href="https://opencollective.com/accounts-js#sponsors" className="primary">
          Become a Sponsor
        </Button>
      </div>
    </div>

    <h3 className="supportTitle">Backers</h3>
    <div className="supportImage">
      <a href="https://opencollective.com/accounts-js#backers" target="_blank">
        <img src="https://opencollective.com/accounts-js/backers.svg?width=890&button=false" />
      </a>
    </div>
    <div className="supportButton">
      <Button href="https://opencollective.com/accounts-js#backers" className="primary">
        Become a Backer
      </Button>
    </div>
  </Container>
);

class Index extends React.Component {
  render() {
    let language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          <Bakers />
        </div>
      </div>
    );
  }
}

module.exports = Index;
