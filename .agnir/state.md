# cineharbor-download-site Current State

Target: CineHarbor **1.0.0 public release**, with hard gates enforced. **RELEASE_READY = false; PUBLIC_RELEASE_EXECUTED = false.** The seven-repository scope and gate rules are in the facade `docs/releases/1.0.0/`.

This repository is the static download/release site and aggregates public releases from `CineHarbor/cineharbor-desktop`.

## Verified predecessor

Source `28bbe839f9507887fbbb6003c29d2f1c405455b4` passed the complete Download Site workflow twice: push run `35418450602` and scheduled run `35431209116`. Those executions included frozen install, typecheck, tests, build-safety regressions, syntax checks, static build, real public-release data export and gh-pages publication.

## 1.0.0 alignment and deterministic repeat

The release branch changes `package.json` version from `0.1.0` to `1.0.0`. The pnpm lock has no root-package version field and therefore needs no synthetic lock mutation.

The workflow also gains a bounded `repeat_verified_main` job: after a successful main push has completed both verification and gh-pages deployment, it verifies that main still equals `GITHUB_SHA` and dispatches exactly one clean `workflow_dispatch` run. Dispatch runs do not recursively dispatch. This makes the two-run final-revision gate deterministic instead of waiting for the daily schedule.

PR validation and two post-merge main executions are required for the new revision. Served-site smoke and final 1.0.0 asset/link validation remain separate release gates.

See `.agnir/evidence/2026-09-19-version-repeat-gate.md`.

Project `urn:cineharbor:project:cineharbor-download-site`; lineage `urn:cineharbor:lineage:cineharbor-download-site`. Core/Profile 1.0 / repository-filesystem/1.0 and Agnir operations v1.0.2 at `b5626394ec40a5cb7a28c01892acde07cc0adc8e` remain unchanged. License: CC-BY-NC-SA-4.0.
