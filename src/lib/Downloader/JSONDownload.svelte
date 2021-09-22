<script lang="ts">
	import { notifications } from '$lib/stores';

	import type { MetObject } from '$lib/types';

	export let images: MetObject[];
	const json = JSON.stringify(images, null, 2);
	let textarea: HTMLTextAreaElement;
	function copy() {
		textarea.select();
		document.execCommand('copy');
		notifications.notify('Copied to clipboard');
	}
</script>

<textarea readonly on:focus={copy} bind:this={textarea} value={json} />

<style>
	textarea {
		width: 100%;
		height: 20rem;
		font-size: var(--step--2);
		padding: var(--space-3xs);
		background: var(--color-bg);
		font-family: Menlo, monospace;
	}
</style>
