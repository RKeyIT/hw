/* 
Задание №6

Создать класс Car.
В нём должны быть свойства:
- brand (строка от 1 до 50 символов включительно)
- model (строка от 1 до 50 символов включительно)
- yearOfManufacturing (число от 1900 до текущего года включительно)
- maxSpeed (число от 100 до 300 км/ч)
- maxFuelVolume (число в литрах от 5 до 20)
- fuelConsumption (число в л/100км)
- currentFuelVolume (число в литрах, по умолчанию 0)
- isStarted (логический тип, по умолчанию false)
- mileage (число в километрах, по умолчанию 0)

И методы:
- start()
  Если заведена, выкидывать ошибку с текстом 'Машина уже заведена'
  Если не заведена, перевести соответствующий флаг в нужное состояние

- shutDownEngine()
  Если не заведена, выкинуть ошибку с текстом 'Машина ещё не заведена'
  Если заведена, перевести соответствующий флаг в нужное состояние

- fillUpGasTank(кол-во топлива в литрах)
  Если введено что-либо, кроме числа, выкидывать ошибку с текстом 
  'Неверное количество топлива для заправки'
  Если введено отрицательное число или 0, выкидывать ошибку с текстом 
  'Неверное количество топлива для заправки'
  Если в результате заправки макс. объем топлива будет превышен, то не 
  производить заправку, а выкидывать ошибку с текстом 'Топливный бак переполнен'
  В иных случаях увеличить текущий показатель топлива

- drive(скорость, кол-во часов)
  Если в качестве скорости поступает что-то кроме числа, отрицательное число или 0, 
  то выкидывать ошибку с текстом 'Неверная скорость'
  Если в качестве количества часов поступает что-то кроме числа, отрицательное 
  число или 0, выкидывать ошибку с текстом 'Неверное количество часов'
  Если скорость превышает максимальную, то выкидывать ошибку с текстом 'Машина не может ехать так быстро'
  Если машина не заведена, выкидывать ошибку с текстом 'Машина должна быть заведена, чтобы ехать'
  Если недостаточно топлива для совершения поездки, выкидывать ошибку с текстом 'Недостаточно топлива'
  В иных случаях вычесть необходимое топливо и добавить пробег

Ни одно из свойств не должно иметь возможности изменяться извне. 
Все должны быть приватными. Для свойств 
brand, model, yearOfManufacturing, maxSpeed, maxFuelVolume, fuelConsumption 
реализовать соответствующие геттеры (для получения текущего значения) и 
сеттеры (для установки нового значения, согласно ограничениям). 
Для свойств currentFuelVolume, isStarted и mileage реализовать только геттеры 
(для получения текущего значения). Все геттеры и сеттеры должны иметь те же имена, что описаны выше.

Все свои console.log, alert и тд и тп, пожалуйста, убирайте. И тесты с комментариями тоже.
Жду репозиторий с одним файлом car.js.
Ещё буду признателен, если пропишите экспорт своего класса export class Car

Проверять буду тестами так что все названия и текста ошибок должны у меня и у вас совпадать.
*/

class Car {}