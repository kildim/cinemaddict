import AbstractView from './abstract-view';

const createListsContainerTemplate = () => `
  <section class="films">
  </section>
`;

export default class ListsContainer extends AbstractView{

  get template() {
    return createListsContainerTemplate();
  }
}
