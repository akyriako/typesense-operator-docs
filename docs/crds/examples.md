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

## Use S3-Compliant Storage as Persistent Volumes

As of **v0.3.6**, storage `accessMode` is introduced that supports `ReadWriteOnce` and `ReadWriteMany`, which means we can use local or remote S3-compliant object storage as the persistent store for the Typesense data volume.

### Prerequisites/Dependencies

* [JuiceFS CSI Driver](https://juicefs.com/docs/csi/introduction/)
* JuiceFS Storage Class
* Redis as JuiceFS metadata store
  
:::warning

1. When working with [Open Telekom Cloud Object Storage Service (OBS)](https://www.open-telekom-cloud.com/en/products-services/core-services/object-storage-service), [JuiceFS](https://juicefs.com/en/) and [Redis](https://redis.io/) **are not** required in order to mount S3 bucket in the Pods. The `everest-csi-provisioner` takes care the whole life-cycle of provisioning and mount bucket as volumes
via annotations. You can skip this section entirely.

2. When working with [Amazon S3](https://aws.amazon.com/s3/), [Redis](https://redis.io/) **is not** required, as Amazon S3 comes with is own metadata endpoints.
   
:::

#### Install the JuiceFS CSI Storage Driver

```bash
kubectl apply -f https://raw.githubusercontent.com/juicedata/juicefs-csi-driver/master/deploy/k8s.yaml
```

#### Install a Redis Cluster

```bash
kubectl create namespace redis
kubectl apply -f redis.yaml -n redis
```

```yaml title="redis.yaml"
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: redis
  labels:
    app: redis
spec:
  ports:
    - port: 6379
  clusterIP: None
  selector:
    app: redis
---
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-config
  namespace: redis
  labels:
    app: redis
data:
  master.conf: |
    maxmemory 1024mb
    maxmemory-policy allkeys-lru
    maxclients 20000
    timeout 300
    appendonly no
    dbfilename dump.rdb
    dir /data
  secondary.conf: |
    slaveof redis-0.redis.redis 6379
    maxmemory 1024mb
    maxmemory-policy allkeys-lru
    maxclients 20000
    timeout 300
    dir /data
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: redis
spec:
  serviceName: "redis-service"
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      initContainers:
      - name: init-redis
        image: redis:7.2.4
        command:
        - bash
        - "-c"
        - |
          set -ex
          # Generate redis server-id from pod ordinal index.
          [[ `hostname` =~ -([0-9]+)$ ]] || exit 1
          ordinal=${BASH_REMATCH[1]}
          # Copy appropriate redis config files from config-map to respective directories.
          if [[ $ordinal -eq 0 ]]; then
            cp /mnt/master.conf /etc/redis-config.conf
          else
            cp /mnt/slave.conf /etc/redis-config.conf
          fi
        volumeMounts:
        - name: redis-claim
          mountPath: /etc
        - name: config-map
          mountPath: /mnt/
      containers:
      - name: redis
        image: redis:7.2.4
        ports:
        - containerPort: 6379
          name: redis
        command:
          - redis-server
          - "/etc/redis-config.conf"
        volumeMounts:
        - name: redis-data
          mountPath: /data
        - name: redis-claim
          mountPath: /etc
      volumes:
      - name: config-map
        configMap:
          name: redis-config                  
  volumeClaimTemplates:
  - metadata:
      name: redis-claim
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
  - metadata:
      name: redis-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```

:::danger
This is by no means a production-ready Redis cluster nor a best-practice on how to deploy Redis on Kubernetes. It's just a quick spin of cluster in order to be able to work with JuiceFS.
:::

### Open Telekom Cloud OBS

If you are running on [Open Telekom Cloud](https://www.open-telekom-cloud.com/en), you can take advantage of the additional annotations field `csi.storage.k8s.io/fstype`
that controls how an S3 bucket is mounted into a Kubernetes pod.

- Using `csi.storage.k8s.io/fstype: s3fs` mounts an [SFS Turbo, Scalable File System](https://www.open-telekom-cloud.com/en/products-services/core-services/scalable-file-service) bucket using the S3-compatible API, 
which is useful when you want simple “filesystem-like” access but are okay with object-storage semantics that may not fully match POSIX behavior.
- Using the annotation `csi.storage.k8s.io/fstype: obsfs` mounts the bucket using the native OBS filesystem driver and is generally the more “OBS-native” approach;
it avoids some S3FS-specific limitations and is often preferred when you want better integration with OBS.

```yaml
apiVersion: ts.opentelekomcloud.com/v1alpha1
kind: TypesenseCluster
metadata:
  labels:
    app.kubernetes.io/name: typesense-operator
    app.kubernetes.io/managed-by: kustomize
  name: c-otc-3
spec:
  image: typesense/typesense:29.0
  replicas: 3
  storage:
    storageClassName: csi-obs
    accessMode: ReadWriteMany
    annotations:
      everest.io/obs-volume-type: STANDARD
      csi.storage.k8s.io/fstype: s3fs
      volume.beta.kubernetes.io/storage-provisioner: everest-csi-provisioner
      csi.storage.k8s.io/node-publish-secret-name: otc-aksk
      csi.storage.k8s.io/node-publish-secret-namespace: default
      everest.io/csi.volume-name-prefix: c-otc-3
```

:::note
One big advantage of using these annotations is that the respective S3 buckets will be provisioned dynamically by the CSI itself. 

For more information about configuring Open Telekom Cloud `StorageClass` consult
the [official documentation](https://docs.otc.t-systems.com/cloud-container-engine/umn/storage/storageclass.html).
:::

### Amazon Web Services S3

#### Create a JuiceFS Storage Class for AWS-S3

```bash
kubectl create namespace juicefs-system
kubectl apply -f juicefs-aws-sc.yaml -n juicefs-system
```

```yaml title="juicefs-aws-sc.yaml"
apiVersion: v1
kind: Secret
metadata:
  name: juicefs-aws-sc-secret
  namespace: juicefs-system
type: Opaque
stringData:
  name: "aws-s3-test"
  metaurl: "redis://<bucket>.0001.use1.cache.amazonaws.com/3"
  storage: "s3"
  bucket: "https://<bucket>.s3.us-east-1.amazonaws.com"
  access-key: "<access-key>"
  secret-key: "<secret-key>"
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: juicefs-aws-sc
provisioner: csi.juicefs.com
reclaimPolicy: Retain
volumeBindingMode: Immediate
parameters:
  csi.storage.k8s.io/node-publish-secret-name: juicefs-aws-sc-secret
  csi.storage.k8s.io/node-publish-secret-namespace: juicefs-system
  csi.storage.k8s.io/provisioner-secret-name: juicefs-aws-sc-secret
  csi.storage.k8s.io/provisioner-secret-namespace: juicefs-system
```


```bash
kubectl apply -f tsc.yaml
```

```yaml title="tsc.yaml"
apiVersion: ts.opentelekomcloud.com/v1alpha1
kind: TypesenseCluster
metadata:
  labels:
    app.kubernetes.io/name: typesense-operator
    app.kubernetes.io/managed-by: kustomize
  name: tsc
spec:
  image: typesense/typesense:29
  replicas: 3
  storage:
    size: 150Mi
    storageClassName: juicefs-aws-sc
    accessMode: ReadWriteMany
```

### Other (RustFS, SeaweedFS etc.)

#### Create a JuiceFS Storage Class for an S3-compliant service

```bash
kubectl create namespace juicefs-system
kubectl apply -f juicefs-sc.yaml -n juicefs-system
```

```yaml title="juicefs-sc.yaml"
apiVersion: v1
kind: Secret
metadata:
  name: juicefs-sc-secret
  namespace: juicefs-system
type: Opaque
stringData:
  name: "s3-test"
  metaurl: "redis://redis-service.redis:6379/1"
  storage: "s3"
  bucket: "https://<bucket-url>"
  access-key: "<access-key>"
  secret-key: "<secret-key>"
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: juicefs-sc
provisioner: csi.juicefs.com
reclaimPolicy: Retain
volumeBindingMode: Immediate
parameters:
  csi.storage.k8s.io/node-publish-secret-name: juicefs-sc-secret
  csi.storage.k8s.io/node-publish-secret-namespace: juicefs-system
  csi.storage.k8s.io/provisioner-secret-name: juicefs-sc-secret
  csi.storage.k8s.io/provisioner-secret-namespace: juicefs-system
```

```bash
kubectl apply -f tsc.yaml
```

```yaml title="tsc.yaml"
apiVersion: ts.opentelekomcloud.com/v1alpha1
kind: TypesenseCluster
metadata:
  labels:
    app.kubernetes.io/name: typesense-operator
    app.kubernetes.io/managed-by: kustomize
  name: tsc
spec:
  image: typesense/typesense:29
  replicas: 3
  storage:
    size: 150Mi
    storageClassName: juicefs-sc
    accessMode: ReadWriteMany
```

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

For more information refer to [MetricsSpec](/docs/crds/index.mdx#metricsspec-optional).
:::
