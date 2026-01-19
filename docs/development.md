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

:::info
No manager Pod will be created in your cluster. Remember, with `make run`, we are running the manager as a local process in our machine. As the controller needs to be able to access individual pods to probe their health status as quorum members, we resort internally to building the target URLs via [kube-proxy](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/) as of **v0.3.6**, dropping the external dependency to KubeVPN.
:::
