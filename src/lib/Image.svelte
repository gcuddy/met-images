<script lang="ts">
	import { departmentChange, lastKey, notifications, options, savedImages } from './stores';
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
			if (val.some((v) => v.objectID === image.objectID))
				return val.filter((v) => v.objectID !== image.objectID);
			return (val = [...val, image]);
		});
	};

	const handleKeydown = async (e: KeyboardEvent) => {
		if (e.key.toLowerCase() === 's' && $lastKey !== 'g') {
			addToSavedImages();
		}
	};
	const changeDepartment = (department: string) => {
		options.update((val) => {
			return {
				...val,
				departments: val.departments.map((v) => {
					v.displayName === department ? (v.checked = true) : (v.checked = false);
					return v;
				})
			};
		});
		departmentChange.set(true);
		notifications.notify(`Now only showing images from department: ${department}`);
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
						{#if key === 'department'}
							<dd><button on:click={() => changeDepartment(image[key])}>{image[key]}</button></dd>
						{:else if key === 'culture'}
							<dd><a sveltekit:prefetch href="culture/{image[key]}"> {image[key]}</a></dd>
						{:else}
							<dd class:on-view={key === 'GalleryNumber'}>{image[key]}</dd>
						{/if}
					{/if}
				{/each}
			</dl>
			<!-- disabled={saved ? true : undefined} -->
			<!-- change this to unstar -->
			<!-- 				disabled={$savedImages.some((v) => v.objectID === image.objectID)}
 -->
			<button class="save-button" on:click={handleClick}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill={$savedImages.some((v) => v.objectID === image.objectID) ? 'yellow' : 'none'}
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-star"
					><polygon
						points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
					/></svg
				>
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
		grid-template-columns: 2fr 1fr;
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
		max-width: 40ch;
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
		button {
			background: none;
			color: inherit;
			padding: 0;
			margin: 0;
			display: inline;
			text-align: left;
			font-weight: normal;
			text-decoration: underline;
		}
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
	.save-button {
		display: flex;
		align-items: baseline;
		svg {
			align-self: center;
			width: 0.9em;
			height: 0.9em;
			margin-inline-end: var(--space-3xs);
		}
	}
</style>
