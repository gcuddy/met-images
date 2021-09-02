<script lang="ts">
	import { flip } from 'svelte/animate';
	import { artistStore, disableGlobalShortcuts, savedImages } from '$lib/stores';
	import { afterUpdate, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isOutOfViewport } from '$lib/helpers';
	import { fly, slide, fade } from 'svelte/transition';
	import { FilterIcon, Trash2Icon } from 'svelte-feather-icons';
	import type { MetObject } from '$lib/types';
	import { download } from '$lib/download';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { MetRed } from '$lib/constants';
	import { Jumper } from 'svelte-loading-spinners';
	import Filter from '$lib/Filter.svelte';
	import Search from '$lib/Search.svelte';
	import slugify from 'slugify';

	// todo: multiple selection
	let selectedItems = [];
	$: console.log(selectedItems);

	let activeLookup = new Map();
	let showDownloadPopup = false;
	let activeID: number;
	let items: Map<number, HTMLElement> = new Map();
	const handleKeyboardShortcuts = (event: KeyboardEvent) => {
		if ($disableGlobalShortcuts) return;
		console.log(event.code);
		switch (event.code) {
			case 'Escape': {
				event.preventDefault();
				if (showDownloadPopup) {
					showDownloadPopup = false;
				}
				break;
			}
			case 'KeyJ': {
				event.preventDefault();
				// this might be a stupid way to do this, but it works
				// should I instead set focus? tabindex etc?
				setActive('forward');
				break;
			}
			case 'KeyK': {
				event.preventDefault();
				// this might be a stupid way to do this, but it works
				setActive('backwards');
				break;
			}
			case 'Enter': {
				if (activeID) {
					goto(`${activeID}`);
				}
				break;
			}
			case 'KeyX': {
				if (activeID) {
					event.preventDefault();
					if (selectedItems.includes(activeID)) {
						selectedItems = selectedItems.filter((id) => id !== activeID);
					} else {
						selectedItems = [...selectedItems, activeID];
					}
					break;
				}
				break;
			}
			case 'Slash': {
				event.preventDefault();
				searchInput.focus();
				break;
			}
		}
	};

	const setActive = (direction: 'forward' | 'backwards') => {
		// find the first item in activeLookup that is false and set it to true
		const lookup = Array.from(activeLookup.keys());
		console.log(lookup);
		let index = 0;
		for (const [key, value] of activeLookup) {
			if (value) {
				// set the value to false
				activeLookup.set(key, false);
				// set next loop item to true
				if (direction === 'forward') {
					if (lookup[index + 1]) {
						activeID = lookup[index + 1];
						console.log(activeID);
						activeLookup = activeLookup.set(lookup[index + 1], true);
					}
					index++;
					return;
				} else if (direction === 'backwards') {
					if (lookup[index - 1]) {
						activeID = lookup[index - 1];
						activeLookup = activeLookup.set(lookup[index - 1], true);
					}
					index++;
					return;
				}
			} else {
				index++;
			}
		}
		// if nothing was true, then just jump to first item
		let item = direction === 'forward' ? 0 : lookup.length - 1;
		activeLookup = activeLookup.set(lookup[item], true);
		activeID = lookup[item];
	};

	let searchInput: HTMLInputElement;
	let searchTerm = '';
	let filteredImages = $savedImages.slice();
	$: console.log(searchTerm);
	// $: filteredImages = $savedImages.filter(
	// 	(image) =>
	// 		image.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
	// 		image.artistDisplayName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	// );
	function handleShiftSelect(event: MouseEvent, id: number) {
		if (event.shiftKey) {
			event.preventDefault();
			let index = filteredImages.findIndex((image) => image.objectID === id);
			let selectedBeforeIndex = [...filteredImages.slice(0, index)]
				.reverse()
				.findIndex((image) => selectedItems.includes(image.objectID));
			var count = filteredImages.slice(0, index).length;
			selectedBeforeIndex =
				selectedBeforeIndex >= 0 ? count - selectedBeforeIndex : selectedBeforeIndex;
			if (index > selectedBeforeIndex) {
				// items before last selected
				let itemsBefore = [...selectedItems.slice(0, selectedBeforeIndex)];

				let selectedAfterIndex = [...filteredImages.slice(index + 1)];
			}
			// let last = selectedItems[selectedItems.length - 1];
			// let lastSelectedIndex = filteredImages.findIndex((image) => image.objectID === last);
			// if (index > lastSelectedIndex) {
			// 	console.log('true');
			// }
		}
	}

	let loadingDownload = false;
	const downloadProgess = tweened(0, {
		duration: 600,
		easing: cubicOut
	});
	let downloadPopup: HTMLElement;
	const downloadImages = async (images: MetObject[]) => {
		loadingDownload = true;
		await download(images, (num: number) => {
			downloadProgess.set(num);
			if (num === 1) loadingDownload = false;
		});
	};
	onMount(() => {
		// do I want to retain this activeLookup state when coming back to it?
		$savedImages.forEach((image) => {
			activeLookup.set(image.objectID, false);
		});
	});
	// scroll to active
	afterUpdate(() => {
		if (activeID) {
			// wait this doesn't even need to be a map..
			let item = items[activeID];
			if (item && isOutOfViewport(item)) {
				item.scrollIntoView({
					behavior: 'auto',
					block: 'center',
					inline: 'center'
				});
			}
		}
	});
