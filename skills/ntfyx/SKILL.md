---
name: ntfyx
description: Send the user an end-to-end encrypted notification on their iPhone, or ask them a question and wait for a verified answer, using the ntfyx CLI. Use when long work finishes, when a job fails, or before an irreversible step (deploy, publish, delete, payment) that needs the user's explicit decision.
---

# Ntfyx: notify the user or ask before acting

`ntfyx` delivers encrypted messages to the user's iPhone (and an optional phone-authorized Web Inbox). Check that it is installed and connected with `ntfyx doctor` before relying on it. If it is missing, tell the user to install it from https://ntfyx.me/install.md. Do not install it yourself unless they asked you to.

## Notify when work finishes

```sh
ntfyx send "Tests passed on main" --title "CI finished"
```

Keep messages short and factual. Never include secrets, tokens, private keys or full logs.

## Ask before an irreversible step

```sh
ntfyx ask "Publish v1.2.0 to npm?" --allow-deny --wait 90s && npm publish
```

The synchronous `ask` verifies the signed answer and claims it once before exiting 0. Continue **only** on exit code 0.

| Exit code | Meaning | What to do |
| --- | --- | --- |
| 0 | Verified Allow, claim acquired | Continue with exactly the step you asked about |
| 10 | Denied | Stop and report the denial |
| 14 | Wait timed out | Stop; do not treat silence as approval |
| 15 | Already consumed | Stop; never rerun the step |
| 20–26 | Not connected, network or verification problem | Stop and tell the user |

Other question types:

```sh
ntfyx ask "Which environment?" --choice staging=Staging --choice production=Production --wait 90s --json
ntfyx ask "What should I check next?" --text --wait 120s --json
```

Never turn a timeout, cancellation or error into approval. An approval covers only the single action you described.

With the MCP server enabled, the same operations are available as the tools `ntfyx_send`, `ntfyx_ask`, `ntfyx_result` and `ntfyx_cancel`.
