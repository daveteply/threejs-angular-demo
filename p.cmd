call b.cmd
rd /s /q ..\dist
xcopy dist ..\dist /f /s /e /y /i
git checkout gh-pages
xcopy ..\dist dist /f /s /e /y /i