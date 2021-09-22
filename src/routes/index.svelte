<script lang="ts">
	import '$lib/scss/utilities/center.scss';

	import { Firework } from 'svelte-loading-spinners';

	import Image from '$lib/Image.svelte';
	import { currentImage, isLoading, user } from '$lib/stores';
	import { MetRed } from '$lib/constants';
	import supabase from '$lib/db';

	user.set(supabase.auth.user());
	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session.user);
	});
</script>

<svelte:head>
	<title>Met Explorer</title>
</svelte:head>
<!-- <HeaderButtons on:loadingImage={() => (loading = true)} on:imageLoaded={() => (loading = false)} /> -->
{#if $isLoading}
	<div class="center+">
		<Firework color={MetRed} size="5" unit="rem" />
	</div>
{:else if $currentImage}
	<Image image={$currentImage} />
{/if}
