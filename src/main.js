import AppPresenter from './presenters/app-presenter';
import MoviesModel from './model/movies-model';
import DataProvider from './data-provider/data-provider';
import {AUTHORIZATION, BASE_URL} from './constants';

const dataProvider = new DataProvider(BASE_URL, AUTHORIZATION);
const moviesModel = new MoviesModel(dataProvider);
const appPresenter = new AppPresenter(moviesModel);

appPresenter.init();
moviesModel.loadMovies();
