# Demo Flow (~4 minutes)

A suggested script for presenting this project live.

## 1. Frame the problem (30s)

> "Counseling teams usually only find out a student is struggling once
> it's a crisis. We built an anonymous, opt-in check-in system that
> surfaces aggregate stress trends early — and only ever routes
> individual patterns to a human counselor, never to an algorithm."

## 2. Show the check-in (45s)

- Open the **Check in** page.
- Point out: pseudonym field (not a name), two simple 1–5 sliders, no
  free-text box.
- Submit a check-in live. Mention: "That's it — 15 seconds, no login."

## 3. Show the aggregate dashboard (60s)

- Switch to **Trends**.
- Point at the pre-loaded synthetic semester: "This is 40 synthetic
  students over a 10-week semester."
- Highlight the mid-semester dip around week 6–8: "This is the kind of
  signal a counseling team could use to plan outreach or staffing before
  midterms — before individual students are in crisis."
- Note the summary cards update live as new check-ins come in.

## 4. Show the flagging rule and counselor queue (90s)

- Switch to **Counselor review**.
- Click **Recompute flags**.
- Open a flagged pseudonym's card: read out the plain-English reason
  (e.g. "5 consecutive check-ins with mood <= 2").
- Emphasize: "This is the entire rule — two documented thresholds, no
  black box, no diagnosis. A counselor decides what happens next; the
  system only decides who gets a human's attention first."
- Mark the flag **Reviewed** to show the human-in-the-loop close of the
  loop.

## 5. Close on privacy & safety (30s)

- Switch to **Privacy & safety**.
- One line each: anonymous/opt-in, pseudonymous not identifying,
  conservative documented rule, always a human decision, synthetic data
  only in this demo.

## 6. Closing line

> "The goal isn't to diagnose anyone — it's to help a counseling team
> notice the mid-semester spike two weeks earlier than they would have,
> and know exactly which documented rule brought a case to their
> attention."

## Anticipated judge questions

- **"What stops false positives from overwhelming counselors?"** — the
  rule requires a sustained pattern (3+ consecutive low-mood check-ins,
  or 60%+ of a 14-day window combining low mood and high workload), not
  a single bad day. See `docs/flagging_rule.md`.
- **"How do you know a pseudonym is really tracked to one person?"** —
  we don't guarantee it (see `docs/privacy_and_safety.md`, section 2); in
  production this could be a locally-generated device token instead of
  free text.
- **"Could this be gamed?"** — yes, self-report always can be; the
  intended use is aggregate trend-spotting, with the flag as a
  conservative secondary signal, not a sole source of truth.
- **"What about students without smartphones/laptops?"** — the check-in
  is a simple web form; it could be embedded in existing campus portals
  or offered on shared kiosks — out of scope for this prototype but worth
  noting.
