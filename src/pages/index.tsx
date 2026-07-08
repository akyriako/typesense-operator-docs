import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from "@theme/Heading";

const FEATURES = [
  {
    title: 'Self-healing clusters',
    desc: 'Automated failover, quorum recovery, and raft re-evaluation keep your Typesense clusters healthy without any manual intervention.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: 'Zero-downtime updates',
    desc: 'Rolling updates with safe orchestration ensure you stay operational while you upgrade, downgrade, or resize your Typesense clusters.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    ),
  },
  {
    title: 'Batteries-included',
    desc: 'StatefulSets, ConfigMaps, Secrets, Services, PodMetrics, HttpRoutes and many more, all managed for you.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="16" height="10" rx="2" />
        <path d="M22 11v2M6 11v2M10 11v2" />
      </svg>
    ),
  },
  {
    title: 'Ingress & Gateway APIs',
    desc: 'Expose Typesense securely using Kubernetes Ingress or the Gateway API. Integrates with Shared Gateways & TLS termination.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h16M4 6h16M4 18h16" />
        <circle cx="7" cy="6" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="17" cy="18" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Observability',
    desc: 'Expose Typesense node health status and metrics to Prometheus for monitoring and alerting purposes.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 14l3-4 4 3 5-7" />
      </svg>
    ),
  },
  {
    title: 'Production-ready',
    desc: 'Opinionated defaults for secure production-ready clusters and sane resource limits.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'S3-compatible storage',
    desc: 'Persist data on any S3-compatible object storage. Works with OBS, AWS S3, RustFS and many more for vendor-neutral storage.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5" />
        <path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6" />
      </svg>
    ),
  },
  {
    title: 'Kubernetes-native',
    desc: 'Built with Go & Operator SDK, following Kubernetes best practices. Extend TyKO to your needs if you wish.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
        <path d="M12 22V12M21 7l-9 5-9-5" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Install the Operator',
    desc: 'Deploy TyKO with a single Helm command into your Kubernetes cluster.',
  },
  {
    n: '02',
    title: 'Declare a cluster',
    desc: 'Create a TypesenseCluster custom resource describing size, storage, and exposure.',
  },
  {
    n: '03',
    title: 'Let TyKO run it',
    desc: 'Sit back while TyKO handles quorum, failover, upgrades, and scaling automatically.',
  },
];

function Hero() {
  const logo = useBaseUrl('/img/tyko-logo.png');
  return (
    <header className="tyko-hero">
      <div className="tyko-hero__inner">
        <div>
          {/* <span className="tyko-hero__eyebrow">Typesense Kubernetes Operator</span> */}
          <h1 className="tyko-hero__title">
            Turnkey Typesense.<br />
            <span className="tyko-hero__title-accent">Self-healing on Kubernetes.</span>
          </h1>
          <p className="tyko-hero__subtitle">
            TyKO runs highly-available Typesense clusters for you — quorum recovery,
            rolling upgrades, and zero-downtime operations, all Kubernetes-native.
          </p>
          <div className="tyko-hero__cta">
            <Link className="button button--primary button--lg" to="/docs/getting-started">
              Get Started →
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="https://github.com/akyriako/typesense-operator">
              View on GitHub
            </Link>
          </div>
        </div>
        <div className="tyko-hero__logo">
          <img src={logo} alt="TyKO — Typesense Kubernetes Operator" />
        </div>
      </div>
    </header>
  );
}

function Features() {
  return (
    <section className="tyko-section">
      <div className="tyko-section__header">
        <div className="tyko-section__eyebrow">Why TyKO</div>
        <h2 className="tyko-section__title">Everything you need to run Typesense on Kubernetes</h2>
        <p className="tyko-section__desc">
          Built with the Operator SDK. <br />
          Opinionated where it matters, flexible where it counts.
        </p>
      </div>
      <div className="tyko-features">
        {FEATURES.map((f) => (
          <div key={f.title} className="tyko-feature">
            <div className="tyko-feature__icon">{f.icon}</div>
            <h3 className="tyko-feature__title">{f.title}</h3>
            <p className="tyko-feature__desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <div className="tyko-steps-wrap">
      <section className="tyko-section">
        <div className="tyko-section__header">
          <div className="tyko-section__eyebrow">How it works</div>
          <h2 className="tyko-section__title">From zero to HA in three steps</h2>
          <p className="tyko-section__desc">
            A highly-available Typesense cluster on Kubernetes, without the yak-shaving.
          </p>
        </div>
        <div className="tyko-steps">
          {STEPS.map((s) => (
            <div key={s.n} className="tyko-step">
              <div className="tyko-step__num">STEP {s.n}</div>
              <h3 className="tyko-step__title">{s.title}</h3>
              <p className="tyko-step__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function HomepageFooter(): JSX.Element {
  return (
    <footer className="tyko-home-footer">
      <div className="container">
        <p className="tyko-home-footer__copyright">
          © {new Date().getFullYear()} TyKO. Released under the GNU General Public Version 3.0
          License.
        </p>
        <p className="tyko-home-footer__links">
          <Link to="https://github.com/akyriako/typesense-operator">GitHub</Link>
          <span className="tyko-home-footer__divider" aria-hidden="true">
            ·
          </span>
          <Link to="https://github.com/akyriako/typesense-operator/issues">
            Issues
          </Link>
        </p>
      </div>
    </footer>
  );
}

function HomepageCta(): JSX.Element {
  return (
    <section className="tyko-section">
      <div className="container">
        <div className="tyko-cta">
          <Heading as="h2" className="tyko-cta__title">
            Ready to run Typesense on Kubernetes?
          </Heading>
          <p className="tyko-cta__desc">
            Deploy your first cluster in minutes.
          </p>
          <div className="tyko-cta__actions">
            <Link
              className="button button--lg button--primary"
              to="/docs/getting-started"
            >
              Read the docs
            </Link>
            <Link
              className="button button--tertiary button--lg"
              to="https://github.com/akyriako/typesense-operator"
            >
              Star on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="TyKO — the turnkey Typesense Kubernetes Operator for highly available, self-healing Typesense clusters.">
      <Hero />
      <main>
        <Features />
        <HowItWorks />
        <HomepageCta />
      </main>
      <HomepageFooter />

    </Layout>
  );
}