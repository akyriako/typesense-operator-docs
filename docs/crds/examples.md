---
id: crds-examples
title: Examples
---

:::important
Before using any of these examples, make sure you adjust the value of `storageClassName` to one of your environment or cloud provider storage drivers options.
:::

## Bring Your Own Key

If you have an existing `TYPESENSE_API_KEY` you want to bootstrap your Typesense cluster with, you can provide it using an additional `Secret` and then set it with the `adminApiKey` parameter of the operator.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: typesense-common-bootstrap-key
type: Opaque
data:
  typesense-api-key: VGhpc0lzTm90QVNhZmVQYXNzd29yZA==
---
apiVersion: ts.opentelekomcloud.com/v1alpha1
kind: TypesenseCluster
metadata:
  name: tsc
spec:
  image: typesense/typesense:29.0
  replicas: 3
  storage:
    storageClassName: standard
  adminApiKey:
    name: typesense-common-bootstrap-key
```

## Additional Server Configuration

This is a way to customize your server beyond the built-in specs of the operator. It allows you to reference a `ConfigMap` that contains additional Typesense server configuration variables (expressed as environment variables prefixed by `TYPESENSE_`).

:::caution
Any configuration setting specified directly in the `TypesenseClusterSpec` (such as `apiPort`, `replicas`, etc.) takes precedence over **any** variables you’ve provided in the referenced `ConfigMap`. So if the same variable is defined in both places, **the operator-applied one wins**.
:::

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: additional-server-configuration
data:
  TYPESENSE_HEALTHY_READ_LAG: "6000"
  TYPESENSE_HEALTHY_WRITE_LAG: "2500"
---
apiVersion: ts.opentelekomcloud.com/v1alpha1
kind: TypesenseCluster
metadata:
  name: tsc
spec:
  image: typesense/typesense:29.0
  replicas: 3
  storage:
    storageClassName: standard
  additionalServerConfiguration:
    name: additional-server-configuration
```

