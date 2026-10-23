# District Lab specification

## Purpose

District Lab is an interactive explanation of how the same place can elect a very
different set of representatives depending on district size, ballot design, and
counting rule. Its core question is:

> Who gets representation in this district, and what information did voters have
> to express for that to happen?

It should give proportional.uk a role distinct from electionresults.uk.
Electionresults.uk audits published election returns. District Lab teaches the
design choices that a result alone cannot show, particularly the difference
between a party-vote re-count and ballots that express overlapping approval or
score preferences.

The initial release is a polished eight-member fictional-but-plausible district.
It is a teaching tool, not a UK election forecast or a claim about how people
would have voted in 2024.

## Non-negotiable evidence boundary

### What may use real 2024 data

The existing Westminster hex map and `ge2024-constituency-results.json` may be
used to:

- show which constituencies could form a contiguous illustrative district;
- aggregate recorded party votes for a party-list Sainte-Laguë re-count;
- compare FPTP's recorded winners with a clearly labelled illustrative party-list
  allocation;
- show district magnitude, candidate-count and locality trade-offs.

### What must be synthetic or explicitly supplied

FPTP returns do not contain ranked preferences, approval sets, scores, or
candidate-specific utilities. District Lab must therefore use a synthetic voter
profile for AV, STV, approval, score, and proportional approval simulations.

Every screen using such a profile must say:

> This scenario uses invented preference ballots to demonstrate how the rules
> respond to overlapping support. It is not a reconstruction of the 2024 vote.

Never derive an approval, ranking, or score from a party's 2024 vote total and
present it as observed behaviour.

## Scope: version 1

Route: `/district-lab`.

The page opens directly into one completed scenario. It has three progressive
sections rather than a dashboard full of controls:

1. **Choose the situation** — switch among three deliberately different voter
   profiles.
2. **See the ballots** — inspect how the same voter groups express support under
   each ballot type.
3. **See who is represented** — choose a system and step through the count.

The default is an eight-member district because it is large enough to make
proportional representation visible while remaining imaginable as a regional or
sub-regional Westminster district. The visual identity should reuse the site's
current hex-map styling, candidate chips, party colours, cards, and mobile
patterns.

## User journeys

### Curious visitor

1. Lands on the page and reads a one-sentence question.
2. Selects a scenario card.
3. Sees a compact row of voter groups and the candidates each group can support.
4. Changes the system from FPTP to Approval PR.
5. Immediately sees the elected eight, the groups with representation, and a
   plain-language explanation of the difference.

Success: within 60 seconds, the visitor understands that proportionality and
ballot expression are separate design choices.

### Skeptical reformer or policymaker

1. Opens `Assumptions and data`.
2. Sees that the profile is synthetic and can inspect every group, ballot, rule,
   tie-break, district magnitude, and candidate slate.
3. Uses the count-step control to check why a candidate won.
4. Switches to `Real 2024 re-count` and sees a distinct, party-based result.

Success: no result needs to be trusted as a black box.

### Presenter

1. Opens a scenario with the controls hidden using `?present=1`.
2. Asks the audience to predict the winners.
3. Reveals ballots, switches system, and advances count rounds manually.
4. Shares the URL for the exact scenario and system.

Version 1 only needs a present mode, not slide export, login, or saved user
scenarios.

## District and candidate model

### Illustrative district

Use an eight-member district made from eight adjacent entries in the existing
Westminster hex dataset. It should be labelled **Illustrative eight-member
district**, not named after a real region unless its grouping was reviewed for
that purpose.

Show a small inset map with the eight included constituencies highlighted. This
grounds the discussion in local scale without implying proposed boundaries.

### Candidate slate

Use 12 candidates: ten party-affiliated candidates and two independents. Each
candidate needs:

```ts
type LabCandidate = {
  id: string;
  name: string;
  shortLabel: string;
  party: string;
  colour: string;
  tags: string[]; // e.g. ['local campaigner', 'climate']
  ballotOrder: number;
};
```

Candidate names must be fictional. Party labels can use familiar UK-wide labels
but should never imply the candidates stood in the selected real constituencies.
Two candidates should be visibly cross-cutting: for example a local independent
and a climate-focused candidate whose support crosses party blocs.

The initial slate should have enough candidates for meaningful choices but fit on
a phone without horizontal scrolling. Candidate cards show first name, party or
independent label, colour, and at most two tags.

## Voter profile model

Each scenario comprises six to eight voter groups. A group is a share of the
electorate with a deterministic approval set, ordered ranking, and 0–5 score for
every candidate.

