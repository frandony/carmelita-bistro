@echo off
rem Recompila app.jsx -> app.js (o site carrega o app.js, nao o app.jsx).
rem Rode sempre depois de editar o app.jsx, antes do commit.
npx --yes esbuild@0.25.10 app.jsx --minify --format=iife --target=es2019 --charset=utf8 --outfile=app.js
