import {createCards} from '../utils';

export const createListTemplate = (cardsCount) => `
<div class="films-list__container">
  ${createCards(cardsCount)}
</div>
`;
