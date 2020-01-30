@echo off

:loop

time /T >> \dev\rskj\times3.txt
node getnumber http://localhost:4444 >>  \dev\rskj\times3.txt
timeout /T 60

goto loop