</script>

<!-- keyboard shortcut for navigation -->
<svelte:window on:keydown={handleKeyboardShortcuts} />

<!-- TODO: add filter button (category, etc) and "Collections" feature to add works to custom collections -->

<svg style="display: none" xmlns="http://www.w3.org/2000/svg">
	<symbol id="bin-icon" viewBox="0 0 50 50">
		<path
			fill="currentColor"
			d="m20.651 2.3339c-.73869 0-1.3312.59326-1.3312 1.3296v2.5177h-6.3634c-.73887 0-1.3314.59331-1.3314 1.3295v1.1888c0 .73639.59249 1.3289 1.3312 1.3289h7.6948 8.8798 7.6948c.73869 0 1.3312-.59249 1.3312-1.3289v-1.1888c0-.73639-.59249-1.3296-1.3312-1.3296h-6.3634v-2.5177c0-.73639-.59249-1.3296-1.3312-1.3296h-8.8798zm-5.6786 11.897c-1.7775 0-3.2704 1.4889-3.2704 3.274v27.647c0 1.7775 1.4928 3.2704 3.2704 3.2704h20.783c1.7775 0 3.2704-1.4928 3.2704-3.2704v-27.647c0-1.7852-1.4928-3.274-3.2704-3.274h-20.783zm1.839 3.4895h1.1696c.73869 0 1.3389.60018 1.3389 1.3466v24.247c0 .74638-.60018 1.3389-1.3389 1.3389h-1.1696c-.73869 0-1.3389-.59249-1.3389-1.3389v-24.247c0-.74638.60018-1.3466 1.3389-1.3466zm7.6948 0h1.1696c.73869 0 1.3389.60018 1.3389 1.3466v24.247c0 .74638-.60018 1.3389-1.3389 1.3389h-1.1696c-.73869 0-1.3389-.59249-1.3389-1.3389v-24.247c0-.74638.60018-1.3466 1.3389-1.3466zm7.6948 0h1.1696c.73869 0 1.3389.60018 1.3389 1.3466v24.247c0 .74638-.60018 1.3389-1.3389 1.3389h-1.1696c-.73869 0-1.3389-.59249-1.3389-1.3389v-24.247c0-.74638.60018-1.3466 1.3389-1.3466z"
		/>
	</symbol>
