export type BusyCalendarInterval = {
  end: Date;
  id: string;
  start: Date;
};

function overlaps(leftStart: Date, leftEnd: Date, rightStart: Date, rightEnd: Date) {
  return leftStart.getTime() < rightEnd.getTime() && leftEnd.getTime() > rightStart.getTime();
}

export function slotIsBlocked(
  busy: BusyCalendarInterval[],
  start: Date,
  end: Date,
) {
  return busy.some((event) => overlaps(start, end, event.start, event.end));
}
