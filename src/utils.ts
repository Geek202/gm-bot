import { padStart } from 'lodash';

export function format_millis(millis: number): string {

    const total_seconds = Math.round(millis / 1000);
    const seconds = total_seconds % 60;
    const total_minutes = Math.floor(total_seconds / 60);
    const minutes = total_minutes % 60;
    const hours = Math.floor(total_minutes / 60);

    let ret = "";
    if (hours !== 0) {
        ret += `${hours}h`;
    }
    if (minutes !== 0) {
        ret += `${minutes}m`;
    }
    if (ret.length === 0 || seconds !== 0) {
        ret += `${seconds}s`;
    }

    return ret;
}

function format_date_th(date: number): string {
    if ((date % 10) == 1 && date != 11) {
        return 'st';
    } else if ((date % 10) == 2 && date != 12) {
        return 'nd';
    } else if ((date % 10) == 3 && date != 13) {
        return 'rd';
    } else {
        return 'th';
    }
}

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

function pad(val: number): string {
    return padStart(val.toString(), 2, '0');
}

export function format_date(date: Date): string {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} on the`
        + ` ${date.getDate()}${format_date_th(date.getDate())} of ${months[date.getMonth()]} ${date.getFullYear()}`;
}
