import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Typesense Kubernetes Operator - TyKO">
      {/* HERO */}
      <section
        style={{
          padding: "6rem 0 3rem",
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
              <p style={{ fontSize: "1.3rem", opacity: 0.9, marginBottom: "1.25rem" }}>
                Your turnkey Typesense Kubernetes Operator
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link className="button button--primary button" to="/docs/get-started">
                  Get Started ->
                </Link>
                <Link className="button button--secondary button" to="https://github.com/akyriako/typesense-operator">
                  GitHub
                </Link>
              </div>
            </div>
            <div className="col col--5" style={{ textAlign: "right" }}>
              {/* Optional hero art: replace with your own static image in /static/img */}
              <img
                src="/img/hero.png"
                alt="TyKO Hero"
                style={{ maxWidth: "100%", borderRadius: "1rem", boxShadow: "0 10px 40px rgba(0,0,0,.2)" }}
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
              <p style={{ opacity: 0.8 }}>Three simple steps to a resilient Typesense cluster</p>
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
                      Learn more
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
          {/* Bottom bar */}
          <div className="row" style={{ alignItems: "center" }}>
            <div className="col col--6">
              <small style={{ opacity: 0.8 }}>
                © 2024-{new Date().getFullYear()} {siteConfig.title}, GPL-3.0 Licensed
              </small>
            </div>
            <div className="col col--6" style={{ textAlign: "right" }}>
              {/* <small style={{ opacity: 0.8 }}>
                Built with Docusaurus.
              </small> */}
            </div>
          </div>
        </div>
      </section>


    </Layout>
  );
}

const features = [
  {
    title: "Self‑healing clusters",
    desc: "Automated failover, quorum recovery, and node reconciliation keep your Typesense clusters healthy without manual babysitting.",
    icon: "🩹",
  },
  {
    title: "Zero‑downtime upgrades",
    desc: "Rolling updates with safe orchestration ensure your search stays online while you iterate.",
    icon: "⚙️",
  },
  {
    title: "Kubernetes‑native",
    desc: "CRDs and controllers built with Go & Operator SDK, following Kubernetes best‑practices.",
    icon: "☸️",
  },
  {
    title: "Batteries‑included",
    desc: "Ingress, Services, StatefulSets, config, secrets and metrics — managed for you.",
    icon: "🔋",
  },
  {
    title: "Observability",
    desc: "Expose Prometheus metrics for proactive alerts and dashboards.",
    icon: "📈",
  },
  {
    title: "Secure by default",
    desc: "Opinionated defaults for production‑ready clusters and sane resource limits.",
    icon: "🔐",
  },
] as const;

const steps = [
  {
    title: "Install the Operator",
    desc: "Add the Helm repo and install to your cluster.",
    href: "/docs/get-started",
  },
  {
    title: "Declare your Cluster",
    desc: "Apply a TypesenseCluster YAML with the size and storage you need.",
    href: "/docs/concepts/crd",
  },
  {
    title: "Let TyKO do the rest",
    desc: "TyKO provisions, configures, monitors and heals the cluster automatically.",
    href: "/docs/concepts/ha",
  },
] as const;
