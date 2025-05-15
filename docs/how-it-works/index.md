---
id: how-it-works
title: How it works
---

# How it works

[Typesense](https://typesense.org/) is using raft in the background to establish its clusters. Raft is a consensus algorithm based on the paper "[Raft: In Search of an Understandable Consensus Algorithm](https://raft.github.io/raft.pdf)".

Raft nodes operate in one of three possible states: **follower**, **candidate**, or **leader**. Every new node always joins the quorum as a follower. Followers can receive log entries from the leader and participate in voting for electing a leader. If no log entries are received for a specified period of time, a follower transitions to the candidate state. As a candidate, the node can accept votes from its peers nodes. Upon receiving a majority of votes, the candidate is becoming the leader of the quorum. The leader’s responsibilities include handling new log entries and replicating them to other nodes.

Another thing to consider is what happens when the node set changes, when nodes join or leave the cluster. If a quorum of nodes is **available**, raft can dynamically modify the node set without any issue (**this happens every 30sec**). But if the cluster cannot form a quorum, then problems start to appear or better to pile up. A cluster with N nodes can tolerate a failure of **at most** `(N-1)/2` nodes without losing its quorum. If the available nodes go below this threshold then two events are taking place:

- raft declares the whole cluster as unavailable (no leader can be elected, no more log entries can be processed)
- the remaining nodes are restarted in bootstrap mode
  
In a Kubernetes environment, the nodes are actually Pods which are rather volatile by nature and their lifetime is quite ephemeral and subjects to potential restarts, and that puts the whole concept of raft protocol consensus under a tough spot. As we can read in the official documentation of Typesense when it comes to [recovering a cluster that has lost quorum](https://typesense.org/docs/guide/high-availability.html#recovering-a-cluster-that-has-lost-quorum), it is explicitly stated:

"*If a Typesense cluster loses more than `(N-1)/2` nodes at the same time, the cluster becomes unstable because it loses quorum and the remaining node(s) cannot safely build consensus on which node is the leader. To avoid a potential split brain issue, **Typesense then stops accepting writes and reads until some manual verification and intervention is done**.*"

:::note
In production environments, manual intervention is sometimes impossible or undesirable, and downtime for a service like Typesense may be unacceptable. The Typesense Kubernetes Operator addresses both of these challenges.
:::
