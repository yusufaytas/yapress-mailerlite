import { readFile, writeFile } from "node:fs/promises";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const versionFile = new URL("../src/version.ts", import.meta.url);
const content = `export const PACKAGE_VERSION = "${packageJson.version}";\n`;

await writeFile(versionFile, content, "utf8");
