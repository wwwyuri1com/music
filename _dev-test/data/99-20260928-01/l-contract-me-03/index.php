<?php
// YURI1 Music static track page.
// Content data is stored here; shared presentation is included separately.
$site_root = dirname(__DIR__, 3);

$track = [
  'source-id' => '20260928-01-l-contract-me',
  'source-img' => 3,
  'TITLE' => 'Wife?!',
  'STORY' => 'Contract Me',
  'OC' => 'L.Night',
  'Theme' => 'l.night',
  'Type' => 'IP',
  'path-group' => '99-20260928-01',
  'path-title' => 'l-contract-me-03',
];

$asset_key = '99-20260928-01_l-contract-me-03';
$lyrics = '[Intro — Otherworldly Whisper]\n\nJoddeb... fjehsnde...\n\nKcjie...?\n\n[Pause]\n\n...Wife?\n\n\n[Verse 1]\n\nCenturies sleeping\nNothing but night\n\nThen someone calls me\nBack into light\n\nA voice I remember\nA face almost right\n\nAnd why are you standing\nSo close to me tonight?\n\nYou kneel at my throne\nYou call me "master"\n\nI move away\nYou follow faster\n\nYou reach through the mist\nI nearly disappear\n\nWhat kind of summoning\nIs happening here?\n\n\n[Pre-Chorus]\n\nContract?\nNothing.\n\nDevotion?\nNothing.\n\n"Enjoy me"?\nWhat?!\n\nThen you shouted—\n\n"Protect me,\nyou idiot, L.Night!"\n\n\n[Chorus]\n\nWife?!\n\nWait—\nWhy do you look like her?\n\nWife?!\n\nNo—\nThat cannot be the word\n\nSame fire\nSame eyes\nSame impossible nerve\n\nYou come one step closer\nI take one step first—\n\nBack.\n\nWife?!\n\nNo, no, no\nYou\'re E.Red\n\nSo why does my heart\nRemember you instead?\n\n\n[Verse 2]\n\nI watched my wife\nLeave long ago\n\nI know what I saw\nI know what I know\n\nThen you wear the ring\nLike it belongs there\n\nAnd suddenly I find\nI\'m trying not to stare\n\nYou sit too close\nI move away\n\nYou catch my sleeve\nI have nothing to say\n\n"I\'m warm."\n\n"The window\'s open."\n\n...That proves nothing.\n\nStop smiling like that.\n\n\n[Whisper]\n\nYou\'re troublesome.\n\n\n[Pre-Chorus]\n\nThe ring knows you\n\nThe spell knew you\n\nEven before\nI understood you\n\nThose ancient words\nYou learned by heart\n\nWere never really magic—\n\nThey were a call from the start\n\n\n[Chorus]\n\nWife?!\n\nWait—\nWhy do you look like her?\n\nWife?!\n\nNo—\nThat cannot be the word\n\nSame fire\nSame voice\nSame way you pull me near\n\nI survived a thousand battles\n\nBut apparently\nI should fear—\n\nYou.\n\nWife?!\n\nNo, no, no\nYou\'re E.Red\n\nSo why does my heart\nRemember you instead?\n\n\n[Bridge — Spoken / Rapid]\n\nN.White touched your thigh.\n\nI noticed.\n\nD.Golden wanted to take you home.\n\nI noticed.\n\nD.Dark was flirting with you.\n\nI noticed.\n\nAm I jealous?\n\nNo.\n\nI\'m concerned about your safety.\n\n[Pause]\n\n...Obviously.\n\n\n[Whisper]\n\nStop laughing.\n\n\n[Bridge — Otherworldly]\n\nJoddeb...\nKcjie...\nFjehsnde...\n\nWords from another world\n\nA promise from another life\n\nProtect you\n\nFind you\n\nKnow you\n\nEven if I wake\nA thousand years too late\n\n\n[Final Chorus]\n\nWife?!\n\nOh—\n\nThere it is again\n\nWife...\n\nMaybe\nI remember when\n\nSame soul\nNew name\nStill pulling me inside\n\nYou ask me for a contract\n\nLike you haven\'t had me\nAll this time\n\nWife...\n\nFine.\n\nCome closer, E.Red\n\nIf the ring chose you\n\nIf my heart knows you\n\nMaybe I don\'t need\nTo understand it yet\n\n\n[Outro — Soft]\n\n"Make the contract with me..."\n\n[Pause]\n\nAlright.\n\nI know.\n\n[Whisper]\n\n...Wife.';
$related_url = 'https://www.yuri1.com/Post.html?id=P20260928-01';

$page_title = 'Wife?! \\ YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = 'Wife?! — YURI NO1 Music · Contract Me · L.Night';
$page_canonical = 'https://music.yuri1.com/data/99-20260928-01/l-contract-me-03/';
$page_og_image = 'https://music.yuri1.com/music-img/99-20260928-01_l-contract-me-03.jpg';
$page_og_type = 'music.song';
$page_structured_data = [
  '@context' => 'https://schema.org',
  '@type' => 'MusicRecording',
  'name' => $track['TITLE'],
  'url' => $page_canonical,
  'image' => $page_og_image,
  'contentUrl' => 'https://music.yuri1.com/music-mp3/99-20260928-01_l-contract-me-03.mp3',
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
