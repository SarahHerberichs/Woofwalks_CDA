
export const getTimeRemaining = (futureDate) => {
  const now = new Date();
  const diffMs = new Date(futureDate).getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `${hours}h${minutes}`;
};
