import { differenceInHours, format, formatDistanceToNow } from "date-fns";

export const renderDateTime = (dateTime: string) => {
  const timeDiff = differenceInHours(new Date(), new Date(dateTime));

  if (timeDiff > 1) {
    return format(new Date(dateTime), "MMM d, yyyy 'at' h:mm a");
  }

  return formatDistanceToNow(new Date(dateTime), {
    addSuffix: true,
  });
};
