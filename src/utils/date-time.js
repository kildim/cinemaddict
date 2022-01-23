import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import objectSupport from 'dayjs/plugin/objectSupport';
import {Period} from '../constants';

dayjs.extend(relativeTime);
dayjs.extend(objectSupport);

const CINEMA_BIRTHDAY = '1895-12-28';

export const formatTime = (time) => dayjs({minute: time}).format('H[h] m[m]');
export const formatDate = (date) => dayjs(date).format('DD MMM YYYY');
export const formatCommentDataTime = (date) => dayjs(date).fromNow();

export const getPeriod = (period) => {
  const nowDate = dayjs(new Date());
  const startDate = dayjs(new Date());

  switch (period) {
    case Period.ALL_TIME:
      return {start: dayjs(CINEMA_BIRTHDAY).toDate(), end: nowDate};
    case Period.MONTH:
      return {start: startDate.subtract(1, 'month').add(1, 'day').toDate(), end: nowDate};
    case Period.YEAR:
      return {start: startDate.subtract(1, 'year').add(1, 'day').toDate(), end: nowDate};
    case Period.WEEK:
      return {start: startDate.subtract(1, 'week').add(1, 'day').toDate(), end: nowDate};
    case Period.TODAY:
      return {start: startDate.toDate(), end: nowDate.toDate()};
  }
};
