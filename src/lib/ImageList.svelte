<script lang="ts">
	import type { MetObject } from './types';
	import { flip } from 'svelte/animate';
	export let images: MetObject[];
</script>

<ul>
	{#each images as image (image.objectID)}
		<li animate:flip={{ duration: 200 }}>
			<div class="saved-image">
				<div class="saved-image__icon">
					<img
						src={image.primaryImageSmall}
						alt="Thumbnail for {image.title}"
						data-id={image.objectID}
					/>
				</div>
				<div class="saved-image__info flow">
					<h2><a href="/{image.objectID}">{@html image.title}</a></h2>
					{#if image.artistDisplayName}
						<p>{image.artistDisplayName}</p>
					{/if}
				</div>
			</div>
		</li>
	{/each}
</ul>

<!-- these styles repeat in Saved.svelte ... -->
<style lang="scss">
	ul {
		list-style: none;
		padding: 0;
	}
	.saved-image {
		display: flex;
		gap: 1.5rem;
		font-size: var(--step-0);
		align-items: center;
		--flow-space: var(--space-3xs);

		&__info {
			flex: 1;

			h2 {
				font-size: var(--step-0);
			}
			p {
				font-size: var(--step--1);
			}
		}
	}
	img {
		border-radius: 100%;
		width: 3em;
		height: 3em;
		object-fit: cover;
		position: relative;
	}
</style>
