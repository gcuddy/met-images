<script lang="ts">
	export let size = '1em';
	export let fill = 'none';
	export let strokeWidth = 2;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	{fill}
	viewBox="0 0 24 24"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	class:filled={fill !== 'none'}
	><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line
		x1="10"
		y1="12"
		x2="14"
		y2="12"
	/></svg
>
