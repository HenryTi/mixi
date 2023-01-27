export function renderDate(date: string): JSX.Element {
    if (!date) return null;
    let parts = date.split('-');
    let d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return <>{d.toDateString()}</>;
}

export function renderHourMinute(time: string): JSX.Element {
    let parts = time.split(':');
    return <>{parts[0]}:{parts[1]}</>;
}