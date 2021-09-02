import { search } from '$lib/met-api';
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
	const { culture } = params;
	const results = await search({
		q: culture,
		artistOrCulture: true,
		isHighlight: true
	});
	// 50 results for now
	const filteredResults = results.objectIDs.slice(0, 50);
	console.log(`filteredResults:`, filteredResults);
	const highlights = filteredResults.map(async (id) => {
		const json = await fetchData(id, culture);
		return json;
		// this fixes the type issue but i don't want to do it
		return {
			id: json?.objectID,
			title: json?.title,
			image: json?.primaryImageSmall,
			department: json?.department
		};
	});
	const allHighlights = await Promise.all(highlights);
	allHighlights.filter((f) => f);
	// filteredResults.forEach(async (id) => {
	// 	const res = await fetchData(id, culture);
	// 	if (res) {
	// 		highlights = [...highlights, res];
	// 	}
	// });

	// don't know what's up with this type issue
	if (allHighlights) {
		return {
			body: {
				highlights: allHighlights.filter((f) => f)
			}
		};
	}
}
