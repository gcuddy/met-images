<script lang="ts">
	import { flip } from 'svelte/animate';
	import { activeSavedItem, artistStore, disableGlobalShortcuts, savedImages } from '$lib/stores';
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
	import Search from '$lib/components/atoms/Search.svelte';
	import slugify from 'slugify';
	import Downloader from '$lib/Downloader.svelte';

	const metaInfo = [
		// 'department',
		// 'objectDate',
		'isHighlight',
		'GalleryNumber'
	];

	// Filter Variables
	let showFilter = false;
	let selectedDepartments = [];
	let filteredIds = [];

	// todo: multiple selection
	let selectedItems = [];

	//Download variables
	let showDownloadPopup = false;
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

	//Focus Variables
	let list: HTMLElement;
	let links: HTMLElement[] = [];
	let active: HTMLElement;
	let savedImageDivs: HTMLElement[] = [];

	// todo: persist focused item for when user goes back to the list (handle page nav)

	const handleGlobalKeyboardShortcuts = (event: KeyboardEvent) => {
		if ($disableGlobalShortcuts) return;
		switch (event.code) {
			case 'Escape': {
				event.preventDefault();
				if (showDownloadPopup) {
					showDownloadPopup = false;
					break;
				}
				// clear filters if nothing selected
				console.log(document.activeElement);
				console.log(searchInput);
				if (document.activeElement !== searchInput && !showFilter) {
					selectedDepartments = [];
					searchTerm = '';
					// $disableGlobalSfhortcuts = false;
					break;
				}
				break;
			}
			case 'KeyJ': {
				// this will jump to first item or last focused item globally
				event.preventDefault();
				navigateForward();
				break;
			}
			case 'KeyK': {
				event.preventDefault();
				navigateBackward();
				break;
			}
			case 'Slash': {
				event.preventDefault();
				searchInput.focus();
				break;
			}
			case 'KeyF': {
				// bring up filter menu if nothing selected and not in search
				if (!selectedItems.length) {
					event.preventDefault();
					showFilter = !showFilter;
				}
				break;
			}
		}
		switch (event.key) {
			case 'd':
			case 'D': {
				event.preventDefault();
				showDownloadPopup = !showDownloadPopup;
			}
		}
	};
	const handleClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (showFilter && !target.closest('.filter-container')) {
			showFilter = false;
		}
	};

	const handleKeyboardNav = (event: KeyboardEvent) => {
		active = document.activeElement as HTMLElement;
		switch (event.code) {
			// J or arrow down to next item
			case 'ArrowDown': {
				event.preventDefault();
				navigateForward();
				break;
			}
			case 'ArrowUp': {
				event.preventDefault();
				navigateBackward();
				break;
			}
			case 'KeyX': {
				event.preventDefault();
				const activeID = parseInt(active.dataset.id);
				if (selectedItems.includes(activeID)) {
					selectedItems = selectedItems.filter((id) => id !== activeID);
				} else {
					selectedItems = [...selectedItems, activeID];
				}
				break;
			}
		}
	};
	const navigateForward = () => {
		let index = links.indexOf(active);
		console.log(index);
		if (index === -1) {
			// if no active item, jump to first item
			links[0].focus();
			console.log(links[0]);
			active = links[0];
			return;
		}
		const next = links[index + 1];
		if (next) {
			next.focus();
			active = next;
		}
	};
	const navigateBackward = () => {
		let index = links.indexOf(active);
		const prev = links[index - 1];
		if (prev) {
			prev.focus();
			active = prev;
		}
	};
	let searchInput: HTMLInputElement;
	let searchTerm = '';
	let filteredImages = $savedImages.slice();
	$: filteredImages = $savedImages.filter(
		(image) =>
			(filteredIds.length ? filteredIds.includes(image.objectID) : true) &&
			(image.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
				image.artistDisplayName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
	);
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

	// focus controller
	const setUpFocus = (e: FocusEvent) => {
		// this is called when an anchor element gets focused, we start our roving tabindex focus controller
		const target = e.target as HTMLElement;
		links.forEach((link) => {
			if (link) {
				link.tabIndex = -1;
			}
		});
		target.tabIndex = 0;
		target.focus();
		// now remove the event listeners
		links.forEach((link) => {
			if (link) link.removeEventListener('focus', setUpFocus);
		});
	};
	const handleFocus = (e: FocusEvent) => {
		const target = e.target as HTMLElement;

		// remove previous focus-within class
		list.querySelector('.saved-image.focus-within')?.classList.remove('focus-within');

		// set target to new active Element
		active = target;

		// change tabindex
		links.forEach((link) => {
			if (link) {
				link.tabIndex = -1;
			}
		});
		active.tabIndex = 0;

		// add .focus-within to parent div
		active.closest('.saved-image').classList.add('focus-within');
	};

	onMount(() => {
		// links = Array.from(list.querySelectorAll('.saved-image__info a'));
	});
</script>

<!-- keyboard shortcut for navigation -->
<svelte:window on:keydown={handleGlobalKeyboardShortcuts} on:click={handleClick} />
<svelte:head><title>Saved Items ({$savedImages.length}) - Met Explorer</title></svelte:head>

<svg style="display: none" xmlns="http://www.w3.org/2000/svg">
	<symbol id="bin-icon" viewBox="0 0 50 50">
		<path
			fill="currentColor"
			d="m20.651 2.3339c-.73869 0-1.3312.59326-1.3312 1.3296v2.5177h-6.3634c-.73887 0-1.3314.59331-1.3314 1.3295v1.1888c0 .73639.59249 1.3289 1.3312 1.3289h7.6948 8.8798 7.6948c.73869 0 1.3312-.59249 1.3312-1.3289v-1.1888c0-.73639-.59249-1.3296-1.3312-1.3296h-6.3634v-2.5177c0-.73639-.59249-1.3296-1.3312-1.3296h-8.8798zm-5.6786 11.897c-1.7775 0-3.2704 1.4889-3.2704 3.274v27.647c0 1.7775 1.4928 3.2704 3.2704 3.2704h20.783c1.7775 0 3.2704-1.4928 3.2704-3.2704v-27.647c0-1.7852-1.4928-3.274-3.2704-3.274h-20.783zm1.839 3.4895h1.1696c.73869 0 1.3389.60018 1.3389 1.3466v24.247c0 .74638-.60018 1.3389-1.3389 1.3389h-1.1696c-.73869 0-1.3389-.59249-1.3389-1.3389v-24.247c0-.74638.60018-1.3466 1.3389-1.3466zm7.6948 0h1.1696c.73869 0 1.3389.60018 1.3389 1.3466v24.247c0 .74638-.60018 1.3389-1.3389 1.3389h-1.1696c-.73869 0-1.3389-.59249-1.3389-1.3389v-24.247c0-.74638.60018-1.3466 1.3389-1.3466zm7.6948 0h1.1696c.73869 0 1.3389.60018 1.3389 1.3466v24.247c0 .74638-.60018 1.3389-1.3389 1.3389h-1.1696c-.73869 0-1.3389-.59249-1.3389-1.3389v-24.247c0-.74638.60018-1.3466 1.3389-1.3466z"
		/>
	</symbol>
</svg>
<div class="saved-images flow">
	<Search bind:searchTerm bind:searchInput placeholder="Filter" />

	<ul
		class="saved-images-list flow"
		class:selected-items={selectedItems.length}
		bind:this={list}
		on:keydown={handleKeyboardNav}
	>
		<div class="list-actions" class:selected={selectedItems.length > 0}>
			{#if $savedImages.length > 0}
				<button
					class="list-actions__download"
					on:click={() => (showDownloadPopup = !showDownloadPopup)}
					style="--flow-space: 0;"
					>Download {selectedItems.length || filteredImages.length} items</button
				>
			{/if}
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
			{#if $savedImages.length > 0}
				<Filter bind:filteredImages bind:showFilter bind:selectedDepartments bind:filteredIds />
			{/if}
		</div>
		{#each filteredImages as image, index (image.objectID)}
			<li animate:flip={{ duration: 250 }}>
				<div class="saved-image" bind:this={savedImageDivs[index]} class:focus-within={false}>
					<div class="saved-image__icon">
						<img
							src={image.primaryImageSmall}
							alt="Thumbnail for {image.title}"
							data-id={image.objectID}
							class:hidden={selectedItems.includes(image.objectID)}
							loading="lazy"
						/>
						<div class="bulk-actions">
							<input
								aria-hidden="true"
								type="checkbox"
								bind:group={selectedItems}
								value={image.objectID}
								on:click={(e) => handleShiftSelect(e, image.objectID)}
								on:focus={(e) => e.target.closest('.saved-image').querySelector('a').focus()}
								tabindex="-1"
							/>
						</div>
					</div>
					<div class="saved-image__info flow">
						<h2>
							<!-- would love to have a version where i find out which is the first focused, ie from bottom... -->
							<a
								on:focus|once={setUpFocus}
								href="/{image.objectID}"
								data-id={image.objectID}
								on:focus={handleFocus}
								bind:this={links[index]}
								>{@html image.title}
							</a>
						</h2>
						<div class="saved-image__meta">
							<p class="artist">
								{image.artistDisplayName}
							</p>
							<div class="meta-info">
								{#each metaInfo as info}
									{#if image[info]}
										<span
											class={info}
											title={info === 'iåsHighlight' ? 'Highlighted image' : undefined}
										>
											{info !== 'isHighlight' ? image[info] : ''}
										</span>
									{/if}
								{/each}
							</div>
						</div>
					</div>
					<!-- remove the trash button for now since I have the select multiple option... -->
					<!-- <button
						on:click={() =>
							($savedImages = $savedImages.filter((i) => i.objectID !== image.objectID))}
						aria-label="delete {image.title}"><svg><use xlink:href="#bin-icon" /></svg></button
					> -->
				</div>
			</li>
		{/each}
	</ul>
	<Downloader {selectedItems} {filteredImages} bind:showDownloadPopup />
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

		&.selected {
			position: sticky;
			top: var(--space-3xs);
			z-index: 9;
			color: #fff;

			.list-actions {
				&__download {
					top: 0;
					right: 0;
				}
			}
		}
	}
	.hidden {
		visibility: hidden;
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
			--flow-space: 0.5em;
			&::before {
				position: absolute;
				content: '';
				width: 100%;
				background: linear-gradient(45deg, var(--met-red), var(--met-red-lighter));
				height: 1px;
				z-index: 10;
			}
		}
	}
	.saved-image {
		display: flex;
		// gap: 1.5rem;
		// old safari doesn't support gap...
		> *:not(:first-child) {
			margin-left: 1.5rem;
		}
		font-size: var(--step-0);
		align-items: center;
		padding: var(--space-3xs) var(--space-2xs);
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
			position: relative;
			h2 {
				font-size: var(--step-0);
				text-overflow: ellipsis;
				overflow: hidden;

				a::before {
					content: '';
					left: 0;
					top: 0;
					bottom: 0;
					right: 0;
					position: absolute;
				}
			}
			p {
				font-size: var(--step--1);
			}
			.artist a {
				text-decoration: none;
			}
		}
		&__meta {
			font-size: var(--step--1);
			display: flex;
			justify-content: space-between;
			.GalleryNumber {
				color: var(--met-red);
			}
			.isHighlight {
				&::before {
					content: '⭐️';
					@media (prefers-color-scheme: dark) {
						filter: invert(1);
					}
				}
			}
		}
		// styling focus ring
		&:focus-within {
			a {
				outline: none;
			}
			input[type='checkbox'] {
				box-shadow: 0 0 0 3px var(--color-secondary) !important;
			}
		}
		&:focus-within,
		&.focus-within {
			input[type='checkbox']::before {
				content: '';
				position: absolute;
				top: 50%;
				left: -1rem;
				left: calc(-1 * var(--space-xs));
				border-radius: 100%;
				width: 6px;
				height: 6px;
				background: hsl(var(--hsl-secondary) / 30%);
				pointer-events: none;
				// add arrow here
			}
		}
		&:focus-within {
			input[type='checkbox']::before {
				background: hsl(var(--hsl-secondary) / 60%);
			}
		}
		&:hover {
			background-color: rgb(var(--rgb-light-accent));
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
