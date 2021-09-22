<!-- realized this should be a sass mixin instead -->
<script lang="ts">
	import css from '$lib/actions/css';

	export let shadowColor = '0deg 0% 50%';
	export let elevation: 'elevated' | 'subtle' | 'medium' = 'elevated';
	const ELEVATIONS = {
		subtle: `
    0.5px 1px 1px hsl(var(--shadow-color) / 0.7)
  `,
		medium: `
    1px 2px 2px hsl(var(--shadow-color) / 0.333),
    2px 4px 4px hsl(var(--shadow-color) / 0.333),
    3px 6px 6px hsl(var(--shadow-color) / 0.333)
  `,
		elevated: `
    1px 2px 2px hsl(var(--shadow-color) / 0.2),
    2px 4px 4px hsl(var(--shadow-color) / 0.2),
    4px 8px 8px hsl(var(--shadow-color) / 0.2),
    8px 16px 16px hsl(var(--shadow-color) / 0.2),
    16px 32px 32px hsl(var(--shadow-color) / 0.2)
  `
	};
	$: shadow = ELEVATIONS[elevation];
</script>

<div use:css={{ 'shadow-color': shadowColor }} style={`box-shadow: ${shadow};`}>
	<slot />
</div>

<style>
	div {
		background-color: hsl(0deg 0% 95%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		padding: 32px;
	}
</style>
