import type { MetObject } from './types';
import slugify from 'slugify';
import { artistStore } from './stores';

export const isOutOfViewport = (elem: HTMLElement): boolean => {
	// Get element's bounding
	const bounding = elem.getBoundingClientRect();
	if (bounding.top < 0) return true;
	if (bounding.bottom > (window.innerHeight || document.documentElement.clientHeight)) return true;
	console.log(bounding);
	// if (bounding.top < window.innerHeight && bounding.bottom >= 0) return true;

	return false;
};

export const updateArtistStore = (json: MetObject): void => {
	const {
		artistRole: role,
		artistPrefix,
		artistDisplayName: name,
		artistAlphaSort,
		artistNationality: nationality,
		artistGender: gender,
		artistBeginDate: birth,
		artistEndDate: death,
		artistDisplayBio: bio,
		artistWikidata_URL: wikidata,
		artistULAN_URL: ulan
	} = json;
	artistStore.update((map) => {
		const slug = slugify(json.artistDisplayName);
		if (map.has(slug)) {
			const m = map.get(slug);
			m.works.push(json.objectID);
			map.set(slug, m);
		} else {
			map.set(slug, {
				id: slug,
				name,
				birth,
				death,
				nationality,
				bio,
				gender,
				wikidata,
				ulan,
				role,
				works: [json.objectID]
			});
		}
		return map;
	});
};
