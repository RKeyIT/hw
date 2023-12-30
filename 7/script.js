class Calculator {
  #buttonsObj = {
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '.': '.',
    ',': '.', // <- Rus key
    Backspace: '->',
    Delete: 'C',
    C: 'C',
    c: 'C',
    с: 'C', // <- Rus key
    С: 'C', // <- Rus key
    '=': '=',
    Enter: '=',
  };

  #operationsObj = {
    '+': () => +this.a + +this.b,
    '-': () => +this.a - +this.b,
    '*': () => +this.a * +this.b,
    '/': () => +this.a / +this.b,
  };

  constructor() {
    this.a = null;
    this.b = null;
    this.sign = null;
    this.error = null;
    this.fraction = null;
    this.isFraction = false;
    this.prevResult = '0';
    this.maxInputLength = 10;
    this.maxFractionLength = 8;

    // possible dividing sign ÷
  }

  get operationsObj() {
    return this.#operationsObj;
  }

  get buttonsObj() {
    return this.#buttonsObj;
  }

  isA = () => this.a !== null;
  isB = () => this.b !== null;
  isSign = () => this.sign !== null;

  // SECTION - Calculate
  calculate = () => {
    if (this.sign === '/' && this.b === '0') {
      return this.resetState('0', 'Error!');
    }

    const operation = this.operationsObj[this.sign];
    const calculated = operation();

    return this.resetState(this.resultToFixed(calculated));
  }; // !SECTION

  // SECTION - Cut the number | calculated: number
  resultToFixed = (calculated) => {
    if (Number.isSafeInteger(calculated)) {
      return `${calculated}`;
    }

    const lengthOfNum = `${calculated}`.length;
    const dotIndex = `${calculated}`.includes('.');
    const fractionLength = lengthOfNum - dotIndex - 1;
    const isNeedToCut = fractionLength > this.maxFractionLength;

    // Handle cases with big fractions as result after 0.1 + 0.2
    let newResult = isNeedToCut
      ? calculated.toFixed(this.maxFractionLength)
      : `${calculated}`;

    newResult = newResult.replace(/(\.\d*[1-9])0+\b/g, '$1');

    return newResult;
  }; // !SECTION

  // SECTION - Reset State
  resetState = (toPrevResult, error) => {
    this.prevResult = toPrevResult || '0';

    this.a = null;
    this.b = null;
    this.sign = null;
    this.error = error || null;
    this.fraction = null;
    this.isFraction = false;
    this.refreshResult();
  }; // !SECTION

  // SECTION - Result Refresher
  refreshResult = () => {
    let result;

    if (this.isSign()) {
      result = this.isB() ? `${this.b}` : `${this.sign}`;
    } else {
      result = this.a || this.prevResult;
    }

    currentValue.innerText = result;
    previousValue.innerText = this.error || this.prevResult;
    mathSign.innerText = this.sign || 'S';
  }; // !SECTION

  // SECTION - removeOneDigit method
  removeOneDigit(numString) {
    const preResetNumLength = numString[0] === '-' ? 2 : 1;

    if (numString.length <= preResetNumLength) return '0';

    if (numString[numString.length - 2] === '.') {
      this.fraction = null;
      this.isFraction = false;
      return numString.replace(/(\d+)\.\d/, '$1');
    }

    return numString.replace(/(.+).\b/, '$1');
  } // !SECTION

  // SECTION - Add Listener method
  addHandler(key, handler) {
    this.buttonsObj[key] && handler(this.buttonsObj[key]);
  } // !SECTION

  // SECTION - Digit Listener
  digitListener = (el) => {
    const currentOperand = this.isSign() ? 'b' : 'a';

    const isCorrectLength = (num) => `${num}`.length <= this.maxInputLength;
    const isCorrectFractionLength = (num) =>
      `${num}`.length < this.maxFractionLength;

    const setNumber = (operand) => {
      if (operand === '0' && el === '0') return operand;

      if ((!operand && operand !== '0') || (operand === '0' && el !== '0')) {
        operand = '';
      }

      const settledOperand = operand + el;

      return isCorrectLength(settledOperand) ? settledOperand : operand;
    };

    const setFraction = (operand) => {
      if (this.isSign() && !this.isB()) {
        this.b = '0';
      }

      if (!this.isA()) {
        this.a = '0';
      }

      if (this.fraction === null) {
        this.fraction = el;
      } else {
        this.fraction = isCorrectFractionLength(this.fraction)
          ? this.fraction + el
          : this.fraction;
      }

      this[operand] = this[operand].replace(/(\d+).*/, '$1');
      this[operand] += '.' + this.fraction;

      return this[operand];
    };

    const setOperand = (operand) => {
      // operand = 'a' || 'b'
      if (isCorrectLength(this[operand])) {
        this[operand] = setNumber(this[operand]);
      }
    };

    if (this.isFraction) {
      setFraction(currentOperand);
    } else {
      setOperand(currentOperand);
    }

    this.refreshResult();
  }; // !SECTION

  // SECTION - Sign Listener
  signListener = (newSign) => {
    switch (newSign) {
      case '+':
      case '*':
      case '/':
      case '-':
        if (this.isFraction) {
          this.fraction = null;
          this.isFraction = false;
        }

        if (this.isA() && this.isB()) {
          this.calculate();
          this.a = this.prevResult;
          this.sign = newSign;
          break;
        }

        if (this.isA() && !this.isB()) {
          this.prevResult = this.a;
          this.sign = newSign;
          break;
        }

        if (!this.isA()) {
          this.a = this.prevResult;
          this.sign = newSign;
          break;
        }

        throw new Error(
          'signListener: switch-case (+-*/): Something went wrong!'
        );

      case '=':
        if (this.isB()) this.calculate();
        break;

      case '+/-':
        if (!this.isA()) {
          this.a = this.prevResult;
        }

        this.isB() ? (this.b = `${-+this.b}`) : (this.a = `${-+this.a}`);
        break;

      case '->':
        this.isB()
          ? (this.b = this.removeOneDigit(this.b))
          : this.isA()
          ? (this.a = this.removeOneDigit(this.a))
          : (this.a = this.removeOneDigit(this.prevResult));
        break;

      case 'C':
        this.resetState();
        break;

      case '.':
        if (this.isFraction) {
          break;
        }

        if (!this.isFraction) {
          this.isFraction = true;
        }

        if (this.isSign() && !this.isB()) {
          this.b = '0';
        }

        if (!this.isA()) {
          this.a = '0';
        }

        // NOTE - Putting dot to existed operand
        this.b ? (this.b += '.') : (this.a += '.');

        break;

      default:
        throw new Error('signListener switch error: DEFAULT CASE CAUSED');
    } // !SECTION

    this.refreshResult();
  };

  // NOTE - End of Calculator class
}

