// https://metmuseum.github.io/#search
export interface MetSearchRequest {
	q: string;
	isHighlight?: boolean;
	title?: boolean;
	tags?: boolean;
	departmentId?: number;
	isOnView?: boolean;
	artistOrCulture?: boolean;
	medium?: string[] | string;
	hasImages?: boolean;
	geoLocation?: string[] | string;
	dateBegin?: number;
	dateEnd?: number;
}

export interface MetSearchResponse {
	total: number;
	objectIDs: number[];
}

const searchUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search';

// function to query searchUrl with a search request
export async function search(searchRequest: MetSearchRequest): Promise<MetSearchResponse> {
	let requestUrl = searchUrl;
	// I do it the template literal, not the URL constructor way, because i'm a badass
	const q = encodeURIComponent(searchRequest.q);
	const opts = Object.keys(searchRequest).filter((k) => k !== 'q');
	opts.forEach((k, i) => {
		const v = searchRequest[k];
		requestUrl += `${i === 0 ? '?' : '&'}${k}=${
			Array.isArray(v) ? v.map((v) => encodeURIComponent(v)).join('|') : encodeURIComponent(v)
		}`;
	});
	requestUrl += `${opts.length ? '&' : '?'}q=${q}`;
	console.log(requestUrl);
	const response = await fetch(requestUrl);
	// console.log(response);
	return await response.json();
}
