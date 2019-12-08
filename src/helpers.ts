export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const average = (numbers) => numbers.reduce((ac, n) => ac += n, 0) / numbers.length;
