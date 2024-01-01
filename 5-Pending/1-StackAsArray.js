/* 
Задание №5:

Создать класс Stack.
В качестве единственного необязательного параметра конструктор Stack должен 
принимать максимальное количество элементов в стеке. Если параметр является невалидным 
числом, генерировать ошибку. Если параметр не указан, задавать максимальный размер стека равным 10.

Реализовать публичные методы:
- push(elem) - добавить новый элемент в стек (генерировать ошибку, если стек переполнен);
- pop() - удалить верхний элемент стека и вернуть его (генерировать ошибку, если стек пуст);
- peek() - получить верхний элемент стека (вернуть null, если стек пуст);
- isEmpty() - возвращает логическое значение (пуст стек или нет);
- toArray() - возвращает новый массив, состоящий из элементов стека.

Реализовать статические публичные методы:
- fromIterable(iterable) - возвращает новый Stack, элементами которого 
    служат элементы переданной итерируемой сущности. 
    Максимальное количество элементов такого стека должно быть равно длине 
    этой сущности. Если сущность не является итерируемой генерировать ошибку.

Этого достаточно для получения максимального балла по данному ДЗ.
На что буду обращать внимание:
1) В первую и главную очередь буду смотреть на понимание структуры данных. 
    Т.е. если увижу в классе Stack что-то по типу обычного перебора элементов 
    по индексам или же использования встроенных методов массива, то минус задание. 
    Реализация класса должна полностью соответствовать сущности того, что вы реализуете. 
    Если стек работает только через верхний элемент, то и "крутиться" нужно от этого.

2) Кроме этого, естественно, все функции класса должны отрабатывать корректно. 
    Будут проверяться тестами. Однако ещё раз обращаю ваше внимание, что даже 
    при закрытии 100% тестов можно получить очень низкий балл из-за некорректной реализации.
*/

class Stack {
  // TODO - replace it by another implementation using class Node
  constructor(maxLength = 10) {
    if (
      typeof maxLength !== 'number' ||
      isNaN(maxLength) ||
      !isFinite(maxLength)
    ) {
      throw new Error('Length of Stack should be a valid number!');
    }
    this.values = [];
    this.maxLength = maxLength;
  }

  static fromIterable(iterable) {
    if (!iterable[Symbol.iterator]) {
      throw new Error('Полученая сущность не является итерируемой');
    }

    const instance = new Stack(iterable.length);

    iterable.forEach((el) => instance.push(el));

    return instance;
  }

  push(elem) {
    if (this.values.length >= this.maxLength) {
      throw new Error('Стек переполнен!');
    } else {
      this.values = [...this.values, elem];
    }
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error('Стек пуст!');
    } else {
      const element = this.peek();
      this.values.length = this.values.length - 1;
      return element;
    }
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    } else {
      return this.values[this.values.length - 1];
    }
  }

  isEmpty() {
    return !this.values.length;
  }
  toArray() {
    return [...this.values];
  }
}

const a = Stack.fromIterable([1, 2, 3]);
console.log(a);

const stack = new Stack(5);
stack.push(1);
stack.push(2);
stack.push(3);
stack.push(4);
stack.push(5);
// stack.push(6); // Error

console.log(stack.isEmpty());
console.log(stack.pop());
console.log(stack.peek());
console.log(stack.pop());
console.log(stack.pop());
console.log(stack.pop());
console.log(stack.pop());
// console.log(stack.pop()); // Error
