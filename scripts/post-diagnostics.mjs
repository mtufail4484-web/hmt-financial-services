// Commits ci-output.txt as ci-diagnostics/last-failure.txt on the branch and
// pushes with the workflow's GITHUB_TOKEN (git = the most reliable write path
// for GITHUB_TOKEN with `permissions: contents: write`).
// Runs after the test script regardless of how it exited; always exits 0.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";

const code = process.argv[2] ?? "?";
const inCI = process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY && process.env.GITHUB_SHA;

if (code === "0" || !inCI) {
  if (!inCI) console.log("[post-diagnostics] not in CI; nothing to do");
  process.exit(0);
}

const repo = process.env.GITHUB_REPOSITORY;
const branch = "arena/01a01cbb-hmt-financial-services";
const runUrl = `${process.env.GITHUB_SERVER_URL ?? "https://github.com"}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID ?? "?"}`;

const output = existsSync("ci-output.txt") ? readFileSync("ci-output.txt", "utf8") : "(ci-output.txt missing)";
const header =
  `Rules test failure @ ${new Date().toISOString()}\n` +
  `run: ${runUrl}\ncommit: ${process.env.GITHUB_SHA}\nexit: ${code}\n\n` +
  `==== full captured output ====\n`;

const run = (cmd) => execSync(cmd, { stdio: ["ignore", "ignore", "pipe"] }).toString();

try {
  rmSync("ci-diagnostics", { recursive: true, force: true });
  mkdirSync("ci-diagnostics", { recursive: true });
  writeFileSync("ci-diagnostics/last-failure.txt", header + output.slice(-14000) + "\n");

  run('git config user.name "github-actions[bot]"');
  run('git config user.email "41898282+github-actions[bot]@users.noreply.github.com"');
  run("git add ci-diagnostics/last-failure.txt");
  const committed = (() => {
    try {
      run(`git commit -m "ci: diagnostics for failed rules run (exit ${code}) [skip ci]"`);
      return true;
    } catch {
      return false; // nothing new to commit
    }
  })();
  if (committed || process.env.FORCE_DIAG_PUSH === "1") {
    const token = process.env.GITHUB_TOKEN;
    const pushUrl = `https://x-access-token:${token}@github.com/${repo}.git`;
    try {
      run(`git push "${pushUrl}" HEAD:refs/heads/${branch}`);
      console.log("[post-diagnostics] pushed ci-diagnostics/last-failure.txt");
    } catch (e) {
      console.log(`[post-diagnostics] push failed: ${String(e.stderr || e.message).replaceAll(token ?? "???", "***")}`);
    }
  } else {
    console.log("[post-diagnostics] nothing new to commit");
  }
} catch (e) {
  console.log(`[post-diagnostics] error: ${e.message}`);
}
process.exit(0);
