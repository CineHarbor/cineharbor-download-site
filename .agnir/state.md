# cineharbor-download-site Current State

Target: CineHarbor **1.0.0**, release preparation in progress; **RELEASE_READY = false**. The seven-repository scope and gate rules are in the facade `docs/releases/1.0.0/`.

This repository is the static site root: `index.html`, `assets/app.css`, `assets/app.js` and the release-data template. It aggregates public releases from `CineHarbor/cineharbor-desktop`.

The migrated build script incorrectly required a nonexistent `download-site/` child directory and recursively removed arbitrary requested output before validating inputs. It now locates its own repository, copies only site files, validates release data first, stages output, and rejects source/ancestor/symlink/unowned output directories. Seven dependency-free Node regression tests passed locally, including invocation from another working directory and preservation of unrelated or previous output.

The exporter is repository-relative, gives the explicit release repository precedence, and bounds GitHub fetches. The publisher only targets `gh-pages` and omits local build ownership metadata. CI now requires frozen installation, typecheck, existing data/UI tests, build safety tests, syntax checks and a clean preview build before actual release-data export and deployment-branch publication. Remote CI, public download-link validation and served-site smoke are pending observed execution; workflow configuration is not a deployment success claim.

Project `urn:cineharbor:project:cineharbor-download-site`; lineage `urn:cineharbor:lineage:cineharbor-download-site`. Core/Profile 1.0 / repository-filesystem/1.0 and Agnir operations v1.0.2 at `b5626394ec40a5cb7a28c01892acde07cc0adc8e` remain unchanged. License: CC-BY-NC-SA-4.0. Historical initialization is committed; no initialization-to-submit prerequisite remains.
