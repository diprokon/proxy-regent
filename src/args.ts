import { Command } from 'commander';

export const args = new Command();

args
    .option('-t, --target <target>', 'target url')
    .option('-m, --mockPath [mockPath]', 'Path to cache file', 'tmp/mock-data.json')
    .option('-p, --port [port]', 'Port (default 3003)', '3003')
    .option('-v, --verbose')
    .parse(process.argv);

declare module 'commander' {
    interface Command {
        port: string;
        verbose: string;
        mockPath: string;
        target: string;
    }
}
