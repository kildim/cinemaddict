import AbstractView from './abstract-view';

const createShowMoreTemplate = () => `
  <button class="films-list__show-more">Show more</button>
`;

export default class ShowMore extends AbstractView{

  get template() {
    return createShowMoreTemplate();
  }
}
