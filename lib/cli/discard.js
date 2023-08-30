#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discard = void 0;
const utils_1 = require("./utils");
const fs_1 = __importDefault(require("fs"));
const fs = fs_1.default.promises;
exports.discard = {
    command: 'discard',
    describe: 'Discard new snapshots and diffs',
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
        return (0, utils_1.findImages)(path, snapshotsDirName, '*.@(new|diff).png').then((files) => {
            const execDirLength = process.cwd().length;
            const filesOutput = files.map((x) => '.' + x.substring(execDirLength)).join('\n');
            return (0, utils_1.askForConfirmation)(`
New snapshots and diff images:          
${filesOutput}
Are you sure you want to remove them all?`).then((overwrite) => {
                if (overwrite) {
                    return Promise.all(files.map((x) => fs.unlink(x))).then(() => console.log('Success! New snapshots and diff images removed.'));
                }
                console.log('Command was discarded! No changes were made.');
                return Promise.resolve();
            });
        });
    },
};
//# sourceMappingURL=discard.js.map