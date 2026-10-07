const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const files = ['index.html', ...fs.readdirSync(path.join(root,'m'),{withFileTypes:true}).filter(d=>d.isDirectory()).flatMap(d => fs.readdirSync(path.join(root,'m',d.name),{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>path.join('m',d.name,x.name,'index.html')))];
async function check(file) {
  const src = fs.readFileSync(path.join(root,file), 'utf8');
  const begin = src.indexOf('window.YURI1Cache = (() => {');
  const end = src.indexOf('  // Refresh CSS', begin);
  if (begin < 0 || end < 0) throw Error('Cache code not found: '+file);
  const snippet = src.slice(begin,end);
  const seen=[];
  const loc = {href:'https://music.yuri1.com/m/m--ip-album-icy-mini-vol1/1-what-matters-most/',origin:'https://music.yuri1.com'};
  const fakeWindow = {};
  const doc = {baseURI:'https://music.yuri1.com/'};
  const sandbox = {window:fakeWindow, location:loc, document:doc, URL, Map, Math, Date, fetch:async (url, opts)=>{seen.push({url, method:opts.method}); return {ok:true,headers:{get:n => n==='etag'?'"ok"':null}}}};
  vm.runInNewContext(snippet,sandbox,{filename:file});
  const expected='/music-img/-ip-album-icy-mini-vol1%20(1).jpg';
  const result = await fakeWindow.YURI1Cache.versioned('music-img/-ip-album-icy-mini-vol1%20(1).jpg');
  if (!result.startsWith(expected+'?v=') || seen[0].url!==expected) throw Error('Mismatched asset root: '+file+' '+JSON.stringify({seen,result}));
  // Playlist changes window history, but the document base remains root.
  loc.href='https://music.yuri1.com/m/m-p20260928-01/wife/';
  const second='/music-text/20260928-01-l-contract-me%20(3).txt';
  const lyric=await fakeWindow.YURI1Cache.versioned('music-text/20260928-01-l-contract-me%20(3).txt');
  if (!lyric.startsWith(second+'?v=') || seen[1].url!==second) throw Error('Changed-history lyric root is wrong: '+file);
  const audio='/music-mp3/-ip-album-icy-mini-vol1%20(1).mp3';
  const mp3=await fakeWindow.YURI1Cache.versioned('music-mp3/-ip-album-icy-mini-vol1%20(1).mp3');
  if (!mp3.startsWith(audio+'?v=') || seen[2].url!==audio) throw Error('Changed-history audio root is wrong: '+file);
}
(async()=>{for(const f of files)await check(f);console.log('PASS: cache path stays rooted at / for all '+files.length+' pages, both direct links and history changes.')})().catch(e=>{console.error(e);process.exit(1)});
