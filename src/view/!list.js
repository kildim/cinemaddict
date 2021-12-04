import {createCardTemplate} from './card';
const createCards = (films) => {
  if (films.length < 1) {return '';}
  const cardsCount = films.length;
  let cardsTemplate = '';
  for (let index=0; index < cardsCount; index++) {
    cardsTemplate = cardsTemplate.concat(createCardTemplate(films[index]));
  }
  return cardsTemplate;
};

export const createListTemplate = (films) => (
  `
    <div class="films-list__container">
      ${createCards(films)}
    </div>
    `
);
