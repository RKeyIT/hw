/* 
2) С помощью встроенной браузерной функции prompt поочерёдно ввести два значения. 
Если первое значение является невалидным числом, вывести в консоли 
сообщение: "Некорректный ввод!" и завершить программу. В ином случае, 
если второе значение является невалидным числом вывести такое же сообщение об 
ошибке и завершить программу. Если оба значения являются валидными числами, 
то вывести в консоль результат в виде: "Ответ: [сумма двух чисел], [частное двух чисел]."
> Примеры:
Вводим 10 и 2, получаем "Ответ: 12, 5."
Вводим 872 и 8, получаем "Ответ: 880, 109."
Вводим 'abc', получаем "Некорректный ввод!"
*/
function toNumber(value) {
  return +value;
}

function getSumAndQuotient(num1, num2) {
  const firstNum = toNumber(num1);
  const secondNum = toNumber(num2);
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
