# Privacy & Safety

This document describes the privacy and safety principles this prototype
follows, and what would need to change to run it on real students.

## 1. What is collected

Per check-in, exactly four fields:

| Field         | Description                                              |
|---------------|-----------------------------------------------------------|
| `pseudonym_id`| A self-chosen opaque token (e.g. `anon-otter-482`)         |
| `mood`        | Integer 1–5                                                |
| `workload`    | Integer 1–5                                                |
| `note_tag`    | One of a fixed set of short tags (e.g. `exams`), optional  |

**No free-text notes, names, emails, student IDs, device IDs, or IP-based
identifiers are ever requested or stored.** The `pseudonym_id` field is
validated server-side to reject anything that looks like an email address
(see `models/schemas.py`).

## 2. Anonymity vs. pseudonymity

The system is **pseudonymous**, not one-shot anonymous: the same token
lets the trend logic recognize repeat check-ins from the same person over
time, which is what makes pattern-based flagging possible at all. Nothing
in the system maps a pseudonym back to an identity — that link exists only
in the student's own head (and however they choose to remember or share
their token).

Because a pseudonym is student-chosen, there is a possibility that two
different students pick the same token, or one student changes tokens.
This is an accepted trade-off for a check-in flow with zero real
identifiers; a production deployment might mitigate it with a
locally-generated, device-stored token instead of a free-text field.

## 3. What counselors see

The **Counselor review** page shows, per flag: the pseudonym, which
documented rule(s) it tripped, and the raw numbers behind that (e.g. "5
consecutive check-ins with mood ≤ 2"). It never shows:

- A name or any other identifying detail.
- A diagnostic label ("this student may have depression/anxiety/...").
- Any self-harm related content, language, or imagery.
- Free-text student input (none is collected in the first place).

A counselor can mark a flag **Reviewed** (with an optional internal note)
or **Dismissed**. Both are manual, human actions — the system takes no
further action on its own either way.

## 4. Why no diagnosis, ever

This system deliberately stops at "a documented, numeric pattern crossed a
documented threshold." Assigning a clinical label is a professional
judgment call that requires context this system does not and should not
have (history, conversation, other life circumstances). Encoding a
diagnostic-sounding output here would create false authority and could
cause real harm if a counselor (or a student who somehow saw it) took it
as a clinical assessment rather than a routing signal.

## 5. Human-in-the-loop, always

Every flag is a **prompt for a human**, never an automated outreach. The
system does not, and in this design cannot, message a student directly.
This keeps a trained counselor's judgment in the loop for anything that
touches an individual student, while still letting aggregate, anonymous
data help with planning (staffing, timing of wellness campaigns, etc.).

## 6. Access control (production consideration)

This prototype's Counselor review page has **no authentication**, since it
is a local, judged demo running on synthetic data. Before handling real
data, the deployment would need:

- Counselor-only authentication (e.g. institutional SSO) in front of
  `/api/flags*` and the Counselor review page.
- Audit logging of who reviewed/dismissed which flag and when.
- Role separation so only authorized counseling staff — not general
  faculty or IT — can view the flag queue.
- Encryption in transit (HTTPS) and at rest for any persistent store.
- A defined data-retention window (e.g. auto-expire raw check-ins after
  the semester ends, keep only aggregate history).

## 7. Synthetic data only

Everything in this repository — including the pre-loaded dataset behind
the demo trend charts — is synthetic, produced by
`backend/utils/synthetic_data_generator.py`. No real student's data was
used anywhere in building or demonstrating this project.

## 8. A note on scope

This tool is meant to help counseling teams **notice earlier and staff
better**. It is not a mental health screening instrument, not a
diagnostic tool, and not a substitute for a counselor's professional
judgment or for a student reaching out for help directly. If you are
building on this for a real deployment, involve counseling professionals,
your institution's ethics/IRB process, and legal/privacy counsel before
collecting data from real students.
