const display = document.getElementById("display");
const numberButtons = document.querySelectorAll(".numbers")
const operationButtons = document.querySelectorAll(".operations");
const decimalButton = document.getElementById("decimalButton");

let firstOperand = "";
let lastOperand = "";
let operation = null;
let result = null;
let displayValue = "";

const operate = {
    "+": (a, b) => +a + +b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => {
        if (+b === 0) {
            clear();
            displayError("division by zero");
        }
        return a / b;
    }
}

function updateDisplay() {
    selectDisplayValue();
    roundLongDecimals();
    preventDisplayOverflow();
    preventDivisionByZero();
    display.textContent = displayValue;
}

function selectDisplayValue() {
    if (result) {
        displayValue += result;
    } else if (firstOperand && !operation) {
        displayValue += firstOperand;
    } else if (lastOperand && operation) {
        displayValue += lastOperand;
    }
}

function roundLongDecimals() {
    const MAX_DECIMALS = 5;
    let decimalIndex = displayValue.indexOf(".");
    let decimalsCount = displayValue.slice(decimalIndex).length;
    if (decimalIndex > -1 && decimalsCount > MAX_DECIMALS) {
        displayValue = +displayValue.toFixed(MAX_DECIMALS);
    }
}

function preventDisplayOverflow() {
    const MAX_LENGTH_BEFORE_FIRST_OVERFLOW = 12;
    const MAX_LENGTH_BEFORE_SECOND_OVERFLOW = 17;
    if (displayValue.length > MAX_LENGTH_BEFORE_SECOND_OVERFLOW) {
        display.style.fontSize = `30px`;
    } else if (displayValue.length > MAX_LENGTH_BEFORE_FIRST_OVERFLOW) {
        display.style.fontSize = `40px`;
    } 
}

function displayError(message) {
    display.textContent = `Error: ${message}`;
}

function concatenateInputtedNumbers(e) {
    if (!operation) {
        firstOperand += ensureSingleDecimal(e, firstOperand);;
    } else if (operation) {
        lastOperand += ensureSingleDecimal(e, lastOperand);;
    }
    updateDisplay();
}

function ensureSingleDecimal(e, targetOperand) {
    if (e.target.value === "." && targetOperand.includes(".")) {
        e.target.value = "";
    }
    return e.target.value;
}

function getOperation(e) {
    if (firstOperand && operation && lastOperand) {
        result = operate[operation](firstOperand, lastOperand);
        firstOperand = result;
        operation = e.target.value;
    } else if (firstOperand) {
        operation = e.target.value;
    }
}

function equal() {
    if (firstOperand && operation && lastOperand) {
        let temp = operate[operation](firstOperand, lastOperand);
        clear();
        result = temp;
        updateDisplay();
    }
}

function backspace() {
    if (operation) {
        lastOperand = lastOperand.slice(0, lastOperand.length-1);
    } else {
        firstOperand = firstOperand.slice(0, firstOperand.length-1);
    }
}

function clear() {
    firstOperand = "";
    lastOperand = "";
    operation = null;
    result = null;
    displayValue = "";
}