#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const approve_1 = require("./approve");
const discard_1 = require("./discard");
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).command(approve_1.approve).command(discard_1.discard).demandCommand().parse();
//# sourceMappingURL=index.js.map