```ts
type LabVoterGroup = {
  id: string;
  label: string;
  count: number;
  colour: string;
  approval: string[];
  ranking: string[];
  scores: Record<string, 0 | 1 | 2 | 3 | 4 | 5>;
  explanation: string;
};

type LabScenario = {
  id: string;
  title: string;
  strapline: string;
  question: string;
  groups: LabVoterGroup[];
  candidates: LabCandidate[];
  seats: 8;
  narrative: string;
};
```

Use counts totalling 800 or 1,000 so group shares and quotas are legible. Do not
add random noise in the public calculation: a deterministic, inspectable profile
is better for explanation and sharing. Existing `synthetic-election.ts` is useful
as a pattern, but District Lab must have its own data module so it does not alter
the worked examples already on the site.

## Scenario presets

### 1. Fragmented electorate

No group is close to a majority. Loyal party candidates have strong first-choice
support, while two broadly acceptable candidates appeal across adjacent groups.

Teaching point: an eight-member district can represent several perspectives;
approval ballots allow overlap to be visible without forcing a complete ranking.

### 2. Cross-party local candidate

The electorate is divided on national politics but a respected independent and a
climate-focused candidate are acceptable to several otherwise different groups.

Teaching point: a voter can support both their political home and a local or
cross-cutting candidate. The count should show whether that broader support can
translate into representation without wasting the voter’s first preference.

### 3. Polarised election

Two blocs approve few candidates across the divide. Each contains smaller
internal groups that want their own voice.

Teaching point: approval is not a magic consensus button; where preferences do
not overlap, a proportional rule should still allocate representation to the
distinct blocs.

Each preset needs one answerable audience prompt, such as “Will the independent
win a seat?” It should state what changes between presets: voter acceptability,
not turnout, boundaries, or candidate quality.

## Systems in version 1

The site should not imply that all systems solve the same problem. System cards
must state ballot, seats, and rule.

| System | Ballot | Seats | Rule | Role in the lab |
| --- | --- | --- | --- | --- |
| FPTP | one candidate | 1 | most votes wins | Baseline showing the single-winner constraint. |
| AV / IRV | rank candidates | 1 | eliminate last candidate and transfer | Shows how a ranked single-winner contest changes the winner but does not create proportional representation. |
| Party-list Sainte-Laguë | one party | 8 | highest averages, divisors 1, 3, 5… | A transparent proportional benchmark. |
| STV | rank candidates | 8 | fractional Gregory transfers and a stated quota | Candidate-centred proportional comparison. |
| Reweighted approval, Sainte-Laguë | approve any candidates | 8 | elect highest weighted approval total, reweight voters after elected approvals by 1/(1+2k) | Primary cardinal-method demonstration. |
| Score PR | score 0–5 | 8 | Deferred to version 2 unless a specific rule is selected and fully implemented. | Avoid presenting “score voting” as one settled multiwinner rule. |

For the initial public release, make FPTP, party-list Sainte-Laguë, STV, and
Sainte-Laguë reweighted approval interactive. AV may be included as a short
single-winner side comparison; it should not dominate the page.

Do not call the default approval method “SPAV”. Classic SPAV conventionally uses
D'Hondt-style reweighting, 1/(1+k). The UI must call this rule **Sainte-Laguë
reweighted approval** and offer classic SPAV only as an explicitly labelled
future comparison. This follows the existing correction in `src/lib/pav.ts`.

## Results screen

Results should answer four questions in this order:

1. **Who was elected?** Eight candidate chips, displayed in election order.
2. **Who has a representative they supported?** A group ledger with green,
   amber, and neutral states. “Supported” means approved the elected candidate
   under approval, gave them 3+ under score, or ranked them in the stated
   qualifying range; the precise rule is visible in an info control.
3. **Why did each candidate win?** A stepper with one plain-language sentence,
   winner, weighted total or quota/transfer information, and an expandable
   detailed table for advanced readers.
4. **What did the ballot ask of voters?** A compact comparison: marks required,
   whether equal support is allowed, and whether a full ranking is useful.

Avoid a single universal “fairness score”. It invites false precision. Use
separate displayed measures:

- seat share by candidate/affinity group;
- number and share of voters with at least one supported representative;
- number and share with two or more supported representatives;
- unused or exhausted ballot weight, only where the method makes that concept
  meaningful;
- proportionality metrics only for the party-list re-count, and labelled as such.

## Interaction design

- Scenario selection: three large cards with a title, one-sentence premise, and
  question. No sliders on first load.
- System selection: radio-card group. Selecting it changes both ballot display
  and result; preserve the scenario.
- Ballot display: one expandable row per voter group, with `Show my ballot`.
  Use actual marks rather than explanatory prose alone.
- Count stepper: Back, Next, Play. Respect `prefers-reduced-motion`; Play should
  advance only on user activation and pause when focus moves into a result table.
- URL state: `?scenario=cross-party-local&system=reweighted-approval`.
  Invalid values fall back to the default.
