import { differenceInHours, format, formatDistanceToNow } from "date-fns";

export const renderDateTime = (dateTime: string | null) => {
  if (!dateTime) return "";

  const date = new Date(dateTime);
  const now = new Date();

  // Guard against future dates (clock skew between server/client)
  if (date > now) return "just now";

  const timeDiff = differenceInHours(now, date);

  if (timeDiff > 1) {
    return format(date, "MMM d, yyyy 'at' h:mm a");
  }

  return formatDistanceToNow(date, {
    addSuffix: true,
  });
};
