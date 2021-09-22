<script context="module">
	export const prerender = true;
	export async function load({ page, fetch, session, context }) {
		//svelte automatically decodes our url, so we have to encode it again
		const res = await fetch(`/artist/${page.params.name}.json`);
		if (res.ok) {
			const images = await res.json();
			return {
				props: {
					name: page.params.name,
					images
				},
				maxage: 60 * 60 * 60 * 24 * 30
			};
		}
		return {
			props: {
				name: page.params.name
			},
			status: res.status,
			error: new Error(`Could not load /artist/${page.params.name}.json`)
		};
	}
</script>

<script lang="ts">
	import type { MetObject } from '$lib/types';
	import '$lib/scss/utilities/auto-grid.scss';

	export let name;
	export let images;
	// how do i fix this nonsense??
	images = images.images as MetObject[];

	let hasMore = false;
	let index = 0;
</script>

<div class="flow">
	<h2>{name}</h2>
	{#if images}
		{#if images[0]?.artistNationality}
			<p>
				<!-- <span class="country">
					{countryCode && `${getUnicodeFlagIcon(countryCode) || ''}`}
				</span> -->
				{images[0]?.artistNationality}
			</p>
		{/if}
		{#if images[0]?.artistBeginDate || images[0]?.artistEndDate}
			<p>
				{images[0]?.artistBeginDate || '??'} — {images[0]?.artistEndDate || '??'}
			</p>
		{/if}
		{#if images.length}
			<h3>Works</h3>
			<ul class="auto-grid" role="list">
				{#each images as image}
					<!-- {image} -->
					<li>
						<a href="/{image.objectID}">
							<figure>
								<img
									src={image.primaryImageSmall}
									alt="Thumbnail for {image.title}"
									loading="lazy"
									data-id={image.objectID}
								/>
								<figcaption>
									<p class="department">{image.department}</p>
									<p class="title">{@html image.title}</p>
								</figcaption>
							</figure>
						</a>
					</li>
				{/each}
			</ul>
			{#if hasMore}
				<button on:click={loadMore}>Load more</button>
			{/if}
		{:else}
			<p>No info found on this artist.</p>
		{/if}
	{/if}
</div>

<style>
	div {
		max-width: 1200px;
		margin-left: auto;
		margin-right: auto;
	}
	ul {
		padding: 0;
	}
	img {
		border: 0.25rem solid #000;
		border-radius: 0.25rem;
	}
	img {
		width: 20em;
		height: 20em;
		object-fit: cover;
	}
	a {
		text-decoration: none;
	}
	figcaption {
		font-size: var(--step--1);
		font-style: italic;
	}
	.department {
		color: rgba(0, 0, 0, 0.5);
	}
</style>
