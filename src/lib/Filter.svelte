<script lang="ts">
	import { FilterIcon, LogInIcon } from 'svelte-feather-icons';
	import { savedImages } from './stores';
	import { blur } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import type { MetObject } from './types';
	import { MetRed } from './constants';
	let showFilter = false;
	export let filteredImages: MetObject[];
	let clicked = false;
	$: departments = [...new Set(filteredImages.map((i) => i.department))];

	function handleClick(department: string) {
		console.log(department);
		if (!clicked) {
			filteredImages = filteredImages.filter((i) => i.department === department);
			clicked = true;
		} else {
			filteredImages = $savedImages.slice();
			clicked = false;
		}
		console.log(filteredImages);
	}
</script>

<div>
	<button class="filter" on:click={() => (showFilter = !showFilter)} class:active={showFilter}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			fill={clicked ? MetRed : 'none'}
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="feather feather-filter "
			><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg
		></button
	>
	{#if showFilter}
		<div class="filter-options" transition:blur>
			{#each departments as department}
				<button class="filter-option" on:click={() => handleClick(department)}>
					{department}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	div {
		position: relative;
	}
	.filter {
		background: transparent;
		color: black;
		fill: #000;
		svg {
			background: inherit;
			color: black;
		}
	}
	.filter.active {
		box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
	}
	.filter-options {
		position: absolute;
		right: 2rem;
		display: flex;
		width: max(15em, 100%);
		flex-wrap: wrap;
		background: rgba(220, 220, 220, 0.6);
		padding: 1rem;
		border-radius: 1rem;
		gap: 0.25rem;
		z-index: 99;
	}
	.filter-option {
		font-size: var(--step--2);
	}
</style>
