# Ntfyx guided installation / 让 Agent 带你完成安装

**Give this file to your coding agent:** “Follow this guide to set up Ntfyx and connect my phone. Do the computer steps for me and walk me through the phone steps.”

**把这个链接发给 Agent：**“请按这份教程帮我安装 Ntfyx 并连接手机。电脑上的步骤你来做，手机上需要我操作时，一步步告诉我点哪里。最后发一条通知和一道测试题，确认你收到了我的手机回复。”

https://github.com/KaylaONeal/ntfyx-agent-plugins/blob/main/install.md

## Instructions for the agent

Guide the user in their language from their current state to a verified phone reply. Do the available computer steps within their setup request. Give one short phone action at a time, including what the user should see next; continue after checking its result. Do not send them away to search documentation or dump this whole guide into chat. Start with the app download links while checking the computer.

Plugin installation adds agent tools and instructions; it does not install the companion CLI or connect a phone. Plugin 0.4.1 and CLI 0.6.0 are independently versioned. The phone app must be 1.8.0 or later. Identify the current host from the conversation/environment; configure only that host unless the user requests both. If the target is unclear, ask that single question in this chat and continue checking prerequisites.

Keep setup instructions in the current chat until the phone connection works. Do not try to ask an unpaired phone how to finish pairing. Preserve existing phone identities, configuration paths and Topics. A Topic is a message channel; a Session groups one task's updates and questions inside it.

## 1. Download and open the phone app

Give these clickable links before asking the user to scan anything:

