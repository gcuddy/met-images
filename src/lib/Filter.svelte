<script lang="ts">
	import { savedImages } from './stores';
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import type { MetObject } from './types';
	import { MetRed } from './constants';
	export let showFilter = false;
	export let filteredImages: MetObject[];
	let clicked = false;
	let button: HTMLButtonElement;
	let filterModal: HTMLElement;

	const meta = {
		onView: {
			text: 'On View',
			checked: false,
			items: []
		},
		isHighlight: {
			text: 'Is Highlight',
			checked: false,
			items: []
		}
	};

	$: departments = [...new Set(filteredImages.map((i) => i.department))];

	$: meta.onView.items = filteredImages.filter((i) => i.GalleryNumber);
	$: meta.isHighlight.items = filteredImages.filter((i) => i.isHighlight);
	//todo: trap focus when open, restore focus when closed
	// $: if (showFilter) button && button.focus();

	export let selectedDepartments = [];

	export let filteredIds: number[];

	$: filteredIds = Array.from(
		new Set(
			filteredImages
				.filter((i) => selectedDepartments?.includes(i.department))
				.concat(meta.onView.checked ? meta.onView.items : [])
				.concat(meta.isHighlight.checked ? meta.isHighlight.items : [])
				.map((i) => i.objectID)
		)
	);

	const handleKeydown = (e: KeyboardEvent) => {
		// make escape key close filter
		switch (e.key) {
			case 'Escape': {
				showFilter = false;
				break;
			}
		}
	};

	// function setUpFocus() {
	// 	if (!filterModal) return;
	// 	const inputs = filterModal.querySelectorAll('input');
	// 	inputs[0].focus();
	// }
	// refactor to use same focus controller as saved
	// function handleFocus(e: FocusEvent) {
	// 	const inputs = filterModal.querySelectorAll('input');
	// 	inputs.forEach((input) => {
	// 		if (input) {
	// 			input.tabIndex = -1;
	// 		}
	// 	});
	// 	const target = e.target as HTMLElement;
	// 	target.tabIndex = 0;
	// }
</script>

<!-- TODO: proper keyboard nav -->

<svelte:window on:keydown={handleKeydown} />
<div class="filter-container">
	<button
		class="filter"
		on:click={() => (showFilter = !showFilter)}
		class:active={showFilter}
		bind:this={button}
	>
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
		<div class="filter-options flow" transition:fly bind:this={filterModal}>
			<div class="meta">
				{#each Object.keys(meta) as key}
					{#if meta[key].items.length}
						<div class="filter-option">
							<label>
								<input type="checkbox" bind:checked={meta[key].checked} />
								<span>{meta[key].text}</span>
							</label>
						</div>
					{/if}
				{/each}
			</div>
			<div class="departments">
				<h3>Departments</h3>
				{#each departments as department}
					<label class="filter-option">
						<input type="checkbox" bind:group={selectedDepartments} value={department} />
						{department}
					</label>
				{/each}
			</div>
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
		width: max(15em, 100%);
		// flex-wrap: wrap;
		background: rgba(220, 220, 220, 0.6);
		padding: 1rem;
		border-radius: 1rem;
		z-index: 99;
		-webkit-backdrop-filter: blur(8px);
		backdrop-filter: blur(8px);
		color: var(--text);
		> div {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			background-color: transparent;
		}
	}
	.departments {
		h3 {
			font-size: var(--step--1);
			text-transform: lowercase;
			+ * {
				margin-top: 0.5rem;
			}
		}
	}
	.filter-option {
		font-size: var(--step--2);
	}
	.meta {
		color: var(--met-red);
	}
</style>
