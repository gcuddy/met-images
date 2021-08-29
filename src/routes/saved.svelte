<script lang="ts">
	import Image from '$lib/Image.svelte';
	import { flip } from 'svelte/animate';
	import { savedImages } from '$lib/stores';
</script>

<svg style="display: none" xmlns="http://www.w3.org/2000/svg">
	<symbol id="bin-icon" viewBox="0 0 50 50">
		<path
			fill="currentColor"
			d="m20.651 2.3339c-.73869 0-1.3312.59326-1.3312 1.3296v2.5177h-6.3634c-.73887 0-1.3314.59331-1.3314 1.3295v1.1888c0 .73639.59249 1.3289 1.3312 1.3289h7.6948 8.8798 7.6948c.73869 0 1.3312-.59249 1.3312-1.3289v-1.1888c0-.73639-.59249-1.3296-1.3312-1.3296h-6.3634v-2.5177c0-.73639-.59249-1.3296-1.3312-1.3296h-8.8798zm-5.6786 11.897c-1.7775 0-3.2704 1.4889-3.2704 3.274v27.647c0 1.7775 1.4928 3.2704 3.2704 3.2704h20.783c1.7775 0 3.2704-1.4928 3.2704-3.2704v-27.647c0-1.7852-1.4928-3.274-3.2704-3.274h-20.783zm1.839 3.4895h1.1696c.73869 0 1.3389.60018 1.3389 1.3466v24.247c0 .74638-.60018 1.3389-1.3389 1.3389h-1.1696c-.73869 0-1.3389-.59249-1.3389-1.3389v-24.247c0-.74638.60018-1.3466 1.3389-1.3466zm7.6948 0h1.1696c.73869 0 1.3389.60018 1.3389 1.3466v24.247c0 .74638-.60018 1.3389-1.3389 1.3389h-1.1696c-.73869 0-1.3389-.59249-1.3389-1.3389v-24.247c0-.74638.60018-1.3466 1.3389-1.3466zm7.6948 0h1.1696c.73869 0 1.3389.60018 1.3389 1.3466v24.247c0 .74638-.60018 1.3389-1.3389 1.3389h-1.1696c-.73869 0-1.3389-.59249-1.3389-1.3389v-24.247c0-.74638.60018-1.3466 1.3389-1.3466z"
		/>
	</symbol>
</svg>
<div class="saved-images">
	<ul class="flow">
		{#each $savedImages as image (image.objectID)}
			<li animate:flip>
				<div class="saved-image">
					<img src={image.primaryImageSmall} />
					<div class="saved-image-info">
						<h2><a href="/{image.objectID}">{image.title}</a></h2>
						{#if image.artistDisplayName}
							<p>{image.artistDisplayName}</p>
						{/if}
					</div>
					<button
						on:click={() =>
							($savedImages = $savedImages.filter((i) => i.objectID !== image.objectID))}
						aria-label="delete {image.title}"><svg><use xlink:href="#bin-icon" /></svg></button
					>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	.saved-images {
		margin: 0 auto;
		max-width: 800px;
	}
	ul {
		list-style: none;
	}
	.saved-image {
		display: flex;
		gap: 1.5rem;
	}
	img {
		border-radius: 100%;
		width: 100px;
		height: 100px;
		object-fit: cover;
	}
	svg {
		width: 1.5rem;
		height: 1.5rem;
	}
	button {
		border: 0;
		background: transparent;
		margin-left: auto;
	}
</style>
