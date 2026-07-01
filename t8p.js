/* ============================================================
   T8P STUDIOS — Site Script v10.5
   ⚠️  SPHERE LOCKED v10.9 — DO NOT MODIFY WITHOUT DAVID'S EXPLICIT CONFIRMATION
   Locked elements: buildGrid(), card sizes, aspect ratios, jitter, Z depth,
   motion physics (LERP_C=0.03, MAX_ROT_X/Y), per-card drift (deltaX*180, 0.88 friction),
   grid dimensions, gap values, priority order, rainbow ::before (mask technique, z-index:10),
   cell overflow:hidden, border-radius:12px, autoplay iframes.
   Last approved: 2026-07-01 — re-locked v2 + nav cooldown
   ============================================================
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
      '-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none}',
      'header#header,#header,.header-announcement-bar-wrapper,.sqs-announcement-bar-dropzone{display:none!important}',

      /* ── Custom cursor (desktop only) ── */
      '#t8p-cur{position:fixed;width:13px;height:13px;border-radius:50%;background:#fff;',
      'mix-blend-mode:difference;pointer-events:none;z-index:999999;',
      'transform:translate(-50%,-50%);transition:width .18s,height .18s;',
      'will-change:transform;left:-100px;top:-100px}',
      '#t8p-cur.big{width:20px;height:20px}',
      '@media(max-width:767px){#t8p-cur{display:none}}',

      /* ── T8P logo icon ── */

      /* ── Nav button SVG icon ── */
      '#t8p-nav-btn svg{width:28px;height:28px;color:#fff}',

      /* ── HOME layout ── */
      '#t8p-home{position:fixed;inset:0;overflow:hidden;background:var(--bg);display:none;z-index:8000}',
      'body.is-home #t8p-home{display:block}',
      'body.is-home #siteWrapper,body.is-home #page,body.is-home #header,.is-home #siteWrapper{display:none!important}',

      /* ── 3D sphere (desktop) ── */
      '#t8p-world{position:absolute;inset:0;z-index:100;perspective:1200px;',
      'perspective-origin:50% 50%;transform-style:preserve-3d}',
      '#t8p-sphere{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform}',

      /* ── Center wordmark ── */
      '#t8p-center{position:fixed;top:50%;left:50%;',
      'transform:translate(-50%,-50%);transform-origin:center center;',
      'z-index:500;pointer-events:none;display:flex;flex-direction:column;',
      'align-items:center;gap:4px;text-align:center;will-change:transform;',
      'will-change:transform}',
      '#t8p-wm-wrap{position:relative;width:min(64vw,560px)}',
      '#t8p-wm-wrap{transition:transform .55s cubic-bezier(.34,1.56,.64,1),opacity .4s}',
      /* open: logo shrinks and rises up out of the way */
      '#t8p-nav.open ~ #t8p-wm-wrap,body.nav-open #t8p-wm-wrap{',
      'transform:translateY(-32px) scale(0.72);opacity:0.35}',
      '#t8p-wm-wrap svg,#t8p-wm-wrap img{width:100%;height:auto;display:block;fill:#f0ede6}',
      '@media(max-width:767px){#t8p-wm-wrap{width:min(80vw,320px)}}',

      /* ── Nav pill ── */
      '#t8p-nav{will-change:transform;margin-top:2px;position:relative;',
      'pointer-events:auto;z-index:600;display:flex;justify-content:center}',
      '#t8p-nav-btn{width:54px;height:54px;border-radius:50%;background:rgba(20,20,20,.6);',
      'backdrop-filter:blur(8px);border:1px solid rgba(240,237,230,.18);',
      'display:flex;align-items:center;justify-content:center;cursor:pointer;',
      'transition:opacity .25s,transform .5s cubic-bezier(.34,1.56,.64,1);position:relative;z-index:2}',
      '#t8p-nav.open #t8p-nav-btn{opacity:0;pointer-events:none}',
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
      '#t8p-nav-close{position:absolute;right:8px;top:50%;transform:translateY(-50%);',
      'width:38px;height:38px;border-radius:50%;background:rgba(20,20,20,.08);',
      'border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;',
      'color:#080808;font-size:18px;line-height:1;padding:0;transition:opacity .15s}',
      '#t8p-nav-close:hover{opacity:.5}',
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
      '.t8p-cell::before{content:"";position:absolute;inset:0;border-radius:12px;',
      'background:var(--rb);opacity:0;transition:opacity .3s;pointer-events:none;z-index:10;',
      'mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);',
      'mask-composite:exclude;padding:3px}',
      '.t8p-cell:hover::before,.t8p-cell.is-hov::before{opacity:1}',
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
      '.t8p-pp-hero{position:relative;width:100%;height:100vh;flex-shrink:0;overflow:hidden}',
      '#t8p-vp-main{position:absolute;inset:0;width:100%;height:100%;border:none;pointer-events:none}',
      '#t8p-ov{position:absolute;inset:0;z-index:0}',
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
  var WM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="55 390 892 222"><g fill="#f0ede6"><path d="M337.11,539.43H94.89c-20.61,0-37.37-16.77-37.37-37.38v-68.83c0-20.61,16.77-37.38,37.37-37.38h242.22c20.61,0,37.37,16.77,37.37,37.38v68.83c0,20.61-16.77,37.38-37.37,37.38ZM94.89,403.15c-16.58,0-30.08,13.49-30.08,30.08v68.83c0,16.59,13.49,30.08,30.08,30.08h242.22c16.58,0,30.08-13.49,30.08-30.08v-68.83c0-16.59-13.49-30.08-30.08-30.08H94.89Z"/>
    <path d="M145.29,505.61h-24.36v-58.32h-23.39v-17.62h72.36v17.62h-24.61v58.32Z"/>
    <path d="M172.94,484.65c0-8.71,4.99-17.11,16.57-17.52v-.71c-11.08-2.33-14.86-7.7-14.86-17.32,0-18.53,17.54-20.05,35.45-20.05,19.61,0,35.81,1.42,35.81,20.96,0,10.23-2.8,13.47-13.89,16.4v.71c11.82,1.32,15.23,8.51,15.23,17.52,0,20.05-16.69,21.57-37.15,21.57s-37.15-1.82-37.15-21.57ZM196.09,482.43c0,6.58,3.29,8,13.76,8,13.64,0,14.25-1.62,14.25-8.3,0-7.09-1.58-7.8-14.25-7.8-11.21,0-13.76.91-13.76,8.1ZM222.76,451.74c0-5.27-.85-6.88-12.67-6.88-9.99,0-12.3.81-12.3,7.59s3.41,7.19,12.3,7.19c10.35,0,12.67-.81,12.67-7.9Z"/>
    <path d="M257.36,505.61v-75.94h45.92c22.66,0,31.18,8,31.18,27.85,0,21.37-5.73,28.66-31.18,28.66h-21.56v19.44h-24.36ZM298.41,468.55c9.62-.3,10.96-1.22,10.96-11.04,0-7.8-1.46-10.23-10.96-10.23h-16.69v21.26h16.69Z"/>
    <path d="M450.6,459.44c27.04,1.62,33.74,4.46,33.74,21.87,0,12.56.61,24.91-39.59,24.91-23.26,0-38.74-.4-38.74-25.31h23.39c0,7.9,3.41,8.71,15.35,8.71s15.23-.61,15.23-6.99-1.34-6.48-12.79-7.09l-5.36-.3c-22.53-1.32-35.69-1.22-35.69-22.99s14.74-23.19,38.61-23.19c19.98,0,37.03.3,37.03,21.26v3.14h-23.39c0-7.8-3.9-7.8-13.64-7.8-13.15,0-14.25,2.23-14.25,6.48,0,6.07,3.53,6.28,9.99,6.68l10.11.61Z"/>
    <path d="M532.94,505.61h-24.36v-58.32h-23.39v-17.62h72.36v17.62h-24.61v58.32Z"/>
    <path d="M640.26,429.67v50.63c0,20.25-11.45,25.92-38.25,25.92-36.54,0-40.44-7.69-40.44-25.92v-50.63h24.36v50.22c0,8.61,5.85,8.71,16.08,8.71s13.89-.71,13.89-9.62v-49.31h24.36Z"/>
    <path d="M650.49,429.67h46.29c25.46,0,36.79,7.9,36.79,29.47v15.9c0,20.76-8.04,30.58-33.5,30.58h-49.58v-75.94ZM674.86,487.99h21.32c9.01,0,12.3-4.96,12.3-12.96v-15.9c0-9.82-3.78-11.85-12.3-11.85h-21.32v40.7Z"/>
    <path d="M766.83,505.61h-24.36v-75.94h24.36v75.94Z"/>
    <path d="M774.74,478.37v-21.47c0-23.39,17.54-27.85,42.27-27.85s42.27,4.45,42.27,27.85v21.47c0,23.39-17.54,27.85-42.27,27.85s-42.27-4.45-42.27-27.85ZM834.19,476.15v-17.11c0-11.24-4.51-12.35-17.17-12.35s-16.81,1.11-17.18,12.35v17.11c.37,11.34,4.51,12.45,17.18,12.45s17.17-1.11,17.17-12.45Z"/>
    <path d="M908.74,459.44c27.04,1.62,33.74,4.46,33.74,21.87,0,12.56.61,24.91-39.59,24.91-23.26,0-38.74-.4-38.74-25.31h23.39c0,7.9,3.41,8.71,15.35,8.71s15.23-.61,15.23-6.99-1.34-6.48-12.79-7.09l-5.36-.3c-22.53-1.32-35.69-1.22-35.69-22.99s14.74-23.19,38.61-23.19c19.98,0,37.03.3,37.03,21.26v3.14h-23.39c0-7.8-3.9-7.8-13.64-7.8-13.15,0-14.25,2.23-14.25,6.48,0,6.07,3.53,6.28,9.99,6.68l10.11.61Z"/>
    <path d="M263.4,566.06c1.96,1.52,3.15,4.15,3.54,7.87h-4.54c-.28-1.71-.91-3.14-1.9-4.27s-2.57-1.7-4.75-1.7c-2.98,0-5.11,1.45-6.39,4.36-.83,1.88-1.25,4.21-1.25,6.98s.59,5.12,1.77,7.03c1.18,1.9,3.03,2.85,5.56,2.85,1.94,0,3.48-.59,4.61-1.77s1.92-2.8,2.35-4.85h4.54c-.52,3.69-1.82,6.38-3.89,8.09s-4.73,2.56-7.97,2.56c-3.64,0-6.53-1.33-8.7-3.99s-3.25-5.98-3.25-9.96c0-4.88,1.19-8.68,3.56-11.4s5.39-4.08,9.06-4.08c3.13,0,5.68.76,7.65,2.29Z"/>
    <path d="M289.64,567.35c2.46,2.39,3.69,5.9,3.69,10.53s-1.08,8.18-3.25,11.1c-2.16,2.92-5.53,4.38-10.08,4.38-3.8,0-6.82-1.29-9.05-3.88-2.23-2.59-3.35-6.06-3.35-10.42,0-4.67,1.18-8.39,3.53-11.16,2.35-2.77,5.52-4.15,9.49-4.15,3.56,0,6.57,1.19,9.02,3.58ZM286.73,585.83c1.14-2.34,1.71-4.95,1.71-7.82,0-2.59-.41-4.7-1.23-6.33-1.3-2.56-3.54-3.84-6.73-3.84-2.83,0-4.88,1.09-6.16,3.27-1.29,2.18-1.93,4.81-1.93,7.89s.64,5.42,1.93,7.39c1.29,1.97,3.32,2.96,6.11,2.96,3.06,0,5.16-1.17,6.3-3.51Z"/>
    <path d="M296.94,564.58h4.44v3.95c1.32-1.63,2.71-2.8,4.18-3.51s3.11-1.06,4.91-1.06c3.95,0,6.61,1.38,8,4.13.76,1.51,1.14,3.66,1.14,6.47v17.84h-4.75v-17.53c0-1.7-.25-3.06-.75-4.1-.83-1.73-2.34-2.6-4.52-2.6-1.11,0-2.02.11-2.73.34-1.28.38-2.41,1.14-3.38,2.29-.78.92-1.29,1.87-1.52,2.84s-.35,2.38-.35,4.19v14.57h-4.67v-27.81Z"/>
    <path d="M342.75,566.06c1.96,1.52,3.15,4.15,3.54,7.87h-4.54c-.28-1.71-.91-3.14-1.9-4.27s-2.57-1.7-4.75-1.7c-2.98,0-5.11,1.45-6.39,4.36-.83,1.88-1.25,4.21-1.25,6.98s.59,5.12,1.77,7.03c1.18,1.9,3.03,2.85,5.56,2.85,1.94,0,3.48-.59,4.61-1.77s1.92-2.8,2.35-4.85h4.54c-.52,3.69-1.82,6.38-3.89,8.09s-4.73,2.56-7.97,2.56c-3.64,0-6.53-1.33-8.7-3.99s-3.25-5.98-3.25-9.96c0-4.88,1.19-8.68,3.56-11.4s5.39-4.08,9.06-4.08c3.13,0,5.68.76,7.65,2.29Z"/>
    <path d="M366.02,565.34c1.84.93,3.25,2.12,4.21,3.6.93,1.4,1.55,3.04,1.86,4.91.27,1.28.41,3.32.41,6.13h-20.23c.09,2.83.75,5.1,1.98,6.81,1.24,1.71,3.15,2.57,5.75,2.57,2.42,0,4.35-.81,5.79-2.43.81-.93,1.38-2.03,1.72-3.26h4.6c-.12,1.02-.52,2.16-1.21,3.41s-1.45,2.28-2.29,3.08c-1.41,1.38-3.15,2.32-5.23,2.8-1.12.28-2.38.42-3.79.42-3.44,0-6.36-1.26-8.75-3.78-2.39-2.52-3.59-6.05-3.59-10.58s1.2-8.09,3.61-10.88c2.41-2.79,5.56-4.18,9.44-4.18,1.96,0,3.86.46,5.7,1.39ZM367.7,576.26c-.19-2.03-.63-3.64-1.31-4.86-1.27-2.25-3.39-3.38-6.36-3.38-2.13,0-3.91.77-5.35,2.32-1.45,1.55-2.21,3.52-2.29,5.91h15.32Z"/>
    <path d="M375.9,564.71h4.57v3.69c.94-1.26,1.96-2.24,3.07-2.93,1.58-1.04,3.44-1.56,5.57-1.56,3.16,0,5.84,1.21,8.05,3.62s3.31,5.86,3.31,10.35c0,6.06-1.59,10.39-4.77,12.98-2.02,1.64-4.36,2.47-7.04,2.47-2.1,0-3.86-.46-5.29-1.38-.84-.52-1.77-1.41-2.79-2.67v14.2h-4.67v-38.77ZM393.49,586.51c1.45-1.83,2.18-4.56,2.18-8.19,0-2.22-.32-4.12-.97-5.71-1.22-3.06-3.44-4.6-6.67-4.6s-5.47,1.62-6.67,4.86c-.64,1.73-.97,3.93-.97,6.6,0,2.15.32,3.97.97,5.48,1.22,2.87,3.44,4.31,6.67,4.31,2.19,0,4.01-.91,5.46-2.74Z"/>
    <path d="M404.68,556.81h4.73v7.76h4.44v3.82h-4.44v18.15c0,.97.33,1.62.99,1.95.36.19.97.29,1.82.29.23,0,.47,0,.73-.02s.56-.04.91-.09v3.71c-.54.16-1.09.27-1.67.34s-1.21.1-1.88.1c-2.18,0-3.66-.56-4.44-1.67s-1.17-2.57-1.17-4.35v-18.41h-3.77v-3.82h3.77v-7.76Z"/>
    <path d="M433.28,566.5c-.55-1.26-.82-2.48-.82-3.66,0-2.46.83-4.5,2.48-6.12s3.88-2.43,6.66-2.43,4.7.75,6.19,2.26c1.48,1.51,2.22,3.3,2.22,5.4,0,2.44-.77,4.58-2.3,6.41-.9,1.07-2.39,2.31-4.5,3.71l6.93,8.32c.46-1.38.78-2.42.96-3.1s.36-1.64.55-2.87h4.44c-.29,2.44-.88,4.78-1.76,7.02s-1.32,3.15-1.32,2.71l6.76,8.24h-6.02l-3.57-4.36c-1.42,1.54-2.71,2.67-3.88,3.38-2.06,1.25-4.42,1.87-7.09,1.87-3.95,0-6.82-1.07-8.62-3.21-1.8-2.14-2.69-4.55-2.69-7.23,0-2.89.87-5.31,2.61-7.24,1.07-1.18,3.06-2.65,5.98-4.41-1.61-1.85-2.69-3.41-3.23-4.67ZM444.51,587.84c1.38-.88,2.44-1.87,3.18-2.96l-8.59-10.52c-2.43,1.63-4.01,2.87-4.75,3.74-1.14,1.3-1.71,2.88-1.71,4.75,0,2.03.74,3.58,2.21,4.67,1.47,1.09,3.04,1.64,4.72,1.64,1.91,0,3.56-.44,4.93-1.32ZM444.14,566.22c1.01-1.17,1.51-2.48,1.51-3.91,0-1.12-.37-2.09-1.11-2.9-.74-.81-1.74-1.22-2.99-1.22-1.91,0-3.24.64-3.98,1.92-.38.66-.57,1.38-.57,2.15,0,1.06.29,2.06.87,3.03.58.97,1.55,2.22,2.9,3.76,1.62-1.16,2.74-2.1,3.36-2.83Z"/>
    <path d="M490.31,565.43c.83.52,1.77,1.43,2.82,2.73v-14.05h4.49v38.27h-4.21v-3.87c-1.09,1.71-2.37,2.95-3.86,3.71-1.48.76-3.18,1.14-5.09,1.14-3.09,0-5.76-1.3-8.02-3.91s-3.39-6.07-3.39-10.4c0-4.05,1.03-7.56,3.09-10.53,2.06-2.97,5.01-4.45,8.83-4.45,2.12,0,3.9.45,5.33,1.35ZM479.88,586.28c1.26,2.01,3.27,3.01,6.05,3.01,2.15,0,3.92-.93,5.31-2.79,1.39-1.86,2.08-4.53,2.08-8.01s-.71-6.12-2.14-7.8c-1.43-1.69-3.2-2.53-5.3-2.53-2.35,0-4.24.9-5.7,2.7-1.45,1.8-2.18,4.45-2.18,7.95,0,2.98.63,5.47,1.89,7.48Z"/>
    <path d="M519.65,565.34c1.84.93,3.25,2.12,4.21,3.6.93,1.4,1.55,3.04,1.86,4.91.27,1.28.41,3.32.41,6.13h-20.23c.09,2.83.75,5.1,1.98,6.81,1.24,1.71,3.15,2.57,5.75,2.57,2.42,0,4.35-.81,5.79-2.43.81-.93,1.38-2.03,1.72-3.26h4.6c-.12,1.02-.52,2.16-1.21,3.41s-1.45,2.28-2.29,3.08c-1.41,1.38-3.15,2.32-5.23,2.8-1.12.28-2.38.42-3.79.42-3.44,0-6.36-1.26-8.75-3.78-2.39-2.52-3.59-6.05-3.59-10.58s1.2-8.09,3.61-10.88c2.41-2.79,5.56-4.18,9.44-4.18,1.96,0,3.86.46,5.7,1.39ZM521.33,576.26c-.19-2.03-.63-3.64-1.31-4.86-1.27-2.25-3.39-3.38-6.36-3.38-2.13,0-3.91.77-5.35,2.32-1.45,1.55-2.21,3.52-2.29,5.91h15.32Z"/>
    <path d="M532.7,583.66c.14,1.56.54,2.75,1.19,3.58,1.2,1.51,3.28,2.26,6.25,2.26,1.77,0,3.32-.38,4.67-1.13,1.34-.75,2.01-1.92,2.01-3.49,0-1.19-.54-2.1-1.61-2.73-.69-.38-2.04-.82-4.06-1.32l-3.77-.93c-2.41-.59-4.18-1.25-5.33-1.97-2.04-1.26-3.06-3.01-3.06-5.25,0-2.63.96-4.76,2.88-6.39,1.92-1.63,4.51-2.44,7.75-2.44,4.25,0,7.31,1.23,9.18,3.69,1.17,1.56,1.74,3.24,1.71,5.04h-4.41c-.09-1.05-.47-2-1.14-2.86-1.1-1.22-3-1.83-5.72-1.83-1.8,0-3.18.34-4.11,1.01-.93.68-1.39,1.56-1.39,2.67,0,1.21.61,2.17,1.83,2.9.71.43,1.74.81,3.12,1.14l3.15.75c3.42.81,5.71,1.6,6.88,2.36,1.82,1.19,2.73,3.07,2.73,5.63s-.95,4.61-2.85,6.41c-1.9,1.8-4.8,2.7-8.69,2.7-4.19,0-7.15-.94-8.9-2.82s-2.68-4.2-2.8-6.97h4.49Z"/>
    <path d="M554.39,554.24h4.75v5.3h-4.75v-5.3ZM554.39,564.71h4.75v27.68h-4.75v-27.68Z"/>
    <path d="M579.53,565.69c.88.61,1.78,1.49,2.69,2.65v-3.51h4.31v25.29c0,3.53-.52,6.32-1.55,8.36-1.93,3.77-5.58,5.66-10.94,5.66-2.99,0-5.5-.67-7.53-2.01-2.04-1.34-3.18-3.44-3.42-6.3h4.75c.23,1.25.67,2.21,1.34,2.88,1.05,1.04,2.7,1.56,4.96,1.56,3.57,0,5.89-1.26,7-3.79.65-1.49.96-4.15.9-7.97-.93,1.42-2.05,2.48-3.36,3.17s-3.04,1.04-5.2,1.04c-3,0-5.63-1.07-7.88-3.21s-3.38-5.67-3.38-10.61c0-4.66,1.13-8.29,3.4-10.91s5-3.92,8.21-3.92c2.17,0,4.07.54,5.69,1.61ZM580.11,570.7c-1.42-1.66-3.22-2.49-5.4-2.49-3.27,0-5.51,1.54-6.72,4.62-.64,1.64-.96,3.8-.96,6.47,0,3.13.63,5.52,1.9,7.15,1.26,1.64,2.96,2.45,5.1,2.45,3.34,0,5.69-1.51,7.05-4.54.76-1.71,1.14-3.71,1.14-6,0-3.44-.71-6-2.12-7.66Z"/>
    <path d="M591.52,564.58h4.44v3.95c1.32-1.63,2.71-2.8,4.18-3.51s3.11-1.06,4.91-1.06c3.95,0,6.61,1.38,8,4.13.76,1.51,1.14,3.66,1.14,6.47v17.84h-4.75v-17.53c0-1.7-.25-3.06-.75-4.1-.83-1.73-2.34-2.6-4.52-2.6-1.11,0-2.02.11-2.73.34-1.28.38-2.41,1.14-3.38,2.29-.78.92-1.29,1.87-1.52,2.84s-.35,2.38-.35,4.19v14.57h-4.67v-27.81Z"/>
    <path d="M634.4,583.66c.14,1.56.54,2.75,1.19,3.58,1.2,1.51,3.28,2.26,6.25,2.26,1.77,0,3.32-.38,4.67-1.13,1.34-.75,2.01-1.92,2.01-3.49,0-1.19-.54-2.1-1.61-2.73-.69-.38-2.04-.82-4.06-1.32l-3.77-.93c-2.41-.59-4.18-1.25-5.33-1.97-2.04-1.26-3.06-3.01-3.06-5.25,0-2.63.96-4.76,2.88-6.39,1.92-1.63,4.51-2.44,7.75-2.44,4.25,0,7.31,1.23,9.18,3.69,1.17,1.56,1.74,3.24,1.71,5.04h-4.41c-.09-1.05-.47-2-1.14-2.86-1.1-1.22-3-1.83-5.72-1.83-1.8,0-3.18.34-4.11,1.01-.93.68-1.39,1.56-1.39,2.67,0,1.21.61,2.17,1.83,2.9.71.43,1.74.81,3.12,1.14l3.15.75c3.42.81,5.71,1.6,6.88,2.36,1.82,1.19,2.73,3.07,2.73,5.63s-.95,4.61-2.85,6.41c-1.9,1.8-4.8,2.7-8.69,2.7-4.19,0-7.15-.94-8.9-2.82s-2.68-4.2-2.8-6.97h4.49Z"/>
    <path d="M657.02,556.81h4.73v7.76h4.44v3.82h-4.44v18.15c0,.97.33,1.62.99,1.95.36.19.97.29,1.82.29.23,0,.47,0,.73-.02s.56-.04.91-.09v3.71c-.54.16-1.09.27-1.67.34s-1.21.1-1.88.1c-2.18,0-3.66-.56-4.44-1.67s-1.17-2.57-1.17-4.35v-18.41h-3.77v-3.82h3.77v-7.76Z"/>
    <path d="M673.4,564.58v18.46c0,1.42.22,2.58.66,3.48.81,1.66,2.32,2.49,4.53,2.49,3.17,0,5.33-1.45,6.47-4.36.62-1.56.93-3.7.93-6.41v-13.66h4.67v27.81h-4.41l.05-4.1c-.6,1.06-1.33,1.95-2.22,2.67-1.75,1.45-3.87,2.18-6.37,2.18-3.89,0-6.54-1.32-7.95-3.97-.77-1.42-1.15-3.32-1.15-5.69v-18.9h4.78Z"/>
    <path d="M711.46,565.43c.83.52,1.77,1.43,2.82,2.73v-14.05h4.49v38.27h-4.21v-3.87c-1.09,1.71-2.37,2.95-3.86,3.71-1.48.76-3.18,1.14-5.09,1.14-3.09,0-5.76-1.3-8.02-3.91s-3.39-6.07-3.39-10.4c0-4.05,1.03-7.56,3.09-10.53,2.06-2.97,5.01-4.45,8.83-4.45,2.12,0,3.9.45,5.33,1.35ZM701.03,586.28c1.26,2.01,3.27,3.01,6.05,3.01,2.15,0,3.92-.93,5.31-2.79,1.39-1.86,2.08-4.53,2.08-8.01s-.71-6.12-2.14-7.8c-1.43-1.69-3.2-2.53-5.3-2.53-2.35,0-4.24.9-5.7,2.7-1.45,1.8-2.18,4.45-2.18,7.95,0,2.98.63,5.47,1.89,7.48Z"/>
    <path d="M723.62,554.24h4.75v5.3h-4.75v-5.3ZM723.62,564.71h4.75v27.68h-4.75v-27.68Z"/>
    <path d="M753.46,567.35c2.46,2.39,3.69,5.9,3.69,10.53s-1.08,8.18-3.25,11.1c-2.16,2.92-5.53,4.38-10.08,4.38-3.8,0-6.82-1.29-9.05-3.88-2.23-2.59-3.35-6.06-3.35-10.42,0-4.67,1.18-8.39,3.53-11.16,2.35-2.77,5.52-4.15,9.49-4.15,3.56,0,6.57,1.19,9.02,3.58ZM750.56,585.83c1.14-2.34,1.71-4.95,1.71-7.82,0-2.59-.41-4.7-1.23-6.33-1.3-2.56-3.54-3.84-6.73-3.84-2.83,0-4.88,1.09-6.16,3.27-1.29,2.18-1.93,4.81-1.93,7.89s.64,5.42,1.93,7.39c1.29,1.97,3.32,2.96,6.11,2.96,3.06,0,5.16-1.17,6.3-3.51Z"/></g></svg>`;

  function injectHTML() {
    /* cursor */
    var cur = el('div', {id:'t8p-cur'});
    document.documentElement.appendChild(cur);

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
            '<button id="t8p-nav-close" aria-label="Close menu">&times;</button>',
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
    var mobFoot = el('div', {className:'t8p-mob-foot'}); mobFoot.innerHTML = 'T8P STUDIOS &middot; EST 2019'; mobHome.appendChild(mobFoot);
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
    var items = ['T8P STUDIOS','MEDIA PRODUCTION','CREATIVE DIRECTION',
                 'MUSIC VIDEOS','BRAND STRATEGY','PRESS ACTIVATIONS',
                 'EU, LATAM & US MARKETS','1B+ VIEWS','EST 2019'];
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
    /* cursor tracks 1:1 instantly -- no lag, native cursor never visible */
    document.addEventListener('mousemove', function(e){
      cur.style.left = e.clientX + 'px';
      cur.style.top  = e.clientY + 'px';
    }, {passive:true, capture:true});
    /* also hide native cursor everywhere */
    document.documentElement.style.cursor = 'none';
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
    var closeBtn = document.getElementById('t8p-nav-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e){
        e.stopPropagation(); e.stopImmediatePropagation();
        nav.classList.remove('open');
        document.body.classList.remove('nav-open');
        var wm2 = document.getElementById('t8p-wm-wrap');
        if (wm2) { wm2.style.transform = ''; wm2.style.opacity = ''; }
      });
    }
    document.addEventListener('click', function(e){
      var shield = document.getElementById('t8p-nav-shield');
      if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== shield && !(shield && shield.contains(e.target))) {
        nav.classList.remove('open');
        document.body.classList.remove('nav-open');
        var wm3 = document.getElementById('t8p-wm-wrap');
        if (wm3) { wm3.style.transform = ''; wm3.style.opacity = ''; }
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

    /* Sort by Squarespace page priority — top of list = inner ring */
    var PRIORITY = ['calvinklein','skechers','brooklinen','woxer','t8pcommercial','statefarm','hers','micasaestucasa','doritos','nike','787coffee','laboca','classy101','woxerpolaroid','mauryricky','pbpm','arena','reglamento','ekka','woxer','microsoft','enladisco','14bystayleave','purgatory','doing-a-lot','banco-virao','casualidad','shaz','2r1n','horoscopo','natalia','mezcal','mensajedevoz','sadvalentin','monster','paolaguanche','txtrano','reglamento-1'];
    items.sort(function(a,b){
      var ai = PRIORITY.indexOf(a.slug), bi = PRIORITY.indexOf(b.slug);
      if (ai === -1) ai = 999; if (bi === -1) bi = 999;
      return ai - bi;
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
    /* For video cards: use Vimeo thumbnail directly (reliable, correct frame)
       For photo cards: scrape page HTML */
    var allCells = Array.from(document.querySelectorAll('.t8p-cell'));
    allCells.forEach(function(cell, i) {
      var slug = (cell.getAttribute('href')||'').replace(/[/]/g,'');
      if (!slug) return;
      var d = (window._t8pDATA||{})[slug]||{};
      var vids = d.v||[];
      if (vids.length > 0) {
        /* Video project: use Vimeo thumbnail, but skip vumbnail for private videos */
        var vid = typeof vids[0]==='string'?parseInt(vids[0],10):vids[0];
        var hasPrivateHash = d.h && d.h[String(vids[0])];
        var img = cell.querySelector('img');
        if (img) {
          if (hasPrivateHash) {
            /* Private video -- vumbnail returns folder icon, scrape page instead */
            setTimeout(function(){ fetchThumb(cell, slug); }, i * 80);
          } else {
            img.src = 'https://vumbnail.com/'+vid+'.jpg';
            img.onerror = function(){
              /* Public video fallback: scrape page for real thumbnail */
              fetchThumb(cell, slug);
            };
          }
        }
      } else {
        /* Photo project: scrape page */
        setTimeout(function(){ fetchThumb(cell, slug); }, i * 80);
      }
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
      e.stopPropagation(); e.stopImmediatePropagation(); e.preventDefault();
      var o = nav.classList.toggle('open');
      document.body.classList.toggle('nav-open', o);
      window._t8pNavClick = Date.now();
      var wm = document.getElementById('t8p-wm-wrap');
      if (wm) {
        if (o) {
          wm.style.transform = 'translateY(-28px) scale(0.75)';
          wm.style.opacity = '0.3';
        } else {
          wm.style.transform = '';
          wm.style.opacity = '';
        }
      }
    }, true);
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

    /* Church-style layout: loose grid with per-cell jitter, Z varies by distance from center */
    var COLS = 5, ROWS = 4;
    /* Gap: generous breathing room between panels */
    var GAP_X = W * 0.028, GAP_Y = H * 0.030;
    /* Grid wider than viewport so outer panels are ~90% hidden at rest,
       revealed as cursor moves to edges via sphere pan + per-card drift */
    var gridW = W * 1.55, gridH = H * 1.45;
    var cellW = (gridW - (COLS-1)*GAP_X) / COLS;
    var cellH = (gridH - (ROWS-1)*GAP_Y) / ROWS;
    var gridLeft = (W - gridW) / 2, gridTop = (H - gridH) / 2;

    /* Priority order — center-first, David's swaps applied */
    var PRIORITY = [
      /* CENTER 7 -- always visible at rest */
      'calvinklein','skechers','brooklinen','woxer','t8pcommercial','statefarm','hers',
      /* MIDDLE 9 -- complete on slight cursor move */
      'micasaestucasa','doritos','nike','787coffee',
      'laboca','classy101','woxerpolaroid','mauryricky','pbpm',
      /* OUTER -- revealed at edges */
      'arena','reglamento','ekka','woxer','microsoft','enladisco',
      '14bystayleave','purgatory','doing-a-lot','banco-virao','casualidad',
      'shaz','2r1n','horoscopo','natalia','mezcal','mensajedevoz',
      'sadvalentin','monster','paolaguanche','txtrano','reglamento-1'
    ]
    items.sort(function(a,b){
      var ai=PRIORITY.indexOf(a.slug), bi=PRIORITY.indexOf(b.slug);
      return (ai<0?999:ai)-(bi<0?999:bi);
    });

    /* Assign grid cells — spiral from center outward so priority = center */
    var cellOrder = [];
    var cr = Math.floor(ROWS/2), cc = Math.floor(COLS/2);
    /* Build spiral order */
    var visited = []; for(var i=0;i<ROWS;i++){visited[i]=[];for(var j=0;j<COLS;j++)visited[i][j]=false;}
    var dirs=[[0,1],[1,0],[0,-1],[-1,0]]; var di=0; var r=cr,c=cc; var steps=1,stepCount=0,turns=0;
    for(var n=0;n<ROWS*COLS;n++){
      cellOrder.push([r,c]); visited[r][c]=true;
      var nr=r+dirs[di][0], nc=c+dirs[di][1];
      stepCount++;
      if(stepCount===steps){stepCount=0;di=(di+1)%4;turns++;if(turns%2===0)steps++;}
      r+=dirs[di][0]; c+=dirs[di][1];
      if(r<0||r>=ROWS||c<0||c>=COLS){break;}
    }
    /* fill any missed cells */
    for(var ri2=0;ri2<ROWS;ri2++)for(var ci2=0;ci2<COLS;ci2++)if(!visited[ri2][ci2])cellOrder.push([ri2,ci2]);

    var cells = [];
    var maxCards = Math.min(items.length, cellOrder.length);

    for (var idx = 0; idx < maxCards; idx++) {
      var it = items[idx];
      var gridCell = cellOrder[idx] || [Math.floor(idx/COLS), idx%COLS];
      var row = gridCell[0], col = gridCell[1];

      /* cell center */
      var baseCX = gridLeft + col * (cellW + GAP_X) + cellW/2;
      var baseCY = gridTop  + row * (cellH + GAP_Y) + cellH/2;

      /* random jitter within cell — church uses 30% of cell size */
      /* per-card random offset for organic floating feel */
      var jx = (Math.random()-0.5) * cellW * 0.32;
      var jy = (Math.random()-0.5) * cellH * 0.28;
      /* also add tiny random Z wobble per card */
      var jz = (Math.random()-0.5) * 60;
      var px = baseCX + jx;
      var py = baseCY + jy;

      /* Z based on distance from center — center=deepest (concave bowl) */
      var dx = (px - cx) / (W/2), dy = (py - cy) / (H/2);
      var dist = Math.sqrt(dx*dx + dy*dy); /* 0=center, ~1.4=corner */
      var depthZ = (-500 + dist * 500) + jz; /* center=-500, edges~+200 + per-card wobble */

      /* church-style lookAt: card tilts to face center of scene
         angle = atan2(offset, depth) -- deeper Z = stronger tilt */
      var FOCAL = 1400; /* matches perspective CSS */
      var rotY = -Math.atan2(px - cx, FOCAL - Math.abs(depthZ)) * (180/Math.PI);
      var rotX =  Math.atan2(py - cy, FOCAL - Math.abs(depthZ)) * (180/Math.PI);
      var rotZ = (Math.random()-0.5) * 2.5; /* slight random roll */

      /* native aspect ratio -- default 16:9 for video, known 4:3 overrides */
      /* 4:3 projects */ var RATIO_43  = {woxerpolaroid:1,pbpm:1,rubirose:1,skechers:1,nike:1};
      /* 9:16 vertical */ var RATIO_916 = {statefarm:1,hers:1};
      var rawRatio  = (window._t8pRATIOS && window._t8pRATIOS[it.slug]) || 0;
      var defR;
      if      (RATIO_43[it.slug])  defR = 3/4;
      else if (RATIO_916[it.slug]) defR = 16/9;
      else if (rawRatio > 0)       defR = 1/rawRatio;
      else                         defR = 9/16; /* arena, doritos, calvinklein etc = 16:9 */
      /* card width fits in cell */
      /* card width: sized so ~12 panels visible at rest (3 cols x 4 rows) */
      var isVertical = defR > 1.0;
      /* horizontal: fit ~3 across viewport with gaps */
      var baseW = isVertical ? Math.min(cellW * 0.800, 248) : Math.min(cellW * 0.828, 356);
      /* per-card size overrides */
      if (it.slug === 'calvinklein') baseW = 480;
      if (it.slug === 'nike')        baseW = 480;
      if (it.slug === 'doritos')     baseW = 426;

      var cell = el('a', {className:'t8p-cell', href:it.href});
      cell.style.width  = baseW + 'px';
      cell.style.height = (baseW * defR) + 'px';
      cell.style.left   = '0px';
      cell.style.top    = '0px';
      cell._px = px; cell._py = py; cell._z = depthZ;
      cell._rx = rotX; cell._ry = rotY; cell._rz = rotZ;
      cell._baseW = baseW;
      cell._h = baseW * defR;

      /* media */
      var media = el('div', {className:'t8p-cell-media'});
      var image = el('img', {});
      image.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1';
      image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      media.appendChild(image);

      /* Vimeo autoplay iframe */
      (function(slug, vids){
        var d = (window._t8pDATA||{})[slug] || {};
        var hashes = d.h || {};
        var vid = vids[0];
        var hs = hashes[String(vid)] ? '?h=' + hashes[String(vid)] + '&' : '?';
        var ifr = document.createElement('iframe');
        ifr.setAttribute('frameborder','0');
        ifr.setAttribute('allow','autoplay; fullscreen; picture-in-picture');
        ifr.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;z-index:2;opacity:0;transition:opacity 1.2s';
        ifr.src = 'https://player.vimeo.com/video/'+vid+hs+'background=1&autoplay=1&loop=1&muted=1&autopause=0&playsinline=1&dnt=1';
        ifr.addEventListener('load', function(){ ifr.style.opacity='1'; });
        media.appendChild(ifr);
      })(it.slug, it.vids);

      cell.appendChild(media);

      /* label */
      var lbl = el('div', {className:'t8p-cell-lbl'});
      var d2 = (window._t8pDATA||{})[it.slug];
      var title = d2 ? (d2.t||it.name).replace(/^\"|\"$/g,'') : it.name;
      lbl.innerHTML = '<span class="t8p-cell-name">'+title+'</span><span class="t8p-cell-arr">&#8599;</span>';
      cell.appendChild(lbl);
      sphere.appendChild(cell);
      cells.push(cell);
    } /* end for idx */


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
      if (document.getElementById('t8p-nav') && document.getElementById('t8p-nav').classList.contains('open')) return;
      var shieldEl = document.getElementById('t8p-nav-shield');
      if (shieldEl && shieldEl.contains(e.target)) return;
      if (window._t8pNavClick && Date.now() - window._t8pNavClick < 1200) return;
      var c = cardAt(e.clientX, e.clientY);
      if (c) { e.preventDefault(); window.location.href = c.getAttribute('href'); }
    }, true);

    /* Motion: church-exact — target set directly from mouse, camera lerps at 0.03
       When cursor moves: target jumps to new position instantly
       When cursor stops: target stays, camera keeps coasting toward it — liquid */
    function clamp(v,a,b){ return v<a?a:v>b?b:v; }

    var MAX_ROT_Y = Math.PI * 0.13;  /* church: 23.4deg horizontal */
    var MAX_ROT_X = Math.PI * 0.08;  /* church: 14.4deg vertical */
    var LERP_C = 0.03;               /* church exact lerp */
    var PAN = 420;

    var tgtX = 0, tgtY = 0;   /* set directly from mouse, no easing */
    var curRX = 0, curRY = 0; /* camera lerps toward target */
    var center = document.getElementById('t8p-center');

    window.addEventListener('resize', function(){ W=window.innerWidth; H=window.innerHeight; });

    document.addEventListener('mousemove', function(e){
      var mx = (e.clientX/W)*2 - 1;
      var my = -((e.clientY/H)*2 - 1);
      tgtY = clamp(mx * 2 * MAX_ROT_Y, -MAX_ROT_Y, MAX_ROT_Y);
      tgtX = clamp(my * 2 * MAX_ROT_X, -MAX_ROT_X, MAX_ROT_X);
    }, {passive:true});

    (function frame(){
      /* camera lerps toward target — keeps moving after cursor stops */
      curRY += (tgtY - curRY) * LERP_C;
      curRX += (tgtX - curRX) * LERP_C;

      var degY = curRY * (180/Math.PI);
      var degX = curRX * (180/Math.PI);
      var panX = (curRY / MAX_ROT_Y) * PAN;
      var panY = (curRX / MAX_ROT_X) * (PAN * 0.6);

      sphere.style.transform =
        'rotateY('+degY+'deg)' +
        ' rotateX('+degX+'deg)' +
        ' translateX('+(-panX)+'px)' +
        ' translateY('+(panY)+'px)';

      /* ═══ MOTION LOCKED - DO NOT MODIFY ═══
         church-exact per-card accumulative drift. Each card independently
         accumulates (targetRot - cameraRot) * 0.08 per frame with 0.88 friction.
         This was approved by David on 2025-06-30. Do not change these values. */
      var deltaX = (tgtY - curRY) * 0.08; /* church uses displacementScale=0.08 */
      var deltaY = (tgtX - curRX) * 0.08;
      cells.forEach(function(c) {
        /* accumulate drift on the card's stored offset */
        if (!c._ox) c._ox = 0;
        if (!c._oy) c._oy = 0;
        c._ox += deltaX * 180; /* scale to px (church is in 3D units, we're in px) */
        c._oy += deltaY * 140;
        /* soft clamp: ease back toward 0 when delta shrinks -- prevents infinite drift */
        c._ox *= 0.88;
        c._oy *= 0.88;
        var bx = c._px - c._baseW/2 + c._ox;
        var by = c._py - c._h/2    + c._oy;
        c.style.transform = 'translate3d('+bx+'px,'+by+'px,'+c._z+'px) rotateX('+c._rx+'deg) rotateY('+c._ry+'deg) rotateZ('+c._rz+'deg)';
      });

      if (center) {
        /* center stays fixed -- only the wordmark itself tilts */
        center.style.transform = 'translate(-50%,-50%)';
        var wmWrap = center.querySelector('#t8p-wm-wrap');
        if (wmWrap) {
          wmWrap.style.transform =
            'perspective(900px)' +
            ' rotateY('+(degY*0.9)+'deg)' +
            ' rotateX('+(degX*0.7)+'deg)';
        }
      }

      requestAnimationFrame(frame);
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
      hf.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;pointer-events:none;z-index:2';
      var heroHash = hashes[String(vids[0])] ? '?h='+hashes[String(vids[0])]+'&' : '?';
      hf.src = 'https://player.vimeo.com/video/'+vids[0]+heroHash+'autoplay=1&loop=1&muted=1&controls=0&autopause=0&background=1&dnt=1';
      /* poster: scrape page for real thumbnail, fallback to vumbnail */
      var poster = el('img',{});
      poster.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1';
      var SKIP_UUID = 'd4325d9d-7519-4511-9a6d-61a47a7b3772';
      fetch(location.pathname).then(function(r){return r.text();}).then(function(html){
        var imgs = (html.match(/images\.squarespace-cdn\.com\/content\/[^"'\s?]+/g)||[]);
        for(var i=0;i<imgs.length;i++){
          if(imgs[i].indexOf(SKIP_UUID)>-1) continue;
          if(imgs[i].match(/\.(ico|svg|gif)$/i)) continue;
          poster.src = 'https://'+imgs[i].split('?')[0]+'?format=2500w';
          return;
        }
        /* fallback: vumbnail -- works for public videos */
        poster.src = 'https://vumbnail.com/'+vids[0]+'.jpg';
        poster.onerror = function(){ poster.style.display='none'; };
      }).catch(function(){
        poster.src = 'https://vumbnail.com/'+vids[0]+'.jpg';
        poster.onerror = function(){ poster.style.display='none'; };
      });
      hero.appendChild(poster);
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

    /* un-hide siteWrapper for non-home/non-pp pages (hidden by header flash-fix) */
    var _sw = document.getElementById('siteWrapper');
    var _pg = document.getElementById('page');
    var _fl = document.getElementById('t8p-flash');
    if (_fl) _fl.remove(); /* remove the header flash-fix style entirely */

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
          var navEl = document.getElementById('t8p-nav');
          var shieldEl = document.getElementById('t8p-nav-shield');
          /* bail if click is on nav, shield, or nav is open */
          if (navEl && navEl.contains(e.target)) return;
          if (shieldEl && e.target === shieldEl) return;
          if (navEl && navEl.classList.contains('open')) return;
          if (document.body.classList.contains('nav-open')) return;
          if (document.body.classList.contains('is-pp')) return;
          if (window._t8pNavClick && Date.now() - window._t8pNavClick < 800) return;
          var hov = document.querySelector('.t8p-cell.is-hov');
          if (hov) { e.preventDefault(); e.stopImmediatePropagation(); location.href = hov.getAttribute('href'); }
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
    setTimeout(go, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
