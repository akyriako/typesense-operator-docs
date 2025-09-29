---
id: known-issues
title: Known Issues
sidebar_position: 3
---

# Known Issues

TyKO is just a Kubernetes Operator, neither a part of the Typesense server itself nor integrating with it in any way. It orchestrates the lifecycle of Typesense nodes, but it does not control their internal runtime behavior.

Because Typesense exposes only **very limited error information through its API**, some Typesense failure scenarios may be under-reported or ambiguous. As a result, TyKO *may* interpret these situations incorrectly. In certain cases, TyKO may classify a failure as a temporary state and wait for it to resolve automatically. However, the underlying issue may actually be a Typesense-level error that **cannot** self-heal.

## 173/ Rejecting 'term_unmatched AppendEntries'

### What happens

1. The pod is in a `Running` state (i.e. Kubernetes sees it as healthy), but internally Typesense logs show that it rejects replication from a peer. Despite that, Typesense, via the `/status` endpoint returns node status as `NOT_READY`:

    ```log
    node default_group:10.244.0.41:8107:8108 reject term_unmatched AppendEntries from 
    10.244.0.43:8107:8108 in term 916 prev_log_index 44809 prev_log_term 916 local_prev_log_term 915 
    last_log_index 44809 entries_size 0 from_append_entries_cache: 0
    ```

2. TyKO may see no alarming condition or obvious health signal, because the node state is not reporting `ERROR`, and considers the pods in a recovery or post-bootstrapping data loading phase, and waits for the pod to transition out of the `NOT_READY` state by its own. The operator sets the status of the corresponding TypesenseCluster as following:
   - **ConditionReady**: `false` and
   - **Reason**: `QuorumNotReadyWaitATerm`.

3. After some time, the operator may bring the pod back into quorum as a leader or follower, but once log replication resumes, the same error reappears and the cycle repeats.

This creates a loop that the affected pod cannot recover from, and TyKO lacks the visibility to intervene correctly. Other pods remain healthy, and as long as quorum is preserved, the Typesense cluster continues to operate normally.

Follow-up issue: https://github.com/akyriako/typesense-operator/issues/173

### Workaround

Manually restarting the pod **does not** resolve the problem. The only effective recovery is to delete the underlying PVC/PV, allowing the pod to rebuild its log from peers.

## 143/ Can’t truncate logs before applied_id

### What happens

1. A node enters a `CrashLoopBackOff` state due to an internal Typesense node failure to truncate logs. Typesense logs report:

    ```log
    typesense F20250613 09:10:49.139238 228 log_manager.cpp:310] Can't truncate logs before _applied_id=6937, last_log_kept=6935
    ```

2. Kubernetes sees a crash (pod repeatedly restarting), so TyKO will attempt to apply its mitigation actions.

3. But because the root-cause is an internal Typesense log replication error (inability to truncate), none of those operator actions can fix it. As a result, TyKO will continue *trying to recover* the node/cluster, while the node remains in a broken internal state.

Typesense, at the time being, does not expose sufficient API visibility for the operator to distinguish “cannot truncate logs” from a transient crash scenario.

### Workaround

Lowering `TYPESENSE_SNAPSHOT_INTERVAL_SECONDS` is **not** solving the problem. The pod will remain in a CrashLoopBackoff state **unless** manually terminated.

Follow-up issue: https://github.com/akyriako/typesense-operator/issues/143