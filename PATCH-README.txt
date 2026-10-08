YURI1 MUSIC CORE RUNTIME FIX

類型：PATCH
只覆蓋：
- config/music.js
- music-core/*.html（單曲保存頁）

其他檔案：不要動、不要刪除。

修正：
1. 主播放器小方塊圖片路徑由 player-img/ 改為 music-player/。
2. 先前因 MP3 沒有上傳給 ChatGPT，而在保存 HTML 寫入的「[not included in this test package]」是錯誤設計；保存頁應記錄真正的預期檔名，不應記錄傳輸包狀態。
3. 所有保存頁 MP3 欄位已恢復為 ID + Windows Img 編號的現行檔名，例如：
   20260930-01-s-carnivore (2).mp3
4. 本 PATCH 不包含任何 MP3；請把你本機原有 MP3 放在 music-core/，名稱維持現行檔名即可。
