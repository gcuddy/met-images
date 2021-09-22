<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { MetRed } from '$lib/constants';

	export let complete = false;
	const progress = tweened(0, {
		duration: 3500,
		easing: cubicOut
	});
	onMount(() => {
		progress.set(0.7);
	});

	$: if (complete) progress.set(1, { duration: 1000 });
</script>

<div class="progress-bar">
	<div class="progress-sliver" style={`width: ${$progress * 100}%; background-color: ${MetRed}`} />
</div>

<style lang="scss">
	.progress-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 0.5rem;
	}
	.progress-sliver {
		height: 100%;
	}
</style>
