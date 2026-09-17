import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const js = await readFile(new URL("../app.js", import.meta.url), "utf8");

assert.match(html, /SELF-BUILT DEMO/);
assert.match(html, /SAMPLE DATA/);
assert.match(html, /HUMAN REVIEW REQUIRED/);
assert.match(html, /No customer data/i);
assert.match(js, /data-panel/);
assert.doesNotMatch(html, /customer\.com|gmail\.com|wechat|微信号/i);

console.log("AI CRM demo smoke checks passed.");
