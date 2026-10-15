# Meal Prep CEO dashboard

The CEO instance for Meal Prep, built to Personal Brand's
CEO-DASHBOARD-PATTERN.md v2 with record shapes from
CEO-DATA-CONTRACTS.md. One of Ilse's two hats for this app:
her ordinary user account lives in the Meal Prep app (top
plan free forever, comped from a desk-written record); this
dashboard is where she acts as CEO. The two never mix: this
app holds no user data, reads no user folder, and shows
aggregates only.

## What it shows

Sidebar sections, one open at a time, numbers first:
Overview (the three questions: how many joined, how is the
money, who is leaving, plus the weekly row) · People
(signups, activation, returning) · Money (paying, cancels
split pending and ended with reason lines, failed payments,
monthly income estimate) · Reviews (count, inbox, stranger
replies) · Outreach (the cold email area, honestly "not
running yet" until a campaign exists) · Community (Facebook
groups, numbers labelled by source) · Avatars (Meal Prep's
cast only: MP1 Mia, MP2 Rosa, MP3 Jay; views plus sales,
worded SITE TAPS until the store listings open).

Activation for Meal Prep is confirmed as "first meal
planned": the first meal a user puts on a day through their
own action (add, swap, or the Plan my first week run),
stamped once, never overwritten. Untriggered fills never
count.

## Files

- index.html: the shell (door, closed door, dashboard).
- styles.css: the approved Meal Prep board applied to the
  shared skeleton (fonts Fraunces and Nunito Sans, vendored
  under vendor/fonts with their OFL licences; the Mina seal
  at assets/logo.svg).
- app.js: door, owner gate, reads, rendering.
- accounts-config.js: Meal Prep's own Firebase config slot,
  the same shape the user app carries. SHIPPED EMPTY: the
  project does not exist yet.
- fixtures.js: invented numbers for fixture mode.
- avatars-feed.json: NOT in this repo yet. App Promo drops
  the per-piece feed at this path on the CEO host (shape:
  CEO-DATA-CONTRACTS.md section 4). Until it lands, the
  Avatars section renders its honest empty state in live
  mode.

## Deploy shape

- Own repository: support897/meal-prep-ceo (created by HQ;
  this desk does not create it and never pushes anywhere
  until it exists).
- Own host: GitHub Pages on that repository. SEPARATE
  HOSTING from the user app, always: no part of this
  dashboard ever ships on the product host, and the product
  build contains zero CEO surface (Security OA-6).
- Static files at the repository root, no build step.
- Sign-in only: the door offers Google, Apple, and email
  plus password through Firebase Auth, sign-in calls only.
  This app never creates an account. Her owner account is
  created as an ordinary user through the Meal Prep app's
  public door.

## Owner pinning (one login, ever)

1. Ilse signs in once through the Meal Prep app's Firebase
   door (her ordinary user account).
2. The desk copies her uid from the Firebase console Auth
   table into the Firestore record _owner/config as
   { uids: [ her uid ] }, console edit only. No fixture
   owner is ever pinned on the live project (OA-7); owner
   positive battery legs run on the test twin.
3. The desk writes her comp at _comp/{her uid} console-side
   (top plan, free forever). The user record itself only
   ever carries the default free plan.
4. The CEO host is added to the Firebase project's
   authorised domains before her first sign-in here.

Access then rests on that record alone: after sign-in the
app reads _owner/config and opens only when the signed-in
uid is listed. Everyone else (another signed-in user, a
demo session, a signed-out visitor) gets the door or the
plain closed door, with no data, no counts, and no hints.

## Reads (live mode)

The dashboard reads only:

- _owner/config (the gate) and _owner/aggregates (the
  precomputed counters the app side writes: signups,
  activation, returning, money counters, cancel reason
  lines, stranger reply count).
- The reviews, outreach, and groups collections, which the
  Firestore rules open to the owner alone.
- avatars-feed.json on this host.

It never reads the per-user folders, the comp records, or
the subscription records. Spine numbers are computed from
those surfaces only, per the contracts.

## Fixture mode

While the config slot is empty (or with ?fixture=1), the
app renders the full spine on the invented data in
fixtures.js, watermarked FIXTURE on screen. Fixture data is
invented numbers and invented words only: no real user, no
real review, no real sale. This is how the gates review the
whole surface before the project exists.

## Battery before this counts as done

Live on fixtures (synthetic stand-ins, never her real
account), plus the three gates (Quality, Efficiency, QA):

- OA-1: a non-owner uid is denied on every dashboard
  surface.
- OA-2: the owner uid opens the dashboard.
- OA-3: comp alone never opens the dashboard (a comped
  non-owner is still a non-owner).
- OA-4: nothing about this dashboard leaks into the user
  app, including its export and download payloads.
- OA-5: the demo door never reaches the dashboard.
- OA-6: the shipped user build contains zero CEO surface
  (separate hosting is the structural proof).
- OA-7: no fixture owner is ever pinned on the live
  project; owner-positive legs run on the test twin.
- TW-1: her user account is provably ordinary (same rules,
  same denials as any user).
- TW-2: the comp cannot be set or changed from any client;
  it exists only as the desk-written record.
- TW-3: entitlement resolves from the comp record by rules
  get(); the user record carries the default free plan
  only, so no plan state can be written, smuggled, or
  shaped by a client.
- TW-4: the dashboard sees her user account as one
  anonymous count inside the aggregates, like everyone
  else's.
- NS-1: aggregates only, everywhere. No names, no emails,
  no uids, no per-person records on any dashboard surface.

## Honest limits

- The subscriptions feed (pattern R7: Apple IAP and Google
  Play Billing in the apps, Stripe on the web, RevenueCat
  as the one subscription brain) is wired here as a read
  surface only. Payments are not live yet, so Money reads
  honest zeros in live mode until the first real event.
  Before this instance seals, a first real subscription
  event must be seen in this dashboard and in no other.
- Aggregates are computed from precomputed counters and
  small owner-only collections at this scale. The
  server-side move stays a Blaze decision, never assumed.
