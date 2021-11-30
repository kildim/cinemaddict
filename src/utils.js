// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
import {createCardTemplate} from './view/card';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const createCards = (cardsCount) => {
  let cardsTemplate = '';
  for (let index=0; index < cardsCount; index++) {
    cardsTemplate = cardsTemplate.concat(createCardTemplate());
  }
  return cardsTemplate;
};
