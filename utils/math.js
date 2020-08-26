export function getMean(values) {
  const n = values.length;

  return summation(values, x => x) / n;
}


export function getStandardDeviation(values) {
  const variance = getVariance(values);
  const n = values.length;

  return Math.sqrt(n / (n - 1) * variance);
}


export function getVariance(values) {
  const mean = getMean(values);
  const n = values.length;

  return summation(values, x => (x - mean) ** 2) / n;
}


function summation(values, termFunction) {
  return values
    .map(termFunction)
    .reduce((accumulator, value) => accumulator + value, 0);
}