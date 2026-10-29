#!/bin/sh
# CLI 0.4.1 supplies the verified resume lifecycle. Older CLIs may interpret an
# unknown hook as an ordinary notification, so do not invoke it on those builds.
if ! command -v ntfyx >/dev/null 2>&1; then
  # This is setup context, not an installation, a phone question or an approval.
  printf '%s\n' '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"Ntfyx plugin is installed, but ntfyx is not on this agent process PATH. Briefly tell the user in their language to run /ntfyx:setup for phone setup: download the iPhone/Android app at https://ntfyx.me/download/, install the companion CLI, connect with ntfyx connect, and verify a phone reply. If the CLI is already installed, fix PATH and restart the host. Do not install software from this hook or interrupt unrelated work to force setup."}}'
  exit 0
fi
version=$(ntfyx version --json 2>/dev/null | sed -n 's/.*"version":"\([0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\)".*/\1/p')
[ -n "$version" ] || exit 0
awk -v v="$version" 'BEGIN { split(v,a,"."); exit !(a[1]>0 || a[2]>4 || (a[2]==4 && a[3]>=1)) }' || exit 0
exec ntfyx hook session-start
