<script lang="ts">
	import type { MetObject } from './types';
	import { slide } from 'svelte/transition';
	import { createEventDispatcher, onMount } from 'svelte';
	import { getRandomItemFromArray } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { ShuffleIcon, SettingsIcon } from 'svelte-feather-icons';

	const dispatch = createEventDispatcher();

	let imageIds: number[];
	let imagePromise: Promise<number[]>;
	let showOptions = false;

	import {
		currentImage,
		departmentChange,
		disableGlobalShortcuts,
		lastKey,
		options
	} from '$lib/stores';
	import { updateArtistStore } from './helpers';

	/* add in highlight/onview options
    else if (options.highlight && !json.isHighlight) {
			return await randomImage();
		} else if (options.onView && !json.GalleryNumber?.trim()) {
			return await randomImage();
		}
        */

	async function randomImage() {
		if (!imageIds) {
			imageIds = await imagePromise;
		}
		const id = getRandomItemFromArray(imageIds);
		const res = await fetch(
			`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
		);
		const json: MetObject = await res.json();
		updateArtistStore(json);
		if (!json.primaryImageSmall) {
			console.log(`Skipping ${id}: No image found.`);
			return await randomImage();
		} else if (!$options.departments.some((d) => d.displayName === json.department)) {
			return await randomImage();
		} else {
			return json;
		}
	}

	/**
	 *
	 * @param arr - array of department ids
	 */
	const loadImages = async (
		ids = $options.departments.filter((d) => d.checked).map((d) => d.departmentId)
	) => {
		// fetches objects with image and that are highlight from met api
		const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${ids.join(
			'|'
		)}`;
		const res = await fetch(url);
		const data = await res.json();

		return data.objectIDs;
	};
	async function handleClick() {
		await goto('/');
		// I'd like to make this go to the /id page eventually, so that the browser back button works etc
		dispatch('loadingImage');
		if ($departmentChange) {
			console.log('new url download');
			imageIds = await loadImages();
			$departmentChange = false;
		}
		let image = await randomImage();
		dispatch('imageLoaded');
		console.log(image);
		currentImage.set(image);
	}
	function toggle() {
		let toggled = $options.departments[0].checked;
		$options.departments = $options.departments.map((d) => {
			d.checked = !toggled;
			return d;
		});
	}

	const handleKeyDown = async (e: KeyboardEvent) => {
		if ($disableGlobalShortcuts) return;
		if ($lastKey === 'g') {
			switch (e.key) {
				case 's': {
					e.preventDefault();
					goto(`/saved`);
					// $lastKey = '';
					return;
				}
				case 'h': {
					e.preventDefault();
					goto(`/`);
					// $lastKey = '';
					return;
				}
			}
		}
		switch (e.key) {
			case 'r' || 'R': {
				handleClick();
				return;
			}
		}
		// set $lastKey to e.key with a timeout
		if (e.key === 'g') {
			setTimeout(() => {
				$lastKey = '';
			}, 750);
			$lastKey = e.key;
		}
	};

	onMount(async () => {
		if (localStorage.getItem('ids')) {
			imageIds = JSON.parse(localStorage.getItem('ids'));
		} else {
			imagePromise = loadImages();
			localStorage.setItem('ids', JSON.stringify(await imagePromise));
		}
	});
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="header-buttons flow">
	<div class="menu">
		<button on:click={handleClick}><ShuffleIcon size=".75x" /> Get Random Image</button>
		<button on:click={() => (showOptions = !showOptions)}
			><SettingsIcon size=".75x" /> Options</button
		>
	</div>
	{#if showOptions}
		<div class="options flow" transition:slide>
			<!-- <label>
                <input type="checkbox" bind:checked={options.highlight} />
                Highlighted
            </label>
            <label>
                <input type="checkbox" bind:checked={options.onView} />
                On View
            </label> -->
			<h2>Departments</h2>
			<button on:click={toggle}>Toggle all</button>
			<div class="options__list">
				{#each $options.departments as department (department.departmentId)}
					<label>
						<input
							type="checkbox"
							bind:checked={department.checked}
							on:click={() => ($departmentChange = true)}
						/>
						{department.displayName}
					</label>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	label {
		display: block;
	}

	h2 {
		margin: 0;
	}
	.menu {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}
	.options {
		margin-left: auto;
		margin-right: auto;
		max-width: 600px;
		text-align: center;
	}
</style>
