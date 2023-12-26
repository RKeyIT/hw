class Calculator {
  constructor() {
    this.a = null;
    this.b = null;
    this.sign = null;
    this.error = null;
    this.fraction = null;
    this.isFraction = false;
    this.isCurrentNegative = false;
    this.prevResult = 0;
    this.maxInputLength = 8;

    this.operations = {
      '+': () => +(this.a + this.b),
      '-': () => this.a - this.b,
      '*': () => this.a * this.b,
      '/': () => this.a / this.b,
    };
  }

  isA = () => this.a !== null;
  isB = () => this.b !== null;
  isSign = () => this.sign !== null;

  calculate = () => {
    if (this.sign === '/' && this.b === 0) {
      return this.resetState(0, 'Error!');
    }
    return this.resetState(this.resultToFixed(this.operations[this.sign]()));
  };

  resultToFixed = (result) => {
    if (Number.isSafeInteger(result)) {
      return (this.prevResult = result);
    }

    const isNeedToCut =
      `${result}`.length - `${result}`.includes('.') > this.maxInputLength;
    return isNeedToCut ? result.toFixed(this.maxInputLength) : result;
  };

  resetState = (toPrevResult, error) => {
    this.prevResult = toPrevResult || 0;

    this.a = null;
    this.b = null;
    this.sign = null;
    this.error = error || null;
    this.fraction = null;
    this.isFraction = false;
    this.isCurrentNegative = false;
    this.refreshResult();
  };

  refreshResult = () => {
    let result;

    if (this.isSign()) {
      result = this.isFraction
        ? `${this.sign} ${this.b}.${this.fraction}`
        : this.isB()
        ? `${this.sign} ${this.b}`
        : `${this.sign}`;
    } else {
      result = this.isFraction
        ? `${this.a || this.prevResult || 0}.${this.fraction}`
        : `${this.a || this.prevResult || 0}`;
    }

    currentValue.innerText = result;
    previousValue.innerText = this.error || this.prevResult;
  };
}

const calculator = new Calculator();

const currentValue = document.getElementById('currentValue');
currentValue.innerText = calculator.a || 0;

const previousValue = document.getElementById('previousValue');
previousValue.innerText = calculator.prevResult || 0;

const UIDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(createButton);
const UIOps = ['+', '-', '*', '/', '+/-', '->', 'C', '.', '='].map(
  createButton
);

const buttonsContainer = document.getElementById('buttons');

function createButton(el) {
  const btn = document.createElement('button');
  const text = document.createTextNode(el);
  btn.appendChild(text);
  btn.type = 'button';

  if (typeof el === 'number') {
    btn.addEventListener('click', () => digitListener(el));
    btn.className = `btn digit ${el}`;
    btn.style = `grid-area: d${el}`;
  } else {
    btn.addEventListener('click', () => signListener(el));
    btn.className = `btn sign ${generateSignName(el)}`;
    btn.style = `grid-area: ${generateSignName(el)}`;
  }

  return btn;
}

function digitListener(el) {
  if (calculator.isFraction) {
    if (calculator.sign !== null && calculator.b === null) {
      calculator.b = 0;
    }
    if (calculator.fraction === null) {
      calculator.fraction = el;
    } else if (`${calculator.fraction}`.length > 8) {
      return;
    } else {
      calculator.fraction = +`${calculator.fraction}${el}`;
    }
  } else if (!calculator.sign) {
    if (`${calculator.a}`.length >= 10) {
      return;
    }

    if (calculator.isCurrentNegative) {
      calculator.a = +`-${calculator.a}${el}` || -el;
      calculator.isCurrentNegative = false;
    } else {
      calculator.a = +`${calculator.a}${el}` || el;
    }
  } else {
    if (`${calculator.b}`.length >= 10) {
      return;
    }

    if (calculator.isCurrentNegative) {
      calculator.b = +`-${calculator.b}${el}` || -el;
      calculator.isCurrentNegative = false;
    } else {
      calculator.b = +`${calculator.b}${el}` || el;
    }
  }
  calculator.refreshResult();
}

function signListener(el) {
  if (calculator.isFraction) {
    if (calculator.b !== null) {
      calculator.b = calculator.b + +`0.${calculator.fraction}`;
    } else {
      calculator.a = calculator.a + +`0.${calculator.fraction}`;
    }

    calculator.isFraction = false;
  }

  switch (el) {
    case '+':
    case '*':
    case '/':
      if (calculator.b !== null) {
        if (calculator.isFraction) {
          calculator.b += +`0.${calculator.fraction}`;
        }
        calculator.resetState(calculator.calculate());
        calculator.a = calculator.prevResult;
        calculator.sign = el;
        break;
      } else {
        if (calculator.isFraction) {
          calculator.a += +`0.${calculator.fraction}`;
        }
      }
      if (calculator.prevResult) {
        calculator.a = calculator.prevResult;
      }
      calculator.sign = el;
      break;

    case '-':
      if (calculator.b !== null) {
        calculator.resetState(calculator.calculate());
        calculator.a = calculator.prevResult;
        calculator.sign = el;
        break;
      }
      if (calculator.a === null) {
        if (calculator.prevResult) {
          calculator.a = calculator.prevResult;
          calculator.sign = el;
        } else {
          calculator.isCurrentNegative = true;
        }
      } else if (calculator.sign === null) {
        calculator.sign = el;
      } else {
        calculator.isCurrentNegative = true;
      }
      break;

    case '=':
      if (calculator.sign === null || calculator.b === null) {
        return;
      }
      calculator.calculate();
      break;

    case '+/-':
      if (calculator.b !== null) {
        calculator.b = -calculator.b;
      } else {
        calculator.a = -calculator.a;
      }
      break;

    case '->':
      if (calculator.b !== null) {
        calculator.b = calculator.deleteOneDigit(calculator.b);
      } else if (calculator.a !== null) {
        calculator.a = calculator.deleteOneDigit(calculator.a);
      } else {
        calculator.a = calculator.deleteOneDigit(calculator.prevResult);
      }

      break;

    case 'C':
      calculator.resetState();
      break;

    case '.':
      if (!calculator.isFraction) {
        calculator.isFraction = true;
      }

      if (calculator.sign !== null && calculator.b === null) {
        calculator.b = 0;
      }
      break;

    default:
      throw new Error('signListener error: something went wrong');
  }
  calculator.refreshResult();
}

function generateSignName(el) {
  switch (el) {
    case '+':
      return 'plus';
    case '-':
      return 'minus';
    case '*':
      return 'multiply';
    case '/':
      return 'divide';
    case '+/-':
      return 'invert';
    case '->':
      return 'delete';
    case 'C':
      return 'reset';
    case '.':
      return 'dot';
    case '=':
      return 'equal';
    default:
      throw new Error('Somebody brokes the apllication!');
  }
}

function renderButtons() {
  for (let i = 0; i < UIDigits.length; i++) {
    buttonsContainer.appendChild(UIDigits[i]);
  }
  for (let i = 0; i < UIOps.length; i++) {
    buttonsContainer.appendChild(UIOps[i]);
  }
}

renderButtons();
