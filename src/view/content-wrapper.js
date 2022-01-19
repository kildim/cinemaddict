import AbstractView from './abstract-view';
import {removeChildren} from '../utils/render';

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
