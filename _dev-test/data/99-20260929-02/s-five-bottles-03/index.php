<?php
// YURI1 Music static track page.
// Content data is stored here; shared presentation is included separately.
$site_root = dirname(__DIR__, 3);

$track = [
  'source-id' => '20260929-02-s-five-bottles',
  'source-img' => 3,
  'TITLE' => '冗談だよ...半分は',
  'STORY' => 'Five bottles',
  'OC' => 'Ximuer',
  'Theme' => 'shorts',
  'Type' => 'Shorts',
  'path-group' => '99-20260929-02',
  'path-title' => 's-five-bottles-03',
];

$asset_key = '99-20260929-02_s-five-bottles-03';
$lyrics = '[Verse 1]\nねえ　今日も遅かったね\n別に待ってないけど\nコンビニの白い灯りで\nあなたの顔　よく見える\n\nいつもと違う香り\n知らない癖が増えてる\nそんなこと気づくなんて\n私　変かな\n\n[Pre-Chorus]\nねえ　こっち見て\n少しだけ\nちゃんと目を見て話して\n\n大丈夫\n怒ってないよ\nただ知りたいだけ\n\n[Chorus]\n好きなところへ行っていいよ\n誰と笑ってもいいよ\n私は何も言わないから\n安心してね\n\nでも帰る道くらい\n覚えていてほしいな\n迷ってしまったその時は\n\n私のところへ帰って\n\n[Verse 2]\nあなたが好きな飲み物\nもう言われなくてもわかる\nレジの向こうから見れば\n今日の気分までわかる\n\nスマホを伏せる仕草も\n嘘をつく時の声も\n知らないふりしてあげる\n優しいでしょう？\n\n[Pre-Chorus]\nねえ　笑って\nいつもみたいに\nそんな顔しないでよ\n\n怖くないよ\n何もしないよ\n\nたぶんね\n\n[Chorus]\n好きなところへ行っていいよ\n誰を好きでもいいよ\n私は嫉妬なんてしない\n本当だよ\n\nでもあなたの名前を\n優しく呼ぶ人がいたら\nどんな人なのかくらいは\n\n少し知りたいだけ\n\n[Bridge]\nあなたの好きなもの\nあなたの嫌いなもの\n眠れない夜の時間\n帰り道の信号\n\n全部ただ覚えてるだけ\n特別な意味はないよ\n\nねえ\n\nどうして震えてるの？\n\n[Whisper]\n冗談だよ\n\n……半分は\n\n[Final Chorus]\n好きなところへ行っていいよ\nほら　扉も開いてる\n止めたりなんてしないから\n好きにすればいい\n\nだけど最後に疲れて\n誰も信じられなくなったら\nきっとあなたは思い出す\n\nここが一番安全だって\n\n[Outro]\nちゃんと帰ってね\n\n着いたら連絡して\n\nしなくても\n\nわかるけど';
$related_url = 'https://www.yuri1.com/Post.html?id=P20260929-02';

$page_title = '冗談だよ...半分は \\ YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = '冗談だよ...半分は — YURI NO1 Music · Five bottles · Ximuer';
$page_canonical = 'https://music.yuri1.com/data/99-20260929-02/s-five-bottles-03/';
$page_og_image = 'https://music.yuri1.com/music-img/99-20260929-02_s-five-bottles-03.jpg';
$page_og_type = 'music.song';
$page_structured_data = [
  '@context' => 'https://schema.org',
  '@type' => 'MusicRecording',
  'name' => $track['TITLE'],
  'url' => $page_canonical,
  'image' => $page_og_image,
  'contentUrl' => 'https://music.yuri1.com/music-mp3/99-20260929-02_s-five-bottles-03.mp3',
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
