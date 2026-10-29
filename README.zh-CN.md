# Ntfyx：让 Agent 带你连接手机

Claude Code 或 Codex 完成任务时通知你，需要你选择时把问题发到手机。你在手机回复，正在等待的 Agent 收到并验证答案后继续。

**[English](README.md)** · **[给 Agent 的完整安装流程](install.md)**

## 最简单的开始方式

把下面这段话复制给正在使用的 Codex 或 Claude Code：

> 请按 https://github.com/KaylaONeal/ntfyx-agent-plugins/blob/main/install.md 帮我安装 Ntfyx 并连接手机。电脑上的步骤你来做，手机上需要我操作时，一步步告诉我点哪里。最后发一条通知和一道测试题，确认你收到了我的手机回复。

Agent 会检查已有安装，补齐需要的组件、启动配对并验证结果。你只需要在手机上下载安装、扫码、确认连接和回复测试消息。已经配对过时，会复用连接。

**手机 App 下载：**

- iPhone：[App Store 下载 Ntfyx](https://apps.apple.com/app/id6817353404)
- Android：[Google Play 下载 Ntfyx](https://play.google.com/store/apps/details?id=me.ntfyx.app)
- [官网下载页](https://ntfyx.me/zh/download/)

安装后先打开 App，完成欢迎界面的步骤。需要后台提醒时允许通知。手机应使用 Ntfyx 1.8.0 或更新版本。

## 已装好插件，但不知道下一步

重开 Agent，再发送上面的引导语即可。Claude Code 也可以直接输入：

```text
/ntfyx:setup
```

支持插件设置入口的 Codex 会使用内置引导；没有这个入口的版本，直接发送上面的完整引导语。安装插件只添加 Agent 的工具和指引，手机连接还需要你在 App 中确认。

## 想手动安装插件

只运行你使用的那个 Agent 对应的命令：

```sh
# Codex
codex plugin marketplace add KaylaONeal/ntfyx-agent-plugins
codex plugin add ntfyx@ntfyx

# Claude Code
claude plugin marketplace add KaylaONeal/ntfyx-agent-plugins
claude plugin install ntfyx@ntfyx
```

第一条添加插件市场，第二条才安装插件。重开 Agent 后使用前面的引导语，继续安装 CLI 和手机配对。如果此前已经用 `ntfyx setup` 完成直接接入，继续使用已有接入方式，避免重复 Hook。

## 手机上会经过这几步

1. **电脑显示二维码。** Agent 启动 `ntfyx connect` 并保持命令运行。如果 Agent 无法显示交互终端，它会让你在自己的终端运行这条命令。
2. **打开手机扫码入口。** 在 Ntfyx 中进入 **添加 Topic（+）→ 连接私有 Topic／连接私密 Topic → 扫描连接码**。不同平台的中文标签略有区别，英文为 **Add Topic → Connect private Topic → Scan connection code**。已有私有 Topic 可从该 Topic 的设置进入“连接私有 Topic”。
3. **扫码并确认。** 扫描电脑二维码，核对电脑名称和连接权限，给新的 Topic 起名，再保存／确认。Topic 是消息频道，例如“我的开发任务”；手机问答需要私有／受保护 Topic，不能用公开 Topic 标识代替配对。
4. **等电脑显示连接结果。** 连接完成前不要关闭终端。二维码显示不完整时，在同一台电脑打开命令输出的本地 `file://…/connect.html` 页面；不要将二维码或页面上传到公共网站。
5. **重开 Agent。** 发送：“继续 Ntfyx 设置：检查已有连接，发一条测试通知，再问我一道测试题并等待手机回复。”Codex 的原生完成／执行审批 Hook 还需在 `/hooks` 中查看和信任。
6. **完成一次真实问答。** 打开手机里的测试消息，输入任意短词并发送。Agent 在电脑会话中复述你实际输入的答案，才算手机回复链路验证完成。

电脑收到发送成功回执，只表示服务接受了消息；是否在手机显示、是否成功返回答案，要分别确认。

## 以后怎么用

直接告诉 Agent：

> 测试完成后，用 Ntfyx 通知我。

> 需要我选择方案或补充信息时，用 Ntfyx 问我；解释留在当前对话。

回答时保持电脑上的 Agent 会话运行。手机回复返回正在等待的请求，不会自动启动一个已经结束的 Agent。

Codex 需要主动通过 Ntfyx 工具提问，其原生 `request_user_input` / `request_user_input_async` 不会由权限 Hook 自动转发。Claude Code 还支持已有的 `AskUserQuestion` 桥接。执行权限审批另有[平台与版本范围](https://ntfyx.me/zh/docs/agents/)。

## 版本和更新

| 组件 | 版本要求 | 作用 |
| --- | --- | --- |
| Agent 插件 | 0.4.1 | 安装指引、MCP 配置、Hook 和使用 Skill |
| Ntfyx CLI | 0.6.0+ | 电脑上的加密收发和回复校验 |
| 手机 App | 1.8.0+ | 手机接收、连接确认和回复 |

三个组件独立编号。此前插件最新公开版是 0.4.0，CLI 是 0.6.0，并不是 GitHub 漏发了同号的插件。

```sh
# 更新 Codex 插件
codex plugin marketplace upgrade ntfyx
codex plugin add ntfyx@ntfyx
codex plugin list --json

# 更新 Claude Code 插件
claude plugin marketplace update ntfyx
claude plugin update ntfyx@ntfyx
claude plugin list --json
```

更新后重开 Agent。`ntfyx version --json` 查看的是 CLI 版本，CLI 用 `ntfyx upgrade` 单独升级。更新插件无需删除配对或重置手机；CLI 升级前先结束正在等待的手机问题。

## 卡住时，把问题直接告诉 Agent

- **找不到 ntfyx：** Agent 检查 CLI 安装位置和自己的 PATH，修复后重开宿主。
- **已经连接但收不到消息：** Agent 运行 `ntfyx doctor --json` 检查连接和服务，手机检查通知权限。App 内有消息但没有后台横幅时，检查系统专注／勿扰设置。
- **扫码后超时：** 保留当前连接结果；如果电脑显示 `connection_saved` 或恢复编号，让 Agent 按原结果继续恢复，避免反复创建连接。
- **手机答了但 Agent 没继续：** Agent 检查原请求是否仍在等待、是否过期或已取消；不能把超时当成允许，也不能靠新建相同问题掩盖失败。

这些处理步骤已经写进 [install.md](install.md)，不需要你自己查命令。Windows 用户由 Agent 阅读并执行[官方 CLI／本地 MCP 安装流程](https://ntfyx.me/install/)；本仓库的插件 Hook 使用 macOS／Linux 的 POSIX shell。

插件配置、Hook 和 Skill 使用 MIT 许可。App、CLI 和托管服务有独立的许可与[服务条款](https://ntfyx.me/terms/)；[隐私说明](https://ntfyx.me/privacy/)。
