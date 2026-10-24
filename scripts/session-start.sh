#!/bin/sh
# CLI 0.4.1 supplies the verified resume lifecycle. Older CLIs may interpret an
# unknown hook as an ordinary notification, so do not invoke it on those builds.
command -v ntfyx >/dev/null 2>&1 || exit 0
version=$(ntfyx version --json 2>/dev/null | sed -n 's/.*"version":"\([0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\)".*/\1/p')
[ -n "$version" ] || exit 0
awk -v v="$version" 'BEGIN { split(v,a,"."); exit !(a[1]>0 || a[2]>4 || (a[2]==4 && a[3]>=1)) }' || exit 0
exec ntfyx hook session-start
