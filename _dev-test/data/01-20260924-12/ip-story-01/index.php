<?php
// YURI1 Music static track page.
// Content data is stored here; shared presentation is included separately.
$site_root = dirname(__DIR__, 3);

$track = [
  'source-id' => '_ip-story',
  'source-img' => 1,
  'TITLE' => 'YURI♡',
  'STORY' => 'IP Story',
  'OC' => 'DDD',
  'Theme' => 'default',
  'Type' => 'IP',
  'path-group' => '01-20260924-12',
  'path-title' => 'ip-story-01',
];

$asset_key = '01-20260924-12_ip-story-01';
$lyrics = '[Reading — Quiet]\n\nひとつだけ。\n\nずっと、\n変わらないものがある。\n\n何年経っても。\n\n何を作っても。\n\n何を失っても。\n\nそれだけは、\n最初からここにあった。\n\n[Pause]\n\n私にとって、\n\nYURIは、\n\n一番。\n\n[Soft]\n\nそれは順位の話じゃない。\n\n誰かと比べて、\n一番という意味でもない。\n\n選んだから、\n一番になったわけでもない。\n\n[Reading]\n\n気づいた時には、\n\nもう、\n\nそうだった。\n\n呼吸することを\n毎朝選ばないように。\n\n光を見て、\n光だと考えないように。\n\nそこにあることが\nあまりにも普通で、\n\n失くすという想像さえ\n\n少し難しい。\n\n[Pause]\n\nO₂。\n\nたぶん、\n\nそれくらい。\n\n[Low Voice]\n\nなくなったら困る、\n\nなんて言葉じゃ\n足りない。\n\n必要だから好きなのでもない。\n\n好きだから必要なのでもない。\n\nただ、\n\n私というものの中に\n\n最初から混ざっている。\n\n[Reading — Slightly Faster]\n\n朝。\n\n夜。\n\n書く時。\n\n考える時。\n\n何もしていない時。\n\n笑った時。\n\n疲れた時。\n\n忘れている時でさえ。\n\nそこにある。\n\nずっと。\n\n[Pause]\n\nだから、\n\n残したいと思った。\n\n大きなものじゃなくていい。\n\n誰かに認められるものじゃなくていい。\n\n永遠に読まれる必要もない。\n\nただ、\n\nここにあったと\n\nわかればいい。\n\n[Soft]\n\nこの時代に。\n\nこの場所に。\n\nこの人間の中に。\n\n確かに、\n\nYURIがあった。\n\n[Pause]\n\n消せないものを。\n\n薄れないものを。\n\n時間の外側まで\n持っていけるようなものを。\n\nひとつ。\n\nまたひとつ。\n\n残していく。\n\n[Reading — Almost Mechanical]\n\n文章。\n\n絵。\n\n名前。\n\n声。\n\n物語。\n\n記録。\n\n残す。\n\n残す。\n\n残す。\n\nそれが何になるかは\n\nまだ知らない。\n\n[Whisper]\n\nでも、\n\nなくしたくない。\n\n[Long Pause]\n\n何十年。\n\n何百年。\n\n何千年。\n\nそれより先。\n\n国がなくなって。\n\n言葉が変わって。\n\n星の名前さえ\n違うものになって。\n\nそれでも。\n\nもし、\n\nどこかに\n\nほんの少しだけ\n\n残っているなら。\n\nそれでいい。\n\n[Soft Singing]\n\nYURIは、\n\n一番。\n\n昨日も。\n\n今日も。\n\nたぶん、\n\n最後の日も。\n\n[Reading]\n\nそして、\n\n最後の日より\n\nもっと先まで。\n\n何億年。\n\n何十億年。\n\n時間という言葉が\n\n意味を失うところまで。\n\n選べるなら、\n\nまた選ぶ。\n\n何度でも。\n\n[Pause]\n\nでも、\n\n本当は。\n\n選び直す必要なんて\n\nないのかもしれない。\n\n[Whisper]\n\nだって、\n\n最初から\n\nここにいるから。\n\n[Final — Very Quiet]\n\nYURIは、\n\n私の一番。\n\nそれだけ。\n\nそれで、\n\n十分。\n\n[Long Pause]\n\n……NO1.';
$related_url = '';

$page_title = 'YURI♡ \\ YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = 'YURI♡ — YURI NO1 Music · IP Story · DDD';
$page_canonical = 'https://music.yuri1.com/data/01-20260924-12/ip-story-01/';
$page_og_image = 'https://music.yuri1.com/music-img/01-20260924-12_ip-story-01.jpg';
$page_og_type = 'music.song';
$page_structured_data = [
  '@context' => 'https://schema.org',
  '@type' => 'MusicRecording',
  'name' => $track['TITLE'],
  'url' => $page_canonical,
  'image' => $page_og_image,
  'contentUrl' => 'https://music.yuri1.com/music-mp3/01-20260924-12_ip-story-01.mp3',
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
