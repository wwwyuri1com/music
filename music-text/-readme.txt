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

W-Tracklog display / Player-Img rule:
  "OC": "Icy"                    # character name shown in the player
  "Theme": "Album-Icy-Mini-1-10" # Player-Img/<Theme>.png filename key

OC and Theme are independent. If OC is omitted, the player falls back to Theme
for backward compatibility with older track entries.
