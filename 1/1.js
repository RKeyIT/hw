/* 
1) С помощью встроенной браузерной функции prompt поочерёдно ввести два значения. 
Если оба значения являются валидными числами, то вывести в консоли результат в виде 
первого числа в системе счисления второго.
Если хотя бы одно из введённых значений является некорректным числом, 
вывести в консоли сообщение: "Некорректный ввод!" и завершить программу.
> Примеры:
Вводим 10 и 2, получаем 1010
Вводим 872 и 8, получаем 1550
Вводим 2 и 'abc', получаем "Некорректный ввод!"
*/
function toNumber(value) {
  return +value;
}

function convertNumber(num1, num2) {
  const num = toNumber(num1);
  const radix = toNumber(num2);
  const isSafeNums = Number.isSafeInteger(num) && Number.isSafeInteger(radix);
  const isSafeRadix = radix < 2 && radix > 36;

  if (!isSafeNums || !isSafeRadix) {
    return console.log('Некорректный ввод!');
  }

  return console.log(toNumber(num.toString(radix)));
}

convertNumber(prompt(), prompt());

// convertNumber(10, 2); // 1010
// convertNumber(872, 8); // 1550
// convertNumber(2, 'abc'); // "Некорректный ввод!"
// convertNumber('0', ''); // "Некорректный ввод!"
// convertNumber('0', 0); // "Некорректный ввод!"
// convertNumber(0, '0'); // "Некорректный ввод!"
// convertNumber(0, ''); // "Некорректный ввод!"
// convertNumber(Infinity, NaN); // "Некорректный ввод!"
// convertNumber(NaN, Infinity); // "Некорректный ввод!"
