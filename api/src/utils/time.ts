export const dateToMinuteOfDay = (
  date: Date
): number => {
  return (
    date.getHours() * 60 +
    date.getMinutes()
  );
};

export const getStartOfDay = (
  date: Date
): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  return start;
};

export const getEndOfDay = (
  date: Date
): Date => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return end;
};
