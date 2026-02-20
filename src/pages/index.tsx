import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { BarChart3, Lock, HeartPulse, Rocket, CircleFadingArrowUp, Ship, Cable, HandPlatter, Archive } from "lucide-react";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout

      title={`Typesense Kubernetes Operator Docs`}
      description="TyKO, your turnkey Typesense Kubernetes Operator">
      {/* HERO */}
      <section
        style={{
          padding: "3rem 0 1rem",
          background: "linear-gradient(180deg, var(--ifm-hero-background-color, #0f172a) 0%, var(--ifm-background-surface-color) 100%)",
          color: "var(--ifm-hero-text-color, #fff)",
        }}
      >
        <div className="container">
          <div className="row" style={{ alignItems: "center" }}>
            <div className="col col--7">
              <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem", lineHeight: 1.1 }}>
                TyKO
              </h1>
              <p style={{ fontSize: "1.15rem", opacity: 0.9, marginBottom: "1.25rem" }}>
                Your turnkey Typesense Kubernetes Operator<br />
                for highly available self-healing Typesense clusters
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link className="button button--primary button--lg" to="/docs/getting-started">
                  Get Started -{">"}
                </Link>
                <Link className="button button--secondary button--lg" to="https://github.com/akyriako/typesense-operator">
                  GitHub
                </Link>
              </div>
            </div>
            <style>{`
              @media (max-width: 932px) {
                .hero-inline-hide { display: none !important; maxWidth: "50%" }
              }
            `}</style>
            <div className="col col--5" style={{ textAlign: "center" }}>
              <img
                className="hero-inline-hide"
                src={useBaseUrl('/img/tyko-logo.png')}
                alt="TyKO Hero"
                style={{ maxWidth: "50%" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container" style={{ padding: "3.5rem 0 2rem" }}>
        <div className="row" style={{ rowGap: "1.5rem" }}>
          {features.map((f) => (
            <div key={f.title} className="col col--4">
              <div
                className="card"
                style={{ height: "100%", borderRadius: "1rem", boxShadow: "var(--ifm-global-shadow-lw)" }}
              >
                <div className="card__body">
                  <div style={{ fontSize: "2rem", lineHeight: 1, marginBottom: ".5rem" }}>{f.icon}</div>
                  <h3 style={{ margin: 0 }}>{f.title}</h3>
                  <p style={{ opacity: 0.85 }}>{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "2rem 0 3.5rem", background: "var(--ifm-background-color)" }}>
        <div className="container">
          <div className="row" style={{ marginBottom: "1rem" }}>
            <div className="col col--12" style={{ textAlign: "center" }}>
              <h2 style={{ marginBottom: ".25rem" }}>How it works</h2>
              <p style={{ opacity: 0.8 }}>Three simple steps to set up a highly available Typesense cluster</p>
            </div>
          </div>
          <div className="row" style={{ rowGap: "1rem" }}>
            {steps.map((s, i) => (
              <div key={s.title} className="col col--4">
                <div className="card" style={{ height: "100%", borderRadius: "1rem" }}>
                  <div className="card__body">
                    <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".25rem" }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 999,
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 700,
                          background: "var(--ifm-color-primary)",
                          color: "#fff",
                        }}
                        aria-hidden
                      >
                        {i + 1}
                      </div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{s.title}</h3>
                    </div>
                    <p style={{ opacity: 0.85, marginBottom: ".75rem" }}>{s.desc}</p>
                    <Link className="button button--sm button--primary" to={s.href}>
                      Learn more -{">"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER-LIKE LAST SECTION (Lucide-style, fixed colors) */}
      <section
        aria-label="Footer"
        style={{
          padding: "3rem 0",
          background: "var(--ifm-footer-background-color, #0b1220)",
          color: "var(--ifm-footer-text-color, var(--ifm-color-emphasis-800))",
          borderTop: "1px solid var(--ifm-toc-border-color)",
        }}
      >

        <div className="container">
          <div className="row" style={{ alignItems: "center" }}>
            <div className="col col--6">
              <small style={{ opacity: 0.8 }}>
                © 2024-{new Date().getFullYear()} {siteConfig.title}, GPL-3.0 Licensed
              </small>
            </div>
            <div className="col col--6" style={{ textAlign: "right" }}></div>
          </div>
        </div>
      </section>

    </Layout>
  );
}

const features = [
  {
    title: "Self-healing clusters",
    desc: "Automated failover, quorum recovery, and raft re-evaluation keep your Typesense clusters healthy without any manual intervention.",
    icon: <HeartPulse />,
  },
  {
    title: "Zero-downtime updates",
    desc: "Rolling updates with safe orchestration ensure you are always stay operational while you upgrade, downgrade or resize your Typesense clusters.",
    icon: <CircleFadingArrowUp />,
  },
  {
    title: "Batteries-included",
    desc: "StatefulSets, ConfigMaps, Secrets, Services, PodMetrics, HttpRoutes and many more, all managed for you.",
    icon: <Rocket />,
  },
  {
    title: "Ingress & Gateway APIs support",
    desc: "Expose Typesense securely using Kubernetes Ingress or the Gateway API. Integrates with Shared Gateways & TLS termination.",
    icon: <Cable />,
  },
  {
    title: "Observability",
    desc: "Expose Typesense nodes health status and metrics to Prometheus for monitoring and alerting purposes.",
    icon: <BarChart3 />,
  },
  {
    title: "Production-ready",
    desc: "Opinionated defaults for secure production-ready clusters and sane resource limits.",
    icon: <HandPlatter />,
  },
  {
    title: "S3-compatible storage support",
    desc: "Persist data on any S3-compatible object storage. Works with OBS, AWS S3, RustFS and many more for vendor-neutral storage.",
    icon: <Archive />,
  },
  {
    title: "Kubernetes-native",
    desc: "Built with Go & Operator SDK, following Kubernetes best-practices. Extend TyKO to your needs if you wish.",
    icon: <Ship />,
  },
] as const;

const steps = [
  {
    title: "Install the Operator",
    desc: "Add the Helm repo and install to your cluster.",
    href: "/docs/installation#deploy-using-helm",
  },
  {
    title: "Define your Cluster",
    desc: "Apply a single manifest with the version, size and storage you need.",
    href: "/docs/crds/crds-examples",
  },
  {
    title: "Let TyKO do the rest",
    desc: "TyKO provisions, configures, monitors and heals the cluster automatically.",
    href: "/docs/how-it-works/",
  },
] as const;
