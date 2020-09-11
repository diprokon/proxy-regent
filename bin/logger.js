"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.log = exports.info = void 0;
const chalk = require("chalk");
const args_1 = require("./args");
function info(text) {
    console.log(`%s ${text}`, chalk.cyan('INFO'));
}
exports.info = info;
function log(text) {
    if (args_1.args.verbose) {
        console.log(`%s ${text}`, chalk.yellow('LOG'));
    }
}
exports.log = log;
function error(text) {
    console.error(`%s ${text}`, chalk.redBright('ERROR'));
}
exports.error = error;
