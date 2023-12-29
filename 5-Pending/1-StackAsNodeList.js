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
  #nodeCounter = 0;
  #root = null;

  constructor(maxLength = 10) {
    this.maxLength = maxLength;
  }

  static fromIterable(iterable) {
    if (!iterable[Symbol.iterator]) {
      throw new Error('Получена не итерируемая сущность.');
    }

    const stack = new Stack(iterable.length || iterable.size);

    for (const element of iterable) {
      stack.push(element);
    }

    return stack;
  }

  isEmpty() {
    return this.#root === null;
  }

  push(element) {
    if (this.#nodeCounter >= this.maxLength) {
      throw new Error('Стек переполнен!');
    }
    this.#nodeCounter++;
    this.#root = new Node(element, this.#root);
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error('Стек пуст!');
    }

    const element = this.#root;
    this.#root = this.#root.next;
    this.#nodeCounter--;

    return element.value;
  }

  peek() {
    return this.#root.value;
  }

  toArray() {
    if (this.#root === null) {
      return null;
    }

    let rootCopy = this.#root;

    const array = [];

    while (rootCopy) {
      // or push for reverse logic
      array.unshift(rootCopy.value);
      rootCopy = rootCopy.next;
    }

    return array;
  }
}

class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

const a = Stack.fromIterable([1, 2, 3]);
const b = a.toArray();
console.log(a);
console.log(a.peek());
console.log(b);

const stack = new Stack(5);
stack.push(1);
stack.push(2);
stack.push(3);
stack.push(4);
stack.push(5);

const stackArray = stack.toArray();
console.log(stackArray);
console.log(stack.pop());
// stack.push(6); // Error

console.log(stack.isEmpty());
console.log(stack.pop());
console.log(stack.peek());
console.log(stack.pop());
console.log(stack.pop());
console.log(stack.pop());
// console.log(stack.pop()); // Error

const map = new Map();
const mapStack = Stack.fromIterable(map);
console.log(mapStack);

const set = new Set();
set.add(5);
set.add(2);
set.add(2);
const setStack = Stack.fromIterable(set);
console.log(setStack);
