<script lang="ts">
	import { notifications } from '$lib/stores';

	import type { MetObject } from '$lib/types';

	export let images: MetObject[];

	let markdown: string = `![${images[0].title}](${images[0].primaryImage})`;
	let textarea: HTMLTextAreaElement;

	console.log(images);
	for (const image of images.slice(1)) {
		if (image) {
			markdown += `\n\n![${image.title}](${image.primaryImage})`;
		}
	}
	markdown.trim();
	console.log(markdown);
	function copy() {
		textarea.select();
		document.execCommand('copy');
		notifications.notify('Copied to clipboard');
	}
</script>

<!-- todo: add copy -->
<textarea readonly on:focus={copy} bind:this={textarea} value={markdown} />

<style>
	textarea {
		width: 100%;
		height: 20rem;
		font-size: var(--step--2);
		padding: var(--space-3xs);
		background: var(--color-bg);
	}
</style>
