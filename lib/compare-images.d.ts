import Jimp from 'jimp';
export declare const mkDiffPath: (path: string) => string;
export type HighlightColor = 'Red' | 'Green' | 'Blue' | 'White' | 'Cyan' | 'Magenta' | 'Yellow' | 'Black' | 'Gray';
export type CompareImagesOpts = {
    tolerance: number;
};
type CompareOK = {
    equal: true;
};
type CompareKO = {
    equal: false;
    diffs: ReadonlyArray<{
        page: number;
        diff: Jimp;
    }>;
};
type CompareImagesResult = CompareOK | CompareKO;
export declare const compareImages: (expectedImagePath: string, images: ReadonlyArray<Jimp>, compareImagesOpts?: Partial<CompareImagesOpts>) => Promise<CompareImagesResult>;
export {};
