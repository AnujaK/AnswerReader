set TRUNK_LOCATION=D:\chrome_dev\SlashRecruit\quoradeck_017
set DIST_LOCATION=D:\chrome_dev\quoradeck_dist
set YUI_COMPRESSOR_LOCATION=D:/chrome_dev/yuicompressor-2.4.2.jar

C:\Windows\System32\xcopy.exe %TRUNK_LOCATION% %DIST_LOCATION%\ /S

java -jar %YUI_COMPRESSOR_LOCATION% --type js %DIST_LOCATION%\src\idxdb.js -o %DIST_LOCATION%\src\idxdb.js
java -jar %YUI_COMPRESSOR_LOCATION% --type js %DIST_LOCATION%\src\main-view.js -o %DIST_LOCATION%\src\main-view.js