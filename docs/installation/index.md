---
id: installation
title: Installation
sidebar_position: 3
---

# Installation

:::note
You’ll need a Kubernetes cluster to run against. You can use [KIND](https://sigs.k8s.io/kind) to get a local cluster for testing, or run against a remote cluster. Note: Your controller will automatically use the current context in your **kubeconfig** file (i.e. whatever cluster `kubectl cluster-info` shows).
:::

## Deploy using Helm

If you are deploying on a production environment, it is highly recommended to deploy the controller to the cluster using a Helm chart from its repo:

```shell
helm repo add typesense-operator https://akyriako.github.io/typesense-operator/
helm repo update

helm upgrade --install typesense-operator typesense-operator/typesense-operator
```

:::tip
You can use the flags `-n <namespace> --create-namespace` to deploy the helm chart in the namespace of your choice other than `default`.
:::

## Deploy from sources

Build and push your image to the location specified by `IMG`:

```shell
make docker-build docker-push IMG=<some-registry>/typesense-operator:<tag>
```

Deploy the controller to the cluster with the image specified by `IMG`:

```shell
make deploy IMG=<some-registry>/typesense-operator:<tag>
```

:::note
You can alternatively set the `IMG` value in **Makefile**:

```makefile
...
# Set the Operator SDK version to use. By default, what is installed on the system is used.
# This is useful for CI or a project to utilize a specific version of the operator-sdk toolkit.
OPERATOR_SDK_VERSION ?= v1.38.0
# Image URL to use all building/pushing image targets
DOCKER_HUB_NAME ?= $(shell docker info | sed '/Username:/!d;s/.* //')
IMG_NAME ?= typesense-operator
IMG_TAG ?= 0.2.24
IMG ?= $(DOCKER_HUB_NAME)/$(IMG_NAME):$(IMG_TAG)
...
```

:::

## Deploy samples

Provision one of the samples available in **config/samples**:

| Suffix           | Description           | CSI Driver                                 | Storage Class         |
| ---------------- | --------------------- | ------------------------------------------ | --------------------- |
|                  | Generic               |                                            | standard              |
| azure            | Microsoft Azure       | disk.csi.azure.com                         | managed-csi           |
| aws              | AWS                   | ebs.csi.aws.com                            | gp2                   |
| opentelekomcloud | Open Telekom Cloud    | disk.csi.everest.io<br/>obs.csi.everest.io | csi-disk<br/>csi-obs  |
| gcp              | Google Cloud Platform | pd.csi.storage.gke.io                      | standard-rwo          |
| bm               | Bare Metal            | democratic-csi (iscsi/nfs)                 | iscsi<br/>nfs         |
| kind             | KIND                  |                                            | rancher.io/local-path |

```sh
kubectl apply -f config/samples/ts_v1alpha1_typesensecluster_{{Suffix}}.yaml
```

e.g. for Open Telekom Cloud it would look like:

```yaml title=ts_v1alpha1_typesensecluster_opentelekomcloud.yaml
apiVersion: v1
kind: Secret
metadata:
  name: typesense-bootstrap-key
type: Opaque
data:
  typesense-api-key: SXdpVG9CcnFYTHZYeTJNMG1TS1hPaGt0dlFUY3VWUloxc1M5REtsRUNtMFFwQU93R1hoanVIVWJLQnE2ejdlSQ==
---
apiVersion: ts.opentelekomcloud.com/v1alpha1
kind: TypesenseCluster
metadata:
  name: cluster-1
spec:
  image: typesense/typesense:27.1
  replicas: 3
  storage:
    size: 100Mi
    storageClassName: csi-disk
  ingress:
    host: ts.example.de
    ingressClassName: nginx
    clusterIssuer: opentelekomcloud-letsencrypt
  adminApiKey:
    name: typesense-common-bootstrap-key
  scrapers:
    - name: docusaurus-example-com
      image: typesense/docsearch-scraper:0.11.0
      config: "{\"index_name\":\"docusaurus-example\",\"start_urls\":[\"https://docusaurus.example.com/\"],\"sitemap_urls\":[\"https://docusaurus.example.com/sitemap.xml\"],\"sitemap_alternate_links\":true,\"stop_urls\":[\"/tests\"],\"selectors\":{\"lvl0\":{\"selector\":\"(//ul[contains(@class,'menu__list')]//a[contains(@class, 'menu__link menu__link--sublist menu__link--active')]/text() | //nav[contains(@class, 'navbar')]//a[contains(@class, 'navbar__link--active')]/text())[last()]\",\"type\":\"xpath\",\"global\":true,\"default_value\":\"Documentation\"},\"lvl1\":\"header h1\",\"lvl2\":\"article h2\",\"lvl3\":\"article h3\",\"lvl4\":\"article h4\",\"lvl5\":\"article h5, article td:first-child\",\"lvl6\":\"article h6\",\"text\":\"article p, article li, article td:last-child\"},\"strip_chars\":\" .,;:#\",\"custom_settings\":{\"separatorsToIndex\":\"_\",\"attributesForFaceting\":[\"language\",\"version\",\"type\",\"docusaurus_tag\"],\"attributesToRetrieve\":[\"hierarchy\",\"content\",\"anchor\",\"url\",\"url_without_anchor\",\"type\"]},\"conversation_id\":[\"833762294\"],\"nb_hits\":46250}"
      schedule: '*/2 * * * *'
```