<script context="module">
	export async function load({ page }) {
		return {
			props: {
				path: page.path
			}
		};
	}
</script>

<script lang="ts">
	import '../reset.css';
	import '../app.scss';
	import { fade } from 'svelte/transition';
	import { isLoading, notifications, savedImages, user } from '$lib/stores';
	import { navigating } from '$app/stores';
	import HeaderButtons from '$lib/HeaderButtons.svelte';
	import Notifications from '$lib/Notifications.svelte';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import ProgressBarIndicator from '$lib/components/molecules/ProgressBarIndicator.svelte';

	export let path: string;

	$: console.log($navigating);
</script>

<!--
<svelte:head>
	<link rel="preload" href="/fonts/PomfretV2-Regular.woff2" as="font" type="font/woff2" />
	<link rel="preload" href="/fonts/FernVariable-Roman-VF.woff2" as="font" type="font/woff2" />
</svelte:head> -->

{#if $navigating?.to.path.includes('/culture/') || $navigating?.to.path.includes('/artist/')}
	<div out:fade>
		<ProgressBarIndicator complete={$navigating ? true : false} />
	</div>
{/if}

{#if $notifications.length}
	<Notifications />
{/if}

<main>
	<div class="container flow">
		<Header {path} />

		<HeaderButtons
			on:loadingImage={() => ($isLoading = true)}
			on:imageLoaded={() => ($isLoading = false)}
		/>
		<slot />
	</div>
	<!-- <noscript> Please enable Javascript to use this app. </noscript> -->
</main>

<!-- <Footer /> -->
<style lang="scss">
	main {
		padding: 1em 1em 2em;
	}

	.header {
		h1 {
			text-transform: uppercase;
		}
		a {
			text-decoration: none;
		}
	}
	.counter {
		&--desktop,
		&--mobile {
			font-family: 'Fern Web', Georgia, serif;
			a {
				text-decoration: none;
			}
		}
		&--desktop {
		}
		&--mobile {
			--flow-space: 0;
			display: none;
			right: -3px;
			top: -3px;
			// background: var(--met-red-lighter);
			// color: white;
			z-index: 9;
			// font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			// 	'Open Sans', 'Helvetica Neue', sans-serif;
			// font-weight: 700;
			// filter: invert(100%);
			a {
				// border-radius: 100%;
				// padding: 0.5rem 0.75rem;
				display: block;
			}
		}
	}
	.counter--desktop,
	.counter--mobile {
		position: absolute;
		top: 0;
		right: 0;
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
