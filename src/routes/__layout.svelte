<script lang="ts">
	import { isLoading, savedImages } from '$lib/stores';
	import HeaderButtons from '$lib/HeaderButtons.svelte';
	import { ArchiveIcon } from 'svelte-feather-icons';
	import '../reset.css';
	import '../app.scss';
</script>

<main>
	<div class="container flow">
		<div class="header flow">
			<h1><a href="/">met gallery explorer</a></h1>
		</div>
		{#if $savedImages.length}
			<div class="counter--desktop">
				<a href="/saved"
					><ArchiveIcon size=".75x" /> <span>{$savedImages.length}</span> saved image{$savedImages.length >
					1
						? 's'
						: ''}
				</a>
			</div>
			<div class="counter--mobile">
				<a href="/saved"><span>{$savedImages.length}</span></a>
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

<style lang="scss">
	main {
		padding: 1em 1em 2em;
	}

	.header {
		h1 {
			font-size: var(--step-1);
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
			background: var(--met-red-lighter);
			color: white;
			z-index: 9;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
				'Open Sans', 'Helvetica Neue', sans-serif;
			font-weight: 700;
			filter: invert(100%);
			a {
				border-radius: 100%;
				padding: 0.5rem 0.75rem;
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
