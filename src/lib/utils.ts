export function getRandomItemFromArray<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

//random number between min and max
export function getRandomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
