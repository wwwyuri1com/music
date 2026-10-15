(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const els = {
    app: $('.music-app'),
    immersiveToggle: $('#immersive-toggle'),
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
    officialTitle: $('#brand-playlist-title'),
    currentFavorite: $('#current-favorite'),
    customListPicker: $('#custom-list-picker'),
    playerShell: $('.player-shell'),
    playlistBtn: $('#playlist-btn'),
    playlist: $('#playlist'),
    closePlaylist: $('#close-playlist'),
    trackList: $('#track-list'),
    groupToggle: $('#playlist-group-toggle'),
    groupIcon: $('#playlist-group-icon'),
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

  const SITE_ROOT = new URL('./', location.href).href;
  const INDEX_URL = `${SITE_ROOT}index.html`;
  const TITLE_SUFFIX = 'YURI NO1 Music – Girls Love ♡ AI Music from Novels';
  const INDEX_DESCRIPTION = 'Original YURI NO1 AI music inspired by Girls Love novels, characters, and stories.';

  const versionedAsset = path => {
    const fn = window.YURI1Cache?.versioned;
    return typeof fn === 'function' ? fn(path) : Promise.resolve(path);
  };

  let assetRenderSerial = 0;
  let pendingAudioSourceSerial = 0;

  // Next-track audio cache: one bounded download, only after 30 seconds of
  // uninterrupted playback AND the current MP3 is fully buffered.
  const NEXT_PREFETCH_DELAY_MS = 30000;
  const NEXT_PREFETCH_MAX_BYTES = 32 * 1024 * 1024;
  let nextPrefetch = null;
  let nextPrefetchTimer = null;
  let nextPrefetchArmed = false;
  let nextPrefetchGeneration = 0;
  let activePrefetchUrl = null;

  let tracks = [];
  let currentIndex = 0;
  let immersiveMode = false;
  let lyricsLoadSerial = 0;
  const playedTrackKeys = new Set();

  const REPEAT_ONE_KEY = 'yuri1_music_repeat_one';
  const LEGACY_FAVORITES_KEY = 'yuri1_music_favorites';
  const CUSTOM_LISTS_KEY = 'yuri1_music_custom_lists_v1';
  const PLAYER_STATE_KEY = 'yuri1_music_player_state_v1';
  const PLAYER_STATE_VERSION = 1;
  const FOLDER_STATE_KEY = 'yuri1_music_folder_state_v1';
  const GROUP_MODE_KEY = 'yuri1_music_group_mode_v1';
  let characterGroups = [];
  let typeGroups = [];
  let officialLists = [];
  let officialMembers = {};
  let officialId = ''; // Official playing source, NEVER a personal FAV slot
  let lastOfficialId = ''; // Independent of FAV's lastPlaybackList
  let lastPlaybackSource = 'personal'; // Remembers which kind of playlist preceded ALL Track
  let groupMode = (()=>{try{const saved=localStorage.getItem(GROUP_MODE_KEY);return ['story','oc','off'].includes(saved)?saved:'story'}catch(_){return 'story'}})();

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
  // Folder visibility is a per-browser UI preference, independent of player state.
  // null means the user has not opened a grouped track list on this browser yet.
  function readFolderState() {
    try {
      const value = JSON.parse(localStorage.getItem(FOLDER_STATE_KEY) || 'null');
      if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
      const state = new Map(Object.entries(value).filter(([, opened]) => typeof opened === 'boolean'));
      // Migrate the previous Album/Single folder preferences to Story-only keys.
      // Keep old keys harmlessly so previously saved choices are never discarded.
      for (const [key, opened] of state) {
        let parts;
        try { parts = JSON.parse(key); } catch (_) { continue; }
        if (!Array.isArray(parts) || parts.length !== 2 ||
            !['album', 'single'].includes(parts[0]) || typeof parts[1] !== 'string') continue;
        const story = normalizedStory(parts[1]);
        if (!story) continue;
        const storyKey = JSON.stringify(['story', story]);
        if (!state.has(storyKey)) state.set(storyKey, opened);
      }
      return state;
    } catch (_) {
      return null;
    }
  }
  let folderOpenState = readFolderState();
  function saveFolderState() {
    try { localStorage.setItem(FOLDER_STATE_KEY, JSON.stringify(Object.fromEntries(folderOpenState))); }
    catch (_) {}
  }
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
    if (typeof restoredPlayerState.officialId === 'string') officialId = restoredPlayerState.officialId;
    if (typeof restoredPlayerState.lastOfficialId === 'string') lastOfficialId = restoredPlayerState.lastOfficialId;
    // Old snapshots have no source marker: preserve their original personal FAV behavior.
    if (restoredPlayerState.lastPlaybackSource === 'official' || restoredPlayerState.lastPlaybackSource === 'personal') {
      lastPlaybackSource = restoredPlayerState.lastPlaybackSource;
    } else if (officialId) {
      lastPlaybackSource = 'official';
    }
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


  function officialDef(id=officialId) { return officialLists.find(item=>item.id===id) || null; }
  function officialIndices(id=officialId) {
    if (!officialDef(id)) return [];
    return tracks.map((t,i) => (officialMembers[t.asset_no]||[]).includes(id)?i:-1).filter(i=>i>=0);
  }
  function officialContains(track,id=officialId) { return Boolean(track && (officialMembers[track.asset_no]||[]).includes(id)); }
  function officialIcon(def) {
    const valid=def && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(def.icon||'');
    return valid ? `<svg data-lucide="${escapeHtml(def.icon)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v3M5 7l2 2M19 7l-2 2M4 13h16l-3 8H7z"/></svg>` : '<span class="official-fallback">Y1</span>';
  }
  function renderOfficialUi(){
    if(els.officialTitle){els.officialTitle.hidden=!officialId;els.officialTitle.textContent=officialDef()?.name||'';}
    if(els.playlist)els.playlist.classList.toggle('official-track-mode',Boolean(officialId));
  }
  function rebuildOfficialViews(){
    if(officialId && contentFilter==='FAV_ONLY')contentFilter='ALL';
    const allowed=availableTrackTypes();
    if(officialId && contentFilter!=='ALL' && !allowed.some(v=>v.toLowerCase()===contentFilter.toLowerCase()))contentFilter='ALL';
    renderPlaybackMode();buildContentFilters();buildListTabs();renderPlaylist();persistPlayerState();
  }
  function activateOfficial(id){
    if(!officialDef(id))return false;
    const wasPlaying=!els.audio.paused&&!els.audio.ended;
    officialId=id;lastOfficialId=id;lastPlaybackSource='official';
    if(contentFilter==='FAV_ONLY')contentFilter='ALL';
    // Personal FAV bank is remembered; not overwritten by an official choice.
    playbackList=0;
    resetNextPrefetchDelay();
    rebuildOfficialViews();
    const indices=officialIndices(id);
    if(indices.length && !officialContains(tracks[currentIndex],id))setTrack(indices[0],{autoplay:wasPlaying,updateHistory:true});
    return true;
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
      officialId,
      lastOfficialId,
      lastPlaybackSource,
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
    const favOn = playbackList > 0 || Boolean(officialId);
    const def = listDef(playbackList > 0 ? playbackList : lastPlaybackList) || listDef(1);
    if (playbackList > 0) lastPlaybackList = def.id;

    // ALL Track retains the icon of the last playlist source, without entering that playlist.
    const activeOfficial=officialDef();
    const official=activeOfficial || (!favOn && lastPlaybackSource==='official' ? officialDef(lastOfficialId) : null);
    els.playbackModeMark.innerHTML = official ? `<span class="playback-mode-list official-icon" style="color:${/^#[0-9a-fA-F]{6}$/.test(official.color||'')?official.color:'#ffffff'}"><span class="playback-mode-icon">${officialIcon(official)}</span></span>` : `<span class="playback-mode-list"><sup>${def.sup}</sup><span class="playback-mode-icon">${def.icon}</span></span>`;
    els.playbackMode.dataset.list = String(def.id);
    els.playbackMode.classList.toggle('official-active',Boolean(official));
    if(official)els.playbackMode.title=official.name;
    renderOfficialUi();
    if(official)applyOfficialIcons();
    els.playbackMode.classList.toggle('active', favOn);
    els.playbackMode.setAttribute('aria-pressed', String(favOn));
    els.playbackMode.setAttribute('aria-label', favOn ? `FAV mode on: custom list ${def.id}. Choose playback list` : `Choose FAV playlist. Last used custom list ${def.id}`);
    els.playbackMode.title = favOn ? `FAV mode: custom list ${def.id} — choose playlist` : `FAV playlists — last used custom list ${def.id}`;
    renderPlaybackListPicker();
    if(official){
      els.playbackMode.setAttribute('aria-label',favOn?`Y1 Official: ${official.name}. Choose playback list`:`ALL Track. Last Y1 Official: ${official.name}. Choose playback list`);
      els.playbackMode.title=favOn?official.name:`ALL Track — last Y1 Official: ${official.name}`;
    }

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

  function applyOfficialIcons(){
    // Reuse existing lazy Lucide loader, preserving usable fallback SVG offline.
    const has=document.querySelector('[data-lucide]');
    if(!has)return;
    if(window.lucide?.createIcons){window.lucide.createIcons();return;}
    if(!folderLucideLoad)folderLucideLoad=new Promise(resolve=>{
      const script=document.createElement('script');script.src='https://unpkg.com/lucide@1.47.0';script.async=true;
      script.onload=()=>resolve(!!window.lucide?.createIcons);script.onerror=()=>resolve(false);document.head.appendChild(script);
    });
    folderLucideLoad.then(ok=>{if(ok)window.lucide.createIcons();});
  }

  function buildPlaybackListPicker() {
    if (!els.playbackListPicker) return;
    const officialButtons=officialLists.map(def=>`<button class="custom-list-pick official-list-pick" type="button" data-official-id="${escapeHtml(def.id)}" aria-label="Play ${escapeHtml(def.name)}" title="${escapeHtml(def.name)}" style="--official-color:${/^#[0-9a-fA-F]{6}$/.test(def.color||'')?def.color:'#fff'}">${officialIcon(def)}</button>`).join('');
    const personalButtons=LIST_DEFS.map(def => `<button class="custom-list-pick playback-list-pick" type="button" data-list-id="${def.id}" aria-pressed="false" aria-label="Play custom list ${def.id}" title="${def.label}">${def.icon}</button>`).join('');
    els.playbackListPicker.innerHTML=`<div class="playback-picker-column official-column"><span class="playback-picker-label">Y1 ★</span>${officialButtons||'<span class="playback-picker-empty">—</span>'}</div><div class="playback-picker-column"><span class="playback-picker-label">FAV</span>${personalButtons}</div>`;

    els.playbackListPicker.querySelectorAll('.playback-list-pick').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const listId = Number(btn.dataset.listId);
        if (!listId) return;
        activateFavList(listId);
        closePlaybackListPicker();
      });
    });
    els.playbackListPicker.querySelectorAll('.official-list-pick').forEach(btn=>{
      btn.addEventListener('click',e=>{e.stopPropagation();activateOfficial(btn.dataset.officialId);closePlaybackListPicker();});
    });
    renderPlaybackListPicker();
    applyOfficialIcons();
  }

  function renderPlaybackListPicker() {
    if (!els.playbackListPicker) return;
    els.playbackListPicker.querySelectorAll('.official-list-pick').forEach(btn=>{
      const active=officialId===btn.dataset.officialId;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));
    });
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
    if(typeof officialId!=='undefined' && officialId){
      const indices=officialIndices();
      if(indices.length<2){switchToAllTrack();return(fromIndex+(direction>=0?1:-1)+tracks.length)%tracks.length;}
      if(direction>=0)return indices.find(i=>i>fromIndex)??indices[0];
      return [...indices].reverse().find(i=>i<fromIndex)??indices[indices.length-1];
    }
    fallbackFromEmptyPlaybackList();
    const step = direction >= 0 ? 1 : -1;

    // ALL Track keeps its normal circular navigation.
    if (!playbackList) return (fromIndex + step + tracks.length) % tracks.length;

    const indices = listTrackIndices(playbackList);
    // One-song FAV banks are not a useful manual navigation loop. Return to
    // ALL Track on previous/next, keeping the original ALL Track direction.
    if (indices.length < 2) {
      switchToAllTrack();
      return (fromIndex + step + tracks.length) % tracks.length;
    }

    // Two or more favorites: manual previous/next (including swipe and media
    // controls) wraps *within the selected bank*. If the current track is not
    // in the bank, choose the closest favorite in the requested direction.
    // Keep the existing track indices so setTrack updates the TRACKS selection.
    if (step > 0) return indices.find(idx => idx > fromIndex) ?? indices[0];
    return [...indices].reverse().find(idx => idx < fromIndex) ?? indices[indices.length - 1];
  }

  function moveTrack(direction, { autoplay = true, updateHistory = true } = {}) {
    const idx = nextPlayableIndex(direction);
    if (idx < 0) return false;
    setTrack(idx, { autoplay, updateHistory });
    return true;
  }

  function nextAutomaticIndex() {
    // Natural playback advances within the selected FAV bank, wrapping at its
    // end. Manual navigation uses the same bank when it has at least two items,
    // while a one-song bank falls back to ALL for manual previous/next.
    if(typeof officialId!=='undefined' && officialId){const ids=officialIndices();if(!ids.length)return nextPlayableIndex(1);return ids.find(i=>i>currentIndex)??ids[0];}
    if (!playbackList) return nextPlayableIndex(1);
    const indices = listTrackIndices(playbackList);
    if (!indices.length) return nextPlayableIndex(1); // Keep empty-bank fallback.
    return indices.find(index => index > currentIndex) ?? indices[0];
  }

  // No requests, state writes or UI changes occur until the user has settled
  // into actual playback. A pending/ready download belongs to exactly one
  // current track and playlist context; it must never cross a context change.
  function nextPrefetchContext() {
    return `${currentIndex}|${repeatOne ? 1 : 0}|${officialId}|${playbackList}`;
  }

  function clearNextPrefetch() {
    ++nextPrefetchGeneration;
    if (nextPrefetchTimer !== null) window.clearTimeout(nextPrefetchTimer);
    nextPrefetchTimer = null;
    nextPrefetchArmed = false;
    const old = nextPrefetch;
    nextPrefetch = null;
    if (old) {
      old.controller.abort();
      if (old.objectUrl) URL.revokeObjectURL(old.objectUrl);
    }
  }

  function resetNextPrefetchDelay() {
    clearNextPrefetch();
    if (!tracks.length || repeatOne || els.audio.paused || els.audio.ended) return;
    const generation = nextPrefetchGeneration;
    const context = nextPrefetchContext();
    nextPrefetchTimer = window.setTimeout(() => {
      if (generation !== nextPrefetchGeneration || context !== nextPrefetchContext()) return;
      nextPrefetchTimer = null;
      nextPrefetchArmed = true;
      tryStartNextPrefetch();
    }, NEXT_PREFETCH_DELAY_MS);
  }

  function currentAudioFullyBuffered() {
    const duration = Number(els.audio.duration);
    if (!Number.isFinite(duration) || duration <= 0) return false;
    const buffered = els.audio.buffered;
    if (!buffered) return false;
    // A complete range from the beginning to the end; a seek-only tail range
    // is NOT proof that the entire current song has finished downloading.
    let covered = 0;
    for (let i = 0; i < buffered.length; ++i) {
      if (buffered.start(i) > covered + 0.5) break;
      covered = Math.max(covered, buffered.end(i));
      if (covered >= duration - 0.5) return true;
    }
    return false;
  }

  function tryStartNextPrefetch() {
    if (!nextPrefetchArmed || nextPrefetch || repeatOne ||
        els.audio.paused || els.audio.ended || !currentAudioFullyBuffered()) return;
    // Computing the automatic successor is allowed only for nonempty banks:
    // the existing nextAutomaticIndex() deliberately changes the playback
    // context when an empty bank is encountered, which belongs to playback.
    if (officialId && !officialIndices().length) return;
    if (!officialId && playbackList && !listTrackIndices(playbackList).length) return;
    const nextIndex = nextAutomaticIndex();
    if (nextIndex < 0 || !tracks[nextIndex]) return;
    const job = {
      index: nextIndex,
      key: trackKey(tracks[nextIndex]),
      context: nextPrefetchContext(),
      controller: new AbortController(),
      objectUrl: null
    };
    const generation = nextPrefetchGeneration;
    nextPrefetch = job;
    (async () => {
      const track = tracks[nextIndex];
      const record = await loadCoreRecord(track).catch(() => null);
      if (nextPrefetch !== job || generation !== nextPrefetchGeneration) return;
      const audioRaw = record?.mp3
        ? `aim/${encodeURIComponent(record.mp3)}` : audioPath(track);
      const audioUrl = await versionedAsset(audioRaw);
      if (nextPrefetch !== job || generation !== nextPrefetchGeneration) return;
      // Preserve the original same-origin MP3 sourcing policy.
      if (new URL(audioUrl, location.href).origin !== location.origin) return;
      const response = await fetch(audioUrl, {
        cache: 'no-cache', mode: 'same-origin', signal: job.controller.signal
      });
      if (!response.ok || response.status !== 200 || !response.body) throw Error('MP3 prefetch unavailable');
      const reportedSize = Number(response.headers.get('content-length'));
      if (reportedSize > NEXT_PREFETCH_MAX_BYTES) throw Error('MP3 exceeds prefetch limit');
      const reader = response.body.getReader();
      const parts = [];
      let length = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (nextPrefetch !== job || generation !== nextPrefetchGeneration) {
            await reader.cancel();
            return;
          }
          length += value.byteLength;
          if (length > NEXT_PREFETCH_MAX_BYTES) throw Error('MP3 exceeds prefetch limit');
          parts.push(value);
        }
      } finally {
        reader.releaseLock();
      }
      if (!length || nextPrefetch !== job || generation !== nextPrefetchGeneration) return;
      job.objectUrl = URL.createObjectURL(new Blob(parts, { type: 'audio/mpeg' }));
    })().catch(error => {
      if (nextPrefetch === job && generation === nextPrefetchGeneration) {
        // A failed prefetch must never interrupt the current song. Natural
        // completion still uses the original online loading path.
        console.warn('Next-track prefetch unavailable; normal playback retained', error);
        clearNextPrefetch();
      }
    });
  }

  function takeNextPrefetch(index) {
    const job = nextPrefetch;
    if (!job?.objectUrl || job.index !== index ||
        job.key !== trackKey(tracks[index]) || job.context !== nextPrefetchContext()) return null;
    nextPrefetch = null; // Transfer ownership: clearNextPrefetch must not revoke it.
    return job.objectUrl;
  }

  function setListMembership(track, listId, shouldInclude) {
    if (!track) return;
    const set = listSet(listId);
    if (!set) return;
    const key = trackKey(track);
    if (shouldInclude) set.add(key);
    else set.delete(key);
    persistCustomLists();
    if (!officialId && playbackList === listId) resetNextPrefetchDelay();

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
      const active = !officialId && Number(btn.dataset.listView) === Number(trackListView);
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
      officialId='';
      lastPlaybackSource='personal';
      playbackList = def.id;
      resetNextPrefetchDelay();
      renderPlaybackMode();
      renderPlaybackListPicker();
    }
    refreshTrackListTabs();
    renderPlaylist();
    persistPlayerState();
    return true;
  }

  function switchToAllTrack({ notify = false } = {}) {
    if (officialId) lastPlaybackSource='official';
    else if (playbackList) { lastPlaybackList=playbackList; lastPlaybackSource='personal'; }
    officialId='';
    playbackList = 0;
    resetNextPrefetchDelay();
    if(tracks.length){buildContentFilters();buildListTabs();renderPlaylist();}
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
    lastPlaybackSource='personal';
    officialId='';
    playbackList = def.id;
    resetNextPrefetchDelay();
    trackListView = def.id;
    if(tracks.length){buildContentFilters();buildListTabs();renderPlaylist();}
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
    const m = String(id || '').match(/^post-(\d{8}-\d{2})/);
    return m ? m[1] : '';
  }
  function musicId(track) { return track.asset_no; }
  // Accept historical share links and saved favorites while publishing only the new IDs.
  function legacyMusicId(track) { return track.Legacy ? 'm-'+track.Legacy : ''; }
  function legacyTrackKey(track) {
    const id = legacyMusicId(track);
    return id ? `${id}:${track.Img}` : '';
  }
  function coreAssetName(track, extension) { return extension === 'jpg' ? track.Image : track.asset_no+'.'+extension; }
  function coreAssetPath(track, extension) { return 'aim/'+encodeURIComponent(coreAssetName(track,extension)); }
  function coreRecordStem(track) { return track.asset_no; }
  function coreRecordPath(track) { return 'core/'+track.asset_no+'.html'; }
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

  function coreRecordKey(track) { return track.asset_no; }

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
    const doc=new DOMParser().parseFromString(html,'text/html');
    const config=doc.querySelector('#music-character-groups');
    const groups=config ? JSON.parse(config.textContent) : [];
    if (!Array.isArray(groups) || groups.some(group =>
      !(typeof group === 'string' || (group && typeof group === 'object' && !Array.isArray(group) &&
      typeof group.keyword === 'string' && typeof (group.icon || '') === 'string' && typeof (group.color || '') === 'string'))
    )) throw Error('Invalid Music Character Groups');
    characterGroups=groups.map(group => typeof group === 'string' ? {keyword:group,icon:'',color:''} : group);
    const typeConfig=doc.querySelector('#music-type-groups');
    const types=typeConfig ? JSON.parse(typeConfig.textContent) : [];
    if (!Array.isArray(types) || types.some(group =>
      !group || typeof group !== 'object' || Array.isArray(group) ||
      typeof group.type !== 'string' || typeof (group.label || '') !== 'string' ||
      typeof (group.icon || '') !== 'string' || typeof (group.color || '') !== 'string'
    )) throw Error('Invalid Music Type Groups');
    typeGroups=types;
    const officialNode=doc.querySelector('#music-official-playlists');
    const official=officialNode?JSON.parse(officialNode.textContent):{lists:[],members:{}};
    if(!official || !Array.isArray(official.lists) || !official.members || typeof official.members!=='object' || Array.isArray(official.members) ||
      official.lists.some(x=>!/^y1fav_\d{3}$/.test(x.id||'')||typeof x.name!=='string'||typeof x.icon!=='string'||typeof x.color!=='string'))throw Error('Invalid Y1 official playlists');
    officialLists=official.lists;officialMembers=official.members;
    return [...doc.querySelectorAll('#music-catalog tbody tr')].map(row=>{
      const f=n=>row.querySelector('[data-field="'+n+'"]')?.textContent?.trim() || '';
      if(!/^\d{17}$/.test(f('asset_no')))throw Error('Invalid asset_no');
      return {asset_no:f('asset_no'),ID:f('work_no'),Img:Number(f('asset_no').slice(-3)),Image:f('Image'),TITLE:f('TITLE'),STORY:f('STORY'),OC:f('OC'),Theme:f('Theme'),PlayerName:f('PlayerName'),Type:f('Type'),Link:f('Link'),YouTube:f('YouTube'),Legacy:f('Legacy'),StoryMark:f('StoryMark')};
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
    return String(track?.OC || track?.PlayerName || track?.Theme || '').trim();
  }
  function mascotPath(track) { return 'config/player/'+encodeURIComponent(track.Theme || 'default')+'.png'; }
  function postLink(track) { return track.Link || ''; }
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
  function trackUrl(track) { const u = new URL('index.html', location.href); u.searchParams.set('id',track.asset_no); return u.href; }
  function trackKey(track) { return track.asset_no; }
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
    const url = new URL('get/'+track.asset_no+'.html', SITE_ROOT).href;
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

  function setTrack(index, { autoplay = false, updateHistory = true, updateSeo = true, trackView = true, resumeTime = null, fromAutomaticEnd = false } = {}) {
    if (!tracks.length) return;
    const newIndex = (index + tracks.length) % tracks.length;
    // Only natural autoplay is allowed to consume the prepared successor. A
    // manual track change always discards it, even if the index matches.
    const preparedUrl = fromAutomaticEnd ? takeNextPrefetch(newIndex) : null;
    clearNextPrefetch();
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
    // Keep the HTMLMediaElement connected to a valid source during track
    // handoff. Explicitly emptying src + load() dismisses Chrome Android's
    // media notification, even when the next (prefetched) track is ready.
    // While a remote URL is resolving, keep the previous source PAUSED and
    // refuse play commands until the selected song's source is installed.
    pendingAudioSourceSerial = serial;
    if (!fromAutomaticEnd) els.audio.pause();
    els.audio.preload = 'auto';
    if (preparedUrl) {
      pendingAudioSourceSerial = 0;
      els.audio.src = preparedUrl;
      els.audio.load();
      // Revoke only AFTER replacing the old source; the active media element
      // must not briefly point at a revoked Blob URL during the handoff.
      if (activePrefetchUrl) URL.revokeObjectURL(activePrefetchUrl);
      activePrefetchUrl = preparedUrl;
      if (autoplay) els.audio.play().catch(() => {});
    }

    const mascotRaw = mascotPath(t);

    // The selected track reads its exact image/MP3 filenames from the closed
    // archive HTML. If that record is unavailable, the legacy ID + Img naming
    // convention remains a safe fallback.
    loadCoreRecord(t).catch(() => null).then(record => {
      if (serial !== assetRenderSerial) return;
      const coverRaw = record?.image
        ? `aim/${encodeURIComponent(record.image)}`
        : coverPath(t);
      const audioRaw = record?.mp3
        ? `aim/${encodeURIComponent(record.mp3)}`
        : audioPath(t);

      updateMediaSessionMetadata(t, coverRaw);

      versionedAsset(coverRaw).then(coverUrl => {
        if (serial !== assetRenderSerial) return;
        els.cover.style.backgroundImage = `url("${coverUrl}")`;
        document.body.style.backgroundImage = `url("${coverUrl}")`;
        document.body.style.setProperty('--cover-image', `url("${coverUrl}")`);
      });

      if (!preparedUrl) versionedAsset(audioRaw).then(audioUrl => {
        if (serial !== assetRenderSerial) return;
        const shouldAutoplay = autoplay;
        pendingAudioSourceSerial = 0;
        els.audio.src = audioUrl;
        els.audio.load();
        if (activePrefetchUrl) URL.revokeObjectURL(activePrefetchUrl);
        activePrefetchUrl = null;
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
    tracks.filter(track=>!officialId||officialContains(track)).forEach(track => {
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
    if(officialId&&!officialContains(track))return false;
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
      { value: 'ALL', label: officialId?'ALL Pick':'ALL' },
      ...(!officialId?[{ value: 'FAV_ONLY', label: '♥ FAV ONLY', fav: true }]:[]),
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

  // Story is the sole grouping identity, independent of Album/Single/EP/IP/etc.
  // Only repeated Story values in the CURRENT filter become folders; a lone
  // track remains directly clickable. Neither song order nor catalog data changes.
  function normalizedStory(story) {
    return String(story || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
  }

  function trackFolderKey(track) {
    const story = normalizedStory(track.STORY);
    return story ? JSON.stringify(['story', story]) : '';
  }

  // Group mode only changes the list presentation. It does not change the
  // playback pool, track identity, FAV membership or original track order.
  function playlistSections(visible) {
    // Off is a flat, single-copy view in the existing playback/filtered order.
    // It does not participate in OC, Type or Story folder classification.
    if (groupMode === 'off') return visible.map(entry => ({entry}));
    if (groupMode === 'oc') {
      const active = [];
      const classified = new Set();
      // Explicit W order controls folder order. Every group tests the ORIGINAL
      // OC field literally, case-insensitively; no aliases, regex or Theme.
      for (const config of characterGroups) {
        const keyword = typeof config === 'string' ? config : config.keyword;
        const needle = String(keyword || '').toLowerCase();
        if (!needle) continue;
        const entries = visible.filter(({t}) => String(t.OC || '').toLowerCase().includes(needle));
        if (entries.length < 2) continue;
        const mark = typeof config === 'string' ? {} : {icon:config.icon||'',color:config.color||''};
        active.push({folder:{key:JSON.stringify(['oc', needle]), title:keyword, entries,mark}});
        entries.forEach(({i}) => classified.add(i));
      }
      // Type is an exclusive fallback ONLY for songs not collected by any
      // active OC folder. Single OC keyword hits (<2 in this filter) do not
      // consume tracks, so Type can still organize them.
      for (const config of typeGroups) {
        const kind=String(config.type || '').trim().toLocaleLowerCase();
        if (!kind) continue;
        const entries=visible.filter(({t,i}) => !classified.has(i) &&
          trackType(t).trim().toLocaleLowerCase() === kind);
        if (entries.length < 2) continue;
        active.push({folder:{key:JSON.stringify(['type',kind]),
          title:String(config.label || '').trim() || String(config.type).trim(),entries,
          mark:{icon:config.icon||'',color:config.color||''}}});
        entries.forEach(({i}) => classified.add(i));
      }
      // OC may display one song in multiple OC folders; Type never duplicates
      // an OC-collected song nor any other Type folder. No source data changes.
      return [...active, ...visible.filter(({i}) => !classified.has(i)).map(entry => ({entry}))];
    }
    // The existing Story behavior is preserved, including first-appearance
    // order, exact visible-filter counts and legacy collapsed-folder keys.
    const sections = [];
    const folders = new Map();
    const counts = new Map();
    for (const entry of visible) {
      const key = trackFolderKey(entry.t);
      if (key) counts.set(key, (counts.get(key) || 0) + 1);
    }
    for (const entry of visible) {
      const key = trackFolderKey(entry.t);
      if (!key || counts.get(key) < 2) {
        sections.push({ entry });
        continue;
      }
      if (!folders.has(key)) {
        const folder = { key, title: String(entry.t.STORY).trim(), entries: [] };
        folders.set(key, folder);
        sections.push({ folder });
      }
      folders.get(key).entries.push(entry);
    }
    return sections;
  }

  function storyFolderMark(entries) {
    let common=null;
    for (const {t} of entries) {
      let mark={};
      try { mark=JSON.parse(t.StoryMark || '{}'); } catch (_) { return {}; }
      if (!mark || typeof mark !== 'object') return {};
      const current={icon:String(mark.icon||''),color:String(mark.color||'')};
      if (common === null) common=current;
      else if (common.icon !== current.icon || common.color.toLowerCase() !== current.color.toLowerCase()) return {};
    }
    return common || {};
  }

  // Lucide is loaded only if the user configured a custom Music folder icon.
  // The original white folder SVG remains visible if the library is offline.
  let folderLucideLoad=null;
  function applyFolderIcons() {
    if (typeof window === 'undefined' || !els.trackList.querySelectorAll ||
        !els.trackList.querySelector('[data-lucide]')) return;
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
      return;
    }
    if (!folderLucideLoad) folderLucideLoad=new Promise(resolve=>{
      const script=document.createElement('script');
      script.src='https://unpkg.com/lucide@1.47.0';script.async=true;
      script.onload=()=>resolve(!!window.lucide?.createIcons);
      script.onerror=()=>resolve(false);
      document.head.appendChild(script);
    });
    folderLucideLoad.then(ready=>{if (ready) window.lucide.createIcons();});
  }

  const GROUP_ICONS = {
    story: '<path d="M2 16V4a2 2 0 0 1 2-2h11"/><path d="M5 14H4a2 2 0 1 0 0 4h1"/><path d="M22 18H11a2 2 0 1 0 0 4h11V6H11a2 2 0 0 0-2 2v12"/>', // Lucide book-copy
    off: '<path d="m2 2 20 20"/><path d="M22 16.343V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-.502-.059"/><path d="M3.177 3.177A2 2 0 0 0 2 5v13a2 2 0 0 0 2 2h16"/><path d="M9.6 3.9a2 2 0 0 0-.682-.639"/>', // Lucide folder-off
    oc: '<path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/><path d="M8 15H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/>' // Lucide user-star
  };
  function renderGroupToggle() {
    if (!els.groupToggle) return;
    const label = groupMode === 'oc' ? 'OC' : groupMode === 'off' ? 'Off' : 'Story';
    const nextMode = groupMode === 'oc' ? 'Story' : groupMode === 'story' ? 'Off' : 'OC';
    els.groupToggle.title = `Group: ${label}`;
    els.groupToggle.setAttribute('aria-label', `Group: ${label}. Switch to ${nextMode}`);
    els.groupToggle.setAttribute('aria-pressed', String(groupMode === 'oc'));
    els.groupToggle.setAttribute('data-group-mode', groupMode);
    if (els.groupIcon) els.groupIcon.innerHTML = GROUP_ICONS[groupMode];
  }

  function renderPlaylist() {
    els.trackList.replaceChildren();
    const visible = tracks.map((t, i) => ({ t, i })).filter(({ t }) => matchesContentFilter(t));

    if (!visible.length) {
      const empty = document.createElement('div');
      empty.className = 'track-list-empty';
      empty.textContent = contentFilter === 'FAV_ONLY' ? 'No favorites in this view.' : 'No tracks in this filter.';
      els.trackList.appendChild(empty);
      return;
    }

    const sections = playlistSections(visible);
    const firstFolder = sections.find(section => section.folder)?.folder;
    // On a first visit, expand only the first available folder. Later, restore
    // exact user choices instead of automatically reopening collapsed folders.
    if (firstFolder && (folderOpenState === null || ![...folderOpenState.keys()].some(key => key.startsWith(`["${groupMode}",`)))) {
      if (!folderOpenState) folderOpenState = new Map();
      folderOpenState.set(firstFolder.key, true);
      saveFolderState();
    }

    sections.forEach((section, index) => {
      if (section.entry) {
        renderTrackRow(section.entry, els.trackList);
        return;
      }
      const { key, title, entries } = section.folder;
      const folderMark = groupMode === 'story' ? storyFolderMark(entries) : section.folder.mark || {};
      const validIcon = typeof folderMark.icon === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(folderMark.icon);
      const validColor = typeof folderMark.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(folderMark.color);
      // Empty icon means the existing white folder, even if a color is set.
      const markAttributes = validIcon
        ? ` data-lucide="${escapeHtml(folderMark.icon)}"${validColor ? ` style="color:${folderMark.color}"` : ''}`
        : '';
      const open = folderOpenState?.get(key) === true;
      const folder = document.createElement('section');
      folder.className = 'track-folder';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'track-folder-toggle';
      const items = document.createElement('div');
      items.className = 'track-folder-items';
      items.id = `music-folder-items-${index}`;
      items.hidden = !open;
      toggle.setAttribute('aria-controls', items.id);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = `
        <svg class="track-folder-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
        <svg class="track-folder-icon"${markAttributes} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <span class="track-folder-name">${escapeHtml(title)}</span>
        <span class="track-folder-count">${entries.length}</span>`;
      toggle.title = `${groupMode === 'oc' ? 'OC' : 'Story'}: ${title}`;
      toggle.addEventListener('click', () => {
        const next = toggle.getAttribute('aria-expanded') !== 'true';
        if (!folderOpenState) folderOpenState = new Map();
        folderOpenState.set(key, next);
        saveFolderState();
        toggle.setAttribute('aria-expanded', String(next));
        items.hidden = !next;
      });
      entries.forEach(entry => renderTrackRow(entry, items));
      folder.append(toggle, items);
      els.trackList.appendChild(folder);
    });
    applyFolderIcons();
  }

  function renderTrackRow({ t, i }, container) {
      const row = document.createElement('div');
      const type = trackType(t);
      const editingList = (typeof officialId!=='undefined' && officialId) ? 0 : trackListView;
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
        if(typeof officialId!=='undefined' && officialId){setTrack(i,{autoplay:!els.audio.paused,updateHistory:true});els.playlist.classList.remove('open');return;}
        const sourceList = Number(trackListView) || lastPlaybackList || 1;
        // A track chosen from a custom-list context belongs to that playback context.
        // Do not silently fall back to ALL merely because the row itself is not yet
        // saved in that list; the list tab is the user's explicit destination.
        lastPlaybackList = sourceList;
        lastPlaybackSource='personal';
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

      container.appendChild(row);
  }


  function escapeHtml(s) {
    return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function renderImmersiveMode() {
    els.app?.classList.toggle('immersive-mode', immersiveMode);
    if (!els.immersiveToggle) return;
    els.immersiveToggle.setAttribute('aria-pressed', String(immersiveMode));
    els.immersiveToggle.setAttribute('aria-label', immersiveMode ? 'Exit immersive mode' : 'Enter immersive mode');
    els.immersiveToggle.title = immersiveMode ? 'Exit immersive mode' : 'Immersive mode';
  }

  function setImmersiveMode(on) {
    immersiveMode = Boolean(on);

    if (immersiveMode) {
      if (swipe.active) cancelSwipe();
      els.playlist?.classList.remove('open');
      closeLyrics();
      closeListPicker();
      closePlaybackListPicker();
    }

    renderImmersiveMode();
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
      if (immersiveMode) return;
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
    // The previous MP3 deliberately remains attached while the selected
    // track's network URL is resolving; never replay that stale MP3.
    if (pendingAudioSourceSerial === assetRenderSerial) return;
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
  els.audio.addEventListener('playing', () => {
    // Chrome may drop its media notification at the natural end of the
    // previous track; reassert playback state once the new audio is audible.
    updateMediaSessionPlaybackState();
    updateMediaSessionPosition(true);
    resetNextPrefetchDelay();
  });
  els.audio.addEventListener('waiting', () => clearNextPrefetch());
  els.audio.addEventListener('progress', () => tryStartNextPrefetch());
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
    if (!els.audio.ended) clearNextPrefetch();
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
    tryStartNextPrefetch();
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
    const nextIndex = nextAutomaticIndex();
    if (nextIndex >= 0) setTrack(nextIndex, { autoplay: true, updateHistory: true, fromAutomaticEnd: true });
  });
  els.seek.addEventListener('input', () => {
    resetNextPrefetchDelay();
    const p = Number(els.seek.value);
    els.seek.style.setProperty('--p', `${p}%`);
    if (els.audio.duration) els.audio.currentTime = (p / 100) * els.audio.duration;
    updateMediaSessionPosition(true);
    persistPlayerState();
  });

  els.repeatOne?.addEventListener('click', () => {
    repeatOne = !repeatOne;
    resetNextPrefetchDelay();
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
    if (!playbackList&&!officialId) {
      // ALL remembers the last *source*, not always FAV 1–6.
      if (lastPlaybackSource==='official' && officialDef(lastOfficialId)) activateOfficial(lastOfficialId);
      else activateFavList(lastPlaybackList);
    }
    togglePlaybackListPicker();
  });

  els.currentFavorite?.addEventListener('click', e => {
    e.stopPropagation();
    toggleListPicker();
  });

  els.customListPicker?.addEventListener('click', e => e.stopPropagation());
  els.playbackListPicker?.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', e => {
    const tabs=$('.playlist-filters');
    if(tabs?.classList.contains('official-quick-open')){
      const picker=tabs.querySelector('.official-quick-picker');
      const indicator=tabs.querySelector('.official-tab-indicator');
      // Group, type filters and folder expansion only change the Tracks view.
      // They are not navigation outside the temporary Y1 official playlist picker.
      const viewControl=e.target?.closest?.('#playlist-group-toggle, .content-filter-tabs .content-filter, .track-folder-toggle');
      if(!indicator?.contains(e.target) && !picker?.contains(e.target) && !viewControl){
        picker?.remove();
        tabs.classList.remove('official-quick-open');
        indicator?.setAttribute('aria-expanded','false');
      }
    }
    if (els.customListPicker && !els.customListPicker.hidden) {
      if (!els.currentFavorite?.contains(e.target) && !els.customListPicker.contains(e.target)) closeListPicker();
    }
    if (els.playbackListPicker && !els.playbackListPicker.hidden) {
      if (!els.playbackMode?.contains(e.target) && !els.playbackListPicker.contains(e.target)) closePlaybackListPicker();
    }
  });

  document.addEventListener('keydown', e=>{
    if(e.key!=='Escape')return;
    const tabs=$('.playlist-filters');
    if(!tabs?.classList.contains('official-quick-open'))return;
    tabs.querySelector('.official-quick-picker')?.remove();
    tabs.classList.remove('official-quick-open');
    tabs.querySelector('.official-tab-indicator')?.setAttribute('aria-expanded','false');
  });

  els.playlistBtn.addEventListener('click', () => {
    closeLyrics();
    closeListPicker();
    closePlaybackListPicker();

    const willOpen = !els.playlist.classList.contains('open');
    if (willOpen) {
      // TRACK LIST always opens on the same custom list shown in the lower-left
      // playback switch. If ALL is active, remember the most recently used list.
      if(!officialId)trackListView = playbackList || lastPlaybackList || 1;
      refreshTrackListTabs();
      renderPlaylist();
    }
    els.playlist.classList.toggle('open');
  });
  els.closePlaylist.addEventListener('click', () => els.playlist.classList.remove('open'));
  els.groupToggle?.addEventListener('click', () => {
    groupMode = groupMode === 'oc' ? 'story' : groupMode === 'story' ? 'off' : 'oc';
    try { localStorage.setItem(GROUP_MODE_KEY, groupMode); } catch (_) {}
    renderGroupToggle();
    renderPlaylist();
  });
  renderGroupToggle();

  function buildListTabs() {
    const container = $('.playlist-filters');
    if (!container) return;
    // Rebuilding tabs (for example after a playlist switch) closes the floating
    // official shortcut without changing the personal FAV controls underneath.
    container.classList.remove('official-quick-open');
    container.replaceChildren();

    // Only the six custom lists belong here. The old TRACK tab was redundant and
    // caused a second, conflicting playback context.
    // Official and personal playlist sources can be switched directly in Tracks.
    // The official tab is a source switch, never an editor for official members.
    const official=officialDef() || officialDef(lastOfficialId) || officialLists[0] || null;
    const indicator=document.createElement('button');
    indicator.type='button';
    indicator.className='official-tab-indicator'+(officialId?'':' inactive');
    indicator.innerHTML=official?officialIcon(official):'Y1';
    if(official && /^#[0-9a-fA-F]{6}$/.test(official.color||''))indicator.style.color=official.color;
    indicator.title=official?.name||'Y1 Official';
    indicator.setAttribute('aria-label',`Switch to Y1 official playlist: ${official?.name||'unavailable'}`);
    indicator.setAttribute('aria-pressed',String(Boolean(officialId)));
    indicator.disabled=!official;
    indicator.setAttribute('aria-expanded','false');
    indicator.setAttribute('aria-haspopup','true');
    indicator.addEventListener('click',e=>{
      e?.stopPropagation?.();
      if (!officialId) {
        // Existing contract: from personal FAV, recall the last official list.
        const id=officialDef(lastOfficialId)?.id || officialLists[0]?.id;
        if(id)activateOfficial(id);
        return;
      }
      // In official mode, the same tab reveals a temporary horizontal picker.
      // It overlays personal FAV circles; it never replaces or mutates them.
      const openPicker=container.querySelector?.('.official-quick-picker');
      if(openPicker){
        openPicker.remove?.();
        container.classList.remove('official-quick-open');
        indicator.setAttribute('aria-expanded','false');
        return;
      }
      const picker=document.createElement('div');
      picker.className='official-quick-picker';
      picker.setAttribute('role','group');
      picker.setAttribute('aria-label','Choose Y1 official playlist');
      officialLists.forEach(def=>{
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='official-quick-pick'+(def.id===officialId?' active':'');
        btn.dataset.officialId=def.id;
        btn.innerHTML=officialIcon(def);
        btn.style.color=/^#[0-9a-fA-F]{6}$/.test(def.color||'')?def.color:'#ffffff';
        btn.title=def.name;
        btn.setAttribute('aria-label',`Play ${def.name}`);
        btn.setAttribute('aria-pressed',String(def.id===officialId));
        btn.addEventListener('click',event=>{
          event?.stopPropagation?.();
          // Switching a Y1 playlist rebuilds the Tracks tabs. Preserve this
          // temporary picker (and its scroll position) instead of closing it.
          const pickerScroll=picker.scrollTop;
          if(def.id!==officialId && !activateOfficial(def.id))return;
          const currentIndicator=container.querySelector('.official-tab-indicator');
          if(!currentIndicator)return;
          container.appendChild(picker);
          container.classList.add('official-quick-open');
          currentIndicator.setAttribute('aria-expanded','true');
          [...picker.children].forEach(item=>{
            const active=item.dataset.officialId===officialId;
            item.classList.toggle('active',active);
            item.setAttribute('aria-pressed',String(active));
          });
          picker.scrollTop=pickerScroll;
        });
        picker.appendChild(btn);
      });
      container.appendChild(picker);
      container.classList.add('official-quick-open');
      indicator.setAttribute('aria-expanded','true');
      applyOfficialIcons();
    });
    container.appendChild(indicator);
    const caption=document.createElement('span');caption.className='official-tabs-caption';caption.textContent='Y1★ | Your Editable FAV Lists';container.appendChild(caption);
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
        if(officialId){
          // Leaving official scope requires rebuilding type filters (ALL Pick
          // -> ALL, all categories restored) as well as the playback source.
          activateFavList(value);
        }else{
          setTrackListView(value, { syncPlayback: true });
        }
      });
      container.appendChild(btn);
      return btn;
    });

    els.playlistFilters = buttons;
    refreshTrackListTabs();
    applyOfficialIcons();
  }


  const toggleLyricsPanel = () => {
    if (lyricsPanelOpen()) closeLyrics();
    else openLyrics();
  };
  els.discWrap?.addEventListener('click', e => {
    if (immersiveMode) return;
    if (e.target instanceof Element && e.target.closest('#play')) return;
    togglePlay();
  });
  els.play?.addEventListener('click', e => {
    e.stopPropagation();
    if (immersiveMode) return;
    togglePlay();
  });
  els.lyricsToggle?.addEventListener('click', () => {
    if (!immersiveMode) toggleLyricsPanel();
  });
  els.closeLyrics?.addEventListener('click', closeLyrics);
  els.immersiveToggle?.addEventListener('click', e => {
    e.stopPropagation();
    setImmersiveMode(!immersiveMode);
  });

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
    if (immersiveMode) return;
    if (e.code === 'Space' && !/INPUT|BUTTON|A/.test(document.activeElement?.tagName || '')) {
      e.preventDefault(); togglePlay();
    }
  });

  window.addEventListener('pagehide', () => { clearNextPrefetch(); persistPlayerState(); });
  window.addEventListener('beforeunload', () => persistPlayerState());
  document.addEventListener('freeze', () => persistPlayerState());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') persistPlayerState();
  });

  renderImmersiveMode();
  configureMediaSession();
  renderRepeatOne();
  renderPlaybackMode();
  buildPlaybackListPicker();
  buildListPicker();
  renderCurrentFavorite();

  async function boot() {
    setStatus('Loading music…');
    try {
      const catalogUrl = await versionedAsset('w/index.html');
      const r = await fetch(catalogUrl, { cache: 'no-cache' });
      if (!r.ok) throw new Error(`Music Core HTTP ${r.status}`);
      tracks = coreCatalogTracks(await r.text());
      // The first picker render runs before the catalog is loaded. Build it again
      // now that Y1FAV definitions are available, including their click handlers.
      buildPlaybackListPicker();
      if (!tracks.length) { setStatus('No published tracks yet.'); return; }

      if(officialId&&!officialDef(officialId))officialId='';
      if(lastOfficialId&&!officialDef(lastOfficialId))lastOfficialId='';
      if(lastPlaybackSource==='official' && !officialDef(lastOfficialId))lastPlaybackSource='personal';
      // Do not restore a dead official selection that has no published tracks.
      if(officialId&&!officialIndices().length)officialId='';
      if(officialId){playbackList=0;contentFilter='ALL';lastPlaybackSource='official';}
      // Keep existing 6 favorite banks after machine-ID normalization.
      let migratedLists = false;
      for (const set of customLists.values()) {
        for (const track of tracks) {
          const oldKey = legacyTrackKey(track);
          if (oldKey && set.has(oldKey)) {
            set.add(trackKey(track));
            set.delete(oldKey);
            migratedLists = true;
          }
        }
      }
      if (migratedLists) persistCustomLists();

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
        (!requestedId || musicId(t) === requestedId || legacyMusicId(t) === requestedId) &&
        (requestedTrack === null || Number(t.Img) === requestedTrack)
      );

      const restoredKey = String(restoredPlayerState?.trackKey || '');
      const restoredIndex = restoredKey ? tracks.findIndex(t => trackKey(t) === restoredKey || legacyTrackKey(t) === restoredKey) : -1;
      let requestedIndex = hasTrackQuery ? (idx >= 0 ? idx : 0) : (restoredIndex >= 0 ? restoredIndex : 0);
      if(officialId && !officialIndices().includes(requestedIndex))requestedIndex=officialIndices()[0];
      const requestedKey = tracks[requestedIndex] ? trackKey(tracks[requestedIndex]) : '';
      const restorePosition = restoredKey && (restoredKey === requestedKey || restoredKey === legacyTrackKey(tracks[requestedIndex]))
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
      setStatus('Unable to load w/index.html');
    }
  }

  boot();
})();
