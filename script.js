// ========== 博客配置 ==========
const BLOG_CONFIG = {
    title: '我的博客',
    description: '记录思考与探索',
    postsDir: 'posts/',      // Markdown 文件目录
    coverImage: 'assets/cover.jpg'
};

// ========== 文章列表 ==========
// 在这里添加你的文章，每篇文章是一个 markdown 文件
const POSTS = [
    {
        file: 'hello-world.md',
        date: '2025-01-01',
        tags: ['随笔', '开始']
    },
    {
        file: 'tech-notes.md',
        date: '2025-01-15',
        tags: ['技术', '笔记']
    }
    // 继续添加更多文章...
];

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    initMusic();
    renderPostsList();
    initNavigation();
});

// ========== 音乐控制 ==========
function initMusic() {
    const audio = document.getElementById('bgm');
    const btn = document.getElementById('music-toggle');
    const iconPlay = document.getElementById('music-icon-play');
    const iconPause = document.getElementById('music-icon-pause');

    let isPlaying = false;

    // 自动播放尝试
    const tryPlay = () => {
        audio.volume = 0.3; // 默认音量 30%
        audio.play().then(() => {
            isPlaying = true;
            btn.classList.add('playing');
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        }).catch(() => {
            // 浏览器阻止自动播放，等用户交互后再播放
            console.log('自动播放被阻止，等待用户交互');
        });
    };

    // 页面加载后尝试播放
    setTimeout(tryPlay, 1000);

    // 用户交互后再次尝试
    document.addEventListener('click', () => {
        if (!isPlaying) {
            tryPlay();
        }
    }, { once: true });

    // 手动切换
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            btn.classList.remove('playing');
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        } else {
            audio.volume = 0.3;
            audio.play();
            isPlaying = true;
            btn.classList.add('playing');
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        }
    });
}

// ========== 渲染文章列表 ==========
function renderPostsList() {
    const container = document.getElementById('posts-list');
    container.innerHTML = '';

    POSTS.forEach((post, index) => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        const tagsHTML = post.tags
            ? post.tags.map(t => `<span class="tag">${t}</span>`).join('')
            : '';

        card.innerHTML = `
            <div class="post-card-date">${post.date}</div>
            <h2 class="post-card-title">${post.title || '加载中...'}</h2>
            <p class="post-card-excerpt">${post.excerpt || ''}</p>
            <div class="post-card-tags">${tagsHTML}</div>
        `;

        // 点击展开文章
        card.addEventListener('click', () => openPost(post));

        container.appendChild(card);

        // 滚动出现动画
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s, transform 0.5s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + index * 100);
    });

    // 加载文章标题和摘要
    loadPostPreviews();
}

async function loadPostPreviews() {
    for (let i = 0; i < POSTS.length; i++) {
        try {
            const resp = await fetch(BLOG_CONFIG.postsDir + POSTS[i].file);
            if (!resp.ok) continue;
            const md = await resp.text();

            // 提取第一个 # 标题
            const titleMatch = md.match(/^#\s+(.+)/m);
            if (titleMatch) {
                POSTS[i].title = titleMatch[1];
            }

            // 提取摘要：第一个段落
            const lines = md.split('\n').filter(l => l.trim());
            for (const line of lines) {
                if (line.startsWith('#') || line.startsWith('---') || line.startsWith('```')) continue;
                POSTS[i].excerpt = line.substring(0, 150) + (line.length > 150 ? '...' : '');
                break;
            }

            // 更新 DOM
            const cards = document.querySelectorAll('.post-card');
            if (cards[i]) {
                cards[i].querySelector('.post-card-title').textContent = POSTS[i].title || '无标题';
                cards[i].querySelector('.post-card-excerpt').textContent = POSTS[i].excerpt || '';
            }
        } catch (e) {
            console.warn(`无法加载 ${POSTS[i].file}`, e);
        }
    }
}

// ========== 打开文章详情 ==========
async function openPost(post) {
    const detail = document.getElementById('post-detail');
    const content = document.getElementById('post-content');

    try {
        const resp = await fetch(BLOG_CONFIG.postsDir + post.file);
        if (!resp.ok) throw new Error('文章未找到');
        const md = await resp.text();

        // 使用 marked 解析 Markdown
        content.innerHTML = marked.parse(md);
    } catch (e) {
        content.innerHTML = `
            <h1>${post.title || '文章加载失败'}</h1>
            <p style="color: var(--text-muted);">找不到文件: ${BLOG_CONFIG.postsDir}${post.file}</p>
            <p>请确认文件存在于 posts/ 目录中。</p>
        `;
    }

    detail.classList.remove('hidden');
    detail.scrollTop = 0;
}

// ========== 导航 ==========
function initNavigation() {
    const detail = document.getElementById('post-detail');
    const backBtn = document.getElementById('back-btn');

    backBtn.addEventListener('click', () => {
        detail.classList.add('hidden');
    });

    // ESC 键返回
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !detail.classList.contains('hidden')) {
            detail.classList.add('hidden');
        }
    });
}
