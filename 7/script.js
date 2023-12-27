class Calculator {
  // TODO - Add 0.0.. type numbers functionallity (it's related with next TODOs)
  // TODO - extract the type casting logic and put it to math methods
  // TODO - other number values must be stored as the strings

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
    this.maxFractionLength = 3;

    this.operations = {
      '+': () => +(+this.a + +this.b),
      '-': () => +this.a - +this.b,
      '*': () => +this.a * +this.b,
      '/': () => +this.a / +this.b,
    };
    // possible divide sign ÷
  }

  isA = () => this.a !== null;
  isB = () => this.b !== null;
  isSign = () => this.sign !== null;

  // SECTION - Calculate
  calculate = () => {
    if (this.sign === '/' && this.b === 0) {
      return this.resetState(0, 'Error!');
    }
    return this.resetState(this.resultToFixed(this.operations[this.sign]()));
  };

  // SECTION - Cut the number
  resultToFixed = (result) => {
    if (Number.isSafeInteger(result)) {
      return (this.prevResult = result);
    }

    const isNeedToCut =
      `${result}`.length - `${result}`.includes('.') > this.maxFractionLength;
    // Handle cases with big fractions as result after 0.1 + 0.2
    if (isNeedToCut) {
      result = result.toFixed(this.maxFractionLength);
      result = +`${result}`.replace(/(\.[1-9]+)0+\b/g, '$1');
      console.log(result);
    }
    return (this.prevResult = result);
  };

  // SECTION - Reset State
  resetState = (toPrevResult, error) => {
    this.prevResult = toPrevResult || 0;

    this.a = toPrevResult || null;
    this.b = null;
    this.sign = null;
    this.error = error || null;
    this.fraction = null;
    this.isFraction = false;
    this.isCurrentNegative = false;
    this.refreshResult();
  };

  // SECTION - Result Refresher
  refreshResult = () => {
    let result;

    if (this.isSign()) {
      result = this.isFraction
        ? `${this.b}.${this.fraction || ''}`
        : this.isB()
        ? `${this.b}`
        : `${this.sign}`;
    } else {
      result = this.isFraction
        ? `${this.a || this.prevResult || 0}.${this.fraction || ''}`
        : `${this.a || this.prevResult || 0}`;
    }

    currentValue.innerText = result;
    previousValue.innerText = this.error || this.prevResult;
    mathSign.innerText = this.sign || 'S';
  };

  deleteOneDigit(number) {
    let preResetNumLength = `${number}`[0] === '-' ? 2 : 1;

    if (`${number}`.length > preResetNumLength) {
      return (this.prevResult = +`${number}`.replace(/(.+).+\b/, '$1'));
    }

    if (this.isFraction) {
      this.fraction = null;
      this.isFraction = false;
    }

    return (this.prevResult = 0);
  }

  // SECTION - Digit Listener
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
    const isCorrectFractionLength = (num) =>
      `${num}`.length < this.maxFractionLength;

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
      if (isCorrectFractionLength(this.fraction)) {
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

  // SECTION - Sign Listener
  signListener = (newSign) => {
    if (this.isFraction) {
      this.isB()
        ? (this.b = +`${this.b}.${this.fraction}`)
        : (this.a = +`${this.a}.${this.fraction}`);

      this.isFraction = false;
      this.fraction = null;
    }

    // TODO - Add an option to substract a negative number
    switch (newSign) {
      case '+':
      case '*':
      case '/':
      case '-':
        if (!this.isA()) {
          this.a = this.prevResult;
        } else if (this.isA() && !this.isB()) {
          this.prevResult = this.a;
        } else {
          this.calculate();
        }

        this.sign = newSign;
        break;

      case '=':
        this.isB() && this.calculate();
        break;

      case '+/-':
        this.isB() ? (this.b = -this.b) : (this.a = -this.a);
        break;

      case '->':
        this.isB()
          ? (this.b = this.deleteOneDigit(this.b))
          : this.isA()
          ? (this.a = this.deleteOneDigit(this.a))
          : (this.a = this.deleteOneDigit(this.prevResult));
        break;

      case 'C':
        this.resetState();
        break;

      case '.':
        if (!this.isFraction) {
          this.isFraction = true;
        }

        if (this.isSign() && !this.isB()) {
          this.b = 0;
        }
        break;

      default:
        throw new Error('signListener error: something went wrong');
    }

    this.refreshResult();
  };

  // NOTE - End of Calculator class
}

const calculator = new Calculator();

document.body.addEventListener('keydown', (e) => {
  const key = e.key;
  if (!isNaN(+key)) {
    return calculator.digitListener(+key);
  }

  switch (key) {
    case '+':
    case '-':
    case '*':
    case '/':
    case '=':
    case '.':
      return calculator.signListener(key);
    case 'Backspace':
      return calculator.signListener('->');
    case 'Delete':
      return calculator.signListener('C');
    case 'Enter':
      return calculator.signListener('=');
    default:
      return;
  }
});

const currentValue = document.getElementById('currentValue');
currentValue.innerText = calculator.a || 0;

const previousValue = document.getElementById('previousValue');
previousValue.innerText = calculator.prevResult || 0;

const mathSign = document.getElementById('mathSign');
mathSign.innerText = calculator.sign || 'S';

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
