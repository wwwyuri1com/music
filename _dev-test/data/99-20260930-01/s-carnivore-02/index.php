<?php
// YURI1 Music static track page.
// Content data is stored here; shared presentation is included separately.
$site_root = dirname(__DIR__, 3);

$track = [
  'source-id' => '20260930-01-s-carnivore',
  'source-img' => 2,
  'TITLE' => 'Rotlinde',
  'STORY' => 'Carnivore',
  'OC' => 'Rotlinde',
  'Theme' => 'shorts',
  'Type' => 'Shorts',
  'path-group' => '99-20260930-01',
  'path-title' => 's-carnivore-02',
];

$asset_key = '99-20260930-01_s-carnivore-02';
$lyrics = '[Verse 1]\nSunglasses after midnight\nTop down, nowhere to be\nYour name is still in my phone\nBut that\'s not bothering me\n\nRed lights across the windshield\nAnother room, another key\nI said I wanted something honest\nFunny what honesty brings\n\n[Pre-Chorus]\nI could stay home\nI could behave\nI could spend all night\nThinking of mistakes\n\nBut the city\'s awake\nAnd so am I\nSo tell me, darling\nWhy should I be nice?\n\n[Chorus]\nGet in, we\'re wasting moonlight\nNo plans, no promises tonight\nIf love wants to make a fool of me\nIt better learn to do it right\n\nCome close, don\'t overthink it\nThe sofa\'s only there for show\nIf tomorrow asks what happened\nWe can tell it we don\'t know\n\n[Verse 2]\nYou say I look expensive\nI say, "Don\'t make it strange"\nI\'ve paid for worse decisions\nAt least this one\'s got a name\n\nSoft drinks on the table\nYour jacket on my chair\nYou keep looking at the doorway\nLike you still expect me to care\n\n[Pre-Chorus]\nI could slow down\nI could be wise\nBut wisdom never looked this good\nUnder hotel lights\n\nYou laugh once\nI change my mind\nMaybe bad decisions\nJust need better timing\n\n[Chorus]\nGet in, we\'re wasting moonlight\nNo plans, no promises tonight\nIf love wants to make a fool of me\nIt better learn to do it right\n\nCome close, don\'t overthink it\nThe sofa\'s only there for show\nIf tomorrow asks what happened\nWe can tell it we don\'t know\n\n[Bridge]\nTake the picture\nMake it clear\nNo hidden hands\nNo disappearing here\n\nSmile for the camera\nCome closer to me\nIf someone\'s going to lie tonight\nIt won\'t be you and me\n\n[Final Chorus]\nGet in, we\'re wasting moonlight\nNo plans, no promises tonight\nIf love wants to make a fool of me\nIt better learn to do it right\n\nCome close, don\'t overthink it\nLet the whole damn city glow\nIf tomorrow asks what happened\nMaybe this time we will know\n\n[Outro]\nTop down\nMorning slow\nOne more picture\nThen we go';
$related_url = 'https://www.yuri1.com/Post.html?id=P20260930-01';

$page_title = 'Rotlinde \\ YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = 'Rotlinde — YURI NO1 Music · Carnivore · Rotlinde';
$page_canonical = 'https://music.yuri1.com/data/99-20260930-01/s-carnivore-02/';
$page_og_image = 'https://music.yuri1.com/music-img/99-20260930-01_s-carnivore-02.jpg';
$page_og_type = 'music.song';
$page_structured_data = [
  '@context' => 'https://schema.org',
  '@type' => 'MusicRecording',
  'name' => $track['TITLE'],
  'url' => $page_canonical,
  'image' => $page_og_image,
  'contentUrl' => 'https://music.yuri1.com/music-mp3/99-20260930-01_s-carnivore-02.mp3',
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
