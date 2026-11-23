// Render the CV site to A4 PDFs (English and Korean).
// Usage: tools/make-pdf.sh   (builds the site, then runs this script)
//   node tools/make-pdf.js <built-site-dir> <output-dir>
// The site must be built with an empty baseurl. Needs Node and Playwright (Chromium).
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = process.argv[2], OUT = process.argv[3];
const types = { '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.js': 'application/javascript',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.jpg': 'image/jpeg', '.png': 'image/png' };
const srv = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  fs.readFile(f, (e, d) => { if (e) { r.statusCode = 404; return r.end(); }
    r.setHeader('Content-Type', types[path.extname(f)] || 'application/octet-stream'); r.end(d); });
}).listen(4140);

const SIDEBAR = '#2e2e2e';
const CSS = `
  @page { size: A4; margin: 0; }
  html { background: linear-gradient(to right, ${SIDEBAR} 0, ${SIDEBAR} 30%, #fff 30%, #fff 100%) !important;
         -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { background: transparent !important; padding: 0 !important; margin: 0 !important; font-size: 14px !important;
         font-family: "Roboto", "Noto Sans KR", sans-serif !important; }
  .wrapper { max-width: none !important; margin: 0 !important; box-shadow: none !important; background: transparent !important; }
  .sidebar-wrapper { background: transparent !important; }
  .sidebar-wrapper .profile-container { background: transparent !important; padding-top: 40px !important; }
  .main-wrapper { background: transparent !important; padding: 44px 48px 40px 48px !important;
                  -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .main-wrapper .section { margin-bottom: 34px !important; }
  .main-wrapper .section-title { margin-bottom: 14px !important; }
  .main-wrapper .time { padding: 0 !important; }
  .container-block { padding: 22px 30px !important; }
  .lang-switch, .greeting, footer, .footer, .contact-list li.pdf-en, .contact-list li.pdf-kr { display: none !important; }
  .item, .publication-list li, .research-interests-list li { break-inside: avoid; page-break-inside: avoid; }
  .section-title { break-after: avoid; page-break-after: avoid; }
  a { text-decoration: none !important; }
`;

(async () => {
  const b = await chromium.launch();
  for (const [lang, url] of [['en', '/'], ['ko', '/ko/']]) {
    const p = await b.newPage();
    await p.goto('http://localhost:4140' + url, { waitUntil: 'networkidle' });
    await p.addStyleTag({ url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&family=Noto+Sans+KR:wght@400;500;700;900&display=block' });
    await p.addStyleTag({ content: CSS });
    // Show real addresses instead of "GitHub" / "Lab Homepage" in print
    await p.evaluate(() => {
      document.querySelectorAll('.contact-list li.website a, .contact-list li.github a').forEach(a => {
        a.textContent = a.href.replace(/^https?:\/\//, '').replace(/\/$/, '');
      });
    });
    await p.emulateMedia({ media: 'print' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(500);
    const file = path.join(OUT, `SangwooKim_CV_${lang}.pdf`);
    await p.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true, scale: 0.8 });
    console.log('wrote', file);
    await p.close();
  }
  await b.close(); srv.close();
})();
