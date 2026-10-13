#!/bin/sh
# Older CLIs interpret unknown hook events as notifications. Gate before invocation.
command -v ntfyx >/dev/null 2>&1 || exit 0
version=$(ntfyx version --json 2>/dev/null | sed -n 's/.*"version":"\([0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\)".*/\1/p')
[ -n "$version" ] || exit 0
awk -v v="$version" 'BEGIN { split(v,a,"."); exit !(a[1]>0 || a[2]>1 || (a[2]==1 && a[3]>=3)) }' || exit 0
exec ntfyx hook question
