// SECTION Calculator class
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
    '+': () => String(+this.a + +this.b),
    '-': () => String(+this.a - +this.b),
    '*': () => String(+this.a * +this.b),
    '/': () => String(+this.a / +this.b),
  };

  #a = null;
  #b = null;
  #sign = null;
  #error = null;
  #fraction = null;
  #prevOperation = null; // NOTE - it is an array of type [prevSign, prevB] || null
  #isFraction = false;
  #prevResult = '0';
  #maxInputLength;
  #maxResultLength;
  #maxFractionLength;

  constructor(maxInputLength = 10, maxFractLength = 8, maxResLength = 15) {
    this.#maxInputLength = maxInputLength;
    this.#maxResultLength = maxResLength;
    this.#maxFractionLength = maxFractLength;
  }

  get a() {
    return this.#a;
  }

  set a(value) {
    this.#a = value;
  }

  get b() {
    return this.#b;
  }

  set b(value) {
    this.#b = value;
  }

  get prevOperation() {
    return this.#prevOperation;
  }

  set prevOperation(arrOrNull) {
    this.#prevOperation = arrOrNull;
  }

  get operationsObj() {
    return this.#operationsObj;
  }

  get buttonsObj() {
    return this.#buttonsObj;
  }

  #isA = () => this.a !== null;
  #isB = () => this.b !== null;
  #isSign = () => this.#sign !== null;

  // SECTION - Calculate
  #calculate = () => {
    if (this.#sign === '/' && this.b === '0') {
      return this.#resetState('0', "Error: Can't devide by zero!");
    }

    const operation = this.operationsObj[this.#sign];
    const calculated = this.#resultToFixed(operation());

    const isUnsafeResultLength = calculated.length > this.#maxResultLength;

    if (isUnsafeResultLength) {
      const bigNum = this.#handleBigNum(calculated);

      return bigNum === '0'
        ? this.#resetState(bigNum, 'Error: Too big number!')
        : this.#resetState(bigNum, null, [this.#sign, this.b]);
    }

    return this.#resetState(calculated, null, [this.#sign, this.b]);
  }; // !SECTION

  // SECTION - Reset State
  #resetState = (toPrevResult = '0', error = null, prevOperation = null) => {
    this.#prevResult = toPrevResult;
    this.prevOperation = prevOperation;

    this.a = null;
    this.b = null;
    this.#sign = null;
    this.#error = error;
    this.#resetFraction();
    this.#refreshResult();
  }; // !SECTION

  // SECTION - Reset Fraction
  #resetFraction = () => {
    this.#fraction = null;
    this.#isFraction = false;
  }; // !SECTION

  // SECTION - Result Refresher
  #refreshResult = () => {
    let result;

    if (this.#isSign()) {
      result = this.#isB() ? this.b : this.#sign;
    } else {
      result = this.a || this.#prevResult;
    }

    currentValue.innerText = result;
    previousValue.innerText = this.#error || this.#prevResult;
    mathSign.innerText = this.#sign || 'S';
  }; // !SECTION

  // SECTION - handle big num notation
  #handleBigNum = (bigNumString) => {
    let isDecOutOfLength;
    let decreasableLength;
    let dotPosition;

    if (bigNumString.indexOf('.') + 1) {
      dotPosition = bigNumString.indexOf('.') + 1;
      isDecOutOfLength = dotPosition >= this.#maxResultLength;
      decreasableLength = this.#maxResultLength - dotPosition;
    }

    // CASE 1: If decreasing of decimal part can save the normal number
    if (decreasableLength > 1) {
      // CASE 4: Too big number -> #resetState with error
      if (bigNumString.indexOf('.') === 1) {
        return '0';
      }
      return String(parseFloat(bigNumString).toFixed(decreasableLength));
    }

    // CASE 2: Decimal dot on or out of max bound value
    if (isDecOutOfLength) {
      bigNumString = +bigNumString.round();
      this.#resetFraction();
    }

    // CASE 3: Number length is out of max result length
    if (bigNumString.length > this.#maxResultLength) {
      bigNumString = parseInt(bigNumString).toExponential(
        this.#maxFractionLength
      );
    }

    return String(bigNumString);
  }; // !SECTION

  // SECTION - Cut the number
  #resultToFixed = (calculated) => {
    if (Number.isSafeInteger(calculated)) {
      return calculated;
    }

    const lengthOfNum = calculated.length;
    const dotIndex = calculated.indexOf('.');
    const fractionLength = lengthOfNum - dotIndex - 1;
    const isNeedToCut = fractionLength > this.#maxFractionLength;

    // Handle cases with big fractions as result after 0.1 + 0.2
    let newResult = isNeedToCut
      ? parseFloat(Number(calculated).toFixed(this.#maxFractionLength))
      : parseFloat(calculated);

    return String(newResult);
  }; // !SECTION

  // SECTION - #removeOneDigit method
  #removeOneDigit = (numString) => {
    const preResetNumLength = numString[0] === '-' ? 2 : 1;

    if (numString.length <= preResetNumLength) return '0';

    if (
      numString[numString.length - 1] === '.' ||
      numString[numString.length - 2] === '.'
    ) {
      this.#resetFraction();
      return numString.replace(/(\d+)\.\d|\./, '$1');
    }

    return numString.replace(/(.+).\b/, '$1');
  }; // !SECTION

  // SECTION - Add Listener method
  addHandlerOnBtn = (key, handler) => {
    this.#buttonsObj[key] && handler(this.#buttonsObj[key]);
  }; // !SECTION

  // SECTION - Digit Listener
  digitListener = (el) => {
    const currentOperand = this.#isSign() ? 'b' : 'a';

    const isCorrectLength = (num) => num.length <= this.#maxInputLength;
    const isCorrectFractionLength = (num) =>
      num.length < this.#maxFractionLength;

    const setNumber = (operand) => {
      if (operand === '0' && el === '0') return operand;

      if ((!operand && operand !== '0') || (operand === '0' && el !== '0')) {
        operand = '';
      }

      const settledOperand = operand + el;

      return isCorrectLength(settledOperand) ? settledOperand : operand;
    };

    const setFraction = (operand) => {
      if (this.#isSign() && !this.#isB()) {
        this.b = '0';
      }

      if (!this.#isA()) {
        this.a = '0';
      }

      if (this.#fraction === null) {
        this.#fraction = el;
      } else {
        this.#fraction = isCorrectFractionLength(this.#fraction)
          ? this.#fraction + el
          : this.#fraction;
      }

      this[operand] = this[operand].replace(/(\d+).*/, '$1');
      this[operand] += '.' + this.#fraction;

      return this[operand];
    };

    const setOperand = (operand) => {
      // operand = 'a' || 'b'
      if (this[operand] === null || isCorrectLength(this[operand])) {
        this[operand] = setNumber(this[operand]);
      }
    };

    if (this.#isFraction) {
      setFraction(currentOperand);
    } else {
      setOperand(currentOperand);
    }

    this.#refreshResult();
  }; // !SECTION

  // SECTION - Sign Listener
  signListener = (newSign) => {
    switch (newSign) {
      case '+':
      case '*':
      case '/':
      case '-':
        if (this.#isFraction) {
          this.#resetFraction();
        }

        if (this.#error) {
          this.#error = null;
        }

        if (this.#isA() && this.#isB()) {
          this.#calculate();
          this.a = this.#prevResult;
          this.#sign = newSign;
          break;
        }

        if (this.#isA() && !this.#isB()) {
          this.#prevResult = this.a;
          this.#sign = newSign;
          break;
        }

        if (!this.#isA()) {
          this.a = this.#prevResult;
          this.#sign = newSign;
          break;
        }

        throw new Error(
          'signListener: switch-case (+-*/): Every of conditions were falsely!'
        );

      case '=':
        if (this.#isB()) {
          this.#calculate();
          break;
        }

        if (this.prevOperation) {
          this.a = this.#prevResult;
          this.#sign = this.prevOperation[0];
          this.b = this.prevOperation[1];
          this.#calculate();
          break;
        }

      case '+/-':
        if (!this.#isA()) {
          this.a = this.#prevResult;
        }

        this.#isB() ? (this.b = `${-+this.b}`) : (this.a = `${-+this.a}`);
        break;

      case '->':
        this.#isB()
          ? (this.b = this.#removeOneDigit(this.b))
          : this.#isA()
          ? (this.a = this.#removeOneDigit(this.a))
          : (this.a = this.#removeOneDigit(this.#prevResult));
        break;

      case 'C':
        this.#resetState();
        break;

      case '.':
        if (this.#isFraction) {
          break;
        }

        if (!this.#isFraction) {
          this.#isFraction = true;
        }

        if (this.#isSign() && !this.#isB()) {
          this.b = '0';
        }

        if (!this.#isA()) {
          this.a = '0';
        }

        // NOTE - Visual putting dot to existed operand
        this.#isB() ? (this.b += '.') : (this.a += '.');

        break;

      default:
        throw new Error('signListener switch error: DEFAULT CASE CAUSED');
    } // !SECTION

    this.#refreshResult();
  };
} // !SECTION Calculator class

const calculator = new Calculator();

// SECTION - Operations and numbers global listener
document.body.addEventListener('keydown', (e) => {
  if (!calculator.buttonsObj[e.key]) return;

  if (isNaN(+e.key)) {
    calculator.addHandlerOnBtn(e.key, calculator.signListener);
  } else {
    calculator.addHandlerOnBtn(e.key, calculator.digitListener);
  }
}); // !SECTION

// SECTION - Button active class switchers
document.body.addEventListener('keydown', (e) => {
  function addActiveClass(id) {
    const element = document.getElementById(id);
    element.classList.add('active');
  }

  calculator.addHandlerOnBtn(e.key, addActiveClass);
});
document.body.addEventListener('keyup', (e) => {
  function removeActiveClass(id) {
    const element = document.getElementById(id);
    element.classList.remove('active');
  }

  calculator.addHandlerOnBtn(e.key, removeActiveClass);
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
