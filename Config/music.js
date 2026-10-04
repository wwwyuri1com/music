(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const els = {
    app: $('.music-app'),
    cover: $('.cover-layer'),
    mascot: $('#mascot'),
    title: $('#track-title'),
    story: $('#track-story'),
    theme: $('#track-theme'),
    audio: $('#audio'),
    seek: $('#seek'),
    current: $('#current-time'),
    duration: $('#duration'),
    play: $('#play'),
    prev: $('#prev'),
    next: $('#next'),
    storyLink: $('#story-link'),
    repeatOne: $('#repeat-one'),
    playlistBtn: $('#playlist-btn'),
    playlist: $('#playlist'),
    closePlaylist: $('#close-playlist'),
    trackList: $('#track-list'),
    status: $('#status'),
    metaDescription: $('#meta-description'),
    canonical: $('#canonical'),
    ogTitle: $('#og-title'),
    ogDescription: $('#og-description'),
    ogUrl: $('#og-url'),
    ogImage: $('#og-image'),
    twitterTitle: $('#twitter-title'),
    twitterDescription: $('#twitter-description'),
    twitterImage: $('#twitter-image'),
    structuredData: $('#structured-data')
  };

  const ICONS = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.2 5.3a1 1 0 0 1 1.53-.84l9.1 6.2a1.6 1.6 0 0 1 0 2.66l-9.1 6.2A1 1 0 0 1 8.2 18.7V5.3Z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.75 5.5A1.25 1.25 0 0 1 8 4.25h1.5a1.25 1.25 0 0 1 1.25 1.25v13A1.25 1.25 0 0 1 9.5 19.75H8a1.25 1.25 0 0 1-1.25-1.25v-13Zm6.5 0a1.25 1.25 0 0 1 1.25-1.25H16a1.25 1.25 0 0 1 1.25 1.25v13A1.25 1.25 0 0 1 16 19.75h-1.5a1.25 1.25 0 0 1-1.25-1.25v-13Z"/></svg>'
  };

  const SITE_ROOT = 'https://music.yuri1.com/';
  const INDEX_URL = `${SITE_ROOT}index.html`;
  const TITLE_SUFFIX = 'YURI NO1 Music – Girls Love ♡ AI Music from Novels';
  const INDEX_DESCRIPTION = 'Original YURI NO1 AI music inspired by Girls Love novels, characters, and stories.';

  const versionedAsset = path => {
    const fn = window.YURI1Cache?.versioned;
    return typeof fn === 'function' ? fn(path) : Promise.resolve(path);
  };

  let assetRenderSerial = 0;

  let tracks = [];
  let currentIndex = 0;
  const playedTrackKeys = new Set();

  const REPEAT_ONE_KEY = 'yuri1_music_repeat_one';
  let repeatOne = localStorage.getItem(REPEAT_ONE_KEY) === '1';

  function renderRepeatOne() {
    if (!els.repeatOne) return;
    els.repeatOne.setAttribute('aria-pressed', repeatOne ? 'true' : 'false');
    els.repeatOne.setAttribute('aria-label', repeatOne ? 'Single-track loop on' : 'Single-track loop off');
    els.repeatOne.title = repeatOne ? 'Single-track loop: on' : 'Single-track loop: off';
  }

  function sourceKey(id) {
    const m = String(id || '').match(/^(\d{8}-\d{2})/);
    return m ? m[1] : '';
  }
  function musicId(track) {
    const key = sourceKey(track.ID);
    if (key) return `M-P${key}`;
    const raw = String(track.ID || '').trim();
    return raw ? `M-${raw}` : '';
  }
  function coverPath(track) {
    return `Music-Img/${encodeURIComponent(track.ID)}%20(${track.Img}).jpg`;
  }
  function audioPath(track) {
    return `Music-Mp3/${encodeURIComponent(track.ID)}%20(${track.Img}).mp3`;
  }
  function mascotPath(track) {
    return `Player-Img/${encodeURIComponent(track.Theme || '_default')}.png`;
  }
  function postLink(track) {
    const key = sourceKey(track.ID);
    return key ? `https://www.yuri1.com/Post.html?id=P${key}` : '';
  }
  function absoluteUrl(path) {
    return new URL(path, SITE_ROOT).href;
  }
  function trackUrl(track) {
    const u = new URL(INDEX_URL);
    u.searchParams.set('id', musicId(track));
    u.searchParams.set('track', String(track.Img));
    return u.href;
  }
  function trackKey(track) {
    return `${musicId(track)}:${track.Img}`;
  }
  function trackDescription(track) {
    const title = track.TITLE || 'Untitled';
    const story = track.STORY || 'YURI NO1';
    return `${title} — original YURI NO1 AI music inspired by ${story}, connecting Girls Love novels, characters, and sound.`;
  }
  function setMeta(el, value, attr = 'content') {
    if (el) el.setAttribute(attr, value);
  }
  function setStructuredData(data) {
    if (els.structuredData) els.structuredData.textContent = JSON.stringify(data);
  }
  function applyIndexSeo() {
    document.title = TITLE_SUFFIX;
    setMeta(els.metaDescription, INDEX_DESCRIPTION);
    setMeta(els.canonical, SITE_ROOT, 'href');
    setMeta(els.ogTitle, TITLE_SUFFIX);
    setMeta(els.ogDescription, INDEX_DESCRIPTION);
    setMeta(els.ogUrl, SITE_ROOT);
    setMeta(els.twitterTitle, TITLE_SUFFIX);
    setMeta(els.twitterDescription, INDEX_DESCRIPTION);
    setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'YURI NO1 Music',
      url: SITE_ROOT,
      description: INDEX_DESCRIPTION
    });
  }
  function applyTrackSeo(track) {
    const title = `${track.TITLE || 'Untitled'} \\ ${TITLE_SUFFIX}`;
    const description = trackDescription(track);
    const url = trackUrl(track);
    const image = absoluteUrl(coverPath(track));
    const audio = absoluteUrl(audioPath(track));
    const storyUrl = postLink(track);

    document.title = title;
    setMeta(els.metaDescription, description);
    setMeta(els.canonical, url, 'href');
    setMeta(els.ogTitle, title);
    setMeta(els.ogDescription, description);
    setMeta(els.ogUrl, url);
    setMeta(els.ogImage, image);
    setMeta(els.twitterTitle, title);
    setMeta(els.twitterDescription, description);
    setMeta(els.twitterImage, image);

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'MusicRecording',
      name: track.TITLE || 'Untitled',
      url,
      image,
      contentUrl: audio,
      description,
      byArtist: {
        '@type': 'Organization',
        name: 'YURI NO1',
        url: 'https://www.yuri1.com/'
      }
    };
    if (track.STORY) {
      schema.isBasedOn = storyUrl
        ? { '@type': 'CreativeWork', name: track.STORY, url: storyUrl }
        : { '@type': 'CreativeWork', name: track.STORY };
    }
    setStructuredData(schema);
  }
  function sendGaEvent(name, track, extra = {}) {
    if (typeof window.gtag !== 'function' || !track) return;
    window.gtag('event', name, {
      music_title: track.TITLE || 'Untitled',
      music_id: musicId(track),
      music_track: Number(track.Img),
      music_story: track.STORY || '',
      music_theme: track.Theme || '',
      ...extra
    });
  }
  function fmt(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    seconds = Math.max(0, Math.floor(seconds));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }
  function setStatus(text) {
    els.status.textContent = text;
    els.status.hidden = !text;
  }
  function updateUrl(track, replace = true) {
    const u = new URL(trackUrl(track));
    history[replace ? 'replaceState' : 'pushState']({}, '', `${u.pathname}${u.search}`);
  }

  function setTrack(index, { autoplay = false, updateHistory = true, updateSeo = true, trackView = true } = {}) {
    if (!tracks.length) return;
    currentIndex = (index + tracks.length) % tracks.length;
    const t = tracks[currentIndex];

    els.app.classList.remove('playing');
    els.title.textContent = t.TITLE || 'Untitled';
    els.story.textContent = t.STORY || '';
    els.theme.textContent = t.Theme || '';
    const serial = ++assetRenderSerial;
    els.audio.pause();
    els.audio.removeAttribute('src');
    els.audio.load();

    const coverRaw = coverPath(t);
    const mascotRaw = mascotPath(t);
    const audioRaw = audioPath(t);

    // Resolve real file signatures before assigning cacheable media URLs.
    // This keeps unchanged assets cached, while same-name replacements refresh automatically.
    versionedAsset(coverRaw).then(coverUrl => {
      if (serial !== assetRenderSerial) return;
      els.cover.style.backgroundImage = `url("${coverUrl}")`;
      document.body.style.backgroundImage = `url("${coverUrl}")`;
      document.body.style.setProperty('--cover-image', `url("${coverUrl}")`);
    });

    versionedAsset(mascotRaw).then(mascotUrl => {
      if (serial !== assetRenderSerial) return;
      els.mascot.src = mascotUrl;
      els.mascot.onerror = async () => {
        els.mascot.onerror = null;
        els.mascot.src = await versionedAsset('Player-Img/_default.png');
      };
    });

    versionedAsset(audioRaw).then(audioUrl => {
      if (serial !== assetRenderSerial) return;
      const shouldAutoplay = autoplay;
      els.audio.src = audioUrl;
      els.audio.load();
      if (shouldAutoplay) els.audio.play().catch(() => {});
    });
    els.seek.value = 0;
    els.seek.style.setProperty('--p', '0%');
    els.current.textContent = '0:00';
    els.duration.textContent = '0:00';
    els.play.innerHTML = ICONS.play;
    els.play.setAttribute('aria-label', 'Play');

    const link = postLink(t);
    els.storyLink.href = link || '#';
    els.storyLink.setAttribute('aria-disabled', link ? 'false' : 'true');

    if (updateHistory) updateUrl(t, true);
    if (updateSeo) applyTrackSeo(t);
    if (trackView) sendGaEvent('music_track_view', t);
    renderPlaylist();

  }

  function renderPlaylist() {
    els.trackList.innerHTML = '';
    tracks.forEach((t, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `track-item${i === currentIndex ? ' active' : ''}`;
      btn.innerHTML = `
        <img alt="" src="${coverPath(t)}">
        <span><b>${escapeHtml(t.TITLE || 'Untitled')}</b><span>${escapeHtml(t.STORY || '')}</span></span>
        <span class="theme">${escapeHtml(t.Theme || '')}</span>`;
      const thumb = btn.querySelector('img');
      versionedAsset(coverPath(t)).then(url => {
        if (thumb?.isConnected) thumb.src = url;
      });
      btn.addEventListener('click', () => {
        setTrack(i, { autoplay: !els.audio.paused, updateHistory: true });
        els.playlist.classList.remove('open');
      });
      els.trackList.appendChild(btn);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  async function togglePlay() {
    if (els.audio.paused) {
      try { await els.audio.play(); } catch (_) {}
    } else {
      els.audio.pause();
    }
  }

  els.play.addEventListener('click', togglePlay);
  els.prev.addEventListener('click', () => setTrack(currentIndex - 1, { autoplay: true }));
  els.next.addEventListener('click', () => setTrack(currentIndex + 1, { autoplay: true }));
  els.audio.addEventListener('play', () => {
    els.app.classList.add('playing');
    els.play.innerHTML = ICONS.pause;
    els.play.setAttribute('aria-label', 'Pause');
    const t = tracks[currentIndex];
    const key = t ? trackKey(t) : '';
    if (key && !playedTrackKeys.has(key)) {
      playedTrackKeys.add(key);
      sendGaEvent('music_play', t);
    }
  });
  els.audio.addEventListener('pause', () => {
    els.app.classList.remove('playing');
    els.play.innerHTML = ICONS.play;
    els.play.setAttribute('aria-label', 'Play');
  });
  els.audio.addEventListener('loadedmetadata', () => {
    els.duration.textContent = fmt(els.audio.duration);
    const q = new URLSearchParams(location.search);
    if (q.get('id') || q.get('track')) {
      const t = tracks[currentIndex];
      if (t && els.structuredData && Number.isFinite(els.audio.duration)) {
        try {
          const data = JSON.parse(els.structuredData.textContent || '{}');
          if (data['@type'] === 'MusicRecording') {
            data.duration = `PT${Math.max(0, Math.round(els.audio.duration))}S`;
            setStructuredData(data);
          }
        } catch (_) {}
      }
    }
  });
  els.audio.addEventListener('timeupdate', () => {
    els.current.textContent = fmt(els.audio.currentTime);
    const p = els.audio.duration ? (els.audio.currentTime / els.audio.duration) * 100 : 0;
    els.seek.value = p;
    els.seek.style.setProperty('--p', `${p}%`);
  });
  els.audio.addEventListener('ended', () => {
    const t = tracks[currentIndex];
    sendGaEvent('music_complete', t);
    if (repeatOne) {
      els.audio.currentTime = 0;
      els.audio.play().catch(() => {});
      return;
    }
    setTrack(currentIndex + 1, { autoplay: true });
  });
  els.seek.addEventListener('input', () => {
    const p = Number(els.seek.value);
    els.seek.style.setProperty('--p', `${p}%`);
    if (els.audio.duration) els.audio.currentTime = (p / 100) * els.audio.duration;
  });

  els.repeatOne?.addEventListener('click', () => {
    repeatOne = !repeatOne;
    localStorage.setItem(REPEAT_ONE_KEY, repeatOne ? '1' : '0');
    renderRepeatOne();
  });

  els.playlistBtn.addEventListener('click', () => els.playlist.classList.toggle('open'));
  els.closePlaylist.addEventListener('click', () => els.playlist.classList.remove('open'));
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !/INPUT|BUTTON|A/.test(document.activeElement?.tagName || '')) {
      e.preventDefault(); togglePlay();
    }
  });

  renderRepeatOne();

  async function boot() {
    setStatus('Loading music…');
    try {
      const tracklogUrl = await versionedAsset('W-Music/W-Tracklog.json');
      const r = await fetch(tracklogUrl, { cache: 'no-cache' });
      if (!r.ok) throw new Error(`Tracklog HTTP ${r.status}`);
      const data = await r.json();
      tracks = Array.isArray(data) ? data : data.tracks;
      if (!Array.isArray(tracks) || !tracks.length) throw new Error('No tracks');

      const q = new URLSearchParams(location.search);
      const requestedId = q.get('id');
      const requestedTrackRaw = q.get('track');
      const requestedTrack = requestedTrackRaw !== null ? Number(requestedTrackRaw) : null;
      const hasTrackQuery = Boolean(requestedId || requestedTrackRaw !== null);
      const idx = tracks.findIndex(t =>
        (!requestedId || musicId(t) === requestedId) &&
        (requestedTrack === null || Number(t.Img) === requestedTrack)
      );

      if (hasTrackQuery) {
        setTrack(idx >= 0 ? idx : 0, { updateHistory: false, updateSeo: true, trackView: true });
      } else {
        applyIndexSeo();
        setTrack(0, { updateHistory: false, updateSeo: false, trackView: false });
      }
      setStatus('');
    } catch (err) {
      console.error(err);
      setStatus('Unable to load W-Tracklog.json');
    }
  }

  boot();
})();
