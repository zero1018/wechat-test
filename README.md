# 微信博客

一个可以分享到微信的个人博客，支持自定义 UI、背景音乐和 Markdown 写作。

## 快速开始

### 1. 本地预览

```bash
cd wechat-blog
python3 -m http.server 8080
```

然后打开 http://localhost:8080

### 2. 写新文章

在 `posts/` 目录下创建 `.md` 文件：

```markdown
# 文章标题

> 一句话摘要

## 正文内容

你的文章内容...

---

*结尾*
```

然后在 `index.html` 的 `POSTS` 数组中添加：

```javascript
{
    file: 'your-post.md',
    date: '2025-01-20',
    tags: ['标签1', '标签2']
}
```

### 3. 部署到 GitHub Pages

```bash
# 初始化 git
git init
git add .
git commit -m "初始化博客"

# 创建 GitHub 仓库后
git remote add origin git@github.com:你的用户名/你的仓库名.git
git push -u origin main
```

然后在 GitHub 仓库设置中启用 Pages（Source: main 分支）。

### 4. 自定义域名（可选）

1. 购买域名
2. 在 DNS 添加 CNAME 记录指向 `你的用户名.github.io`
3. 在仓库根目录创建 `CNAME` 文件，写入你的域名
4. 修改 `index.html` 中的 `og:image` 和 `og:url` 为你的域名

### 5. 添加音乐

将 MP3 文件放到 `assets/music.mp3`

## 文件结构

```
wechat-blog/
├── index.html          # 主页面
├── style.css           # 样式
├── script.js           # 交互逻辑
├── posts/              # Markdown 文章
│   ├── hello-world.md
│   └── tech-notes.md
├── assets/
│   ├── cover.jpg       # Hero 封面图（建议 1920x1080）
│   └── music.mp3       # 背景音乐
└── README.md
```

## 微信分享优化

分享到微信时会自动显示卡片预览，由 `index.html` 中的 Open Graph 标签控制：

- `og:title` — 卡片标题
- `og:description` — 卡片描述
- `og:image` — 卡片封面图（建议 900x383）

记得把 `og:image` 和 `og:url` 改成你自己的域名。

## 自定义

### 修改主题色

编辑 `style.css` 中的 `--accent` 变量：

```css
:root {
    --accent: #e8c547;  /* 改成你喜欢的颜色 */
}
```

### 修改封面图

替换 `assets/cover.jpg`，建议尺寸 1920x1080。

### 修改音乐

替换 `assets/music.mp3`，音量在 `script.js` 中调整（默认 0.3）。

## 技术栈

- 原生 HTML / CSS / JavaScript（无框架）
- marked.js（Markdown 解析）
- Open Graph 协议（微信分享卡片）
- GitHub Pages（免费托管）
