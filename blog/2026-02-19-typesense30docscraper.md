---
slug: typesense30x-docscraper-compatibility
title: Typesense 30.x & DocSearch Scraper
authors: [akyriako]
tags: [announcement]
---

## Typesense 30.x & DocSearch Scraper Compatibility Issue

As of Typesense version `30.0`, breaking changes were introduced in the API for transferring the synonyms and curation sets that created a compatibility issue with DocSearch Scraper version prior to `0.12.0.rc14`. For that reason, it is advised to upgrade Typesense and DocSearch Scraper simultaneously if you are upgrading to Typesense 30.x+ from earlier major versions.

**Compatibility Matrix:**

| Typesense | DocSearch Scraper |
| --------- | ----------------- |
| 29.x      | 0.11.0            |
| 30.x+     | 0.12.0.rc14+      |

:::info
You can follow the related thread in the Typesense Slack channel [here](https://typesense-community.slack.com/archives/C01P749MET0/p1769523580405969) for more information.
:::

:::danger

TyKO `0.3.7` is the first version tested with Typesense 30.x+, therefore is the only version of the operator recommended for using in conjunction with Typesense `30.x+` **and** DocSearch Scraper `0.12.0.rc14+`.  
  
**Any earlier versions combinations might lead to undefined behavior and/or potential index corruption.**

:::
