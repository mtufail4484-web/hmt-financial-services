// Wrapper around the Firestore emulator rules test suite.
// - Runs the exact same command as before:
//     firebase emulators:exec --only firestore --project demo-hmt \
//       "node --test tests/firestore.rules.test.mjs"
// - Streams all output live.
// - On failure INSIDE GitHub Actions, posts the output tail as a commit
//   comment (via api.github.com) so results are readable even where the
//   Actions log host is unreachable. No-op locally (no GITHUB_TOKEN).
import { spawn } from "node:child_process";

const firebaseBin = process.platform === "win32" ? "firebase.cmd" : "firebase";
const args = [
  "emulators:exec",
  "--only", "firestore",
  "--project", "demo-hmt",
  "node", "--test", "tests/firestore.rules.test.mjs",
];

const child = spawn(firebaseBin, args, { stdio: ["ignore", "pipe", "pipe"] });
let output = "";
const stamp = (chunk) => {
  const text = chunk.toString();
  output += text;
  if (output.length > 200_000) output = output.slice(-100_000);
  process.stdout.write(text);
};
child.stdout.on("data", stamp);
child.stderr.on("data", stamp);

const code = await new Promise((resolve) => child.on("close", resolve));

if (code !== 0 && process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY && process.env.GITHUB_SHA) {
  const tail = output.slice(-6000) || "(no output captured)";
  const body = {
    body:
      "### ❌ Firestore rules test run failed (exit " + code + ")\n" +
      "Output tail:\n```\n" + tail + "\n```",
  };
  try {
    const res = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/commits/${process.env.GITHUB_SHA}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) console.error(`(could not post diagnostics comment: ${res.status})`);
    else console.log("(posted failure diagnostics as a commit comment)");
  } catch (e) {
    console.error(`(could not post diagnostics comment: ${e.message})`);
  }
}

process.exit(code);
