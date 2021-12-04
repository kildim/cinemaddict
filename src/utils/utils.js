export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const sliceArray = (array, head, tail) => {
  if (head === 0) {return  array.slice(Math.min(array.length, tail));
  } else {
    return array.slice(head - 1, Math.min(array.length, tail));
  };
};
