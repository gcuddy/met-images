<script lang="ts">
	import { getRandomItemFromArray } from '$lib/utils';
	import Image from '$lib/Image.svelte';
	import { onMount } from 'svelte';
	import type { Object } from '$lib/types';
	import { slide } from 'svelte/transition';
	import { tick } from 'svelte';

	let imageIds: number[];
	let imagePromise: Promise<number[]>;
	let showOptions = false;
	let changed = false;

	let options = {
		departments: [
			{
				departmentId: 1,

				checked: true,
				displayName: 'American Decorative Arts'
			},
			{
				departmentId: 3,

				checked: true,
				displayName: 'Ancient Near Eastern Art'
			},
			{
				departmentId: 4,

				checked: true,
				displayName: 'Arms and Armor'
			},
			{
				departmentId: 5,

				checked: true,
				displayName: 'Arts of Africa, Oceania, and the Americas'
			},
			{
				departmentId: 6,

				checked: true,
				displayName: 'Asian Art'
			},
			{
				departmentId: 7,

				checked: true,
				displayName: 'The Cloisters'
			},
			{
				departmentId: 8,

				checked: true,
				displayName: 'The Costume Institute'
			},
			{
				departmentId: 9,

				checked: true,
				displayName: 'Drawings and Prints'
			},
			{
				departmentId: 10,
				checked: true,
				displayName: 'Egyptian Art'
			},
			{
				departmentId: 11,
				checked: true,
				displayName: 'European Paintings'
			},
			{
				departmentId: 12,
				checked: true,
				displayName: 'European Sculpture and Decorative Arts'
			},
			{
				departmentId: 13,
				checked: true,
				displayName: 'Greek and Roman Art'
			},
			{
				departmentId: 14,
				checked: true,
				displayName: 'Islamic Art'
			},
			{
				departmentId: 15,
				checked: true,
				displayName: 'The Robert Lehman Collection'
			},
			{
				departmentId: 16,
				checked: true,
				displayName: 'The Libraries'
			},
			{
				departmentId: 17,
				checked: true,
				displayName: 'Medieval Art'
			},
			{
				departmentId: 18,
				checked: true,
				displayName: 'Musical Instruments'
			},
			{
				departmentId: 19,
				checked: true,
				displayName: 'Photographs'
			},
			{
				departmentId: 21,
				checked: true,
				displayName: 'Modern Art'
			}
		]
	};

	/* add in highlight/onview options
    else if (options.highlight && !json.isHighlight) {
			return await randomImage();
		} else if (options.onView && !json.GalleryNumber?.trim()) {
			return await randomImage();
		}
        */

	let image: Object;

	async function randomImage() {
		if (!imageIds) {
			imageIds = await imagePromise;
		}
		const id = getRandomItemFromArray(imageIds);
		const res = await fetch(
			`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
		);
		const json: Object = await res.json();
		if (!json.primaryImage) {
			return await randomImage();
		} else if (!options.departments.some((d) => (d.displayName = json.department))) {
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
		ids = options.departments.filter((d) => d.checked).map((d) => d.departmentId)
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
		if (changed) {
			console.log('new url download');
			imageIds = await loadImages();
			changed = false;
		}
		image = await randomImage();
		console.log(image);
	}

	function toggle() {
		let toggled = options.departments[0].checked;
		options.departments.forEach((d) => (d.checked = !toggled));
		options = options;
	}

	onMount(async () => {
		if (localStorage.getItem('ids')) {
			imageIds = JSON.parse(localStorage.getItem('ids'));
		} else {
			imagePromise = loadImages();
			localStorage.setItem('ids', JSON.stringify(await imagePromise));
		}
	});
</script>

<svelte:head>
	<title>Met</title>
</svelte:head>

<div class="wrapper flow">
	<div class="header flow">
		<h1>Met app</h1>

		<button on:click={handleClick}>Get Random Image</button>
		<button on:click={() => (showOptions = !showOptions)}>Options</button>
		{#if showOptions}
			<div class="options" transition:slide>
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
				{#each options.departments as department (department.departmentId)}
					<label>
						<input
							type="checkbox"
							bind:checked={department.checked}
							on:click={() => (changed = true)}
						/>
						{department.displayName}
					</label>
				{/each}
			</div>
		{/if}
	</div>
	{#if image}
		<Image {image} />
	{/if}
</div>

<style>
	.header {
		margin-left: auto;
		margin-right: auto;
		max-width: 600px;
		text-align: center;
	}
	label {
		display: block;
	}
</style>
