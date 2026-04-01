<script lang="ts">
	type Variant = 'compensatory' | 'parallel';
	let variant = $state<Variant>('compensatory');
</script>

<section class="ams-variant-section" aria-labelledby="ams-variant-title">
	<h3 id="ams-variant-title" class="subsection-header">Two valid ways to build the list tier</h3>
	<p class="intro-text">
		Mixed systems do not all use the regional tier in the same way. Some use it to correct the failed
		proportionality of the constituency tier. Others simply add a fixed block of proportional seats on
		top. Both are real, valid design choices.
	</p>

	<div class="variant-toggle" role="tablist" aria-label="AMS variant choice">
		<button type="button" role="tab" aria-selected={variant === 'compensatory'} class:selected={variant === 'compensatory'} onclick={() => (variant = 'compensatory')}>
			Compensatory top-up
		</button>
		<button type="button" role="tab" aria-selected={variant === 'parallel'} class:selected={variant === 'parallel'} onclick={() => (variant = 'parallel')}>
			Fixed parallel/add-on list tier
		</button>
	</div>

	{#if variant === 'compensatory'}
		<div class="variant-card">
			<h4>Compensatory top-up (classic MMP / stronger AMS)</h4>
			<p>
				Here the regional seats are used to <strong>balance out the disproportionality</strong> created by the
				constituency results. If a party wins fewer constituency seats than its vote share deserves, it gets
				more list seats. If it wins many constituency seats already, it gets fewer or none.
			</p>
			<ul>
				<li>Best if the goal is chamber-wide proportionality</li>
				<li>Closest to German and New Zealand-style MMP logic</li>
				<li>The strongest fit for an approval-based “AMS+” if proportionality is the main goal</li>
			</ul>
		</div>
	{:else}
		<div class="variant-card">
			<h4>Fixed parallel / add-on list tier</h4>
			<p>
				Here the regional seats are allocated proportionally, but they do <strong>not fully compensate</strong>
				for the local tier. You keep a fixed number of constituency seats and a fixed number of list seats,
				then run both in parallel.
			</p>
			<ul>
				<li>Best if the goal is a mixed system that is more proportional without being fully compensatory</li>
				<li>Closer to the logic used in systems such as Japan’s parallel structure</li>
				<li>Still a valid approval-based design if reformers want a softer step away from FPTP</li>
			</ul>
		</div>
	{/if}

	<p class="variant-note">
		<strong>Bottom line:</strong> the approval innovation sits in the <em>local ballot</em>. Whether the list tier is
		fully compensatory or only partly balancing is a separate design choice.
	</p>
</section>

<style>
	.ams-variant-section { display: grid; gap: 1rem; }
	.intro-text { max-width: 54rem; }
	.variant-toggle {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.variant-toggle button {
		border: 1px solid var(--border-color);
		background: var(--surface-panel);
		color: var(--text-dark);
		padding: 0.75rem 1rem;
		border-radius: 999px;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
	.variant-toggle button.selected {
		background: linear-gradient(180deg, var(--header-bg) 0%, var(--header-bg-strong) 100%);
		color: var(--text-inverse);
		border-color: transparent;
	}
	.variant-card, .variant-note {
		padding: 1.2rem 1.3rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background: var(--surface-raised);
		box-shadow: var(--shadow-soft);
	}
	.variant-card h4 { margin-top: 0; }
	.variant-card ul { margin: 0.8rem 0 0 0; padding-left: 1.25rem; }
	.variant-card li { margin-bottom: 0.5rem; line-height: 1.45; }
	.variant-note { background: var(--surface-subtle-gradient); }
</style>
