"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jimp_1 = require("jimp");
const compare_pdf_to_snapshot_1 = require("./compare-pdf-to-snapshot");
const path_1 = require("path");
const chai_1 = require("chai");
const fs_1 = require("fs");
const compare_images_1 = require("./compare-images");
const fs_2 = __importDefault(require("fs"));
const fs = fs_2.default.promises;
const testDataDir = (0, path_1.join)(__dirname, './test-data');
const pdfs = (0, path_1.join)(testDataDir, 'pdfs');
const singlePageSmallPdfPath = (0, path_1.join)(pdfs, 'single-page-small.pdf');
const singlePagePdfPath = (0, path_1.join)(pdfs, 'single-page.pdf');
const twoPagePdfPath = (0, path_1.join)(pdfs, 'two-page.pdf');
describe('comparePdfToSnapshot()', () => {
    it('should create new snapshot, when one does not exists', () => {
        const snapshotName = 'single-page-small';
        const snapshotPath = (0, path_1.join)(__dirname, compare_pdf_to_snapshot_1.snapshotsDirName, snapshotName + '.png');
        if ((0, fs_1.existsSync)(snapshotPath)) {
            (0, fs_1.unlinkSync)(snapshotPath);
        }
        return (0, compare_pdf_to_snapshot_1.comparePdfToSnapshot)(singlePageSmallPdfPath, __dirname, snapshotName).then((x) => {
            (0, chai_1.expect)(x).to.be.true;
            (0, chai_1.expect)((0, fs_1.existsSync)(snapshotPath)).to.be.true;
            (0, fs_1.unlinkSync)(snapshotPath);
        });
    });
    it('should fail and create diff with new version', () => (0, compare_pdf_to_snapshot_1.comparePdfToSnapshot)(singlePagePdfPath, __dirname, 'two-page').then((x) => {
        (0, chai_1.expect)(x).to.be.false;
        const snapshotDiffPath = (0, path_1.join)(__dirname, compare_pdf_to_snapshot_1.snapshotsDirName, 'two-page.diff.png');
        (0, chai_1.expect)((0, fs_1.existsSync)(snapshotDiffPath)).to.eq(true, 'diff is not created');
        const snapshotNewPath = (0, path_1.join)(__dirname, compare_pdf_to_snapshot_1.snapshotsDirName, 'two-page.new.png');
        (0, chai_1.expect)((0, fs_1.existsSync)(snapshotNewPath)).to.eq(true, 'new is not created');
    }));
    describe('should pass', () => {
        it('should pass', () => (0, compare_pdf_to_snapshot_1.comparePdfToSnapshot)(twoPagePdfPath, __dirname, 'two-page-success').then((x) => (0, chai_1.expect)(x).to.be.true));
        const testDataDir = (0, path_1.join)(__dirname, './test-data');
        const pdfs = (0, path_1.join)(testDataDir, 'pdfs');
        const singlePageSmall = (0, path_1.join)(pdfs, 'single-page-small.pdf');
        const singlePage = (0, path_1.join)(pdfs, 'single-page.pdf');
        const tamReview = (0, path_1.join)(pdfs, 'TAMReview.pdf');
        const twoPage = (0, path_1.join)(pdfs, 'two-page.pdf');
        const expectedDir = (0, path_1.join)(testDataDir, 'pdf2png-expected');
        const testPdf2png = (pdf, expectedImageName) => {
            return (0, compare_pdf_to_snapshot_1.comparePdfToSnapshot)(pdf, expectedDir, expectedImageName).then((x) => {
                (0, chai_1.expect)(x).to.be.true;
            });
        };
        it('single-page-small.pdf', () => testPdf2png(singlePageSmall, 'single-page-small'));
        it('single-page.pdf', () => testPdf2png(singlePage, 'single-page'));
        it('TAMReview.pdf', () => testPdf2png(tamReview, 'TAMReview')).timeout(40000);
        it('two-page.pdf', () => testPdf2png(twoPage, 'two-page'));
        it('two-page.pdf buffer', () => fs.readFile(twoPage).then((x) => testPdf2png(x, 'two-page')));
    });
    describe('maskRegions', () => {
        const blueMask = {
            type: 'rectangle-mask',
            x: 50,
            y: 75,
            width: 140,
            height: 100,
            color: 'Blue',
        };
        const greenMask = {
            type: 'rectangle-mask',
            x: 110,
            y: 200,
            width: 90,
            height: 50,
            color: 'Green',
        };
        const opts = {
            maskRegions: () => [blueMask, greenMask],
        };
        it('should succeed comparing masked pdf', () => (0, compare_pdf_to_snapshot_1.comparePdfToSnapshot)(singlePagePdfPath, __dirname, 'mask-rectangle-masks', opts).then((x) => (0, chai_1.expect)(x).to.be.true));
        it('should mask multi page pdf', () => (0, compare_pdf_to_snapshot_1.comparePdfToSnapshot)(twoPagePdfPath, __dirname, 'mask-multi-page-pdf', opts).then((x) => (0, chai_1.expect)(x).to.be.true));
        it('should have different mask per page', () => (0, compare_pdf_to_snapshot_1.comparePdfToSnapshot)(twoPagePdfPath, __dirname, 'mask-different-mask-per-page', {
            maskRegions: (page) => {
                switch (page) {
                    case 1:
                        return [blueMask];
                    case 2:
                        return [greenMask];
                    default:
                        return [];
                }
            },
        }).then((x) => (0, chai_1.expect)(x).to.be.true));
        it('should mask only second page of the pdf', () => (0, compare_pdf_to_snapshot_1.comparePdfToSnapshot)(twoPagePdfPath, __dirname, 'mask-only-second-page-of-the-pdf', {
            maskRegions: (page) => (page === 2 ? [blueMask, greenMask] : []),
        }).then((x) => (0, chai_1.expect)(x).to.be.true));
        it('should mask only second page of the pdf and handle undefined masks', () => (0, compare_pdf_to_snapshot_1.comparePdfToSnapshot)(twoPagePdfPath, __dirname, 'mask-only-second-page-of-the-pdf-with-undefined', {
            maskRegions: (page) => (page === 2 ? [blueMask, greenMask] : undefined),
        }).then((x) => (0, chai_1.expect)(x).to.be.true));
        it('should create initial masked image', () => {
            const snapshotName = 'initial-rectangle-masks';
            const snapshotPath = (0, path_1.join)(__dirname, compare_pdf_to_snapshot_1.snapshotsDirName, snapshotName + '.png');
            const expectedImagePath = (0, path_1.join)(__dirname, './test-data', 'expected-initial-rectangle-masks.png');
            if ((0, fs_1.existsSync)(snapshotPath)) {
                (0, fs_1.unlinkSync)(snapshotPath);
            }
            return (0, compare_pdf_to_snapshot_1.comparePdfToSnapshot)(singlePagePdfPath, __dirname, snapshotName, opts)
                .then((x) => (0, chai_1.expect)(x).to.be.true)
                .then(() => (0, jimp_1.read)(snapshotPath))
                .then((img) => (0, compare_images_1.compareImages)(expectedImagePath, [img], { tolerance: 0 }).then((x) => (0, chai_1.expect)(x.equal).to.eq(true, 'generated initial rectangle masks does not match expected one')))
                .then(() => (0, fs_1.unlinkSync)(snapshotPath));
        });
    });
});
//# sourceMappingURL=compare-pdf-to-snapshot.spec.js.map