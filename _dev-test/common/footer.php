<script>
// Shared player loader. Page content remains in the page itself;
// losing this include only removes behavior, not the page's own HTML content.
(async () => {
  if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
  }
  const src = await window.YURI1Cache.versioned('/config/music.js');
  const script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.body.appendChild(script);
})();
</script>
