"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareImages = exports.mkDiffPath = void 0;
const jimp_1 = __importStar(require("jimp"));
const merge_images_1 = require("./merge-images");
const diffToken = '.diff';
const mkDiffPath = (path) => {
    const dotIndex = path.lastIndexOf('.');
    return dotIndex === -1
        ? path + diffToken
        : path.substring(0, dotIndex) + diffToken + path.substring(dotIndex);
};
exports.mkDiffPath = mkDiffPath;
const defaultOpts = {
    tolerance: 0,
};
const compareImages = async (expectedImagePath, images, compareImagesOpts = {}) => {
    const { tolerance } = Object.assign(Object.assign({}, defaultOpts), compareImagesOpts);
    const expectedImg = await (0, jimp_1.read)(expectedImagePath);
    // Multi image comparison not implemented!
    const img = (0, merge_images_1.mergeImages)(images);
    const diff = jimp_1.default.diff(expectedImg, img, tolerance);
    if (diff.percent > 0) {
        return {
            equal: false,
            diffs: [{ page: 1, diff: diff.image }],
        };
    }
    return { equal: true };
};
exports.compareImages = compareImages;
//# sourceMappingURL=compare-images.js.map