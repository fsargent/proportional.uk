<script lang="ts">
	import AMSPlusSection from '$lib/components/AMSPlusSection.svelte';
	import AMSVariantSection from '$lib/components/AMSVariantSection.svelte';
</script>

<svelte:head>
	<title>AMS+ for Westminster</title>
	<meta name="description" content="Explore AMS+: an approval-based mixed system that keeps local MPs and adds proportional representation." />
</svelte:head>

<section class="method-page">
	<h1>AMS+: the easiest proportional route from here</h1>
	<p class="lede">
		AMS+ keeps the mixed-member structure the UK already knows from Scotland and Wales, but replaces the
		local FPTP ballot with approval voting. That makes it the clearest near-term approval-based route to
		Westminster proportionality.
	</p>
	<nav class="method-links" aria-label="Method links">
		<a href="/">← Back to overview</a>
		<a href="/stv">Read the STV page</a>
		<a href="/proportional-approval">See the fully proportional version →</a>
	</nav>
	<AMSVariantSection />
	<AMSPlusSection />
</section>

<style>
	.method-page { display:grid; gap:2rem; }
	.lede { max-width: 52rem; font-size: 1.1rem; line-height: 1.7; margin: 0; }
	.method-links { display:flex; flex-wrap:wrap; gap:1rem; }
	.method-links a { color: var(--link-color); text-decoration:none; font-weight:600; }
	.method-links a:hover { text-decoration:underline; }
</style>
