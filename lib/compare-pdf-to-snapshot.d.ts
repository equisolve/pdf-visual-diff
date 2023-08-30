/// <reference types="node" />
import { CompareImagesOpts, HighlightColor } from './compare-images';
export type RectangleMask = Readonly<{
    type: 'rectangle-mask';
    x: number;
    y: number;
    width: number;
    height: number;
    color: HighlightColor;
}>;
export type RegionMask = RectangleMask;
export type MaskRegions = (page: number) => ReadonlyArray<RegionMask> | undefined;
export type CompareOptions = CompareImagesOpts & {
    maskRegions: MaskRegions;
};
export declare const snapshotsDirName = "__snapshots__";
/**
 * Compare pdf to persisted snapshot. If one does not exist it is created
 * @param pdf - path to pdf file or pdf loaded as Buffer
 * @param snapshotDir - path to a directory where __snapshots__ folder is going to be created
 * @param snapshotName - uniq name of a snapshot in the above path
 * @param compareOptions - image comparison options
 * @param compareOptions.tolerance - number value for error tolerance, ranges 0-1 (default: 0)
 * @param compareOptions.maskRegions - `(page: number) => ReadonlyArray<RegionMask> | undefined` mask predefined regions per page, i.e. when there are parts of the pdf that change between tests
 */
export declare const comparePdfToSnapshot: (pdf: string | Buffer, snapshotDir: string, snapshotName: string, { maskRegions, ...restOpts }?: Partial<CompareOptions>) => Promise<boolean>;
