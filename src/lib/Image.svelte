<script lang="ts">
	import { lastKey, savedImages } from './stores';
	import { StarIcon } from 'svelte-feather-icons';
	import slugify from 'slugify';

	import type { MetObject } from './types';

	export let image: MetObject;

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

<svelte:window on:keydown={handleKeydown} />

<div class="image">
	<figure>
		<div class="image__frame">
			<a href={image.primaryImage || image.primaryImageSmall}
				><img src={image.primaryImageSmall} alt="{image.title} by {image.artistDisplayName}" /></a
			>
		</div>
		<figcaption class="flow image__info">
			<h2>
				<a href={'https://www.metmuseum.org/art/collection/search/' + image.objectID}
					>{@html image.title}</a
				>
			</h2>
			{#if image.artistDisplayName}
				<p class="artist">
					<a href="/artist/{slugify(image.artistDisplayName)}">{image.artistDisplayName}</a>
				</p>
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
			<!-- change this to unstar -->
			<button
				disabled={$savedImages.some((v) => v.objectID === image.objectID)}
				on:click|once={handleClick}
				><StarIcon size=".75x" />
				{$savedImages.some((v) => v.objectID === image.objectID) ? 'Saved' : 'Save'}</button
			>
		</figcaption>
	</figure>
</div>

<style lang="scss">
	.image__frame {
		flex-basis: 0;
		flex-grow: 999;
		min-width: 66%;
		display: flex;
		justify-content: center;
	}
	img {
		border: 0.25rem solid #000;
		border-radius: 0.25rem;
	}
	figure {
		// display: flex;
		// flex-direction: row-reverse;
		// justify-content: space-evenly;
		// flex-wrap: wrap;
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 1rem;
		margin-left: auto;
		margin-right: auto;
		max-width: 1200px;
		@media screen and (min-width: 768px) {
			padding: 0 var(--space-2xl);
		}

		@media screen and (max-width: 768px) {
			// display: flex;
			// flex-direction: column;
			// justify-content: center;
			// flex-wrap: wrap;
			grid-template-columns: 1fr;
		}
	}
	figcaption {
		// max-width: 45ch;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
		display: flex;
		flex-direction: column;
		// justify-content: center;
		align-items: center;
	}
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-gap: 0.75rem 1.25rem;
		font-family: 'Fern Web', Georgia, serif;
		max-width: 250px;
		margin-left: auto;
		margin-right: auto;
		font-feature-settings: 'opsz' 12;
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
	.image {
		--flow-space: 1.5em;
		padding-bottom: 2em;

		&__info {
			h2 {
				font-size: var(--step-1);
			}

			.artist {
				font-size: var(--step-0);
			}

			.year {
				font-size: var(--step--1);
			}
		}
	}
	button[disabled] {
		opacity: 0.5;
	}
</style>
