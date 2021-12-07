export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template.trim();

  return newElement.firstChild;
};

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
