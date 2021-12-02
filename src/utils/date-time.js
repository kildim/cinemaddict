import dayjs from 'dayjs';

export const formatTime = (time) => dayjs(time).format('H[h] m[m]');
