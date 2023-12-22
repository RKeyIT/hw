/* 
2) Создать класс Calculator. Конструктор класса должен принимать два валидных числа, 
иначе (если параметра не два или хотя бы один из них невалидный number) бросать 
ошибку (throw new Error('')). 

Данный класс должен иметь методы 
setX, setY, logSum, logMul, logSub, logDiv.
- setX(num) - задаёт первому из чисел новое значение. 
    Кидать ошибку если параметр не передан или является невалидным числом;
- setY(num) - задаёт второму из чисел новое значение. 
    Кидать ошибку если параметр не передан или является невалидным числом;
- logSum() - выводит в консоль сумму двух наших чисел внутри класса;
- logMul() - выводит в консоль произведение двух наших чисел внутри класса;
- logSub() - выводит в консоль разность двух наших чисел внутри класса;
- logDiv() - выводит в консоль частное двух наших чисел внутри класса ИЛИ 
    кидает ошибку, если второе число (Y) равняется нулю.

!ВАЖНО! Все методы класса должны отрабатывать корректно ДАЖЕ в случае 
копирования функций в отдельные переменные.

> Пример:
const calculator = new Calculator(12, 3);
calculator.logSum(); // 15
calculator.logDiv(); // 4
calculator.setX(15);
calculator.logDiv(); // 5
const logCalculatorDiv = calculator.logDiv;
logCalculatorDiv(); // 5
calculator.setY(444n); // Ошибка!

Функцию и класс называем так, как написано в задании. Проверять буду тестами.

P.s. Infinity, -Infinity и NaN - это невалидные числа (делаю такую пометку в первый и последний раз).

Задание новое, так что там есть ошибки и нужно будет ещё дополнять условия
*/

class Calculator {
  constructor(x, y) {
    if (!(Calculator.isValidNumber(x) && Calculator.isValidNumber(y))) {
      throw new Error('Одно или два числа не получены или невалидны!');
    }

    Calculator.x = x;
    Calculator.y = y;
  }

  static isValidNumber(num) {
    return typeof num === 'number' && !isNaN(num) && isFinite(num);
  }

  setX(x) {
    if (Calculator.isValidNumber(x)) {
      return (Calculator.x = x);
    }

    throw new Error('Переданное число невалидно!');
  }

  setY(y) {
    if (Calculator.isValidNumber(y)) {
      return (Calculator.y = y);
    }

    throw new Error('Переданное число невалидно!');
  }

  logSum() {
    console.log(Calculator.x + Calculator.y);
  }

  logMul() {
    console.log(Calculator.x * Calculator.y);
  }

  logSub() {
    console.log(Calculator.x - Calculator.y);
  }

  logDiv() {
    if (Calculator.y === 0) {
      throw new Error('На ноль делить нельзя!');
    }

    console.log(Calculator.x / Calculator.y);
  }
}

// Another calculator can broke this logic. It can be fixed by Singleton pattern
// const anotherCalculator = new Calculator(10, 1);
// anotherCalculator.logSum(); // 11

const calculator = new Calculator(12, 3);
calculator.logSum(); // 15
calculator.logDiv(); // 4
calculator.setX(15);
calculator.logDiv(); // 5
const logCalculatorDiv = calculator.logDiv;
logCalculatorDiv(); // 5
// calculator.setY(444n); // Ошибка!
