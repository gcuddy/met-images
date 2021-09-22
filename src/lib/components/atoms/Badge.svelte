<script>
	export let count;
	export let top = '-6px';
	export let right = '-8px';
</script>

<div class="badge" style="--top: {top}; --right: {right}">
	<div class="badge__count">
		{count}
	</div>
</div>

<style>
	.badge {
		position: absolute;
		top: var(--top);
		right: var(--right);
		border-radius: 100%;
		background-color: var(--met-red);
		font-size: 12px;
		display: flex;
		align-items: center;
		height: 1.5em;
		min-width: 1.5em;
		justify-content: center;
		color: #fff;
	}
	.badge__count {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		/* padding: 3px; */
	}
</style>
