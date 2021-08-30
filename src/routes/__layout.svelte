<script lang="ts">
	import { isLoading, savedImages } from '$lib/stores';
	import HeaderButtons from '$lib/HeaderButtons.svelte';
	import { fly } from 'svelte/transition';
	import '../app.css';
</script>

<main>
	<div class="container flow">
		<div class="header flow">
			<h1><a href="/">Met app</a></h1>
		</div>
		{#if $savedImages.length}
			<div class="counter--desktop">
				<a href="/saved"
					><span>{$savedImages.length}</span> saved image{$savedImages.length > 1 ? 's' : ''}
				</a>
			</div>
			<div class="counter--mobile">
				<a href="/saved"><span>{$savedImages.length}</span> </a>
			</div>
		{/if}
		<HeaderButtons
			on:loadingImage={() => ($isLoading = true)}
			on:imageLoaded={() => ($isLoading = false)}
		/>
		<slot />
	</div>
	<noscript> Please enable Javascript to use this app. </noscript>
</main>

<style>
	main {
		padding: 1em 1em 2em;
	}
	.counter--desktop,
	.counter--mobile {
		position: absolute;
		top: 0;
		right: 0;
	}
	.counter--mobile {
		display: none;
		padding: 0.5rem 0.75rem;
		background: var(--met-red-lighter);
		color: white;
		z-index: 9;
		border-radius: 100%;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		font-weight: 700;
	}
	@media screen and (max-width: 768px) {
		.counter--desktop {
			display: none;
		}
		.counter--mobile {
			display: block;
		}
	}
	.header {
		margin-left: auto;
		margin-right: auto;
		max-width: 600px;
		text-align: center;
	}
	.container {
		position: relative;
	}
</style>
