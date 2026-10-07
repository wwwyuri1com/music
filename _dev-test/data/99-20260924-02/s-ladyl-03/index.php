<?php
// YURI1 Music static track page.
// Content data is stored here; shared presentation is included separately.
$site_root = dirname(__DIR__, 3);

$track = [
  'source-id' => '20260924-02-s-ladyl',
  'source-img' => 3,
  'TITLE' => 'Leopard',
  'STORY' => 'Lady L',
  'OC' => 'Yuer',
  'Theme' => 'shorts',
  'Type' => 'Shorts',
  'path-group' => '99-20260924-02',
  'path-title' => 's-ladyl-03',
];

$asset_key = '99-20260924-02_s-ladyl-03';
$lyrics = '[Intro]\nねえ、Lady L\nまた風とか海とか書いてんの？\nCute.\nでも今夜は詩じゃない\nHook up, baby\n\n[Verse 1]\nSwipe, tap, midnight\n近いなら会おうよ tonight\n肩書き？ Money？ 興味ない\n顔がタイプなら、それで alright\n\n忙しい女、孤独な office\n強がるくせに夜だけ reckless\n一回会えばすぐ分かる\nChemistryないなら next, goodbye\n\n「まず心を知りたい」？\nSeriously？\n手を繋いで夜景？\nThat’s your fantasy？\n\n私はもっと簡単\n欲しいなら欲しいって言う\nFuck or fuck off\nそれだけでいい\n\n[Hook]\nHook up, shouldn\'t we?\n今夜だけでも good enough\nFuck me, love me\nでも退屈なら no more touch\n\nHook up, right?\n綺麗事なんて shut it up\nOne night, one shot\nFuck or fuck off\n\n[Verse 2]\nClaireは dirty talk が最悪\nAliceは上手い、でも rules が多すぎ\nDonna？ Nah, あれは危険\n帰れるかちょっと心配した weekend\n\n私は選ぶ側\n追われても媚びない\nThat\'s me\n金積まれても\nつまらないなら会わない\nThat\'s it\n\n一度で決める\n楽しくなきゃ終わり\nSecond chance？\nそんな優しくない\n\nなのに何で\n頭に残ってんの？\nあの堅物\nあの sex-ed teacher\n\n[Break]\n「風」\n「海」\n「運命」\n\n……うるさい。\n\nでもまあ\nもう一回くらい\nからかってもいいか。\n\n[Hook]\nHook up, right?\n今夜だけでも good enough\nFuck me, love me\nでも退屈なら no more touch\n\nHook up, hurry up\nその詩は後で読んでやる\nOne night, one shot\nFuck or fuck off\n\n[Bridge]\nHey, Lady L\nそんな顔で説教して\n本当はキスだけで\n頭真っ白になるんでしょ？\n\n私は romance を信じない\nForeverなんて知らない\nでも妳が「正しい人」とか言うたび\n\n……なんか腹立つ。\n\n[Final Hook]\nHook up, shouldn\'t we?\n欲望くらい honestでいよう\nFuck me, love me\n名前なんて明日でいいよ\n\nHook up, right?\nなのに今夜だけ妙に tough\n帰るつもりだったのに\n\nLady L,\nwhy the fuck\nam I texting you again?';
$related_url = 'https://www.yuri1.com/Post.html?id=P20260924-02';

$page_title = 'Leopard \\ YURI NO1 Music – Girls Love ♡ AI Music from Novels';
$page_description = 'Leopard — YURI NO1 Music · Lady L · Yuer';
$page_canonical = 'https://music.yuri1.com/data/99-20260924-02/s-ladyl-03/';
$page_og_image = 'https://music.yuri1.com/music-img/99-20260924-02_s-ladyl-03.jpg';
$page_og_type = 'music.song';
$page_structured_data = [
  '@context' => 'https://schema.org',
  '@type' => 'MusicRecording',
  'name' => $track['TITLE'],
  'url' => $page_canonical,
  'image' => $page_og_image,
  'contentUrl' => 'https://music.yuri1.com/music-mp3/99-20260924-02_s-ladyl-03.mp3',
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
