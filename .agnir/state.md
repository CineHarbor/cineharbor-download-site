# cineharbor-download-site Current State

CineHarbor 桌面发行下载站（纯静态）。P6 阶段迁入并改名。

- `index.html` / `assets/app.css` / `assets/app.js`：下载站页面（多语言、主题、发行列表）。
- `assets/releases.template.json`：发行数据模板，`repository` 指向 `CineHarbor/cineharbor-desktop`，由发布管线注入实际 releases。
- 发行页面聚合自 `CineHarbor/cineharbor-desktop` 的 GitHub Releases。
- 许可证：CC BY-NC-SA 4.0。
- Agnir 操作基线：`iorLab/agnir` 稳定发布 `v1.0.0`（revision `6d16dcfd17b8e9f22fd25804e22b9f8a516d06c3`，distribution `agnir-agent-skill`）；2026-09-01 经 Principal 授权完成兼容线迁移 Core `0.1` → `1.0`（经 0.2 lineage 迁移 + 稳定晋升）。
