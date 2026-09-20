# cineharbor-download-site Current State

Target: **1.0.0 release-ready**, subject to the canonical facade scope. **RELEASE_READY=false; PUBLIC_RELEASE_EXECUTED=false.** Preparation does not authorize public 1.0.0 publication.

This repository builds the static site from actual public Desktop releases. The package is 1.0.0. The remaining upstream-derived desktopVersion 200.0.1 has been replaced with 1.0.0 preparation metadata; it does not populate the release feed. The preview template remains empty, and draft RCs are excluded. Public Desktop 0.1.0 remains the observed old-version baseline, not a claim that 1.0.0 assets exist.

The candidate adds explicit version/ownership, empty-preview and draft-exclusion regressions, and ignores only owned build output directories. Source 03ae12c252c3796c2751b1c335585ff8a76b8eec is the base. Local frozen-equivalent restored dependencies were hash verified; typecheck, Jest, 10 Node build/regression tests, static build and syntax checks passed. Require full PR CI and two complete main verification/deployment executions at the eventual exact SHA before certifying it.

The existing workflow exports actual public releases, publishes only gh-pages, and repeats a successful unchanged main once. A generated branch push is not proof of a served production site, real installer signatures or update acceptance.

See `.agnir/evidence/2026-09-20-version-identity.md`. Project urn:cineharbor:project:cineharbor-download-site; lineage urn:cineharbor:lineage:cineharbor-download-site; Agnir 1.0 / repository-filesystem/1.0, operations 1.0.2 and existing provenance unchanged. License CC-BY-NC-SA-4.0.
