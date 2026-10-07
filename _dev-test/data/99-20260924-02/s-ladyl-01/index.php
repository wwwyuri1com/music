<?php
// YURI1 Music static track page.
// Content data is stored here; shared presentation is included separately.
$site_root = dirname(__DIR__, 3);

$track = [
  'source-id' => '20260924-02-s-ladyl',
  'source-img' => 1,
  'TITLE' => 'Wind and Sea',
  'STORY' => 'Lady L',
  'OC' => 'Lesna',
  'Theme' => 'shorts',
  'Type' => 'Shorts',
  'path-group' => '99-20260924-02',
  'path-title' => 's-ladyl-01',
];

$asset_key = '99-20260924-02_s-ladyl-01';
$lyrics = '[Verse 1]\nI wrote about the moon again,\nthe silver edge of rain,\nthe way the evening folds itself\naround a windowpane.\n\nI wrote the sea into a line,\nthen crossed it out twice.\nToo obvious, perhaps.\nToo much like something\na publisher would like.\n\n[Pre-Chorus]\nYou read it anyway.\nYou said, “That’s very you.”\nI wanted to defend myself,\nbut I was smiling too.\n\n[Chorus]\nSo let the wind be only wind,\nlet the sea stay far away.\nI don’t need a perfect metaphor\nfor what I mean to say.\n\nYou took my hand.\nI lost my words.\nThe moon can wait outside.\n\nTonight,\nyou stayed.\n\nAnd that was poetry enough.\n\n[Verse 2]\nI told you not to trust strangers,\nnot to wander home too late,\nnot to send your photographs\nto people you just met.\n\nYou called me “Teacher” with that smile.\nI said I’d get upset.\nThen checked the time,\nthe street,\nthe weather—\nand whether you had eaten yet.\n\n[Pre-Chorus]\nYou laughed,\n“You worry far too much.”\n\nI know.\nI always do.\n\nBut every little warning\nis another way of saying\nI care about you.\n\n[Chorus]\nSo let the rain be only rain,\nlet the stars behave tonight.\nI don’t need another paragraph\nto make the feeling right.\n\nYou leaned on me.\nI held my breath.\nFor once, I didn’t hide.\n\nTonight,\nyou stayed.\n\nAnd that was poetry enough.\n\n[Bridge]\nMaybe love is not a poem.\nMaybe love is booking two seats,\nwalking on the safer side,\nwaiting until you get home,\npretending not to notice\nwhen your fingers find mine.\n\nMaybe I have made this\nfar too complicated.\n\n...Please don’t laugh.\n\n[Final Chorus]\nLet the wind go where it wants.\nLet the sea forget my name.\nI have spent so many nights\nmaking loneliness sound beautiful.\n\nBut you are here.\nThat changes things.\nNo metaphor survives.\n\nTonight,\nyou stayed.\n\nNo moon.\nNo sea.\nNo clever line.\n\nJust you.\n\nAnd, embarrassingly,\nI think I like that best.';
$related_url = 'https://www.yuri1.com/Post.html?id=P20260924-02';

$page_title = 'Wind and Sea \\ YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = 'Wind and Sea — YURI NO1 Music · Lady L · Lesna';
$page_canonical = 'https://music.yuri1.com/data/99-20260924-02/s-ladyl-01/';
$page_og_image = 'https://music.yuri1.com/music-img/99-20260924-02_s-ladyl-01.jpg';
$page_og_type = 'music.song';
$page_structured_data = [
  '@context' => 'https://schema.org',
  '@type' => 'MusicRecording',
  'name' => $track['TITLE'],
  'url' => $page_canonical,
  'image' => $page_og_image,
  'contentUrl' => 'https://music.yuri1.com/music-mp3/99-20260924-02_s-ladyl-01.mp3',
  'description' => $page_description,
  'byArtist' => [
    '@type' => 'Organization',
    'name' => 'YURI NO1',
    'url' => 'https://www.yuri1.com/'
  ]
];
if ($related_url !== '') {
  $page_structured_data['isBasedOn'] = [
    '@type' => 'CreativeWork',
    'name' => $track['STORY'],
    'url' => $related_url
  ];
}
?>
<!doctype html>
<html lang="en">
<?php
$shared_head = $site_root . '/common/head.php';
if (is_file($shared_head)) {
  @include $shared_head;
} else {
  echo '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
  echo '<title>' . htmlspecialchars($page_title, ENT_QUOTES, 'UTF-8') . '</title>';
  echo '<meta name="description" content="' . htmlspecialchars($page_description, ENT_QUOTES, 'UTF-8') . '">';
  echo '<link rel="canonical" href="' . htmlspecialchars($page_canonical, ENT_QUOTES, 'UTF-8') . '">';
  echo '</head>';
}
?>
<body>
<?php
$shared_track = $site_root . '/common/static-track.php';
if (is_file($shared_track)) {
  @include $shared_track;
} else {
  echo '<main><article>';
  echo '<h1>' . htmlspecialchars($track['TITLE'], ENT_QUOTES, 'UTF-8') . '</h1>';
  echo '<p><strong>' . htmlspecialchars($track['OC'], ENT_QUOTES, 'UTF-8') . '</strong> · ' . htmlspecialchars($track['STORY'], ENT_QUOTES, 'UTF-8') . '</p>';
  echo '<p><a href="/music-mp3/' . rawurlencode($asset_key) . '.mp3">MP3</a></p>';
  echo '<h2>Lyrics</h2><pre>' . htmlspecialchars($lyrics, ENT_QUOTES, 'UTF-8') . '</pre>';
  echo '</article></main>';
}
?>
</body>
</html>
