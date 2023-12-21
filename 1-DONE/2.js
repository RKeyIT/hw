function getSumAndQuotient(num1, num2) {
  const firstNum = +num1;
  const secondNum = +num2;
  const isSafeNums =
    Number.isSafeInteger(firstNum) && Number.isSafeInteger(secondNum);

  if (isSafeNums) {
    return console.log(
      `Ответ: ${firstNum + secondNum}, ${firstNum / secondNum}.`
    );
  }

  return console.log('Некорректный ввод!');
}

getSumAndQuotient(prompt(), prompt());
