<script lang="ts">
	import { lastKey, savedImages } from './stores';
	import { StarIcon } from 'svelte-feather-icons';

	import type { MetObject } from './types';

	export let image: MetObject;
	let saved = false;
	let saveText = 'Save';
	// this isn't working...
	// if ($savedImages.some((v) => v.objectID === image.objectID)) saveText = 'Saved';
	// $: if ($savedImages.some((v) => v.objectID === image.objectID)) saved = true;

	function yearAdapter(y: number) {
		const year = y.toString();
		if (year[0] === '-') {
			return year.slice(1) + ' B.C';
		}
		return year;
	}

	const relevantKeys = [
		'GalleryNumber',
		'department',
		'culture',
		'period',
		'dynasty',
		'reign',
		'medium',
		'dimensions'
	];

	// this dumps them all that aren't arrays
	const keys = Object.keys(image).filter((k) => !Array.isArray(image[k]) && image[k]);

	const camelToTitle = (s: string) =>
		s.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

	const handleClick = () => {
		addToSavedImages();
	};
	const addToSavedImages = () => {
		savedImages.update((val) => {
			if ($savedImages.some((v) => v.objectID === image.objectID)) return val;
			return (val = [...val, image]);
		});
	};

	const handleKeydown = async (e: KeyboardEvent) => {
		if (e.key.toLowerCase() === 's' && $lastKey !== 'g') {
			addToSavedImages();
		}
	};
</script>

<!-- keyboard shortcut -->
<svelte:window on:keydown={handleKeydown} />

<div class="image-container">
	<figure>
		<div class="image-frame">
			<a href={image.primaryImage || image.primaryImageSmall}
				><img src={image.primaryImageSmall} alt="{image.title} by {image.artistDisplayName}" /></a
			>
		</div>
		<figcaption class="flow">
			<h2>
				<a href={'https://www.metmuseum.org/art/collection/search/' + image.objectID}
					>{@html image.title}</a
				>
			</h2>
			{#if image.artistDisplayName}
				<p class="artist">{image.artistDisplayName}</p>
			{/if}
			<p class="year">
				{yearAdapter(image.objectBeginDate)}
				- {yearAdapter(image.objectEndDate)}
			</p>
			<dl>
				{#each relevantKeys as key}
					{#if image[key]}
						<dt class:on-view={key === 'GalleryNumber'}>{camelToTitle(key)}</dt>
						<dd class:on-view={key === 'GalleryNumber'}>{image[key]}</dd>
					{/if}
				{/each}
			</dl>
			<!-- disabled={saved ? true : undefined} -->
			<button
				disabled={$savedImages.some((v) => v.objectID === image.objectID)}
				on:click|once={handleClick}
				><StarIcon size=".75x" />
				{$savedImages.some((v) => v.objectID === image.objectID) ? 'Saved' : 'Save'}</button
			>
		</figcaption>
	</figure>
</div>

<style>
	.image-frame {
		/* border-radius: 0.25rem; */
		/* padding: 1rem; */
		/* background-color: hsl(3, 54%, 97%); */
		flex-basis: 0;
		flex-grow: 999;
		min-width: 66%;
		display: flex;
		justify-content: center;
	}
	img {
		border: 1rem solid hsl(3, 54%, 97%);
	}
	/* img {
		max-width: 600px;
		height: auto;
	} */
	figure {
		display: flex;
		flex-direction: row-reverse;
		gap: 1rem;
		justify-content: space-evenly;
		flex-wrap: wrap;
		margin-left: auto;
		margin-right: auto;
		max-width: 1200px;
	}
	figcaption {
		max-width: 30ch;
		flex-grow: 1;
		text-align: center;
	}
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-gap: 0.75rem 1.25rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		max-width: 250px;
		margin-left: auto;
		margin-right: auto;
	}
	dt {
		font-weight: 900;
	}
	dd {
		font-style: italic;
	}
	.on-view {
		color: var(--met-red);
	}
	.image-container {
		--flow-space: 1.5em;
		padding-bottom: 2em;
	}
	button[disabled] {
		opacity: 0.5;
	}
</style>
