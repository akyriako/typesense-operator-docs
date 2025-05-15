import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Deploy and forget',
    Svg: require('@site/static/img/undraw_search-app_cpm0.svg').default,
    description: (
      <>
        Deploy highly-available Typesense clusters on Kubernetes,
        with just a single manifest. Let TyKO take care of the rest.
      </>
    ),
  },
  {
    title: 'Self-healing',
    Svg: require('@site/static/img/undraw_location-search_nesh.svg').default,
    description: (
      <>
        Never worry again about raft intricancies and quorum losses. TyKO makes sure your clusters
        are always up and running.
      </>
    ),
  },
  {
    title: 'Powered by Go & Operator SDK',
    Svg: require('@site/static/img/undraw_public-discussion_693m.svg').default,
    description: (
      <>
        Extend TyKO to your needs if you wish. Open-sourced, built with Go and Operator SDK, community-driven.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
