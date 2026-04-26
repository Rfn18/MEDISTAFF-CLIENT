const getPagination = (current: number, total: number) => {
  const delta = 1;
  const range: (number | string)[] = [];

  if (total <= 3) {
    for (let i = 1; i <= total; i++) {
      range.push(i);
    }
    return range;
  }

  range.push(1);

  let left = Math.max(2, current - delta);

  let right = Math.min(total - 1, current + delta);

  if (left > 2) {
    range.push("...");
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) {
    range.push("...");
  }

  range.push(total);

  return range;
};

export default getPagination;
