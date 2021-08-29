<script lang="ts">
	import { savedImages } from '$lib/stores';

	import '../app.css';
</script>

<main>
	<div class="container flow">
		<div class="header flow">
			<h1><a href="/">Met app</a></h1>
		</div>
		{#if $savedImages.length}
			<div class="counter">
				<a href="/saved"
					><span>{$savedImages.length} saved image{$savedImages.length > 1 ? 's' : ''}</span>
				</a>
			</div>
		{/if}
		<slot />
	</div>
</main>

<style>
	.counter {
		position: absolute;
		top: 0;
		right: 0;
	}
	.header {
		margin-left: auto;
		margin-right: auto;
		max-width: 600px;
		text-align: center;
	}
	.container {
		position: relative;
	}
</style>