:::info
For more information on using environment variables for Typesense consult the [official documentation](https://typesense.org/docs/29.0/api/server-configuration.html#using-environment-variables).
:::

## Scrapers

The `scrapers` field, in the TyKO CRD specs, lets you include documentation indexing directly in your cluster. It turns the Typesense DocSearch scraper into a managed `CronJob`, keeping your search index updated automatically, neatly integrated into your Typesense cluster's operational workflow.

### Public Docusaurus Site

```yaml
apiVersion: ts.opentelekomcloud.com/v1alpha1
kind: TypesenseCluster
metadata:
  name: tsc
spec:
  image: typesense/typesense:29.0
  replicas: 3
  storage:
    storageClassName: standard
  scrapers:
    - name: docusaurus-example-com
      image: typesense/docsearch-scraper:0.11.0
      config: "{\"index_name\":\"docuraurus-example\",\"start_urls\":[\"https://docusaurus.example.com/\"],\"sitemap_urls\":[\"https://docusaurus.example.com/sitemap.xml\"],\"sitemap_alternate_links\":true,\"stop_urls\":[\"/tests\"],\"selectors\":{\"lvl0\":{\"selector\":\"(//ul[contains(@class,'menu__list')]//a[contains(@class, 'menu__link menu__link--sublist menu__link--active')]/text() | //nav[contains(@class, 'navbar')]//a[contains(@class, 'navbar__link--active')]/text())[last()]\",\"type\":\"xpath\",\"global\":true,\"default_value\":\"Documentation\"},\"lvl1\":\"header h1\",\"lvl2\":\"article h2\",\"lvl3\":\"article h3\",\"lvl4\":\"article h4\",\"lvl5\":\"article h5, article td:first-child\",\"lvl6\":\"article h6\",\"text\":\"article p, article li, article td:last-child\"},\"strip_chars\":\" .,;:#\",\"custom_settings\":{\"separatorsToIndex\":\"_\",\"attributesForFaceting\":[\"language\",\"version\",\"type\",\"docusaurus_tag\"],\"attributesToRetrieve\":[\"hierarchy\",\"content\",\"anchor\",\"url\",\"url_without_anchor\",\"type\"]},\"conversation_id\":[\"833762294\"],\"nb_hits\":46250}"
      schedule: '*/2 * * * *'
```

:::info
For more information on configuring a DocSearch Scraper consult the [official documentation](https://typesense.org/docs/guide/docsearch.html#step-1-set-up-docsearch-scraper).
:::

### Docusaurus Behind Keycloak

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: scraper-auth-docusaurus-example-com
type: Opaque
data:
  KC_URL: VGhpc0lzTm90QVNhZmVQYXNzd29yZA==
  KC_REALM: VGhpc0lzTm90QVNhZmVQYXNzd29yZA==
  KC_CLIENT_ID: VGhpc0lzTm90QVNhZmVQYXNzd29yZA==
  KC_CLIENT_SECRET: VGhpc0lzTm90QVNhZmVQYXNzd29yZA==
---
apiVersion: ts.opentelekomcloud.com/v1alpha1
kind: TypesenseCluster
metadata:
  name: tsc
spec:
  image: typesense/typesense:29.0
  replicas: 3
  storage:
    storageClassName: standard
  scrapers:
    - name: docusaurus-example-com
      image: typesense/docsearch-scraper:0.11.0
      authConfiguration:
        name: scraper-auth-docusaurus-example-com
      config: "{\"index_name\":\"docuraurus-example\",\"start_urls\":[\"https://docusaurus.example.com/\"],\"sitemap_urls\":[\"https://docusaurus.example.com/sitemap.xml\"],\"sitemap_alternate_links\":true,\"stop_urls\":[\"/tests\"],\"selectors\":{\"lvl0\":{\"selector\":\"(//ul[contains(@class,'menu__list')]//a[contains(@class, 'menu__link menu__link--sublist menu__link--active')]/text() | //nav[contains(@class, 'navbar')]//a[contains(@class, 'navbar__link--active')]/text())[last()]\",\"type\":\"xpath\",\"global\":true,\"default_value\":\"Documentation\"},\"lvl1\":\"header h1\",\"lvl2\":\"article h2\",\"lvl3\":\"article h3\",\"lvl4\":\"article h4\",\"lvl5\":\"article h5, article td:first-child\",\"lvl6\":\"article h6\",\"text\":\"article p, article li, article td:last-child\"},\"strip_chars\":\" .,;:#\",\"custom_settings\":{\"separatorsToIndex\":\"_\",\"attributesForFaceting\":[\"language\",\"version\",\"type\",\"docusaurus_tag\"],\"attributesToRetrieve\":[\"hierarchy\",\"content\",\"anchor\",\"url\",\"url_without_anchor\",\"type\"]},\"conversation_id\":[\"833762294\"],\"nb_hits\":46250}"
      schedule: '*/2 * * * *'
```

:::info
For more information on configuring a DocSearch Scraper that is going to scrape content from a site that requires authentication consult the [official documentation](https://typesense.org/docs/guide/docsearch.html#authentication).
:::

## Ingress (Basic Example)

```yaml
apiVersion: ts.opentelekomcloud.com/v1alpha1
kind: TypesenseCluster
metadata:
  name: tsc
spec:
  image: typesense/typesense:29.0
  replicas: 3
  storage:
    storageClassName: standard
  enableCors: true
  corsDomains: "https://docs.example.com"
  ingress:
    host: search.example.com
    ingressClassName: nginx
    clusterIssuer: letsencrypt-issuer
```

:::important
To expose your Typesense cluster via an `Ingress`, certain prerequisites must already be present in your Kubernetes cluster:

:white_check_mark: You will need an ingress controller present (example is using [Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)). <br/>
:white_check_mark: You will need [cert-manager](https://cert-manager.io/) present and a `ClusterIssuer` installed (**not** a an `Issuer`). <br/>
:bulb: You might *optionally* need to add certain annotations depending on your cloud provider.

:::

## Metrics

```yaml
apiVersion: ts.opentelekomcloud.com/v1alpha1
kind: TypesenseCluster
metadata:
  name: tsc
spec:
  image: typesense/typesense:29.0
  replicas: 3
  storage:
    storageClassName: standard
  metrics:
    release: promstack
```

:::important
To expose your Typesense node metrics to Prometheus via a `PodMonitor` (one per node instance), [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/README.md) has to be present in the cluster.

For more information refer to [MetricsSpec](/docs/crds/index.md#metricsspec-optional).
:::
