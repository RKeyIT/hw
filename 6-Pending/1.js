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
Все должны быть приватными. 
Для свойств 
brand, model, yearOfManufacturing, maxSpeed, maxFuelVolume, fuelConsumption 
реализовать соответствующие геттеры (для получения текущего значения) и 
сеттеры (для установки нового значения, согласно ограничениям). 

Для свойств currentFuelVolume, isStarted и mileage реализовать только геттеры 
(для получения текущего значения). Все геттеры и сеттеры должны иметь те же имена, что описаны выше.
*/

class Car {
  #brand;
  #model;
  #yearOfManufacturing;
  #maxSpeed;
  #maxFuelVolume;
  #fuelConsumption;
  #currentFuelVolume = 0;
  #isStarted = false;
  #mileage = 0;
  constructor(
    brand,
    model,
    yearOfManufacturing,
    maxSpeed,
    maxFuelVolume,
    fuelConsumption
  ) {
    this.brand = brand;
    this.model = model;
    this.yearOfManufacturing = yearOfManufacturing;
    this.maxSpeed = maxSpeed;
    this.maxFuelVolume = maxFuelVolume;
    this.fuelConsumption = fuelConsumption;
  }

  // brand
  get brand() {
    return this.#brand;
  }
  set brand(name) {
    if (name.length < 1 || name.length > 50) {
      throw new Error('Длинна названия бренда должна быть от 1 до 50 знаков');
    }
    this.#brand = name;
  }

  // model
  get model() {
    return this.#model;
  }
  set model(name) {
    if (name.length < 1 || name.length > 50) {
      throw new Error('Длинна названия модели должна быть от 1 до 50 знаков');
    }
    this.#model = name;
  }

  // yearOfManufacturing
  get yearOfManufacturing() {
    return this.#yearOfManufacturing;
  }
  set yearOfManufacturing(year) {
    if (year < 1900 || year > new Date().getFullYear()) {
      throw new Error('Неверный год производства');
    }
    this.#yearOfManufacturing = year;
  }

  // maxSpeed
  get maxSpeed() {
    return this.#maxSpeed;
  }
  set maxSpeed(speed) {
    if (speed < 100 || speed > 300) {
      throw new Error(
        'Допустимая максимальная скорость в диапазоне от 100 до 300 км/ч'
      );
    }
    this.#maxSpeed = speed;
  }

  // maxFuelVolume
  get maxFuelVolume() {
    return this.#maxFuelVolume;
  }
  set maxFuelVolume(volume) {
    if (volume < 5 || volume > 20) {
      throw new Error('Максимальный объём топлива от 5 до 20 литров');
    }
    this.#maxFuelVolume = volume;
  }

  // fuelConsumption
  get fuelConsumption() {
    return this.#fuelConsumption;
  }
  set fuelConsumption(consumption) {
    this.#fuelConsumption = consumption / 100;
  }

  // currentFuelVolume
  get currentFuelVolume() {
    return this.#currentFuelVolume;
  }

  // isStarted
  get isStarted() {
    return this.#isStarted;
  }

  // mileage
  get mileage() {
    return this.#mileage;
  }

  start() {
    if (this.#isStarted) {
      throw new Error('Машина уже заведена');
    }
    this.#isStarted = true;
  }
  shutDownEngine() {
    if (!this.#isStarted) {
      throw new Error('Машина ещё не заведена');
    }
    this.#isStarted = false;
  }
  fillUpGasTank(liters) {
    if (!Number.isSafeInteger(liters) || liters <= 0) {
      throw new Error('Неверное количество топлива для заправки');
    }
    if (this.#currentFuelVolume + liters > this.#maxFuelVolume) {
      throw new Error('Топливный бак переполнен');
    }
    this.#currentFuelVolume += liters;
  }
  drive(speed, hours) {
    if (this.#isCanDrive(speed, hours)) {
      this.#currentFuelVolume -= speed * hours * this.fuelConsumption;
      this.#mileage += speed * hours;
    }
  }

  #isCanDrive(speed, hours) {
    if (!Number.isSafeInteger(speed) || speed <= 0 || speed > this.maxSpeed) {
      throw new Error('Неверная скорость');
    }
    if (isNaN(hours) || !isFinite(hours) || hours <= 0) {
      throw new Error('Неверное количество часов');
    }
    if (speed > this.maxSpeed) {
      throw new Error('Машина не может ехать так быстро');
    }
    if (!this.isStarted) {
      throw new Error('Машина должна быть заведена, чтобы ехать');
    }
    if (speed * hours * this.fuelConsumption > this.currentFuelVolume) {
      throw new Error('Топливо закончится раньше достижения пункта назначения');
    }
    return true;
  }
}

const car = new Car('abc', 'plus', 2016, 130, 18, 2);

car.fillUpGasTank(18);
car.start();
// car.start();
// car.shutDownEngine();
// car.shutDownEngine();
car.drive(100, 8.3);
// car.shutDownEngine();
car.drive(100, 0.2);
console.log(car.currentFuelVolume);
console.log(car.mileage);
