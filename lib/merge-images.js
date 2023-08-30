"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeImages = void 0;
const jimp_1 = __importDefault(require("jimp"));
const mergeImages = (imgs) => {
    let imgHeight = 0;
    const imgData = imgs.map((img) => {
        const res = { img, y: imgHeight };
        imgHeight += img.bitmap.height;
        return res;
    });
    const imgWidth = Math.max(...imgData.map(({ img }) => img.bitmap.width));
    const baseImage = new jimp_1.default(imgWidth, imgHeight, 0x00000000);
    imgData.forEach(({ img, y }) => baseImage.composite(img, 0, y));
    return baseImage;
};
exports.mergeImages = mergeImages;
//# sourceMappingURL=merge-images.js.map