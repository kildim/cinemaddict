import {remove, removeChildren, render} from '../utils/render';
import Statistics from '../view/statistics';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {PERIOD} from '../constants';
import {getPeriod} from '../utils/date-time';

export default class StatisticsPresenter {
  #selectedStats = null;
  #container = null;
  #statisticElement = null;
  #moviesModel = null;

  constructor(params) {
    const {moviesModel, container} = {...params};
    this.#container = container;
    this.#selectedStats = PERIOD.allTime;
    this.#moviesModel = moviesModel;
  }

  clearContent = () => {
    removeChildren(this.#container);
  }

  renderChart(params) {
    const {statisticElement, genresStats} = {...params}
    const BAR_HEIGHT = 50;
    const statisticCtx = statisticElement.chartContainer;

    // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
    statisticCtx.height = BAR_HEIGHT * 5;

    const myChart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: genresStats.genres,
        datasets: [{
          data: genresStats.counts,
          backgroundColor: '#ffe800',
          hoverBackgroundColor: '#ffe800',
          anchor: 'start',
          barThickness: 24,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 20,
            },
            color: '#ffffff',
            anchor: 'start',
            align: 'start',
            offset: 40,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#ffffff',
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }

  renderStatsContent = () => {
    const generalStats = {
      rank: this.#moviesModel.userRank,
      watched: 10,
      totalDuration: 123,
      topGenre: 'Thriller',
    };

    const genresStats = {
      genres: ['Drama', 'Thriller', 'Animation'],
      counts : [13, 11, 9]
    };

    if (this.#statisticElement === null) {
      remove(this.#statisticElement);
    }
    this.#statisticElement = new Statistics({
      generalStats,
      externalHandlers: {
        onPeriodChanges: this.onPeriodChanges,
      },
    });
    render(this.#container, this.#statisticElement);
    this.renderChart({statisticElement: this.#statisticElement, genresStats});
  }

  onPeriodChanges = (period) => {
    this.#selectedStats = period;
    console.log(getPeriod(period).start.toString());

    this.renderStatsContent();

  }
}
