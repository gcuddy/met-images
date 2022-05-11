<script context="module">
	// export const prerender = true;
	export async function load({ page, fetch, session, context }) {
		const res = await fetch(`/${page.params.id}.json`);
		console.log(res);
		const image = await res.json();
		if (res.ok) {
			return {
				props: {
					image
				},
				maxage: 60 * 60 * 24 * 7
			};
		}
		return {
			status: res.status
		};
	}
</script>

<script>
	import Image from '$lib/Image.svelte';

	export let image;
	console.log(image);
</script>

<!-- <pre>
    {JSON.stringify(image, null, 2)}
</pre> -->
{#if image}
	<Image image={image.image} />
{/if}
