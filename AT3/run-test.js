#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const driver = require("./dist/abw-at3-drv-src.js");
const examples = JSON.parse(fs.readFileSync(path.join(__dirname, "examples.json"), "utf8"));

function toByteArray(bytes) {
    if (typeof bytes === "string") {
        return Array.from(Buffer.from(bytes, "hex"));
    }
    return bytes;
}

function removeEmpty(obj) {
    if (obj === null || obj === undefined || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(removeEmpty).filter(v => v !== null && v !== undefined);
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v === null || v === undefined) continue;
        if (typeof v === "number" && isNaN(v)) continue;
        result[k] = removeEmpty(v);
    }
    return result;
}

let passed = 0;
let failed = 0;
const failures = [];

for (const example of examples) {
    const { description, type, input, output } = example;
    try {
        let result;

        if (type === "uplink") {
            if (example.useContext) {
                global.context = input.context ?? [];
            }
            result = driver.decodeUplink({
                bytes: toByteArray(input.bytes),
                fPort: input.fPort,
                recvTime: input.recvTime
            });
        } else if (type === "downlink-decode") {
            result = driver.decodeDownlink({
                bytes: toByteArray(input.bytes),
                fPort: input.fPort,
                recvTime: input.recvTime
            });
        } else if (type === "downlink-encode") {
            result = driver.encodeDownlink({ data: input.data });
            if (result.bytes) result.bytes = toByteArray(result.bytes);
            if (output.bytes) output.bytes = toByteArray(output.bytes);
        } else {
            continue;
        }

        assert.deepStrictEqual(removeEmpty(result), removeEmpty(output));
        passed++;
        process.stdout.write(".");
    } catch (err) {
        failed++;
        failures.push({ description, type, error: err.message });
        process.stdout.write("F");
    }
}

console.log(`\n\n${passed + failed} tests: ${passed} passed, ${failed} failed`);

if (failures.length > 0) {
    console.log("\nFailures:");
    for (const f of failures) {
        console.log(`  [${f.type}] ${f.description}`);
        console.log(`    ${f.error.split("\n")[0]}`);
    }
    process.exit(1);
}
