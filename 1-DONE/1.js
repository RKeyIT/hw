function convertNumber(num1, num2) {
  const num = +num1;
  const radix = +num2;
  const isSafeNums = Number.isSafeInteger(num) && Number.isSafeInteger(radix);
  const isSafeRadix = radix > 1 && radix < 37;

  if (!isSafeNums || !isSafeRadix) {
    return console.log('Некорректный ввод!');
  }

  return console.log(+num.toString(radix) || num.toString(radix));
}

convertNumber(prompt(), prompt());
