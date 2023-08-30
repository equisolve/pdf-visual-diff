/// <reference types="node" />
import Jimp from 'jimp';
export type Pdf2PngOpts = Readonly<{
    scaleImage: boolean;
}>;
export declare function pdf2png(pdf: string | Buffer, options?: Partial<Pdf2PngOpts>): Promise<ReadonlyArray<Jimp>>;
export declare const writeImages: (outputImagePath: string, combinePages?: boolean) => (images: ReadonlyArray<Jimp>) => Promise<ReadonlyArray<Jimp>>;
