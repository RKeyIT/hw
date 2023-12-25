/* 
1) Написать свою функцию для глубокого копирования объектов. 
  При этом алгоритм должен осуществляться вручную (никаких вариантов с 
  использованием готовых библиотек или JSON.stringify() + JSON.parse(), 
  за это сразу 0 баллов за первую задачу). Функция должна называться makeObjectDeepCopy. 
  Это важно. Принимать функция должна один параметр - объект, копию которого нужно сделать.
*/

function getType(el) {
  return Object.prototype.toString
    .call(el)
    .replace(/.\w*.([A-Z]\w*)./, '$1')
    .toLowerCase();
}

function makeObjectDeepCopy(object) {
  if (typeof object !== 'object') {
    return object;
  }
  let copy;

  if (getType(object) === 'object') {
    copy = {};
    for (const key in object) {
      copy[key] = makeObjectDeepCopy(object[key]);
    }
    return copy;
  }

  if (getType(object) === 'array') {
    copy = object.map((el) => makeObjectDeepCopy(el));
    return copy;
  }

  return copy;
}

const obj1 = {
  a: 1,
  b: {
    aa: [1, { a: 2 }],
    bb: {
      aaa: 1,
      bbb: 1,
    },
  },
};

const obj2 = makeObjectDeepCopy(obj1);

obj2.b.bb = 2;
obj2.b.aa.push(3);
obj2.b.aa[1].a = 3;

console.log(obj1);
console.log(obj2);
