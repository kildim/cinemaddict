import dayjs from 'dayjs';

export const formatTime = (time) => dayjs(time).format('H[h] m[m]');
export const formatDate = (date) => dayjs(date).format('DD MMM YYYY');
export const formatCommentDataTime = (date) => dayjs(date).format('YYYY[/]MM[/]DD HH[:]mm');
