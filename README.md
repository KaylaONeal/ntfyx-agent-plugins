# Ntfyx — AI Agent Notifications & Phone Replies

Get task notifications from Claude Code or Codex on your phone, answer a question, and let the waiting agent continue with your verified reply.

**[Let your agent set it up → install.md](install.md)** · **[中文教程](README.zh-CN.md)**

**Download the phone app:** [iPhone / App Store](https://apps.apple.com/app/id6817353404) · [Android / Google Play](https://play.google.com/store/apps/details?id=me.ntfyx.app) · [All downloads](https://ntfyx.me/download/)

**Plugin 0.4.1 · requires Ntfyx CLI 0.6.0+ and phone app 1.8.0+ for private phone replies · macOS / Linux plugin hooks.** These are separate versions: plugin 0.4.0 was the previous plugin release, not an outdated copy of CLI 0.6.0. Updating the marketplace does not update the CLI or phone app.

## Already installed? Start here

Paste this into your agent:

> Follow https://github.com/KaylaONeal/ntfyx-agent-plugins/blob/main/install.md to set up Ntfyx and connect my phone. Do the computer steps for me, walk me through the phone steps, then verify a notification and my actual phone reply.

The guide tells the agent to check what is already installed, preserve your existing connection, show App Store / Google Play links, start pairing, and wait for your test reply. You only need to download/open the phone app, scan, confirm and answer. No API key or cloud MCP endpoint is needed.

After restarting Claude Code, you can also run **`/ntfyx:setup`**. In Codex versions with plugin setup, use Ntfyx's setup entry; otherwise use the prompt above. Plugin installation alone does not install the companion CLI or pair a phone.

## Install from the Ntfyx marketplace

Choose your host. Run these commands in your terminal:

```sh
# Codex
codex plugin marketplace add KaylaONeal/ntfyx-agent-plugins
codex plugin add ntfyx@ntfyx

# Claude Code
claude plugin marketplace add KaylaONeal/ntfyx-agent-plugins
claude plugin install ntfyx@ntfyx
```

`marketplace add` adds the source; the second command installs the plugin. In Claude Code, the in-chat equivalents are `/plugin marketplace add KaylaONeal/ntfyx-agent-plugins` and `/plugin install ntfyx@ntfyx`. Restart the host, then use the guided setup above. These commands install from the public Ntfyx marketplace; they do not imply inclusion in an OpenAI or Anthropic curated directory.

## What setup looks like

1. **Open the phone app.** Install Ntfyx from the links above and complete its welcome screens. Allow notifications for background alerts.
2. **Install the CLI on the computer.** The agent checks `ntfyx version --json`, installs it if missing, and keeps an existing compatible installation.
3. **Connect the phone.** The agent starts `ntfyx connect`. Keep it running. On the phone open **Add Topic (+) → Connect private Topic → Scan connection code**, scan the computer's QR, name the private Topic, and confirm/save. For an existing private Topic, use **Connect private Topic** in its settings. Private/protected Topics carry verified questions; public Topics do not.
4. **Restart the agent.** The new session loads the plugin and local MCP tools. In Codex, review `/hooks` for native completion/permission hooks. Resume with: **“Continue Ntfyx setup and test my phone connection.”**
5. **Receive and reply.** The agent sends one notification and one harmless question. Open the message in Ntfyx, type a short test reply and send it. Setup is verified when the agent reports your actual reply in its chat.

If the terminal cannot display the QR, open the local `file://…/connect.html` page printed by `ntfyx connect` on the same computer. This page is private; do not upload it. `ntfyx doctor --json` checks pairing and service access. A successful send is not proof that a phone notification was displayed.

## Use it in everyday work

Tell your agent:

> Send me a Ntfyx notification when the tests finish.

> Use Ntfyx for questions that need my decision; keep explanations in this chat.

Keep the agent session running while you answer. The phone reply returns to the waiting request; it does not start a new agent session. Codex must use Ntfyx MCP/CLI questions: its native `request_user_input` and `request_user_input_async` are not forwarded by execution-permission hooks. Claude Code also includes the existing `AskUserQuestion` bridge.

## Update an existing installation

```sh
# Codex: refresh the marketplace, then install its current plugin
codex plugin marketplace upgrade ntfyx
codex plugin add ntfyx@ntfyx
codex plugin list --json

# Claude Code
claude plugin marketplace update ntfyx
claude plugin update ntfyx@ntfyx
claude plugin list --json
```

Restart the agent afterwards. `ntfyx version --json` checks the separate CLI version; `ntfyx upgrade` updates that CLI. Finish pending phone questions before upgrading it. Updating the plugin preserves the phone pairing; do not reset the phone or delete credentials to refresh a marketplace version.

## Alternative: direct CLI setup

If you prefer direct integration instead of the marketplace plugin, install the phone app first, then choose one command:

```sh
# Claude Code
curl -fsSL https://ntfyx.me/install.sh | bash -s -- --agent claude-code

# Codex
curl -fsSL https://ntfyx.me/install.sh | bash -s -- --agent codex
```

Use one integration method per host to avoid duplicate hooks. If switching from existing direct setup to a plugin, `ntfyx setup claude-code --remove` or `ntfyx setup codex --remove` removes that CLI-managed integration and preserves phone credentials. Do not run these removal commands for an ordinary plugin update.

CLI 0.6.0 also supports Windows x64/ARM64. Windows uses the [direct CLI or local MCP guide](https://ntfyx.me/install/); this marketplace plugin's hooks use POSIX shell. Native execution approval keeps its [separate compatibility limits](https://ntfyx.me/docs/agents/).

## What works

| Capability | Claude Code | Codex | pi / other local MCP clients |
| --- | --- | --- | --- |
| Encrypted protected notifications | MCP/CLI + completion hook | MCP/CLI + completion hook | MCP/CLI; pi completion extension |
| Phone questions and verified replies | MCP + phone-reply skill | MCP + phone-reply skill | MCP; host configuration required |
| Native questions | `AskUserQuestion` PreToolUse bridge | Native `request_user_input` is not intercepted | Not integrated |
| Session conversations | Hook session ID; explicit MCP/CLI ID | Hook session ID; explicit MCP/CLI ID | Explicit MCP/CLI ID |
| Native tool execution approval | Bash/Edit/Write; Linux x64 (Claude 2.1.283 / 2.1.284), Apple silicon Mac (2.1.303, CLI 0.1.5+) | Bash/apply_patch; Linux x64 (Codex 0.158.0), Apple silicon Mac (0.163.0, CLI 0.1.5+); interactive TUI + /hooks trust | pi Bash is opt-in; other hosts not verified |

The question bridge is distinct from execution approval. Claude single-choice questions have buttons plus a free-text alternative. A batch of up to four questions arrives in order. Multi-select currently uses a text reply with option numbers (such as `1,3`) or a custom answer. Only a complete set of verified, uniquely claimed answers is returned to the original waiting call. Timeout, cancellation, unsupported payloads or an ended session leave the native prompt in charge. Set `NTFYX_NATIVE_QUESTIONS=off` to disable this bridge.

Native questions have encrypted integration coverage; real-host/device acceptance is recorded separately from manifest validation. Native execution approval remains subject to the [published compatibility matrix](https://ntfyx.me/docs/agents/). Apple silicon Mac native execution approvals were verified with Claude Code 2.1.303 and Codex 0.163.0 and require CLI 0.1.5+. Intel Mac native approvals remain unverified and fall back to the terminal. Claude interactive terminal-choice precedence remains unverified. `codex exec` does not run the interactive approval flow.

## One task, one conversation

```sh
ntfyx send "Build passed" --session-id release-24 --session-name "Release v2.4"
ntfyx ask "What should I check next?" --text --session-id release-24
```

MCP uses `session_id` and `session_name`. Without an ID, each message starts its own conversation. Sessions do not grant remote-shell access or publish your full agent transcript.

## Rich task reports

Use ordinary text for short notifications, Markdown for reports, and structured
blocks for callouts, metrics, tables, progress or line/bar charts. The included
skill and `ntfyx help send --json` expose the exact schema, limits and examples.

The CLI works independently of MCP. Save [this complete six-block example](examples/rich-message.json) as `report.json`, then validate and send it:

```sh
ntfyx validate-message --message-file report.json --json
ntfyx send --message-file report.json --session-id report-1 --dedupe-key report-1-result
# Equivalent stdin input with identical delivery and retry metadata:
ntfyx send --message-stdin --session-id report-1 --dedupe-key report-1-result < report.json
```

Validation needs no pairing and sends nothing. Sending requires the existing
phone-authorized connection. JSON contains only `title`, `summary` and required
`content`; keep Session, priority, reminder and retry options in CLI flags.
Do not combine JSON input with `--title`, `--summary` or `--format`. For a Markdown
file use `ntfyx send --stdin --format markdown --title "Report" < report.md`.
`--json` controls output; it does not select JSON input.

MCP uses `ntfyx_send` with either `body` or `content` plus optional `summary`, and
`ntfyx_validate_message` for local checks. Rich titles allow 120 Unicode code
points and summaries 240; omitted summaries are generated locally. Notifications
show the summary, while details, search and copy retain the full content.
The complete message, including delivery metadata, must fit 16 KiB. Content is
display-only: no HTML execution, remote images or action buttons. Use the existing
question tools for decisions; viewing a report does not grant execution approval.

## pi

```sh
pi install git:github.com/KaylaONeal/ntfyx-agent-plugins
```

Registers MCP tools, loads the skill and adds completion notifications. Optional `NTFYX_PI_APPROVAL=risky` or `bash` enables Bash approval; this is off by default. Native pi question UI interception is not included.

## Privacy and troubleshooting

The plugin uses your installed local CLI; it never includes credentials or downloads a binary during a hook. For protected Topics, titles, bodies and replies are encrypted on devices; the relay handles ciphertext and routing metadata. Public Topic messages are visible to the service and anyone with the Topic ID, require no pairing, and cannot authorize replies or execution. Run `ntfyx doctor` to check pairing, and `ntfyx version --json` to check the CLI. A GUI-launched host must have `ntfyx` on its PATH; direct setup uses an absolute executable path. Use a supported local CLI/IDE host; a cloud chat cannot execute your computer's paired stdio server.

Deny, timeout, cancellation, verification failure and already-consumed answers are never treated as consent. A verified answer covers only its original request. [Support](https://ntfyx.me/support/).

## License and service dependency

The plugin configuration, hooks and skills in this repository are MIT licensed. The Ntfyx application, companion CLI and hosted relay are separate products with their own license and service terms. This repository does not publish the application's core source or provide a supported self-hosting package. Install the signed CLI to use the local MCP server. Protected messages and questions also require phone pairing; public Topic operations do not. This is not a standalone hosted connector.

## 中文教程

**[完整中文教程](README.zh-CN.md)** · **[给 Agent 的一步步安装指引](install.md)**

把 `install.md` 的链接发给 Codex 或 Claude Code，让它检查安装状态、给出 App 下载链接、启动配对，并验证手机回复。插件 0.4.1、CLI 0.6.0 和手机 App 独立编号；插件安装后仍需连接手机。

本仓库的插件配置、Hook 与 Skill 采用 MIT 许可；App、配套 CLI 和托管中继遵循独立许可与服务条款。这里不提供应用核心源码或受支持的自托管发行。
