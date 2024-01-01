/* 
1) Написать свою реализацию встроенной функции массивов filter. 
Назвать функцию myFilter и сделать так, чтобы любой массив мог использовать данную функцию как "родную". 
В качестве параметров он должен принимать callback-функцию и как необязательный параметр объект, 
который будет использован в качестве this в рамках внутренних вызовов данной callback-функции.

В конечном итоге ваша реализация myFilter должна работать точно также как и встроенный метод filter. 
Callback-функция, переданная в качестве параметра, также должна вызываться с теми же параметрами, 
что и оригинал (элемент, индекс, массив).
*/

Array.prototype.myFilter = function (callback, thisArg = this) {
  if (typeof callback !== 'function') {
    throw new Error('callback argument is not a function');
  }

  const filteredArray = [];

  for (let i = 0; i < thisArg.length; i++) {
    const result = callback(thisArg[i], i, thisArg);

    if (result) {
      filteredArray.push(thisArg[i]);
    }
  }

  return filteredArray;
};

const testArray = [true, 1, NaN, 8.7, '', -Infinity, 3, 2, {}, 3.5, [], 'a'];

const filteredArr = testArray.myFilter((el, i, arr) => {
  return typeof el === 'number' && !isNaN(el) && isFinite(el);
});
console.log(filteredArr);
