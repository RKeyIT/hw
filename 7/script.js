class Calculator {
  constructor() {
    this.a = 0;
    this.b = null;
    this.sign = null;
    this.fraction = null;
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
        this.a = result.toFixed(8);
      } else {
        this.a = result;
      }

      return this.a;
    }
  }
}

const calculator = new Calculator();

const currentValue = document.getElementById('currentValue');
currentValue.innerText = calculator.a || 0;

const previousValue = document.getElementById('previousValue');

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

function refreshResult() {
  if (calculator.sign !== null) {
    if (calculator.isFraction) {
      const value = `${calculator.sign} ${calculator.b}.${calculator.fraction}`;
      currentValue.innerText = value;
    } else {
      if (calculator.b !== null) {
        const value = `${calculator.sign} ${calculator.b}`;
        currentValue.innerText = value;
      } else {
        const value = `${calculator.sign}`;
        currentValue.innerText = value;
      }
    }
  } else {
    if (calculator.isFraction) {
      const value = calculator.a || calculator.prevResult || 0;
      currentValue.innerText = `${value}.${calculator.fraction}`;
    } else {
      const value = calculator.a || calculator.prevResult || 0;
      currentValue.innerText = `${value}`;
    }
  }

  previousValue.innerText = calculator.prevResult;
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
  refreshResult();
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
        resetCalculatorState(calculator.calculate());
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
        resetCalculatorState(calculator.calculate());
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
      resetCalculatorState(calculator.calculate());
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
        calculator.b = deleteOneDigit(calculator.b);
      } else if (calculator.a !== null) {
        calculator.a = deleteOneDigit(calculator.a);
      } else {
        calculator.a = deleteOneDigit(calculator.prevResult);
      }

      break;

    case 'C':
      resetCalculatorState();
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
  refreshResult();
}

function resetCalculatorState(a) {
  calculator.prevResult = a || null;

  calculator.a = null;
  calculator.b = null;
  calculator.sign = null;
  calculator.fraction = null;
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
