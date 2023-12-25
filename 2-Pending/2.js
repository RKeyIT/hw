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

console.log(selectFromInterval([1, 3, 5], 5, 2)); // [3,5]
console.log(selectFromInterval([-2, -15, 0, 4], -13, -5)); // []
console.log(selectFromInterval(['aaa'], 2, 3)); // Ошибка!
