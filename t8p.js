/* ============================================================
   T8P STUDIOS — Site Script v9.0
   External hosted — no Squarespace minifier issues
   Mobile-first with desktop sphere experience
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     CONSTANTS & CONFIG
  ────────────────────────────────────────────────────────── */
  var IS_MOBILE = window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  var PSSVG = '<svg width="38" height="38" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#bbe0e9"/><rect x="13" y="13" width="5" height="14" fill="#000"/><rect x="22" y="13" width="5" height="14" fill="#000"/></svg>';
  var PSVG  = '<svg width="38" height="38" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#bbe0e9"/><polygon points="16,13 16,27 29,20" fill="#000"/></svg>';
  var CICO  = '<svg width="22" height="22" viewBox="0 0 25 25" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round"><line x1="7" y1="7" x2="18" y2="18"/><line x1="18" y1="7" x2="7" y2="18"/></svg>';
  var MICO  = '<svg width="22" height="22" viewBox="0 0 25 25" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="10,7 6,10 3,10 3,15 6,15 10,18" fill="#000" stroke="none"/><line x1="17" y1="9" x2="22" y2="15"/><line x1="22" y1="9" x2="17" y2="15"/></svg>';

  /* ──────────────────────────────────────────────────────────
     INJECT STYLES
  ────────────────────────────────────────────────────────── */
  function injectStyles() {
    var style = document.createElement('style');
    style.id = 't8p-styles';
    style.textContent = [
      /* ── Reset & root ── */
      '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}',
      ':root{--bg:#080808;--fg:#f0ede6;--dim:rgba(240,237,230,.4);--line:rgba(240,237,230,.1);',
      '--mono:"ui-monospace","SF Mono","Menlo","Consolas",monospace;',
      '--blue:#1a43ff;--rb:linear-gradient(90deg,#ff3366,#ff6600,#ffcc00,#33cc66,#3399ff,#cc33ff)}',
      'html,body{background:var(--bg);color:var(--fg);font-family:var(--mono);',
      '-webkit-font-smoothing:antialiased;overflow-x:hidden}',
      'header#header,#header,.header-announcement-bar-wrapper,.sqs-announcement-bar-dropzone{display:none!important}',

      /* ── Custom cursor (desktop only) ── */
      '#t8p-cur{position:fixed;width:13px;height:13px;border-radius:50%;background:#fff;',
      'mix-blend-mode:difference;pointer-events:none;z-index:999999;',
      'transform:translate(-50%,-50%);transition:width .18s,height .18s;',
      'will-change:transform;left:-100px;top:-100px}',
      '#t8p-cur.big{width:20px;height:20px}',
      '@media(max-width:767px){#t8p-cur{display:none}}',

      /* ── T8P logo icon ── */
      '#t8p-icon{position:fixed;top:20px;left:22px;z-index:9000;width:42px;height:42px;',
      'display:flex;align-items:center;justify-content:center;text-decoration:none;',
      'opacity:.9;transition:opacity .2s;color:#fff}',
      '#t8p-icon:hover{opacity:1}',
      '#t8p-icon svg{width:28px;height:28px;fill:#f0ede6}',

      /* ── Nav button SVG icon ── */
      '#t8p-nav-btn svg{width:28px;height:28px;color:#fff}',

      /* ── HOME layout ── */
      '#t8p-home{position:fixed;inset:0;overflow:hidden;background:var(--bg);display:none;z-index:8000}',
      'body.is-home #t8p-home{display:block}',
      'body.is-home #siteWrapper,body.is-home #page,body.is-home #header,.is-home #siteWrapper{display:none!important}',

      /* ── 3D sphere (desktop) ── */
      '#t8p-world{position:absolute;inset:0;z-index:100;perspective:2400px;',
      'perspective-origin:50% 50%;transform-style:preserve-3d}',
      '#t8p-sphere{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform}',

      /* ── Center wordmark ── */
      '#t8p-center{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);',
      'z-index:500;pointer-events:none;display:flex;flex-direction:column;',
      'align-items:center;gap:8px;text-align:center}',
      '#t8p-wm-wrap{position:relative;width:min(64vw,560px)}',
      '#t8p-wm-wrap svg,#t8p-wm-wrap img{width:100%;height:auto;display:block;fill:#f0ede6}',
      '@media(max-width:767px){#t8p-wm-wrap{width:min(80vw,320px)}}',

      /* ── Nav pill ── */
      '#t8p-nav{will-change:transform;margin-top:6px;position:relative;',
      'pointer-events:auto;z-index:600;display:flex;justify-content:center}',
      '#t8p-nav-btn{width:54px;height:54px;border-radius:50%;background:rgba(20,20,20,.6);',
      'backdrop-filter:blur(8px);border:1px solid rgba(240,237,230,.18);',
      'display:flex;align-items:center;justify-content:center;cursor:pointer;',
      'transition:transform .5s cubic-bezier(.34,1.56,.64,1);position:relative;z-index:2}',
      '#t8p-nav-btn>svg{width:28px;height:28px;fill:#f0ede6;transition:opacity .3s}',
      '#t8p-nav-pill{position:absolute;top:50%;left:50%;',
      'transform:translate(-50%,-50%) scaleX(0);transform-origin:center;',
      'height:54px;display:flex;align-items:center;gap:2px;',
      'background:rgba(245,243,238,.95);backdrop-filter:blur(20px);',
      'border-radius:27px;padding:0 64px 0 24px;opacity:0;pointer-events:none;',
      'transition:transform .55s cubic-bezier(.34,1.56,.64,1),opacity .3s;',
      'white-space:nowrap;z-index:1;visibility:hidden}',
      '#t8p-nav.open #t8p-nav-pill{transform:translate(-50%,-50%) scaleX(1);',
      'opacity:1;pointer-events:all;visibility:visible}',
      '#t8p-nav-pill a{font-size:11px;letter-spacing:.04em;color:#080808;',
      'text-decoration:none;padding:6px 12px;border-radius:14px;',
      'transition:opacity .15s;font-weight:500}',
      '#t8p-nav-pill a:hover{opacity:.5}',
      '#t8p-nav-pill a.on{font-weight:700}',
      '#t8p-nav-btn::before{content:"";position:absolute;inset:-12px;border-radius:50%;z-index:-1}',

      /* ── Dim overlay ── */
      '#t8p-dim{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:150;',
      'pointer-events:none;transition:background .5s ease}',
      'body.nav-open #t8p-dim{background:rgba(0,0,0,.6);pointer-events:all}',

      /* ── Sphere cards ── */
      '.t8p-cell{background:#000;position:absolute;border-radius:12px;overflow:hidden;cursor:pointer;',
      'text-decoration:none;will-change:transform;transform-style:preserve-3d;',
      'box-shadow:0 18px 50px rgba(0,0,0,.55)}',
      '.t8p-cell-media{position:absolute;inset:0;width:100%;height:100%}',
      '.t8p-cell-media img,.t8p-cell-media iframe{position:absolute;inset:0;',
      'width:100%;height:100%;object-fit:cover;transition:filter .45s;border:0}',
      '.t8p-cell img{background:#111;width:100%;height:100%;object-fit:cover;visibility:visible;transition:filter .45s}',
      '.t8p-cell[data-photo] img{filter:grayscale(100%)}',
      '.t8p-cell[data-photo]:hover img,.t8p-cell[data-photo].is-hov img{filter:grayscale(0%)}',
      '.t8p-cell::after{content:"";position:absolute;inset:-3px;border-radius:15px;',
      'background:var(--rb);opacity:0;transition:opacity .3s;pointer-events:none;z-index:-1}',
      '.t8p-cell:hover::after,.t8p-cell.is-hov::after{opacity:1}',
      '.t8p-cell{transition:opacity .3s}',
      '.t8p-cell-lbl{position:absolute;bottom:0;left:0;right:0;padding:7px 9px;',
      'background:linear-gradient(to top,rgba(8,8,8,.9),transparent);',
      'opacity:0;transform:translateY(4px);transition:opacity .3s,transform .3s;',
      'display:flex;align-items:flex-end;justify-content:space-between;z-index:4}',
      '.t8p-cell:hover .t8p-cell-lbl,.t8p-cell.is-hov .t8p-cell-lbl{opacity:1;transform:translateY(0)}',
      '.t8p-cell-name{font-size:8px;letter-spacing:.1em;color:var(--fg);font-weight:700;text-transform:uppercase}',
      '.t8p-cell-arr{font-size:12px;color:var(--fg)}',

      /* ── MOBILE HOME: vertical card list ── */
      '#t8p-mob-home{display:none;position:fixed;inset:0;background:var(--bg);overflow-y:auto;',
      '-webkit-overflow-scrolling:touch}',
      'body.is-home #t8p-mob-home{display:block}',
      '@media(max-width:767px){body.is-home #t8p-home{display:none!important}}',
      '@media(max-width:767px){body.is-home #t8p-mob-home{display:block!important}}',
      '#t8p-mob-header{position:sticky;top:0;z-index:100;padding:16px 20px;',
      'display:flex;align-items:center;justify-content:space-between;',
      'background:rgba(8,8,8,.9);backdrop-filter:blur(10px);',
      'border-bottom:1px solid var(--line)}',
      '#t8p-mob-wm{height:28px;display:flex;align-items:center}',
      '#t8p-mob-wm svg{height:100%;width:auto;fill:#f0ede6}',
      '#t8p-mob-nav{display:flex;gap:16px}',
      '#t8p-mob-nav a{font-size:9px;letter-spacing:.12em;color:var(--dim);',
      'text-decoration:none;font-weight:600}',
      '#t8p-mob-nav a:hover{color:var(--fg)}',
      '#t8p-mob-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;padding:2px}',
      '@media(max-width:420px){#t8p-mob-grid{grid-template-columns:1fr}}',
      '.t8p-mob-tile{position:relative;aspect-ratio:4/3;overflow:hidden;',
      'background:#111;cursor:pointer;text-decoration:none;display:block}',
      '.t8p-mob-tile img{position:absolute;inset:0;width:100%;height:100%;',
      'object-fit:cover;filter:grayscale(100%);transition:filter .3s}',
      '.t8p-mob-tile iframe{position:absolute;inset:-10%;width:120%;height:120%;',
      'border:none;pointer-events:none}',
      '.t8p-mob-tile:hover img,.t8p-mob-tile:active img{filter:grayscale(0%)}',
      '.t8p-mob-tile-lbl{position:absolute;bottom:0;left:0;right:0;',
      'background:linear-gradient(to top,rgba(8,8,8,.9),transparent);',
      'padding:20px 10px 8px;display:flex;justify-content:space-between;align-items:flex-end}',
      '.t8p-mob-tile-name{font-size:8px;letter-spacing:.1em;color:var(--fg);',
      'font-weight:700;text-transform:uppercase;line-height:1.3}',
      '.t8p-mob-foot{padding:40px 20px;text-align:center;',
      'font-size:8px;letter-spacing:.14em;color:var(--dim)}',

      /* ── Footer ticker ── */
      '#t8p-foot{position:fixed;bottom:0;left:0;right:0;z-index:9200;',
      'border-top:1px solid var(--line);background:rgba(8,8,8,.85);',
      'backdrop-filter:blur(10px);padding:8px 18px;',
      'display:flex;align-items:center;justify-content:space-between;pointer-events:none}',
      '#t8p-mq{overflow:hidden;flex:1;margin:0 18px}',
      '#t8p-mqi{display:inline-flex;gap:36px;animation:t8p-mq 22s linear infinite;',
      'font-size:8px;letter-spacing:.15em;color:var(--dim);white-space:nowrap}',
      '@keyframes t8p-mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}',
      '.t8p-fl,.t8p-fr{font-size:8px;letter-spacing:.1em;color:var(--dim);white-space:nowrap}',
      '#t8p-ck{font-variant-numeric:tabular-nums}',
      'body.is-home #t8p-ck{display:none}',
      '@media(max-width:767px){#t8p-foot{padding:6px 12px}',
      '#t8p-mq{margin:0 8px}.t8p-fl,.t8p-fr{display:none}}',

      /* ── PROJECT PAGE ── */
      '#t8p-pp{display:none;position:fixed;inset:0;z-index:8000;background:#000;overflow-y:auto}',
      'body.is-pp #t8p-pp{display:block}',
      'body.is-pp #siteWrapper{display:none!important}',
      '#t8p-pp-wm{position:fixed;top:0;left:0;right:0;z-index:9100;',
      'height:56px;display:flex;align-items:center;justify-content:center;',
      'background:rgba(240,237,230,0.08);backdrop-filter:blur(16px);',
      '-webkit-backdrop-filter:blur(16px);',
      'border-bottom:1px solid rgba(240,237,230,0.1);cursor:pointer;}',
      '#t8p-pp-wm svg{height:28px;width:auto;display:block;fill:#f0ede6}',
      '@media(max-width:767px){#t8p-pp-wm{height:44px}#t8p-pp-wm svg{height:20px}}',
      '.t8p-pp-hero{position:relative;width:100%;height:100vh;flex-shrink:0}',
      '#t8p-vp-main{position:absolute;inset:0;width:100%;height:100%;border:none;pointer-events:none}',
      '#t8p-ov{position:absolute;inset:0;z-index:1}',
      '.t8p-pp-bar{position:absolute;bottom:0;left:0;right:0;z-index:2;',
      'padding:11px 24px;display:flex;align-items:center;gap:16px;',
      'background:var(--blue)}',
      '.t8p-pp-bar .t8p-pp-t{font-size:11px;letter-spacing:.08em;font-weight:700;',
      'text-transform:uppercase;color:#fff;white-space:nowrap;overflow:hidden;',
      'text-overflow:ellipsis;flex-shrink:1}',
      '.t8p-pp-bar .t8p-pp-d{font-size:9px;letter-spacing:.06em;color:rgba(255,255,255,.85);',
      'flex:1;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '@media(max-width:767px){.t8p-pp-bar .t8p-pp-d{display:none}}',
      '#t8p-scrub-line{position:relative;height:3px;background:rgba(255,255,255,.08);',
      'cursor:pointer;flex-shrink:0}',
      '#t8p-scrub-time{position:absolute;left:0;top:0;height:100%;',
      'background:var(--blue);width:0;transition:width .1s linear}',

      /* ── Credits ── */
      '.t8p-credits-section{padding:48px 48px 0;max-width:800px;margin:0 auto}',
      '.t8p-credits-title{font-size:9px;letter-spacing:.2em;color:var(--dim);',
      'text-transform:uppercase;margin-bottom:20px;padding-bottom:12px;',
      'border-bottom:1px solid var(--line)}',
      '.t8p-credit-row{display:flex;gap:24px;padding:8px 0;border-bottom:1px solid var(--line)}',
      '.t8p-credit-role{font-size:9px;letter-spacing:.12em;color:var(--dim);',
      'width:180px;flex-shrink:0;text-transform:uppercase}',
      '.t8p-credit-name{font-size:9px;letter-spacing:.08em;color:var(--fg)}',
      '.t8p-credit-name[href]{text-decoration:none;transition:opacity .2s}',
      '.t8p-credit-name[href]:hover{opacity:.6}',
      '@media(max-width:767px){.t8p-credits-section{padding:32px 20px 0}',
      '.t8p-credit-row{gap:12px}.t8p-credit-role{width:120px}}',

      /* ── Controls ── */
      '#t8p-btns{position:fixed;top:18px;right:20px;z-index:9200;display:flex;gap:10px}',
      '.t8p-btn{width:44px;height:44px;border-radius:50%;cursor:pointer;position:relative;',
      'display:flex;align-items:center;justify-content:center}',
      '.t8p-btn-shape{position:absolute;inset:0;border-radius:50%;',
      'background:rgba(245,243,238,.95);backdrop-filter:blur(8px)}',
      '.t8p-btn-icon{position:relative;z-index:1;display:flex;align-items:center;justify-content:center}',
      '@media(max-width:767px){.t8p-btn{width:36px;height:36px}}',

      /* ── Dock / folder fan ── */
      '#t8p-dock{position:fixed;left:18px;top:50%;transform:translateY(-50%);',
      'z-index:9150;display:flex;flex-direction:column;gap:0;align-items:center}',
      '@media(max-width:767px){#t8p-dock{bottom:80px;top:auto;transform:none;left:16px}}',
      '.t8p-dock-stack{position:relative;width:62px;height:62px;cursor:pointer}',
      '.t8p-dock-stack .t8p-dock-card{position:absolute;width:62px;height:62px;',
      'border-radius:6px;overflow:hidden;background:#111;border:1px solid rgba(255,255,255,.08)}',
      '.t8p-dock-stack .t8p-dock-card img{width:100%;height:100%;object-fit:cover;opacity:.7}',
      '.t8p-dock-badge{position:absolute;bottom:-8px;right:-8px;background:#fff;color:#000;',
      'font-family:monospace;font-size:9px;font-weight:700;width:20px;height:20px;',
      'border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:10}',
      '@media(max-width:767px){.t8p-dock-stack,.t8p-dock-stack .t8p-dock-card{width:50px;height:50px}}',

      /* ── Panel ── */
      '#t8p-dock-panel{position:fixed;inset:0;background:#0a0a0a;z-index:9900;',
      'display:flex;flex-direction:column;opacity:0;pointer-events:none;',
      'transition:opacity .4s ease;overflow:hidden}',
      '#t8p-dock-panel.open{opacity:1;pointer-events:auto}',
      '#t8p-panel-topbar{display:flex;align-items:center;justify-content:space-between;',
      'padding:24px 40px;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0}',
      '@media(max-width:767px){#t8p-panel-topbar{padding:16px 20px}}',
      '#t8p-panel-wm{width:130px;height:44px;display:flex;align-items:center;',
      'justify-content:center;overflow:hidden}',
      '#t8p-panel-wm svg{width:100%;height:100%;fill:#f0ede6}',
      '#t8p-panel-close{width:36px;height:36px;border-radius:50%;',
      'border:1px solid rgba(255,255,255,.2);background:transparent;color:#fff;',
      'font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;',
      'transition:border-color .2s}',
      '#t8p-panel-close:hover{border-color:rgba(255,255,255,.6);background:rgba(255,255,255,.06)}',
      '#t8p-panel-body{flex:1;overflow-y:auto;padding:40px 40px 80px;',
      'scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent}',
      '@media(max-width:767px){#t8p-panel-body{padding:24px 20px 60px}}',
      '.t8p-panel-hdr{margin-bottom:32px;border-bottom:1px solid rgba(255,255,255,.07);padding-bottom:28px}',
      '.t8p-panel-index{font-family:monospace;font-size:10px;letter-spacing:.15em;',
      'color:rgba(255,255,255,.3);text-transform:uppercase;margin-bottom:12px}',
      '.t8p-panel-title{font-size:clamp(22px,3vw,36px);font-weight:700;color:#fff;',
      'letter-spacing:-.01em;line-height:1.1;margin-bottom:14px}',
      '.t8p-panel-meta{display:flex;gap:20px;flex-wrap:wrap;font-family:monospace;',
      'font-size:10px;letter-spacing:.12em;color:rgba(255,255,255,.35);',
      'text-transform:uppercase;margin-bottom:20px}',
      '.t8p-panel-desc{font-family:monospace;font-size:11px;letter-spacing:.06em;',
      'line-height:1.7;color:rgba(255,255,255,.5);text-transform:uppercase}',
      '.t8p-panel-slab{font-family:monospace;font-size:9px;letter-spacing:.2em;',
      'color:rgba(255,255,255,.2);text-transform:uppercase;margin-bottom:16px;',
      'padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.05)}',
      '.t8p-panel-videos{display:flex;gap:16px;margin-bottom:48px;flex-wrap:wrap}',
      '.t8p-panel-vblock{flex:1;min-width:280px}',
      '@media(max-width:767px){.t8p-panel-vblock{min-width:100%}}',
      '.t8p-panel-vlab{font-family:monospace;font-size:9px;letter-spacing:.15em;',
      'color:rgba(255,255,255,.25);text-transform:uppercase;margin-bottom:8px}',
      '.t8p-panel-vframe{position:relative;width:100%;padding-bottom:56.25%;',
      'border-radius:4px;overflow:hidden;background:#111}',
      '.t8p-panel-vframe iframe{position:absolute;inset:0;width:100%;height:100%;border:none}',
      '.t8p-panel-disc{margin-bottom:48px}',
      '.t8p-panel-disc-block{background:rgba(255,255,255,.03);',
      'border:1px solid rgba(255,255,255,.06);border-radius:4px;padding:20px 24px}',
      '.t8p-panel-disc-lang{font-family:monospace;font-size:9px;letter-spacing:.2em;',
      'color:rgba(255,255,255,.2);text-transform:uppercase;margin-bottom:8px}',
      '.t8p-panel-disc-text{font-family:monospace;font-size:9px;line-height:1.8;',
      'color:rgba(255,255,255,.3);letter-spacing:.04em}',
      '.t8p-panel-disc-div{height:1px;background:rgba(255,255,255,.05);margin:16px 0}',
      '.t8p-panel-grid{columns:3;column-gap:8px;margin-bottom:48px}',
      '@media(max-width:900px){.t8p-panel-grid{columns:2}}',
      '@media(max-width:560px){.t8p-panel-videos{flex-direction:column}.t8p-panel-grid{columns:1}}',
      '.t8p-panel-tile{break-inside:avoid;margin-bottom:8px;border-radius:3px;',
      'overflow:hidden;cursor:pointer;background:#111}',
      '.t8p-panel-tile img{display:block;width:100%;height:auto;opacity:.88;transition:opacity .2s}',
      '.t8p-panel-tile:hover img{opacity:1}',

      /* ── Lightbox ── */
      '#t8p-lb{position:fixed;inset:0;background:rgba(0,0,0,.96);z-index:10000;',
      'display:none;flex-direction:column;align-items:center;justify-content:center}',
      '#t8p-lb.open{display:flex}',
      '#t8p-lb-img{max-width:88vw;max-height:80vh;object-fit:contain;border-radius:2px;user-select:none}',
      '@media(max-width:767px){#t8p-lb-img{max-width:96vw;max-height:75vh}}',
      '#t8p-lb-close{position:fixed;top:24px;right:32px;width:36px;height:36px;',
      'border-radius:50%;border:1px solid rgba(255,255,255,.25);background:transparent;',
      'color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;',
      'justify-content:center;z-index:10001;transition:border-color .2s}',
      '#t8p-lb-close:hover{border-color:rgba(255,255,255,.7)}',
      '.t8p-lb-nav{position:fixed;top:50%;transform:translateY(-50%);width:44px;height:44px;',
      'border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(0,0,0,.4);',
      'color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;',
      'justify-content:center;z-index:10001;transition:border-color .2s,background .2s;user-select:none}',
      '.t8p-lb-nav:hover{border-color:rgba(255,255,255,.7);background:rgba(0,0,0,.7)}',
      '#t8p-lb-prev{left:24px}#t8p-lb-next{right:24px}',
      '@media(max-width:767px){#t8p-lb-prev{left:8px}#t8p-lb-next{right:8px}',
      '.t8p-lb-nav{width:36px;height:36px;font-size:14px}}',
      '#t8p-lb-counter{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);',
      'font-family:monospace;font-size:10px;letter-spacing:.15em;',
      'color:rgba(255,255,255,.35);z-index:10001}',
    ].join('');
    document.head.appendChild(style);
  }

  /* ──────────────────────────────────────────────────────────
     INJECT HTML STRUCTURE
  ────────────────────────────────────────────────────────── */
  /* ── SVG assets ── */
  var CIRCLE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393 393"><g fill="#f0ede6" transform="translate(-81.5,-558.25)"><path d="M 278 558.25 L 278 752.355469 L 180.519531 584.101562 C 121.363281 617.96875 81.5 681.703125 81.5 754.75 C 81.5 863.277344 169.476562 951.25 278 951.25 C 386.523438 951.25 474.5 863.277344 474.5 754.75 C 474.5 646.226562 386.523438 558.25 278 558.25"/></g></svg>';
  var WM_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 653.2 106"><g fill="#f0ede6" transform="translate(-213.4,-475.5)"><path d="M 240.992188 480.894531 C 228.753906 480.894531 218.792969 490.855469 218.792969 503.097656 L 218.792969 553.898438 C 218.792969 566.140625 228.753906 576.097656 240.992188 576.097656 L 419.777344 576.097656 C 432.015625 576.097656 441.976562 566.140625 441.976562 553.898438 L 441.976562 503.097656 C 441.976562 490.855469 432.015625 480.894531 419.777344 480.894531 Z M 419.777344 581.484375 L 240.992188 581.484375 C 225.785156 581.484375 213.410156 569.109375 213.410156 553.898438 L 213.410156 503.097656 C 213.410156 487.882812 225.785156 475.507812 240.992188 475.507812 L 419.777344 475.507812 C 434.984375 475.507812 447.359375 487.882812 447.359375 503.097656 L 447.359375 553.898438 C 447.359375 569.109375 434.984375 581.484375 419.777344 581.484375"/><path d="M 278.191406 556.523438 L 260.210938 556.523438 L 260.210938 513.472656 L 242.949219 513.472656 L 242.949219 500.46875 L 296.355469 500.46875 L 296.355469 513.472656 L 278.191406 513.472656 Z"/><path d="M 335.375 516.761719 C 335.375 512.875 334.742188 511.679688 326.023438 511.679688 C 318.652344 511.679688 316.941406 512.28125 316.941406 517.285156 C 316.941406 522.070312 319.460938 522.59375 326.023438 522.59375 C 333.664062 522.59375 335.375 521.996094 335.375 516.761719 M 315.683594 539.410156 C 315.683594 544.265625 318.113281 545.3125 325.84375 545.3125 C 335.914062 545.3125 336.363281 544.117188 336.363281 539.183594 C 336.363281 533.953125 335.195312 533.429688 325.84375 533.429688 C 317.574219 533.429688 315.683594 534.101562 315.683594 539.410156 M 298.601562 541.050781 C 298.601562 534.625 302.289062 528.421875 310.828125 528.121094 L 310.828125 527.597656 C 302.648438 525.882812 299.859375 521.917969 299.859375 514.820312 C 299.859375 501.144531 312.808594 500.019531 326.023438 500.019531 C 340.5 500.019531 352.457031 501.070312 352.457031 515.492188 C 352.457031 523.042969 350.386719 525.429688 342.207031 527.597656 L 342.207031 528.121094 C 350.925781 529.09375 353.445312 534.402344 353.445312 541.050781 C 353.445312 555.851562 341.128906 556.972656 326.023438 556.972656 C 311.636719 556.972656 298.601562 555.625 298.601562 541.050781"/><path d="M 391.207031 529.167969 C 398.3125 528.945312 399.300781 528.273438 399.300781 521.023438 C 399.300781 515.269531 398.222656 513.476562 391.207031 513.476562 L 378.890625 513.476562 L 378.890625 529.167969 Z M 360.90625 556.523438 L 360.90625 500.46875 L 394.804688 500.46875 C 411.527344 500.46875 417.820312 506.375 417.820312 521.023438 C 417.820312 536.792969 413.59375 542.175781 394.804688 542.175781 L 378.890625 542.175781 L 378.890625 556.523438 Z"/><path d="M 503.535156 522.441406 C 523.496094 523.640625 528.441406 525.730469 528.441406 538.585938 C 528.441406 547.851562 528.890625 556.972656 499.222656 556.972656 C 482.050781 556.972656 470.632812 556.671875 470.632812 538.289062 L 487.894531 538.289062 C 487.894531 544.117188 490.410156 544.714844 499.222656 544.714844 C 507.671875 544.714844 510.460938 544.265625 510.460938 539.558594 C 510.460938 534.699219 509.472656 534.777344 501.019531 534.324219 L 497.0625 534.101562 C 480.429688 533.128906 470.722656 533.207031 470.722656 517.136719 C 470.722656 501.070312 481.597656 500.023438 499.222656 500.023438 C 513.96875 500.023438 526.554688 500.246094 526.554688 515.714844 L 526.554688 518.035156 L 509.289062 518.035156 C 509.289062 512.28125 506.414062 512.28125 499.222656 512.28125 C 489.511719 512.28125 488.703125 513.921875 488.703125 517.0625 C 488.703125 521.546875 491.308594 521.695312 496.074219 521.996094 Z"/><path d="M 564.316406 556.523438 L 546.335938 556.523438 L 546.335938 513.472656 L 529.070312 513.472656 L 529.070312 500.46875 L 582.476562 500.46875 L 582.476562 513.472656 L 564.316406 513.472656 Z"/><path d="M 643.523438 500.46875 L 643.523438 537.839844 C 643.523438 552.785156 635.074219 556.96875 615.292969 556.96875 C 588.320312 556.96875 585.445312 551.292969 585.445312 537.839844 L 585.445312 500.46875 L 603.425781 500.46875 L 603.425781 537.539062 C 603.425781 543.894531 607.742188 543.96875 615.292969 543.96875 C 622.9375 543.96875 625.542969 543.445312 625.542969 536.867188 L 625.542969 500.46875 Z"/><path d="M 669.058594 543.519531 L 684.792969 543.519531 C 691.445312 543.519531 693.875 539.855469 693.875 533.953125 L 693.875 522.21875 C 693.875 514.96875 691.085938 513.472656 684.792969 513.472656 L 669.058594 513.472656 Z M 651.078125 500.46875 L 685.246094 500.46875 C 704.035156 500.46875 712.394531 506.300781 712.394531 522.21875 L 712.394531 533.953125 C 712.394531 549.273438 706.460938 556.523438 687.671875 556.523438 L 651.078125 556.523438 Z"/><path d="M 736.941406 556.523438 L 718.960938 556.523438 L 718.960938 500.46875 L 736.941406 500.46875 Z"/><path d="M 786.660156 534.773438 L 786.660156 522.144531 C 786.660156 513.847656 783.335938 513.027344 773.984375 513.027344 C 764.632812 513.027344 761.578125 513.847656 761.304688 522.144531 L 761.304688 534.773438 C 761.578125 543.144531 764.632812 543.96875 773.984375 543.96875 C 783.335938 543.96875 786.660156 543.144531 786.660156 534.773438 M 742.785156 536.417969 L 742.785156 520.574219 C 742.785156 503.308594 755.734375 500.023438 773.984375 500.023438 C 792.234375 500.023438 805.179688 503.308594 805.179688 520.574219 L 805.179688 536.417969 C 805.179688 553.683594 792.234375 556.972656 773.984375 556.972656 C 755.734375 556.972656 742.785156 553.683594 742.785156 536.417969"/><path d="M 841.6875 522.441406 C 861.644531 523.640625 866.589844 525.730469 866.589844 538.585938 C 866.589844 547.851562 867.039062 556.972656 837.371094 556.972656 C 820.199219 556.972656 808.78125 556.671875 808.78125 538.289062 L 826.042969 538.289062 C 826.042969 544.117188 828.558594 544.714844 837.371094 544.714844 C 845.820312 544.714844 848.609375 544.265625 848.609375 539.558594 C 848.609375 534.699219 847.621094 534.777344 839.167969 534.324219 L 835.214844 534.101562 C 818.582031 533.128906 808.871094 533.207031 808.871094 517.136719 C 808.871094 501.070312 819.75 500.023438 837.371094 500.023438 C 852.117188 500.023438 864.703125 500.246094 864.703125 515.714844 L 864.703125 518.035156 L 847.441406 518.035156 C 847.441406 512.28125 844.5625 512.28125 837.371094 512.28125 C 827.660156 512.28125 826.851562 513.921875 826.851562 517.0625 C 826.851562 521.546875 829.460938 521.695312 834.222656 521.996094 Z"/></g></svg>';

  function injectHTML() {
    /* cursor */
    var cur = el('div', {id:'t8p-cur'});
    document.documentElement.appendChild(cur);

    /* icon - circle mark SVG */
    var icon = el('a', {id:'t8p-icon', href:'/'});
    icon.innerHTML = CIRCLE_SVG;
    document.body.appendChild(icon);

    /* desktop home */
    var home = el('div', {id:'t8p-home'});
    home.innerHTML = [
      '<div id="t8p-world"></div>',
      '<div id="t8p-dim"></div>',
      '<div id="t8p-center">',
        '<div id="t8p-wm-wrap"></div>',
        '<div id="t8p-nav">',
          '<div id="t8p-nav-pill">',
            '<a href="/" class="on">HOME</a>',
            '<a href="/projects">PROJECTS</a>',
            '<a href="/clients">CLIENTS</a>',
            '<a href="/contact">CONTACT</a>',
          '</div>',
          '<button id="t8p-nav-btn" aria-label="Menu">',
            CIRCLE_SVG,
          '</button>',
        '</div>',
      '</div>',
      '<div id="t8p-foot">',
        '<span class="t8p-fl">MIA</span>',
        '<div id="t8p-mq"><div id="t8p-mqi"></div></div>',
        '<span class="t8p-fr"><span id="t8p-ck"></span></span>',
      '</div>',
    ].join('');
    document.body.appendChild(home);

    /* mobile home */
    var mobHome = el('div', {id:'t8p-mob-home'});
    var mobWmDiv = el('div', {id:'t8p-mob-wm'}); mobWmDiv.innerHTML = WM_SVG;
    var mobHeader = el('div', {id:'t8p-mob-header'});
    mobHeader.appendChild(mobWmDiv);
    var mobNav = el('nav', {id:'t8p-mob-nav'});
    mobNav.innerHTML = '<a href="/projects">PROJECTS</a><a href="/clients">CLIENTS</a><a href="/contact">CONTACT</a>';
    mobHeader.appendChild(mobNav);
    mobHome.appendChild(mobHeader);
    var mobGrid = el('div', {id:'t8p-mob-grid'}); mobHome.appendChild(mobGrid);
    var mobFoot = el('div', {className:'t8p-mob-foot'}); mobFoot.innerHTML = 'T8P STUDIOS &middot; MIAMI FL &middot; EST 2016'; mobHome.appendChild(mobFoot);
    document.body.appendChild(mobHome);

    /* project page */
    var pp = el('div', {id:'t8p-pp'});
    pp.innerHTML = [
      '<a id="t8p-bk" href="/">&#8592; BACK</a>',
      '<div id="t8p-pp-logo"></div>',
      '<div id="t8p-pp-video"></div>',
      '<div id="t8p-dock"></div>',
      '<div id="t8p-pp-ctrls"></div>',
      '<div id="t8p-pp-bar"></div>',
      '<div id="t8p-dock-panel">',
        '<div id="t8p-dock-panel-close"><svg viewBox="0 0 24 24"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg></div>',
        '<div id="t8p-dock-panel-inner">',
          '<div id="t8p-dock-panel-head"></div>',
          '<div id="t8p-dock-gallery"></div>',
        '</div>',
      '</div>',
    ].join('');
    document.body.appendChild(pp);
    var ppLogoEl = document.getElementById('t8p-pp-logo');
    if (ppLogoEl) ppLogoEl.innerHTML = WM_SVG;

    /* contact section (visible on main site pages) */
    var co = el('div', {id:'t8p-co'});
    co.innerHTML = [
      '<h2>PREFER A STRAIGHT LINE?<br>EMAIL OR CALL US.</h2>',
      '<div class="t8p-clinks">',
        '<a class="t8p-clink" href="mailto:info@t8pstudios.com">EMAIL &#8599;</a>',
        '<a class="t8p-clink" href="tel:+17867046393">CALL &#8599;</a>',
      '</div>',
    ].join('');
    document.body.appendChild(co);
  }

  /* ──────────────────────────────────────────────────────────
     HELPERS
  ────────────────────────────────────────────────────────── */
  function el(tag, attrs) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function(k){ e[k] = attrs[k]; });
    return e;
  }
  function img(src, alt) {
    var i = document.createElement('img');
    i.src = src; i.alt = alt || '';
    return i;
  }

  /* ──────────────────────────────────────────────────────────
     CLOCK
  ────────────────────────────────────────────────────────── */
  function startClock(el) {
    if (!el) return;
    function tick() {
      var d = new Date(new Date().toLocaleString('en', {timeZone:'America/New_York'}));
      var h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
      var ap = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      el.textContent = (h<10?'0':'')+h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s+' '+ap;
    }
    tick(); setInterval(tick, 1000);
  }

  /* ──────────────────────────────────────────────────────────
     MARQUEE
  ────────────────────────────────────────────────────────── */
  function buildMarquee() {
    var items = ['T8P STUDIOS','MIAMI FL','VIDEO PRODUCTION','CREATIVE DIRECTION',
                 'MUSIC VIDEOS','BRAND CONTENT','AI PRODUCTION','EST 2016'];
    var h = '';
    for (var i = 0; i < 3; i++) {
      items.forEach(function(x){
        h += '<span>'+x+'</span><span style="opacity:.3;padding:0 6px">&middot;</span>';
      });
    }
    var mqi = document.getElementById('t8p-mqi');
    if (mqi) mqi.innerHTML = h;
  }

  /* ──────────────────────────────────────────────────────────
     CURSOR (desktop)
  ────────────────────────────────────────────────────────── */
  function initCursor() {
    var cur = document.getElementById('t8p-cur');
    if (!cur || IS_MOBILE) return;
    var cx = innerWidth/2, cy = innerHeight/2, mx = cx, my = cy;
    document.addEventListener('mousemove', function(e){ mx = e.clientX; my = e.clientY; }, true);
    function tick() {
      cx += (mx - cx) * .22;
      cy += (my - cy) * .22;
      cur.style.left = cx + 'px';
      cur.style.top  = cy + 'px';
      requestAnimationFrame(tick);
    }
    tick();
    function bindHover() {
      document.querySelectorAll('a,button,.t8p-cell,.t8p-mob-tile,.t8p-dock-stack,.t8p-btn').forEach(function(e){
        if (e._t8p) return; e._t8p = 1;
        e.addEventListener('mouseenter', function(){ cur.classList.add('big'); });
        e.addEventListener('mouseleave', function(){ cur.classList.remove('big'); });
      });
    }
    bindHover(); setInterval(bindHover, 1200);
  }

  /* ──────────────────────────────────────────────────────────
     NAV
  ────────────────────────────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById('t8p-nav');
    var btn = document.getElementById('t8p-nav-btn');
    var dim = document.getElementById('t8p-dim');
    if (!nav || !btn) return;
    var P = location.pathname.replace(/\/+$/, '') || '/';
    nav.querySelectorAll('a').forEach(function(a){
      var h = (a.getAttribute('href')||'').replace(/\/+$/,'') || '/';
      a.classList.toggle('on', h === P || (h !== '/' && P.indexOf(h) === 0));
    });
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var o = nav.classList.toggle('open');
      document.body.classList.toggle('nav-open', o);
    });
    document.addEventListener('click', function(e){
      if (nav.classList.contains('open') && !nav.contains(e.target)) {
        nav.classList.remove('open');
        document.body.classList.remove('nav-open');
      }
    });
    if (dim) dim.addEventListener('click', function(){
      nav.classList.remove('open');
      document.body.classList.remove('nav-open');
    });
  }

  /* ──────────────────────────────────────────────────────────
     BUILD MOBILE HOME
  ────────────────────────────────────────────────────────── */
  function buildMobileHome() {
    document.body.classList.add('is-home');
    buildMarquee();
    startClock(document.getElementById('t8p-ck'));
    injectWordmark(document.getElementById('t8p-mob-wm'));

    var grid = document.getElementById('t8p-mob-grid');
    if (!grid) return;
    var DATA = window._t8pDATA || {};

    Object.keys(DATA).filter(function(sl){
      return DATA[sl] && DATA[sl].v !== undefined;
    }).forEach(function(sl){
      var d = DATA[sl];
      var vids = (d.v || []);
      var tile = el('a', {className:'t8p-mob-tile', href:'/'+sl});

      /* thumbnail img */
      var ph = document.createElement('img');
      ph.alt = (d.t || sl).replace(/^"|"$/g,'');
      if (vids.length > 0) {
        var vid = typeof vids[0] === 'string' ? parseInt(vids[0],10) : vids[0];
        ph.src = 'https://vumbnail.com/' + vid + '.jpg';
      }
      tile.appendChild(ph);

      /* label */
      var lbl = el('div', {className:'t8p-mob-tile-lbl'});
      var nm = el('div', {className:'t8p-mob-tile-name'});
      nm.textContent = (d.t || sl).replace(/^"|"$/g,'');
      lbl.appendChild(nm);
      tile.appendChild(lbl);

      grid.appendChild(tile);
    });
  }

  /* ──────────────────────────────────────────────────────────
     BUILD DESKTOP HOME (sphere)
  ────────────────────────────────────────────────────────── */
  function buildDesktopHome() {
    document.body.classList.add('is-home');
    buildMarquee();
    startClock(document.getElementById('t8p-ck'));
    injectWordmark(document.getElementById('t8p-wm-wrap'));
    initNavShield();

    var DATA = window._t8pDATA || {};
    var items = Object.keys(DATA).filter(function(sl){
      var d = DATA[sl];
      /* only show projects that have at least one video */
      return d && d.v && d.v.length > 0;
    }).map(function(sl){
      var d = DATA[sl];
      return {
        href: '/'+sl, src:'', name: sl, slug: sl,
        vids: (d.v || []).map(function(x){ return typeof x==='string'?parseInt(x,10):x; }),
        ratio: window._t8pRATIOS && window._t8pRATIOS[sl] ? window._t8pRATIOS[sl] : null
      };
    });

    buildGrid(items);

    /* Fetch thumbnails for ALL cards via staggered HTML scrape */
    var LOGO_UUID = 'd4325d9d-7519-4511-9a6d-61a47a7b3772';
    var FAVICON_UUID = 'ac99735c-ce86-40fe-9c43-cf78ce4c1e9e';
    function fetchThumb(cell, slug) {
      var item = (window._t8pDATA||{})[slug];
      var vids = item ? (item.v||[]) : [];
      var vid0 = vids.length > 0 ? (typeof vids[0]==='string'?parseInt(vids[0],10):vids[0]) : 0;
      fetch('/' + slug)
        .then(function(r){ return r.text(); })
        .then(function(html){
          var matches = html.match(/images\.squarespace-cdn\.com\/content\/[^"'\s?]+/g) || [];
          var seen = {};
          var found = false;
          for (var i = 0; i < matches.length; i++) {
            var u = matches[i];
            if (u.indexOf(LOGO_UUID) > -1) continue;
            if (u.indexOf(FAVICON_UUID) > -1) continue;
            if (u.match(/\.(ico|svg|gif)$/i)) continue;
            var base = u.split('?')[0];
            if (!seen[base]) {
              seen[base] = true;
              var img = cell.querySelector('img');
              if (img) { img.src = 'https://' + base + '?format=600w'; found = true; }
              return;
            }
          }
          /* fallback: vumbnail for video projects */
          if (!found && vid0) {
            var img = cell.querySelector('img');
            if (img) img.src = 'https://vumbnail.com/' + vid0 + '.jpg';
          }
        }).catch(function(){
          /* last resort */
          if (vid0) {
            var img = cell.querySelector('img');
            if (img) img.src = 'https://vumbnail.com/' + vid0 + '.jpg';
          }
        });
    }
    /* stagger fetches - 5 concurrent bursts */
    var allCells = Array.from(document.querySelectorAll('.t8p-cell'));
    allCells.forEach(function(cell, i) {
      var slug = (cell.getAttribute('href')||'').replace(/[/]/g,'');
      if (!slug) return;
      setTimeout(function(){ fetchThumb(cell, slug); }, i * 80);
    });
  }

  function injectWordmark(container) {
    if (!container) return;
    container.innerHTML = WM_SVG;
    var svg = container.querySelector('svg');
    if (svg) svg.style.cssText = 'width:100%;height:auto;display:block;fill:#f0ede6';
  }

  function initNavShield() {
    var home = document.getElementById('t8p-home');
    var btn  = document.getElementById('t8p-nav-btn');
    var nav  = document.getElementById('t8p-nav');
    if (!home || !btn || !nav) return;
    var shield = el('div', {id:'t8p-nav-shield'});
    shield.style.cssText = 'position:fixed;width:76px;height:76px;border-radius:50%;z-index:9999;cursor:pointer';
    function pos() {
      var r = btn.getBoundingClientRect();
      shield.style.left = (r.left + r.width/2 - 38) + 'px';
      shield.style.top  = (r.top  + r.height/2 - 38) + 'px';
    }
    pos(); window.addEventListener('resize', pos); setInterval(pos, 500);
    shield.addEventListener('click', function(e){
      e.stopPropagation(); e.preventDefault();
      var o = nav.classList.toggle('open');
      document.body.classList.toggle('nav-open', o);
    });
    home.appendChild(shield);
  }

  /* ──────────────────────────────────────────────────────────
     BUILD GRID / SPHERE
  ────────────────────────────────────────────────────────── */
  function buildGrid(items) {
    var world = document.getElementById('t8p-world');
    if (!world) return;

    var sphere = document.createElement('div');
    sphere.id = 't8p-sphere';
    world.appendChild(sphere);

    var W = window.innerWidth, H = window.innerHeight;
    var cx = W/2, cy = H/2;

    var rings = [{r:.28,n:5,w:256},{r:.50,n:8,w:228},{r:.72,n:9,w:200},{r:.94,n:6,w:176}];
    var cells = [];
    var idx = 0;
    var ordered = items;

    for (var ri = 0; ri < rings.length && idx < ordered.length; ri++) {
      var ring = rings[ri];
      var count = Math.min(ring.n, ordered.length - idx);
      var angStep = (Math.PI*2) / ring.n;
      var angOff = ri * 0.42;
      for (var k = 0; k < count && idx < ordered.length; k++, idx++) {
        var it = ordered[idx];
        var ang = angOff + k * angStep;
        var jitter = Math.sin(idx*2.6) * 0.018;
        var rad = ring.r + jitter;
        var nx = Math.cos(ang), ny = Math.sin(ang);
        var px = cx + nx * rad * W * 0.32;
        var py = cy + ny * rad * H * 0.40;
        var baseW = ring.w * (0.96 + Math.sin(idx*3.1) * 0.04);
        var depthZ = ri===0 ? -120 : ri===1 ? -60 : ri===2 ? 0 : 50;
        var rotY = (-nx) * 12, rotX = ny * 8;
        var rotZ = Math.sin(idx*2.1) * 2.5;
        /* use actual video ratio if available, fallback to 16:9 */
        var rawRatio = it.ratio; /* e.g. 1.777 for 16:9, 1.333 for 4:3 */
        var defR = rawRatio ? (1 / rawRatio) : (9/16);

        var cell = el('a', {className:'t8p-cell', href:it.href});
        if (it.vids.length === 0) cell.setAttribute('data-photo','1');
        cell.style.width  = Math.max(285, baseW) + 'px';
        cell.style.height = (Math.max(285, baseW) * defR) + 'px';
        cell.style.left   = '0px';
        cell.style.top    = '0px';
        cell._px = px; cell._py = py; cell._z = depthZ;
        cell._rx = rotX; cell._ry = rotY; cell._rz = rotZ;
        cell._baseW = Math.max(285, baseW);
        cell._h = Math.max(285, baseW) * defR;

        var media = el('div', {className:'t8p-cell-media'});
        var image = el('img', {});
        image.src = it.src || '';
        image.alt = it.name;
        image.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1';
        image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        media.appendChild(image);
        /* Vimeo autoplay iframe — fades in over thumbnail */
        (function(slug, vids){
          var d = (window._t8pDATA||{})[slug] || {};
          var hashes = d.h || {};
          var vid = vids[0];
          var hs = hashes[String(vid)] ? '?h=' + hashes[String(vid)] + '&' : '?';
          var ifr = document.createElement('iframe');
          ifr.setAttribute('frameborder','0');
          ifr.setAttribute('allow','autoplay; fullscreen; picture-in-picture');
          ifr.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;z-index:2;opacity:0;transition:opacity 1.2s';
          /* delay src set to stagger loads */
          ifr.src = 'https://player.vimeo.com/video/'+vid+hs+'background=1&autoplay=1&loop=1&muted=1&autopause=0&playsinline=1';
          ifr.addEventListener('load', function(){ ifr.style.opacity='1'; });
          media.appendChild(ifr);
        })(it.slug, it.vids);

        cell.appendChild(media);

        var lbl = el('div', {className:'t8p-cell-lbl'});
        var d = (window._t8pDATA||{})[it.slug];
        var title = d ? (d.t||it.name).replace(/^"|"$/g,'') : it.name;
        lbl.innerHTML = '<span class="t8p-cell-name">'+title+'</span><span class="t8p-cell-arr">&#8599;</span>';
        cell.appendChild(lbl);
        sphere.appendChild(cell);
        cells.push(cell);
      }
    }

    /* position cells */
    function positionCell(c) {
      var x = c._px - c._baseW/2;
      var y = c._py - c._h/2;
      c.style.transform = 'translate3d('+x+'px,'+y+'px,'+c._z+'px) rotateX('+c._rx+'deg) rotateY('+c._ry+'deg) rotateZ('+c._rz+'deg)';
    }
    cells.forEach(positionCell);

    /* collision relaxation */
    function relax() {
      var n = cells.length;
      var PAD = 80, LW = 640, LH = 200;
      for (var t = 0; t < 160; t++) {
        var moved = 0;
        for (var i = 0; i < n; i++) {
          for (var j = i+1; j < n; j++) {
            var A = cells[i], B = cells[j];
            var dx = B._px-A._px, dy = B._py-A._py;
            var minX = (A._baseW+B._baseW)/2+PAD;
            var minY = (A._h+B._h)/2+PAD;
            var ox = minX-Math.abs(dx), oy = minY-Math.abs(dy);
            if (ox > 0 && oy > 0) {
              if (ox < oy) { var p=ox/2*(dx<0?-1:1); A._px-=p; B._px+=p; }
              else { var p2=oy/2*(dy<0?-1:1); A._py-=p2; B._py+=p2; }
              moved++;
            }
          }
        }
        for (var k = 0; k < n; k++) {
          var c = cells[k], hw=c._baseW/2, hh=c._h/2;
          var ddx=c._px-cx, ddy=c._py-cy;
          var lx=(LW/2+hw)-Math.abs(ddx), ly=(LH/2+hh)-Math.abs(ddy);
          if (lx>0&&ly>0) {
            if (lx/(LW/2+hw)<ly/(LH/2+hh)) c._px+=(ddx>=0?lx:-lx);
            else c._py+=(ddy>=0?ly:-ly);
            moved++;
          }
        }
        if (moved===0) break;
      }
      cells.forEach(positionCell);
    }
    [300,700,1200,1800,2600].forEach(function(ms){ setTimeout(relax,ms); });

    /* 3D hit-test hover */
    var hovered = null;
    function cardAt(px,py) {
      for (var i=cells.length-1;i>=0;i--) {
        var r=cells[i].getBoundingClientRect();
        if(px>=r.left&&px<=r.right&&py>=r.top&&py<=r.bottom) return cells[i];
      }
      return null;
    }
    document.addEventListener('mousemove', function(e){
      var c = cardAt(e.clientX, e.clientY);
      if (c !== hovered) {
        if (hovered) hovered.classList.remove('is-hov');
        hovered = c;
        if (hovered) hovered.classList.add('is-hov');
      }
    });
    document.addEventListener('click', function(e){
      if (document.body.classList.contains('nav-open')) return;
      var c = cardAt(e.clientX, e.clientY);
      if (c) { e.preventDefault(); window.location.href = c.getAttribute('href'); }
    }, true);

    /* sphere rotation — approved binary ease model */
    function clamp(v,a,b){ return v<a?a:v>b?b:v; }
    var EASE_MOVE = 0.22;   /* snappy follow while cursor moving */
    var EASE_SETTLE = 0.005; /* long slow drift when cursor stops */
    var ROT = 10;            /* max rotation degrees */

    var mx=0, my=0, tx=0, ty=0, lastMove=0;

    function applySphere() {
      sphere.style.transform =
        'rotateY('+(tx*ROT)+'deg) rotateX('+(-ty*ROT*.7)+'deg)';
    }

    document.addEventListener('mousemove', function(e){
      lastMove = performance.now();
      /* normalize to [-1,1], power curve for natural feel */
      var nx = clamp((e.clientX/W - .5) * 2, -1, 1);
      var ny = clamp((e.clientY/H - .5) * 2, -1, 1);
      mx = Math.sign(nx) * Math.pow(Math.abs(nx), 1.2);
      my = Math.sign(ny) * Math.pow(Math.abs(ny), 1.2);
    }, {passive:true});

    (function spin(){
      /* binary ease: fast while moving, long drift when stopped */
      var E = (performance.now() - lastMove < 200) ? EASE_MOVE : EASE_SETTLE;
      /* target stays where cursor last was — never springs back */
      tx += (mx - tx) * E;
      ty += (my - ty) * E;
      tx = clamp(tx, -1, 1);
      ty = clamp(ty, -1, 1);
      applySphere();
      requestAnimationFrame(spin);
    })();
  }

  /* ──────────────────────────────────────────────────────────
     BUILD PROJECT PAGE
  ────────────────────────────────────────────────────────── */
  function buildProject() {
    document.body.classList.add('is-pp');
    var oc = document.getElementById('t8p-cursor');
    if (oc) oc.remove();

    /* state vars for scrub/cursor */
    var state = 'paused', scrubPct = 0, scrubLineRef = null;

    var DATA = window._t8pDATA || {};
    var sl = location.pathname.replace(/[/]/g,'');
    var d = DATA[sl] || {v:[],t:'',d:'',r:'',c:{}};
    var title   = (d.t || sl).replace(/^"|"$/g,'');
    var desc    = d.d || '';
    var release = d.r || '';
    var vids    = (d.v || []).map(function(x){ return typeof x==='string'?parseInt(x,10):x; });
    var credits = d.c || {};
    var hashes  = d.h || {};

    var pp = document.getElementById('t8p-pp');
    if (!pp) return;
    pp.innerHTML = '';

    var ck = document.getElementById('t8p-ck');
    if (ck) ck.style.setProperty('display','none','important');

    /* custom cursor */
    var cur = el('div', {id:'t8p-cursor'});
    cur.innerHTML = PSVG;
    cur.style.cssText = 'position:fixed;top:-100px;left:-100px;z-index:99999;pointer-events:none;transform:translate(-50%,-50%);opacity:0;transition:opacity .1s';
    if (!IS_MOBILE) document.body.appendChild(cur);

    if (!IS_MOBILE) {
      document.addEventListener('mousemove', function(e){
        cur.style.left = e.clientX+'px'; cur.style.top = e.clientY+'px';
        var elAt = document.elementFromPoint(e.clientX,e.clientY);
        var onOv = elAt && elAt.id==='t8p-ov';
        var onScr = elAt && (elAt.id==='t8p-scrub-line' || elAt.id==='t8p-scrub-time');
        var onVid = onOv || onScr;
        var onUI = !!(elAt && elAt.closest && (
          elAt.closest('#t8p-pp-wm') ||
          elAt.closest('#t8p-topbar') ||
          elAt.closest('#t8p-btns') ||
          elAt.closest('.t8p-credits-section') ||
          elAt.closest('#t8p-dock') ||
          elAt.closest('#t8p-panel-topbar')
        ));
        if (onUI) {
          cur.style.opacity = '1';
          cur.style.width = '8px';
          cur.style.height = '8px';
          cur.innerHTML = '';
        } else {
          cur.style.width = '';
          cur.style.height = '';
          cur.style.opacity = onVid ? '1' : '0';
          cur.innerHTML = onVid ? (state === 'playing' ? PSSVG : PSVG) : '';
        }
        if (onScr && scrubLineRef) {
          var rect = scrubLineRef.getBoundingClientRect();
          scrubPct = Math.max(0, Math.min(1, (e.clientX-rect.left)/rect.width));
        }
      });
    }

    /* wordmark */
    {
      var wmDiv = el('div', {id:'t8p-pp-wm'});
      wmDiv.innerHTML = WM_SVG;
      var wms = wmDiv.querySelector('svg');
      if (wms) {
        wms.style.cssText = 'width:100%;height:100%;display:block';
      }
      wmDiv.onclick = function(){ location.href='/'; };
      pp.appendChild(wmDiv);
    }

    pp.appendChild(el('div',{id:'t8p-topbar'}));

    /* hero */
    var hero = el('div', {className:'t8p-pp-hero'});
    if (vids.length > 0) {
      var hf = el('iframe', {id:'t8p-vp-main'});
      hf.setAttribute('frameborder','0');
      hf.setAttribute('allow','autoplay; fullscreen; picture-in-picture; encrypted-media');
      hf.setAttribute('allowfullscreen','');
      hf.setAttribute('allowautoplay','');
      hf.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;pointer-events:auto';
      var heroHash = hashes[String(vids[0])] ? '?h='+hashes[String(vids[0])]+'&' : '?';
      hf.src = 'https://player.vimeo.com/video/'+vids[0]+heroHash+'autoplay=1&loop=1&muted=1&controls=0&autopause=0&background=1';
      hero.appendChild(hf);
    } else {
      /* photo-only project: scrape and show first image as hero */
      var heroImg = el('img', {id:'t8p-vp-main'});
      heroImg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none';
      var LUUID = 'd4325d9d-7519-4511-9a6d-61a47a7b3772';
      fetch(location.pathname).then(function(r){return r.text();}).then(function(html){
        var m = html.match(/images\.squarespace-cdn\.com\/content\/[^"'\s?]+/g)||[];
        for(var i=0;i<m.length;i++){
          if(m[i].indexOf(LUUID)>-1) continue;
          if(m[i].match(/\.(ico|svg|gif)$/i)) continue;
          heroImg.src='https://'+m[i].split('?')[0]+'?format=2500w'; return;
        }
      }).catch(function(){});
      hero.appendChild(heroImg);
    }
    var ov = el('div', {id:'t8p-ov'}); hero.appendChild(ov);
    var bar = el('div', {className:'t8p-pp-bar'});
    bar.innerHTML = '<span class="t8p-pp-t">'+(release?title+' &ndash; '+release:title)+'</span><span class="t8p-pp-d">'+desc+'</span>';
    hero.appendChild(bar);
    pp.appendChild(hero);

    /* scrub line */
    var scrubLine = el('div',{id:'t8p-scrub-line'});
    scrubLine.appendChild(el('div',{id:'t8p-scrub-time'}));
    pp.appendChild(scrubLine);
    scrubLineRef = scrubLine;

    /* credits */
    if (Object.keys(credits).length > 0) {
      var credSection = el('div',{className:'t8p-credits-section'});
      var credTitle = el('div',{className:'t8p-credits-title'});
      credTitle.textContent = 'Credits';
      credSection.appendChild(credTitle);
      Object.keys(credits).forEach(function(role){
        var val = credits[role];
        if(!val) return;
        var name = typeof val==='object'?val.n:val;
        var ig   = typeof val==='object'?val.ig:null;
        var row  = el('div',{className:'t8p-credit-row'});
        var roleEl = el('div',{className:'t8p-credit-role'}); roleEl.textContent=role;
        var nameEl = ig ? el('a',{className:'t8p-credit-name',href:'https://instagram.com/'+ig,target:'_blank',rel:'noopener noreferrer'})
                       : el('div',{className:'t8p-credit-name'});
        nameEl.textContent=name;
        row.appendChild(roleEl); row.appendChild(nameEl); credSection.appendChild(row);
      });
      pp.appendChild(credSection);
    }

    /* controls */
    var btns=el('div',{id:'t8p-btns'});
    var mb=el('div',{id:'t8p-mute-btn',className:'t8p-btn'});
    mb.innerHTML='<div class="t8p-btn-shape"></div><div class="t8p-btn-icon">'+MICO+'</div>';
    var cb=el('div',{id:'t8p-close-btn',className:'t8p-btn'});
    cb.innerHTML='<div class="t8p-btn-shape"></div><div class="t8p-btn-icon">'+CICO+'</div>';
    cb.onclick=function(){ location.href='/'; };
    btns.appendChild(mb); btns.appendChild(cb);
    pp.appendChild(btns);

    /* dock / panel / lightbox for extras */
    var hasGallery = !!d.g;
    var vidsAll = vids.slice();
    var hasExtras = vidsAll.length > 1 || hasGallery;

    if (hasExtras) {
      buildDockPanel(pp, vidsAll, hashes, d, title, desc, release, hasGallery);
    }
  }

  function buildDockPanel(pp, vidsAll, hashes, d, title, desc, release, hasGallery) {
    var bodyText  = d.body || '';
    var disclaimer = d.disclaimer || '';

    /* dock */
    var dock = el('div',{id:'t8p-dock'});
    var stack = el('div',{className:'t8p-dock-stack'});
    var previewCount = Math.min(vidsAll.length, 3);
    for (var pi=0;pi<previewCount;pi++) {
      (function(i){
        var card = el('div',{className:'t8p-dock-card'});
        card.style.zIndex = previewCount-i;
        card.style.transform = 'translateY('+(i*4)+'px) scale('+(1-i*.04)+')';
        var th = el('img');
        th.src = 'https://vumbnail.com/'+vidsAll[i]+'.jpg';
        th.style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:.75';
        card.appendChild(th);
        stack.appendChild(card);
      })(pi);
    }
    var badge=el('div',{className:'t8p-dock-badge'}); badge.textContent=vidsAll.length;
    stack.appendChild(badge); dock.appendChild(stack);
    document.body.appendChild(dock);

    /* panel */
    var panel = el('div',{id:'t8p-dock-panel'});
    var ptop = el('div',{id:'t8p-panel-topbar'});
    var wmEl = el('div',{id:'t8p-panel-wm'});
    wmEl.innerHTML = WM_SVG; ptop.appendChild(wmEl);
    var closeBtn = el('button',{id:'t8p-panel-close'}); closeBtn.innerHTML='&#x2715;'; ptop.appendChild(closeBtn);
    panel.appendChild(ptop);

    var pbody = el('div',{id:'t8p-panel-body'});
    var hdr = el('div',{className:'t8p-panel-hdr'});
    var pidx=el('div',{className:'t8p-panel-index'}); pidx.textContent='PROJECT ARCHIVE'; hdr.appendChild(pidx);
    var titleEl=el('div',{className:'t8p-panel-title'}); titleEl.textContent=title; hdr.appendChild(titleEl);
    var metaEl=el('div',{className:'t8p-panel-meta'});
    if(release){var rs=el('span'); rs.textContent=release; metaEl.appendChild(rs);}
    if(desc){var ds=el('span'); ds.textContent=desc; metaEl.appendChild(ds);}
    hdr.appendChild(metaEl);
    if(bodyText){var bt=el('div',{className:'t8p-panel-desc'}); bt.textContent=bodyText; hdr.appendChild(bt);}
    pbody.appendChild(hdr);

    /* videos in panel */
    if (vidsAll.length>0) {
      var vsec=el('div'); vsec.style.marginBottom='48px';
      var vslab=el('div',{className:'t8p-panel-slab'}); vslab.textContent='VIDEOS'; vsec.appendChild(vslab);
      var vgrid=el('div',{className:'t8p-panel-videos'});
      var vidLabels=['COMMERCIAL','DIRECTOR CUT','VIDEO 3','VIDEO 4'];
      vidsAll.forEach(function(vid,vi){
        var vblock=el('div',{className:'t8p-panel-vblock'});
        var vl=el('div',{className:'t8p-panel-vlab'}); vl.textContent=vidLabels[vi]||('VIDEO '+(vi+1)); vblock.appendChild(vl);
        var vf=el('div',{className:'t8p-panel-vframe'});
        var hash=hashes[String(vid)]?'?h='+hashes[String(vid)]:'';
        var ifr=document.createElement('iframe');
        var isYT=String(vid).indexOf('yt:')===0;
        var ytId=isYT?String(vid).slice(3):null;
        ifr.src=isYT
          ?'https://www.youtube-nocookie.com/embed/'+ytId+'?rel=0&modestbranding=1'
          :'https://player.vimeo.com/video/'+vid+hash+'&background=0&autoplay=0&loop=0&title=0&byline=0&portrait=0';
        ifr.allow='autoplay;fullscreen;encrypted-media'; ifr.allowFullscreen=true;
        vf.appendChild(ifr); vblock.appendChild(vf); vgrid.appendChild(vblock);
      });
      vsec.appendChild(vgrid); pbody.appendChild(vsec);
    }

    /* disclaimer */
    if (disclaimer) {
      var discs=disclaimer.split('|');
      var dsec=el('div',{className:'t8p-panel-disc'});
      var dslab=el('div',{className:'t8p-panel-slab'}); dslab.textContent='DISCLAIMER / RECLAMO'; dsec.appendChild(dslab);
      var dblock=el('div',{className:'t8p-panel-disc-block'});
      discs.forEach(function(txt,di){
        if(di>0){var dvd=el('div',{className:'t8p-panel-disc-div'}); dblock.appendChild(dvd);}
        var dlang=el('div',{className:'t8p-panel-disc-lang'}); dlang.textContent=['EN','ES'][di]||''; dblock.appendChild(dlang);
        var dtxt=el('div',{className:'t8p-panel-disc-text'}); dtxt.textContent=txt.trim(); dblock.appendChild(dtxt);
      });
      dsec.appendChild(dblock); pbody.appendChild(dsec);
    }

    /* gallery section */
    var galSec, galGrid;
    if (hasGallery) {
      galSec=el('div');
      var gslab=el('div',{className:'t8p-panel-slab'}); gslab.textContent='PRODUCTION STILLS'; galSec.appendChild(gslab);
      galGrid=el('div',{className:'t8p-panel-grid'}); galSec.appendChild(galGrid);
      pbody.appendChild(galSec);
    }
    panel.appendChild(pbody);
    document.body.appendChild(panel);

    /* lightbox */
    var lb=el('div',{id:'t8p-lb'});
    var lbImg=el('img',{id:'t8p-lb-img'}); lbImg.draggable=false; lb.appendChild(lbImg);
    var lbClose=el('button',{id:'t8p-lb-close'}); lbClose.innerHTML='&#x2715;'; lbClose.setAttribute('aria-label','Close'); lb.appendChild(lbClose);
    var lbPrev=el('button',{id:'t8p-lb-prev',className:'t8p-lb-nav'}); lbPrev.innerHTML='&#8592;'; lbPrev.setAttribute('aria-label','Previous'); lb.appendChild(lbPrev);
    var lbNext=el('button',{id:'t8p-lb-next',className:'t8p-lb-nav'}); lbNext.innerHTML='&#8594;'; lbNext.setAttribute('aria-label','Next'); lb.appendChild(lbNext);
    var lbCounter=el('div',{id:'t8p-lb-counter'}); lb.appendChild(lbCounter);
    document.body.appendChild(lb);
    lb._srcs=[]; lb._idx=0;

    function lbOpen(idx) {
      if(!lb._srcs.length) return;
      lb._idx=((idx%lb._srcs.length)+lb._srcs.length)%lb._srcs.length;
      lbImg.src=lb._srcs[lb._idx];
      lbCounter.textContent=(lb._idx+1)+' / '+lb._srcs.length;
      lb.classList.add('open');
      document.body.style.overflow='hidden';
    }
    function lbClose_fn() { lb.classList.remove('open'); document.body.style.overflow='hidden'; }
    lbClose.addEventListener('click',function(e){e.stopPropagation();lbClose_fn();});
    lbPrev.addEventListener('click',function(e){e.stopPropagation();lbOpen(lb._idx-1);});
    lbNext.addEventListener('click',function(e){e.stopPropagation();lbOpen(lb._idx+1);});
    lb.addEventListener('click',lbClose_fn);
    lbImg.addEventListener('click',function(e){e.stopPropagation();});

    /* touch swipe for lightbox */
    var lbTouchX=0;
    lb.addEventListener('touchstart',function(e){lbTouchX=e.touches[0].clientX;},{passive:true});
    lb.addEventListener('touchend',function(e){
      var dx=e.changedTouches[0].clientX-lbTouchX;
      if(Math.abs(dx)>40){if(dx<0)lbOpen(lb._idx+1);else lbOpen(lb._idx-1);}
    },{passive:true});

    var isPanelOpen=false;
    var LOGO_UUID = 'd4325d9d-7519-4511-9a6d-61a47a7b3772';
    function openPanel() {
      if(isPanelOpen)return; isPanelOpen=true;
      if(hasGallery&&galGrid&&!galGrid.children.length){
        /* fetch raw HTML of the Squarespace project page and parse figure imgs */
        fetch(location.pathname+'?format=json-pretty')
          .then(function(r){ return r.json(); })
          .catch(function(){ return null; })
          .then(function(json){
            /* try JSON API first for image URLs */
            var srcs = [];
            if(json && json.items){
              json.items.forEach(function(item){
                if(item.assetUrl) srcs.push(item.assetUrl);
              });
            }
            if(!srcs.length){
              /* fallback: fetch raw HTML and parse figure img src */
              return fetch(location.pathname)
                .then(function(r){ return r.text(); })
                .then(function(html){
                  var matches = html.match(/squarespace-cdn\.com\/content\/[^"'\s]+/g)||[];
                  var seen = {};
                  matches.forEach(function(u){
                    /* exclude logo UUID and placeholder patterns */
                    if(u.indexOf(LOGO_UUID)>-1) return;
                    if(u.indexOf('placeholder')>-1) return;
                    /* strip query params, dedupe */
                    var base = u.split('?')[0];
                    if(!seen[base]){seen[base]=true; srcs.push('https://'+base);}
                  });
                  return srcs;
                });
            }
            return srcs;
          })
          .then(function(srcs){
            if(!srcs||!srcs.length) return;
            lb._srcs = srcs;
            srcs.forEach(function(src,si){
              var tile=el('div',{className:'t8p-panel-tile'});
              var timg=el('img',{}); timg.src=src+'?format=750w'; timg.loading='lazy';
              tile.appendChild(timg);
              tile.addEventListener('click',function(e){e.stopPropagation();lbOpen(si);});
              galGrid.appendChild(tile);
            });
          });
      }
      panel.classList.add('open');
      document.body.style.overflow='hidden';
    }
    function closePanel() { panel.classList.remove('open'); isPanelOpen=false; document.body.style.overflow=''; }
    stack.addEventListener('click',openPanel);
    closeBtn.addEventListener('click',closePanel);

    /* keyboard nav */
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){
        if(lb.classList.contains('open'))lbClose_fn();
        else closePanel();
      } else if(lb.classList.contains('open')){
        if(e.key==='ArrowLeft')lbOpen(lb._idx-1);
        else if(e.key==='ArrowRight')lbOpen(lb._idx+1);
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     ROUTER
  ────────────────────────────────────────────────────────── */
  function go() {
    var _s = location.pathname.replace(/[/]/g,'');
    var _pp = document.getElementById('t8p-pp');

    if (_s && _pp) {
      /* project page */
      buildProject();
    } else if (!_s) {
      /* home */
      if (IS_MOBILE) {
        buildMobileHome();
      } else {
        buildDesktopHome();
      }
      /* shared home setup */
      initNav();
      setTimeout(function(){
        /* click-through for sphere cards (desktop) */
        document.addEventListener('click', function(e){
          if (!document.body.classList.contains('is-pp') && !document.body.classList.contains('nav-open')) {
            var hov = document.querySelector('.t8p-cell.is-hov');
            if (hov) { e.preventDefault(); e.stopImmediatePropagation(); location.href = hov.getAttribute('href'); }
          }
        }, true);
      }, 800);
    }
  }

  /* ──────────────────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────────────────── */
  function init() {
    injectStyles();
    injectHTML();
    initCursor();
    setTimeout(go, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
