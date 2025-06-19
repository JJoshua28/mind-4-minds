import {formatDistance} from "date-fns";

export function experienceDuration(occupationStartDate: Date) {
  const currentDate = new Date();
  return formatDistance(
    occupationStartDate,
    currentDate,
    {
      addSuffix: false,
    }
  );
}
