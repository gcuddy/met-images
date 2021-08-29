<script context="module">
	export async function load({ page, fetch, session, context }) {
		return {
			props: {
				id: page.params.id
			}
		};
	}
</script>

<script lang="ts">
	import HeaderButtons from '$lib/HeaderButtons.svelte';
	import Image from '$lib/Image.svelte';
	import type { MetObject } from '$lib/types';
	import { onMount } from 'svelte';
	export let id;
	let image: MetObject;
	let loadingText: HTMLElement;
	onMount(async () => {
		const res = await fetch(
			`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
		);
		if (res.ok) {
			const json: MetObject = await res.json();
			image = json;
		} else {
			console.error(`Failed to load image: ${id}`);
			loadingText.innerText = 'No image with id {id}';
		}
	});
</script>

{#if image}
	<Image {image} />
{:else}
	<p bind:this={loadingText}>Loading...</p>
{/if}
