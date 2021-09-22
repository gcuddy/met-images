import type { MetObject } from './types';
import JSZip from 'jszip';
import pkg from 'file-saver';
const { saveAs } = pkg;
import slugify from 'slugify';
//callback function for downloading a zip file
export async function download(images: MetObject[], callback: (number) => void): Promise<void> {
	const zip = new JSZip();
	let index = 1;
	console.log('Download images');
	for (const image of images) {
		//fetch primary image as arraybuffer
		// this uses a cors proxy to circumvent CORS restrictions
		// see https://cors-anywhere.herokuapp.com/
		//probably not ideal, but it works
		const res = await fetch(`https://serene-island-55927.herokuapp.com/${image.primaryImage}`);
		if (res.ok)
			console.log(`Fetched https://serene-island-55927.herokuapp.com/${image.primaryImage}`);
		const imageBuffer = await res.arrayBuffer();
		// const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
		const imageName = slugify(image.title + ' ' + image.artistDisplayName) + '.jpg';
		zip.file(imageName, imageBuffer);
		//increment progress bar
		console.log(`Callback ${index}/${images.length}`);
		index++;
		callback(((index / images.length) * 50) / 100);
		if (index % 75 === 0) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
	console.log('Generating Zip File');

	//generate zip file
	zip
		.generateAsync({ type: 'blob' }, (metadata) => {
			callback(((metadata.percent / 100) * 50 + 50) / 100);
		})
		.then((content) => {
			// see FileSaver.js
			// download zip file named images-YYYYMMDD.zip
			saveAs(content, 'images-' + new Date().toISOString().slice(0, 10) + '.zip');
		});
}