</svg>
<div class="saved-images flow">
	<Search bind:searchTerm bind:searchInput bind:filteredImages />
	<!--
	<input
		class="saved-images__search"
		type="text"
		bind:value={searchTerm}
		bind:this={searchInput}
		placeholder="Search"
		on:focus={() => ($disableGlobalShortcuts = true)}
		on:blur={() => ($disableGlobalShortcuts = false)}
	/> -->

	<ul class="saved-images-list flow" class:selected-items={selectedItems.length}>
		<!-- {#if selectedItems.length > 0}
			<div transition:fly class="saved-images__selected-menu">
				<div>
					<div class="saved-images__selected-actions">
						<button
							on:click={() => {
								$savedImages = $savedImages.filter((i) => !selectedItems.includes(i.objectID));
								selectedItems = [];
							}}
							><Trash2Icon size=".75x" /> Delete {selectedItems.length} Item{selectedItems.length >
							1
								? 's'
								: ''}</button
						>
					</div>
				</div>
			</div>
		{/if} -->
		<div class="list-actions" class:selected={selectedItems.length > 0}>
			<button
				class="list-actions__download"
				on:click={() => (showDownloadPopup = !showDownloadPopup)}
				style="--flow-space: 0;"
				>Download {selectedItems.length || filteredImages.length} items</button
			>
			{#if selectedItems.length > 0}
				<button class="list-actions__toggle" transition:fade on:click={() => (selectedItems = [])}
					>Un-select items</button
				>
				<button
					transition:fade
					on:click={() => {
						$savedImages = $savedImages.filter((i) => !selectedItems.includes(i.objectID));
						selectedItems = [];
					}}
					><Trash2Icon size=".75x" /> Delete {selectedItems.length} Item{selectedItems.length > 1
						? 's'
						: ''}</button
				>
			{/if}
			<!-- <select>
				<option>All</option>
				<option>Selected</option>
			</select> -->
			<Filter bind:filteredImages />
		</div>
		{#each filteredImages as image (image.objectID)}
			<li animate:flip={{ duration: 200 }} bind:this={items[image.objectID]}>
				<div class="saved-image">
					<div class="saved-image__icon" class:active={activeLookup.get(image.objectID)}>
						<img
							src={image.primaryImageSmall}
							alt="Thumbnail for {image.title}"
							data-id={image.objectID}
							data-active={activeLookup.get(image.objectID)}
							class:hidden={selectedItems.includes(image.objectID)}
						/>
						<div class="bulk-actions">
							<input
								aria-hidden="true"
								type="checkbox"
								bind:group={selectedItems}
								value={image.objectID}
								on:click={(e) => handleShiftSelect(e, image.objectID)}
								tabindex="-1"
							/>
						</div>
					</div>
					<div class="saved-image__info flow">
						<h2>
							<a href="/{image.objectID}">{@html image.title}</a>
						</h2>
						{#if image.artistDisplayName}
							<p class="artist">
								<a href="/artist/{slugify(image.artistDisplayName)}">{image.artistDisplayName}</a>
							</p>
						{/if}
					</div>
					<button
						on:click={() =>
							($savedImages = $savedImages.filter((i) => i.objectID !== image.objectID))}
						aria-label="delete {image.title}"><svg><use xlink:href="#bin-icon" /></svg></button
					>
				</div>
			</li>
		{/each}
	</ul>
	{#if showDownloadPopup}
		<div
			class="download-container"
			on:click|stopPropagation|self={() => (showDownloadPopup = false)}
		>
			<div
				class="download-popup flow"
				role="dialog"
				aria-labelledby="download-label"
				bind:this={downloadPopup}
			>
				{#if !loadingDownload}
					<button class="close" on:click={() => (showDownloadPopup = false)}>Close</button>
					<p id="download-label">Select download option.</p>

					<ul class="flow">
						<li>
							<button
								on:click={() =>
									downloadImages(
										selectedItems.length > 0
											? $savedImages.filter((s) => selectedItems.includes(s.objectID))
											: filteredImages
									)}>Images</button
							>
						</li>
						<li>
							<button>Markdown</button>
						</li>
						<li>
							<button>CSV</button>
						</li>
						<li>
							<button>JSON</button>
						</li>
					</ul>
				{:else if !$downloadProgess}
					<p id="download-label">Downloading images...</p>
					<Jumper color={MetRed} size="3" unit="em" />
				{:else if $downloadProgess}
					<div class="download-progress">
						<p id="download-label">Zipping up...</p>
						<p>{Math.round($downloadProgess * 100)}%</p>
						<progress value={$downloadProgess} />
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.list-actions {
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		button {
			background: transparent;
			color: #000;
			padding: 0;
			padding-top: var(--space-3xs-2xs);
		}

		.filter {
		}

		&__toggle {
			// text-indent: -9999px;
			// position: absolute;
			// left: -2rem;
			// height: 1em;
			// width: 1em;
			// background-color: white;
			// z-index: 1;
			// border-radius: 100%;
			// padding: 0;
			// /* padding-top: var(--space-3xs-2xs); */
			// top: calc(50% - var(--space-3xs-2xs));
			// &:hover {
			// 	background: revert !important;
			// }
			// &::before {
			// 	background: url(/assets/x-circle.svg) no-repeat center/100%;
			// 	position: absolute;
			// 	top: 0;
			// 	left: 0;
			// 	content: '';
			// 	width: 1em;
			// 	height: 1em;
			// }
		}
		&.selected {
			position: sticky;
			top: var(--space-3xs);
			z-index: 9;
			// background: linear-gradient(135deg, var(--met-red), var(--met-red-lighter));
			color: #fff;

			.list-actions {
				&__download {
					// position: absolute;
					top: 0;
					right: 0;
					// padding: 0.5rem;
					// background: rgba(0, 0, 0, 0.5);
				}
			}
		}
	}
	.hidden {
		visibility: hidden;
	}
	.active {
		input[type='checkbox'] {
			border: 3px solid var(--color-secondary);
			&::before {
				content: '';
				position: absolute;
				top: 50%;
				left: -1rem;
				left: calc(-1 * var(--space-xs));
				border-radius: 100%;
				width: 6px;
				height: 6px;
				background: var(--met-red);
				pointer-events: none;
				// add arrow here
			}
		}
		input[type='checkbox']:checked {
			::after {
				border-color: var(--met-red);
			}
		}
	}
	li:focus img {
		border: 3px solid var(--met-red);
	}
	.saved-images {
		position: relative;
		margin: 2rem auto 0;
		max-width: 800px;

		&-list {
			// position: relative;
			&::before {
				position: absolute;
				content: '';
				width: 100%;
				background: linear-gradient(45deg, var(--met-red), var(--met-red-lighter));
				height: 1px;
				z-index: 10;
			}
		}

		&__search {
			width: 80%;
			padding: 0.5rem;
			border: 1px solid gray;
			margin-left: auto;
			display: block;
			margin-right: auto;
			border-radius: 0.5rem;
		}
	}
	ul {
		list-style: none;
		padding: 0;
	}
	.saved-image {
		display: flex;
		gap: 1.5rem;
		font-size: var(--step-0);
		align-items: center;
		--flow-space: var(--space-3xs);

		&__icon {
			position: relative;

			&:hover {
				// img {
				// 	filter: brightness(1.1) hue-rotate(5deg) opacity(0.9) saturate(1.3) sepia(0.4);
				// }
				input[type='checkbox']:not(:checked)::after {
					content: '';
					position: absolute;
					width: 100%;
					height: 100%;
					background: rgba(var(--rgb-light-gray), 0.8);
					top: 0;
					left: 0;
					border-radius: 100%;
					border: 0.5rem solid red;
				}
			}
		}
		&__info {
			flex: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			h2 {
				font-size: var(--step-0);
				text-overflow: ellipsis;
				overflow: hidden;
			}
			p {
				font-size: var(--step--1);
			}
			.artist a {
				text-decoration: none;
			}
		}
	}
	img {
		border-radius: 100%;
		width: 3em;
		height: 3em;
		object-fit: cover;
		position: relative;
	}
	.bulk-actions {
		position: absolute;
		width: 3em;
		height: 3em;
		margin: 0 !important;
		z-index: 3;
		background: transparent;
		border-radius: 100%;
		top: 0;
	}
	input[type='checkbox'] {
		position: relative;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		border: 0;
		border-radius: 100%;
		background-color: transparent;
		cursor: pointer;
		-webkit-appearance: none;
		-moz-appearance: none;
		-webkit-tap-highlight-color: transparent;
	}
	input[type='checkbox']:checked {
		background: linear-gradient(135deg, var(--met-red) 0%, var(--met-red-lighter) 100%);
		&::after {
			filter: invert(1);
			content: '';
			background: url(/check.svg) no-repeat center;
			background-size: auto 2.5em;
			// border: 3px solid var(--met-red-lighter);
			position: absolute;
			border-radius: 100%;
			top: 0.25rem;
			right: 0.25rem;
			bottom: 0.25rem;
			left: 0.25rem;
		}
		&:hover {
			background: var(--met-red);
		}
	}
	svg {
		width: 1.5rem;
		height: 1.5rem;
		color: #000;
	}
	.saved-image button {
		border: 0;
		background: transparent;
		margin-left: auto;
		@media screen and (max-width: 768px) {
			display: none;
		}
	}

	.saved-images__selected-menu {
		position: fixed;
		top: 1rem;
		background: linear-gradient(145deg, var(--met-red), var(--met-red-lighter));
		padding: 2rem;
		border-radius: 1rem;
		width: 20rem;
		z-index: 10;
		margin-left: auto;
		margin-right: auto;
		> div {
			position: sticky;
		}
		button {
			display: block;
			margin-left: auto;
			margin-right: auto;
			background: rgba(255, 255, 255, 0.1);
			font-size: var(--step--1);

			&:hover {
				background: var(--met-red);
			}
		}
	}
	.saved-images__selected-actions {
		position: absolute;
		top: 1rem;
		left: 0;
		right: 0;
		width: 20rem;
		margin-left: auto;
		margin-right: auto;
	}
	// might be a more accessible way to do this...
	.download-container {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.08);
		z-index: 9999;
	}
	.download-popup {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: linear-gradient(145deg, rgb(var(--rgb-light-gray)), rgb(var(--rgb-light-accent)));
		padding: 2rem;
		border-radius: 1rem;
		font-size: var(--step-0);
		color: var(--text);
		z-index: 9;
		width: 20rem;

		.close {
			text-indent: -9999px;
			position: absolute;
			top: -8px;
			left: -8px;
			height: 1em;
			width: 1em;
			background-color: white;
			z-index: 1;
			border-radius: 100%;
			padding: 0;
			&:hover {
				background: revert !important;
			}
			&::before {
				background: url(/assets/x-circle.svg) no-repeat center/100%;
				position: absolute;
				top: 0;
				left: 0;
				content: '';
				width: 1em;
				height: 1em;
			}
		}
		button {
			font-size: var(--step-0);
			color: var(--text);
			background: rgba(255, 255, 255, 0.25);
			&:hover {
				background: rgba(255, 255, 255, 0.5);
			}
		}
	}
	progress {
		display: block;
		width: 100%;
		border-radius: 0.25rem;
	}
	ul.selected-items {
		img {
			// filter: brightness(1.1) hue-rotate(5deg) opacity(0.9) saturate(1.3) sepia(0.4);
		}
		.saved-image__icon:hover {
			input[type='checkbox']:not(:checked)::after {
				content: '';
				position: absolute;
				width: 100%;
				height: 100%;
				background: rgba(var(--rgb-light-gray), 0.8);
				top: 0;
				left: 0;
				border-radius: 100%;
				border: 0.5rem solid red;
			}
		}
		input[type='checkbox']:not(:checked)::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			background: transparent;
			top: 0;
			left: 0;
			border-radius: 100%;
			border: 0.5rem solid red;
		}
	}
</style>
