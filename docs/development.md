---
sidebar_position: 5
---

# Development

TyKO aims to follow the [Kubernetes Operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) pattern and is relying on [Operator SDK Framework](https://sdk.operatorframework.io/) for the undelying technical nuances and scaffolding. It uses [Controllers](https://kubernetes.io/docs/concepts/architecture/controller/), which provide a reconcile function responsible for synchronizing resources until the desired state is reached on the cluster. That said, contributing to or further developing TyKO, requires moderate experience in Golang & Kubernetes and basic exposure to concepts like operators, controllers, state reconcilition, custom resource definitions.

:::tip
For a deeper understanding of developing operators in Golang, you can consult either the [Quickstart for Go-based Operators](https://sdk.operatorframework.io/docs/building-operators/golang/quickstart/) of Operator SDK or the [Kubebuilder Book](https://book.kubebuilder.io/) (Operator SDK is using Kubebuilder under the bonnet).
:::

## Changing the CRDs

To extend the CRD, update the file **api/v1alpha1/typesensecluster_types.go**. Then, to apply your changes, run:

```shell
make generate && make manifests
```

## Installing the CRDs

After every change, you have to install or update the new schema of the CRDs in your target cluster. This can be accomplished by:

```shell
make install
```

## Running the Controller

You can run the controller, *out-of-cluster*, as a normal process in your development machine with:

```shell
make run
```

:::important
No manager Pod will be created in your cluster. Remember, we are running with `make run` the manager as a local process in our machine. As the controller needs to be able to access individual pods to probe their health status as quorum members we resort to building a VPN with our target cluster. Read more in [Debugging](#debugging)
:::

## Debugging using KubeVPN

When debugging from your IDE of choice (or running the controller out-of-cluster with `make run`) all health and status requests to individual pods will fail, as the node endpoints are not available to your development machine. For that matter, you will need to deploy [KubeVPN](https://github.com/KubeNetworks/kubevpn) in your environment. KubeVPN, offers a cloud-native development environment that connects to your Kubernetes cluster network. It facilitates the interception of inbound traffic from remote Kubernetes cluster services or pods to your local machine so you can access them using either their Kubernetes-internal FQDN or IP address.

:::info
For more information consult the [official documentation of KubeVPN](https://kubevpn.dev/).
:::

### Deploy Helm Chart

Deploy KubeVPN using the designated Helm Chart:

```bash
helm repo add kubevpn https://raw.githubusercontent.com/kubenetworks/kubevpn/master/charts
helm repo update

helm install kubevpn kubevpn/kubevpn -n kubevpn --create-namespace
```

### Deploy Client

```bash
brew install kubevpn
```

:::info
For additional deployment options, see [Install client on local PC](https://kubevpn.dev/docs/quickstart) in the official documentation.
:::

### Connect to Cluster

After deploying KubeVPN, create the VPN connection with your Kubernetes cluster with:

```shell
kubevpn connect
```

and you can disconnect any moment with:

```shell
kubevpn disconnect --all
```

:::warning
As of version **v2.9.5**, the KubeVPN experience can differ significantly depending on the operating system and Kubernetes distribution used:

:white_check_mark: Ubuntu 24.04 with K3s <br/>
:x: Ubuntu 24.04 with kind, `kubevpn-traffic-manager` **may** repeatedly crash due to `OOMKilled` errors <br/> 
:white_check_mark: Rocky 10 with K3s <br/>
:white_check_mark: Rocky 10 with kind <br/>
:white_check_mark: macOS 15 Sequoia with kind <br/>

:::
