class Calculator {
  constructor() {
    this.a = 0;
    this.b = null;
    this.sign = null;
    this.prevResult = null;
    this.isFraction = false;
    this.isCurrentNegative = false;
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
          throw new Error("Error: Can't divide to zero!");
        }
        result = this.a / this.b;
        break;

      default:
        throw new Error("Can't calculate due to wrong sign or number!");
    }

    this.b = 0;

    if (Number.isSafeInteger(result)) {
      this.a = result;
      return this.a;
    } else {
      let dotIndex = `${result}`.includes('.');

      if (`${result}`.length - dotIndex > 8) {
        this.a = result.toPrecision(9);
      } else {
        this.a = result;
      }

      return this.a;
    }
  }
}

const calculator = new Calculator();

const result = document.getElementById('result');
result.innerText = calculator.a || 0;

const UIDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(createButton);
const UIOps = ['+', '-', '*', '/', '+/-', '->', 'C', '.', '='].map(
  createButton
);

const buttonsContainer = document.getElementById('buttons');

function createButton(el) {
  const btn = document.createElement('button');
  const text = document.createTextNode(el);
  btn.appendChild(text);
  btn.className = `btn ${el}`;
  btn.type = 'button';

  if (typeof el === 'number') {
    btn.addEventListener('click', () => digitListener(el));
    btn.style = `grid-area: d${el}`;
  } else {
    btn.addEventListener('click', () => signListener(el));
    btn.style = `grid-area: ${generateGridArea(el)}`;
  }

  return btn;
}

function refreshResult() {
  if (calculator.sign) {
    const value = `${calculator.a} ${calculator.sign} ${calculator.b}`;
    result.innerText = value;
  } else {
    const value = calculator.a || calculator.prevResult || 0;
    result.innerText = `${value} ${calculator.sign} ${calculator.b}`;
  }
}

function digitListener(el) {
  if (!calculator.sign) {
    if (`${calculator.a}`.length >= 10) {
      return;
    }

    if (calculator.isCurrentNegative) {
      calculator.a = +`-${calculator.a}${el}` || -el;
      calculator.isCurrentNegative = false;
    } else {
      calculator.a = +`${calculator.a}${el}` || el;
    }

    refreshResult();
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

    refreshResult();
  }
}

function signListener(el) {
  switch (el) {
    case '+':
    case '*':
    case '/':
      if (calculator.prevResult) {
        calculator.a = calculator.prevResult;
      }
      calculator.sign = el;
      refreshResult();
      break;

    case '-':
      if (!calculator.a) {
        if (calculator.prevResult) {
          calculator.a = calculator.prevResult;
          calculator.sign = el;
        } else {
          calculator.isCurrentNegative = true;
        }
      } else if (!calculator.sign) {
        calculator.sign = el;
      } else {
        calculator.isCurrentNegative = true;
      }
      refreshResult();
      break;

    case '+/-':
      if (calculator.b) {
        calculator.b = -calculator.b;
      } else {
        calculator.a = -calculator.a;
      }
      refreshResult();
      break;

    case '->':
      if (calculator.b) {
        calculator.b = deleteOneDigit(calculator.b);
      } else {
        calculator.a = deleteOneDigit(calculator.a);
      }

      refreshResult();
      break;

    case 'C':
      resetCalculatorState();
      break;

    case '.':
      if (!calculator.isFraction) {
        calculator.isFraction = true;
      }
      break;

    case '=':
      if (!calculator.sign || !calculator.b) {
        return;
      }
      resetCalculatorState(calculator.calculate());
      break;

    default:
      throw new Error('signListener error: something went wrong');
  }
}

function resetCalculatorState(a) {
  calculator.prevResult = a || null;

  calculator.a = null;
  calculator.b = null;
  calculator.sign = null;
  calculator.isFraction = false;
  calculator.isCurrentNegative = false;
  refreshResult();
}

function deleteOneDigit(number) {
  let preResetNumLength = `${number}`[0] === '-' ? 2 : 1;

  return `${number}`.length > preResetNumLength
    ? +`${number}`.replace(/(.+).+\b/, '$1')
    : 0;
}

function generateGridArea(el) {
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
