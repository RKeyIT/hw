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

  deleteOneDigit(number) {
    let preResetNumLength = `${number}`[0] === '-' ? 2 : 1;

    return `${number}`.length > preResetNumLength
      ? +`${number}`.replace(/(.+).+\b/, '$1')
      : 0;
  }

  digitListener = (el) => {
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
        return (this.b = 0);
      }
      if (fraction === null) {
        return (this.fraction = el);
      }
      if (isCorrectLength(this.fraction)) {
        return (this.fraction = +`${this.fraction}${el}`);
      }
    };

    const setOperand = (operand) => {
      // operand = 'a' || 'b'
      if (isCorrectLength(this[operand])) {
        if (isCurrentNegative) {
          this[operand] = setNumber(this[operand]);
          this.isCurrentNegative = false;
        } else {
          this[operand] = setNumber(this[operand]);
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

    this.refreshResult();
  };

  signListener = (el) => {
    if (this.isFraction) {
      if (this.b !== null) {
        this.b = this.b + +`0.${this.fraction}`;
      } else {
        this.a = this.a + +`0.${this.fraction}`;
      }

      this.isFraction = false;
    }

    switch (el) {
      case '+':
      case '*':
      case '/':
        if (this.b !== null) {
          if (this.isFraction) {
            this.b += +`0.${this.fraction}`;
          }
          this.resetState(this.calculate());
          this.a = this.prevResult;
          this.sign = el;
          break;
        } else {
          if (this.isFraction) {
            this.a += +`0.${this.fraction}`;
          }
        }
        if (this.prevResult) {
          this.a = this.prevResult;
        }
        this.sign = el;
        break;

      case '-':
        if (this.b !== null) {
          this.resetState(this.calculate());
          this.a = this.prevResult;
          this.sign = el;
          break;
        }
        if (this.a === null) {
          if (this.prevResult) {
            this.a = this.prevResult;
            this.sign = el;
          } else {
            this.isCurrentNegative = true;
          }
        } else if (this.sign === null) {
          this.sign = el;
        } else {
          this.isCurrentNegative = true;
        }
        break;

      case '=':
        if (this.sign === null || this.b === null) {
          return;
        }
        this.calculate();
        break;

      case '+/-':
        if (this.b !== null) {
          this.b = -this.b;
        } else {
          this.a = -this.a;
        }
        break;

      case '->':
        if (this.b !== null) {
          this.b = this.deleteOneDigit(this.b);
        } else if (this.a !== null) {
          this.a = this.deleteOneDigit(this.a);
        } else {
          this.a = this.deleteOneDigit(this.prevResult);
        }

        break;

      case 'C':
        this.resetState();
        break;

      case '.':
        if (!this.isFraction) {
          this.isFraction = true;
        }

        if (this.sign !== null && this.b === null) {
          this.b = 0;
        }
        break;

      default:
        throw new Error('signListener error: something went wrong');
    }
    this.refreshResult();
  };

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
