@echo off

:loop

date /T
node getnumber http://localhost:4444
timeout /D 30

goto loop