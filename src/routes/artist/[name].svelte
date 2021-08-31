<script context="module">
	export async function load({ page, fetch, session, context }) {
		return {
			props: {
				name: page.params.name
			}
		};
	}
</script>

<script lang="ts">
	import { artistStore } from '$lib/stores';
	import { onMount } from 'svelte';
	export let name;
	// import getUnicodeFlagIcon from 'country-flag-icons/unicode/index.js';
	// import { country_to_code, nationality_to_code } from '$lib/countries';
	import { search } from '$lib/met-api';
	import type { MetObject } from '$lib/types';

	let artist = $artistStore.get(name);
	let loading = true;

	let page = 0;
	let worksIds: number[];
	let works: MetObject[] = [];
	let hasMore = false;
	let index = 0;

	// const countryCode =
	// 	nationality_to_code[artist?.nationality] || country_to_code[artist?.nationality];

	const fetchData = async (id: number) => {
		const res = await fetch(
			`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
		);
		if (res.ok) {
			const json: MetObject = await res.json();
			console.log(json);
			if (json.artistDisplayName !== artist?.name) {
				console.log(`Skipping image. ${json.artistDisplayName} != ${artist?.name}`);
				return;
			} else if (!json.primaryImageSmall) {
				console.log(`Skipping image. No primary image.`);
				return;
			}
			return json;
		} else {
			console.error(`Failed to load image: ${id}`);
		}
	};

	const loadMore = async () => {
		worksIds.slice(index, index + 10).forEach(async (id) => {
			const res = await fetchData(id);
			if (res) works = [...works, res];
		});
		index += 10;
		if (worksIds.length > index - 1) {
			hasMore = true;
		} else {
			hasMore = false;
		}
	};

	onMount(async () => {
		// get works from api, save to store/cache for later use
		const results = await search({
			q: artist?.name || name,
			artistOrCulture: true
		});
		worksIds = results.objectIDs;
		console.log(worksIds);
		// load the first batch of works
		worksIds.slice(0, 10).forEach(async (id) => {
			const res = await fetchData(id);
			if (res) works = [...works, res];
		});
		index = 10;
		if (worksIds.length > index - 1) hasMore = true;
		loading = false;
	});
</script>

<div class="center flow">
	{#if artist}
		<h2>{artist?.name || name}</h2>
		{#if artist?.nationality}
			<p>
				<!-- <span class="country">
					{countryCode && `${getUnicodeFlagIcon(countryCode) || ''}`}
				</span> -->
				{artist?.nationality}
			</p>
		{/if}
		{#if artist?.birth || artist?.death}
			<p>
				{artist?.birth || '??'} — {artist?.death || '??'}
			</p>
		{/if}
		{#if artist?.bio}
			<p class="bio">
				{artist?.bio}
			</p>
		{/if}
		{#if works.length}
			<h3>Works</h3>
			<ul>
				{#each works as image}
					<!-- {image} -->
					<li>
						<a href="/{image.objectID}">
							<img
								src={image.primaryImageSmall}
								alt="Thumbnail for {image.title}"
								data-id={image.objectID}
							/>
						</a>
					</li>
				{/each}
			</ul>
			{#if hasMore}
				<button on:click={loadMore}>Load more</button>
			{/if}
		{:else if loading}
			<p>Loading...</p>
		{:else if !loading && (!works || works.length === 0)}
			<p>No works found</p>
		{/if}
	{:else}
		<p>Artist has not been indexed yet.</p>
	{/if}
</div>
