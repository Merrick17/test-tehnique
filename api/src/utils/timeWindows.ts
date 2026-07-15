import { AppError } from "./errors";

export type TimeWindowInput = {
  startMinute: number;
  endMinute: number;
};

export const validateTimeWindows = (
  windows: TimeWindowInput[]
): void => {
  const sorted = [...windows].sort(
    (a, b) =>
      a.startMinute - b.startMinute
  );

  for (const window of sorted) {
    if (
      window.startMinute < 0 ||
      window.endMinute > 1440
    ) {
      throw new AppError(
        "Time minutes must be between 0 and 1440"
      );
    }

    if (
      window.startMinute >=
      window.endMinute
    ) {
      throw new AppError(
        "startMinute must be lower than endMinute"
      );
    }
  }

  for (
    let index = 1;
    index < sorted.length;
    index += 1
  ) {
    const previous = sorted[index - 1];
    const current = sorted[index];

    if (
      current.startMinute <
      previous.endMinute
    ) {
      throw new AppError(
        "Delivery time windows cannot overlap"
      );
    }
  }
};
