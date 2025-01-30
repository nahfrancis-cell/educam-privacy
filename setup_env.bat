@echo off
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-11.0.26+4" /M
setx PATH "%PATH%;%JAVA_HOME%\bin" /M
echo Environment variables have been set.
pause
