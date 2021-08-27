<script lang="ts">
	import type { Object, Constituents } from './types';

	export let image: Object;

	function yearAdapter(y: number) {
		const year = y.toString();
		if (year[0] === '-') {
			return year.slice(1) + ' B.C';
		}
		return year;
	}

	const relevantKeys = [
		'department',
		'culture',
		'period',
		'dynasty',
		'reign',
		'medium',
		'dimensions',
		'GalleryNumber'
	];

	// this dumps them all that aren't arrays
	const keys = Object.keys(image).filter((k) => !Array.isArray(image[k]) && image[k]);

	const camelToTitle = (s: string) =>
		s.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
</script>

<div class="image-container">
	<figure>
		<div class="image-frame">
			<a href={'https://www.metmuseum.org/art/collection/search/' + image.objectID}>
				<img src={image.primaryImage} alt="{image.title} by {image.artistDisplayName}" />
			</a>
		</div>
		<figcaption>
			<h2>{image.title}</h2>
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
						<dt>{camelToTitle(key)}</dt>
						<dd>{image[key]}</dd>
					{/if}
				{/each}
			</dl>
		</figcaption>
	</figure>
</div>

<style>
	.image-frame {
		border-radius: 0.25rem;
		padding: 1rem;
		background-color: hsl(3, 54%, 97%);
		flex-basis: 0;
		flex-grow: 999;
		min-width: 66%;
	}
	a {
		margin-left: auto;
		margin-right: auto;
		display: block;
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
</style>
