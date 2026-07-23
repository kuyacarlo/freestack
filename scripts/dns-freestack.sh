#!/usr/bin/env bash
# Upsert Cloudflare CNAME: freestack.kuyacarlo.dev → Vercel
# Requires: CLOUDFLARE_API_TOKEN with Zone.DNS Edit on kuyacarlo.dev
#
# Create token: https://dash.cloudflare.com/profile/api-tokens
#   Template "Edit zone DNS" → zone kuyacarlo.dev
#
# Usage:
#   export CLOUDFLARE_API_TOKEN=...
#   pnpm dns:freestack
#   # or: ./scripts/dns-freestack.sh

set -euo pipefail

ZONE_NAME="${ZONE_NAME:-kuyacarlo.dev}"
RECORD_NAME="${RECORD_NAME:-freestack}"
TARGET="${TARGET:-8f23ff0af44e92ad.vercel-dns-017.com}"
# Vercel SSL is happier DNS-only (grey cloud). Set PROXIED=true to orange-cloud.
PROXIED="${PROXIED:-false}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "Missing CLOUDFLARE_API_TOKEN" >&2
  echo "Create a Zone.DNS Edit token, then: export CLOUDFLARE_API_TOKEN=..." >&2
  exit 1
fi

AUTH=( -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type: application/json" )

echo "Looking up zone ${ZONE_NAME}…"
ZONE_JSON=$(curl -sS "https://api.cloudflare.com/client/v4/zones?name=${ZONE_NAME}" "${AUTH[@]}")
ZONE_ID=$(python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("result") or []; print(r[0]["id"] if r and d.get("success") else "")' <<<"$ZONE_JSON")
if [[ -z "$ZONE_ID" ]]; then
  echo "Zone not found / API error:" >&2
  echo "$ZONE_JSON" | python3 -m json.tool 2>/dev/null || echo "$ZONE_JSON" >&2
  exit 1
fi
echo "Zone ID: ${ZONE_ID}"

FQDN="${RECORD_NAME}.${ZONE_NAME}"
echo "Looking up existing record ${FQDN}…"
LIST_JSON=$(curl -sS "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?type=CNAME&name=${FQDN}" "${AUTH[@]}")
REC_ID=$(python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("result") or []; print(r[0]["id"] if r else "")' <<<"$LIST_JSON")

BODY=$(PROXIED_JSON="$PROXIED" RECORD_NAME="$RECORD_NAME" TARGET="$TARGET" python3 -c '
import json, os
print(json.dumps({
  "type": "CNAME",
  "name": os.environ["RECORD_NAME"],
  "content": os.environ["TARGET"],
  "ttl": 1,
  "proxied": os.environ["PROXIED_JSON"].lower() == "true",
  "comment": "freestack → Vercel",
}))
')

if [[ -n "$REC_ID" ]]; then
  echo "Updating record ${REC_ID} → ${TARGET} (proxied=${PROXIED})…"
  RESP=$(curl -sS -X PUT "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${REC_ID}" \
    "${AUTH[@]}" --data "$BODY")
else
  echo "Creating CNAME ${FQDN} → ${TARGET} (proxied=${PROXIED})…"
  RESP=$(curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
    "${AUTH[@]}" --data "$BODY")
fi

echo "$RESP" | python3 -c 'import json,sys; d=json.load(sys.stdin); 
import sys as _s
if not d.get("success"):
  print(json.dumps(d, indent=2)); _s.exit(1)
r=d["result"]; print("OK ", r["name"], " CNAME ", r["content"], " proxied=", r["proxied"], sep="")'

echo
echo "Verify:"
echo "  dig +short ${FQDN} CNAME"
echo "  # expect: ${TARGET}"
echo "  # then check Vercel domain: vercel domains inspect ${FQDN}"
