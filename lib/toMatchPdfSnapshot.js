"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const compare_pdf_to_snapshot_1 = require("./compare-pdf-to-snapshot");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const jestExpect = global.expect;
if (jestExpect !== undefined) {
    jestExpect.extend({
        // TODO: use jest snapshot functionality
        toMatchPdfSnapshot(pdf, opts) {
            const { isNot, testPath, currentTestName } = this;
            if (isNot) {
                throw new Error('Jest: `.not` cannot be used with `.toMatchPdfSnapshot()`.');
            }
            const currentDirectory = (0, path_1.dirname)(testPath);
            const snapshotName = currentTestName.split(' ').join('_');
            return (0, compare_pdf_to_snapshot_1.comparePdfToSnapshot)(pdf, currentDirectory, snapshotName, opts).then((pass) => ({
                pass,
                message: () => 'Does not match with snapshot.',
            }));
        },
    });
}
else {
    console.error("Unable to find Jest's global expect." +
        '\nPlease check you have added toMatchPdfSnapshot correctly to your jest configuration.');
}
//# sourceMappingURL=toMatchPdfSnapshot.js.map