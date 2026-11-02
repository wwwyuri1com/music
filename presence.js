/* Presence Mode — Music feature, not a second player or a separate site. */
(() => {
  'use strict';

  const app = document.querySelector('.music-app');
  const button = document.getElementById('presence-btn');
  const menu = document.getElementById('presence-menu');
  const power = document.getElementById('presence-power-toggle');
  const powerLabel = document.getElementById('presence-power-label');
  const close = document.getElementById('close-presence');
  const trackButton = document.getElementById('playlist-btn');
  const trackPanel = document.getElementById('playlist');
  const lyricsPanel = document.getElementById('lyrics-panel');
  const closeLyrics = document.getElementById('close-lyrics');
  const list = document.getElementById('presence-friend-list');
  const welcome = document.getElementById('presence-welcome');
  const videos = [document.getElementById('presence-video-a'), document.getElementById('presence-video-b')];

  if (!app || !button || !menu || !power || !powerLabel || !close || !trackButton || !trackPanel) {
    throw new Error('Presence Mode requires the Music popup controls');
  }

  const ENABLED_KEY = 'yuri1-presence-enabled-v1';
  const FRIEND_KEY = 'yuri1-presence-friend-v1';
  const stored = key => {try {return window.localStorage.getItem(key)} catch (_) {return null}};
  const remember = (key, value) => {try {window.localStorage.setItem(key,value)} catch (_) {}};
  // Studio has two preview routes for each phase. Both sandbox and the later
  // standby/real stages must read the same private, status-filtered Friend feed.
  const isStudioPreview = typeof location !== 'undefined' && (
    /^\/sandbox-music(?:\/|$)/.test(location.pathname) ||
    /^\/(?:source-preview|preview)\/(?:sandbox|standby|real)\/music(?:\/|$)/.test(location.pathname)
  );
  let presenceEnabled = stored(ENABLED_KEY) === '1';
  let hasOpened = false;
  let friends = [], friendId = stored(FRIEND_KEY) || '', folderOpen = true;
  let loaded = false, loading = null, warnings = [], player = null, generation = 0;

  const currentFriend = () => friends.find(friend => friend.asset_no === friendId) || null;
  function updateWelcome() {
    if (!welcome) return;
    const message = presenceEnabled ? currentFriend()?.welcome_text || '' : '';
    welcome.textContent = message;
    welcome.hidden = !message;
  }

  function stopFilm() {
    generation++;
    if (player) {
      player.abort.abort();
      player.blobs.forEach(url => URL.revokeObjectURL(url));
      player = null;
    }
    videos.forEach(video => {
      if (!video) return;
      video.onended = null;video.ontimeupdate = null;
      video.pause();video.classList.remove('is-active');
      video.removeAttribute('src');video.load();
    });
  }

  function videoReady(video, signal) {
    return new Promise((resolve,reject) => {
      if (signal.aborted) {reject(Error('Cancelled'));return}
      let timer;
      const cleanup=()=>{clearTimeout(timer);video.removeEventListener('loadeddata',ready);video.removeEventListener('error',fail);signal.removeEventListener('abort',cancel)};
      const ready=()=>{if (video.readyState>=2){cleanup();resolve()}};
      const fail=()=>{cleanup();reject(Error('Friend MP4 解碼失敗'))};
      const cancel=()=>{cleanup();reject(Error('Cancelled'))};
      timer=setTimeout(()=>{cleanup();reject(Error('Friend MP4 載入逾時'))},45000);
      video.addEventListener('loadeddata',ready);video.addEventListener('error',fail);
      signal.addEventListener('abort',cancel,{once:true});ready();
    });
  }

  function report(message) {
    const note=list?.querySelector('.presence-feed-message');
    if (note) note.textContent=message;
  }

  function chooseNext(p, previous) {
    if (previous.type==='move'||!p.ready) return {type:'idle',url:p.friend.idle};
    p.round++;
    const dice=Math.floor(Math.random()*100)+1;
    const result=PresenceRoll.select(p.friend.moves,dice,p.round,p.eligible);
    return result.picked?{type:'move',url:p.cached.get(result.picked.asset_no)}:{type:'idle',url:p.friend.idle};
  }

  function prepareNext(p,clip) {
    const next=chooseNext(p,clip),index=1-p.active,video=videos[index];
    video.pause();video.classList.remove('is-active');video.src=next.url;video.load();
    const data={clip:next,index,ready:false};p.next=data;
    data.promise=videoReady(video,p.abort.signal).then(()=>{if(player===p)data.ready=true});
    data.promise.catch(error=>{if(player===p&&!p.abort.signal.aborted)report(error.message)});
  }

  async function advance(p) {
    if (player!==p||p.changing||!p.next) return;
    p.changing=true;
    const next=p.next;
    try {
      await next.promise;
      if (player!==p) return;
      const outgoing=videos[p.active],incoming=videos[next.index];
      incoming.currentTime=0;
      await incoming.play();
      if (player!==p) return;
      // Outgoing video retains its last visible frame until incoming plays.
      incoming.classList.add('is-active');outgoing.classList.remove('is-active');
      outgoing.onended=null;outgoing.ontimeupdate=null;outgoing.pause();
      p.active=next.index;p.changing=false;wireClip(p,incoming,next.clip);
    } catch (error) {
      if (player!==p||p.abort.signal.aborted)return;
      p.changing=false;report('影片銜接失敗：'+error.message);
      setTimeout(()=>{if(player===p)startFilm(p.friend)},1000);
    }
  }

  function wireClip(p,video,clip) {
    if(player!==p)return;
    prepareNext(p,clip);
    // Prefer an early, prepared handoff; `ended` is the fallback for browsers
    // that issue timeupdate less frequently near the last frame.
    video.ontimeupdate=()=>{
      if(player===p&&Number.isFinite(video.duration)&&video.duration-video.currentTime<=.10&&p.next?.ready)advance(p);
    };
    video.onended=()=>advance(p);
  }

  async function preloadMoves(p) {
    let index=0;
    async function worker(){
      while(index<p.friend.moves.length){
        const move=p.friend.moves[index++];
        const response=await fetch(move.url,{signal:p.abort.signal,cache:'force-cache'});
        if(!response.ok)throw Error('MP4 HTTP '+response.status);
        const blob=await response.blob();
        if(p.abort.signal.aborted)return;
        const url=URL.createObjectURL(blob);p.blobs.push(url);p.cached.set(move.asset_no,url);
      }
    }
    try{
      await Promise.all(Array.from({length:Math.min(2,p.friend.moves.length)},worker));
      if(player===p){p.ready=true;report('動作影片已預載完成。')}
    }catch(error){if(player===p&&!p.abort.signal.aborted)report('動作預載失敗：'+error.message+'；維持待機。')}
  }

  async function startFilm(friend) {
    stopFilm();
    if(!presenceEnabled||!friend||!videos.every(Boolean))return;
    const token=generation;
    const p={friend,active:0,round:0,eligible:{},ready:friend.moves.length===0,
      cached:new Map(),blobs:[],abort:new AbortController(),next:null,changing:false};
    player=p;
    const video=videos[0];video.muted=true;video.playsInline=true;
    video.src=friend.idle;video.load();
    try{
      await videoReady(video,p.abort.signal);
      if(player!==p||token!==generation)return;
      await video.play();
      if(player!==p||token!==generation)return;
      video.classList.add('is-active');
      wireClip(p,video,{type:'idle',url:friend.idle});
      if(friend.moves.length)preloadMoves(p);
    }catch(error){if(player===p&&!p.abort.signal.aborted)report('待機 MP4 無法播放：'+error.message)}
  }

  function selectFriend(no){
    if(!friends.some(friend=>friend.asset_no===no))return;
    friendId=no;remember(FRIEND_KEY,no);
    renderFriends();updateWelcome();
    if(presenceEnabled)startFilm(currentFriend());
    closeMenu();
  }

  function icon(source){const node=document.createElement('span');node.innerHTML=source;return node.firstElementChild}
  const CHEVRON='<svg class="track-folder-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
  const FOLDER='<svg class="track-folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z"/><path d="M21 12.17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="m6 21 5-5"/><circle cx="9" cy="9" r="2"/></svg>';
  const PLAY='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>';

  function renderFriends(){
    if(!list)return;
    list.replaceChildren();
    if(!friends.length){
      const note=document.createElement('p');note.className='presence-no-friends';
      note.textContent=!loaded?'正在讀取 Friend…':warnings.length?
        '無法顯示 Friend，請查看下方提示。':'沒有符合發布資格的 Friend。';
      list.appendChild(note);
    }else{
      const folder=document.createElement('section');folder.className='track-folder';
      const toggle=document.createElement('button');toggle.className='track-folder-toggle';toggle.type='button';
      toggle.setAttribute('aria-expanded',String(folderOpen));toggle.setAttribute('aria-controls','presence-friend-items');
      toggle.title='Select a Friend';toggle.append(icon(CHEVRON),icon(FOLDER));
      const title=document.createElement('span');title.className='track-folder-name';title.textContent='Select a Friend';
      const count=document.createElement('span');count.className='track-folder-count';count.textContent=String(friends.length);
      toggle.append(title,count);
      const items=document.createElement('div');items.id='presence-friend-items';items.className='track-folder-items';items.hidden=!folderOpen;
      toggle.addEventListener('click',()=>{folderOpen=!folderOpen;items.hidden=!folderOpen;toggle.setAttribute('aria-expanded',String(folderOpen))});
      for(const friend of friends){
        const row=document.createElement('div');row.className='track-item presence-friend';
        row.tabIndex=0;row.setAttribute('role','button');row.setAttribute('aria-pressed',String(friend.asset_no===friendId));
        row.setAttribute('aria-label','Select Friend '+friend.name);
        if(friend.asset_no===friendId)row.classList.add('active');
        const image=document.createElement('img');image.src=friend.image;image.alt='';image.loading='lazy';
        const copy=document.createElement('span');copy.className='track-copy-row';
        const name=document.createElement('b');name.textContent=friend.name;
        const description=document.createElement('span');description.textContent=friend.welcome_text||'';
        copy.append(name,description);
        const mark=document.createElement('span');mark.className='presence-select-mark';mark.append(icon(PLAY));
        row.append(image,copy,mark);
        row.addEventListener('click',()=>selectFriend(friend.asset_no));
        row.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFriend(friend.asset_no)}});
        items.appendChild(row);
      }
      folder.append(toggle,items);list.appendChild(folder);
    }
    const status=document.createElement('p');status.className='presence-feed-message';status.setAttribute('role','status');
    status.textContent=warnings.join(' · ');list.appendChild(status);
  }

  async function loadFriends(){
    if(loaded)return;
    if(loading)return loading;
    if(!isStudioPreview||typeof fetch!=='function'){
      warnings=['Friend 僅能在 Y1 Studio 本機 Music 預覽讀取；請確認目前預覽網址。'];
      loaded=true;renderFriends();return;
    }
    loading=(async()=>{
      try{
        const response=await fetch('/sandbox-music/w/presence-friends.txt',{cache:'no-store'});
        if(!response.ok)throw Error('Sandbox Friend HTTP '+response.status);
        const data=await response.json();
        friends=Array.isArray(data.friends)?data.friends:[];
        warnings=Array.isArray(data.warnings)?data.warnings:[];
        if(!friends.some(friend=>friend.asset_no===friendId)){
          friendId=friends[0]?.asset_no||'';
          if(friendId)remember(FRIEND_KEY,friendId);
        }
        loaded=true;renderFriends();updateWelcome();
        if(presenceEnabled)startFilm(currentFriend());
      }catch(error){warnings=[error.message];loaded=true;renderFriends()}
      finally{loading=null}
    })();
    return loading;
  }

  function setPresenceEnabled(enabled, persist=true) {
    const wasEnabled=presenceEnabled;
    presenceEnabled = Boolean(enabled);
    app.classList.toggle('presence-mode', presenceEnabled);
    const label = presenceEnabled ? 'ON' : 'OFF';
    powerLabel.textContent = label;
    power.dataset.enabled = String(presenceEnabled);
    power.setAttribute('aria-pressed', String(presenceEnabled));
    power.setAttribute('aria-label', `Presence Mode ${label}. Switch to ${presenceEnabled ? 'OFF' : 'ON'}`);
    power.title = `Presence Mode ${label}`;
    if(persist)remember(ENABLED_KEY,presenceEnabled?'1':'0');
    updateWelcome();
    if(!presenceEnabled)stopFilm();
    else if(!wasEnabled){if(loaded)startFilm(currentFriend());else loadFriends()}
  }

  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (menu.classList.contains('open')) {
      closeMenu();
      return;
    }

    if (!hasOpened) {
      if(!presenceEnabled)setPresenceEnabled(true);
      hasOpened = true;
    }
    // Pmenu and Tracks are alternatives, never stacked on top of each other.
    trackPanel.classList.remove('open');
    if (lyricsPanel?.classList.contains('open')) closeLyrics?.click();
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
    loadFriends();
  }

  button.addEventListener('click', toggleMenu);
  power.addEventListener('click', () => setPresenceEnabled(!presenceEnabled));
  close.addEventListener('click', closeMenu);

  // The existing Music click listener still performs the full Tracks operation.
  trackButton.addEventListener('click', closeMenu, true);

  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('.presence-menu, .topbar, .playlist, .lyrics-panel, .player-shell, .disc-wrap, .immersive-toggle')) return;
    if (target.closest('.music-app') || target === document.body || target === document.documentElement) {
      closeMenu();
      if(presenceEnabled)document.dispatchEvent(new Event('yuri1:presence-toggle-play'));
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });

  // The existing immersive toggle owns its state; only dismiss our panel.
  const observer = new MutationObserver(() => {
    if (app.classList.contains('immersive-mode')) closeMenu();
  });
  observer.observe(app, { attributes: true, attributeFilter: ['class'] });

  setPresenceEnabled(presenceEnabled,false);
  renderFriends();
  if(presenceEnabled)loadFriends();
})();
