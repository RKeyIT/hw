function isCorrectData(array, firstIndex, secondIndex) {
  return (
    Number.isSafeInteger(firstIndex) &&
    Number.isSafeInteger(secondIndex) &&
    array.prototype === [].prototype &&
    array.every(Number.isSafeInteger)
  );
}

function selectFromInterval(array, firstIndex, secondIndex) {
  if (!isCorrectData(...arguments)) {
    throw new Error('Ошибка!');
  }

  let min = firstIndex <= secondIndex ? firstIndex : secondIndex;
  let max = min === firstIndex ? secondIndex : firstIndex;

  return array.slice(min - 1, max);
}
