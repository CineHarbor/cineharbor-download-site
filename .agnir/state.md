# cineharbor-download-site Current State

CineHarbor 桌面发行下载站（纯静态）。P6 阶段迁入并改名。

- `index.html` / `assets/app.css` / `assets/app.js`：下载站页面（多语言、主题、发行列表）。
- `assets/releases.template.json`：发行数据模板，`repository` 指向 `CineHarbor/cineharbor-desktop`，由发布管线注入实际 releases。
- 发行页面聚合自 `CineHarbor/cineharbor-desktop` 的 GitHub Releases。
- 许可证：CC BY-NC-SA 4.0。
