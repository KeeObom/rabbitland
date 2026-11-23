// Writes the customer email designs to /emails/*.html so they can be pasted
// into Resend → Templates. Run after editing lib/email-templates.js:
//   npm run emails:export
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// lib/*.js is written as an ES module for Next.js; copy it to .mjs so plain
// Node can import it whatever the Node version.
const src = new URL("../lib/email-templates.js", import.meta.url);
const tmp = join(tmpdir(), `email-templates-${Date.now()}.mjs`);
writeFileSync(tmp, readFileSync(src));
const { orderTemplate, trainingTemplate } = await import(pathToFileURL(tmp).href);

mkdirSync(new URL("../emails/", import.meta.url), { recursive: true });
for (const t of [orderTemplate, trainingTemplate]) {
  writeFileSync(new URL(`../emails/${t.alias}.html`, import.meta.url), t.html);
  console.log(`emails/${t.alias}.html\n  subject:   ${t.subject}\n  variables: ${t.variables.join(", ")}\n`);
}
