// pre-push guard (D74): `main` is the last approved state and only changes through a pull
// request at the end of a phase. Git passes one line per ref on stdin:
//   <local ref> <local sha> <remote ref> <remote sha>
// Any update or deletion of refs/heads/main is refused. The end-of-phase merge is the one
// exception: `git push --no-verify`, and only after the user approves that merge.
import { readFileSync } from "node:fs";

const PROTECTED = "refs/heads/main";

let input = "";
try {
  input = readFileSync(0, "utf8");
} catch {
  // No stdin (nothing to push): nothing to check.
}

const blocked = input
  .split("\n")
  .map((line) => line.trim().split(/\s+/))
  .some(([, , remoteRef]) => remoteRef === PROTECTED);

if (blocked) {
  console.error(`
  Push to main refused (pre-push guard, D74).

  main changes only through a pull request at the end of a phase:
    1. push the phase branch:   git push origin <phase-branch>
    2. open the PR into main:   gh pr create --base main
    3. merge it once the user approves.

  Bypass (only for a merge the user has approved): git push --no-verify ...
`);
  process.exit(1);
}
