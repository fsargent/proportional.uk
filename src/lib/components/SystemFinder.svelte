<script lang="ts">
  type BallotType = "ranking" | "approval" | "party-list" | "one-vote";
  type ValueKey =
    | "vote-helps-win"
    | "proportional"
    | "broad-local-support"
    | "decisive-government"
    | "candidate-choice"
    | "simple-ballot";

  type System = {
    name: string;
    category: string[];
    href?: string;
    description: string;
    singleMemberOnly: boolean;
    needsSecondBallot: boolean;
    twoClassMPs: boolean;
    ballotType: BallotType;
    needsParliamentResize: boolean | "helps";
  };

  const systems: System[] = [
    {
      name: "First Past the Post",
      category: ["Single Winner", "Choose One"],
      href: "/fptp",
      description:
        "The current UK system. Each constituency elects one MP. Each voter marks one candidate. The candidate with the most votes wins, even without a majority. Leads to distorted results and tactical voting.",
      singleMemberOnly: true,
      needsSecondBallot: false,
      twoClassMPs: false,
      ballotType: "one-vote",
      needsParliamentResize: false,
    },
    {
      name: "Choose Many (Single-Winner Approval)",
      category: ["Single Winner", "Choose Many"],
      href: "/single-winner-approval",
      description:
        "Most like current FPTP, but fixes vote splitting. Keep one MP per constituency, but vote for as many candidates as you like. The most approved candidate wins. Leads to strong centrist governments.",
      singleMemberOnly: true,
      needsSecondBallot: false,
      twoClassMPs: false,
      ballotType: "approval",
      needsParliamentResize: false,
    },
    {
      name: "Party-List Proportional Representation",
      category: ["Proportional", "Vote for a Party"],
      href: "/party-list",
      description:
        "Vote for a party (and in some variants, for individual candidates on that list). Seats are allocated proportionally across larger regional districts.",
      singleMemberOnly: false,
      needsSecondBallot: false,
      twoClassMPs: false,
      ballotType: "party-list",
      needsParliamentResize: false,
    },
    {
      name: "Proportional, Choose Many (Proportional Approval Voting)",
      category: ["Proportional", "Choose Many", "Reweight Support"],
      href: "/proportional-approval",
      description:
        "Vote for as many candidates as you like in multi-member districts. A reweighting method ensures proportional results.",
      singleMemberOnly: false,
      needsSecondBallot: false,
      twoClassMPs: false,
      ballotType: "approval",
      needsParliamentResize: false,
    },
    {
      name: "Rank Candidates and Transfer Support (Single Transferable Vote)",
      category: ["Proportional", "Rank Candidates", "Transfer Support"],
      href: "/stv",
      description:
        "Voters rank candidates in multi-member districts. Seats are filled using a quota and transfer system.",
      singleMemberOnly: false,
      needsSecondBallot: false,
      twoClassMPs: false,
      ballotType: "ranking",
      needsParliamentResize: false,
    },
    {
      name: "Mixed System (Additional Member System / Mixed Member Proportional)",
      category: ["Mixed", "Single Winner + Party List"],
      href: "/ams-plus",
      description:
        "A mix of a single winner method and Party List method. Keep your local MP, add a second vote for a party. Top-up seats make the overall result proportional.",
      singleMemberOnly: true,
      needsSecondBallot: true,
      twoClassMPs: true,
      ballotType: "one-vote",
      needsParliamentResize: "helps",
    },
  ];

  const valueOptions: { key: ValueKey; label: string }[] = [
    {
      key: "vote-helps-win",
      label:
        "My vote should help decide who wins, even if my first choice can't",
    },
    {
      key: "proportional",
      label: "Parliament's makeup should reflect how the country voted overall",
    },
    {
      key: "broad-local-support",
      label: "Each area should elect candidates with broad local support",
    },
    {
      key: "decisive-government",
      label: "Government should usually be clear and decisive",
    },
    {
      key: "candidate-choice",
      label: "I want to choose between individual candidates, not just parties",
    },
    {
      key: "simple-ballot",
      label: "The ballot should be simple to understand and fill in",
    },
  ];

  type Answer = string | null;

  let q1: Answer = $state(null);
  let q2: Answer = $state(null);
  let q3: Answer = $state(null);
  let q4: BallotType[] = $state([]);
  let q5: Answer = $state(null);
  let values: ValueKey[] = $state([]);

  function toggleValue(key: ValueKey) {
    if (values.includes(key)) values = values.filter((v) => v !== key);
    else values = [...values, key];
  }

  function toggleBallot(key: BallotType) {
    if (q4.includes(key)) q4 = q4.filter((v) => v !== key);
    else q4 = [...q4, key];
  }

  const isFPTP = (s: System) => s.name === "First Past the Post";
  const isSingleWinnerApproval = (s: System) =>
    s.name === "Choose Many (Single-Winner Approval)";

  function valueScore(system: System): number {
    let score = 0;
    for (const v of values) {
      if (v === "vote-helps-win") {
        if (isFPTP(system)) score -= 1;
        else if (
          system.ballotType === "approval" ||
          system.ballotType === "ranking" ||
          !system.singleMemberOnly
        )
          score += 1;
      }
      if (v === "proportional") {
        if (isFPTP(system) || isSingleWinnerApproval(system)) score -= 1;
        else score += 2;
      }
      if (v === "broad-local-support") {
        if (system.ballotType === "approval" || system.singleMemberOnly)
          score += 1;
      }
      if (v === "decisive-government") {
        if (
          isFPTP(system) ||
          isSingleWinnerApproval(system) ||
          system.ballotType === "one-vote"
        )
          score += 2;
      }
      if (v === "candidate-choice") {
        if (system.ballotType === "approval" || system.ballotType === "ranking")
          score += 2;
        if (isFPTP(system)) score -= 1;
      }
      if (v === "simple-ballot") {
        if (
          system.ballotType === "approval" ||
          system.ballotType === "one-vote"
        )
          score += 2;
        else if (system.ballotType === "party-list") score += 1;
      }
    }
    return score;
  }

  function structuralScore(system: System): number {
    let score = 0;
    if (q1 === 'single' && !system.singleMemberOnly) score -= 3;
    if (q1 === 'sharing' && system.singleMemberOnly) score -= 1;
    if (q2 === 'one-ballot' && system.needsSecondBallot) score -= 3;
    if (q2 === 'two-votes' && !system.needsSecondBallot) score -= 1;
    if (q3 === 'same-way' && system.twoClassMPs) score -= 3;

    if (q4.length > 0 && !q4.includes(system.ballotType)) {
      score -= 3;
    }

    if (q5 === 'keep-650' && system.needsParliamentResize !== false) score -= 2;
    return score;
  }

  function totalScore(system: System): number {
    return valueScore(system) + structuralScore(system);
  }

  let results = $derived.by(() => {
    const sorted = [...systems];
    sorted.sort((a, b) => totalScore(b) - totalScore(a));
    return sorted;
  });

  function resetAll() {
    q1 = null;
    q2 = null;
    q3 = null;
    q4 = [];
    q5 = null;
    values = [];
  }

  function matchNotes(system: System): string[] {
    const notes: string[] = [];
    if (q1 === 'single' && system.singleMemberOnly) notes.push('Keeps single-member constituencies');
    if (q1 === 'sharing' && !system.singleMemberOnly) notes.push('Uses multi-member districts');
    if (q2 === 'two-votes' && system.needsSecondBallot) notes.push('Uses a two-vote ballot');
    if (q2 === 'one-ballot' && !system.needsSecondBallot) notes.push('Single ballot');
    if (q3 === 'same-way' && !system.twoClassMPs) notes.push('All MPs elected the same way');
    if (q3 === 'fine' && system.twoClassMPs) notes.push('Mixes constituency and list MPs for fairness');
    if (q4.length > 0 && q4.includes(system.ballotType)) notes.push('Matches your ballot preference');
    if (q5 === 'keep-650' && system.needsParliamentResize === false) notes.push('Works with 650 MPs');
    const vs = valueScore(system);
    if (values.length && vs > 0) notes.push(`Matches ${vs} of your priority points`);
    return notes;
  }

  function mismatchNotes(system: System): string[] {
    const notes: string[] = [];
    if (q1 === 'single' && !system.singleMemberOnly) notes.push('Requires multi-member districts — no single local MP');
    if (q1 === 'sharing' && system.singleMemberOnly) notes.push('Keeps single-member seats — no multi-member districts');
    if (q2 === 'one-ballot' && system.needsSecondBallot) notes.push('Needs a second ballot paper');
    if (q2 === 'two-votes' && !system.needsSecondBallot) notes.push('Only uses one vote — no separate party ballot');
    if (q3 === 'same-way' && system.twoClassMPs) notes.push('Creates two classes of MP (constituency and list)');
    if (q4.length > 0 && !q4.includes(system.ballotType)) {
      const ballotLabels: Record<BallotType, string> = {
        'approval': 'approve-many',
        'ranking': 'ranking',
        'party-list': 'party list',
        'one-vote': 'single mark'
      };
      notes.push(`Uses a ${ballotLabels[system.ballotType]} ballot — not your preferred style`);
    }
    if (q5 === 'keep-650' && system.needsParliamentResize !== false) notes.push('Works better with a different number of MPs');
    const vs = valueScore(system);
    if (values.length && vs < 0) notes.push(`Scores ${vs} against your priorities`);
    return notes;
  }
