export const convertToHoursAndMinutes = (min: string) => {
    const minutes = Number.parseInt(min, 10);

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    let result = '';
    if (hours > 0) {
        result += hours + 'h ';
    }

    if (remainingMinutes > 0) {
        result += remainingMinutes + 'm';
    }

    return result.trim();
};

export const formatNumber = (str: string) => {
    const number = parseFloat(str.replace(/,/g, ''));

    const K_THRESHOLD = 1000;
    const M_THRESHOLD = 1000000;

    if (number >= M_THRESHOLD) {
        const roundedNumber = (number / M_THRESHOLD).toFixed(1);
        return `${roundedNumber}M`;
    } else if (number >= K_THRESHOLD) {
        const roundedNumber = Math.round(number / K_THRESHOLD);
        return `${roundedNumber}K`;
    }

    return str;
};
