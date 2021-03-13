export default (arr, field: string) => {
  const fields = field.split('.');
  return arr.reduce((acc, curr) => {
    let separator = {...curr};
    fields.forEach((prop) => {
      separator = separator[prop];
    });
    if (!acc[separator]) {
      acc[separator] = [curr];
    } else {
      acc[separator].push(curr);
    }
    return acc;
  }, {})
};
