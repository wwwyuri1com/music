<?php
// Shared static track renderer.
// The track/lyrics content lives in each data/.../index.php.
// Edit this file to change the shared presentation without rewriting every page.
$e = static fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
?>
<main class="music-static-page" data-asset-key="<?= $e($asset_key) ?>">
  <article>
    <header>
      <p>YURI NO1 Music</p>
      <h1><?= $e($track['TITLE']) ?></h1>
      <p><strong><?= $e($track['OC']) ?></strong> · <?= $e($track['STORY']) ?></p>
    </header>

    <figure>
      <img src="/music-img/<?= $e($asset_key) ?>.jpg" alt="<?= $e($track['TITLE']) ?> cover">
    </figure>

    <audio controls preload="metadata" src="/music-mp3/<?= $e($asset_key) ?>.mp3">
      <a href="/music-mp3/<?= $e($asset_key) ?>.mp3">Open MP3</a>
    </audio>

    <section>
      <h2>Lyrics</h2>
      <pre><?= $e($lyrics) ?></pre>
      <p><a href="/music-text/<?= $e($asset_key) ?>.txt">Open lyrics TXT</a></p>
    </section>

    <?php if ($related_url): ?>
      <p><a href="<?= $e($related_url) ?>">Related story</a></p>
    <?php endif; ?>
  </article>
</main>
