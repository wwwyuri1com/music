<?php
// YURI1 Music static track page.
// Content data is stored here; shared presentation is included separately.
$site_root = dirname(__DIR__, 3);

$track = [
  'source-id' => '20260929-02-s-five-bottles',
  'source-img' => 1,
  'TITLE' => 'Five Reasons',
  'STORY' => 'Five bottles',
  'OC' => 'Krina',
  'Theme' => 'shorts',
  'Type' => 'Shorts',
  'path-group' => '99-20260929-02',
  'path-title' => 's-five-bottles-01',
];

$asset_key = '99-20260929-02_s-five-bottles-01';
$lyrics = '[Verse 1]\nFive bottles on the counter\nPhone turned face-down by the sink\nYou said we\'re finally over\nSo why do I still have to think?\n\nRed hair in the bathroom mirror\nMascara holding on somehow\nI look like someone with an answer\nDon\'t ask me for one right now\n\n[Pre-Chorus]\nDon\'t call\nDon\'t knock\nDon\'t say you changed your mind\nWe both know how this story goes\nWe\'ve done it every time\n\n[Chorus]\nFive bottles\nFive reasons not to call you\nFive chances to forget\nFive little glass excuses\nFor everything I haven\'t left\n\nFive bottles\nLine them up beside me\nLike soldiers I don\'t trust\nI swear tonight I\'ll end it\nThen I drink another one because—\n\nIf I don\'t drink\nIt\'s worse for my health\nAnd probably worse for everyone else\n\n[Verse 2]\nTomorrow I\'ll look professional\nClean shirt, perfect reply\nNo one at work will ever notice\nI spent the whole damn night asking why\n\nYou always liked me furious\nYou said I looked alive that way\nFunny how you called it passion\nWhen neither one of us could stay\n\n[Pre-Chorus]\nDon\'t smile\nDon\'t tease\nDon\'t tell me that you knew\nI\'d throw the door wide open\nThe second I saw you\n\n[Chorus]\nFive bottles\nFive reasons not to call you\nFive chances to forget\nFive little glass excuses\nFor everything I haven\'t left\n\nFive bottles\nLine them up beside me\nLike soldiers I don\'t trust\nI swear tonight I\'ll end it\nThen I drink another one because—\n\nIf I don\'t drink\nIt\'s worse for my health\nAnd probably worse for everyone else\n\n[Bridge]\nBottle one says, "Block her"\nBottle two says, "Sleep"\nBottle three remembers\nEverything I meant to keep\n\nBottle four gets angry\nBottle five just laughs\nAnd somewhere after midnight\nI stop wanting you back\n\nMaybe\n\n[Final Chorus]\nFive bottles\nBut tonight I leave one standing\nFour is more than enough\nMaybe that\'s not called recovering\nBut it\'s something close to us\n\nFive bottles\nUsed to wait here every evening\nLike a ritual I knew\nNow there\'s one still on the counter\n\nAnd for once\nI\'m not saving it for you\n\n[Outro]\nPhone down\nLights out\nOne bottle left unopened\n\nThat\'s enough\nFor now';
$related_url = 'https://www.yuri1.com/Post.html?id=P20260929-02';

$page_title = 'Five Reasons \\ YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = 'Five Reasons — YURI NO1 Music · Five bottles · Krina';
$page_canonical = 'https://music.yuri1.com/data/99-20260929-02/s-five-bottles-01/';
$page_og_image = 'https://music.yuri1.com/music-img/99-20260929-02_s-five-bottles-01.jpg';
$page_og_type = 'music.song';
$page_structured_data = [
  '@context' => 'https://schema.org',
  '@type' => 'MusicRecording',
  'name' => $track['TITLE'],
  'url' => $page_canonical,
  'image' => $page_og_image,
  'contentUrl' => 'https://music.yuri1.com/music-mp3/99-20260929-02_s-five-bottles-01.mp3',
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
