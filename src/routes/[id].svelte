<script context="module">
	export const prerender = true;
	export async function load({ page, fetch, session, context }) {
		return {
			props: {
				id: page.params.id
			}
		};
	}
</script>

<script lang="ts">
	import Image from '$lib/Image.svelte';
	import type { MetObject } from '$lib/types';
	import { onMount } from 'svelte';
	import { updateArtistStore } from '$lib/helpers';
	import Firework from 'svelte-loading-spinners/dist/ts/Firework.svelte';
	import { MetRed } from '$lib/constants';
	export let id;
	let image: MetObject;
	let loadingText: HTMLDivElement;
	onMount(async () => {
		const res = await fetch(
			`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
		);
		if (res.ok) {
			const json: MetObject = await res.json();
			image = json;

			// save artist to artist store
			updateArtistStore(json);
		} else {
			console.error(`Failed to load image: ${id}`);
			// loadingText.empty();
			loadingText.innerText = 'No image with id {id}';
		}
	});
</script>

{#if image}
	<Image {image} />
{:else}
	<div bind:this={loadingText} class="center+">
		<Firework color={MetRed} size="5" unit="rem" />
	</div>
{/if}
