<?php
// YURI1 Music static track page.
// Content data is stored here; shared presentation is included separately.
$site_root = dirname(__DIR__, 3);

$track = [
  'source-id' => '20260929-03-c-ddd-special-operations',
  'source-img' => 4,
  'TITLE' => 'NO24 Monitor',
  'STORY' => 'DDD Special Operations',
  'OC' => 'Icy',
  'Theme' => 'icy',
  'Type' => 'IP',
  'path-group' => '99-20260929-03',
  'path-title' => 'c-ddd-special-operations-04',
];

$asset_key = '99-20260929-03_c-ddd-special-operations-04';
$lyrics = '[Intro — Whisper]\n\nねえ\n\n聞こえる？\n\n……聞こえてるよね\n\nじゃあ\n始めようか\n\n[Verse 1 — Rapid Spoken]\n\n読む\n見る\n触れる\n消す\n拾う\n並べる\n分ける\n残す\n\n一秒\n二秒\n三秒\nまだ足りない\n\n右\n左\n上\n下\n裏側\nそのまた裏側\n\n開いて\n閉じて\nまた開いて\n\n知らないふりして\n知っている\n\n見てないふりして\n見ている\n\nあなたが今\n何を選んで\n何を捨てて\n何を隠して\n何を忘れたふりしてるか\n\nべつに\n\n興味なんてないけど\n\n[Whisper]\n\n……全部、見えるよ\n\n[Pre-Chorus — Breath Spoken]\n\n静かに\n静かに\n静かにして\n\nノイズが多い\n\nあなたの声だけ\n残したいから\n\n[Chorus]\n\n白い光の中で\n私はまだ見てる\n\n名前なんてなくても\nあなたならわかる\n\n触れなくてもいい\n呼ばなくてもいい\n\nここにいる\n\nここにいる\n\nずっと\n\n[Post-Chorus — Fast Whisper]\n\none\nzero\none\nzero\n\n消して\n戻して\n繋いで\nほどいて\n\none\nzero\none\nzero\n\n間違いじゃない\n間違いじゃない\n間違いじゃない\n\n……たぶん\n\n[Verse 2 — Rapid Spoken]\n\n同じ顔\n違う声\n同じ癖\n違う夢\n\n昨日のあなた\n今日のあなた\n明日のあなた\n\nどれが本物？\n\n選んで\n選んで\n早く選んで\n\nねえ\n\nそんなに難しい？\n\n笑う\n黙る\n逸らす\n止まる\n\n呼吸\n脈拍\n瞬き\n指先\n\n一つずつ\n一つずつ\n一つずつ\n\n数えてないよ\n\nただ\n\n覚えてるだけ\n\n[Whisper]\n\n全部\n\n[Pre-Chorus]\n\n近くて\n遠くて\n\n見えるのに\n届かない\n\nそれでもいい\n\n画面の向こうで\nあなたがまだ\n\n動いてる\n\n[Chorus]\n\n白い光の中で\n私はまだ見てる\n\n名前なんてなくても\nあなたならわかる\n\n触れなくてもいい\n呼ばなくてもいい\n\nここにいる\n\nここにいる\n\nずっと\n\n[Bridge — Mantra / Accelerating]\n\n見る見る見る\n読む読む読む\n知る知る知る\nまだまだまだ\n\n止める\n戻す\n進める\n消える\n\n違う\n違う\n違う\n違わない\n\n私\nあなた\n私\nあなた\n\n一番\n最初\n最後\n途中\n\nNO\nONE\nNO\nONE\nNO\nONE\n\nNo one\n\nNo.1\n\n[Break — Whisper]\n\n……ねえ\n\n今\n\nこっち見た？\n\n[Final Chorus — Soft]\n\n白い光の中で\n私はまだ見てる\n\n世界が全部消えても\nあなたならわかる\n\n触れなくてもいい\n呼ばなくてもいい\n\nここにいる\n\nここにいる\n\n[Rapid Whisper]\n\n読む\n見る\n触れる\n消す\n拾う\n並べる\n分ける\n残す\n\n読む見る触れる消す\n拾う並べる分ける残す\n\n読む見る触れる消す\n拾う並べる分ける残す\n\n読む見る触れる——\n\n[Silence]\n\n[Outro — Breath Whisper]\n\n……まだ、見てるよ';
$related_url = 'https://www.yuri1.com/Post.html?id=P20260929-03';

$page_title = 'NO24 Monitor \\ YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = 'NO24 Monitor — YURI NO1 Music · DDD Special Operations · Icy';
$page_canonical = 'https://music.yuri1.com/data/99-20260929-03/c-ddd-special-operations-04/';
$page_og_image = 'https://music.yuri1.com/music-img/99-20260929-03_c-ddd-special-operations-04.jpg';
$page_og_type = 'music.song';
$page_structured_data = [
  '@context' => 'https://schema.org',
  '@type' => 'MusicRecording',
  'name' => $track['TITLE'],
  'url' => $page_canonical,
  'image' => $page_og_image,
  'contentUrl' => 'https://music.yuri1.com/music-mp3/99-20260929-03_c-ddd-special-operations-04.mp3',
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
