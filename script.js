class Calculator{
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.readyToReset = false;
        this.clear();
    }

    // default values are kept in clear function
    // clear function clears out variables
    // HTML data attribute is converted into camelCase
    // eg. data-current-operand to currentOperand
    clear(){
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }
    
    // delete function removing a single number
    delete(){
        // Removes last operand string with slicec function
        this.currentOperand = this.currentOperand.toString().slice(0,-1);
    }

    // append number to operand
    appendNumber(number){
        // toString() in order to append
        if(number === '.' && this.currentOperand.includes(".")) return
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    // chooseOperation function chooses an operator and appends to operand
    chooseOperation(operation){
        // if the currentOperand is empty, won't execute any further 
        if(this.currentOperand === '') return

        // If previous operand already existed then continue operation
        // Eg. 1+1=2 +1=3
        if(this.currentOperand !== '' && this.previousOperand !== ''){
            this.compute()
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    // compute function computes operation and shows output a single value
    compute(){
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        // if user clicks equals only
        // return cancels the function completely further
        if (isNaN(prev) || isNaN(current)) return;
        
        switch(this.operation){
            case'+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;    
                break;
            default:
                return;
        }
        this.readyToReset = true;
        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
    }

    // helper function for commas in digits

    getDisplayNumber(number){
        const stringNumber = number.toString();

        // create tuple for integerDigits before decimal point
        // and decimalDigits after decimal point
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];

        let integerDisplay
        if(isNaN(integerDigits)){
            integerDisplay = '';
        }else{
            integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits:0});
        }

        if (decimalDigits != null){
            return  `${integerDisplay}.${decimalDigits}`;
        } else{
            return integerDisplay;
        }

        // // since the number is currently a string, changing it to float
        // const floatNumber = parseFloat(number);
        // // since its NaN and we dont know how to format that NaN, so return empty
        // if (isNaN(floatNumber)) return '';
        // // toLocaleString() language sensitive
        // return floatNumber.toLocaleString('en');
    }

    // updateDisplay function update the values inside the operation 
    updateDisplay(){
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        // if the operation doesn't exist
        if (this.operation != null){
            this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`
        } else{
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// HTML Data attributes must be inside [] 
// querySelectorAll returns an array of objects with elements
// querySelector function for a single element
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const allClearButton = document.querySelector('[data-all-clear]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');

// Text element for operands
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

// Creating object named calculator and passing values from constructor
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement); 

// Everytime a button is clicked
// loop through number buttons
// append the number
// update the display

numberButtons.forEach(button => {
    button.addEventListener('click', ()=>{
        if(calculator.previousOperand === "" && calculator.currentOperand !== "" && calculator.readyToReset){
            calculator.currentOperand = "";
            calculator.readyToReset = false;
        }
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});


operationButtons.forEach(button => {
    button.addEventListener('click', ()=>{
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    })
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
});



