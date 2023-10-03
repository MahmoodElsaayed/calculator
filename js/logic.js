const display = document.getElementById("display");
const numberButtons = document.querySelectorAll(".numbers");
const operationButtons = document.querySelectorAll(".operations");
const equalsButton = document.getElementById("equalsButton");
const backSpaceButton = document.getElementById("backSpaceButton");
const clearButton = document.getElementById("clearButton");

numberButtons.forEach((button) => button.addEventListener("click", getOperand));
operationButtons.forEach((button) => button.addEventListener("click", getOperation));
equalsButton.addEventListener("click", equal);
backSpaceButton.addEventListener("click", backspace);
clearButton.addEventListener("click", clear);

let firstOperand = "";
let secondOperand = "";
let operation = "";
let displayValue = "";

const operate = {
    "+": (a, b) => +a + +b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
};

function updateDisplay() {
    if (!displayValue) selectDisplayValue();
    display.textContent = displayValue;
    preventDisplayOverflow();
    displayValue = "";
}

function selectDisplayValue() {
    if (secondOperand) displayValue = secondOperand;
    else if (firstOperand) displayValue = firstOperand;
    else displayValue = "";
}

function preventDisplayOverflow() {
    const MAX_LENGTH_BEFORE_FIRST_OVERFLOW = 12;
    const MAX_LENGTH_BEFORE_SECOND_OVERFLOW = 17;
    display.style.fontSize = `55px`;
    if (displayValue.length > MAX_LENGTH_BEFORE_SECOND_OVERFLOW) {
        display.style.fontSize = `30px`;
    } else if (displayValue.length > MAX_LENGTH_BEFORE_FIRST_OVERFLOW) {
        display.style.fontSize = `40px`;
    } else {
        display.setAttribute("style", "word-break: break-word;");
    }
}

function getOperand(event) {
    if (operation) {
        secondOperand += ensureSingleDecimal(event, secondOperand);
    } else {
        firstOperand += ensureSingleDecimal(event, firstOperand);
    }
    updateDisplay();
}

function ensureSingleDecimal(event, operand) {
    if (event.target.value === "." && operand.includes(".")) {
        return "";
    }
    return event.target.value;
}

function getOperation(event) {
    if (!firstOperand) {
        return;
    } else if (firstOperand && operation && secondOperand) {
        equal();
    }
    operation = event.target.value;
}

function equal() {
    if (firstOperand && operation && secondOperand) {
        firstOperand = operate[operation](firstOperand, secondOperand).toString();
        secondOperand = operation = "";
        ensureNoZeroDivision();
        roundLongDecimals();
        updateDisplay();
    }
}

function ensureNoZeroDivision() {
    if (firstOperand === "Infinity") {
        firstOperand = operation = "";
        display.style.fontSize = "30px";
        displayValue = "Error: Cannot divide by zero";
    }
}

function roundLongDecimals() {
    const MAX_DECIMALS = 2;
    let decimalIndex = firstOperand.indexOf(".");
    let decimalsCount = firstOperand.slice(decimalIndex).length;
    if (decimalIndex > -1 && decimalsCount > MAX_DECIMALS) {
        firstOperand = Number(firstOperand).toFixed(MAX_DECIMALS);
    }
}

function backspace() {
    if (operation) {
        secondOperand = secondOperand.slice(0, secondOperand.length - 1);
    } else {
        firstOperand = firstOperand.slice(0, firstOperand.length - 1);
    }
    updateDisplay();
}

function clear() {
    firstOperand = "";
    secondOperand = "";
    operation = "";
    updateDisplay();
}
