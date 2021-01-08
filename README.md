# Proxy Regent
A proxy server that caches responses

## Installation and usage

To install the proxy

`$ npm i -g proxy-regent`

To start the proxy

`$ proxy-regent -t http://your-api.url`

By default, it uses 3003 port

You can see cached requests, enable/disable on http://localhost:3004

## CLI options

`-t <target>`, `--target <target>`: proxy target

`-c <cachePath>`, `--cachePath <cachePath>`: Path to cache file (default `tmp/cache-data.json`)

`-p <port>`, `--port <port>`: Port (default `3003`)

`-sp <settingsPort>`, `--settingsPort <settingsPort>`: Settings page port (default `3004`)

`-v`, `--verbose`
