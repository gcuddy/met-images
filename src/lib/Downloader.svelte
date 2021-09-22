<script lang="ts">
	import { savedImages } from './stores';
	import type { MetObject } from './types';
	import MarkdownDownload from './Downloader/MarkdownDownload.svelte';
	import ImageDownload from './Downloader/ImageDownload.svelte';
	import JsonDownload from './Downloader/JSONDownload.svelte';
	// import CsvDownload from './Downloader/CSVDownload.svelte';
	export let showDownloadPopup: boolean;
	export let selectedItems: number[];
	export let filteredImages: MetObject[];

	$: if (!showDownloadPopup) selected = null;

	// todo: push CSV download to worker
	const options = [
		{ label: 'Images', component: ImageDownload },
		{ label: 'Markdown', component: MarkdownDownload },
		{ label: 'JSON', component: JsonDownload }
	];
	let selected = undefined;
	$: images =
		selectedItems.length > 0
			? $savedImages.filter((s) => selectedItems.includes(s.objectID))
			: filteredImages;
</script>

{#if showDownloadPopup}
	<div class="download-container" on:click|stopPropagation|self={() => (showDownloadPopup = false)}>
		<div
			class="download-popup flow"
			role="dialog"
			aria-labelledby="download-label"
			aria-modal="true"
		>
			<!-- svelte-ignore a11y-autofocus -->
			<button autofocus class="close" on:click={() => (showDownloadPopup = false)}>Close</button>
			{#if !selected}
				<p id="download-label">Select download option.</p>
				<ul class="flow">
					{#each options as option}
						<li>
							<button on:click={() => (selected = option)}>{option.label}</button>
						</li>
					{/each}
				</ul>
			{:else}
				<svelte:component this={selected.component} {images} />
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	@import 'components/mixins';
	.download-container {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.08);
		z-index: 9999;
	}
	.download-popup {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: linear-gradient(145deg, var(--met-red), var(--met-red-lighter));
		color: white;
		padding: 2rem;
		border-radius: 1rem;
		font-size: var(--step-0);
		// color: var(--text);
		z-index: 9;
		width: 30ch;

		@include shadow('lg');

		#download-label {
			text-align: center;
		}

		.close {
			text-indent: -9999px;
			position: absolute;
			top: 0;
			left: 0;
			height: 2rem;
			width: 2rem;
			background: transparent;
			z-index: 1;
			border-radius: 100%;
			padding: 0;
			&::before {
				background: url(/assets/close.svg) no-repeat center/100%;
				position: absolute;
				top: 0;
				left: 0;
				content: '';
				width: 100%;
				height: 100%;
				filter: invert(1);
				opacity: 0.9;
			}
		}
		ul {
			button {
				font-size: var(--step-0);
				color: var(--text);
				background: rgba(255, 255, 255, 0.25);
				width: 75%;
				margin-left: auto;
				display: block;
				margin-right: auto;
				// @include shadow('lg');
				&:hover {
					background: rgba(255, 255, 255, 0.5);
				}
			}
		}
	}
</style>
