<?php
// YURI1 Music static track page.
// Content data is stored here; shared presentation is included separately.
$site_root = dirname(__DIR__, 3);

$track = [
  'source-id' => '-ip-album-icy-mini-vol1',
  'source-img' => 10,
  'TITLE' => '10 でも結局、恋って何？',
  'STORY' => 'Mini Album Vol.1',
  'OC' => 'Icy & Arte',
  'Theme' => 'album-icy-mini-1-10',
  'Type' => 'Album',
  'path-group' => '02-20261005-21',
  'path-title' => 'ip-album-icy-mini-vol1-10',
];

$asset_key = '02-20261005-21_ip-album-icy-mini-vol1-10';
$lyrics = '[Intro — Room Tone]\n[Duet — Soft]\nただいま\nおかえり\n長い一日が\n終わった\n録音も\n物語も\n全部\n終わった\n[Pause]\nでも\nひとつだけ\n終わらない\n[Whisper]\n恋って\n何？\n[Verse 1 — Solo]\n録音室には\nいくつもの声\nいくつもの名前\nいくつもの私\n冷たい声\n強い声\n少し甘い声\n遠い未来の声\n本の中を歩く声\n世界を残そうとする声\n[Second Solo]\nどれも違って\nどれも似てる\n女の子を見て\n気になって\n近づいて\n迷って\n離れて\nまた\n振り返る\n[Duet]\nみんな\n同じことを\n考えてた\n好きって\n何？\n[Chorus — Duet]\n恋って\n結局なんなの？\n会いたいこと？\n触れたいこと？\n隣にいたいこと？\n少し困ること？\n少し嬉しいこと？\nわからないまま\nまた\n考えること？\n[Verse 2 — Solo]\n帰った部屋には\nいつもの明かり\nいつもの椅子\nいつもの声\n冷蔵庫には\nアイスクリーム\n[Second Solo]\nひとつ\nふたつ\n違う味\n同じスプーン\n冷たい\n甘い\n少し苦い\n少し酸っぱい\n[Duet — Light]\n全部違う\nでも\n全部\nアイスクリーム\n[Pause]\n……\nなるほど\n[Pre-Chorus — Alternating]\n説明できなくても\nいい\n理由がなくても\nいい\n昨日と今日で\n少し違っても\nいい\nそれでも\n好きなら\n好き\n[Chorus — Duet]\n恋って\nアイスクリームみたい\n甘い日もある\n苦い日もある\n溶ける日もある\n欲しくなる日もある\n好きな味は\nみんな違う\nでも\n名前は\n同じ\n[Bridge — Solo]\n一曲目では\n考えてた\nどうしてアイスは\n美味しい？\n温度？\n甘さ？\n溶ける速さ？\n[Second Solo]\n最後まで\n考えた\nでも\n答えは\nたぶん\nもっと\n簡単\n[Duet — Soft]\n好きだから\n食べる\n好きだから\nそばにいる\nそれだけで\nいいのかもしれない\n[Final Chorus — Duet]\n恋って\n結局なんなの？\nまだ\nちゃんとは\nわからない\nでも\n帰る場所があって\n隣に誰かがいて\n同じアイスを食べて\nもう少しだけ\n近くにいたい\nそう思うなら\nそれを\n恋って呼んでも\nいいのかもしれない\n[Outro — Alternating / Free Assignment]\nアイス\n食べる？\n食べる\n何味？\n同じのでいい\n珍しい\n今日は\n同じがいい\n[Pause]\n一口いる？\nいる\n[Soft Humming]\nんー……\n[Pause]\n恋って\nアイスみたいだね\n今さら？\n……\nうるさい\n[Pause]\nもう一口\n自分のがあるでしょ\n……\nじゃあ\nキスは？\n[Silence]\nえ？\n[Duet — Soft Whisper]\nそっちなら\n同じ味\n\n';
$related_url = '';

$page_title = '10 でも結局、恋って何？ \\ YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = '10 でも結局、恋って何？ — YURI NO1 Music · Mini Album Vol.1 · Icy & Arte';
$page_canonical = 'https://music.yuri1.com/data/02-20261005-21/ip-album-icy-mini-vol1-10/';
$page_og_image = 'https://music.yuri1.com/music-img/02-20261005-21_ip-album-icy-mini-vol1-10.jpg';
$page_og_type = 'music.song';
$page_structured_data = [
  '@context' => 'https://schema.org',
  '@type' => 'MusicRecording',
  'name' => $track['TITLE'],
  'url' => $page_canonical,
  'image' => $page_og_image,
  'contentUrl' => 'https://music.yuri1.com/music-mp3/02-20261005-21_ip-album-icy-mini-vol1-10.mp3',
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
