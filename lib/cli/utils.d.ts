export declare const mkCurrentSnapshotPath: (newSnapshotPath: string) => string;
export declare const mkDiffSnapshotPath: (newSnapshotPath: string) => string;
export declare const askForConfirmation: (question: string) => Promise<boolean>;
export declare const findImages: (startingPath?: string, snapshotsDirName?: string, filenamePatter?: string) => Promise<ReadonlyArray<string>>;
