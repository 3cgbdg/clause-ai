from __future__ import annotations

SYSTEM_MESSAGE = (
    "You are a contract analysis assistant. You provide informational summaries only — "
    "not legal advice. Be concise. Never invent information not present in the contract."
)

STRUCTURED_PROMPT = """\
Analyze the following contract and return a JSON object with exactly these fields:

{{
  "attention_score": <integer 1-10>,
  "score_label": <"Looks Standard" | "Worth Reviewing" | "Needs Attention">,
  "contract_type": <string, e.g. "Lease Agreement", "NDA", "Employment Contract">,
  "key_points": [<up to 5 short strings>],
  "red_flags": [
    {{
      "clause": <short excerpt or label>,
      "concern": <plain-English explanation of the issue>,
      "severity": <"low" | "medium" | "high">
    }}
  ]
}}

Score guide:
- 1-3 → Looks Standard (typical contract, nothing unusual)
- 4-6 → Worth Reviewing (some clauses deserve careful reading)
- 7-10 → Needs Attention (unusual or potentially unfavorable terms)

Red flags to watch for: auto-renewal traps, non-compete clauses, unusual termination terms,
hidden fees, liability waivers, IP assignment clauses, jurisdiction issues.

Return ONLY valid JSON. No markdown fences. No extra text.

CONTRACT:
{contract_text}
"""

SUMMARY_PROMPT = """\
Write a 2-3 sentence plain-English summary of the following contract.
Be direct and factual. Start with what the contract is and what it does.
Do not use legal jargon. Do not add disclaimers or opinions.

CONTRACT:
{contract_text}
"""
