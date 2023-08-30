"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const utils_1 = require("./utils");
const filePath = '/pdf-visual-diff/src/__snapshots__/two-page.new.png';
describe('cli utils', () => {
    it('mkCurrentSnapshotPath()', async () => (0, chai_1.expect)((0, utils_1.mkCurrentSnapshotPath)(filePath)).to.equal('/pdf-visual-diff/src/__snapshots__/two-page.png'));
    it('mkDiffSnapshotPath()', async () => (0, chai_1.expect)((0, utils_1.mkDiffSnapshotPath)(filePath)).to.equal('/pdf-visual-diff/src/__snapshots__/two-page.diff.png'));
});
//# sourceMappingURL=utils.spec.js.map