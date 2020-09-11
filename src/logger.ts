import * as chalk from 'chalk';
import { args } from './args';

export function info(text: string): void {
    console.log(`%s ${text}`, chalk.cyan('INFO'));
}

export function log(text: string) {
    if(args.verbose) {
        console.log(`%s ${text}`, chalk.yellow('LOG'));
    }
}

export function error(text: string) {
    console.error(`%s ${text}`, chalk.redBright('ERROR'));
}
