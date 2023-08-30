"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePdfToSnapshot = exports.snapshotsDirName = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const pdf2png_1 = require("./pdf2png");
const compare_images_1 = require("./compare-images");
const jimp_1 = __importDefault(require("jimp"));
const colorToNum = {
    Red: 0xff0000ff,
    Green: 0x00ff00ff,
    Blue: 0x0000ffff,
    White: 0x00000000,
    Cyan: 0x00ffffff,
    Magenta: 0xff00ffff,
    Yellow: 0xffff00ff,
    Black: 0x000000ff,
    Gray: 0xbfbfbfff,
};
const maskImgWithRegions = (maskRegions) => (images) => {
    images.forEach((img, idx) => {
        ;
        (maskRegions(idx + 1) || []).forEach(({ type, x, y, width, height, color }) => {
            if (type === 'rectangle-mask') {
                img.composite(new jimp_1.default(width, height, colorToNum[color]), x, y);
            }
        });
    });
    return images;
};
exports.snapshotsDirName = '__snapshots__';
/**
 * Compare pdf to persisted snapshot. If one does not exist it is created
 * @param pdf - path to pdf file or pdf loaded as Buffer
 * @param snapshotDir - path to a directory where __snapshots__ folder is going to be created
 * @param snapshotName - uniq name of a snapshot in the above path
 * @param compareOptions - image comparison options
 * @param compareOptions.tolerance - number value for error tolerance, ranges 0-1 (default: 0)
 * @param compareOptions.maskRegions - `(page: number) => ReadonlyArray<RegionMask> | undefined` mask predefined regions per page, i.e. when there are parts of the pdf that change between tests
 */
const comparePdfToSnapshot = (pdf, snapshotDir, snapshotName, _a = {}) => {
    var { maskRegions = () => [] } = _a, restOpts = __rest(_a, ["maskRegions"]);
    const dir = (0, path_1.join)(snapshotDir, exports.snapshotsDirName);
    if (!(0, fs_1.existsSync)(dir)) {
        (0, fs_1.mkdirSync)(dir, { recursive: true });
    }
    const snapshotPath = (0, path_1.join)(dir, snapshotName + '.png');
    if (!(0, fs_1.existsSync)(snapshotPath)) {
        return (0, pdf2png_1.pdf2png)(pdf)
            .then(maskImgWithRegions(maskRegions))
            .then((0, pdf2png_1.writeImages)(snapshotPath))
            .then(() => true);
    }
    return (0, pdf2png_1.pdf2png)(pdf)
        .then(maskImgWithRegions(maskRegions))
        .then((images) => (0, compare_images_1.compareImages)(snapshotPath, images, restOpts).then((result) => {
        const diffSnapshotPath = (0, path_1.join)(dir, snapshotName + '.diff.png');
        if (result.equal) {
            if ((0, fs_1.existsSync)(diffSnapshotPath)) {
                (0, fs_1.unlinkSync)(diffSnapshotPath);
            }
            return true;
        }
        const newSnapshotPath = (0, path_1.join)(dir, snapshotName + '.new.png');
        return (0, pdf2png_1.writeImages)(newSnapshotPath)(images)
            .then(() => (0, pdf2png_1.writeImages)(diffSnapshotPath)(result.diffs.map((x) => x.diff)))
            .then(() => false);
    }));
};
exports.comparePdfToSnapshot = comparePdfToSnapshot;
//# sourceMappingURL=compare-pdf-to-snapshot.js.map