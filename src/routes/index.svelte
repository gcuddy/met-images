<script lang="ts">
	import HeaderButtons from '$lib/HeaderButtons.svelte';

	import { Firework } from 'svelte-loading-spinners';

	import Image from '$lib/Image.svelte';
	import { currentImage, isLoading } from '$lib/stores';
	import { MetRed } from '$lib/constants';

	// let loading = false;
</script>

<svelte:head>
	<title>Met</title>
</svelte:head>
<!-- <HeaderButtons on:loadingImage={() => (loading = true)} on:imageLoaded={() => (loading = false)} /> -->
{#if $isLoading}
	<Firework color={MetRed} />
{:else if $currentImage}
	<Image image={$currentImage} />
{/if}

<style>
</style>