- Present mode: `?present=1` hides the assumptions drawer and advanced controls,
  but never hides the synthetic-scenario label.

## Accessibility and responsive behaviour

- Every visual result also appears as semantic text and an HTML table.
- Do not use colour as the only indication of party, voter group, selection, or
  representation status. Include labels, patterns, and concise text.
- Candidate and group names must meet contrast requirements on their coloured
  chips.
- System cards and count-step controls are native buttons/radio inputs with
  visible focus states and keyboard operation.
- On mobile, stack voter-group and candidate rows; keep the current result
  summary sticky only if it does not obscure controls.
- Test 320 px width, keyboard-only navigation, and 200% browser zoom.

## Architecture

New modules:

```text
src/routes/district-lab/+page.svelte
src/lib/district-lab/types.ts
src/lib/district-lab/scenarios.ts
src/lib/district-lab/ballots.ts
src/lib/district-lab/results.ts
src/lib/district-lab/real-recount.ts
src/lib/components/district-lab/ScenarioPicker.svelte
src/lib/components/district-lab/BallotComparison.svelte
src/lib/components/district-lab/SystemPicker.svelte
src/lib/components/district-lab/ResultSummary.svelte
src/lib/components/district-lab/RepresentationLedger.svelte
src/lib/components/district-lab/CountStepper.svelte
src/lib/components/district-lab/AssumptionsDrawer.svelte
```

Reuse, rather than duplicate:

- candidate and voter concepts from `src/lib/data/synthetic-election.ts`;
- Sainte-Laguë reweighted approval functions from `src/lib/pav.ts` after making
  their input generic enough for lab candidates and voters;
- fractional-Gregory STV from `src/lib/stv.ts` if it already provides stable,
  inspectable round data; otherwise defer STV interaction to a subsequent
  release rather than building a second count engine in a component;
- `allocateSainteLague` in `src/lib/mmd-sim.ts` for the real-vote party re-count;
- the existing `HexMap` and district grouping utilities for the inset.

All count functions must be pure: scenario plus system returns a serialisable
result object. Components must render those results rather than embed count
logic. Add deterministic tie-breaking by fixed ballot order and disclose it in
the assumptions drawer.

## Real 2024 re-count panel

This is a separate lower-page panel, introduced after the main synthetic lab.
It aggregates the selected illustrative district's actual party votes and runs
Sainte-Laguë for eight seats.

It must show:

- source and election date;
- constituent constituencies;
- every included party total;
- allocation table and divisors;
- the caveat that actual behaviour and candidate supply would change under a new
  electoral system;
- no AV, STV, approval, or score outcome derived from those FPTP totals.

## Acceptance criteria

### Data and integrity

- Scenario data is local, versioned, deterministic, and totals exactly 800 or
  1,000 voters.
- Every scenario has complete valid approval, ranking, and score data for every
  candidate.
- Rankings contain no duplicates; approvals are subsets of candidate IDs; scores
  are integers from 0 through 5.
- Eight winners are returned by every eight-seat method; all elected candidates
  are unique.
- Tie-breaks are deterministic and visibly documented.
- The real 2024 re-count uses only the local 2024 dataset and never feeds its
  votes into a simulated preference method.

### User-facing

- The visitor can reach a scenario outcome in three or fewer primary actions.
- Changing scenario or system updates ballots, results, ledger, explanation,
  and URL consistently.
- Every result contains an accessible text equivalent.
- A reader can find the synthetic-data warning before seeing the first outcome.
- The default scenario demonstrates overlapping approval in a way that changes
  at least one elected candidate relative to the party-list baseline or
  single-winner FPTP illustration.

### Quality checks

- Unit tests cover scenario validation, each count rule against small hand-worked
  examples, quota calculation, and deterministic ties.
- `npm run check` passes.
- Manual checks cover the three presets, all enabled systems, mobile width,
  keyboard navigation, reduced motion, direct URL loading, and present mode.

## Delivery plan

### Phase 1 — working core

Build the data model, one scenario, party-list re-count, Sainte-Laguë
reweighted approval, result summary, ledger, assumptions drawer, and shareable
URL. Do not add map selection or STV animation yet.

### Phase 2 — teaching experience

Add the remaining two presets, ballot comparison, round stepper, FPTP/AV side
comparison, inset district map, present mode, and accessibility polish.

### Phase 3 — rigorous comparison

Add STV only after its round data and tie handling are suitable for public
inspection. Add a score-PR option only when the site has chosen a named rule,
implemented it correctly, and can explain its properties without hand-waving.

### Out of scope

- polling or a live national forecast;
- postcode lookup;
- user accounts, saved scenarios, or crowdsourced ballots;
- downloadable campaign claims based on synthetic outcomes;
- a claim that any scenario predicts a real future election.

