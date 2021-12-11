import AbstractView from './abstract-view';

const createFooterStatisticsTemplate = (count) => `
    <section class="footer__statistics">
      <p>${count} movies inside</p>
    </section>
`;

export default class FooterStatistics extends AbstractView{
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#count);
  }
}
