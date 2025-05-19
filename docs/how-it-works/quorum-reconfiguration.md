---
id: quorum-reconfiguration
title: Quorum (re)configuration
---

# Quorum (re)configuration

The Typesense Kubernetes Operator manages the **entire** lifecycle of Typesense Clusters within Kubernetes:

## TypesenseCluster Reconciliation Loop

### 1. Bootstrapping Admin API Key

A random token is generated and stored as a base64-encoded value in a new `Secret`. This token serves as the Admin API key for bootstrapping the Typesense cluster.

:::tip
You can alternatively provide your own `Secret` by setting the value of `adminApiKey` in `TypesenseCluster` specs; this will be used instead. The data key name has to be **always** `typesense-api-key`!

```yaml
apiVersion: v1
kind: Secret
metadata:
    name: typesense-common-bootstrap-key
    type: Opaque
data:
    typesense-api-key: SXdpVG9CcnFYTHZYeTJNMG1TS1hPaGt0dlFUY3VWUloxc1M5REtsRUNtMFFwQU93R1hoanVIVWJLQnE2ejdlSQ==
```

:::

### 2. Configuring Nodes List

A `ConfigMap`, named `NodesListConfigMap`, is created, containing the endpoints of the cluster nodes as a single concatenated string in its data field. During each reconciliation loop, the operator identifies any changes in endpoints and updates the `ConfigMap`. This `ConfigMap` is mounted in every `Pod` at the path where raft expects the quorum configuration, ensuring quorum configuration stays always updated. The endpoint of each `Pod` the headless service adheres to the following naming convention:  `{cluster-name}-sts-{pod-index}.{cluster-name}-sts-svc`.

:::important

- **This completely eliminates the need for a sidecar** to translate the endpoints of the headless Service into `Pod` IP addresses. The endpoints automatically resolves to the new IP addresses, and raft will begin contacting these endpoints within its 30-second polling interval.
- Be cautious while choosing the cluster name (`Spec.Name`) in `TypesenseCluster` specs, as raft expects the combined endpoint name and API and Peering ports (e.g. `{cluster-name}-sts-{pod-index}.{cluster-name}-sts-svc:8107:8108`) **not to exceed 64 characters in length**.

:::

### 3. Creating Services

The operator will create a headless `Service` required in the next steps for the `StatefulSet` that will support our Typesense cluster. Additionally a second service, of type `ClusterIP`, will be created and later be used to expose the REST/API endpoints of the Typesense cluster to external systems.

### 4. Creating a StatefulSet

A `StatefulSet` will be provisioned by the operator as next step of the reconciliation loop. The quorum configuration stored in the `NodesListConfigMap` is mounted as a volume in each `Pod` under `/usr/share/typesense/nodelist`. No `Pod` restart is necessary when the `NodesListConfigMap` data changes, as the operator constanly watches for changes and accordingly adjusts the contents of this file. Raft automatically detects and applies the updates.

### 5. Creating an Ingress

*Optionally*, an `nginx:alpine` workload is provisioned as a `Deployment` and exposed via an `Ingress`, in order to publish safely the Typesense REST/API endpoint outside the boundaries of your Kubernetes cluster, **only** to selected **referers**. The configuration of the nginx workload is stored in a `ConfigMap`.

### 6. Creating DocSearch scrapers

*Optionally*, one or more instances of **DocSearch** are deployed as distinct `CronJobs` (one per scraping target URL), which based on user-defined schedules, periodically scrape the target sites and store the results in Typesense.

### 7. Evaluating Quorum

The controller, in every reconciliation loop term, assesses the quorum's health by probing and collecting information about the state and the health of each member of the quorum (in our case for every `Pod` which represents a Typesense node). Based on the outcome, the controller devises an action plan for the next reconciliation loop. This process is detailed in the following section:
