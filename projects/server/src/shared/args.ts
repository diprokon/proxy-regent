import { Command } from 'commander';

export const args = new Command();

args
    .option('-t, --target <target>', 'target url')
    .option('-c, --cachePath [cachePath]', 'Path to cache file', 'tmp/cache-data.json')
    .option('-p, --port [port]', 'Port (default 3003)', '3003')
    .option('-sp, --settingsPort [settingsPort]', 'Settings page port (default 3004)', '3004')
    .option('-v, --verbose')
    .parse(process.argv);

declare module 'commander' {
    interface Command {
        port: string;
        settingsPort: string;
        verbose: string;
        cachePath: string;
        target: string;
    }
}
