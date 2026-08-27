# cineharbor-download-site

CineHarbor 桌面发行下载站（纯静态）。P6 阶段从旧项目迁入并改名。

## 内容

- `index.html` / `assets/app.css` / `assets/app.js` —— 下载站页面（多语言、主题、发行列表）
- `assets/releases.template.json` —— 发行数据模板，`repository` 指向 `CineHarbor/cineharbor-desktop`，由发布管线注入实际 releases 数据

## 发布源

发行页面聚合自 `CineHarbor/cineharbor-desktop` 的 GitHub Releases。请在发布管线中把
`releases.template.json` 渲染为实际数据后随站点一起部署。

## 许可证

CC BY-NC-SA 4.0