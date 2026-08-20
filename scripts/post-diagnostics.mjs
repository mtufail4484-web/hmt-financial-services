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

// execSync helper — NOTE: with stdout ignored, execSync returns null, so we
// never call .toString() on the result (that bug killed the poster in CI).
const run = (cmd) => {
  execSync(cmd, { stdio: ["ignore", "ignore", "pipe"] });
};

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
    // Primary: plain origin push — actions/checkout has already stored the
    // job token as a git credential on the runner (no env var needed).
    // Fallback: explicit x-access-token URL if GITHUB_TOKEN is exported.
    try {
      run(`git push origin HEAD:refs/heads/${branch}`);
      console.log("[post-diagnostics] pushed ci-diagnostics/last-failure.txt (via origin)");
    } catch (e1) {
      const token = process.env.GITHUB_TOKEN;
      if (token) {
        try {
          const pushUrl = `https://x-access-token:${token}@github.com/${repo}.git`;
          run(`git push "${pushUrl}" HEAD:refs/heads/${branch}`);
          console.log("[post-diagnostics] pushed ci-diagnostics/last-failure.txt (via token URL)");
        } catch (e2) {
          console.log(`[post-diagnostics] push failed: ${String((e2.stderr || e2.message)).replaceAll(token, "***")}`);
        }
      } else {
        console.log(`[post-diagnostics] push failed: ${String(e1.stderr || e1.message).slice(0, 300)}`);
      }
    }
  } else {
    console.log("[post-diagnostics] nothing new to commit");
  }
} catch (e) {
  console.log(`[post-diagnostics] error: ${e.message}`);
}
process.exit(0);
