export default () => (
  ['red', 'green', 'blue'].reduce((acc) => (
    acc += Math.round(Math.random() * 256).toString(16)
  ), '#')
);
