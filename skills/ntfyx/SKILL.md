---
name: ntfyx
description: Send encrypted notifications and collect verified phone replies with Ntfyx. Use for task completion, failures, clarification questions, choices, missing information, and decisions when the user has enabled phone replies. Respect an explicit request to answer in the current chat.
---

# Ntfyx phone replies

Ntfyx connects this computer to the user's iPhone or Android phone. Use the available `ntfyx_ask` MCP tool for questions that need the user's input: requirements, choices, missing information, and approvals that are actually needed. Preserve existing authorization; installing this plugin does not require asking again before every action. If the user chooses the current chat, use that channel.

Check `ntfyx doctor` when connection status is unknown. If not installed or paired, explain the prerequisite and link https://ntfyx.me/install/. The user must scan and authorize their own connection. Never upload pairing links or credentials. No cloud MCP endpoint is required: encryption and answer verification run locally.

## Ask and receive an answer

- Use `ntfyx_ask` with `type: "choice"` for buttons, `allow_text: true` for an alternative, `type: "text"` for free input, or `type: "confirm"` for a specific Allow/Deny decision. Include enough context in the original message.
- Set `wait_seconds` up to 45. If still pending, keep the same `request_id` and call `ntfyx_result` with `consume: true` and `wait_seconds: 45`. Do not create another question to retry a wait.
- Continue only after `status: "answered"` and `consumption.claim_acquired: true`; read the actual response. For confirmation, only `response.value: "allow"` permits the described action. A text or choice answer does not confer unrelated execution permission.
- Denial, expiration, cancellation, already-consumed results, verification errors and timeouts are not consent. Cancel a pending request with `ntfyx_cancel` when the user takes over locally. If the phone route fails, explain the failure before asking in the current chat.

CLI equivalents (CLI 0.1.3+):

```sh
ntfyx ask "Which environment?" --choice staging=Staging --choice production=Production --allow-text --wait 120s --json
ntfyx ask "What should I check next?" --text --wait 120s --json
ntfyx ask "Deploy this build to staging?" --allow-deny --wait 120s --json
```

Synchronous CLI ask verifies and claims the answer. Exit 0 means a completed answer (and Allow for a confirm); read choice/text from JSON. Exit 10 is Deny; 11–15 are expired/cancelled/replaced/timeout/consumed. Other nonzero exits are failures.

## Keep a task in one conversation

Pass the host's actual session ID as `session_id` to each send/ask and use a short task title as `session_name`. CLI: `--session-id ID --session-name NAME`. Retain it when resuming that session. If the host does not expose an ID, create one unique ID for this conversation and reuse it during this conversation; do not derive it from the working directory. Without an ID each message opens its own conversation. These tools do not export the host transcript or accept unsolicited remote commands.

## Completion notifications

Use `ntfyx_send` or `ntfyx send "Tests passed" --title "Build finished"` for an authorized completion/failure notification. Avoid a second completion notification if the host's Stop hook already sends it. Keep notifications factual and omit secrets and full logs.

## Native host behavior

Claude Code's plugin bridges `AskUserQuestion` through PreToolUse. Single-choice questions use buttons plus free text; multiple questions arrive in order; multiple selections currently use a text reply listing option numbers. When that native hook is handling a question, do not send a duplicate MCP question.

Codex uses these MCP tools for phone questions. Installing this plugin does not intercept Codex's native `request_user_input`. Native tool-execution approval hooks are separate and limited to the documented verified host/version/platform combinations. Review Codex hooks through `/hooks`; preserve sandbox and tool permission settings. Use either this plugin or `ntfyx setup` for a host, to avoid duplicate hooks.
