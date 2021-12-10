import AbstractView from '../view/abstract-view';

export const render = (container, element, place = 'beforeend') => {
  switch (place) {
    case 'beforebegin':
      container.before(element);
      break;
    case 'afterbegin':
      container.prepend(element);
      break;
    case 'beforeend':
      container.append(element);
      break;
    case 'afterend':
      container.after(element);
      break;
  }
};

export const replace = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    throw new Error('Can\'t replace nonexistent elements');
  }

  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (component instanceof AbstractView) {
    component.removeElement();
  } else {
    component.remove();
  }
};
