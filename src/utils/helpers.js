export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};