<script lang="ts">
	import type { MetObject } from '$lib/types';

	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { download } from '../download';

	export let images: MetObject[];
	console.log(images);

	//Download variables
	let downloadText = 'Loading...';
	const downloadProgess = tweened(0, {
		duration: 200,
		easing: cubicOut
	});
	download(images, (num: number) => {
		downloadProgess.set(num);
		num <= 0.5 ? (downloadText = 'Download images...') : (downloadText = 'Generating zip file...');
		if (num === 1) {
			downloadText = `Downloaded ${images.length} image${images.length > 1 ? 's' : ''}`;
		}
	});
</script>

<div class="download-progress">
	<p id="download-label">{downloadText}</p>
	{#if $downloadProgess < 1}
		<p>{Math.round($downloadProgess * 100)}%</p>
		<progress value={$downloadProgess} />
	{/if}
</div>

<style lang="scss">
	progress {
		display: block;
		width: 100%;
		border-radius: 0.25rem;
	}
</style>
