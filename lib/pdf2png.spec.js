"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const pdf2png_1 = require("./pdf2png");
const compare_images_1 = require("./compare-images");
const chai_1 = require("chai");
const testDataDir = (0, path_1.join)(__dirname, './test-data');
const pdfs = (0, path_1.join)(testDataDir, 'pdfs');
const twoPage = (0, path_1.join)(pdfs, 'two-page.pdf');
const cmaps = (0, path_1.join)(pdfs, 'cmaps.pdf');
const expectedDir = (0, path_1.join)(testDataDir, 'pdf2png-expected');
describe('pdf2png()', () => {
    it('two-page.pdf png per page and without scaling', () => {
        const expectedImage1Path = (0, path_1.join)(expectedDir, 'two-page_png_per_page_1.png');
        const expectedImage2Path = (0, path_1.join)(expectedDir, 'two-page_png_per_page_2.png');
        return (0, pdf2png_1.pdf2png)(twoPage, { scaleImage: false })
            .then((imgs) => Promise.all([
            (0, compare_images_1.compareImages)(expectedImage1Path, [imgs[0]]),
            (0, compare_images_1.compareImages)(expectedImage2Path, [imgs[1]]),
        ]))
            .then((results) => {
            results.forEach((x) => (0, chai_1.expect)(x.equal).to.be.true);
        });
    });
    it('pdf that requires cmaps', () => {
        const expectedImagePath = (0, path_1.join)(expectedDir, 'cmaps.png');
        return (0, pdf2png_1.pdf2png)(cmaps)
            .then((imgs) => (0, compare_images_1.compareImages)(expectedImagePath, imgs))
            .then((result) => (0, chai_1.expect)(result.equal).to.be.true);
    });
});
//# sourceMappingURL=pdf2png.spec.js.map