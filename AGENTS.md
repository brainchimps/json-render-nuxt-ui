# AGENTS.md

## Publishing Requires Explicit Approval

- Never run publish or release commands on behalf of the user unless the user explicitly asks for that exact command in the current request.
- Treat these as protected commands: `npm publish`, `pnpm publish`, `yarn publish`, `bun publish`, `changeset publish`, `semantic-release`, and any script that triggers publishing.
- Before any protected command, ask for confirmation and wait for a clear "yes, run it now".
- If prior messages allowed publishing, that permission does not carry over to later turns.
