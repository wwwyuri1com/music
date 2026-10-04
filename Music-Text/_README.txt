Music-Text naming rule
======================

Use the same ID + Img naming as Music-Mp3 and Music-Img:
  Music-Text/<ID> (<Img>).txt

Example:
  Music-Text/20260928-02_O_Cat-Fighting (1).txt

W-Tracklog.json track filter:
  "Type": "IP"
  "Type": "Shorts"

If Type is omitted, the player treats the track as IP.


Optional custom story link override:
  "Link": "https://www.yuri1.com/Post.html?id=P20260924-02"

If Link is omitted or blank, the player automatically builds:
  https://www.yuri1.com/Post.html?id=P<YYYYMMDD-NN>
from the beginning of ID. Shorts use the same rule as IP tracks.
