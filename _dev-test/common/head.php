<?php
// Shared <head> for YURI1 Music static-PHP pages.
// Every page may override these variables before including this file.
$page_title = $page_title ?? 'YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = $page_description ?? 'Original YURI NO1 AI music inspired by Girls Love novels, characters, and stories.';
$page_canonical = $page_canonical ?? 'https://music.yuri1.com/';
$page_og_image = $page_og_image ?? 'https://music.yuri1.com/config/-index.jpg';
$page_og_type = $page_og_type ?? 'website';
$page_structured_data = $page_structured_data ?? [
  '@context' => 'https://schema.org',
  '@type' => 'WebSite',
  'name' => 'YURI NO1 Music',
  'url' => 'https://music.yuri1.com/',
  'image' => $page_og_image,
  'description' => $page_description,
];
$track_catalog_file = __DIR__ . '/../w-music/w-tracklog.php';
$track_catalog = is_file($track_catalog_file) ? include $track_catalog_file : ['version' => 2, 'tracks' => []];
?>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <link rel="icon" type="image/png" sizes="32x32" href="/config/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/config/favicon-16x16.png">
  <meta name="theme-color" content="#09090d">
  <title><?= htmlspecialchars($page_title, ENT_QUOTES, 'UTF-8') ?></title>
  <meta id="meta-description" name="description" content="<?= htmlspecialchars($page_description, ENT_QUOTES, 'UTF-8') ?>">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link id="canonical" rel="canonical" href="<?= htmlspecialchars($page_canonical, ENT_QUOTES, 'UTF-8') ?>">

  <meta id="og-title" property="og:title" content="<?= htmlspecialchars($page_title, ENT_QUOTES, 'UTF-8') ?>">
  <meta id="og-description" property="og:description" content="<?= htmlspecialchars($page_description, ENT_QUOTES, 'UTF-8') ?>">
  <meta id="og-url" property="og:url" content="<?= htmlspecialchars($page_canonical, ENT_QUOTES, 'UTF-8') ?>">
  <meta id="og-image" property="og:image" content="<?= htmlspecialchars($page_og_image, ENT_QUOTES, 'UTF-8') ?>">
  <meta property="og:type" content="<?= htmlspecialchars($page_og_type, ENT_QUOTES, 'UTF-8') ?>">
  <meta property="og:site_name" content="YURI NO1 Music">
  <meta name="twitter:card" content="summary_large_image">
  <meta id="twitter-title" name="twitter:title" content="<?= htmlspecialchars($page_title, ENT_QUOTES, 'UTF-8') ?>">
  <meta id="twitter-description" name="twitter:description" content="<?= htmlspecialchars($page_description, ENT_QUOTES, 'UTF-8') ?>">
  <meta id="twitter-image" name="twitter:image" content="<?= htmlspecialchars($page_og_image, ENT_QUOTES, 'UTF-8') ?>">

  <script id="structured-data" type="application/ld+json"><?= json_encode($page_structured_data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) ?></script>
  <script>window.YURI1_TRACKS = <?= json_encode($track_catalog, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>;</script>

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-TWSTEMZXGL"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-TWSTEMZXGL');
  </script>

  <link id="music-css" rel="stylesheet" href="/config/music.css">
  <script>
  // YURI1 automatic asset versioning.
  window.YURI1Cache = (() => {
    const versions = new Map();
    const pending = new Map();
    const fallbackToken = Date.now().toString(36);

    function hash(text) {
      let h = 2166136261;
      for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return (h >>> 0).toString(36);
    }

    function normalizedUrl(path) {
      const u = new URL(path, location.origin + '/');
      u.searchParams.delete('v');
      return u;
    }

    async function versioned(path) {
      const u = normalizedUrl(path);
      if (u.origin !== location.origin) return path;

      const key = `${u.pathname}${u.search}`;
      if (versions.has(key)) {
        u.searchParams.set('v', versions.get(key));
        return `${u.pathname}${u.search}${u.hash}`;
      }
      if (pending.has(key)) return pending.get(key);

      const job = (async () => {
        let token = fallbackToken;
        try {
          const r = await fetch(`${u.pathname}${u.search}`, {
            method: 'HEAD',
            cache: 'no-cache'
          });
          if (r.ok) {
            const signature = [
              r.headers.get('etag') || '',
              r.headers.get('last-modified') || '',
              r.headers.get('content-length') || ''
            ].join('|');
            if (signature.replace(/\|/g, '')) token = hash(signature);
          }
        } catch (_) {}

        versions.set(key, token);
        u.searchParams.set('v', token);
        return `${u.pathname}${u.search}${u.hash}`;
      })();

      pending.set(key, job);
      try { return await job; }
      finally { pending.delete(key); }
    }

    return { versioned };
  })();

  window.YURI1Cache.versioned('/config/music.css').then(url => {
    const link = document.getElementById('music-css');
    if (link && link.href !== new URL(url, location.href).href) link.href = url;
  });
  </script>
</head>
