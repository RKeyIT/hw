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

const UIDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(createButton);
const UIOps = ['+', '-', '*', '/', '+/-', '->', 'C', '.', '='].map(
  createButton
);

function createButton(el) {
  const btn = document.createElement('button');
  const text = document.createTextNode(el);
  btn.appendChild(text);
  btn.className = `btn ${el}`;
  btn.type = 'button';

  if (typeof el === 'number') {
    btn.style = `grid-area: d${el}`;
  } else {
    btn.style = `grid-area: ${applyGridAreaToSign(el)}`;
  }

  return btn;
}

function applyGridAreaToSign(el) {
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

console.log(UIDigits);
console.log(UIOps);

const btnUI = document.getElementById('buttons');

function renderButtons() {
  for (let i = 0; i < UIDigits.length; i++) {
    btnUI.appendChild(UIDigits[i]);
  }
  for (let i = 0; i < UIOps.length; i++) {
    btnUI.appendChild(UIOps[i]);
  }
}
renderButtons();
