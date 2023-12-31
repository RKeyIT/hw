/* 
2) Написать функцию createDebounceFunction. 
Она должна принимать два аргумента: callback-функцию и задержку в миллисекундах. 
Данная функция должна возвращать новую функцию, вызывающую callback-функцию с задержкой 
в переданное количество миллисекунд. ПРИ ЭТОМ! Если за то время, пока внутрення 
callback-функция ждёт своего вызова, наша созданная функция вызывается ещё раз, 
то "счётчик" времени должен сбрасываться и начинаться заново 
(т.е. вызова внутренней функции произойти не должно).

> Пример:
const log100 = () => console.log(100);
const debounceLog100 = createDebounceFunction(log100, 1000);
debounceLog100();
setTimeout(debounceLog100, 200); // так как задержка в 1000мс и новый вызов этой же функции 
                                 // происходит через 200 миллисекунд, то таймер запускается заново.
setTimeout(debounceLog100, 400); // снова сбрасываем таймер ещё через 200 миллисекунд
*/
const startTime = performance.now();

function createDebounceFunction(callback, delay) {
  let timer;

  return function () {
    if (timer) {
      clearTimeout(timer);
    }

    return (timer = setTimeout(callback, delay));
  };
}

const log100 = () => console.log(performance.now() - startTime);
const debounceLog100 = createDebounceFunction(log100, 1000);
debounceLog100();
setTimeout(debounceLog100, 200);
// так как задержка в 1000мс и новый вызов этой же функции
// происходит через 200 миллисекунд, то таймер запускается заново.

setTimeout(debounceLog100, 400); // снова сбрасываем таймер ещё через 200 миллисекунд
