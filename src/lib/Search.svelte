<script>
	import { disableGlobalShortcuts, savedImages } from './stores';

	export let searchTerm = '';
	export let searchInput;
	export let filteredImages;
	$: filteredImages = $savedImages.filter(
		(image) =>
			image.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
			image.artistDisplayName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);
</script>

<input
	class="saved-images__search"
	type="text"
	bind:value={searchTerm}
	bind:this={searchInput}
	placeholder="Search"
	on:focus={() => ($disableGlobalShortcuts = true)}
	on:blur={() => ($disableGlobalShortcuts = false)}
	on:keydown={(e) => e.code === 'Escape' && searchInput.blur()}
/>

<style>
	.saved-images__search {
		width: 80%;
		padding: 0.5rem;
		border: 1px solid gray;
		margin-left: auto;
		display: block;
		margin-right: auto;
		border-radius: 0.5rem;
	}
</style>
