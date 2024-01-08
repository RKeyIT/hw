// SECTION Calculator class
class Calculator {
  #UI = {
    digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    signs: ['+', '-', '*', '/', '+/-', '->', 'C', '.', '='],
    calculatorDiv: null,
    resultWindowDiv: null,
    currentValueDiv: null,
    previousValueDiv: null,
    mathSignDiv: null,
    buttonsDiv: null,
  };

  #buttonsObj = {
    ...this.#UI.digits,
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '=': '=',
    '.': '.',
    ',': '.', // <- // NOTE - Rus key - Additional . (decimal dot) behavior button
    Backspace: '->',
    Delete: 'C', // <- // NOTE - Additional C (reset) behavior button
    c: 'C', // <- // NOTE - Additional C (reset) behavior button
    C: 'C', // <- // NOTE - Additional C (reset) behavior button
    с: 'C', // <- // NOTE - Rus key - Additional C (reset) behavior button
    С: 'C', // <- // NOTE - Rus key - Additional C (reset) behavior button
    Enter: '=', // <- // NOTE - Additional = (equality) behavior button
  };

  #operationsObj = {
    '+': () => String(+this.#a + +this.#b),
    '-': () => String(+this.#a - +this.#b),
    '*': () => String(+this.#a * +this.#b),
    '/': () => String(+this.#a / +this.#b),
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

  constructor(maxInputLength = 10, maxFractLength = 8, maxResLength = 14) {
    this.#maxInputLength = maxInputLength;
    this.#maxResultLength = maxResLength;
    this.#maxFractionLength = maxFractLength;
  }

  #isA = () => this.#a !== null;
  #isB = () => this.#b !== null;
  #isSign = () => this.#sign !== null;

  // SECTION - Calculate
  #calculate = () => {
    if (this.#sign === '/' && this.#b === '0') {
      return this.#resetState('0', "Error: Can't devide by zero!");
    }

    const operation = this.#operationsObj[this.#sign];
    const calculated = this.#resultToFixed(operation());
    const isUnsafeResultLength = calculated.length > this.#maxResultLength;

    if (isUnsafeResultLength) {
      const bigNum = this.#handleBigNum(calculated);

      return bigNum === '0'
        ? this.#resetState(bigNum, 'Error: Too big number!')
        : this.#resetState(bigNum, null, [this.#sign, this.#b]);
    }

    return this.#resetState(calculated, null, [this.#sign, this.#b]);
  }; // !SECTION

  // SECTION - Reset State
  #resetState = (toPrevResult = '0', error = null, prevOperation = null) => {
    this.#prevResult = toPrevResult;
    this.#prevOperation = prevOperation;
    this.#a = null;
    this.#b = null;
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
      result = this.#isB() ? this.#b : this.#sign;
    } else {
      result = this.#a || this.#prevResult;
    }

    this.#UI.currentValueDiv.innerText = result;
    this.#UI.previousValueDiv.innerText = this.#error || this.#prevResult;
    this.#UI.mathSignDiv.innerText = this.#sign || 'S';
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
      // CASE 4: Too big number > 9e+20 -> #resetState with error
      if (bigNumString.indexOf('.') === 1) {
        return '0';
      }

      return String(parseFloat(bigNumString).toFixed(decreasableLength));
    }

    // CASE 2: Decimal dot on or out of max bound value
    if (isDecOutOfLength) {
      bigNumString = Math.round(bigNumString);
      this.#resetFraction();
    }

    // CASE 3: Number length is out of max result length
    if (String(bigNumString).length > this.#maxResultLength) {
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

    if (numString.length <= preResetNumLength) {
      return '0';
    }

    if (
      numString[numString.length - 1] === '.' ||
      numString[numString.length - 2] === '.'
    ) {
      this.#resetFraction();
      return numString.replace(/(\d+)\.\d|\./, '$1');
    }

    return numString.replace(/(.+).\b/, '$1');
  }; // !SECTION

  // SECTION - Digit Listener
  #digitListener = (el) => {
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
      if (operand !== 'a' && operand !== 'b') {
        throw new Error(
          `Received wrong operand === ${operand}. Expected: a || b`
        );
      }

      if (this.#isSign() && !this.#isB()) {
        this.#b = '0';
      }

      if (!this.#isA()) {
        this.#a = '0';
      }

      if (this.#fraction === null) {
        this.#fraction = el;
      } else {
        this.#fraction = isCorrectFractionLength(this.#fraction)
          ? this.#fraction + el
          : this.#fraction;
      }

      if (operand === 'a') {
        this.#a = this.#a.replace(/(\d+).*/, '$1');
        this.#a += '.' + this.#fraction;

        return this.#a;
      } else {
        this.#b = this.#b.replace(/(\d+).*/, '$1');
        this.#b += '.' + this.#fraction;

        return this.#b;
      }
    };

    const setOperand = (operand) => {
      // operand = 'a' || 'b'
      if (operand !== 'a' && operand !== 'b') {
        throw new Error(
          `Received wrong operand === ${operand}. Expected: a || b`
        );
      }

      if (operand === 'a') {
        if (!this.#isA() || isCorrectLength(this.#a)) {
          this.#a = setNumber(this.#a);
        }
      } else {
        if (!this.#isB() || isCorrectLength(this.#b)) {
          this.#b = setNumber(this.#b);
        }
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
  #signListener = (newSign) => {
    switch (newSign) {
      case '+':
      case '*':
      case '/':
      case '-':
        if (this.#isFraction) {
          this.#resetFraction();
        }

        if (this.#error && !this.#isA()) {
          break;
        } else {
          this.#error = null;
        }

        if (this.#isA() && this.#isB()) {
          this.#calculate();
          this.#a = this.#prevResult;
          this.#sign = newSign;
          break;
        }

        if (this.#isA() && !this.#isB()) {
          this.#prevResult = this.#a;
          this.#sign = newSign;
          break;
        }

        if (!this.#isA()) {
          this.#a = this.#prevResult;
          this.#sign = newSign;
          break;
        }

        throw new Error(
          'switch-case (+-*/): Every of conditions were falsely!'
        );

      case '=':
        if (this.#isB()) {
          this.#calculate();
          break;
        }

        if (!this.#isA() && this.#prevOperation) {
          this.#a = this.#prevResult;
          this.#sign = this.#prevOperation[0];
          this.#b = this.#prevOperation[1];
          this.#calculate();
          break;
        }

        break;

      case '+/-':
        if (!this.#isA()) {
          this.#a = this.#prevResult;
        }

        this.#isB() ? (this.#b = `${-+this.#b}`) : (this.#a = `${-+this.#a}`);
        break;

      case '->':
        this.#isB()
          ? (this.#b = this.#removeOneDigit(this.#b))
          : this.#isA()
          ? (this.#a = this.#removeOneDigit(this.#a))
          : (this.#a = this.#removeOneDigit(this.#prevResult));
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
          this.#b = '0';
        }

        if (!this.#isA()) {
          this.#a = '0';
        }

        // NOTE - Visual putting dot to existed operand
        this.#isB() ? (this.#b += '.') : (this.#a += '.');
        break;

      default:
        throw new Error('DEFAULT CASE CAUSED!');
    } // !SECTION

    this.#refreshResult();
  };

  #generateSignClassName = (el) => {
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
        throw new Error('DEFAULT CASE CAUSED!');
    }
  };

  #createHtmlButton = (el) => {
    const btn = document.createElement('button');
    const text = document.createTextNode(el);

    btn.appendChild(text);
    btn.type = 'button';
    btn.id = el;

    if (!isNaN(+el)) {
      btn.className = `btn digit ${el}`;
      btn.style = `grid-area: d${el}`;
    } else {
      btn.className = `btn sign ${this.#generateSignClassName(el)}`;
      btn.style = `grid-area: ${this.#generateSignClassName(el)}`;
    }

    // NOTE - Bluring focused element
    /* 
      If we're clicked a button the focus behavior caused.
      It means that if we'll use the Enter button after it 
      the focused element will be clicked again.
      Unexpected and needless behavior.
      'Enter' key is strictly for '=' operation
    */
    btn.addEventListener('focus', (e) => {
      if (this.#buttonsObj[e.target.id]) {
        const element = document.getElementById(e.target.id);

        element.blur();
      }
    });

    return btn;
  };

  #initializeUIContainers = (htmlContainer) => {
    this.#UI.calculatorDiv = document.createElement('div');
    this.#UI.calculatorDiv.className = 'calculator';

    this.#UI.resultWindowDiv = document.createElement('div');
    this.#UI.resultWindowDiv.className = 'result';

    this.#UI.currentValueDiv = document.createElement('div');
    this.#UI.currentValueDiv.className = 'currentValue';
    this.#UI.currentValueDiv.appendChild(document.createTextNode('0'));

    this.#UI.previousValueDiv = document.createElement('div');
    this.#UI.previousValueDiv.className = 'previousValue';
    this.#UI.previousValueDiv.appendChild(document.createTextNode('0'));

    this.#UI.mathSignDiv = document.createElement('div');
    this.#UI.mathSignDiv.className = 'mathSign';
    this.#UI.mathSignDiv.appendChild(document.createTextNode('S'));

    this.#UI.buttonsDiv = document.createElement('div');
    this.#UI.buttonsDiv.className = 'buttons';

    this.#UI.resultWindowDiv.appendChild(this.#UI.currentValueDiv);
    this.#UI.resultWindowDiv.appendChild(this.#UI.previousValueDiv);
    this.#UI.resultWindowDiv.appendChild(this.#UI.mathSignDiv);

    this.#UI.calculatorDiv.appendChild(this.#UI.resultWindowDiv);
    this.#UI.calculatorDiv.appendChild(this.#UI.buttonsDiv);

    htmlContainer.appendChild(this.#UI.calculatorDiv);
  };

  #initializeUIButtons = () => {
    const digitButtons = this.#UI.digits.map(this.#createHtmlButton);
    const signButtons = this.#UI.signs.map(this.#createHtmlButton);

    for (let i = 0; i < digitButtons.length; i++) {
      this.#UI.buttonsDiv.appendChild(digitButtons[i]);
    }

    for (let i = 0; i < signButtons.length; i++) {
      this.#UI.buttonsDiv.appendChild(signButtons[i]);
    }

    // NOTE - Adding click listener using event delegation.
    this.#UI.buttonsDiv.addEventListener('click', (e) => {
      if (!(e.target instanceof HTMLButtonElement)) {
        return;
      }

      const elementId = e.target.id;

      if (this.#UI.signs.some((el) => el === elementId)) {
        return this.#signListener(elementId);
      }

      if (this.#UI.digits.some((el) => el === elementId)) {
        return this.#digitListener(elementId);
      }

      console.error('Some unhandled entity was clicked!');
    });

    // NOTE - Adding keydown listener using event delegation.
    document.body.addEventListener('keydown', (e) => {
      const btn = this.#buttonsObj[e.key];

      if (btn) {
        const element = document.getElementById(btn);

        element.classList.add('active');

        if (this.#UI.digits.some((el) => el === btn)) {
          this.#digitListener(btn);
        } else {
          this.#signListener(btn);
        }
      }

      return;
    });

    // NOTE - Adding keyup listener using event delegation.
    document.body.addEventListener('keyup', (e) => {
      const key = e.key;

      if (this.#buttonsObj[key]) {
        const element = document.getElementById(this.#buttonsObj[key]);

        element.classList.remove('active');
      }

      return;
    });
  };

  initialize = (htmlContainer) => {
    if (!(htmlContainer instanceof HTMLElement)) {
      throw new Error(
        'Calculator initialize method ' +
          'wait for html element as a container for calculator'
      );
    }

    this.#initializeUIContainers(htmlContainer);
    this.#initializeUIButtons();
  };
} // !SECTION Calculator class

const calculator = new Calculator();
const container = document.getElementById('calculatorContainer');

calculator.initialize(container);
