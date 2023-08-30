"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compare_images_1 = require("./compare-images");
const chai_1 = require("chai");
const path_1 = require("path");
const fs_1 = require("fs");
const jimp_1 = require("jimp");
describe('mkDiffPath()', () => {
    it('should mk path with extension', () => (0, chai_1.expect)((0, compare_images_1.mkDiffPath)('some-path.ext')).to.equal('some-path.diff.ext'));
    it('should mk path with extension when starts with .', () => (0, chai_1.expect)((0, compare_images_1.mkDiffPath)('./some-path.ext')).to.equal('./some-path.diff.ext'));
    it('should handle empty', () => (0, chai_1.expect)((0, compare_images_1.mkDiffPath)('')).to.equal('.diff'));
    it('should mk path without extension', () => (0, chai_1.expect)((0, compare_images_1.mkDiffPath)('some-path')).to.equal('some-path.diff'));
});
const expectedImageName = 'sample-image-expected.png';
const sampleImage = 'sample-image.png';
const sampleImage2 = 'sample-image-2.png';
const testDataDir = (0, path_1.join)(__dirname, './test-data');
const expectedImagePath = (0, path_1.join)(testDataDir, expectedImageName);
const imagePath = (0, path_1.join)(testDataDir, sampleImage);
const image2Path = (0, path_1.join)(testDataDir, sampleImage2);
describe('compareImages()', () => {
    it('should succeed comparing', () => (0, jimp_1.read)(imagePath)
        .then((img) => (0, compare_images_1.compareImages)(expectedImagePath, [img]))
        .then((x) => {
        (0, chai_1.expect)(x.equal).to.be.true;
        (0, chai_1.expect)((0, fs_1.existsSync)((0, compare_images_1.mkDiffPath)(imagePath))).to.eq(false, 'should not generate diff output');
    }));
    it('should fail comparing and output diff', () => (0, jimp_1.read)(image2Path)
        .then((img) => (0, compare_images_1.compareImages)(expectedImagePath, [img]))
        .then((x) => {
        (0, chai_1.expect)(x.equal).to.be.false;
        (0, chai_1.expect)(x).to.have.nested.property('diffs[0].diff');
        (0, chai_1.expect)(x).to.have.nested.property('diffs[0].page');
    }));
});
//# sourceMappingURL=compare-images.spec.js.map