import {removeChildren, render} from '../utils/render';
import Statistics from '../view/statistics';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Period} from '../constants';
import {getPeriod} from '../utils/date-time';
import {range} from '../utils/range';
import {getGenresMap, getTopGenre, getWatchedCount, getWatchedDuration} from '../utils/stats';

export default class StatisticsPresenter {
  #selectedStats = null;
  #container = null;
  #statisticElement = null;
  #moviesModel = null;

  constructor(params) {
    const {moviesModel, container} = {...params};
    this.#container = container;
    this.#selectedStats = Period.ALL_TIME;
    this.#moviesModel = moviesModel;
  }

  clearContent = () => {
    removeChildren(this.#container);
    this.#statisticElement = null;
  }

  renderChart(params) {
    const {statisticElement, genresStats} = {...params};
    const BAR_HEIGHT = 50;
    const statisticCtx = statisticElement.chartContainer;

    statisticCtx.height = BAR_HEIGHT * genresStats.genres.length;
    new Chart(statisticCtx, {
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
    this.clearContent();

    const period = getPeriod(this.#selectedStats);
    const selectedFilms = this.#moviesModel.getWatched(range(period.start, period.end));
    const genresMap = getGenresMap(selectedFilms);

    const generalStats = {
      rank: this.#moviesModel.userRank,
      watched: getWatchedCount(selectedFilms),
      totalDuration: getWatchedDuration(selectedFilms),
      topGenre: getTopGenre(genresMap),
    };

    const genresStats = {
      genres: Array.from(genresMap.keys()),
      counts : Array.from(genresMap.values()),
    };

    this.#statisticElement = new Statistics({
      activeMenu: this.#selectedStats,
      stats: generalStats,
      externalHandlers: {
        changePeriodClickHandler: this.changePeriodClickHandler,
      },
    });
    render(this.#container, this.#statisticElement);
    this.renderChart({statisticElement: this.#statisticElement, genresStats});
  }

  changePeriodClickHandler = (period) => {
    this.#selectedStats = period;
    this.renderStatsContent();
  }
}
