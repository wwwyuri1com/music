<?php
// YURI1 Music static track page.
// Content data is stored here; shared presentation is included separately.
$site_root = dirname(__DIR__, 3);

$track = [
  'source-id' => '20260928-02-o-cat-fighting',
  'source-img' => 2,
  'TITLE' => 'SHE OWNS',
  'STORY' => 'Cat Fighting',
  'OC' => 'D.Dark',
  'Theme' => 'd.dark',
  'Type' => 'IP',
  'path-group' => '99-20260928-02',
  'path-title' => 'o-cat-fighting-02',
];

$asset_key = '99-20260928-02_o-cat-fighting-02';
$lyrics = '[Intro]\n\nDoor open.\n\nEveryone quiet.\n\n...\n\nHmph.\n\nWhy did you stop talking?\n\n[Verse 1]\n\nBlack shirt\nBlack coffee\nBlack car downstairs\n\nHalf the studio\nPretending not to stare\n\nSomeone broke something\nSomeone wants a room\nSomeone started arguing\nBefore noon\n\nI raise one eyebrow\n\nSilence.\n\nInteresting.\n\nI didn\'t even say anything.\n\n[Pre-Chorus]\n\nThey call me the owner\nLike that explains the air\n\nLike every little problem\nShould somehow end right here\n\nFine.\n\nPut it on my desk.\n\nNo—\n\nNot that pile.\n\nThe other one.\n\n[Chorus]\n\nThe owner is in\nSo everybody behave\n\nOr don\'t\n\nI don\'t particularly care today\n\nThe owner is in\nOne look across the room\n\nEverybody suddenly remembers\nWhat they\'re supposed to do\n\nHmph.\n\nRelax.\n\nIf it breaks\nI\'ll buy another one\n\n[Verse 2]\n\nNo empty rooms?\n\nBuy the building next door.\n\nNot enough space?\n\nKnock through the wall.\n\nSomeone at the table\nNearly drops her pen\n\nSomeone quietly asks\n\n"...Can she really do that?"\n\nYes.\n\nApparently.\n\nN.White looks at me\nWith that familiar face\n\nThe one that says\nI\'ve skipped three sensible steps again\n\nI smile.\n\nSlightly.\n\nShe sighs.\n\nThere it is.\n\n[Pre-Chorus]\n\nThey think I\'m difficult\nDistant\nHard to move\n\nThat part is mostly true\n\nBut N.White says my name once\n\n"D.Dark."\n\n...\n\nFine.\n\nI\'ll sit properly.\n\n[Chorus]\n\nThe owner is in\nSo everybody behave\n\nOr don\'t\n\nI don\'t particularly care today\n\nThe owner is in\nOne look across the room\n\nEverybody suddenly remembers\nWhat they\'re supposed to do\n\nHmph.\n\nRelax.\n\nIf it breaks\nI\'ll buy another one\n\n[Post-Chorus]\n\nProblem?\n\nReplace it.\n\nToo small?\n\nExpand it.\n\nToo loud?\n\nClose the door.\n\nToo expensive?\n\n...\n\nHow expensive?\n\n[Verse 3]\n\nA script needs someone powerful\n\nThey look at me.\n\nA leader\nA ruler\nA woman nobody can control\n\nThey look at me again.\n\nI already know.\n\n"Fine."\n\nN.White stands beside me\nCalm as ever\n\nOf course she\'s coming too\n\nSomebody whispers\nThat the boss never refuses\nWhen she\'s involved\n\nI hear it.\n\nI choose not to hear it.\n\n[Bridge]\n\nEveryone thinks\nThe final word is mine\n\nTechnically—\n\nYes.\n\nPractically—\n\nN.White folds her arms.\n\n...\n\nLet\'s not discuss this.\n\n[Breakdown]\n\nRaised eyebrow\nSmall smile\nOne quiet "Hmph"\n\nThat\'s enough\nTo scare half the room\n\nThen I miss the candy\nThrow it at my mouth\nPick it off my shirt\n\nAnd eat it anyway\n\nN.White:\n\n"...D.Dark."\n\nWhat?\n\nFive-second rule.\n\nMaybe ten.\n\n[Final Chorus]\n\nThe owner is in\nNo need to make a scene\n\nI\'ve seen stranger things\nInside this studio this week\n\nThe owner is in\nLet everyone create\n\nIf they have something worth doing\nI\'ll give them space\n\nHmph.\n\nGo ahead.\n\nMake something ridiculous.\n\nJust make it good.\n\n[Outro]\n\nLights off?\n\nDoors locked?\n\nEveryone gone?\n\n...\n\nN.White?\n\n"...What?"\n\nAre we going home?\n\n...\n\nWhy are you looking at me like that?\n\nHmph.';
$related_url = 'https://www.yuri1.com/Post.html?id=P20260928-02';

$page_title = 'SHE OWNS \\ YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = 'SHE OWNS — YURI NO1 Music · Cat Fighting · D.Dark';
$page_canonical = 'https://music.yuri1.com/data/99-20260928-02/o-cat-fighting-02/';
$page_og_image = 'https://music.yuri1.com/music-img/99-20260928-02_o-cat-fighting-02.jpg';
$page_og_type = 'music.song';
$page_structured_data = [
  '@context' => 'https://schema.org',
  '@type' => 'MusicRecording',
  'name' => $track['TITLE'],
  'url' => $page_canonical,
  'image' => $page_og_image,
  'contentUrl' => 'https://music.yuri1.com/music-mp3/99-20260928-02_o-cat-fighting-02.mp3',
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
