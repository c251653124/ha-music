# 部署到 Cloudflare Pages

## 前置条件

1. 安装 Cloudflare CLI: `npm install -g wrangler`（可选，用于本地测试）
2. 登录 Cloudflare: `wrangler login`（可选，用于本地测试）

## 方式一：使用 GitHub Actions 自动部署（推荐）

### 步骤 1：创建 GitHub 仓库

1. 在 GitHub 上创建一个新仓库
2. 将项目代码推送到仓库：

```bash
cd api-enhanced-main
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### 步骤 2：配置 GitHub Secrets

在 GitHub 仓库的 **Settings > Secrets and variables > Actions** 中添加以下 secrets：

| Secret 名称 | 值 | 获取方式 |
|-------------|-----|----------|
| CLOUDFLARE_API_TOKEN | Cloudflare API Token | 在 Cloudflare 控制台创建 |
| CLOUDFLARE_ACCOUNT_ID | Cloudflare 账户 ID | Cloudflare 控制台 > 概述页面 |

**如何获取 Cloudflare API Token：**

1. 登录 Cloudflare 控制台
2. 点击右上角头像 > **My Profile**
3. 点击 **API Tokens**
4. 点击 **Create Token**
5. 使用 **Edit Cloudflare Workers** 模板或创建自定义 token
6. 确保包含以下权限：
   - Account: Cloudflare Pages - Edit
   - Account: Workers Pages - Edit

### 步骤 3：配置项目名称

编辑 `.github/workflows/deploy.yml` 文件，修改 `projectName` 为你在 Cloudflare Pages 中创建的项目名称：

```yaml
projectName: your-project-name
```

### 步骤 4：触发部署

每次推送到 `main` 分支时，GitHub Actions 会自动部署到 Cloudflare Pages。

## 方式二：使用 Wrangler CLI 手动部署

```bash
# 进入项目目录
cd api-enhanced-main

# 安装依赖
npm install

# 部署到 Cloudflare Pages
wrangler pages deploy . --project-name ncm-api-enhanced
```

## 方式三：本地开发测试

```bash
# 安装依赖
npm install

# 本地启动开发服务器
npm run dev

# 或使用 wrangler 预览
npm run cf:preview
```

## 环境变量配置

在 Cloudflare Pages 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| CORS_ALLOW_ORIGIN | * | 允许跨域 |
| ENABLE_GENERAL_UNBLOCK | true | 启用全局解灰 |
| ENABLE_FLAC | true | 启用无损音质 |
| NODE_ENV | production | 生产环境 |
| ENABLE_PROXY | false | 是否启用代理（默认关闭） |

## 使用说明

部署成功后，你可以通过以下方式访问 API：

```
https://<your-pages-domain>/search?keywords=周杰伦
https://<your-pages-domain>/song/url?id=123456
https://<your-pages-domain>/playlist/detail?id=123456
```

## 可用接口

- `/search` - 搜索
- `/song/url` - 获取歌曲URL
- `/song/detail` - 获取歌曲详情
- `/playlist/detail` - 获取歌单详情
- `/album/detail` - 获取专辑详情
- `/artist/desc` - 获取歌手详情
- `/lyric` - 获取歌词
- `/toplist` - 排行榜
- `/personalized` - 推荐歌单

## 注意事项

1. Cloudflare Pages 有请求限制，高流量使用可能需要升级计划
2. 建议开启缓存策略以提高性能
3. 某些接口可能需要登录（cookie）才能访问
4. 请遵守网易云音乐服务条款和相关法律法规
5. GitHub Actions 需要正确配置 Cloudflare API Token 才能正常工作
