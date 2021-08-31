import { writable } from 'svelte/store';
import type { MetObject } from './types';
import { DEFAULT_OPTIONS } from './options';

import { browser } from '$app/env';

//get rid of local storage thing
let storedImages: string;
if (browser) {
	storedImages = localStorage.getItem('saved-images');
}
export const savedImages = writable<MetObject[]>(storedImages ? JSON.parse(storedImages) : []);
if (browser) {
	savedImages.subscribe((val) => localStorage.setItem('saved-images', JSON.stringify(val)));
}

export const options = writable(DEFAULT_OPTIONS);

export const currentImage = writable<MetObject>(null);

export const isLoading = writable(false);

export const lastKey = writable('');

export const disableGlobalShortcuts = writable(false);

export interface artist {
	name: string;
	id: string;
	birth?: string;
	death?: string;
	nationality?: string;
	gender?: string;
	role?: string;
	bio?: string;
	wikidata?: string;
	ulan?: string;
	works?: number[];
}

export const artistStore = writable<Map<string, artist>>(new Map());
