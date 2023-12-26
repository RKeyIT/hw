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

  digitListener(el) {
    const {
      isFraction,
      fraction,
      isB,
      isSign,
      isCurrentNegative,
      maxInputLength,
    } = calculator;

    const isCorrectLength = (num) => `${num}`.length <= maxInputLength;

    const setNumber = (num) => {
      const formattedEl = isCurrentNegative ? `-${num}${el}` : `${num}${el}`;
      return isCorrectLength(formattedEl) ? +formattedEl || el : num;
    };

    const setFraction = () => {
      if (isSign() && !isB()) {
        return (calculator.b = 0);
      }
      if (fraction === null) {
        return (calculator.fraction = el);
      }
      if (isCorrectLength(calculator.fraction)) {
        return (calculator.fraction = +`${calculator.fraction}${el}`);
      }
    };

    const setOperand = (operand) => {
      // operand = 'a' || 'b'
      if (isCorrectLength(calculator[operand])) {
        if (isCurrentNegative) {
          calculator[operand] = setNumber(calculator[operand]);
          calculator.isCurrentNegative = false;
        } else {
          calculator[operand] = setNumber(calculator[operand]);
        }
      }
    };

    if (isFraction) {
      setFraction();
    } else if (!isSign()) {
      setOperand('a');
    } else {
      setOperand('b');
    }

    calculator.refreshResult();
  }

  signListener(el) {
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

  // End of Calculator class
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
    btn.addEventListener('click', () => calculator.digitListener(el));
    btn.className = `btn digit ${el}`;
    btn.style = `grid-area: d${el}`;
  } else {
    btn.addEventListener('click', () => calculator.signListener(el));
    btn.className = `btn sign ${generateSignName(el)}`;
    btn.style = `grid-area: ${generateSignName(el)}`;
  }

  return btn;
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
