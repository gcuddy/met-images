<script>
	import { notifications } from './stores';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	$: console.log($notifications);
</script>

<div class="notifications-container">
	{#each $notifications as notification (notification.id)}
		<div animate:flip transition:fade class="notification">
			<p>{notification.message}</p>
		</div>
	{/each}
</div>

<style>
	.notifications-container {
		position: fixed;
		top: var(--space-3xs-2xs);
		left: var(--space-3xs-2xs);
		z-index: 999;
	}
	.notification {
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
