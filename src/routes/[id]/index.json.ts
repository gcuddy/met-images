import type { MetObject } from '$lib/types';
import type { EndpointOutput } from '@sveltejs/kit';

export async function get({ params }): Promise<EndpointOutput> {
	const id = params.id;
	const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
	let image;
	if (res.ok) {
		const json: MetObject = await res.json();
		image = json;
		return {
			body: {
				image
			}
		};
	} else {
		console.error(`Failed to load image: ${id}`);
	}
}
