<script context="module">
	import { search } from '$lib/_api';

	// export const prerender = true;
	export async function load({ page, fetch, session, context }) {
		// TODO: make this actually prerender and use the endpoint?
		// but seems to be working fine without javascript already?
		const q = page.query.get('q');
		const res = await fetch(`/search/${q}.json`);
		console.log(res);
		if (res.ok) {
			console.log(await res.json());
			return {
				props: {
					q,
					results: await res.json()
				}
			};
		}
		const results = await search({
			q
		});
		return {
			props: {
				q,
				results
			},
			maxage: 60 * 60 * 24
		};
	}
</script>

<!-- todo: multiple pages -->
<script>
	export let q;
	export let results;

	const { total, objectIDs } = results;
	let page = 1;
	let perPage = 10;
	let pages = Math.ceil(total / perPage);
	let start = (page - 1) * perPage;
	let end = start + perPage;
	let pageResults = objectIDs.slice(start, end);
</script>

<div class="wrapper flow">
	<h1>Search results for "<span class="highlight">{q}</span>"</h1>
	<h2>Showing {pageResults.length} of {total} results</h2>
	{#each pageResults as id}
		<div class="result">
			<a sveltekit:prefetch href="/{id}">{id}</a>
		</div>
	{/each}
</div>

<style lang="scss">
	.highlight {
		color: var(--met-red);
	}
</style>
