@ECHO OFF

:install
  call npm install
GOTO run

:run
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
REM start /B "" node  "%~dp0\node_modules\http-server\bin\http-server" -a localhost -p 8585 --cors --proxy http://mango.iptime.org:28985 &
  node  "%~dp0\node_modules\http-server\bin\http-server" -a localhost %*
GOTO end

:end
