import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {PERIOD} from '../constants';

dayjs.extend(relativeTime);

const CINEMA_BIRTHDAY = '1895-12-28';

export const formatTime = (time) => dayjs({minute: time}).format('H[h] m[m]');
export const formatDate = (date) => dayjs(date).format('DD MMM YYYY');
export const formatCommentDataTime = (date) => dayjs(date).fromNow();

export const getPeriod = (period) => {
  const nowDate = dayjs(new Date());
  const startDate = dayjs(new Date());

  switch (period) {
    case PERIOD.allTime:
      return {start: dayjs(CINEMA_BIRTHDAY).toDate(), end: nowDate};
    case PERIOD.month:
      return {start: startDate.subtract(1, 'month').add(1, 'day').toDate(), end: nowDate};
    case PERIOD.year:
      return {start: startDate.subtract(1, 'year').add(1, 'day').toDate(), end: nowDate};
    case PERIOD.week:
      return {start: startDate.subtract(1, 'week').add(1, 'day').toDate(), end: nowDate};
    case PERIOD.today:
      return {start: startDate.toDate(), end: nowDate.toDate()};
  }
};
