import { search } from '$lib/_api';
import type { MetObject } from '$lib/types';
import type { EndpointOutput } from '@sveltejs/kit';

const fetchData = async (id: number, culture: string) => {
	const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
	if (res.ok) {
		const json: MetObject = await res.json();
		if (json.culture !== culture) {
			// console.log(`Skipping image. ${json.culture} != ${culture}`);
			return;
		} else if (!json.primaryImageSmall) {
			// console.log(`Skipping image. No primary image.`);
			return;
		}
		return json;
	} else {
		console.error(`Failed to load image: ${id}`);
	}
};

export async function get({ params }): Promise<EndpointOutput> {
	const { q } = params;
	const results = await search({
		q
	});
	if (!results.objectIDs) {
		return {
			body: {
				results: []
			}
		};
	}
	const images = results.objectIDs.slice(0, 10).map(async (id) => {
		const image = await fetchData(id, q);
		if (image) {
			return image;
		}
	});
	return {
		body: {
			images: await Promise.all(images)
		}
	};
}
