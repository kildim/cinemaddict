import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
dayjs.extend(objectSupport);

export const formatTime = (time) => dayjs({minute: time}).format('H[h] m[m]');
export const formatDate = (date) => dayjs(date).format('DD MMM YYYY');
export const formatCommentDataTime = (date) => dayjs(date).format('YYYY[/]MM[/]DD HH[:]mm');
