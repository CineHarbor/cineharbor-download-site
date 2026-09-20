# Download site version identity — 2026-09-20

Base main: `03ae12c252c3796c2751b1c335585ff8a76b8eec`; tree `1e758ddd2e4f31d613fb00597438ccd168322bf1`. Canonical identity and lineage are unchanged.

Observed defect: package version was 1.0.0 but desktop release preparation metadata still contained upstream version 200.0.1. Set desktopVersion to 1.0.0, preserve upstreamVersion as provenance and preserve canonical repository/main/updater-branch ownership. No public tag, installer, updater manifest or fake release feed is created.

Add three tests: version/ownership consistency; empty preview feed; draft 1.0.0 excluded while actual public 0.1.0 remains downloadable. Also ignore the two generated build directories, not source. Production export/build/deployment logic and all existing gates are unchanged.

Local verification: Node 22.16.0, pnpm 10.14.0; source lock byte-identical to the restored environment lock. Toolbox run 35418243801 artifact 10576925114 ZIP SHA256 `5f6d059bf13b1064f71e64f9f1276898beddfac40340e2933368a5f930bc4a48`; dependency tar SHA256 `bcb1c13ccfd237200fcfebd3548fcc6c7c0c0ba2b31803f7eca4fea1cc355f17`. Both were verified. Typecheck, all existing Jest tests, all 10 Node build/regression tests, static build, JavaScript/shell syntax and diff whitespace checks passed. Restoring the old metadata makes the new consistency test fail; the repaired value passes.

The old Desktop release was read through GitHub: release 378518356, desktop-v0.1.0, public since 2026-08-28. Asset/signature existence does not prove cryptographic verification or a successful installed upgrade.

Complete PR CI, two eventual main runs, actual served-site checks and final asset acceptance remain required. RELEASE_READY=false; PUBLIC_RELEASE_EXECUTED=false. No credentials or signing identities changed.
