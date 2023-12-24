/* 
Кому будет скучно/недостаточно, можете сделать ещё один класс LinkedList. 
Конструктор этого класса не должен принимать никаких параметров.
Реализовать публичные методы:
- append(elem) - добавить элемент в конец связного списка;
- prepend(elem) - добавить элемент в начало связного списка;
- find(elem) - осуществить поиск по элементам по заданному 
    значению. Вернуть найденный элемент или null, если такого элемента нет;

- toArray() - возвращает новый массив, состоящий из элементов связного списка.

Реализовать статические публичные методы:
- fromIterable(iterable) - возвращает новый LinkedList, элементами 
которого служат элементы переданной итерируемой сущности. 
Если сущность не является итерируемой генерировать ошибку.
*/

class LinkedList {
  rootNode;

  static fromIterable(iterable) {
    if (!iterable.length && iterable.length !== 0) {
      throw new Error('Передана не итерируемая сущность');
    }

    const newList = new LinkedList();

    for (let i = 0; i < iterable.length; i++) {
      newList.append(iterable[i]);
    }

    return newList;
  }

  #findAndSetLastNode(node, elem) {
    if (node.next === null) {
      node.next = new Node(elem);
    } else {
      this.#findAndSetLastNode(node.next, elem);
    }
  }

  append(elem) {
    if (!this.rootNode) {
      this.rootNode = new Node(elem);
    } else if (this.rootNode.next === null) {
      this.rootNode.next = new Node(elem);
    } else {
      this.#findAndSetLastNode(this.rootNode.next, elem);
    }
  }

  prepend(elem) {
    if (this.rootNode) {
      this.rootNode = new Node(elem, this.rootNode);
    } else {
      this.rootNode = new Node(elem);
    }
  }

  find(elem) {
    if (!this.rootNode) {
      return null;
    }

    if (this.rootNode.value === elem) {
      return this.rootNode;
    }

    let currentNode = this.rootNode;

    while (currentNode.next !== null) {
      console.log(currentNode.next);
      if (currentNode.next.value === elem) {
        return currentNode.next;
      }
      currentNode = currentNode.next;
    }

    return null;
  }

  toArray() {
    if (!this.rootNode) {
      throw new Error('Этот список пуст');
    }

    let currentNode = this.rootNode;
    const resultArray = [currentNode.value];

    while (currentNode.next !== null) {
      resultArray.push(currentNode.next.value);
      currentNode = currentNode.next;
    }

    return resultArray;
  }
}

class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

const list = new LinkedList();

list.append(1);
list.append(2);
list.prepend(3);
list.prepend(4);
list.append(5);
list.append(6);

const array = list.toArray();
console.log(array);

console.log(LinkedList.fromIterable([5]));
