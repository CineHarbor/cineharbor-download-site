# Download Site 1.0.0 version and deterministic repeat gate — 2026-09-19

Predecessor `28bbe839f9507887fbbb6003c29d2f1c405455b4` passed workflow runs `35418450602` (push) and `35431209116` (schedule).

Changes:
- package version `0.1.0` → `1.0.0`;
- add a main-push-only repeat job that runs after verify + deploy;
- before dispatch, resolve `refs/heads/main` and no-op if it moved;
- dispatch `download-site.yml` on unchanged main;
- workflow_dispatch runs never dispatch another run.

This supplies deterministic repeated verification without changing the deployment branch or making a Desktop release public. New PR/main observations are still required.
