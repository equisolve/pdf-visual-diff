import { CompareImagesOpts } from './compare-images';
declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchPdfSnapshot(opts?: Partial<CompareImagesOpts>): R;
        }
    }
}
