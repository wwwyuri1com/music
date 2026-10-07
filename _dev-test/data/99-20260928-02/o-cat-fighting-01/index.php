<?php
// YURI1 Music static track page.
// Content data is stored here; shared presentation is included separately.
$site_root = dirname(__DIR__, 3);

$track = [
  'source-id' => '20260928-02-o-cat-fighting',
  'source-img' => 1,
  'TITLE' => 'Dangerous Silver',
  'STORY' => 'Cat Fighting',
  'OC' => 'C.Curo',
  'Theme' => 'c.curo',
  'Type' => 'IP',
  'path-group' => '99-20260928-02',
  'path-title' => 'o-cat-fighting-01',
];

$asset_key = '99-20260928-02_o-cat-fighting-01';
$lyrics = '[Verse 1]\nDoor swings open\nMeeting running late\nSilver in the sunlight\nBlack shirt buttoned straight\n\nEverybody turns\nI take the empty chair\nNo introduction needed\nI’m already there\n\nSomeone dressed in purple\nLooks me up and down\nLike my face alone\nJust challenged her crown\n\nI say nothing\nThat makes it worse\nOne quiet little smile\nAnd she’s ready to burst\n\n[Pre-Chorus]\nI didn’t start this\nI barely spoke\nBut every little silence\nFeels like a private joke\n\nYou want a reaction?\nCome a little nearer\nThe harder you stare\nThe calmer I appear\n\n[Chorus]\nDangerous silver\nCold in the light\nNever raise my voice\nNever need to fight\n\nOne look\nOne smile\nOne quiet “Hm?”\nAnd suddenly\nYou’re angry again\n\nDangerous silver\nNothing to prove\nYou’re already watching\nEvery time I move\n\nI never chased trouble\nBut trouble seems thrilled\nTo walk straight toward me\nDressed in purple\n\n[Verse 2]\nSomeone says I’m cute\nYou nearly leave your seat\nSomeone says your girlfriend\nYou’re suddenly on your feet\n\nPossessive little warning\nDelivered loud and clear\nFunny—\nI don’t remember asking\nWho belongs to whom in here\n\nThen you cross the room\nReady for attack\nStop directly in front of me\nAnd tilt your head back\n\nJust a little taller\nNothing dramatic\nBut judging by your face\nApparently catastrophic\n\n[Pre-Chorus]\n“Don’t look down at me.”\n\nI wasn’t.\n\n“Hm?”\n\nThere—\nNow you’re furious again\n\n[Chorus]\nDangerous silver\nCold in the light\nNever raise my voice\nNever need to fight\n\nOne look\nOne smile\nOne quiet “Hm?”\nAnd suddenly\nYou’re angry again\n\nDangerous silver\nNothing to prove\nYou’re already watching\nEvery time I move\n\nI never chased trouble\nBut trouble seems thrilled\nTo walk straight toward me\nDressed in purple\n\n[Bridge]\nMaybe I should apologize\nWould that help at all?\n\nNo?\n\nThought so.\n\nYou call me something\nI answer once\nYou throw another spark\nI let it burn\n\nNo grand challenge\nNo declaration\nYou’re doing enough\nFor the both of us\n\n[Breakdown]\nSilver hair\nBlack shirt\nHands in my pockets\n\nPurple glare\nRed face\nCan’t seem to stop it\n\nFirst day\nNew room\nAlready understood\n\nThis place is strange\n\nI think I’ll stay\n\n[Final Chorus]\nDangerous silver\nSharp in the light\nNever need permission\nNever need the fight\n\nOne step\nOne glance\nOne quiet “Hm?”\nAnd there you go\nLosing your cool again\n\nDangerous silver\nSay what you will\nThe louder you get\nThe calmer I stand still\n\nI never chased trouble\nBut trouble walked in\nStopped right below me—\n\nAnd glared up again\n\n[Outro]\n“Hm?”\n\nI wasn’t looking down.\n\n...\n\nNot much.';
$related_url = 'https://www.yuri1.com/Post.html?id=P20260928-02';

$page_title = 'Dangerous Silver \\ YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = 'Dangerous Silver — YURI NO1 Music · Cat Fighting · C.Curo';
$page_canonical = 'https://music.yuri1.com/data/99-20260928-02/o-cat-fighting-01/';
$page_og_image = 'https://music.yuri1.com/music-img/99-20260928-02_o-cat-fighting-01.jpg';
$page_og_type = 'music.song';
$page_structured_data = [
  '@context' => 'https://schema.org',
  '@type' => 'MusicRecording',
  'name' => $track['TITLE'],
  'url' => $page_canonical,
  'image' => $page_og_image,
  'contentUrl' => 'https://music.yuri1.com/music-mp3/99-20260928-02_o-cat-fighting-01.mp3',
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
