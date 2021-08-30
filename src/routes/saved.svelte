<script lang="ts">
	import { flip } from 'svelte/animate';
	import { disableGlobalShortcuts, savedImages } from '$lib/stores';
	import { afterUpdate, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isOutOfViewport } from '$lib/helpers';

	// todo: multiple selection
	let selectedItems = [];
	$: console.log(selectedItems);

	let activeLookup = new Map();
	let activeID: number;
	let items: Map<number, HTMLElement> = new Map();
	const handleKeyboardShortcuts = (event: KeyboardEvent) => {
		if ($disableGlobalShortcuts) return;
		console.log(event.code);
		switch (event.code) {
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
					selectedItems = [...selectedItems, activeID];
					break;
				}
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
	$: console.log(searchTerm);
	$: filteredImages = $savedImages.filter(
		(image) => image.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);
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

<svg style="display: none" xmlns="http://www.w3.org/2000/svg">
	<symbol id="bin-icon" viewBox="0 0 50 50">
		<path
			fill="currentColor"
			d="m20.651 2.3339c-.73869 0-1.3312.59326-1.3312 1.3296v2.5177h-6.3634c-.73887 0-1.3314.59331-1.3314 1.3295v1.1888c0 .73639.59249 1.3289 1.3312 1.3289h7.6948 8.8798 7.6948c.73869 0 1.3312-.59249 1.3312-1.3289v-1.1888c0-.73639-.59249-1.3296-1.3312-1.3296h-6.3634v-2.5177c0-.73639-.59249-1.3296-1.3312-1.3296h-8.8798zm-5.6786 11.897c-1.7775 0-3.2704 1.4889-3.2704 3.274v27.647c0 1.7775 1.4928 3.2704 3.2704 3.2704h20.783c1.7775 0 3.2704-1.4928 3.2704-3.2704v-27.647c0-1.7852-1.4928-3.274-3.2704-3.274h-20.783zm1.839 3.4895h1.1696c.73869 0 1.3389.60018 1.3389 1.3466v24.247c0 .74638-.60018 1.3389-1.3389 1.3389h-1.1696c-.73869 0-1.3389-.59249-1.3389-1.3389v-24.247c0-.74638.60018-1.3466 1.3389-1.3466zm7.6948 0h1.1696c.73869 0 1.3389.60018 1.3389 1.3466v24.247c0 .74638-.60018 1.3389-1.3389 1.3389h-1.1696c-.73869 0-1.3389-.59249-1.3389-1.3389v-24.247c0-.74638.60018-1.3466 1.3389-1.3466zm7.6948 0h1.1696c.73869 0 1.3389.60018 1.3389 1.3466v24.247c0 .74638-.60018 1.3389-1.3389 1.3389h-1.1696c-.73869 0-1.3389-.59249-1.3389-1.3389v-24.247c0-.74638.60018-1.3466 1.3389-1.3466z"
		/>
	</symbol>
</svg>
<div class="saved-images flow">
	<input
		class="saved-images__search"
		type="text"
		bind:value={searchTerm}
		bind:this={searchInput}
		placeholder="Search"
		on:focus={() => ($disableGlobalShortcuts = true)}
		on:blur={() => ($disableGlobalShortcuts = false)}
	/>
	{#if selectedItems.length > 0}
		<div class="saved-images__selected-actions">
			<button
				on:click={() => {
					$savedImages = $savedImages.filter((i) => !selectedItems.includes(i.objectID));
					selectedItems = [];
				}}>Delete Selected Items</button
			>
		</div>
	{/if}
	<ul class="flow">
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
							/>
						</div>
					</div>
					<div class="saved-image-info">
						<h2><a href="/{image.objectID}">{@html image.title}</a></h2>
						{#if image.artistDisplayName}
							<p>{image.artistDisplayName}</p>
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
</div>

<style lang="scss">
	.hidden {
		visibility: hidden;
	}
	.active {
		img {
			border: 3px solid var(--met-red);
		}
		input[type='checkbox']:checked::after {
			border-color: var(--met-red-lighter);
		}
	}
	li:focus img {
		border: 3px solid var(--met-red);
	}
	.saved-images {
		margin: 2rem auto 0;
		max-width: 800px;

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
	}
	.saved-image {
		display: flex;
		gap: 1.5rem;

		&__icon {
			position: relative;
		}
	}
	.saved-image-info {
		flex: 1;
	}
	img {
		border-radius: 100%;
		width: 100px;
		height: 100px;
		object-fit: cover;
		position: relative;
	}
	// img:hover {
	// 	opacity: 0;
	// 	+ .bulk-actions input {
	// 		opacity: 1;
	// 	}
	// }
	.bulk-actions {
		position: absolute;
		width: 100px;
		height: 100px;
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
	}
	input[type='checkbox']:checked::after {
		content: '';
		background: url(/check.svg) no-repeat center;
		background-size: auto 3.5em;
		border: 3px solid var(--met-red);
		position: absolute;
		border-radius: 100%;
		top: 0.25rem;
		right: 0.25rem;
		bottom: 0.25rem;
		left: 0.25rem;
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
	}
	.saved-images__selected-actions {
		position: sticky;
		top: 1rem;
		background: transparent;
		button {
			display: block;
			margin-left: auto;
			margin-right: auto;
		}
	}
</style>
