<script>
	import { disableGlobalShortcuts, savedImages } from '$lib/stores';

	export let searchTerm = '';
	export let searchInput = null;
	export let placeholder = 'Search';
	export let width = undefined;
	export let icon = false;
	export let required = false;
</script>

<input
	class="search-bar"
	class:with-icon={icon}
	type="search"
	bind:value={searchTerm}
	bind:this={searchInput}
	{placeholder}
	on:focus={() => ($disableGlobalShortcuts = true)}
	on:blur={() => ($disableGlobalShortcuts = false)}
	style={width ? `--searchWidth: ${width};` : undefined}
	on:keydown|stopPropagation={(e) => e.code === 'Escape' && searchInput.blur()}
	{required}
	name="q"
/>

<style lang="scss">
	@import '../mixins';
	.search-bar {
		width: var(--searchWidth, 80%);
		padding: 0.25rem 0.5rem;
		border: 1px solid gray;
		margin-left: auto;
		display: block;
		margin-right: auto;
		border-radius: 0.5rem;
		position: relative;
		background: transparent;

		&:active {
			@include shadow('sm');
			outline: none;
		}
	}
	.search-bar.with-icon {
		&::before {
			content: '';
			background: url(/assets/search-circle-outline.svg) no-repeat;
			position: absolute;
			top: 0.5rem;
			left: 0.5rem;
		}
	}
</style>