</script>

<div class="system-finder">
  <div class="questions">
    <div class="question-card">
      <h3>Should every area keep its own single MP?</h3>
      <div class="options">
        <label class:selected={q1 === "single"}>
          <input type="radio" name="q1" value="single" bind:group={q1} />
          Yes — keep one MP per area
        </label>
        <label class:selected={q1 === "sharing"}>
          <input type="radio" name="q1" value="sharing" bind:group={q1} />
          I'm open to sharing several MPs across a larger area
        </label>
        <label class:selected={q1 === "no-pref"}>
          <input type="radio" name="q1" value="no-pref" bind:group={q1} />
          No preference
        </label>
      </div>
    </div>

    <div class="question-card">
      <h3>
        Should voters get a second vote for a party, alongside their local vote?
      </h3>
      <div class="options">
        <label class:selected={q2 === "two-votes"}>
          <input type="radio" name="q2" value="two-votes" bind:group={q2} />
          Yes, I'd be comfortable with two votes
        </label>
        <label class:selected={q2 === "one-ballot"}>
          <input type="radio" name="q2" value="one-ballot" bind:group={q2} />
          No, I'd prefer one ballot that does everything
        </label>
        <label class:selected={q2 === "no-pref"}>
          <input type="radio" name="q2" value="no-pref" bind:group={q2} />
          No preference
        </label>
      </div>
    </div>

    <div class="question-card">
      <h3>
        Is it OK if some MPs represent local areas and others represent parties
        or regions?
      </h3>
      <div class="options">
        <label class:selected={q3 === "fine"}>
          <input type="radio" name="q3" value="fine" bind:group={q3} />
          Yes, that's fine if it makes Parliament fairer overall
        </label>
        <label class:selected={q3 === "same-way"}>
          <input type="radio" name="q3" value="same-way" bind:group={q3} />
          No, every MP should be elected the same way
        </label>
        <label class:selected={q3 === "no-pref"}>
          <input type="radio" name="q3" value="no-pref" bind:group={q3} />
          No preference
        </label>
      </div>
    </div>

    <div class="question-card">
      <h3>
        Right now you can only vote for one candidate. If you could express more
        of your opinion, how would you prefer to do it?
      </h3>
      <p class="multi-hint">Select all that appeal to you</p>
      <div class="options">
        <label class:selected={q4.includes("approval")}>
          <input type="checkbox" checked={q4.includes("approval")} onchange={() => toggleBallot("approval")} />
          Vote for all the candidates you'd be happy with
        </label>
        <label class:selected={q4.includes("ranking")}>
          <input type="checkbox" checked={q4.includes("ranking")} onchange={() => toggleBallot("ranking")} />
          Rank the candidates in your order of preference
        </label>
        <label class:selected={q4.includes("party-list")}>
          <input type="checkbox" checked={q4.includes("party-list")} onchange={() => toggleBallot("party-list")} />
          Vote for a party and let them decide which candidates get seats
        </label>
        <label class:selected={q4.includes("one-vote")}>
          <input type="checkbox" checked={q4.includes("one-vote")} onchange={() => toggleBallot("one-vote")} />
          You should only be able to support one candidate and their party
        </label>
      </div>
    </div>

    <div class="question-card">
      <h3>Is it OK to change the number of MPs in Parliament?</h3>
      <div class="options">
        <label class:selected={q5 === "keep-650"}>
          <input type="radio" name="q5" value="keep-650" bind:group={q5} />
          Keep it at 650
        </label>
        <label class:selected={q5 === "open"}>
          <input type="radio" name="q5" value="open" bind:group={q5} />
          I'm open to changing it if there's a good reason
        </label>
        <label class:selected={q5 === "no-pref"}>
          <input type="radio" name="q5" value="no-pref" bind:group={q5} />
          No preference
        </label>
      </div>
    </div>

    <div class="question-card">
      <h3>What matters to you? Tick all that apply.</h3>
      <p class="helper">
        This doesn't filter systems out; it reorders results toward your
        priorities.
      </p>
      <div class="options checkbox-options">
        {#each valueOptions as option}
          <label class:selected={values.includes(option.key)}>
            <input
              type="checkbox"
              checked={values.includes(option.key)}
              onchange={() => toggleValue(option.key)}
            />
            {option.label}
          </label>
        {/each}
      </div>
    </div>
  </div>

  <div class="controls">
    <button class="reset-btn" onclick={resetAll}>Reset all</button>
  </div>

  <div class="results">
    <h3 class="results-heading">Results</h3>
    <div class="results-grid">
      {#each results as system}
        {@const matches = matchNotes(system)}
        {@const mismatches = mismatchNotes(system)}
        <div class="result-card" class:has-mismatches={mismatches.length > 0}>
          <div class="result-categories">
            {#each system.category as tag}
              <span class="category-tag">{tag}</span>
            {/each}
          </div>
          <h4 class="result-name">
            {#if system.href}
              <a href={system.href}>{system.name}</a>
            {:else}
              {system.name}
            {/if}
          </h4>
          <p class="description">{system.description}</p>
          {#if matches.length > 0}
            <ul class="match-notes">
              {#each matches as note}
                <li class="match">✓ {note}</li>
              {/each}
            </ul>
          {/if}
          {#if mismatches.length > 0}
            <ul class="match-notes">
              {#each mismatches as note}
                <li class="mismatch">✗ {note}</li>
              {/each}
            </ul>
          {/if}
          {#if system.href}
            <a href={system.href} class="learn-more">Learn more →</a>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .system-finder {
    display: grid;
    gap: 1.5rem;
  }

  .questions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
    gap: 1rem;
  }

  .question-card {
    background: var(--surface-subtle-gradient);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    box-shadow: var(--shadow-soft);
  }

  .question-card h3 {
    color: var(--text-dark);
    font-size: 1.05rem;
    margin: 0 0 0.75rem;
    line-height: 1.4;
  }

  .helper {
    margin: -0.25rem 0 0.75rem 0;
    font-size: 0.9rem;
    color: var(--text-soft);
  }

  .multi-hint {
    margin: -0.5rem 0 0.5rem;
    font-size: 0.85rem;
    color: var(--text-soft);
    font-style: italic;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .options label {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    padding: 0.55rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--text-color);
    font-size: 0.95rem;
    line-height: 1.4;
    transition:
      border-color 0.15s,
      background 0.15s;
  }

  .options label:hover {
    border-color: var(--accent-border-strong);
    background: var(--surface-emphasis);
  }

  .options label.selected {
    border-color: var(--accent-text);
    background: var(--selection-bg);
    color: var(--text-dark);
  }

  .options input {
    margin-top: 0.15rem;
    flex-shrink: 0;
    accent-color: var(--accent-text);
  }

  .controls {
    display: flex;
    justify-content: flex-end;
  }

  .reset-btn {
    background: var(--surface-muted);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: 0.5rem 1.2rem;
    color: var(--text-color);
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition:
      background 0.15s,
      border-color 0.15s;
  }

  .reset-btn:hover {
    background: var(--surface-color);
    border-color: var(--border-strong);
  }

  .results-heading {
    color: var(--text-dark);
    font-size: 1.35rem;
    margin: 0.5rem 0 1rem;
    line-height: 1.2;
  }

  .results-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .result-card {
    background: var(--surface-subtle-gradient);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    box-shadow: var(--shadow-soft);
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .result-card:hover {
    border-color: var(--border-strong);
    box-shadow: var(--shadow-strong);
  }

  .result-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 0 0 0.4rem;
  }

  .category-tag {
    display: inline-block;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    background: var(--surface-overlay);
    border: 1px solid var(--accent-border);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--accent-text);
    letter-spacing: 0.02em;
  }

  .result-name {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    color: var(--text-dark);
  }

  .result-name a {
    color: var(--link-color);
    text-decoration: none;
  }

  .result-name a:hover {
    text-decoration: underline;
  }

  .description {
    color: var(--text-color);
    margin: 0 0 0.75rem;
    line-height: 1.6;
    font-size: 0.96rem;
  }

  .match-notes {
    list-style: none;
    padding: 0;
    margin: 0 0 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .match-notes li {
    font-size: 0.88rem;
  }

  .match-notes li.match {
    color: var(--success-text, #2e7d32);
  }

  .match-notes li.mismatch {
    color: var(--error-text, #c62828);
  }

  .result-card.has-mismatches {
    opacity: 0.75;
    border-color: var(--border-color);
  }

  .learn-more {
    color: var(--link-color);
    font-size: 0.9rem;
    text-decoration: none;
    font-weight: 600;
  }

  .learn-more:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .questions {
      grid-template-columns: 1fr;
    }
  }
</style>