const calculator = new Calculator();

// SECTION - Operations and numbers global listener
document.body.addEventListener('keydown', (e) => {
  if (!calculator.buttonsObj[e.key]) return;

  if (isNaN(+e.key)) {
    calculator.addHandler(e.key, calculator.signListener);
  } else {
    calculator.addHandler(e.key, calculator.digitListener);
  }
}); // !SECTION

// SECTION - Button active class switchers
document.body.addEventListener('keydown', (e) => {
  function addActiveClass(id) {
    const element = document.getElementById(id);
    element.classList.add('active');
  }

  calculator.addHandler(e.key, addActiveClass);
});
document.body.addEventListener('keyup', (e) => {
  function removeActiveClass(id) {
    const element = document.getElementById(id);
    element.classList.remove('active');
  }

  calculator.addHandler(e.key, removeActiveClass);
}); // !SECTION

const currentValue = document.getElementById('currentValue');
currentValue.innerText = calculator.a || '0';

const previousValue = document.getElementById('previousValue');
previousValue.innerText = calculator.prevResult || '0';

const mathSign = document.getElementById('mathSign');
mathSign.innerText = calculator.sign || 'S';

const UIDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
  createButton
);
const UIOps = ['+', '-', '*', '/', '+/-', '->', 'C', '.', '='].map(
  createButton
);

function createButton(el) {
  const btn = document.createElement('button');
  const text = document.createTextNode(el);
  btn.appendChild(text);
  btn.type = 'button';
  btn.id = el;

  if (!isNaN(+el)) {
    // NOTE -REFACTORING- is need to casting to String an element?
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

const buttonsContainer = document.getElementById('buttons');
function renderButtons() {
  for (let i = 0; i < UIDigits.length; i++) {
    buttonsContainer.appendChild(UIDigits[i]);
  }
  for (let i = 0; i < UIOps.length; i++) {
    buttonsContainer.appendChild(UIOps[i]);
  }
}

renderButtons();
// NOTE - Last string
