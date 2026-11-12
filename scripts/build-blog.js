const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'dist');
const BASE = 'https://promptverse-official.vercel.app';
const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function slugify(value) {
  return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function readPosts() {
  const dir = path.join(ROOT, 'content', 'blog');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(file => file.endsWith('.md')).map(file => {
    const parsed = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
    const data = parsed.data || {};
    const slug = slugify(data.slug || path.basename(file, '.md'));
    return { ...data, slug, body: parsed.content, draft: Boolean(data.draft) };
  }).filter(post => post.title && post.slug && !post.draft)
    .sort((a,b) => String(b.date || '').localeCompare(String(a.date || '')));
}
function cards(posts) {
  return posts.map(p => {
    const url = '/blog/' + p.slug + '.html';
    const image = p.featured_image || '/images/blog-system-prompts.svg';
    return '<article data-blog-card data-category="' + esc(p.category || 'AI Guides') + '" data-title="' + esc(p.title.toLowerCase()) + '" class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">' +
      '<a href="' + url + '"><img src="' + esc(image) + '" alt="' + esc(p.image_alt || p.title) + '" class="w-full h-48 object-cover" loading="lazy"></a>' +
      '<div class="p-6 flex flex-col flex-grow"><span class="text-xs font-semibold text-indigo-400 mb-2">' + esc(p.category || 'AI Guides') + '</span>' +
      '<h3 class="text-lg font-bold text-white mb-3">' + esc(p.title) + '</h3><p class="text-slate-400 text-sm mb-5 flex-grow">' + esc(p.description || '') + '</p>' +
      '<a href="' + url + '" class="text-indigo-400 font-semibold text-sm">Read article <i class="fa-solid fa-arrow-right ml-1"></i></a></div></article>';
  }).join('\n');
}
function article(p) {
  const url = BASE + '/blog/' + p.slug + '.html';
  const title = p.seo_title || p.title;
  const description = p.seo_description || p.description || '';
  const content = md.render(p.body || '');
  const headings = [];
  const tokens = md.parse(p.body || '', {});
  for (let i=0;i<tokens.length;i++) {
    if (tokens[i].type === 'heading_open') {
      const inline = tokens[i+1];
      const text = inline && inline.content || '';
      const id = slugify(text);
      tokens[i].attrSet('id', id);
      headings.push({text,id});
    }
  }
  const rendered = md.renderer.render(tokens, md.options, {});
  const toc = headings.length ? '<aside class="md:sticky md:top-6 md:self-start bg-slate-900 border border-slate-800 rounded-2xl p-5"><h2 class="font-bold mb-4">On this page</h2><ol class="space-y-3 list-decimal list-inside text-sm">' + headings.map(h => '<li><a class="text-indigo-300 hover:text-indigo-200" href="#' + esc(h.id) + '">' + esc(h.text) + '</a></li>').join('') + '</ol></aside>' : '';
  const image = p.featured_image || '/images/blog-system-prompts.svg';
  const date = p.date ? new Date(p.date).toISOString().slice(0,10) : new Date().toISOString().slice(0,10);
  const schema = {'@context':'https://schema.org','@type':'Article','headline':p.title,'description':description,'image':image,'mainEntityOfPage':url,'datePublished':date,'dateModified':date,'articleSection':p.category || 'AI Guides','author':{'@type':'Organization','name':'PromptVerse AI'},'publisher':{'@type':'Organization','name':'PromptVerse AI'}};
  return '<!doctype html><html lang="en" class="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + esc(title) + ' | PromptVerse AI</title><meta name="description" content="' + esc(description) + '"><link rel="canonical" href="' + url + '"><meta name="robots" content="index,follow">' +
    '<meta property="og:type" content="article"><meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(description) + '"><meta property="og:url" content="' + url + '"><meta property="og:image" content="' + esc(image) + '">' +
    '<meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">' + JSON.stringify(schema) + '</scr' + 'ipt><script src="https://cdn.tailwindcss.com"></scr' + 'ipt><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">' +
    '<style>article.prose h2{font-size:1.6rem;font-weight:700;color:#fff;margin:2.2rem 0 1rem}article.prose h3{font-size:1.25rem;font-weight:700;color:#fff;margin:1.6rem 0 .8rem}article.prose p,article.prose li{color:#cbd5e1;line-height:2;margin:.8rem 0}article.prose a{color:#a5b4fc;text-decoration:underline}article.prose ul,article.prose ol{padding-left:1.5rem;list-style:disc}article.prose blockquote{border-left:3px solid #6366f1;padding-left:1rem;color:#cbd5e1}</style></head>' +
    '<body class="bg-slate-950 text-slate-100 min-h-screen"><header class="border-b border-slate-800"><div class="max-w-6xl mx-auto px-5 py-5 flex justify-between"><a href="/" class="font-bold text-xl"><span class="text-indigo-400">Prompt</span>Verse AI</a><nav class="flex gap-5 text-sm text-slate-300"><a href="/#prompts">Prompts</a><a href="/#ai-tools">Tools</a><a href="/#blog" class="text-indigo-300">Blog</a></nav></div></header>' +
    '<main class="max-w-6xl mx-auto px-5 py-12"><div class="max-w-4xl mx-auto"><a href="/#blog" class="text-indigo-300 text-sm">← All articles</a><div class="mt-8 mb-6"><span class="text-indigo-300 text-sm font-semibold">' + esc(p.category || 'AI Guides') + '</span><h1 class="text-3xl md:text-5xl font-extrabold leading-tight mt-3 mb-5">' + esc(p.title) + '</h1><p class="text-sm text-slate-500">' + esc(date) + ' · PromptVerse Editorial Team</p></div>' +
    (p.featured_image ? '<img src="' + esc(image) + '" alt="' + esc(p.image_alt || p.title) + '" class="w-full aspect-[16/8] object-cover rounded-3xl border border-slate-800 mb-8">' : '') +
    '<div class="grid md:grid-cols-[230px_1fr] gap-10">' + toc + '<article class="prose min-w-0">' + rendered + '<div class="border-t border-slate-800 mt-10 pt-7"><h2 class="font-bold text-xl mb-4">Explore PromptVerse AI</h2><div class="flex flex-wrap gap-3"><a href="/#prompts" class="px-4 py-2 rounded-xl bg-slate-800 text-sm">AI Prompts</a><a href="/#ai-tools" class="px-4 py-2 rounded-xl bg-slate-800 text-sm">Free Web Tools</a><a href="/#blog" class="px-4 py-2 rounded-xl bg-indigo-600 text-sm">More AI Guides</a></div></div></article></div></div></main>' +
    '<footer class="border-t border-slate-800 py-8 text-center text-sm text-slate-500"><a href="/" class="text-indigo-300">PromptVerse AI</a> · Free AI prompts, tools and practical guides.</footer></body></html>';
}
function main() {
  const posts = readPosts();
  fs.rmSync(OUT, {recursive:true, force:true});
  fs.mkdirSync(OUT, {recursive:true});
  for (const name of fs.readdirSync(ROOT)) {
    if (['.git','node_modules','dist','.vercel'].includes(name)) continue;
    fs.cpSync(path.join(ROOT,name), path.join(OUT,name), {recursive:true});
  }
  const indexPath = path.join(OUT,'index.html');
  if (posts.length && fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath,'utf8');
    const marker = '<!-- CMS_MANAGED_BLOG_CARDS -->';
    const gridStart = html.indexOf('<div id="blog-grid"');
    const markerAt = html.indexOf(marker);
    if (gridStart !== -1 && markerAt !== -1) {
      const openEnd = html.indexOf('>',gridStart)+1;
      html = html.slice(0,openEnd) + cards(posts) + marker + html.slice(markerAt+marker.length);
      const categories = [...new Set(posts.map(p=>p.category).filter(Boolean))];
      const filterStart = html.indexOf('<div id="blog-filters"');
      const filterEnd = html.indexOf('</div>',filterStart)+6;
      if (filterStart !== -1 && filterEnd > 5) {
        const buttons = '<div id="blog-filters" class="flex flex-wrap justify-center gap-2 mb-10"><button data-filter="all" class="blog-filter px-4 py-2 rounded-full bg-indigo-600 text-white text-sm">All articles</button>' + categories.map(c=>'<button data-filter="'+esc(c)+'" class="blog-filter px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-sm">'+esc(c)+'</button>').join('') + '</div>';
        html = html.slice(0,filterStart) + buttons + html.slice(filterEnd);
      }
      fs.writeFileSync(indexPath,html);
    }
  }
  for (const p of posts) {
    const file = path.join(OUT,'blog',p.slug+'.html');
    fs.mkdirSync(path.dirname(file),{recursive:true});
    fs.writeFileSync(file,article(p));
  }
  const sitemapPath = path.join(OUT,'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    let xml = fs.readFileSync(sitemapPath,'utf8').replace(/<url>\s*<loc>[^<]*\/blog\/[^<]*<\/loc>[\s\S]*?<\/url>/g,'');
    for (const p of posts) {
      const url = BASE + '/blog/' + p.slug + '.html';
      if (!xml.includes('<loc>'+url+'</loc>')) xml = xml.replace('</urlset>','  <url><loc>'+url+'</loc><lastmod>'+(p.date || new Date().toISOString().slice(0,10))+'</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>');
    }
    fs.writeFileSync(sitemapPath,xml);
  }
  console.log('PromptVerse build complete. Published CMS articles:',posts.length);
}
main();
