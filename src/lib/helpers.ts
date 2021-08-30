export const isOutOfViewport = (elem: HTMLElement): boolean => {
	// Get element's bounding
	const bounding = elem.getBoundingClientRect();
	if (bounding.top < 0) return true;
	if (bounding.bottom > (window.innerHeight || document.documentElement.clientHeight)) return true;
	console.log(bounding);
	// if (bounding.top < window.innerHeight && bounding.bottom >= 0) return true;

	return false;
};
