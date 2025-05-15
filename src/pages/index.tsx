import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

// function HomepageHeader() {
//   const {siteConfig} = useDocusaurusContext();
//   return (
//     <header className={clsx('hero hero--primary', styles.heroBanner)}>
//       <div className="container">
//         <Heading as="h1" className="hero__title">
//           {siteConfig.title}
//         </Heading>
//         <p className="hero__subtitle">{siteConfig.tagline}</p>
//         <div className={styles.buttons}>
//           <Link
//             className="button button--secondary button--lg"
//             to="/docs/getting-started">
//             Get Started ->
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }
function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const imgUrl = useBaseUrl('img/hero-banner.png');  // put your image at static/img/hero.jpg

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={styles.heroImageWrapper}>
        <img src={imgUrl} alt="Hero background" />
      </div>
      <div className="container">
        <Heading as="h1" className={clsx('hero__title', styles.heroCustomTitle)}>
          {siteConfig.title}
        </Heading>
        <p className={clsx('hero__subtitle',styles.heroCustomSubtitle)}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started">
            Get Started ->
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} Docs`}
      description="TyKO, your turnkey Typesense Kubernetes Operator <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
