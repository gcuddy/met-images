<script>
	import { notifications } from './stores';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	$: console.log($notifications);
</script>

<div class="notifications-container flow">
	{#each $notifications as notification (notification.id)}
		<div animate:flip transition:fade class="notification">
			<p>{notification.message}</p>
		</div>
	{/each}
</div>

<style lang="scss">
	@import './components/mixins';
	.notifications-container {
		--flow-space: 0.25em;
		position: fixed;
		top: var(--space-3xs-2xs);
		left: var(--space-3xs-2xs);
		z-index: 999;
	}
	.notification {
		@include shadow('sm');
		padding: var(--space-xs);
		background-color: #f44336;
		border-radius: 0.5rem;
	}
	/* notification style */
	p {
		color: white;
		text-align: center;
		font-size: var(--step--1);
	}
</style>
