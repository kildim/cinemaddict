import {createCards} from '../utils/utils';

export const createListTemplate = (films, cardsCount) => `
<div class="films-list__container">
  ${createCards(films, cardsCount)}
</div>
`;
