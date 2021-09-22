<script>
	import SearchIcon from '../atoms/icons/SearchIcon.svelte';
	import Search from '../atoms/Search.svelte';
	let searchTerm = '';
</script>

<form action="/search">
	<Search bind:searchTerm icon={true} required={true} />
	<!-- <input type="submit" value="Go" /> -->
</form>

<style lang="scss">
	form {
		display: flex;
	}
	input {
		border: none;
		cursor: pointer;
		// background: url(/assets/search-circle-outline.svg) no-repeat;
	}
</style>
