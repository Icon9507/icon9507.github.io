# 作品集发布环境

- 网站：https://icon9507.github.io
- CMS：https://icon9507-portfolio.sanity.studio
- Sanity 项目管理：https://www.sanity.io/manage/project/9ti3q6bj
- 内容集：`production`（公开）

这是发布和内容管理的基础配置，页面使用简单的占位样式，便于后续实现正式作品集设计。

## 日常更新

1. 打开 CMS，用创建项目时的 GitHub 账号登录。
2. 在「网站设置」填写名称和简介，点击 **Publish**。
3. 在「作品」中新建作品，填写名称、介绍、封面，添加「图片与视频」。
4. 视频支持 MP4 / WebM，可添加封面、说明、静音自动播放和循环播放选项。
5. 设置排序（数字越小越靠前），开启「在网站展示」，点击 **Publish**。
6. 重新打开网站查看；内容 CDN 可能有短暂缓存。

草稿不会显示。要隐藏已有作品，关闭「在网站展示」并发布，或撤销发布。文件上传完成后仍需发布所在作品。

## 发布方式

- 网页、CSS 和浏览器交互托管在 GitHub Pages。
- CMS 使用 Sanity Studio 官方托管，内容和视频存放在 Sanity。
- 每次访问先展示构建时保存的内容快照，再读取 CMS 最新发布的内容；CMS 暂时不可达时保留快照。
- 推送代码到 `main` 后，GitHub Actions 自动构建并部署网站。
- Actions 每天刷新一次备用快照，也可在 GitHub 的 **Actions → Publish portfolio → Run workflow** 手动刷新。
- 定时任务由 GitHub 调度，可能延迟；公开仓库长期无活动时定时运行可能被暂停。网站的实时内容读取不依赖定时任务。
- CMS 的结构或配置改动后，需要重新部署 Studio。

## 本地开发

网站构建使用 Node.js 22 或更高版本，没有额外运行时依赖：

```sh
npm run check
npm run build
npm run preview
```

CMS：

```sh
cd studio
npm ci
npm run dev
```

修改 CMS 配置后：

```sh
cd studio
npx sanity login
npm run validate
npm run deploy
```

`site.config.json` 中只有公开项目标识和网址，不保存令牌。GitHub Actions 读取公开内容，不需要 GitHub 或 Sanity 个人令牌。

## 费用和访问

当前配置使用 GitHub Pages 和 Sanity Free，不包含独立域名或付费套餐。免费额度以平台当前账单页面为准；CMS 图片和视频共享素材存储、流量额度。视频文件需要事先压缩成适合网页播放的格式，本配置不包含视频转码服务。

发布上线后，应使用上海的实际宽带和手机网络测试网页、CMS 及视频访问效果。

## 后续扩展

`studio/schemaTypes.js` 定义内容字段；`public/app.mjs` 定义浏览器展示和视频行为。可以后续增加滚动控制、热点和更复杂的页面布局，同时沿用现有 CMS 和发布配置。
