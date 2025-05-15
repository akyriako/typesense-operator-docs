---
id: crds
title: CRDs
sidebar_position: 3
---

# CRDs

:::important
The operator is bundled with the Custom Resource Definitions(CRDs) and cannot be deployed separately. Updating the operator will automatically update the respective CRDs.
:::

## TypesenseCluster

Typesense Kubernetes Operator is controlling the lifecycle of multiple Typesense instances in the same Kubernetes cluster by introducing `TypesenseCluster`, a new Custom Resource Definition:

### TypesenseClusterSpec

| Name                          | Description                                                            | Optional | Default       |
|-------------------------------|------------------------------------------------------------------------|----------|---------------|
| image                         | Typesense image                                                        |          |               |
| adminApiKey                   | Reference to the `Secret` to be used for bootstrap                     | X        |               |
| replicas                      | Size of the cluster (allowed 1, 3, 5 or 7)                             |          | 3             |
| apiPort                       | REST/API port                                                          |          | 8108          |
| peeringPort                   | Peering port                                                           |          | 8107          |
| resetPeersOnError             | automatic reset of peers on error                                      |          | true          |
| enableCors                    | enables CORS                                                           | X        | false         |
| corsDomains                   | comma separated list of domains allowed for CORS                       | X        |               |
| resources                     | resource request & limit                                               | X        | _check specs_ |
| affinity                      | group of affinity scheduling rules                                     | X        |               |
| nodeSelector                  | node selection constraint                                              | X        |               |
| tolerations                   | schedule pods with matching taints                                     | X        |               |
| additionalServerConfiguration | a reference to a `ConfigMap` holding extra configuration      | X        |               |
| storage                       | check `StorageSpec` [below](#storagespec-optional)                                              |          |               |
| ingress                       | check `IngressSpec` [below](#ingressspec-optional)                                              | X        |               |
| scrapers                      | array of `DocSearchScraperSpec`; check below                           | X        |               |
| metrics                       | check `MetricsSpec` below                                              | X        |               |
| topologySpreadConstraints     | how to spread a  group of pods across topology domains                 | X        |               |
| incrementalQuorumRecovery     | add nodes gradually to the statefulset while recovering                | X        | false         |

:::note

* Add additional Typesense server configuration variables in a `ConfigMap`, using `additionalServerConfiguration` as described in: https://typesense.org/docs/28.0/api/server-configuration.html#using-environment-variables.
* Any Typesense server configuration variable that is defined in `TypesenseClusterSpec` is overriding any additional reference of the same variable in `additionalServerConfiguration`. You can find an example of providing an additional `NodesListConfigMap` in: **config/samples/ts_v1alpha1_typesensecluster_kind.yaml**.
* In heavy datasets is advised to set `incrementalQuorumRecovery` to `true` and let the controller reconstruct the quorum node by node. That will smooth the leader election process while new nodes are joining but it will make recovery process last longer.

:::

### StorageSpec (optional)

| Name             | Description                 | Optional | Default  |
|------------------|-----------------------------|----------|----------|
| size             | Size of the underlying `PV` | X        | 100Mi    |
| storageClassName | `StorageClass` to be used   |          | standard |

### IngressSpec (optional)

| Name               | Description                          | Optional | Default       |
|--------------------|--------------------------------------|----------|---------------|
| referer            | FQDN allowed to access reverse proxy | X        |               |
| HttpDirectives     | Nginx Proxy HttpDirectives           | X        |               |
| serverDirectives   | Nginx Proxy serverDirectives         | X        |               |
| locationDirectives | Nginx Proxy locationDirectives       | X        |               |
| host               | Ingress Host                         |          |               |
| clusterIssuer      | cert-manager `ClusterIssuer`         | X        |               |
| tlsSecretName      | TLS secret name to use               | X        |               |
| ingressClassName   | Ingress to be used                   |          |               |
| annotations        | User-Defined annotations             | X        |               |
| resources          | resource request & limit             | X        | _check specs_ |

:::note
This feature makes use of the existence of [cert-manager](https://cert-manager.io/) in the cluster, but **does not** actively enforce it with an error. If no clusterIssuer is specified a valid certificate must be stored in a secret and the secret name must be provided in the tlsSecretName config. 

If you are targeting [Open Telekom Cloud](https://www.open-telekom-cloud.com/en), you might be interested in provisioning additionally the designated DNS solver webhook for Open Telekom Cloud. You can find it [here](https://github.com/akyriako/cert-manager-webhook-opentelekomcloud).
:::

:::caution
Although in official Typesense documentation under *Production Best Practices* -> *Configuration* is stated:

"*Typesense comes built-in with a high performance HTTP server that is used by likes of Fastly in their edge servers at scale. So Typesense can be directly exposed to incoming public-facing internet traffic, without the need to place it behind another web server like Nginx/Apache or your backend API.*"

It is highly recommended, from this operator's perspective, to always expose Typesense behind a reverse proxy (using the `referer` option).
:::

### DocSearchScraperSpec (optional)

| Name              | Description                                          | Optional | Default |
|-------------------|------------------------------------------------------|----------|---------|
| name              | name of the scraper                                  |          |         |
| image             | container image to use                               |          |         |
| config            | config to use                                        |          |         |
| schedule          | cron expression; no timezone; no seconds             |          |         |
| authConfiguration | a reference to a `Secret` holding auth configuration | X        |         |

:::note
If you need to scrape a target that requires authentication, you can add the authentication configuration as environment variables via `authConfiguration`. In order to see which options are supported currently out of the box, consult the official documentation: https://typesense.org/docs/guide/docsearch.html#authentication
:::

### MetricsSpec (optional)

| Name      | Description                               | Optional | Default                                        |
|-----------|-------------------------------------------|----------|------------------------------------------------|
| image     | container image to use                    | X        | [akyriako78/typesense-prometheus-exporter](https://github.com/akyriako/typesense-prometheus-exporter):0.1.7 |
| release   | Prometheus release to become a target of  |          |                                                |
| interval  | interval in _seconds_ between two scrapes | X        | 15                                             |
| resources | resource request & limit                  | X        | _check specs_                                  |

:::tip
If you've provisioned Prometheus via **kube-prometheus-stack**, you can find the corresponding `release` value of your Prometheus instance by checking the labels of the operator pod e.g:

```shell
kubectl describe pod {kube-prometheus-stack-operator-pod} -n {kube-prometheus-stack-namespace}

name:             promstack-kube-prometheus-operator-755485dc68-dmkw2
Namespace:        monitoring
[...]
Labels:           app=kube-prometheus-stack-operator
app.kubernetes.io/component=prometheus-operator
app.kubernetes.io/instance=promstack
app.kubernetes.io/managed-by=Helm
app.kubernetes.io/name=kube-prometheus-stack-prometheus-operator
app.kubernetes.io/part-of=kube-prometheus-stack
app.kubernetes.io/version=67.8.0
chart=kube-prometheus-stack-67.8.0
heritage=Helm
pod-template-hash=755485dc68
release=promstack
[...]
```

:::

### TypesenseClusterStatus

| Name       | Description                                                                        |
|------------|------------------------------------------------------------------------------------|
| phase      | Typesense Cluster/Controller Operational Phase                                     |       
| conditions | `metav1.Condition`s related to the outcome of the reconciliation (see table below) | 

#### Conditions Summary

| Condition      | Value | Reason                     | Description                                                |
|----------------|-------|----------------------------|------------------------------------------------------------|
| ConditionReady | true  | QuorumReady                | Cluster is Operational                                     |
|                | false | QuorumNotReady             | Cluster is not Operational                                 |
|                | false | QuorumNotReadyWaitATerm    | Cluster is not Operational; Waits a Terms                  |
|                | false | QuorumDowngraded           | Cluster is not Operational; Scheduled to Single-Instance   |
|                | false | QuorumUpgraded             | Cluster is Operational; Scheduled to Original Size         |
|                | false | QuorumNeedsInterventionXXX | Cluster is not Operational; Administrative Action Required |
