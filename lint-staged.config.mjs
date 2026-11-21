// Pre-commit (D82): lint the staged files, and typecheck once when any TypeScript is staged.
// tsc can't check single files against the project's paths and Next's generated route types,
// so the function form runs the project typecheck once (incremental) instead of per file.
// Unit tests and e2e run in CI, not here.
export default {
  "*.{ts,tsx,js,mjs,cjs}": "eslint --no-warn-ignored",
  "*.{ts,tsx}": () => "npm run typecheck",
};
