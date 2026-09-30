// Tiny static server for lab prototypes (ES modules do not load from file://).
// node lab/serve.mjs [port=4800]  ->  http://localhost:4800/v2-bands/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const port = +(process.argv[2] || 4800);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mp4': 'video/mp4', '.webm': 'video/webm', '.avif': 'image/avif', '.png': 'image/png', '.json': 'application/json', '.css': 'text/css' };
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  // /public/* maps to the site's public folder (rendered objects), everything else to lab/
  const base = p.startsWith('/public/') ? path.join(root, '..') : root;
  const file = path.join(base, p);
  if (!file.startsWith(base) || !fs.existsSync(file)) { res.writeHead(404); return res.end('404'); }
  const stat = fs.statSync(file);
  const type = types[path.extname(file)] || 'application/octet-stream';
  const range = req.headers.range;
  if (range) { // video seeking
    const [a, b] = range.replace('bytes=', '').split('-');
    const start = +a, end = b ? +b : stat.size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': stat.size, 'Accept-Ranges': 'bytes' });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`lab: http://localhost:${port}/`));
