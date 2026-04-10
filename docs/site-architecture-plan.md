# Proportional.uk Revised Site Architecture Plan

## Core principle

Teach readers that electoral systems are built from three layers:

1. **How voters mark the ballot**
2. **How seats are grouped**
3. **How winners are allocated**

This reduces branching confusion and makes it easier to compare named systems as combinations of design choices.

## Homepage structure

1. **Hero / the glitch**
   - Westminster keeps producing the same kind of mess.
   - Wasted votes, tactical squeeze, safe seats, seat bonuses.

2. **The problem**
   - Show that these are symptoms of the same single-mark-ballot design.

3. **What matters in a good reform**
   - Criteria frame: fairness, voter power, local link, simplicity, implementability.

4. **Where the UK PR conversation stands**
   - UK-familiar reform families: STV, AMS/MMP, List PR.
   - Frame as serious existing debate, not blank-slate theory.

5. **Serious reforms still make ballot choices**
   - Even beyond FPTP, ballot design still matters.
   - STV and AMS/MMP make different ballot/interface tradeoffs.

6. **A surprisingly simple ballot idea**
   - Introduce approval voting cleanly.
   - Ballot comparison should feel discovered, not preached.

7. **The other big choice: district shape**
   - Introduce single-member vs multi-member districts.
   - Explain why MMD matters to STV and proportional approval.
   - Explain district magnitude, local link, proportionality, ballot complexity.

8. **How seats get allocated**
   - Light explanation of plurality, transfers, top-up, reweighting, and comparison benchmarks like Sainte-Laguë.

9. **How the main reform options compare**
   - Matrix comparing systems as combinations of ballot + district + allocation.

10. **Three ways this could work in Britain**

- Single-Winner Approval
- AMS+
- Proportional Approval

11. **Explore multi-member districts in practice**

- Wire in the visualiser as a deeper dive.
- Present it as a shared structural explainer, not a fourth system.

12. **Make it real / Take action**

- Join Make Votes Matter
- Find allies and local groups
- Write to your MP supporting a commission on electoral reform

## Key framing rules

- Introduce approval voting only after the reader sees the ballot problem.
- Introduce MMD as a shared structural ingredient of proportional systems, not a proprietary feature of one proposal.
- Keep named systems legible as combinations of:
  - ballot
  - district shape
  - allocation rule
- Push wonkier detail down the page or into dedicated deeper-dive routes.

## Implementation tasks

- [x] Remove the homepage pager as the primary experience.
- [ ] Remove leftover pager/read-mode code now that the page is scroll-first.
- [ ] Add a new shared section for district shape / MMD.
- [ ] Add a new shared section for seat-allocation overview.
- [ ] Reframe the comparison matrix as a combinations table.
- [ ] Keep the three proposal sections, but present them as applications of the same ballot idea.
- [ ] Wire in the visualiser as a shared explainer for multi-member systems.
- [ ] Review copy for premature mention of approval voting.
- [ ] Review copy for defensive / whitepaper-y tone.
- [ ] Validate with a full build.
