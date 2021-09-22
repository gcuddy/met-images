import { search } from '$lib/_api';
import type { MetObject } from '$lib/types';
import type { EndpointOutput } from '@sveltejs/kit';

const fetchData = async (id: number, name: string) => {
	const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
	if (res.ok) {
		const json: MetObject = await res.json();
		if (json.artistDisplayName !== name) {
			return;
		} else if (!json.primaryImageSmall) {
			return;
		}
		return json;
	} else {
		console.error(`Failed to load image: ${id}`);
	}
};

export async function get({ params }): Promise<EndpointOutput> {
	const { name } = params;
	const results = await search({
		q: name,
		artistOrCulture: true
	});
	// 50 results for now
	console.log(results);
	if (!results.objectIDs) {
		return;
	}
	const filteredResults = results.objectIDs.slice(0, 50);
	const rest = results.objectIDs.slice(50);
	let hasMore = false;
	if (rest.length) hasMore = true;
	const imagePromises = filteredResults.map(async (id) => {
		const json = await fetchData(id, name);
		return json;
		// this fixes the type issue but i don't want to do it
		return {
			id: json?.objectID,
			title: json?.title,
			image: json?.primaryImageSmall,
			department: json?.department
		};
	});
	const images = await Promise.all(imagePromises);
	// don't know what's up with this type issue
	if (images) {
		return {
			body: {
				images: images.filter((i) => i)
			}
		};
	}
}
