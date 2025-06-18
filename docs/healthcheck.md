---
sidebar_position: 3
---

# Health Check

Each Typesense node is deployed as a Kubernetes `Pod` and includes three containers:

1. **Typesense server** – the actual Typesense node.
2. **Metrics exporter** – a sidecar based on [typesense-prometheus-exporter](https://github.com/akyriako/typesense-prometheus-exporter) that exposes Prometheus-style metrics for each node via a `PodMonitor` resource.
3. **Cluster healthcheck** – a sidecar based on [typesense-healthcheck](https://github.com/akyriako/typesense-healthcheck) that aggregates the health of all nodes, offering a REST/JSON endpoint and a built-in web UI to monitor cluster and node status in real time.

The *typesense-healthcheck* sidecar aggregates and reports the health of all nodes in a Typesense cluster. It provides both Kubernetes-ready endpoints and a built-in web UI for real-time status visualization.

## REST Endpoints

* `/livez`: Simple liveness probe; returns `200 OK`.
* `/readyz`:Readiness probe; returns detailed JSON with overall cluster status and each node’s health. Returns `200 OK` when the cluster is 
  fully operation or `503 Service Unavailable` when the `cluster_health` is calculated as `false`. Example:

```json
{
    "cluster_status": "OK",
    "cluster_health": true,
    "nodes_health_check": {
        "c-kind-2-sts-0.c-kind-2-sts-svc": {
            "node_status": {
                "committed_index": 6813,
                "queued_writes": 0,
                "state": "FOLLOWER"
            },
            "node_health": {
                "ok": true
            }
        },
        "c-kind-2-sts-1.c-kind-2-sts-svc": {
            "node_status": {
                "committed_index": 6813,
                "queued_writes": 0,
                "state": "FOLLOWER"
            },
            "node_health": {
                "ok": true
            }
        },
        "c-kind-2-sts-2.c-kind-2-sts-svc": {
            "node_status": {
                "committed_index": 6813,
                "queued_writes": 0,
                "state": "FOLLOWER"
            },
            "node_health": {
                "ok": true
            }
        },
        "c-kind-2-sts-3.c-kind-2-sts-svc": {
            "node_status": {
                "committed_index": 6813,
                "queued_writes": 0,
                "state": "LEADER"
            },
            "node_health": {
                "ok": true
            }
        },
        "c-kind-2-sts-4.c-kind-2-sts-svc": {
            "node_status": {
                "committed_index": 6813,
                "queued_writes": 0,
                "state": "FOLLOWER"
            },
            "node_health": {
                "ok": true
            }
        },
        "c-kind-2-sts-5.c-kind-2-sts-svc": {
            "node_status": {
                "committed_index": 6813,
                "queued_writes": 0,
                "state": "FOLLOWER"
            },
            "node_health": {
                "ok": true
            }
        },
        "c-kind-2-sts-6.c-kind-2-sts-svc": {
            "node_status": {
                "committed_index": 6813,
                "queued_writes": 0,
                "state": "FOLLOWER"
            },
            "node_health": {
                "ok": true
            }
        }
    }
}
```

:::tip
You can configure external load balancers (e.g., AWS ALB or Open Telekom Cloud ELB) to probe the sidecar’s `/readyz` endpoint for continuous, real-time health checks of your cluster.
:::

## Web UI

The library ships with an interactive, single-page monitoring UI built on Vue.js and Vuetify. Its design and layout are inspired by the 
[podinfo](https://github.com/stefanprodan/podinfo) demo landing page. It provides:

* **Instant overview**: a clean dashboard that lists every node in your Typesense `StatefulSet`, showing key metrics (leader/follower/candidate state, committed index, queued writes) at a glance.
* **Auto-refresh**: the UI polls the `/readyz` endpoint every 3 seconds, ensuring you always see up-to-date cluster health without manual reloads.
* **Color-coded status**: each node’s health is highlighted with color-blind-friendly colors (light-green for healthy, pink for unhealthy), so you can spot issues immediately.
* **Responsive layout**: cards adapt across desktop and mobile, with Vuetify’s grid system ensuring your cluster view stays usable on any screen size.
* **Lightweight and self-contained**: extremely small memory footprint; just point your browser at `http://POD_IP_ADDRESS_OR_FQDN:HEALTHCHECK_PORT/` and dive right in.

![image1](/img/454372794-42db73c4-f175-4fb5-a862-ec83ace6ada7.png)


## Configuration

| Variable               | Type   | Default                      | Required | Description                                          |
| ---------------------- | ------ | ---------------------------- | -------- | ---------------------------------------------------- |
| LOG_LEVEL              | int    | `0`                          | No       | Log level                                            |
| CLUSTER_NAMESPACE      | string | `default`                    | No       | K8s namespace where your Typesense StatefulSet lives |
| TYPESENSE_API_KEY      | string | —                            | Yes      | API key for accessing each Typesense node            |
| TYPESENSE_PROTOCOL     | string | `http`                       | No       | Protocol for Typesense API (`http` or `https`)       |
| TYPESENSE_API_PORT     | uint   | `8108`                       | No       | Port for Typesense REST/API Port                     |
| TYPESENSE_PEERING_PORT | uint   | `8107`                       | No       | Port for Typesense Raft Peering Port                 |
| HEALTHCHECK_PORT       | uint   | `8808`                       | No       | Port on which this healthcheck sidecar listens       |
| TYPESENSE_NODES        | string | `/usr/share/typesense/nodes` | No       | Path for Typesense Raft nodes list                   |

:::note
All these values are automatically configured by the operator.

While this library is designed to run as a sidecar alongside your Typesense nodes provisioned by TyKO, you can point it at any cluster by mounting a file of node addresses and setting `TYPESENSE_NODES` accordingly.
:::