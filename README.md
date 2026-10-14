# Ntfyx — AI Agent Notifications & Phone Replies

Ntfyx sends task notifications and questions from Claude Code, Codex and scripts to your phone. Keep one task's updates, questions and replies in one encrypted conversation. Get a completion alert, tap an option below the original message, or type a reply on iPhone, Android or your phone-authorized Web Inbox. Your computer verifies the signed answer before continuing.

**Plugin 0.2.0 · requires Ntfyx CLI 0.1.3+ · macOS and Linux.**

[Website](https://ntfyx.me/) · [Installation](https://ntfyx.me/install/) · [Agent compatibility](https://ntfyx.me/docs/agents/) · [Session guide](https://ntfyx.me/docs/sessions/) · [Privacy](https://ntfyx.me/privacy/)

## One command to get started

Choose your agent. The installer verifies the CLI signature, guides you through phone pairing, then installs the MCP configuration, hooks and phone-reply skill. Restart your agent afterwards.

```sh
# Claude Code
curl -fsSL https://ntfyx.me/install.sh | bash -s -- --agent claude-code

# Codex
curl -fsSL https://ntfyx.me/install.sh | bash -s -- --agent codex
```

Use `--agent both` to explicitly configure both installed agents. The phone must authorize the connection. Codex hook trust is reviewed in `/hooks`; setup does not bypass host permission policies. Ask your agent: **“Use Ntfyx to ask me a test question on my phone.”** Configuration is complete when the installer succeeds; phone delivery is verified after an actual answer returns.

This direct setup is an alternative to marketplace installation below. Use one method per host to avoid duplicate hooks. To switch to the plugin, remove the CLI-managed integration with `ntfyx setup claude-code --remove` or `ntfyx setup codex --remove` first; this preserves paired phone credentials.

## Install from the Ntfyx marketplace

Install or upgrade the CLI and connect your phone first:

```sh
curl -fsSL https://ntfyx.me/install.sh | bash
export PATH="$HOME/.local/bin:$PATH"
ntfyx connect
```

### Claude Code

Run in a terminal:

```sh
claude plugin marketplace add KaylaONeal/ntfyx-agent-plugins
claude plugin install ntfyx@ntfyx
```

Inside Claude Code, the same commands are `/plugin marketplace add KaylaONeal/ntfyx-agent-plugins` and `/plugin install ntfyx@ntfyx`. Restart the host to load the plugin. Update with `/plugin marketplace update ntfyx` followed by `/plugin update ntfyx@ntfyx`.

### Codex

```sh
codex plugin marketplace add KaylaONeal/ntfyx-agent-plugins
codex plugin add ntfyx@ntfyx
```

Restart Codex and review the two execution-approval/completion hooks with `/hooks`. To refresh the marketplace, run `codex plugin marketplace upgrade ntfyx`, then reinstall the plugin. In desktop, select the **Ntfyx · Phone replies** marketplace source.

These commands add the publicly hosted **Ntfyx marketplace**. They do not mean the plugin is listed in Anthropic's curated marketplace or OpenAI's universal public directory. Directory review and eligibility are separate.

## What works

| Capability | Claude Code | Codex | pi / other local MCP clients |
| --- | --- | --- | --- |
| Encrypted notifications | MCP/CLI + completion hook | MCP/CLI + completion hook | MCP/CLI; pi completion extension |
| Phone questions and verified replies | MCP + phone-reply skill | MCP + phone-reply skill | MCP; host configuration required |
| Native questions | `AskUserQuestion` PreToolUse bridge | Native `request_user_input` is not intercepted | Not integrated |
| Session conversations | Hook session ID; explicit MCP/CLI ID | Hook session ID; explicit MCP/CLI ID | Explicit MCP/CLI ID |
| Native tool execution approval | Bash/Edit/Write; verified Linux x64, Claude 2.1.283+ | Bash/apply_patch; verified Linux x64, Codex 0.158+ interactive | pi Bash is opt-in; other hosts not verified |

The question bridge is distinct from execution approval. Claude single-choice questions have buttons plus a free-text alternative. A batch of up to four questions arrives in order. Multi-select currently uses a text reply with option numbers (such as `1,3`) or a custom answer. Only a complete set of verified, uniquely claimed answers is returned to the original waiting call. Timeout, cancellation, unsupported payloads or an ended session leave the native prompt in charge. Set `NTFYX_NATIVE_QUESTIONS=off` to disable this bridge.

Native questions have encrypted integration coverage; real-host/device acceptance is recorded separately from manifest validation. Native execution approval remains subject to the [published compatibility matrix](https://ntfyx.me/docs/agents/). macOS native execution approvals fall back to the terminal. `codex exec` does not run the interactive approval flow.

## One task, one conversation

```sh
ntfyx send "Build passed" --session-id release-24 --session-name "Release v2.4"
ntfyx ask "What should I check next?" --text --session-id release-24
```

MCP uses `session_id` and `session_name`. Without an ID, each message starts its own conversation. Sessions do not grant remote-shell access or publish your full agent transcript.

## pi

```sh
pi install git:github.com/KaylaONeal/ntfyx-agent-plugins
```

Registers MCP tools, loads the skill and adds completion notifications. Optional `NTFYX_PI_APPROVAL=risky` or `bash` enables Bash approval; this is off by default. Native pi question UI interception is not included.

## Privacy and troubleshooting

The plugin uses your installed local CLI; it never includes credentials or downloads a binary during a hook. Titles, bodies and replies are encrypted on devices. The relay handles ciphertext and routing metadata. Run `ntfyx doctor` to check pairing, and `ntfyx version --json` to check the CLI. A GUI-launched host must have `ntfyx` on its PATH; direct setup uses an absolute executable path. Use a supported local CLI/IDE host; a cloud chat cannot execute your computer's paired stdio server.

Deny, timeout, cancellation, verification failure and already-consumed answers are never treated as consent. A verified answer covers only its original request. [Support](https://ntfyx.me/support/).

## License and service dependency

The plugin configuration, hooks and skills in this repository are MIT licensed. The Ntfyx application, companion CLI and hosted relay are separate products with their own license and service terms. This repository does not publish the application's core source or provide a supported self-hosting package. Install the signed CLI and pair the phone app before using the local MCP server; it is not a standalone hosted connector.

## 中文说明

Ntfyx 是 AI Agent 任务通知与手机回复工具，把 Claude Code、Codex 和脚本的任务通知、问题和回复放进同一个加密会话。手机上直接点选按钮或引用问题输入，电脑校验签名后继续。支持 iPhone、Android 和手机授权的 Web 收件箱。

上面的一键命令会完成 CLI 安装、扫码连接与 Agent 配置；也可以选择插件市场安装，两种方式每个 Agent 选一种。Claude 原生 AskUserQuestion 已加入问答桥接；Codex 通过 MCP 主动提问，暂不接管原生提问。执行权限审批有独立的平台和版本范围。公开 GitHub 市场可安装，不代表已被官方公共目录收录。

[安装与说明](https://ntfyx.me/install/) · [中文会话指南](https://ntfyx.me/zh/docs/sessions/) · [中文插件说明](https://ntfyx.me/zh/docs/agent-plugins/)

本仓库的插件配置、Hook 与 Skill 采用 MIT 许可；App、配套 CLI 和托管中继遵循独立许可与服务条款。这里不提供应用核心源码或受支持的自托管发行。
