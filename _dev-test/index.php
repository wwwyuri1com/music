<!doctype html>
<html lang="en">
<?php @include __DIR__ . '/common/head.php'; ?>
<body>
<main class="music-app">
    <div class="cover-layer" aria-hidden="true"></div>

    <header class="topbar">
      <a class="brand" href="https://www.yuri1.com" target="_blank">© YURI NO1 ♫</a>
      <button id="playlist-btn" class="icon-btn" type="button" aria-label="Open track list">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h12M4 12h12M4 17h8"/><path d="M19 15v5m0-5 2-1v5"/></svg>
      </button>
    </header>

    <section class="stage">
      <div class="hero">
        <div class="disc-wrap" aria-hidden="true">
          <div class="disc-halo"></div>
          <img id="mascot" class="mascot" alt="">
        </div>
        <div class="track-copy">
          <h1 id="track-title" class="track-title">YURI1 Music</h1>
          <p class="track-meta">
            <a id="track-meta-link" class="track-meta-link" href="#" target="_blank" rel="noopener" aria-label="Open related story">
              <strong id="track-theme">—</strong> · <span id="track-story">—</span>
              <svg class="track-meta-external" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              </svg>
            </a>
          </p>
        </div>
      </div>

      <div class="player-shell">
        <div class="timeline">
          <span id="current-time" class="time">0:00</span>
          <input id="seek" class="seek" type="range" min="0" max="100" step="0.05" value="0" aria-label="Seek">
          <span id="duration" class="time">0:00</span>
        </div>

        <div class="controls">
          <div class="controls-side">
            <div class="playback-switch" role="group" aria-label="Playback pool">
              <button id="playback-all" class="control-btn playback-switch-half playback-all-btn" type="button"
                      aria-label="Use all tracks" aria-pressed="true" title="ALL Track">
                <span class="playback-mode-all" aria-hidden="true"><span>ALL</span><span>Track</span></span>
              </button>
              <button id="playback-mode" class="control-btn playback-switch-half playback-mode-btn" type="button"
                      aria-label="Resume FAV mode" aria-pressed="false" title="FAV mode">
                <span id="playback-mode-mark" class="playback-mode-mark" aria-hidden="true"></span>
              </button>
            </div>
            <button id="lyrics-btn" class="control-btn lyrics-btn" type="button" aria-label="Open lyrics" title="Lyrics">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M6 5h12M6 9h9M6 13h12M6 17h8"/>
              </svg>
            </button>
          </div>

          <div class="controls-side">
            <button id="prev" class="control-btn" type="button" aria-label="Previous track">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2v14H6zM18.2 5.7a1 1 0 0 1 1.55.83v10.94a1 1 0 0 1-1.55.83l-7.64-5.47a1 1 0 0 1 0-1.66L18.2 5.7Z"/></svg>
            </button>
            <button id="play" class="control-btn play-btn" type="button" aria-label="Play">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.2 5.3a1 1 0 0 1 1.53-.84l9.1 6.2a1.6 1.6 0 0 1 0 2.66l-9.1 6.2A1 1 0 0 1 8.2 18.7V5.3Z"/></svg>
            </button>
            <button id="next" class="control-btn" type="button" aria-label="Next track">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 5h2v14h-2zM5.8 5.7a1 1 0 0 0-1.55.83v10.94a1 1 0 0 0 1.55.83l7.64-5.47a1 1 0 0 0 0-1.66L5.8 5.7Z"/></svg>
            </button>
          </div>

          <div class="controls-side right">
            <button id="repeat-one" class="control-btn repeat-one-btn" type="button"
                    aria-label="Single-track loop off" aria-pressed="false" title="Single-track loop: off">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M17 2l4 4-4 4"/>
                <path d="M3 11V9a3 3 0 0 1 3-3h18"/>
                <path d="M7 22l-4-4 4-4"/>
                <path d="M21 13v2a3 3 0 0 1-3 3H3"/>
                <path d="M12 9v6"/>
                <path d="M10.5 10.5 12 9"/>
              </svg>
            </button>
            <button id="current-favorite" class="control-btn current-favorite-btn" type="button"
                    aria-label="Edit custom lists for current track" aria-expanded="false" title="Custom lists">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/>
              </svg>
            </button>
            <div id="custom-list-picker" class="custom-list-picker" role="group" aria-label="Add current track to custom lists" hidden></div>
          </div>
        </div>
      </div>
    </section>

    <aside id="playlist" class="playlist" aria-label="Track list">
      <div class="playlist-head">
        <strong>Tracks</strong>
        <button id="close-playlist" class="icon-btn" type="button" aria-label="Close track list">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="playlist-filters custom-list-tabs" role="tablist" aria-label="Track and custom list view"></div>
      <div class="playlist-filters content-filter-tabs" role="group" aria-label="Track content filter"></div>
      <div id="track-list" class="track-list"></div>
    </aside>

    <aside id="lyrics-panel" class="lyrics-panel" aria-label="Lyrics" aria-hidden="true">
      <div class="lyrics-head">
        <div>
          <strong>Lyrics · Base Script</strong>
          <span id="lyrics-track-title" class="lyrics-track-title"></span>
        </div>
        <button id="close-lyrics" class="icon-btn" type="button" aria-label="Close lyrics">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div id="lyrics-content" class="lyrics-content" tabindex="0">Lyrics unavailable.</div>
    </aside>

    <div id="status" class="status" hidden></div>
    <audio id="audio" preload="metadata"></audio>
  </main>
<?php @include __DIR__ . '/common/footer.php'; ?>
</body>
</html>
