import { Command } from 'commander';

export const args = new Command();

args
    .option('-c, --proxyConfig <proxyConfig>', 'Path to http-proxy config file')
    .option('-p, --port [port]', 'Port (default 3003)', '3003')
    .option('-v, --verbose')
    .parse(process.argv);

declare module 'commander' {
    interface Command {
        proxyConfig: string;
        port: string;
        verbose: string;
    }
}
