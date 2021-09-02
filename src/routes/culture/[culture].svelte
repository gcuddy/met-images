<script context="module">
	// export const prerender = true;
	export async function load({ page, fetch, session, context }) {
		const {
			params: { culture }
		} = page;
		const res = await fetch(`/culture/${culture}.json`);
		const highlights = await res.json();
		console.log(highlights);
		if (res.ok) {
			return {
				props: {
					culture,
					highlights
				}
			};
		}
		return {
			status: res.status,
			error: new Error(`Could not load /culture/${culture}.json`)
		};
	}
</script>

<script lang="ts">
	import type { MetObject } from '$lib/types';
	import '$lib/scss/utilities/auto-grid.scss';
	export let culture;
	console.log(culture);
	export let highlights: { highlights: MetObject[] };
	$: console.log(highlights);
</script>

<div class="flow">
	<h2>{culture}</h2>
	{#if highlights.highlights.length}
		<h3>Highlighted images</h3>
		<ul class="auto-grid" role="list">
			{#each highlights.highlights as image}
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
								<p class="artist">{image.artistDisplayName}</p>
							</figcaption>
						</figure>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p>Nothing found.</p>
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
	.department,
	.artist {
		color: rgba(0, 0, 0, 0.5);
	}
</style>
