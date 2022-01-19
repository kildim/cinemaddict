import AbstractView from '../view/abstract-view';

export const render = (container, element, place = 'beforeend') => {
  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (place) {
    case 'beforebegin':
      parent.before(child);
      break;
    case 'afterbegin':
      parent.prepend(child);
      break;
    case 'beforeend':
      parent.append(child);
      break;
    case 'afterend':
      parent.after(child);
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
    component = null;
  }
};

export const removeChildren = (component) => {
  if (component === null) {
    return;
  }
  if (component instanceof AbstractView) {
    component = component.element;
  }
  while (component.firstChild) {
    removeChildren(component.firstChild);
    remove(component.firstChild);
  }
};
