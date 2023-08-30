"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findImages = exports.askForConfirmation = exports.mkDiffSnapshotPath = exports.mkCurrentSnapshotPath = void 0;
const glob_1 = require("glob");
const path_1 = require("path");
const readline_1 = require("readline");
const suffixLen = '.new.png'.length;
const mkCurrentSnapshotPath = (newSnapshotPath) => newSnapshotPath.substring(0, newSnapshotPath.length - suffixLen) + '.png';
exports.mkCurrentSnapshotPath = mkCurrentSnapshotPath;
const mkDiffSnapshotPath = (newSnapshotPath) => newSnapshotPath.substring(0, newSnapshotPath.length - suffixLen) + '.diff.png';
exports.mkDiffSnapshotPath = mkDiffSnapshotPath;
const askForConfirmation = (question) => {
    const readline = (0, readline_1.createInterface)({ input: process.stdin, output: process.stdout });
    return new Promise((res) => {
        readline.question(question + ' [Y/n]: ', (answer) => {
            readline.close();
            const cleaned = answer.trim().toLocaleLowerCase();
            if (cleaned === '' || ['yes', 'y'].indexOf(cleaned) >= 0) {
                res(true);
            }
            else if (['no', 'n'].indexOf(cleaned) >= 0) {
                res(false);
            }
            else {
                process.stdout.write('\nInvalid Response. Please answer with yes(y) or no(n)\n\n');
                (0, exports.askForConfirmation)(question).then(res);
            }
        });
    });
};
exports.askForConfirmation = askForConfirmation;
const findImages = (startingPath = '.', snapshotsDirName = '__snapshots__', filenamePatter = '*.new.png') => {
    const pattern = (0, path_1.join)(process.cwd(), startingPath, '**', snapshotsDirName, filenamePatter);
    return (0, glob_1.glob)(pattern, {});
};
exports.findImages = findImages;
//# sourceMappingURL=utils.js.map