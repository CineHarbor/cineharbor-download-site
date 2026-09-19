# Standalone download-site build repair

Baseline: `dd7297aebfbd655a097878ad672d93865cb0637d`, inspected through verified source audit run `35417560069` / artifact `10576242656`. AGENTS/AGNIR/AGNIR.yaml and selected continuity were read. Project identity, lineage and historical decisions are preserved.

Observed defects: `scripts/build-download-site.mjs` used `cwd/download-site` and `cwd/download-site/assets/releases.template.json`, while static assets live at the repository root. It removed requested output before validating source/data, risking loss on mistaken paths. Export also preferred the workflow's own `GITHUB_REPOSITORY` over the intended Desktop repository when no explicit argument was passed.

Fixes: repository-relative source/default data; static-file-only copy; validated staged output; source/ancestor/symlink/ownership guards; explicit target repository precedence; request timeout; deployment restricted to gh-pages. CI now runs existing tests and new regressions before deployment. Current README and continuity describe the actual layout and distinguish branch publication from served-site verification.

Local evidence (Node v22.16.0): `node --test tests/node/*.test.mjs` passed 7/7 with zero skips. `node --check` passed for build/export scripts, and `bash -n` passed for the publisher. The initial new repository-validation regression exposed `../bad`; validation was corrected and the complete seven-test suite rerun successfully. Frozen dependency installation, existing Jest tests, remote CI, actual GitHub export and served production smoke remain separately required; none is claimed by this local checkpoint.
