<script lang="ts">
	const systems = [
		{
			name: 'STV',
			family: 'Candidate-centred PR',
			fairness: 'High in sensible district magnitudes',
			localLink: 'Multi-member local districts',
			ballot: 'Rank candidates',
			counting: 'Transfer count; slower to explain and verify',
			implementation: 'Established PR option; needs district redesign',
			note: 'Serious and legitimate PR option. Main trade-off is ranked complexity, not proportional intent.'
		},
		{
			name: 'AMS / MMP',
			family: 'Mixed-member PR',
			fairness: 'High if top-up share is adequate',
			localLink: 'Single-member seats plus regional members',
			ballot: 'Usually one local candidate vote plus one party vote',
			counting: 'Moderate; familiar in devolved UK politics',
			implementation: 'Near-term Westminster PR route because UK voters already know the structure',
			note: 'Strong bridge reform for coalition politics, especially if the local ballot is improved.'
		},
		{
			name: 'Open-list PR',
			family: 'List PR',
			fairness: 'High',
			localLink: 'Regional rather than single-constituency',
			ballot: 'Vote for a party and optionally candidates on that list',
			counting: 'Straightforward with stable district magnitudes',
			implementation: 'Practical if reformers want simple proportionality first',
			note: 'Fair and legible, though more party-mediated than candidate-centred systems.'
		},
		{
			name: 'AMS+',
			family: 'Approval-based mixed PR',
			fairness: 'High, with stronger local voter choice',
			localLink: 'Keeps constituency MPs plus regional correction',
			ballot: 'Approve local candidates; choose a party list',
			counting: 'Simpler local count than standard AMS',
			implementation: 'Most coalition-ready approval reform because it builds directly on AMS/MMP',
			note: 'Best fit if the UK wants proportionality soon without abandoning familiar institutions.'
		},
		{
			name: 'Proportional Approval',
			family: 'Approval-based multi-member PR',
			fairness: 'Very high',
			localLink: 'Regional or multi-member district link',
			ballot: 'Approve acceptable candidates',
			counting: 'Reweighting is simpler than STV transfers, but still new to Westminster',
			implementation: 'Longer-term end-state once multi-member district design is politically live',
			note: 'Keeps the core approval thesis while offering a fully proportional destination.'
		}
	];
</script>

<section class="comparison-matrix" aria-labelledby="comparison-matrix-title">
	<h2 id="comparison-matrix-title" class="section-header">How the main reform combinations compare</h2>
	<p class="intro-text">
		Now that the pieces are on the table, the named systems are easier to read. Each one combines a
		ballot type, a district structure, and a way of allocating seats. The question is not which brand
		name sounds nicest. It is which combination best fits Westminster.
	</p>

	<div class="matrix-scroll">
		<table>
			<thead>
				<tr>
					<th scope="col">System</th>
					<th scope="col">Family</th>
					<th scope="col">Fairness</th>
					<th scope="col">Local link</th>
					<th scope="col">Ballot</th>
					<th scope="col">Counting</th>
					<th scope="col">UK reform path</th>
				</tr>
			</thead>
			<tbody>
				{#each systems as system (system.name)}
					<tr>
						<th scope="row">{system.name}</th>
						<td>{system.family}</td>
						<td>{system.fairness}</td>
						<td>{system.localLink}</td>
						<td>{system.ballot}</td>
						<td>{system.counting}</td>
						<td>{system.implementation}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>


</section>

<style>
	.comparison-matrix {
		display: grid;
		gap: 1.5rem;
	}

	.matrix-scroll {
		overflow-x: auto;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		background: var(--surface-raised);
		box-shadow: var(--shadow-soft);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		min-width: 860px;
	}

	th,
	td {
		padding: 1rem;
		text-align: left;
		vertical-align: top;
		border-bottom: 1px solid var(--border-color);
	}

	thead th {
		background: var(--surface-info-gradient);
		color: var(--text-dark);
		font-size: 0.95rem;
	}

	tbody th {
		font-size: 1rem;
		color: var(--text-dark);
	}

	tbody tr:last-child th,
	tbody tr:last-child td {
		border-bottom: 0;
	}


</style>
