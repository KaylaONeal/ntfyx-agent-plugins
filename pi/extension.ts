/**
 * Ntfyx for pi: encrypted "turn ended" notifications and optional phone approval for bash.
 *
 *   NTFYX_PI_NOTIFY=off         disable turn-ended notifications (default: on)
 *   NTFYX_PI_APPROVAL=off       default; pi keeps its normal behaviour
 *   NTFYX_PI_APPROVAL=risky     ask on the phone before risky bash commands
 *   NTFYX_PI_APPROVAL=bash      ask on the phone before every bash command
 *
 * Allow requires a verified, claimed answer (`ntfyx ask` exit 0). Deny blocks. Any other outcome
 * (not connected, timeout, network) falls back to pi's own confirmation when a UI exists, otherwise
 * blocks. The ntfyx MCP tools are registered so the model can notify or ask on its own.
 */
import { execFile, spawn } from "node:child_process";

type ExtensionAPI = any;

const RISKY = [
  /\brm\s+-[a-z]*[rf]/i,
  /\bsudo\b/,
  /\bgit\s+push\b/,
  /\b(npm|pnpm|yarn|cargo|twine|gem)\s+publish\b/,
  /\b(kubectl|terraform|helm)\s+(apply|delete|destroy|upgrade)\b/,
  /\bdocker\s+(push|rm|system\s+prune)\b/,
  /\b(chmod|chown)\b.*\b777\b/,
  /\bdd\s+if=/,
  /\bmkfs\b/,
];

function ask(command: string, signal?: AbortSignal): Promise<number | null> {
  return new Promise((resolve) => {
    const child = spawn(
      "ntfyx",
      ["ask", command, "--title", "Allow pi bash once?", "--allow-deny", "--wait", "90s", "--expires", "100s", "--json"],
      { stdio: "ignore" },
    );
    const abort = () => child.kill("SIGTERM");
    signal?.addEventListener("abort", abort, { once: true });
    child.on("error", () => resolve(null));
    child.on("exit", (code) => {
      signal?.removeEventListener("abort", abort);
      resolve(code);
    });
  });
}

export default function (pi: ExtensionAPI) {
  pi.registerMcpServer("ntfyx", { command: "ntfyx", args: ["mcp"] });

  pi.on("tool_call", async (event: any, ctx: any) => {
    const mode = process.env.NTFYX_PI_APPROVAL ?? "off";
    if (mode === "off" || event.toolName !== "bash") return undefined;
    const command = String(event.input?.command ?? "");
    if (mode === "risky" && !RISKY.some((p) => p.test(command))) return undefined;
    const code = await ask(command, ctx.signal);
    if (code === 0) return undefined;
    if (code === 10) return { block: true, reason: "Denied on the phone with Ntfyx." };
    if (ctx.hasUI && (await ctx.ui.confirm("Ntfyx could not get a phone answer. Allow this command?", command)))
      return undefined;
    return { block: true, reason: "No verified phone approval (Ntfyx exit " + code + ")." };
  });

  pi.on("agent_end", async () => {
    if (process.env.NTFYX_PI_NOTIFY === "off") return;
    execFile("ntfyx", ["send", "Open your terminal for context.", "--title", "pi turn ended"], () => {});
  });
}
