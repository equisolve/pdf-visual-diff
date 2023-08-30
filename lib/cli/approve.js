#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approve = void 0;
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
const fs = fs_1.default.promises;
exports.approve = {
    command: 'approve',
    describe: 'Approve new snapshots',
    builder: {
        path: {
            alias: 'p',
            default: '.',
        },
        'snapshots-dir-name': {
            alias: 's',
            default: '__snapshots__',
        },
    },
    handler: ({ path, snapshotsDirName }) => {
        return (0, utils_1.findImages)(path, snapshotsDirName).then((files) => {
            const execDirLength = process.cwd().length;
            const filesOutput = files.map((x) => '.' + x.substring(execDirLength)).join('\n');
            return (0, utils_1.askForConfirmation)(`
New snapshots:          
${filesOutput}
Are you sure you want to overwrite current snapshots?`).then((overwrite) => {
                if (overwrite) {
                    return Promise.all(files.map((x) => fs.rename(x, (0, utils_1.mkCurrentSnapshotPath)(x)).then(() => fs.unlink((0, utils_1.mkDiffSnapshotPath)(x))))).then(() => console.log('Success! Snapshots are overwritten.'));
                }
                console.log('Command was discarded! No changes were made.');
                return Promise.resolve();
            });
        });
    },
};
//# sourceMappingURL=approve.js.map