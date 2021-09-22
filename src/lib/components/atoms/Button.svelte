<script>
	import css from '$lib/actions/css';
	export let shadow = true;
	export let shadowSize = '"sm"';
	export let shadowColor = undefined;

	// todo: figure out how i would programatically pass in values to sass mixin?
</script>

<button on:click use:css={{ shadowSize }}>
	<slot />
</button>

<style lang="scss">
	@import '../mixins';

	button {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: var(--met-red);
		color: white;
		// font-size: 1rem;
		border: none;
		text-decoration: none;
		border-radius: 0.25rem;
		text-align: center;
		cursor: pointer;
		font-weight: 700;
		font-family: 'Fern Web', Georgia, serif;
		white-space: nowrap;
		@include shadow('sm');
	}
</style>
