export const safeJson = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
};

export const convertFloat = (num) => {
  let d = parseFloat(num);
  return isNaN(d) ? false : d;
};
