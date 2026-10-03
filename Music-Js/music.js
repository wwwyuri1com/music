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
    playlistBtn: $('#playlist-btn'),
    playlist: $('#playlist'),
    closePlaylist: $('#close-playlist'),
    trackList: $('#track-list'),
    status: $('#status')
  };

  const ICONS = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.2 5.3a1 1 0 0 1 1.53-.84l9.1 6.2a1.6 1.6 0 0 1 0 2.66l-9.1 6.2A1 1 0 0 1 8.2 18.7V5.3Z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.75 5.5A1.25 1.25 0 0 1 8 4.25h1.5a1.25 1.25 0 0 1 1.25 1.25v13A1.25 1.25 0 0 1 9.5 19.75H8a1.25 1.25 0 0 1-1.25-1.25v-13Zm6.5 0a1.25 1.25 0 0 1 1.25-1.25H16a1.25 1.25 0 0 1 1.25 1.25v13A1.25 1.25 0 0 1 16 19.75h-1.5a1.25 1.25 0 0 1-1.25-1.25v-13Z"/></svg>'
  };

  let tracks = [];
  let currentIndex = 0;

  function sourceKey(id) {
    const m = String(id || '').match(/^(\d{8}-\d{2})/);
    return m ? m[1] : '';
  }
  function musicId(track) {
    const key = sourceKey(track.ID);
    return key ? `M-P${key}` : '';
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
    const u = new URL(location.href);
    u.searchParams.set('id', musicId(track));
    u.searchParams.set('track', String(track.Img));
    history[replace ? 'replaceState' : 'pushState']({}, '', u);
  }

  function setTrack(index, { autoplay = false, updateHistory = true } = {}) {
    if (!tracks.length) return;
    currentIndex = (index + tracks.length) % tracks.length;
    const t = tracks[currentIndex];

    els.app.classList.remove('playing');
    els.title.textContent = t.TITLE || 'Untitled';
    els.story.textContent = t.STORY || '';
    els.theme.textContent = t.Theme || '';
    els.cover.style.backgroundImage = `url("${coverPath(t)}")`;
    els.mascot.src = mascotPath(t);
    els.mascot.onerror = () => { els.mascot.onerror = null; els.mascot.src = 'Player-Img/_default.png'; };
    els.audio.src = audioPath(t);
    els.audio.load();
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
    renderPlaylist();

    if (autoplay) {
      els.audio.play().catch(() => {});
    }
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
  });
  els.audio.addEventListener('pause', () => {
    els.app.classList.remove('playing');
    els.play.innerHTML = ICONS.play;
    els.play.setAttribute('aria-label', 'Play');
  });
  els.audio.addEventListener('loadedmetadata', () => { els.duration.textContent = fmt(els.audio.duration); });
  els.audio.addEventListener('timeupdate', () => {
    els.current.textContent = fmt(els.audio.currentTime);
    const p = els.audio.duration ? (els.audio.currentTime / els.audio.duration) * 100 : 0;
    els.seek.value = p;
    els.seek.style.setProperty('--p', `${p}%`);
  });
  els.audio.addEventListener('ended', () => setTrack(currentIndex + 1, { autoplay: true }));
  els.seek.addEventListener('input', () => {
    const p = Number(els.seek.value);
    els.seek.style.setProperty('--p', `${p}%`);
    if (els.audio.duration) els.audio.currentTime = (p / 100) * els.audio.duration;
  });

  els.playlistBtn.addEventListener('click', () => els.playlist.classList.toggle('open'));
  els.closePlaylist.addEventListener('click', () => els.playlist.classList.remove('open'));
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !/INPUT|BUTTON|A/.test(document.activeElement?.tagName || '')) {
      e.preventDefault(); togglePlay();
    }
  });

  async function boot() {
    setStatus('Loading music…');
    try {
      const r = await fetch('W-Music/W-Tracklog.json', { cache: 'no-store' });
      if (!r.ok) throw new Error(`Tracklog HTTP ${r.status}`);
      const data = await r.json();
      tracks = Array.isArray(data) ? data : data.tracks;
      if (!Array.isArray(tracks) || !tracks.length) throw new Error('No tracks');

      const q = new URLSearchParams(location.search);
      const requestedId = q.get('id');
      const requestedTrack = Number(q.get('track'));
      const idx = tracks.findIndex(t =>
        (!requestedId || musicId(t) === requestedId) &&
        (!requestedTrack || Number(t.Img) === requestedTrack)
      );
      setTrack(idx >= 0 ? idx : 0, { updateHistory: true });
      setStatus('');
    } catch (err) {
      console.error(err);
      setStatus('Unable to load W-Tracklog.json');
    }
  }

  boot();
})();
