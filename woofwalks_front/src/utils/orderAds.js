

export const filterAndSortByFutureDate = (items, dateKey = "date") => {
  const now = new Date();
    return items
        .filter(item => new Date(item[dateKey]) > now)
        .sort((a, b) => new Date(a[dateKey]) - new Date(b[dateKey]));
    }


