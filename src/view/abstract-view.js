const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template.trim();

  return newElement.firstChild;
};

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class AbstractView {
  #element = null;
  _externalHandlers = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  removeElement() {
    if (this.#element) {
      this.#element.remove();
    }
    this.#element = null;
  }

  shake() {
    this.element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.element.style.animation = '';
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
