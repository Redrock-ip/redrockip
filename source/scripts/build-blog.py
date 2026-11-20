"""Build the bilingual blog from the article archive and the public site shell."""

import argparse
import json
from html import escape
from pathlib import Path
from urllib.parse import urljoin, urlsplit

from lxml import html


parser = argparse.ArgumentParser()
parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent)
root = parser.parse_args().root.resolve()
dist = root / 'dist'
posts = json.loads((root / 'data/blog-posts.json').read_text())


def localized(language, chinese, english):
    return english if language == 'en' else chinese


def cover(post, language, eager=False):
    attributes = 'fetchpriority="high"' if eager else 'loading="lazy"'
    return (
        f'<div class="blog-cover"><img src="/assets/blog/{post["cover"]}.webp" '
        f'alt="{escape(post[language]["alt"])}" width="1440" height="810" {attributes} decoding="async"></div>'
    )


def meta(post, language, show_read_time):
    item = post[language]
    category = (
        localized(language, '教程', 'Tutorial') if post['category'] == 'tutorial'
        else localized(language, '文章', 'Article')
    )
    read_time = f'<span>{escape(item["read_time"])}</span>' if show_read_time and item['read_time'] else ''
    return (
        f'<div class="blog-meta"><span class="blog-category">{category}</span>'
        f'<time datetime="{item["datetime"]}">{escape(item["date"])}</time>{read_time}</div>'
    )


def card(post, language, featured=False, related=False):
    prefix = '/en' if language == 'en' else ''
    item = post[language]
    style = ' blog-featured' if featured else ''
    category = f' data-blog-kind="{post["category"]}"' if not related else ''
    heading = 'h3' if related else 'h2'
    description = f'\n      <p>{escape(item["description"])}</p>' if not related else ''
    return f'''<article class="blog-card{style}"{category}>
  <a class="blog-card-link" href="{prefix}/blog/{post["slug"]}">
    {cover(post, language, eager=featured)}
    <div class="blog-card-copy">
      {meta(post, language, show_read_time=False)}
      <{heading}>{escape(item["title"])}</{heading}>{description}
    </div>
  </a>
</article>'''


def index_content(language, title, description):
    buttons = (
        ('all', localized(language, '全部', 'All')),
        ('tutorial', localized(language, '教程', 'Tutorials')),
        ('article', localized(language, '文章', 'Articles')),
    )
    controls = ''.join(
        f'<button type="button" data-blog-filter="{key}" aria-controls="blog-results" '
        f'aria-pressed="{str(key == "all").lower()}">{label}</button>' for key, label in buttons
    )
    entries = '\n'.join(card(post, language, featured=index == 0) for index, post in enumerate(posts))
    count = localized(language, f'共 {len(posts)} 篇', f'{len(posts)} posts')
    return f'''<main class="blog-shell blog-index" id="main">
  <div class="blog-intro">
    <h1>{escape(title)}</h1>
    <p>{escape(description)}</p>
  </div>
  <div class="blog-index-controls">
    <div class="blog-filters" role="group" aria-label="{localized(language,'按文章类型筛选','Filter by post type')}">{controls}</div>
    <p id="blog-count" class="blog-count" role="status">{count}</p>
  </div>
  <div class="blog-grid" id="blog-results">{entries}</div>
</main>'''


