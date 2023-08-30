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
exports.writeImages = exports.pdf2png = void 0;
const Canvas = __importStar(require("canvas"));
const assert = __importStar(require("assert"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pdfjsLib = __importStar(require("pdfjs-dist/legacy/build/pdf"));
const jimp_1 = require("jimp");
const merge_images_1 = require("./merge-images");
function convertFromMmToPx(sizeMm, dpi) {
    if (sizeMm <= 0 || dpi <= 0) {
        return 0;
    }
    const sizeInch = sizeMm / 25.4;
    return Math.round(sizeInch * dpi);
}
function convertFromPxToMm(sizePx, dpi) {
    if (sizePx <= 0 || dpi <= 0) {
        return 0;
    }
    const sizeInch = sizePx / dpi;
    return Math.round(sizeInch * 25.4);
}
class NodeCanvasFactory {
    create(width, height) {
        assert.ok(width > 0 && height > 0, 'Invalid canvas size');
        const canvas = Canvas.createCanvas(width, height);
        const context = canvas.getContext('2d');
        return {
            canvas,
            context,
        };
    }
    reset(canvasAndContext, width, height) {
        assert.ok(canvasAndContext.canvas, 'Canvas is not specified');
        assert.ok(width > 0 && height > 0, 'Invalid canvas size');
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    }
    destroy(canvasAndContext) {
        assert.ok(canvasAndContext.canvas, 'Canvas is not specified');
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        canvasAndContext.canvas = null;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        canvasAndContext.context = null;
    }
}
// pdfjs location
const PDFJS_DIR = path.dirname(require.resolve('pdfjs-dist'));
// Some PDFs need external cmaps.
const CMAP_URL = path.join(PDFJS_DIR, '../cmaps/');
const CMAP_PACKED = true;
// Where the standard fonts are located.
const STANDARD_FONT_DATA_URL = path.join(PDFJS_DIR, '../standard_fonts/');
const pdf2PngDefOpts = {
    scaleImage: true,
};
function getPageViewPort(page, scaleImage) {
    const viewport = page.getViewport({ scale: 1.0 });
    if (scaleImage === false) {
        return viewport;
    }
    // Increase resolution
    const horizontalMm = convertFromPxToMm(viewport.width, 72);
    const verticalMm = convertFromPxToMm(viewport.height, 72);
    const actualWidth = convertFromMmToPx(horizontalMm, 144);
    const actualHeight = convertFromMmToPx(verticalMm, 144);
    const scale = Math.min(actualWidth / viewport.width, actualHeight / viewport.height);
    return page.getViewport({ scale });
}
async function pdf2png(pdf, options = {}) {
    const opts = Object.assign(Object.assign({}, pdf2PngDefOpts), options);
    // Load PDF
    const data = new Uint8Array(Buffer.isBuffer(pdf) ? pdf : fs.readFileSync(pdf));
    const loadingTask = pdfjsLib.getDocument({
        data,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
        standardFontDataUrl: STANDARD_FONT_DATA_URL,
    });
    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    const canvasFactory = new NodeCanvasFactory();
    const canvasAndContext = canvasFactory.create(1, 1);
    // Generate images
    const images = [];
    for (let idx = 1; idx <= numPages; idx += 1) {
        const page = await pdfDocument.getPage(idx);
        const viewport = getPageViewPort(page, opts.scaleImage);
        canvasFactory.reset(canvasAndContext, viewport.width, viewport.height);
        // TODO: fix types
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await page.render({ canvasContext: canvasAndContext.context, viewport }).promise;
        page.cleanup();
        const image = canvasAndContext.canvas.toBuffer('image/png');
        images.push(image);
    }
    return Promise.all(images.map((x) => (0, jimp_1.read)(x)));
}
exports.pdf2png = pdf2png;
const writeImages = (outputImagePath, combinePages = true) => (images) => {
    if (combinePages === true) {
        return (0, merge_images_1.mergeImages)(images)
            .writeAsync(outputImagePath)
            .then(() => images);
    }
    const parsedPath = path.parse(outputImagePath);
    const partialName = path.join(parsedPath.dir, parsedPath.name);
    const padMaxLen = images.length.toString().length;
    return Promise.all(images.map((img, idx) => img.writeAsync(`${partialName}_${String(idx + 1).padStart(padMaxLen, '0')}.png`))).then(() => images);
};
exports.writeImages = writeImages;
//# sourceMappingURL=pdf2png.js.map