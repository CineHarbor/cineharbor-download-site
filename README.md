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
## Agnir Project Instructions

本项目使用 **Agnir**（project-owned durable continuity protocol）持久保存可恢复的 Project 连续性，本仓库根目录是已授权的 Project Entry Point。开始任何 Project 工作前：

1. 读取顶层 `AGNIR.yaml`；
2. 加载 Current State（`.agnir/state.md`）与 Next Actions（`.agnir/next-actions.md`）；
3. 需要时再加载 Decisions（`.agnir/decisions.md`）与 Evidence（`.agnir/evidence/`）；
4. durable Agnir Project truth 优先于聊天记录与 Agent 私有记忆，除非被更新的 Principal 指令或直接观测到的当前 Project 事实覆盖；
5. 在保存进度、checkpoint 或结束工作时，把重要的 state / next-action / decision / evidence 变更写回 `AGNIR.yaml` 声明的 durable memory 位置。
6. 在 repository / VCS 上下文中，把已授权的 `commit`、`提交`、`提交代码` 或同义请求视为 checkpoint boundary：先 reconcile Agnir 再 commit，优先把 Project 改动与 Agnir 改动放进同一 revision；`commit and push`、`提交推送` 或同义请求表示 checkpoint + commit + push，并在声明了 authoritative ref 时验证推送结果。
