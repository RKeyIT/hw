class Calculator {
  constructor() {
    (this.a = 0), (this.b = 0), (this.sign = '+');
  }

  calculate() {
    let result;

    switch (this.sign) {
      case '+':
        result = this.a + this.b;
        break;

      case '-':
        result = this.a - this.b;
        break;

      case '*':
        result = this.a * this.b;
        break;

      case '/':
        if (this.b === 0) {
          return "Error: Can't divide to zero!";
        }
        result = this.a / this.b;
        break;

      default:
        throw new Error("Can't calculate due to wrong sign or number!");
    }

    if (Number.isSafeInteger(result)) {
      return result;
    } else {
      return result.toFixed(8);
    }
  }
}

const calculator = new Calculator();
