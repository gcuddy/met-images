import type { MetObject } from '$lib/types';
import type { EndpointOutput } from '@sveltejs/kit';

export async function get({ params }): Promise<EndpointOutput> {
	const id = params.id;
	console.log('[id]', id);
	const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
	console.log('res', res);
	let image;
	if (res.ok) {
		const json: MetObject = await res.json();
		console.log('json', json);
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
