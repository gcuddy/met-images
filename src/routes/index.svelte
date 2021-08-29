<script lang="ts">
	import HeaderButtons from '$lib/HeaderButtons.svelte';

	import Image from '$lib/Image.svelte';
	import { currentImage } from '$lib/stores';
</script>

<svelte:head>
	<title>Met</title>
</svelte:head>
<HeaderButtons />

{#if $currentImage}
	<Image image={$currentImage} />
{/if}

<style>
</style>
