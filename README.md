# ProxyMock
A proxy server, which mock data after first request

## Installation and usage

To start the proxy

`$ npm i -g proxy-mock`

To start the proxy

`$ proxy-mock -t http://your-api.url`

By default, it uses 3003 port

## CLI options

`-t <target>`, `--target <target>`: proxy target

`-m <mockPath>`, `--mockPath <mockPath>`: Path to cache file (default `tmp/mock-data.json`)

`-p <port>`, `--port <port>`: Port (default `3003`)

`-sp <settingsPort>`, `--settingsPort <settingsPort>`: Settings page port (default `3004`)

`-v`, `--verbose`
