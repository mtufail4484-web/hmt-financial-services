// Wrapper around the Firestore emulator rules test suite.
// - Runs: firebase emulators:exec --only firestore --project demo-hmt \
//           "node --test tests/firestore.rules.test.mjs"
//   (the inner command MUST be a single argv token, or the Firebase CLI
//    mistakes "--test" for its own flag and exits immediately)
// - On failure inside GitHub Actions, writes full diagnostics to
//   ci-diagnostics/last-failure.txt in this branch (via the contents API,
//   allowed by `permissions: contents: write`) so results are readable even
//   where the Actions log host is unreachable. No-op locally (no GITHUB_TOKEN).
import { spawn, spawnSync } from "node:child_process";

const firebaseBin = process.platform === "win32" ? "firebase.cmd" : "firebase";
const args = [
  "emulators:exec",
  "--only", "firestore",
  "--project", "demo-hmt",
  "node --test tests/firestore.rules.test.mjs", // single token on purpose
];

let output = "";
const emit = (text) => {
  output += text;
  if (output.length > 200_000) output = output.slice(-100_000);
  process.stdout.write(text);
};

emit(`[wrapper] firebase binary: ${firebaseBin}\n`);
const ver = spawnSync(firebaseBin, ["--version"], { encoding: "utf8" });
emit(`[wrapper] firebase version: ${ver.stdout?.trim() || ver.stderr?.trim() || "n/a"}\n`);
emit(`[wrapper] node: ${process.version}\n\n`);

const child = spawn(firebaseBin, args, { stdio: ["ignore", "pipe", "pipe"] });
child.stdout.on("data", (c) => emit(c.toString()));
child.stderr.on("data", (c) => emit(c.toString()));
child.on("error", (e) => emit(`\n[wrapper] spawn error: ${e.message}\n`));

const code = await new Promise((resolve) => {
  child.on("close", (c) => resolve(c ?? 99));
});

emit(`\n[wrapper] exited with code ${code}\n`);

const inCI = process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY && process.env.GITHUB_SHA;
if (code !== 0 && inCI) {
  const repo = process.env.GITHUB_REPOSITORY;
  const sha = process.env.GITHUB_SHA;
  const branch = "arena/01a01cbb-hmt-financial-services";
  const runUrl = `${process.env.GITHUB_SERVER_URL ?? "https://github.com"}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID ?? "?"}`;
  const content = Buffer.from(
    `Rules test failure @ ${new Date().toISOString()}\nrun: ${runUrl}\ncommit: ${sha}\nexit: ${code}\n\n==== output tail ====\n${output.slice(-14000)}\n`,
    "utf8"
  ).toString("base64");

  // Channel 1: commit comment (may be rejected; ignore result)
  try {
    await fetch(`https://api.github.com/repos/${repo}/commits/${sha}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: `### ❌ rules tests failed (exit ${code}) — see \`ci-diagnostics/last-failure.txt\`` }),
    });
  } catch { /* ignore */ }

  // Channel 2: write the diagnostics file into the branch (contents: write)
  try {
    const path = "ci-diagnostics/last-failure.txt";
    let fileSha;
    const cur = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
    });
    if (cur.ok) fileSha = (await cur.json()).sha;
    const put = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `ci: diagnostics for failed rules test run (exit ${code}) [skip ci]`,
        content,
        branch,
        ...(fileSha ? { sha: fileSha } : {}),
      }),
    });
    emit(`[wrapper] diagnostics file write: ${put.status}\n`);
  } catch (e) {
    emit(`[wrapper] diagnostics file write failed: ${e.message}\n`);
  }
}

process.exit(code);
