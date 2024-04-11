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
