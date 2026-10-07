(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const els = {
    app: $('.music-app'),
    cover: $('.cover-layer'),
    stage: $('.stage'),
    hero: $('.hero'),
    discWrap: $('#lyrics-disc'),
    mascot: $('#mascot'),
    title: $('#track-title'),
    story: $('#track-story'),
    theme: $('#track-theme'),
    audio: $('#audio'),
    seek: $('#seek'),
    current: $('#current-time'),
    duration: $('#duration'),
    play: $('#play'),
    lyricsToggle: $('#lyrics-toggle'),
    prev: $('#prev'),
    next: $('#next'),
    metaLink: $('#track-meta-link'),
    repeatOne: $('#repeat-one'),
    playbackAll: $('#playback-all'),
    playbackMode: $('#playback-mode'),
    playbackModeMark: $('#playback-mode-mark'),
    playbackListPicker: $('#playback-list-picker'),
    currentFavorite: $('#current-favorite'),
    customListPicker: $('#custom-list-picker'),
    playerShell: $('.player-shell'),
    playlistBtn: $('#playlist-btn'),
    playlist: $('#playlist'),
    closePlaylist: $('#close-playlist'),
    trackList: $('#track-list'),
    playlistFilters: $$('.playlist-filter'),
    contentFilterTabs: $('.content-filter-tabs'),
    lyricsPanel: $('#lyrics-panel'),
    closeLyrics: $('#close-lyrics'),
    lyricsContent: $('#lyrics-content'),
    lyricsTrackTitle: $('#lyrics-track-title'),
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

  const HEART_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/></svg>';

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
  let lyricsLoadSerial = 0;
  const playedTrackKeys = new Set();

  const REPEAT_ONE_KEY = 'yuri1_music_repeat_one';
  const LEGACY_FAVORITES_KEY = 'yuri1_music_favorites';
  const CUSTOM_LISTS_KEY = 'yuri1_music_custom_lists_v1';
  const PLAYER_STATE_KEY = 'yuri1_music_player_state_v1';
  const PLAYER_STATE_VERSION = 1;

  const LIST_DEFS = [
    {
      id: 1, sup: '¹', label: 'Ice cream',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11"/><path d="M17 7A5 5 0 0 0 7 7"/><path d="M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4"/></svg>'
    },
    {
      id: 2, sup: '²', label: 'Candy',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 7v10.9"/><path d="M14 6.1V17"/><path d="M16 7V3a1 1 0 0 1 1.707-.707 2.5 2.5 0 0 0 2.152.717 1 1 0 0 1 1.131 1.131 2.5 2.5 0 0 0 .717 2.152A1 1 0 0 1 21 8h-4"/><path d="M16.536 7.465a5 5 0 0 0-7.072 0l-2 2a5 5 0 0 0 0 7.07 5 5 0 0 0 7.072 0l2-2a5 5 0 0 0 0-7.07"/><path d="M8 17v4a1 1 0 0 1-1.707.707 2.5 2.5 0 0 0-2.152-.717 1 1 0 0 1-1.131-1.131 2.5 2.5 0 0 0-.717-2.152A1 1 0 0 1 3 16h4"/></svg>'
    },
    {
      id: 3, sup: '³', label: 'Cherry',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z"/><path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z"/><path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12"/><path d="M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z"/></svg>'
    },
    {
      id: 4, sup: '⁴', label: 'Zap',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>'
    },
    {
      id: 5, sup: '⁵', label: 'Knight',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path d="M16.5 18c1-2 2.5-5 2.5-9a7 7 0 0 0-7-7H6.635a1 1 0 0 0-.768 1.64L7 5l-2.32 5.802a2 2 0 0 0 .95 2.526l2.87 1.456"/><path d="m15 5 1.425-1.425"/><path d="m17 8 1.53-1.53"/><path d="M9.713 12.185 7 18"/></svg>'
    },
    {
      id: 6, sup: '⁶', label: 'Moon',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>'
    }
  ];

  function readPlayerState() {
    try {
      const value = JSON.parse(localStorage.getItem(PLAYER_STATE_KEY) || 'null');
      if (!value || value.version !== PLAYER_STATE_VERSION) return null;
      return value;
    } catch (_) {
      return null;
    }
  }

  const restoredPlayerState = readPlayerState();
  const storedRepeatOne = localStorage.getItem(REPEAT_ONE_KEY);
  let repeatOne = storedRepeatOne === '1';
  if (storedRepeatOne === null && typeof restoredPlayerState?.repeatOne === 'boolean') {
    repeatOne = restoredPlayerState.repeatOne;
  }

  let playbackList = 0; // 0 = ALL Track, 1..6 = custom list playback pool
  let lastPlaybackList = 1; // remembers the last FAV bank while ALL Track is active
  let trackListView = 1; // 1..6 = selected custom-list context
  let contentFilter = 'ALL'; // ALL | FAV_ONLY | any Type value
  const customLists = new Map(LIST_DEFS.map(def => [def.id, new Set()]));
  let pendingResumeTime = null;
  let pendingResumeTrackKey = '';
  let lastStateWriteAt = 0;
  let lastMediaPositionUpdateAt = 0;

  function validListId(value) {
    const id = Number(value);
    return LIST_DEFS.some(def => def.id === id) ? id : 0;
  }

  function loadCustomLists() {
    try {
      const stored = JSON.parse(localStorage.getItem(CUSTOM_LISTS_KEY) || 'null');
      if (!stored || typeof stored !== 'object') return false;
      for (const def of LIST_DEFS) {
        const items = stored[String(def.id)];
        if (!Array.isArray(items)) continue;
        const set = customLists.get(def.id);
        items.forEach(key => set.add(String(key)));
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  function persistCustomLists() {
    try {
      const data = {};
      for (const def of LIST_DEFS) data[String(def.id)] = [...customLists.get(def.id)];
      localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  // Migrate the old single Favorite set only when no six-list state exists yet.
  if (!loadCustomLists()) {
    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_FAVORITES_KEY) || '[]');
      if (Array.isArray(legacy)) legacy.forEach(key => customLists.get(1).add(String(key)));
      persistCustomLists();
    } catch (_) {}
  }

  if (restoredPlayerState) {
    playbackList = validListId(restoredPlayerState.playbackList);
    lastPlaybackList = validListId(restoredPlayerState.lastPlaybackList) || playbackList || 1;
    trackListView = validListId(restoredPlayerState.trackListView) || playbackList || lastPlaybackList || 1;
    if (typeof restoredPlayerState.contentFilter === 'string' && restoredPlayerState.contentFilter) {
      contentFilter = restoredPlayerState.contentFilter;
    }
    if (typeof restoredPlayerState.repeatOne === 'boolean') repeatOne = restoredPlayerState.repeatOne;
  }

  function listDef(id) {
    return LIST_DEFS.find(def => def.id === Number(id)) || null;
  }

  function listSet(id) {
    return customLists.get(Number(id)) || null;
  }

  function isInList(track, listId) {
    const set = listSet(listId);
    return Boolean(track && set?.has(trackKey(track)));
  }

  function isInAnyList(track) {
    return LIST_DEFS.some(def => isInList(track, def.id));
  }

  function listTrackIndices(listId) {
    if (!listId) return tracks.map((_, i) => i);
    return tracks.map((t, i) => isInList(t, listId) ? i : -1).filter(i => i >= 0);
  }


  function playerStateSnapshot(positionOverride = null) {
    const track = tracks[currentIndex] || null;
    const rawPosition = positionOverride !== null ? Number(positionOverride) : Number(els.audio?.currentTime || 0);
    return {
      version: PLAYER_STATE_VERSION,
      trackKey: track ? trackKey(track) : '',
      position: Number.isFinite(rawPosition) && rawPosition >= 0 ? rawPosition : 0,
      playbackList,
      lastPlaybackList,
      trackListView,
      contentFilter,
      repeatOne,
      updatedAt: Date.now()
    };
  }

  function persistPlayerState(positionOverride = null) {
    if (!tracks.length) return;
    try {
      localStorage.setItem(PLAYER_STATE_KEY, JSON.stringify(playerStateSnapshot(positionOverride)));
      lastStateWriteAt = Date.now();
    } catch (_) {}
  }

  function persistPlayerStateThrottled() {
    const now = Date.now();
    if (now - lastStateWriteAt >= 2000) persistPlayerState();
  }

  function renderRepeatOne() {
    if (!els.repeatOne) return;
    els.repeatOne.setAttribute('aria-pressed', repeatOne ? 'true' : 'false');
    els.repeatOne.setAttribute('aria-label', repeatOne ? 'Single-track loop on' : 'Single-track loop off');
    els.repeatOne.title = repeatOne ? 'Single-track loop: on' : 'Single-track loop: off';
  }

  function renderPlaybackMode() {
    if (!els.playbackMode || !els.playbackModeMark) return;
    const favOn = playbackList > 0;
    const def = listDef(favOn ? playbackList : lastPlaybackList) || listDef(1);
    if (favOn) lastPlaybackList = def.id;

    els.playbackModeMark.innerHTML = `<span class="playback-mode-list"><sup>${def.sup}</sup><span class="playback-mode-icon">${def.icon}</span></span>`;
    els.playbackMode.dataset.list = String(def.id);
    els.playbackMode.classList.toggle('active', favOn);
    els.playbackMode.setAttribute('aria-pressed', String(favOn));
    els.playbackMode.setAttribute('aria-label', favOn ? `FAV mode on: custom list ${def.id}. Choose playback list` : `Choose FAV playlist. Last used custom list ${def.id}`);
    els.playbackMode.title = favOn ? `FAV mode: custom list ${def.id} — choose playlist` : `FAV playlists — last used custom list ${def.id}`;
    renderPlaybackListPicker();

    if (els.playbackAll) {
      els.playbackAll.classList.toggle('active', !favOn);
      els.playbackAll.setAttribute('aria-pressed', String(!favOn));
      els.playbackAll.setAttribute('aria-label', favOn ? 'Switch to ALL Track' : 'ALL Track active');
      els.playbackAll.title = favOn ? 'Switch to ALL Track' : 'ALL Track';
    }
  }

  function renderCurrentFavorite() {
    if (!els.currentFavorite) return;
    const track = tracks[currentIndex];
    const favored = isInAnyList(track);
    els.currentFavorite.classList.toggle('active', favored);
    els.currentFavorite.setAttribute('aria-pressed', String(favored));
    els.currentFavorite.setAttribute('aria-label', 'Edit custom lists for current track');
    els.currentFavorite.title = favored ? 'Custom lists: saved in one or more lists' : 'Custom lists';
    renderListPicker();
  }

  function buildListPicker() {
    if (!els.customListPicker) return;
    els.customListPicker.innerHTML = LIST_DEFS.map(def => `
      <button class="custom-list-pick" type="button" data-list-id="${def.id}" aria-pressed="false" aria-label="Toggle custom list ${def.id}" title="${def.label}">
        ${def.icon}
      </button>`).join('');

    els.customListPicker.querySelectorAll('.custom-list-pick').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const track = tracks[currentIndex];
        const listId = Number(btn.dataset.listId);
        if (!track || !listId) return;
        setListMembership(track, listId, !isInList(track, listId));
      });
    });
    renderListPicker();
  }

  function renderListPicker() {
    if (!els.customListPicker) return;
    const track = tracks[currentIndex];
    els.customListPicker.querySelectorAll('.custom-list-pick').forEach(btn => {
      const listId = Number(btn.dataset.listId);
      const active = isInList(track, listId);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function closeListPicker() {
    if (!els.customListPicker || !els.currentFavorite) return;
    els.customListPicker.hidden = true;
    els.currentFavorite.setAttribute('aria-expanded', 'false');
    els.playerShell?.classList.remove('fav-picker-open');
  }

  function toggleListPicker() {
    if (!els.customListPicker || !els.currentFavorite) return;
    const willOpen = els.customListPicker.hidden;
    if (willOpen) {
      closePlaybackListPicker();
      renderListPicker();
      els.customListPicker.hidden = false;
      els.currentFavorite.setAttribute('aria-expanded', 'true');
      els.playerShell?.classList.add('fav-picker-open');
    } else {
      closeListPicker();
    }
  }

  function buildPlaybackListPicker() {
    if (!els.playbackListPicker) return;
    els.playbackListPicker.innerHTML = LIST_DEFS.map(def => `
      <button class="custom-list-pick playback-list-pick" type="button" data-list-id="${def.id}" aria-pressed="false" aria-label="Play custom list ${def.id}" title="${def.label}">
        ${def.icon}
      </button>`).join('');

    els.playbackListPicker.querySelectorAll('.playback-list-pick').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const listId = Number(btn.dataset.listId);
        if (!listId) return;
        activateFavList(listId);
        closePlaybackListPicker();
      });
    });
    renderPlaybackListPicker();
  }

  function renderPlaybackListPicker() {
    if (!els.playbackListPicker) return;
    els.playbackListPicker.querySelectorAll('.playback-list-pick').forEach(btn => {
      const listId = Number(btn.dataset.listId);
      const active = playbackList === listId;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function closePlaybackListPicker() {
    if (!els.playbackListPicker || !els.playbackMode) return;
    els.playbackListPicker.hidden = true;
    els.playbackMode.setAttribute('aria-expanded', 'false');
    els.playerShell?.classList.remove('playback-picker-open');
  }

  function togglePlaybackListPicker({ forceOpen = false } = {}) {
    if (!els.playbackListPicker || !els.playbackMode) return;
    const willOpen = forceOpen || els.playbackListPicker.hidden;
    if (willOpen) {
      closeListPicker();
      renderPlaybackListPicker();
      els.playbackListPicker.hidden = false;
      els.playbackMode.setAttribute('aria-expanded', 'true');
      els.playerShell?.classList.add('playback-picker-open');
    } else {
      closePlaybackListPicker();
    }
  }

  function fallbackFromEmptyPlaybackList({ notify = true } = {}) {
    if (!playbackList || listTrackIndices(playbackList).length) return false;
    const emptyList = playbackList;
    switchToAllTrack();
    if (notify) {
      setStatus(`Custom list ${emptyList} is empty · ALL Track`);
      window.setTimeout(() => setStatus(''), 1100);
    }
    return true;
  }

  function nextPlayableIndex(direction = 1, fromIndex = currentIndex) {
    if (!tracks.length) return -1;
    fallbackFromEmptyPlaybackList();
    const step = direction >= 0 ? 1 : -1;

    // ALL Track keeps its normal circular navigation.
    if (!playbackList) return (fromIndex + step + tracks.length) % tracks.length;

    // Inside a custom list, only move to a real previous/next item in that
    // direction. Do not wrap from the last FAV item back to the first (or vice
    // versa). Reaching a list boundary means the custom playback pool is done
    // in that direction, so return to ALL Track and continue the requested
    // previous/next action there.
    for (let idx = fromIndex + step; idx >= 0 && idx < tracks.length; idx += step) {
      if (isInList(tracks[idx], playbackList)) return idx;
    }

    switchToAllTrack();
    return (fromIndex + step + tracks.length) % tracks.length;
  }

  function moveTrack(direction, { autoplay = true, updateHistory = true } = {}) {
    const idx = nextPlayableIndex(direction);
    if (idx < 0) return false;
    setTrack(idx, { autoplay, updateHistory });
    return true;
  }

  function setListMembership(track, listId, shouldInclude) {
    if (!track) return;
    const set = listSet(listId);
    if (!set) return;
    const key = trackKey(track);
    if (shouldInclude) set.add(key);
    else set.delete(key);
    persistCustomLists();

    if (playbackList === listId) {
      const indices = listTrackIndices(listId);
      if (!indices.length) {
        fallbackFromEmptyPlaybackList();
      } else if (!isInList(tracks[currentIndex], listId)) {
        const wasPlaying = !els.audio.paused && !els.audio.ended;
        const idx = nextPlayableIndex(1);
        if (idx >= 0) setTrack(idx, { autoplay: wasPlaying, updateHistory: true });
      }
    }

    renderPlaylist();
    renderCurrentFavorite();
    renderPlaybackMode();
    persistPlayerState();
  }

  function refreshTrackListTabs() {
    if (!els.playlistFilters) return;
    els.playlistFilters.forEach(btn => {
      const active = Number(btn.dataset.listView) === Number(trackListView);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function setTrackListView(listId, { syncPlayback = false } = {}) {
    const def = listDef(listId) || listDef(1);
    if (!def) return false;
    trackListView = def.id;
    lastPlaybackList = def.id;
    if (syncPlayback) {
      playbackList = def.id;
      renderPlaybackMode();
      renderPlaybackListPicker();
    }
    refreshTrackListTabs();
    renderPlaylist();
    persistPlayerState();
    return true;
  }

  function switchToAllTrack({ notify = false } = {}) {
    if (playbackList) lastPlaybackList = playbackList;
    playbackList = 0;
    renderPlaybackMode();
    renderPlaybackListPicker();
    persistPlayerState();
    if (notify) {
      setStatus('FAV OFF');
      window.setTimeout(() => setStatus(''), 900);
    }
  }

  function activateFavList(listId) {
    const def = listDef(listId) || listDef(1);
    if (!def) return false;
    const wasPlaying = !els.audio.paused && !els.audio.ended;
    lastPlaybackList = def.id;
    playbackList = def.id;
    trackListView = def.id;
    renderPlaybackMode();
    refreshTrackListTabs();
    persistPlayerState();

    const indices = listTrackIndices(playbackList);
    // Selecting FAV is a mode change first. An empty custom list stays selected
    // so the ALL/FAV switch visibly moves to FAV and the user can choose another
    // list. Only an actual playback / previous / next operation falls back to ALL.
    if (!indices.length) {
      renderPlaybackListPicker();
      return true;
    }

    if (!isInList(tracks[currentIndex], playbackList)) {
      setTrack(indices[0], { autoplay: wasPlaying, updateHistory: true });
    }
    return true;
  }

  function sourceKey(id) {
    const m = String(id || '').match(/^(\d{8}-\d{2})/);
    return m ? m[1] : '';
  }
  function musicId(track) {
    const key = sourceKey(track.ID);
    if (key) return `m-p${key}`;
    const raw = String(track.ID || '').trim();
    return raw ? `m-${raw}` : '';
  }
  function coreAssetName(track, extension) {
    return `${String(track.ID || '').trim()} (${Number(track.Img)}).${extension}`;
  }
  function coreAssetPath(track, extension) {
    return `music-core/${encodeURIComponent(coreAssetName(track, extension))}`;
  }
  function coreRecordStem(track) {
    const id = String(track.ID || '').trim().replace(/^[-_]+/, '');
    return `${id}-${Number(track.Img)}`;
  }
  function coreRecordPath(track) {
    return `music-core/${encodeURIComponent(coreRecordStem(track))}.html`;
  }
  function coverPath(track) {
    return coreAssetPath(track, 'jpg');
  }
  function audioPath(track) {
    return coreAssetPath(track, 'mp3');
  }
  function lyricsPath(track) {
    return coreAssetPath(track, 'txt');
  }

  const coreRecordCache = new Map();

  function coreRecordKey(track) {
    return `${String(track.ID || '').trim()}::${Number(track.Img)}`;
  }

  function coreTextWithBreaks(element) {
    if (!element) return '';
    const clone = element.cloneNode(true);
    clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
    return clone.textContent.replace(/\r\n?/g, '\n');
  }

  function coreLabeledValue(doc, field, label) {
    const text = doc.querySelector(`[data-field="${field}"]`)?.textContent?.trim() || '';
    const prefix = `${label}:`;
    return text.toLowerCase().startsWith(prefix.toLowerCase())
      ? text.slice(prefix.length).trim()
      : text;
  }

  async function loadCoreRecord(track) {
    const key = coreRecordKey(track);
    if (coreRecordCache.has(key)) return await coreRecordCache.get(key);

    const job = (async () => {
      const url = await versionedAsset(coreRecordPath(track));
      const r = await fetch(url, { cache: 'no-cache' });
      if (!r.ok) throw new Error(`Core record HTTP ${r.status}`);
      const html = await r.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const lyricsEl = doc.querySelector('[data-field="Lyrics"]');
      if (!lyricsEl) throw new Error('Core record missing Lyrics');
      return {
        lyrics: coreTextWithBreaks(lyricsEl),
        image: coreLabeledValue(doc, 'Image', 'Image'),
        mp3: coreLabeledValue(doc, 'MP3', 'MP3'),
        text: coreLabeledValue(doc, 'Text', 'Text'),
        userGui: coreLabeledValue(doc, 'User GUI', 'User GUI')
      };
    })();

    coreRecordCache.set(key, job);
    try {
      const record = await job;
      coreRecordCache.set(key, record);
      return record;
    } catch (error) {
      coreRecordCache.delete(key);
      throw error;
    }
  }

  function coreCatalogTracks(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const rows = [...doc.querySelectorAll('#music-catalog tbody tr')];
    if (!rows.length) throw new Error('Music Core catalog is empty');

    const field = (row, name) =>
      row.querySelector(`[data-field="${name}"]`)?.textContent?.trim() || '';

    return rows.map((row, index) => {
      const ID = field(row, 'ID');
      const imgRaw = field(row, 'Img');
      if (!ID || !/^\d+$/.test(imgRaw) || Number(imgRaw) < 1) {
        throw new Error(`Invalid Music Core row ${index + 1}`);
      }
      return {
        ID,
        Img: Number(imgRaw),
        TITLE: field(row, 'TITLE'),
        STORY: field(row, 'STORY'),
        OC: field(row, 'OC'),
        Theme: field(row, 'Theme'),
        Type: field(row, 'Type')
      };
    });
  }
  function trackType(track) {
    const value = String(track?.Type || 'IP').trim() || 'IP';
    if (value.toLowerCase() === 'shorts') return 'Shorts';
    if (value.toLowerCase() === 'ip') return 'IP';
    return value;
  }
  function ocLabel(track) {
    // OC is the display character name. Theme remains the music-player filename key.
    return String(track?.OC || track?.Theme || '').trim();
  }
  function mascotPath(track) {
    return `music-player/${encodeURIComponent(String(track.Theme || '').trim())}.png`;
  }
  function postLink(track) {
    const customLink = String(track?.Link || '').trim();
    if (customLink) {
      try {
        return new URL(customLink, 'https://www.yuri1.com/').href;
      } catch {
        return '';
      }
    }

    // Shorts use the same canonical Post ID rule as every other story track.
    // Example: 20260924-02_S_LadyL -> P20260924-02
    const key = sourceKey(track.ID);
    return key ? `https://www.yuri1.com/Post.html?id=P${key}` : '';
  }
  function absoluteUrl(path) {
    return new URL(path, SITE_ROOT).href;
  }


  function updateMediaSessionPlaybackState() {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.playbackState = els.audio.paused ? 'paused' : 'playing';
    } catch (_) {}
  }

  function updateMediaSessionPosition(force = false) {
    if (!('mediaSession' in navigator) || typeof navigator.mediaSession.setPositionState !== 'function') return;
    const now = performance.now();
    if (!force && now - lastMediaPositionUpdateAt < 900) return;
    const duration = Number(els.audio.duration);
    const position = Number(els.audio.currentTime);
    const rate = Number(els.audio.playbackRate) || 1;
    if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(position)) return;
    try {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: rate,
        position: Math.min(Math.max(0, position), Math.max(0, duration - 0.001))
      });
      lastMediaPositionUpdateAt = now;
    } catch (_) {}
  }

  function updateMediaSessionMetadata(track, coverRaw = null) {
    if (!track || !('mediaSession' in navigator) || typeof window.MediaMetadata !== 'function') return;
    const canonicalCover = absoluteUrl(coverRaw || coverPath(track));
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.TITLE || 'Untitled',
        artist: ocLabel(track) || 'YURI NO1',
        album: track.STORY ? `${track.STORY} · YURI NO1` : 'YURI NO1 Music',
        artwork: [{ src: canonicalCover, type: 'image/jpeg' }]
      });
    } catch (_) {}
  }

  function setMediaAction(action, handler) {
    if (!('mediaSession' in navigator)) return;
    try { navigator.mediaSession.setActionHandler(action, handler); } catch (_) {}
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
      music_oc: ocLabel(track),
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

  function lyricsPanelOpen() {
    return Boolean(els.lyricsPanel?.classList.contains('open'));
  }

  function renderLyricsText(text) {
    if (!els.lyricsContent) return;
    els.lyricsContent.replaceChildren();

    const cleaned = String(text || '').replace(/^\uFEFF/, '').trim();
    if (!cleaned) {
      const message = document.createElement('div');
      message.className = 'lyrics-message';
      message.textContent = 'Lyrics unavailable.';
      els.lyricsContent.appendChild(message);
      return;
    }

    const fragment = document.createDocumentFragment();
    const lines = cleaned.split(/\r?\n/);

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();

      if (!line.trim()) {
        const blank = document.createElement('div');
        blank.className = 'lyrics-blank';
        blank.setAttribute('aria-hidden', 'true');
        fragment.appendChild(blank);
        continue;
      }

      const row = document.createElement('div');
      const trimmed = line.trim();
      const isCue = /^\[[^\]]+\]$/.test(trimmed);
      row.className = isCue ? 'lyrics-cue' : 'lyrics-line';
      row.textContent = line;
      fragment.appendChild(row);
    }

    els.lyricsContent.appendChild(fragment);
  }

  function renderLyricsMessage(text) {
    if (!els.lyricsContent) return;
    els.lyricsContent.replaceChildren();
    const message = document.createElement('div');
    message.className = 'lyrics-message';
    message.textContent = text;
    els.lyricsContent.appendChild(message);
  }

  async function loadLyrics(track) {
    if (!els.lyricsContent || !track) return;
    const serial = ++lyricsLoadSerial;
    els.lyricsContent.scrollTop = 0;
    if (els.lyricsTrackTitle) els.lyricsTrackTitle.textContent = track.TITLE || 'Untitled';
    renderLyricsMessage('Loading lyrics…');

    try {
      let text = '';
      try {
        const record = await loadCoreRecord(track);
        text = record.lyrics;
      } catch (coreError) {
        // Archive HTML is primary; TXT remains a fallback during migration/testing.
        console.warn(coreError);
        const url = await versionedAsset(lyricsPath(track));
        const r = await fetch(url, { cache: 'no-cache' });
        if (!r.ok) throw new Error(`Lyrics HTTP ${r.status}`);
        text = await r.text();
      }
      if (serial !== lyricsLoadSerial) return;
      renderLyricsText(text);
      els.lyricsContent.scrollTop = 0;
    } catch (_) {
      if (serial !== lyricsLoadSerial) return;
      renderLyricsMessage('Lyrics unavailable.');
      els.lyricsContent.scrollTop = 0;
    }
  }

  function openLyrics() {
    if (!els.lyricsPanel || !tracks.length) return;
    els.playlist?.classList.remove('open');
    els.lyricsPanel.classList.add('open');
    els.lyricsPanel.setAttribute('aria-hidden', 'false');
    loadLyrics(tracks[currentIndex]);
  }

  function closeLyrics() {
    if (!els.lyricsPanel) return;
    els.lyricsPanel.classList.remove('open');
    els.lyricsPanel.setAttribute('aria-hidden', 'true');
    if (els.lyricsContent) els.lyricsContent.scrollTop = 0;
  }

  function setTrack(index, { autoplay = false, updateHistory = true, updateSeo = true, trackView = true, resumeTime = null } = {}) {
    if (!tracks.length) return;
    currentIndex = (index + tracks.length) % tracks.length;
    const t = tracks[currentIndex];
    pendingResumeTime = Number.isFinite(Number(resumeTime)) && Number(resumeTime) > 0 ? Number(resumeTime) : null;
    pendingResumeTrackKey = pendingResumeTime !== null ? trackKey(t) : '';
    updateMediaSessionMetadata(t);
    closeListPicker();
    closePlaybackListPicker();

    els.app.classList.remove('playing');
    els.title.textContent = t.TITLE || 'Untitled';
    els.story.textContent = t.STORY || '';
    els.theme.textContent = ocLabel(t);
    const serial = ++assetRenderSerial;
    els.audio.pause();
    els.audio.preload = 'auto';
    els.audio.removeAttribute('src');
    els.audio.load();

    const mascotRaw = mascotPath(t);

    // The selected track reads its exact image/MP3 filenames from the closed
    // archive HTML. If that record is unavailable, the legacy ID + Img naming
    // convention remains a safe fallback.
    loadCoreRecord(t).catch(() => null).then(record => {
      if (serial !== assetRenderSerial) return;
      const coverRaw = record?.image
        ? `music-core/${encodeURIComponent(record.image)}`
        : coverPath(t);
      const audioRaw = record?.mp3
        ? `music-core/${encodeURIComponent(record.mp3)}`
        : audioPath(t);

      updateMediaSessionMetadata(t, coverRaw);

      versionedAsset(coverRaw).then(coverUrl => {
        if (serial !== assetRenderSerial) return;
        els.cover.style.backgroundImage = `url("${coverUrl}")`;
        document.body.style.backgroundImage = `url("${coverUrl}")`;
        document.body.style.setProperty('--cover-image', `url("${coverUrl}")`);
      });

      versionedAsset(audioRaw).then(audioUrl => {
        if (serial !== assetRenderSerial) return;
        const shouldAutoplay = autoplay;
        els.audio.src = audioUrl;
        els.audio.load();
        if (shouldAutoplay) els.audio.play().catch(() => {});
      });
    });

    versionedAsset(mascotRaw).then(mascotUrl => {
      if (serial !== assetRenderSerial) return;
      els.mascot.src = mascotUrl;
    });
    els.seek.value = 0;
    els.seek.style.setProperty('--p', '0%');
    els.current.textContent = '0:00';
    els.duration.textContent = '0:00';
    els.play.innerHTML = ICONS.play;
    els.play.setAttribute('aria-label', 'Play');
    els.play.setAttribute('title', 'Play / Pause');

    const link = postLink(t);
    if (els.metaLink) {
      els.metaLink.href = link || '#';
      els.metaLink.setAttribute('aria-disabled', link ? 'false' : 'true');
      els.metaLink.tabIndex = link ? 0 : -1;
    }
    renderCurrentFavorite();

    if (updateHistory) updateUrl(t, true);
    if (updateSeo) applyTrackSeo(t);
    if (trackView) sendGaEvent('music_track_view', t);
    renderPlaylist();
    if (lyricsPanelOpen()) loadLyrics(t);
    persistPlayerState(pendingResumeTrackKey === trackKey(t) ? pendingResumeTime : 0);

  }

  function availableTrackTypes() {
    const seen = new Map();
    tracks.forEach(track => {
      const value = trackType(track);
      const key = value.toLowerCase();
      if (!seen.has(key)) seen.set(key, value);
    });

    const preferred = ['Album', 'IP', 'Shorts'];
    const ordered = [];
    preferred.forEach(name => {
      const hit = seen.get(name.toLowerCase());
      if (hit) {
        ordered.push(hit);
        seen.delete(name.toLowerCase());
      }
    });
    ordered.push(...[...seen.values()].sort((a, b) => a.localeCompare(b)));
    return ordered;
  }

  function matchesContentFilter(track) {
    if (contentFilter === 'ALL') return true;
    if (contentFilter === 'FAV_ONLY') {
      return trackListView ? isInList(track, trackListView) : isInAnyList(track);
    }
    return trackType(track).toLowerCase() === String(contentFilter).toLowerCase();
  }

  function buildContentFilters() {
    const container = els.contentFilterTabs || $('.content-filter-tabs');
    if (!container) return;
    container.replaceChildren();

    const defs = [
      { value: 'ALL', label: 'ALL' },
      { value: 'FAV_ONLY', label: '♥ FAV ONLY', fav: true },
      ...availableTrackTypes().map(value => ({ value, label: value }))
    ];

    defs.forEach(def => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `playlist-filter content-filter${def.fav ? ' fav-only-filter' : ''}`;
      btn.dataset.contentFilter = def.value;
      btn.textContent = def.label;
      const refresh = () => {
        const active = contentFilter === def.value;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
      };
      btn.addEventListener('click', () => {
        contentFilter = def.value;
        [...container.querySelectorAll('.content-filter')].forEach(item => {
          const active = item.dataset.contentFilter === contentFilter;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        renderPlaylist();
        persistPlayerState();
      });
      refresh();
      container.appendChild(btn);
    });
  }

  function renderPlaylist() {
    els.trackList.innerHTML = '';

    const visible = tracks.map((t, i) => ({ t, i })).filter(({ t }) => matchesContentFilter(t));

    if (!visible.length) {
      const empty = document.createElement('div');
      empty.className = 'track-list-empty';
      empty.textContent = contentFilter === 'FAV_ONLY' ? 'No favorites in this view.' : 'No tracks in this filter.';
      els.trackList.appendChild(empty);
      return;
    }

    visible.forEach(({ t, i }) => {
      const row = document.createElement('div');
      const type = trackType(t);
      const editingList = trackListView;
      const favored = editingList ? isInList(t, editingList) : false;
      const favoriteControl = editingList ? `
        <button class="track-favorite${favored ? ' active' : ''}" type="button" aria-pressed="${favored}" aria-label="${favored ? `Remove from custom list ${editingList}` : `Add to custom list ${editingList}`}" title="Custom list ${editingList}">${HEART_ICON}</button>` : '';
      row.className = `track-item${i === currentIndex ? ' active' : ''}${editingList ? '' : ' library-view'}`;
      row.setAttribute('role', 'button');
      row.tabIndex = 0;
      row.innerHTML = `
        <img alt="" src="${coverPath(t)}">
        <span class="track-copy-row"><b>${escapeHtml(t.TITLE || 'Untitled')}</b><span>${escapeHtml(t.STORY || '')}</span></span>
        <span class="track-side"><span class="theme">${escapeHtml(ocLabel(t))}</span><span class="track-type">${escapeHtml(type)}</span></span>
        ${favoriteControl}`;

      const thumb = row.querySelector('img');
      versionedAsset(coverPath(t)).then(url => {
        if (thumb?.isConnected) thumb.src = url;
      });

      const selectTrack = () => {
        const sourceList = Number(trackListView) || lastPlaybackList || 1;
        // A track chosen from a custom-list context belongs to that playback context.
        // Do not silently fall back to ALL merely because the row itself is not yet
        // saved in that list; the list tab is the user's explicit destination.
        lastPlaybackList = sourceList;
        playbackList = sourceList;
        renderPlaybackMode();
        renderPlaybackListPicker();
        setTrack(i, { autoplay: !els.audio.paused, updateHistory: true });
        els.playlist.classList.remove('open');
      };

      row.addEventListener('click', e => {
        if (e.target.closest('.track-favorite')) return;
        selectTrack();
      });
      row.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.track-favorite')) {
          e.preventDefault();
          selectTrack();
        }
      });

      const favoriteBtn = row.querySelector('.track-favorite');
      favoriteBtn?.addEventListener('click', e => {
        e.stopPropagation();
        setListMembership(t, editingList, !isInList(t, editingList));
      });

      els.trackList.appendChild(row);
    });
  }


  function escapeHtml(s) {
    return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  // =======================================================
  // HORIZONTAL SWIPE NAVIGATION
  // Swipe left = next track, swipe right = previous track.
  // Interactive controls are excluded so seeking/tapping never changes tracks.
  // =======================================================
  const SWIPE_THRESHOLD = 68;
  const SWIPE_VELOCITY = 0.48; // px/ms
  const SWIPE_MIN_FLICK = 30;
  const SWIPE_MAX_DRAG = 150;

  const swipe = {
    active: false,
    locked: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    startTime: 0,
    dx: 0
  };

  let suppressMetaClickUntil = 0;
  let suppressPanelDismissUntil = 0;

  function isSwipeBlockedTarget(target) {
    if (target?.closest?.('.track-meta-link')) return false;
    return Boolean(target?.closest?.(
      'button, a, input, select, textarea, label, .disc-wrap, .player-shell, .playlist, .topbar'
    ));
  }

  function setHeroSwipeOffset(dx, tracking = true) {
    if (!els.hero) return;
    const limited = Math.max(-SWIPE_MAX_DRAG, Math.min(SWIPE_MAX_DRAG, dx));
    els.hero.classList.toggle('swipe-tracking', tracking);
    els.hero.style.setProperty('--swipe-x', `${limited}px`);
    els.hero.style.setProperty('--swipe-opacity', String(1 - Math.min(0.42, Math.abs(limited) / 430)));
  }

  function resetHeroSwipe() {
    if (!els.hero) return;
    els.hero.classList.remove('swipe-tracking');
    els.hero.style.setProperty('--swipe-x', '0px');
    els.hero.style.setProperty('--swipe-opacity', '1');
  }

  function finishSwipe(direction) {
    if (!els.hero || !direction) {
      resetHeroSwipe();
      return;
    }

    const wasPlaying = !els.audio.paused && !els.audio.ended;
    const exitX = direction > 0 ? -Math.min(180, innerWidth * 0.28) : Math.min(180, innerWidth * 0.28);
    els.hero.classList.remove('swipe-tracking');
    els.hero.style.setProperty('--swipe-x', `${exitX}px`);
    els.hero.style.setProperty('--swipe-opacity', '0.18');

    const targetIndex = nextPlayableIndex(direction);
    if (targetIndex < 0) {
      resetHeroSwipe();
      return;
    }

    window.setTimeout(() => {
      setTrack(targetIndex, { autoplay: wasPlaying, updateHistory: true });

      // Bring the new track in from the opposite side without flashing.
      const enterX = -exitX * 0.55;
      els.hero.classList.add('swipe-no-transition');
      els.hero.style.setProperty('--swipe-x', `${enterX}px`);
      els.hero.style.setProperty('--swipe-opacity', '0.35');
      void els.hero.offsetWidth;
      els.hero.classList.remove('swipe-no-transition');
      requestAnimationFrame(() => resetHeroSwipe());
    }, 115);
  }

  function cancelSwipe() {
    swipe.active = false;
    swipe.locked = false;
    swipe.pointerId = null;
    swipe.dx = 0;
    resetHeroSwipe();
  }

  if (els.stage && els.hero && window.PointerEvent) {
    els.stage.addEventListener('pointerdown', e => {
      if (!e.isPrimary || isSwipeBlockedTarget(e.target) || els.playlist.classList.contains('open')) return;
      // Touch/pen are the intended gestures. Mouse drag is ignored to avoid accidental desktop switching.
      if (e.pointerType === 'mouse') return;

      swipe.active = true;
      swipe.locked = false;
      swipe.pointerId = e.pointerId;
      swipe.startX = swipe.lastX = e.clientX;
      swipe.startY = e.clientY;
      swipe.startTime = performance.now();
      swipe.dx = 0;
      try { els.stage.setPointerCapture(e.pointerId); } catch (_) {}
    });

    els.stage.addEventListener('pointermove', e => {
      if (!swipe.active || e.pointerId !== swipe.pointerId) return;
      const dx = e.clientX - swipe.startX;
      const dy = e.clientY - swipe.startY;

      if (!swipe.locked) {
        if (Math.abs(dx) < 9 && Math.abs(dy) < 9) return;
        if (Math.abs(dy) >= Math.abs(dx) * 0.78) {
          cancelSwipe();
          return;
        }
        swipe.locked = true;
      }

      swipe.dx = dx;
      swipe.lastX = e.clientX;
      setHeroSwipeOffset(dx * 0.72, true);
      if (e.cancelable) e.preventDefault();
    }, { passive: false });

    const endSwipe = e => {
      if (!swipe.active || e.pointerId !== swipe.pointerId) return;
      const dx = swipe.dx || (e.clientX - swipe.startX);
      const elapsed = Math.max(1, performance.now() - swipe.startTime);
      const velocity = Math.abs(dx) / elapsed;
      const wasHorizontalGesture = swipe.locked && Math.abs(dx) >= 9;
      const shouldChange = swipe.locked && (
        Math.abs(dx) >= SWIPE_THRESHOLD ||
        (Math.abs(dx) >= SWIPE_MIN_FLICK && velocity >= SWIPE_VELOCITY)
      );

      swipe.active = false;
      swipe.locked = false;
      swipe.pointerId = null;

      // A horizontal swipe/drag should never be treated as an outside tap that closes panels.
      if (wasHorizontalGesture) suppressPanelDismissUntil = performance.now() + 450;

      if (!shouldChange) {
        resetHeroSwipe();
        return;
      }

      // Suppress the metadata link click generated by the same release gesture.
      suppressMetaClickUntil = performance.now() + 450;

      // Finger moves left -> next track (+1). Finger moves right -> previous track (-1).
      finishSwipe(dx < 0 ? 1 : -1);
    };

    els.stage.addEventListener('pointerup', endSwipe);
    els.stage.addEventListener('pointercancel', cancelSwipe);
    els.stage.addEventListener('lostpointercapture', () => {
      if (swipe.active) cancelSwipe();
    });
  }

  async function resumePlayback() {
    fallbackFromEmptyPlaybackList();
    if (playbackList && !isInList(tracks[currentIndex], playbackList)) {
      const indices = listTrackIndices(playbackList);
      if (indices.length) {
        setTrack(indices[0], { autoplay: true, updateHistory: true });
        return;
      }
    }
    try { await els.audio.play(); } catch (_) {}
  }

  async function togglePlay() {
    if (els.audio.paused) await resumePlayback();
    else els.audio.pause();
  }

  function configureMediaSession() {
    if (!('mediaSession' in navigator)) return;
    setMediaAction('play', () => resumePlayback());
    setMediaAction('pause', () => els.audio.pause());
    setMediaAction('previoustrack', () => moveTrack(-1, { autoplay: true, updateHistory: true }));
    setMediaAction('nexttrack', () => moveTrack(1, { autoplay: true, updateHistory: true }));
    setMediaAction('seekbackward', details => {
      const offset = Number(details?.seekOffset) || 10;
      if (Number.isFinite(els.audio.duration)) els.audio.currentTime = Math.max(0, els.audio.currentTime - offset);
      updateMediaSessionPosition(true);
      persistPlayerState();
    });
    setMediaAction('seekforward', details => {
      const offset = Number(details?.seekOffset) || 10;
      if (Number.isFinite(els.audio.duration)) els.audio.currentTime = Math.min(els.audio.duration, els.audio.currentTime + offset);
      updateMediaSessionPosition(true);
      persistPlayerState();
    });
    setMediaAction('seekto', details => {
      if (!Number.isFinite(Number(details?.seekTime)) || !Number.isFinite(els.audio.duration)) return;
      els.audio.currentTime = Math.min(Math.max(0, Number(details.seekTime)), els.audio.duration);
      updateMediaSessionPosition(true);
      persistPlayerState();
    });
  }

  els.metaLink?.addEventListener('click', e => {
    const disabled = els.metaLink.getAttribute('aria-disabled') === 'true';
    if (disabled || performance.now() < suppressMetaClickUntil) {
      e.preventDefault();
      return;
    }
  });

  els.prev.addEventListener('click', () => moveTrack(-1, { autoplay: true }));
  els.next.addEventListener('click', () => moveTrack(1, { autoplay: true }));
  els.audio.addEventListener('play', () => {
    els.app.classList.add('playing');
    updateMediaSessionPlaybackState();
    updateMediaSessionPosition(true);
    persistPlayerState();
    els.play.innerHTML = ICONS.pause;
    els.play.setAttribute('aria-label', 'Pause');
    els.play.setAttribute('title', 'Play / Pause');
    const t = tracks[currentIndex];
    const key = t ? trackKey(t) : '';
    if (key && !playedTrackKeys.has(key)) {
      playedTrackKeys.add(key);
      sendGaEvent('music_play', t);
    }
  });
  els.audio.addEventListener('pause', () => {
    els.app.classList.remove('playing');
    updateMediaSessionPlaybackState();
    updateMediaSessionPosition(true);
    persistPlayerState();
    els.play.innerHTML = ICONS.play;
    els.play.setAttribute('aria-label', 'Play');
    els.play.setAttribute('title', 'Play / Pause');
  });
  els.audio.addEventListener('loadedmetadata', () => {
    els.duration.textContent = fmt(els.audio.duration);
    const t = tracks[currentIndex];
    if (t && pendingResumeTime !== null && pendingResumeTrackKey === trackKey(t)) {
      const maxPosition = Number.isFinite(els.audio.duration) ? Math.max(0, els.audio.duration - 0.25) : pendingResumeTime;
      els.audio.currentTime = Math.min(Math.max(0, pendingResumeTime), maxPosition);
      pendingResumeTime = null;
      pendingResumeTrackKey = '';
      els.current.textContent = fmt(els.audio.currentTime);
      const restoredP = els.audio.duration ? (els.audio.currentTime / els.audio.duration) * 100 : 0;
      els.seek.value = restoredP;
      els.seek.style.setProperty('--p', `${restoredP}%`);
      persistPlayerState();
    }
    updateMediaSessionPosition(true);
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
    updateMediaSessionPosition();
    persistPlayerStateThrottled();
  });
  els.audio.addEventListener('ended', () => {
    const t = tracks[currentIndex];
    sendGaEvent('music_complete', t);
    persistPlayerState(0);
    if (repeatOne) {
      els.audio.currentTime = 0;
      els.audio.play().catch(() => {});
      return;
    }
    moveTrack(1, { autoplay: true });
  });
  els.seek.addEventListener('input', () => {
    const p = Number(els.seek.value);
    els.seek.style.setProperty('--p', `${p}%`);
    if (els.audio.duration) els.audio.currentTime = (p / 100) * els.audio.duration;
    updateMediaSessionPosition(true);
    persistPlayerState();
  });

  els.repeatOne?.addEventListener('click', () => {
    repeatOne = !repeatOne;
    localStorage.setItem(REPEAT_ONE_KEY, repeatOne ? '1' : '0');
    renderRepeatOne();
    persistPlayerState();
  });

  els.playbackAll?.addEventListener('click', () => {
    switchToAllTrack();
    closePlaybackListPicker();
  });
  els.playbackMode?.addEventListener('click', e => {
    e.stopPropagation();
    if (!playbackList) activateFavList(lastPlaybackList);
    togglePlaybackListPicker();
  });

  els.currentFavorite?.addEventListener('click', e => {
    e.stopPropagation();
    toggleListPicker();
  });

  els.customListPicker?.addEventListener('click', e => e.stopPropagation());
  els.playbackListPicker?.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', e => {
    if (els.customListPicker && !els.customListPicker.hidden) {
      if (!els.currentFavorite?.contains(e.target) && !els.customListPicker.contains(e.target)) closeListPicker();
    }
    if (els.playbackListPicker && !els.playbackListPicker.hidden) {
      if (!els.playbackMode?.contains(e.target) && !els.playbackListPicker.contains(e.target)) closePlaybackListPicker();
    }
  });

  els.playlistBtn.addEventListener('click', () => {
    closeLyrics();
    closeListPicker();
    closePlaybackListPicker();

    const willOpen = !els.playlist.classList.contains('open');
    if (willOpen) {
      // TRACK LIST always opens on the same custom list shown in the lower-left
      // playback switch. If ALL is active, remember the most recently used list.
      trackListView = playbackList || lastPlaybackList || 1;
      refreshTrackListTabs();
      renderPlaylist();
    }
    els.playlist.classList.toggle('open');
  });
  els.closePlaylist.addEventListener('click', () => els.playlist.classList.remove('open'));

  function buildListTabs() {
    const container = $('.playlist-filters');
    if (!container) return;
    container.replaceChildren();

    // Only the six custom lists belong here. The old TRACK tab was redundant and
    // caused a second, conflicting playback context.
    const values = LIST_DEFS.map(def => def.id);
    const buttons = values.map(value => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'playlist-filter custom-list-tab';
      btn.setAttribute('role', 'tab');
      btn.dataset.listView = String(value);

      const def = listDef(value);
      btn.innerHTML = `<span class="list-tab-token"><sup>${def.sup}</sup><span class="list-tab-icon">${def.icon}</span></span>`;
      btn.title = `Custom list ${def.id}: ${def.label}`;

      btn.addEventListener('click', () => {
        // Choosing a list in TRACK LIST is also choosing the active playback list.
        // Keep the lower-left FAV switch and TRACK LIST in one shared state.
        setTrackListView(value, { syncPlayback: true });
      });
      container.appendChild(btn);
      return btn;
    });

    const label = document.createElement('span');
    label.className = 'fav-edit-label';
    label.textContent = '｜Editable FAV Lists';
    label.setAttribute('aria-hidden', 'true');
    container.appendChild(label);

    els.playlistFilters = buttons;
    refreshTrackListTabs();
  }


  const toggleLyricsPanel = () => {
    if (lyricsPanelOpen()) closeLyrics();
    else openLyrics();
  };
  els.discWrap?.addEventListener('click', e => {
    if (e.target instanceof Element && e.target.closest('#play')) return;
    togglePlay();
  });
  els.play?.addEventListener('click', e => {
    e.stopPropagation();
    togglePlay();
  });
  els.lyricsToggle?.addEventListener('click', toggleLyricsPanel);
  els.closeLyrics?.addEventListener('click', closeLyrics);

  // Close Tracks/Lyrics only when the user taps the non-interactive background.
  // Bottom player controls stay fully usable while a panel is open.
  document.addEventListener('click', e => {
    if (performance.now() < suppressPanelDismissUntil) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.closest('.disc-wrap, .player-shell, .playlist, .lyrics-panel, .topbar')) return;

    const clickedAppBackground = Boolean(target.closest('.music-app'));
    const clickedDesktopBackground = target === document.body || target === document.documentElement;
    if (!clickedAppBackground && !clickedDesktopBackground) return;

    if (els.playlist?.classList.contains('open')) els.playlist.classList.remove('open');
    if (lyricsPanelOpen()) closeLyrics();
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !/INPUT|BUTTON|A/.test(document.activeElement?.tagName || '')) {
      e.preventDefault(); togglePlay();
    }
  });

  window.addEventListener('pagehide', () => persistPlayerState());
  window.addEventListener('beforeunload', () => persistPlayerState());
  document.addEventListener('freeze', () => persistPlayerState());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') persistPlayerState();
  });

  configureMediaSession();
  renderRepeatOne();
  renderPlaybackMode();
  buildPlaybackListPicker();
  buildListPicker();
  renderCurrentFavorite();

  async function boot() {
    setStatus('Loading music…');
    try {
      const catalogUrl = await versionedAsset('music-core/index.html');
      const r = await fetch(catalogUrl, { cache: 'no-cache' });
      if (!r.ok) throw new Error(`Music Core HTTP ${r.status}`);
      tracks = coreCatalogTracks(await r.text());

      // Machine identities are strict lowercase. Do not normalize legacy uppercase IDs.
      for (const track of tracks) {
        const id = String(track?.ID || '');
        const theme = String(track?.Theme || '');
        if (/[A-Z]/.test(id) || /[A-Z]/.test(theme)) {
          throw new Error(`Machine identity must be lowercase: ${id || theme}`);
        }
      }
      // Keep restored filters only when the current catalog still supports them.
      if (contentFilter !== 'ALL' && contentFilter !== 'FAV_ONLY') {
        const typeExists = availableTrackTypes().some(value => value.toLowerCase() === contentFilter.toLowerCase());
        if (!typeExists) contentFilter = 'ALL';
      }
      renderPlaybackMode();
      buildListTabs();
      buildContentFilters();

      const q = new URLSearchParams(location.search);
      const requestedId = q.get('id') || '';
      const requestedTrackRaw = q.get('track');
      const requestedTrack = requestedTrackRaw !== null ? Number(requestedTrackRaw) : null;
      const hasTrackQuery = Boolean(requestedId || requestedTrackRaw !== null);
      const idx = tracks.findIndex(t =>
        (!requestedId || musicId(t) === requestedId) &&
        (requestedTrack === null || Number(t.Img) === requestedTrack)
      );

      const restoredKey = String(restoredPlayerState?.trackKey || '');
      const restoredIndex = restoredKey ? tracks.findIndex(t => trackKey(t) === restoredKey) : -1;
      const requestedIndex = hasTrackQuery ? (idx >= 0 ? idx : 0) : (restoredIndex >= 0 ? restoredIndex : 0);
      const requestedKey = tracks[requestedIndex] ? trackKey(tracks[requestedIndex]) : '';
      const restorePosition = restoredKey && restoredKey === requestedKey
        ? Math.max(0, Number(restoredPlayerState?.position) || 0)
        : 0;

      if (hasTrackQuery) {
        setTrack(requestedIndex, {
          updateHistory: false, updateSeo: true, trackView: true, autoplay: false, resumeTime: restorePosition
        });
      } else {
        applyIndexSeo();
        setTrack(requestedIndex, {
          updateHistory: false, updateSeo: false, trackView: false, autoplay: false, resumeTime: restorePosition
        });
      }
      updateMediaSessionPlaybackState();
      setStatus('');
    } catch (err) {
      console.error(err);
      setStatus('Unable to load music-core/index.html');
    }
  }

  boot();
})();
