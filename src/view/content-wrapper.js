import AbstractView from './abstract-view';
import {removeChildren} from '../utils/render';

const createContentWrapperTemplate = () => (
  `
    <div></div>
  `
);

export default class ContentWrapper extends AbstractView {
  clear() {
    removeChildren(this.element);
  }

  get template() {
    return createContentWrapperTemplate();
  }
}
