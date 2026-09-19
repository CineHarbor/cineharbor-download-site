# cineharbor-download-site

CineHarbor 桌面发行下载站。仓库根目录就是静态站点源码，不存在嵌套的 `download-site/` 目录。

## 构建与验证

环境：Node.js 22、pnpm 10.14.0。依赖版本由 `pnpm-lock.yaml` 固定。

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test --runInBand
pnpm test:build
pnpm build
```

`pnpm build` 使用 `assets/releases.template.json` 生成预览到 `download-site-dist/`。脚本以自身位置定位仓库，调用者无需切换到特定工作目录；显式的 `--data` / `--output` 相对路径仍相对调用者工作目录解析。

实际发行数据由 `CineHarbor/cineharbor-desktop` 的公开 GitHub Releases 导出：

```sh
node scripts/export-download-site-data.mjs --repo CineHarbor/cineharbor-desktop --output .download-site-build/releases.json
node scripts/build-download-site.mjs --data .download-site-build/releases.json --output download-site-dist
```

需要提高 API 限额时，通过环境变量 `GITHUB_TOKEN` 提供令牌，不将其写入源码。导出目标依次取 `--repo`、`CINEHARBOR_RELEASE_REPOSITORY`、受版本控制的 release metadata；不会误用下载站自身的 `GITHUB_REPOSITORY`。

构建只复制 `index.html` 和 `assets/`，不会复制源码仓库、测试或 Git 元数据。输入数据验证和临时输出完成后才替换旧构建。输出必须是新目录，或已包含本仓构建归属标记的目录；源码目录、祖先目录、符号链接及无归属的既有目录均会被拒绝。旧脚本产生的无标记目录请使用一个新的输出路径，不要绕过防护。

## 部署

`Download Site CI and Deployment` 在 main 推送、手动运行及每日计划中先执行类型检查、原有数据/UI 测试、构建安全回归及静态构建，再导出真实发行数据并更新 `gh-pages`。PR 只验证，不部署。发布脚本拒绝将生成物推送到 main 等非部署分支。

`gh-pages` 更新成功与外部站点可访问是两个独立验收项。1.0.0 发布准备还需验证真实下载链接、站点上线状态及最终 RC 发行元数据；构建配置本身不代表这些验收已经通过。

## 许可证

CC BY-NC-SA 4.0。

## Agnir Project Instructions

Canonical Project 激活与操作说明见 [`AGNIR.md`](AGNIR.md)。本节仅保留为旧执行器的 locator。
