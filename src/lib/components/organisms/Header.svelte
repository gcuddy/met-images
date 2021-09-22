<script lang="ts">
	import InboxIcon from '../atoms/icons/InboxIcon.svelte';
	import Badge from '../atoms/Badge.svelte';
	import { savedImages } from '$lib/stores';
	import SearchBar from '../molecules/SearchBar.svelte';
	export let path: string = '';
	import { fly } from 'svelte/transition';

	import { spring } from 'svelte/motion';

	const displayedCount = spring();
	$: displayedCount.set($savedImages.length);
	$: offset = modulo($displayedCount, 1);

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}
</script>

<header class="header">
	<div class="search">
		<!-- <SearchBar /> -->
	</div>
	<h1><a href="/">met explorer</a></h1>
	<div class="counter">
		<div class="counter--mobile">
			<a href="/saved">
				<InboxIcon size="1.3em" fill={path === '/saved' ? 'var(--button-active)' : 'none'} /><Badge
					count={$savedImages.length}
				/></a
			>
		</div>
		<div class="counter--desktop">
			<a href="/saved"
				><InboxIcon size=".75em" />
				<span>{$savedImages.length}</span> saved image{$savedImages.length > 1 ? 's' : ''}
			</a>
		</div>
	</div>
</header>

<style lang="scss">
	header {
		display: grid;
		grid-template-columns: 1fr 4fr 1fr;
		align-items: baseline;
		h1 {
			text-transform: uppercase;
			text-align: center;
		}
		a {
			text-decoration: none;
		}
	}
	.counter {
		justify-self: center;
		&--desktop,
		&--mobile {
			font-family: 'Fern Web', Georgia, serif;
			white-space: nowrap;
			a {
				text-decoration: none;
			}
		}
		&--mobile {
			--flow-space: 0;
			display: none;
			right: -3px;
			top: -3px;
			z-index: 9;
			a {
				display: block;
				width: 1.3em;
				position: relative;
			}
		}
	}
	.counter--desktop,
	.counter--mobile {
		position: relative;
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
</style>
