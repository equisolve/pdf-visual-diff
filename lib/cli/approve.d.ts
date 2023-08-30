#!/usr/bin/env node
import { CommandModule } from 'yargs';
type Arguments = {
    [x: string]: unknown;
    path: string;
    snapshotsDirName: string;
};
export declare const approve: CommandModule<unknown, Arguments>;
export {};
