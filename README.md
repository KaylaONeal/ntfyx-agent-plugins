# Ntfyx for coding agents

End-to-end encrypted notifications and phone approvals for **Claude Code**, **Codex** and **pi**. When your agent finishes a turn you get a notification on your iPhone. When it needs permission to run a command or change files, you tap **Allow** or **Deny** on the phone. The agent continues only after the sending computer has verified your signed answer.

This plugin calls the `ntfyx` CLI; it does not bundle or download a binary. Install the CLI and connect your iPhone first:

```sh
curl -fsSL https://ntfyx.me/install.sh | bash
ntfyx connect
```

Requires ntfyx CLI 0.1.2 or later. If `ntfyx` is not on your `PATH`, every hook exits quietly and the agent's own prompts stay in charge.

## Claude Code

```text
/plugin marketplace add KaylaONeal/ntfyx-agent-plugins
/plugin install ntfyx@ntfyx
```

Adds permission, notification, stop, tool-failure and session-end hooks, the `ntfyx` MCP server and an `ntfyx` skill. Phone approval covers Bash, Edit and Write from Claude Code 2.1.283 on Linux x64. Other platforms fall back to the terminal prompt.

## Codex

```sh
codex plugin marketplace add KaylaONeal/ntfyx-agent-plugins
codex plugin add ntfyx@ntfyx
```

Then open Codex and run `/hooks` to review and trust the two ntfyx hooks; Codex skips untrusted hooks. Phone approval covers shell commands (`Bash`) and file changes (`apply_patch`) from Codex 0.158 on Linux x64 in interactive sessions. `codex exec` turns approvals off, so it never asks.

### Codex usage and reset-credit alerts

```sh
ntfyx setup codex-usage          # systemd user timer (Linux) or LaunchAgent (macOS), every 15 minutes
ntfyx watch codex-usage --dry-run
```

Reads your usage through Codex's own local app-server, read-only. You get an alert when a new rate-limit reset credit arrives, 3 days and 24 hours before an unused credit expires, when usage reaches 80% and 95%, when a well-used window resets, and when you hit the limit or can use Codex again. Only the alert text is encrypted and sent; your Codex login never leaves your computer.

## pi

```sh
pi install git:github.com/KaylaONeal/ntfyx-agent-plugins
```

Registers the `ntfyx` MCP tools, adds the skill and sends a notification when a turn ends. Phone approval for bash is opt-in:

```sh
NTFYX_PI_APPROVAL=risky pi   # ask before rm -rf, sudo, git push, publish, deploy …
NTFYX_PI_APPROVAL=bash pi    # ask before every bash command
```

## Other agents

`plugin.json` and `mcp.json` at the root follow Agent Plugins 1.0, so clients that read that format (Cursor, GitHub Copilot, Kiro, VS Code) can load the skill and MCP server. They get no hooks and no native approval. Any agent that can run a shell can also use `ntfyx send` and `ntfyx ask` directly; see `skills/ntfyx/SKILL.md`.

## Choose one install per agent

If you previously ran `ntfyx setup claude-code` or `ntfyx setup codex`, remove those hooks with `ntfyx setup claude-code --remove` or `ntfyx setup codex --remove` before installing this plugin. Otherwise you would get two requests per action.

Docs: https://ntfyx.me/docs/agents/ · Security: https://ntfyx.me/security/ · License: MIT
