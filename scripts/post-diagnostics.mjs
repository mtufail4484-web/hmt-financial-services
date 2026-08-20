// Posts ci-output.txt as a commit comment AND ci-diagnostics/last-failure.txt
// in the branch (contents API). Runs after the test script regardless of how
// it exited. Always exits 0 so it never masks the original exit code.
import { readFileSync, existsSync } from "node:fs";

const code = process.argv[2] ?? "?";
const inCI = process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY && process.env.GITHUB_SHA;

if (code === "0" || !inCI) {
  if (!inCI) console.log("[post-diagnostics] not in CI; nothing to do");
  process.exit(0);
}

const repo = process.env.GITHUB_REPOSITORY;
const sha = process.env.GITHUB_SHA;
const branch = "arena/01a01cbb-hmt-financial-services";
const runUrl = `${process.env.GITHUB_SERVER_URL ?? "https://github.com"}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID ?? "?"}`;
const headers = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
};

const output = existsSync("ci-output.txt") ? readFileSync("ci-output.txt", "utf8") : "(ci-output.txt missing)";
const statuses = [];

// Channel 1: commit comment
try {
  const r = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}/comments`, {
    method: "POST",
    headers,
    body: JSON.stringify({ body: `### ❌ rules tests failed (exit ${code}) — diagnostics in ci-diagnostics/last-failure.txt` }),
  });
  statuses.push(`commit-comment: HTTP ${r.status}`);
} catch (e) {
  statuses.push(`commit-comment: ${e.message}`);
}

// Channel 2: write diagnostics file into the branch
const bodyText =
  `Rules test failure @ ${new Date().toISOString()}\n` +
  `run: ${runUrl}\ncommit: ${sha}\nexit: ${code}\n` +
  `post statuses: ${statuses.join(", ")}\n\n` +
  `==== full output ====\n${output.slice(-14000)}\n`;

try {
  const path = "ci-diagnostics/last-failure.txt";
  let fileSha;
  const cur = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`, { headers });
  if (cur.ok) fileSha = (await cur.json()).sha;
  const put = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `ci: diagnostics for failed rules run (exit ${code})`,
      content: Buffer.from(bodyText, "utf8").toString("base64"),
      branch,
      ...(fileSha ? { sha: fileSha } : {}),
    }),
  });
  statuses.push(`contents-put: HTTP ${put.status}`);
} catch (e) {
  statuses.push(`contents-put: ${e.message}`);
}

console.log(`[post-diagnostics] ${statuses.join(" | ")}`);
process.exit(0);
