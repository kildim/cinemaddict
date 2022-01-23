import AbstractView from './abstract-view';

const createContentWrapperTemplate = () => (
  `
    <div></div>
  `
);

export default class ContentWrapper extends AbstractView {

  get template() {
    return createContentWrapperTemplate();
  }
}
