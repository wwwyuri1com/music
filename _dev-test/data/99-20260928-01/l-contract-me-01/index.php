<?php
// YURI1 Music static track page.
// Content data is stored here; shared presentation is included separately.
$site_root = dirname(__DIR__, 3);

$track = [
  'source-id' => '20260928-01-l-contract-me',
  'source-img' => 1,
  'TITLE' => 'Lying Red',
  'STORY' => 'Contract Me',
  'OC' => 'E.Red',
  'Theme' => 'e.red',
  'Type' => 'IP',
  'path-group' => '99-20260928-01',
  'path-title' => 'l-contract-me-01',
];

$asset_key = '99-20260928-01_l-contract-me-01';
$lyrics = '[Intro — Whisper]\n\nねえ\n\nそんなに見ないで。\n\n……嘘。\n\nもっと見て。\n\n[Verse 1]\n\n近いのに\nまだ触れない\n\n指先だけ\n迷ってる\n\n知らないふり\nしてるけど\n\nその目を見れば\nわかるよ\n\n一歩\n半歩\nあと少し\n\n逃げる理由を\n探してる？\n\nでもね\n\n今さらそんな顔しても\n\n遅いでしょう。\n\n[Whisper]\n\nかわいい。\n\n[Pre-Chorus]\n\n触れない\n触れない\n\nまだ触れない\n\nそのほうが\nずっと熱いから\n\n言わない\n言わない\n\nまだ言わない\n\nあなたが先に\n欲しがるまで\n\n[Chorus]\n\nねえ\nこっちに来て\n\n少しだけ\nもっと近く\n\nキスなんて\nまだしないよ\n\n期待した？\n\n残念。\n\nねえ\nそのままで\n\n目を逸らさないで\n\nあなたが困る顔\n\nもう少しだけ\n\n見ていたい。\n\n[Verse 2]\n\n髪を触る\n首を見る\n\n視線だけで\nなぞってく\n\n偶然みたいに\n笑ってる\n\n本当は全部\nわざとなの\n\n右\n左\nまた右\n\nあなたの目が\n忙しい\n\nそんなにちゃんと\n追いかけたら\n\n勘違いするよ？\n\n[Whisper]\n\n……してるけど。\n\n[Pre-Chorus]\n\n近づいて\n離れて\n\nまた近づいて\n\n呼吸だけが\n先に触れる\n\n名前なんて\n呼ばなくても\n\n今はそれで\n十分でしょう。\n\n[Chorus]\n\nねえ\nこっちに来て\n\n少しだけ\nもっと近く\n\nキスなんて\nまだしないよ\n\n期待した？\n\n残念。\n\nねえ\nそのままで\n\n目を逸らさないで\n\nあなたが困る顔\n\nもう少しだけ\n\n見ていたい。\n\n[Bridge — Rapid Whisper]\n\n見て\n見ないで\n見て\n\n来て\n待って\n来て\n\n近い\nまだ\n近い\n\nだめ\nいいよ\nだめ\n\n触れる\n触れない\n触れそう\n\n言う\n言わない\n言わせたい\n\nねえ\n\nどっちが先に\n\n負けるかな。\n\n[Pause]\n\n[Whisper]\n\n私はまだ\n\n余裕だけど？\n\n[Final Chorus]\n\nねえ\nこっちに来て\n\nもう少し\nもっと近く\n\nキスなんて\nまだしないよ\n\n……たぶんね。\n\nねえ\nそのままで\n\nちゃんと私を見て\n\nあなたが欲しがるなら\n\nもう少しだけ\n\n焦らしてあげる。\n\n[Outro — Whisper]\n\n触れないふり。\n\n知らないふり。\n\n余裕なふり。\n\n[Pause]\n\n……最後のは\n\nお互い様かな。';
$related_url = 'https://www.yuri1.com/Post.html?id=P20260928-01';

$page_title = 'Lying Red \\ YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = 'Lying Red — YURI NO1 Music · Contract Me · E.Red';
$page_canonical = 'https://music.yuri1.com/data/99-20260928-01/l-contract-me-01/';
$page_og_image = 'https://music.yuri1.com/music-img/99-20260928-01_l-contract-me-01.jpg';
$page_og_type = 'music.song';
$page_structured_data = [
  '@context' => 'https://schema.org',
  '@type' => 'MusicRecording',
  'name' => $track['TITLE'],
  'url' => $page_canonical,
  'image' => $page_og_image,
  'contentUrl' => 'https://music.yuri1.com/music-mp3/99-20260928-01_l-contract-me-01.mp3',
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
