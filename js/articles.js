export async function fetchArticles() {
  try {
    const response = await fetch('./data/articles.json?v=' + Date.now());
    if (!response.ok) {
      throw new Error(`Failed to load articles: ${response.status}`);
    }
    const articles = await response.json();
    return Array.isArray(articles) ? articles : [];
  } catch (error) {
    console.error('Articles Load Error:', error);
    return [];
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatContent(paragraphs) {
  if (!Array.isArray(paragraphs)) {
    if (typeof paragraphs === 'string') {
      paragraphs = paragraphs.split('\n\n');
    } else {
      return '';
    }
  }

  return paragraphs
    .map(p => {
      let trimmed = p.trim();
      if (!trimmed) return '';

      if (trimmed.startsWith('### ')) {
        return `<h3>${parseInline(trimmed.substring(4))}</h3>`;
      }
      if (trimmed.startsWith('## ')) {
        return `<h2>${parseInline(trimmed.substring(3))}</h2>`;
      }
      if (trimmed.startsWith('# ')) {
        return `<h1>${parseInline(trimmed.substring(2))}</h1>`;
      }

      if (trimmed.startsWith('> ')) {
        return `<blockquote><p>${parseInline(trimmed.substring(2))}</p></blockquote>`;
      }

      if (/^\d+\.\s/.test(trimmed)) {
        const lines = trimmed.split('\n');
        const items = lines
          .map(line => {
            const itemText = line.replace(/^\d+\.\s*/, '');
            return `<li>${parseInline(itemText)}</li>`;
          })
          .join('');
        return `<ol>${items}</ol>`;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const lines = trimmed.split('\n');
        const items = lines
          .map(line => {
            const itemText = line.replace(/^[-*]\s*/, '');
            return `<li>${parseInline(itemText)}</li>`;
          })
          .join('');
        return `<ul>${items}</ul>`;
      }

      return `<p>${parseInline(trimmed)}</p>`;
    })
    .join('');
}

function parseInline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

export function renderArticleCards(container, articles, options = {}) {
  if (!container) return;

  const { maxItems = null, excludeId = null } = options;
  let items = [...articles];

  if (excludeId) {
    items = items.filter(a => a.id !== excludeId);
  }

  if (maxItems && maxItems > 0) {
    items = items.slice(0, maxItems);
  }

  if (items.length === 0) {
    container.innerHTML = '<p class="articles-empty">Матеріали готуються до публікації.</p>';
    return;
  }

  container.classList.remove('articles-grid--single', 'articles-grid--two', 'articles-grid--three');
  if (items.length === 1) {
    container.classList.add('articles-grid--single');
  } else if (items.length === 2) {
    container.classList.add('articles-grid--two');
  } else {
    container.classList.add('articles-grid--three');
  }

  container.innerHTML = items
    .map(article => {
      const hasImage = Boolean(article.image && article.image.trim());
      const imageHtml = hasImage
        ? `<img src="${article.image}" alt="${escapeHtml(article.title)}" loading="lazy">`
        : `<div class="article-card__placeholder" aria-hidden="true"></div>`;

      return `
        <article class="article-card">
          <a href="article.html?id=${encodeURIComponent(article.id)}" class="article-card__link-overlay" aria-label="${escapeHtml(article.title)}"></a>
          <div class="article-card__image-wrap ${!hasImage ? 'article-card__image-wrap--placeholder' : ''}">
            ${imageHtml}
          </div>
          <div class="article-card__body">
            <div class="article-card__meta">
              <span class="article-card__date">${escapeHtml(article.date || '')}</span>
              ${article.readTime ? `<span class="article-card__bullet">•</span><span class="article-card__read-time">${escapeHtml(article.readTime)}</span>` : ''}
            </div>
            <h3 class="article-card__title">${escapeHtml(article.title)}</h3>
            ${article.excerpt ? `<p class="article-card__excerpt">${escapeHtml(article.excerpt)}</p>` : ''}
            <div class="article-card__footer">
              <span class="article-card__cta">ЧИТАТИ МАТЕРІАЛ</span>
              <span class="article-card__arrow" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

export async function initHomeArticles() {
  const container = document.getElementById('articlesGrid');
  if (!container) return;

  const articles = await fetchArticles();
  renderArticleCards(container, articles);
}

export async function initSingleArticlePage() {
  const articles = await fetchArticles();
  if (articles.length === 0) return;

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('id');

  let article = articles.find(a => a.id === requestedId);
  if (!article) {
    article = articles[0];
  }

  document.title = `${article.title} — Юлія Піхоцька`;
  const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
  if (breadcrumbCurrent) {
    breadcrumbCurrent.textContent = article.title;
  }

  const articleTitle = document.getElementById('articleTitle');
  if (articleTitle) {
    articleTitle.textContent = article.title;
  }

  const articleDate = document.getElementById('articleDate');
  if (articleDate && article.date) {
    articleDate.textContent = article.date;
  }
  const articleReadTime = document.getElementById('articleReadTime');
  if (articleReadTime) {
    articleReadTime.textContent = article.readTime || '';
    if (!article.readTime) articleReadTime.style.display = 'none';
  }

  const heroImageContainer = document.getElementById('articleHeroMedia');
  const hasImage = Boolean(article.image && article.image.trim());
  if (heroImageContainer) {
    if (hasImage) {
      heroImageContainer.innerHTML = `<img src="${article.image}" alt="${escapeHtml(article.title)}">`;
      heroImageContainer.style.display = '';
    } else {
      heroImageContainer.innerHTML = '';
      heroImageContainer.style.display = 'none';
    }
  }

  const articleBody = document.getElementById('articleBody');
  if (articleBody) {
    articleBody.innerHTML = formatContent(article.content);
  }

  setupShareButtons(article);

  const sidebarLinksList = document.getElementById('sidebarRelatedList');
  if (sidebarLinksList) {
    const otherArticles = articles.filter(a => a.id !== article.id);
    if (otherArticles.length > 0) {
      sidebarLinksList.innerHTML = otherArticles
        .slice(0, 4)
        .map(
          a => `
          <li class="sidebar-related-item">
            <a href="article.html?id=${encodeURIComponent(a.id)}" class="sidebar-related-link">
              <span class="sidebar-related-title">${escapeHtml(a.title)}</span>
              <span class="sidebar-related-date">${escapeHtml(a.date || '')}</span>
            </a>
          </li>
        `
        )
        .join('');
    } else {
      const widget = sidebarLinksList.closest('.sidebar-widget');
      if (widget) widget.style.display = 'none';
    }
  }

  const relatedGrid = document.getElementById('relatedArticlesGrid');
  if (relatedGrid) {
    renderArticleCards(relatedGrid, articles, {
      excludeId: article.id,
      maxItems: 3,
    });
  }
}

function setupShareButtons(article) {
  const currentUrl = window.location.href;
  const pageTitle = article.title;

  const telegramBtn = document.getElementById('shareTelegram');
  if (telegramBtn) {
    telegramBtn.href = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(pageTitle)}`;
  }

  const facebookBtn = document.getElementById('shareFacebook');
  if (facebookBtn) {
    facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  }

  const copyBtn = document.getElementById('shareCopyLink');
  if (copyBtn) {
    copyBtn.addEventListener('click', async e => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(currentUrl);
        const originalText = copyBtn.getAttribute('data-tooltip') || '';
        copyBtn.setAttribute('data-tooltip', 'Скопійовано!');
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.setAttribute('data-tooltip', originalText);
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    });
  }
}