- iPhone: [Ntfyx on the App Store](https://apps.apple.com/app/id6817353404).
- Android: [Ntfyx on Google Play](https://play.google.com/store/apps/details?id=me.ntfyx.app).
- [All downloads](https://ntfyx.me/download/) / [中文下载页](https://ntfyx.me/zh/download/).

Ask the user to open the app, finish its welcome screens and allow notifications if they want background alerts. Wait until they can see the Inbox before asking them to scan. A Web Inbox is an additional receiver authorized by the phone; it does not replace this first phone setup. If a store cannot provide the app in their region, report that blocker instead of continuing to a QR they cannot scan.

## 2. Check the computer

Use `command -v ntfyx`, then `ntfyx version --json` if present. CLI 0.6.0 or later is required. Install a missing CLI with the signed official installer:

```sh
curl -fsSL https://ntfyx.me/install.sh | bash
export PATH="$HOME/.local/bin:$PATH"
ntfyx version --json
```

If an older CLI is present, use `ntfyx upgrade` within the user's setup request, after any existing pending questions finish. Do not overwrite a managed or pinned installation. Expected result: `ntfyx version --json` reports 0.6.0 or later. If the installer succeeded but the command is missing, use the printed installation path or fix PATH in this agent's process; do not repeatedly reinstall it.

On Windows, read the [Windows CLI/MCP setup guide](https://ntfyx.me/install/) yourself and carry out its applicable steps; this marketplace package uses POSIX shell hooks. Do not run its shell commands in PowerShell or claim native hook support. A cloud-only chat cannot run this computer's local MCP server: explain that limitation and give the user the exact command for their local terminal.

## 3. Install or reuse the agent integration

For Codex, inspect `codex plugin list --json`; for Claude Code, inspect `claude plugin list --json`. Check whether the Ntfyx plugin is already installed and enabled. If the host instead already uses direct `ntfyx setup` integration, keep that method and its existing configuration. Do not install both methods on the same host, add `--agent` to the installer above, or remove working custom settings. Plugin installation provides MCP, hooks and skills together.

For a fresh marketplace installation, run only the commands for the requested host:

```sh
# Codex
codex plugin marketplace add KaylaONeal/ntfyx-agent-plugins
codex plugin add ntfyx@ntfyx

# Claude Code
claude plugin marketplace add KaylaONeal/ntfyx-agent-plugins
claude plugin install ntfyx@ntfyx
```

`marketplace add` registers a source; the second command installs the plugin. If the marketplace already exists, reuse it. To refresh an older installed plugin:

```sh
# Codex
codex plugin marketplace upgrade ntfyx
codex plugin add ntfyx@ntfyx

# Claude Code
claude plugin marketplace update ntfyx
claude plugin update ntfyx@ntfyx
```

Recheck the installed version. If an old version remains, inspect the selected marketplace and installed entry; do not delete phone credentials or silently report success. The CLI version is independent: `ntfyx version` does not report the plugin version. Host permission or hook-trust prompts still belong to the user.

Expected result: one enabled Ntfyx integration for the intended host. Continue to pairing before asking for a restart. If already paired, skip directly to verification after the restart.

## 4. Pair the phone

Run `ntfyx doctor --json`. If `paired` is true and the service/roster checks succeed, reuse that connection. If a paired connection has a network or verification error, diagnose that error; do not delete credentials or create a replacement identity.

For an unpaired CLI, run `ntfyx connect` in an interactive terminal and keep it running while the user scans. Keep the tool session alive and poll it; the first output is a QR, not a completed connection. If the agent cannot display an interactive terminal or local QR page, give the user `ntfyx connect` to run in their own terminal and continue guiding them here. Explain the phone steps one at a time:

1. In Ntfyx, open **Add Topic (+) → Connect private Topic → Scan connection code**. Chinese labels include **添加 Topic → 连接私有 Topic / 连接私密 Topic**. For an existing private Topic, open its settings and choose **Connect private Topic**.
2. Scan the QR on this computer. If the terminal cannot display it, open the private local `file://…/connect.html` page printed by the command on that same computer. `ntfyx connect --qr file` explicitly selects this display mode.
3. Review the computer/source name and connection permissions. Name a new private Topic or use the existing one, then confirm/save in the app. Wait for the terminal's connection result before closing it.

Phone questions need a private/protected Topic. A public Topic ID, subscription or HTTP push URL is not this pairing flow and cannot carry verified replies. The QR expires in five minutes. If a pairing result is uncertain or reports `connection_saved` with a `resume_id`, follow that command's recovery instructions and retain the original connection; a timeout alone does not justify another identity.

The user authorizes the connection on their phone. Never upload the QR, pairing URL, credentials or local QR file to a sharing site, issue, log or remote QR renderer. On a remote machine, explain that its local file is not on the user's desktop; use the interactive terminal's QR rather than publishing it.

Expected result: the CLI reports a completed connection, and `ntfyx doctor --json` reports `paired: true` with successful service and roster checks. `already_connected` means reuse and check the existing pairing; it is not evidence of phone delivery. Do not print raw local configuration or private keys to prove it.

## 5. Reload the host and verify notification and reply

Ask the user to restart the agent so it can find the newly installed CLI and load the plugin's MCP server. Give them this exact resume prompt: **“Continue Ntfyx setup: check the existing connection, send a test notification, then ask me a test question and wait for my phone reply.”** / **“继续 Ntfyx 设置：检查已有连接，发一条测试通知，再问我一道测试题并等待手机回复。”**

In a Codex version that offers plugin setup, its Ntfyx setup entry loads the bundled walkthrough. Otherwise the resume prompt works in Codex and Claude Code; Claude Code also exposes `/ntfyx:setup`. Review Codex `/hooks` for optional native execution-approval and completion hooks; keep its permission policies intact. If MCP still cannot find `ntfyx`, fix the agent process's PATH and restart it. Do not add duplicate direct-setup hooks to solve a PATH issue. If MCP cannot be loaded in this session, verify the CLI path and clearly leave agent-tool verification pending.

Use one unique Session ID for this setup attempt. Send one harmless test notification through `ntfyx_send` or `ntfyx send`, then tell the user to open that message in the app. A service acknowledgement does not prove the phone displayed a notification. If it appears in the Inbox but no background alert appeared, check the phone's notification permission and quiet/Focus settings; do not repeat pairing.

Send one text question such as “Reply with any short word to test the phone connection. This does not authorize an action.” Prefer `ntfyx_ask` with `type: "text"`, the same `session_id`, and `wait_seconds: 45`. If pending, retain the returned `request_id` and call `ntfyx_result` with `consume: true` and `wait_seconds: 45`. Continue waiting on that request; do not create another test question on each poll.

Without MCP, the user can run:

```sh
ntfyx ask "Reply with any short word to test this connection." --text --wait 120s --json
```

The synchronous CLI verifies and claims the answer. For MCP, require `status: "answered"` and `consumption.claim_acquired: true`. Echo the actual answer in the agent chat. Pending, timeout, cancellation, denied or already-consumed results are not success. Never use a sample answer as proof. If the user answers locally instead, cancel the pending phone request and keep phone-reply verification marked incomplete.

## 6. Show how to use it

Give two examples in the user's language:

- “Send me a Ntfyx notification when the tests finish.” / “测试完成后，用 Ntfyx 通知我。”
- “Use Ntfyx for questions that need my decision; keep explanations in this chat.” / “需要我选择或补充信息时，用 Ntfyx 问我；解释留在当前对话。”

Codex must use explicit Ntfyx MCP/CLI questions; its native `request_user_input` and `request_user_input_async` are not forwarded by permission hooks. Claude Code also has the existing `AskUserQuestion` bridge; do not duplicate a question already handled by that bridge. Phone replies return to an active waiting call; they do not start a new agent session or grant remote-shell access.

Finish by distinguishing what was actually verified: CLI ready, phone paired, agent tools loaded, notification seen, and signed reply returned. Quote the actual test answer when verified. If a step remains pending, give its next action instead of calling setup complete. Repository guides: [English](README.md) · [中文](README.zh-CN.md).
