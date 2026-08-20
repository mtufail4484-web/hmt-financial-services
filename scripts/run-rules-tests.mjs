// Runs the Firestore emulator rules test suite and mirrors ALL output to
// ci-output.txt as it streams (crash-safe). Posting diagnostics is done by a
// separate script (post-diagnostics.mjs) invoked by the npm script even if
// this process crashes.
import { spawn, spawnSync } from "node:child_process";
import { appendFileSync, writeFileSync } from "node:fs";

const LOG = "ci-output.txt";
writeFileSync(LOG, "");

let output = "";
const emit = (text) => {
  output += text;
  try { appendFileSync(LOG, text); } catch { /* best effort */ }
  process.stdout.write(text);
};

process.on("uncaughtException", (e) => {
  emit(`\n[wrapper] UNCAUGHT EXCEPTION: ${e.stack || e}\n`);
  process.exit(99);
});
process.on("unhandledRejection", (e) => {
  emit(`\n[wrapper] UNHANDLED REJECTION: ${e?.stack || e}\n`);
  process.exit(98);
});

const firebaseBin = process.platform === "win32" ? "firebase.cmd" : "firebase";
emit(`[wrapper] node ${process.version}; firebase bin: ${firebaseBin}\n`);
try {
  const ver = spawnSync(firebaseBin, ["--version"], { encoding: "utf8", timeout: 30000 });
  emit(`[wrapper] firebase --version => ${JSON.stringify(ver.stdout || "")} err=${JSON.stringify(ver.stderr || "")} status=${ver.status}\n`);
} catch (e) {
  emit(`[wrapper] firebase --version threw: ${e.message}\n`);
}

// The inner command MUST be a single argv token, or the Firebase CLI parses
// "--test" as its own flag and exits immediately.
const args = [
  "emulators:exec",
  "--only", "firestore",
  "--project", "demo-hmt",
  "node --test tests/firestore.rules.test.mjs",
];

emit(`[wrapper] spawning: ${firebaseBin} ${JSON.stringify(args)}\n\n`);

const child = spawn(firebaseBin, args, { stdio: ["ignore", "pipe", "pipe"] });
child.stdout.on("data", (c) => emit(c.toString()));
child.stderr.on("data", (c) => emit(c.toString()));
child.on("error", (e) => emit(`\n[wrapper] spawn error: ${e.message}\n`));

const code = await new Promise((resolve) => {
  child.on("close", (c) => resolve(typeof c === "number" ? c : 99));
});

emit(`\n[wrapper] finished with exit code ${code}\n`);

// Make the failure visible on the Actions Summary page (no permissions needed).
if (code !== 0 && process.env.GITHUB_STEP_SUMMARY) {
  try {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `\n## ❌ Rules test run failed (exit ${code})\n\n\`\`\`\n${output.slice(-6000)}\n\`\`\`\n`
    );
  } catch { /* best effort */ }
}
process.exit(code);
