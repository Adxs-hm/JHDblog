/* ============================================================
   JHD Blog · CI 静态服务器（Lighthouse CI 专用数据源）
   用途：以生产等价形态（gzip + 指纹资源）serve public/，
        替代 hugo server（其不压缩且注入 78KB livereload，
        导致门禁测得的是悲观字节而非线上形态）。
   仅依赖 Node 内置模块；CI 与本地均可运行。
   本地复现：hugo --minify --baseURL http://localhost:8899/ &&
             node .tools/ci-static-server.js
   ============================================================ */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..', 'public');
const PORT = parseInt(process.env.PORT || '8899', 10);
const HOST = '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};
/* woff2/图片已压缩，不再二次 gzip */
const GZIP_TYPES = new Set(['text/html', 'text/css', 'text/javascript', 'application/json', 'application/xml', 'image/svg+xml', 'text/plain']);

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  } catch (e) {
    res.writeHead(400).end('bad request');
    return;
  }
  if (urlPath.endsWith('/')) urlPath += 'index.html';

  const file = path.join(ROOT, urlPath);
  /* 防目录穿越 */
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }

  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found'); return; }
    const ext = path.extname(file).toLowerCase();
    const type = TYPES[ext] || 'application/octet-stream';
    const base = type.split(';')[0];
    const headers = { 'Content-Type': type, 'Cache-Control': 'no-store' };

    if (GZIP_TYPES.has(base) && (req.headers['accept-encoding'] || '').includes('gzip')) {
      zlib.gzip(data, (zerr, buf) => {
        if (zerr) { res.writeHead(200, headers).end(data); return; }
        headers['Content-Encoding'] = 'gzip';
        headers['Content-Length'] = buf.length;
        res.writeHead(200, headers).end(buf);
      });
    } else {
      headers['Content-Length'] = data.length;
      res.writeHead(200, headers).end(data);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log('ci-static-server listening on ' + HOST + ':' + PORT);
});