def article_content(post, language):
    prefix = '/en' if language == 'en' else ''
    item = post[language]
    body = html.fragment_fromstring(item['body'], create_parent='div')
    body.set('class', 'blog-prose')
    headings = []
    for index, node in enumerate(body.xpath('.//h2 | .//h3'), 1):
        identifier = node.get('id') or f'topic-{index}'
        node.set('id', identifier)
        step = ' class="blog-toc-step"' if node.tag == 'h3' else ''
        headings.append(f'<li{step}><a href="#{escape(identifier)}">{escape(node.text_content().strip())}</a></li>')
    toc = ''.join(headings)
    content = html.tostring(body, encoding='unicode')
    related = '\n'.join(card(entry, language, related=True) for entry in
                        [entry for entry in posts if entry is not post][:3])
    return f'''<main class="blog-shell" id="main">
  <article class="blog-article">
    <div class="blog-article-hero">
      <div>
        <a class="blog-back" href="{prefix}/blog">{localized(language,'返回博客','Back to blog')}</a>
        {meta(post, language, show_read_time=True)}
        <h1>{escape(item["title"])}</h1>
        <p class="blog-article-deck">{escape(item["description"])}</p>
      </div>
      {cover(post, language, eager=True)}
    </div>
    <div class="blog-article-layout">
      {content}
      <aside class="blog-toc" aria-labelledby="blog-toc-title">
        <h2 id="blog-toc-title">{localized(language,'本文目录','On this page')}</h2>
        <ul>{toc}</ul>
      </aside>
    </div>
    <section class="blog-related" aria-labelledby="blog-related-title">
      <h2 id="blog-related-title">{localized(language,'相关文章','Related posts')}</h2>
      <div class="blog-grid">{related}</div>
    </section>
  </article>
</main>'''


def write_page(relative, language, title, description, main):
    prefix = '/en' if language == 'en' else ''
    base = dist / language if language == 'en' else dist
    document = html.parse(str(base / 'faq.html')).getroot()
    document.xpath('//title')[0].text = title + ' · REDROCK'
    document.xpath('//meta[@name="description"]')[0].set('content', description)
    document.xpath('//body')[0].set('class', 'blog-page')
    old = document.xpath('//main')[0]
    old.getparent().replace(old, html.fragment_fromstring(main))

    for node in document.xpath('//link[@href] | //script[@src] | //a[@href] | //img[@src]'):
        key = 'href' if 'href' in node.attrib else 'src'
        value = node.get(key)
        parsed = urlsplit(value)
        if parsed.path.rsplit('/', 1)[-1] in {'company-pages.css', 'company-pages.js'}:
            node.getparent().remove(node)
        elif not (parsed.scheme or parsed.netloc or value.startswith(('/', '#'))):
            node.set(key, urljoin(prefix + '/faq.html', value))

    for node in document.xpath('//header[@id="site-header"]//*[@aria-current] | //nav[@id="nav"]//*[@aria-current]'):
        node.attrib.pop('aria-current', None)
    for node in document.xpath('//nav[@id="nav"]//details[contains(@class," is-active")]'):
        node.set('class', node.get('class').replace(' is-active', ''))
    for node in document.xpath(f'//nav[@id="nav"]//a[@href="{prefix}/blog"]'):
        node.set('aria-current', 'page')

    path = '/' + relative.removesuffix('.html')
    for node in document.xpath('//link[@data-locale-alternate]'):
        node.set('href', ('/en' if node.get('hreflang') == 'en' else '') + path)
    for node in document.xpath('//a[@data-language-switch]'):
        node.set('href', ('' if language == 'en' else '/en') + path)

    document.xpath('//head')[0].append(html.Element('link', rel='stylesheet', href='/blog.css'))
    document.xpath('//body')[0].append(html.Element('script', src='/blog.js'))
    target = base / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html.tostring(document, encoding='unicode', doctype='<!doctype html>') + '\n')


for language in ('zh', 'en'):
    title = localized(language, '代理连接与数据实践', 'Proxy connections and data guides')
    description = localized(
        language, '技术教程、使用指南与经验分享。',
        'Technical tutorials, how-to guides, and practical insights.'
    )
    write_page('blog.html', language, title, description, index_content(language, title, description))
    for post in posts:
        item = post[language]
        write_page(f'blog/{post["slug"]}.html', language, item['title'], item['description'], article_content(post, language))

print(f'Built {len(posts)} blog articles and a blog index for each language.')
