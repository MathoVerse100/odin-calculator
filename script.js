/*..............................*/
const numbers = {
    zero: 0, one: 1,
    two: 2, three: 3,
    four: 4, five: 5,
    six: 6, seven: 7,
    eight: 8, nine: 9,
};
const operations = {
    plus: '+',
    minus: "-",
    multiply: "×",
    divide: "÷",
    mod: "mod",
    xPowerY: "^",
    yRootX: "root-degree",
    logXBaseY: "log-base",
    nChooseR: "choose"
};
const singleFunctionals = {
    percent: (value) => {return value/100},
    reciprocal: (value) => {return 1 / value},
    squared: (value) => {return value ** 2},
    squareRoot: (value) => {return Math.sqrt(value)},
    modulus: (value) => {return Math.abs(value)},
    cubed: (value) => {return value ** 3},
    cubeRoot: (value) => {return Math.cbrt(value)},
    tenPower: (value) => {return 10 ** value},
    twoPower: (value) => {return 2 ** value},
    log: (value) => {return Math.log10(value)},
    ln: (value) => {return Math.log(value)},
    factorial: (value) => {return factorial(value)},
    negate: (value) => {return -value}
};
const nickname = {
    '+': '+',
    "-": "-",
    "×": "×",
    "÷": "÷",
    "mod": "%",
    "^": "^",
    "root-degree": "R",
    "log-base": "L",
    "choose": "C",

    percent: "percent",
    reciprocal: "1 /",
    squared: "squared",
    squareRoot: "square root",
    modulus: "modulus",
    cubed: "cubed",
    cubeRoot: "cube root",
    tenPower: "10 ^",
    twoPower: "2 ^",
    log: "log",
    ln: "ln",
    factorial: "factorial",
    negate: "negate"
};
/*..............................*/



function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};


function readNumber(number) {

    if ((number.length > 16 && !number.includes(".")) || (number.length > 18 && number.includes("."))) {
        return parseFloat(number.slice(0, -1));
    };

    if (isNumber(number)) {

        if (`${number}`.match(/\.[0-9]+$/)) {
            return number;
        };

        return parseFloat(number);

    } else {

        return NaN;

    };
};


function factorial(value) {
    if (value < 0) {
        return 0;
    } else if (value === 0) {
        return 1;
    } else if (value > 0 && value % 1 === 0) {
        let valueFactorial = 1

        for (let k = 2; k <= value; k++) {
            valueFactorial *= k;
        };
        
        return valueFactorial;
    } else {
        return NaN;
    };
};


function operate(a, b, operator) {

    a = parseFloat(a);
    b = parseFloat(b);
    let answer;

    switch (operator) {
        case "+":
            answer = a + b;
            break;
        case "-":
            answer = a - b;
            break;
        case "×":
            answer = a * b;
            break;
        case "÷":
            answer = a / b;
            break;
        case "mod":
            answer = a % b;
            break;
        case "%":
            answer = a % b;
            break;
        case "^":
            answer = a ** b;
            break;
        case "root-degree":
            answer = a ** (1/b);
            break;
        case "R":
            answer = a ** (1/b);
            break;
        case "log-base":
            answer = Math.log(a) / Math.log(b);
            break;
        case "L":
            answer = Math.log(a) / Math.log(b);
            break;
        case "choose":
            answer = a < b ? 0 : (a % 1 !== 0 || b % 1 !== 0) ? NaN : factorial(a) / (factorial(a - b) * factorial(b));
            break;
        case "C":
            answer = a < b ? 0 : (a % 1 !== 0 || b % 1 !== 0) ? NaN : factorial(a) / (factorial(a - b) * factorial(b));
            break;
    };

    return parseFloat(answer.toFixed(10));
};


function tokenizeBrackets(brackets) {
    let i = 0;
    const tokens = [];
    let symbols = Object.values(operations).map(value => nickname[value] || value).concat("(", ")");

    while (i < brackets.length) {
        if (symbols.includes(brackets[i])) {
            tokens.push(brackets[i]);
            i++;

        } else if (isNumber(brackets[i])) {
            let j = i;
            i++;

            while (i < brackets.length && !symbols.includes(brackets[i])) {
                i++;
            };

            tokens.push(brackets.slice(j, i));

        } else {
            i++; 
        };
    };

    return tokens;
};


function convertInfixToPostfix(brackets) {

    const precedence = {
        '+': 1,
        "-": 1,
        "×": 2,
        "÷": 2,
        "%": 2,
        "^": 3,
        "R": 3,
        "L": 3,
        "C": 3,
        "(": Infinity
    };

    const outputStack = [];
    const operatorStack = [];
    let pop;

    brackets = brackets.slice(1, brackets.length - 1);

    for (let i = 0; i < brackets.length; i++) {

        if (isNumber(brackets[i])) {
            outputStack.push(readNumber(brackets[i]));
        } else if (brackets[i] === ")") {

            if (!operatorStack.includes("(")) {
                return Error;
            };
            
            while (operatorStack.at(-1) !== "(") {
                pop = operatorStack.pop();
                outputStack.push(pop);            
            };

            operatorStack.pop();

        } else {
            while (operatorStack.length >= 1) {
                if (precedence[brackets[i]] <= precedence[operatorStack.at(-1)] && precedence[operatorStack.at(-1)] !== Infinity) {
                    pop = operatorStack.pop();
                    outputStack.push(pop);
                } else {
                    break;
                };
            };

            operatorStack.push(brackets[i]);

            };
        };

    return outputStack.concat(operatorStack.reverse());

};


function evaluatePostfix(postfix) {

    const actionStack = [];

    for (let i = 0; i < postfix.length; i++) {

        if (isNumber(postfix[i])) {
            actionStack.push(readNumber(postfix[i]));
        } else {
            let pop2 = actionStack.pop();
            let pop1 = actionStack.pop();

            let result = operate(pop1, pop2, postfix[i]);

            actionStack.push(result);
        };
    };

    return actionStack[0];

};


function historyBox(snapshot, divPlacement) {
    const createNewsElement = () => {
        const news = document.createElement('div');
        news.classList.add("news");

        const newsRecord = document.createElement('div');
        newsRecord.classList.add("news-record");

        const newsInformation = document.createElement('div');
        newsInformation.classList.add("news-information");

        news.style.textAlign = "right";
        news.style.boxSizing = "border-box";

        newsRecord.style.paddingRight = "2vw";
        newsRecord.style.paddingLeft = "2vw";
        newsRecord.style.paddingTop = "3px";
        newsRecord.style.paddingBottom = "20px";
        newsRecord.style.fontWeight = "700";
        newsRecord.style.fontSize = "30px";

        newsInformation.style.paddingRight = "2vw";
        newsInformation.style.paddingLeft = "2vw";
        newsInformation.style.paddingTop = "10px";
        newsInformation.style.color = "rgb(100, 100, 100)";

        newsRecord.textContent = snapshot.split(" ").at(-1);
        newsInformation.textContent = snapshot.split(" ").slice(0, -1).join("   ");

        news.addEventListener("mouseover", () => {
            newsRecord.style.backgroundColor = "rgb(230, 230, 230)";
            newsInformation.style.backgroundColor = "rgb(230, 230, 230)";
        });

        news.addEventListener("mouseout", () => {
            newsRecord.style.backgroundColor = "rgb(243, 243, 243)";
            newsInformation.style.backgroundColor = "rgb(243, 243, 243)";
            newsRecord.style.color = "black";
            newsInformation.style.color = "rgb(100, 100, 100)";
        });

        news.addEventListener("mousedown", () => {
            newsRecord.style.backgroundColor = "rgb(230, 230, 230)";
            newsInformation.style.backgroundColor = "rgb(230, 230, 230)";
            newsRecord.style.color = "rgb(150, 150, 150)";
            newsInformation.style.color = "rgb(150, 150, 150)";
            newsRecord.style.fontWeight = "1000";
        });

        news.addEventListener("mouseup", () => {
            newsRecord.style.color = "black";
            newsInformation.style.color = "rgb(100, 100, 100)";
        });

        news.addEventListener("click", () => {
            allElements[".C"][0].dispatchEvent(new Event("click"));
            allElements[".display-equation-scroll"].textContent = newsInformation.textContent;
            allElements[".display-frontier-scroll"].textContent = newsRecord.textContent;

            frontier[0] = readNumber(newsRecord.textContent);
            isInput = true;
        });

        news.append(newsInformation, newsRecord);
        return news;
    };

    const news1 = createNewsElement();
    const news2 = createNewsElement();

    document.querySelector(".timeline .timeline-history").prepend(news1);
    document.querySelector(".timeline-copy .timeline-history").prepend(news2);
}


function getEverything() {

    let everything = document.querySelectorAll("body *");
    let array = Array(everything.length).fill('');
    let i = 0;

    array = array.map((_) => {
        let newElement = `.${Object.values(everything)[i].className.split(" ").at(-1)}`;
        i++;
        return newElement !== "."
            ? (document.querySelectorAll(newElement).length > 1 
                ? [newElement, document.querySelectorAll(newElement)] 
                : [newElement, document.querySelector(newElement)]) 
            : Error;
    });

    return Object.fromEntries(array);

};


function convertStandardScinetific() {
    if (allElements[".scientific"].style.display === "none") {

        allElements[".standard"].style.display = "none";
        allElements[".scientific"].style.display = "flex";

        allElements[".calculator-type"].textContent = "Scientific";

    } else {

        allElements[".scientific"].style.display = "none";
        allElements[".standard"].style.display = "flex";

        allElements[".calculator-type"].textContent = "Standard";

    };
};

/*-------------------------------------------------------*/
/*-------------------------------------------------------*/
/*-------------------------------------------------------*/
const allElements = getEverything();
let frontier = ['0', ''];
let operand = [];
let equation = '';
let bracketCounter = 0;
let isInput = false;
let bracketContainer = '';
let bracketAnswer;
let isHistory = false;
const history = []
/*-------------------------------------------------------*/
/*-------------------------------------------------------*/
/*-------------------------------------------------------*/


window.addEventListener("resize", () => {
    isHistory = true;

    allElements[".history-image"].dispatchEvent(new Event("click"));
});


allElements[".navigation-image"].addEventListener("click", convertStandardScinetific);
allElements[".navigation-image"].dispatchEvent(new Event("click"));


allElements[".history-image"].addEventListener("click", () => {

    isHistory = !isHistory;

    if (isHistory) {
        allElements[".timeline-copy"].style.display = "block";
    } else {
        allElements[".timeline-copy"].style.display = "none";
    };

});


allElements[".trash-image"].forEach((button) => {
    button.addEventListener("click", () => {
        allElements[".timeline-history"].forEach((element) => {
            element.replaceChildren();
        });
    });
});


[allElements[".head-title"], allElements[".head-about"]].forEach((bigButton) => {

    bigButton.forEach((button) => {
        button.addEventListener("click", () => {

            if (button.classList.contains("head-title")) {

                allElements[".timeline-history"].forEach((element) => {
                    element.style.display = "flex";
                });
                allElements[".timeline-about"].forEach((element) => {
                    element.style.display = "none";
                });

                button.style.borderBottom = "0.25vh solid black";
                allElements[".head-about"].forEach((element) => {
                    element.style.borderBottom = "0.25vh solid rgb(243, 243, 243)";
                });

            } else if (button.classList.contains("head-about")) {

                allElements[".timeline-history"].forEach((element) => {
                    element.style.display = "none";
                });
                allElements[".timeline-about"].forEach((element) => {
                    element.style.display = "flex";
                });

                button.style.borderBottom = "0.25vh solid black";
                allElements[".head-title"].forEach((element) => {
                    element.style.borderBottom = "0.25vh solid rgb(243, 243, 243)";
                });

            };
        });
    });
});

for (let number in numbers) {

    allElements[`.${number}`].forEach((button) => {
        button.addEventListener("click", () => {

            if (bracketContainer.at(-1) !== ")") {

                if (equation.includes('=')) {
                    allElements[".C"][0].dispatchEvent(new Event("click"));
                };
    
                if (!isInput) {
                    isInput = true;
                };

                if (operand.length === 0) {
                    if (frontier[0] === `${Math.PI}` || frontier[0] === `${Math.E}`) {
                        frontier[0] = `${readNumber(numbers[number])}`;
                    } else {
                        frontier[0] = `${readNumber(`${frontier[0]}` + `${numbers[number]}`)}`;
                    };
    
                    allElements[".display-frontier-scroll"].textContent = frontier[0];
                } else {
                    if (frontier[1] === `${Math.PI}` || frontier[1] === `${Math.E}`) {
                        frontier[1] = `${readNumber(numbers[number])}`;
                    } else {
                        frontier[1] = `${readNumber(`${frontier[1]}` + `${numbers[number]}`)}`;
                    };
    
                    allElements[".display-frontier-scroll"].textContent = frontier[1];
                };
                
                allElements[".display-frontier"].scrollLeft = allElements[".display-frontier"].scrollWidth;

            };
        });
    });
};


["pi", "euler"].forEach((element) => {

    const piAndEuler = {
        pi: Math.PI, euler: Math.E
    };

    allElements[`.${element}`].addEventListener("click", () => {
        
        if (operand.length === 0) {
            frontier[0] = `${piAndEuler[element]}`;
            allElements[".display-frontier-scroll"].textContent = frontier[0];
        } else {
            frontier[1] = `${piAndEuler[element]}`;
            allElements[".display-frontier-scroll"].textContent = frontier[1];
        };

        if (!isInput) {
            isInput = true;
        };

    });
});


allElements[".decimal"].forEach((button) => {
    button.addEventListener("click", () => {

        if (operand.length === 0 && !frontier[0].includes(".")) {
            frontier[0] = frontier[0] + ".";
            allElements[".display-frontier-scroll"].textContent = frontier[0];
        } else if (operand.length !== 0 && !frontier[1].includes(".")) {
            if (frontier[1] !== '') {
                frontier[1] = frontier[1] + ".";
                allElements[".display-frontier-scroll"].textContent = frontier[1];    
            } else {
                frontier[1] = '0' + ".";
                allElements[".display-frontier-scroll"].textContent = frontier[1];    
            }
        };

    })
})


allElements[".backspace"].forEach((button) => {
    button.addEventListener("click", () => {
        let j;

        if (isInput || operand.length === 0) {        
            if (operand.length === 0) {
                j = 0;
            } else {
                j = 1;
            };
                
            if (frontier[j] !== '0' && frontier[j].length <= 1) {
                frontier[j] = '0';
            } else if (frontier[j].length > 1) {
                frontier[j] = frontier[j].slice(0, -1);
            };

            allElements[".display-frontier-scroll"].textContent = frontier[j];
        };
    });
});


allElements[".C"].forEach((button) => {
    button.addEventListener("click", () => {
        frontier = ['0', ''];
        operand.length = 0;
        equation = '';
        bracketCounter = 0;
        bracketContainer = '';
        isInput = false;
        allElements[".display-frontier-scroll"].textContent = '0';
        allElements[".display-equation-scroll"].textContent = '';

    });
});


allElements[".CE"].addEventListener("click", () => {
    let j;

    if (operand.length === 0) {
        j = 0;
        frontier[j] = '0';
    } else {
        j = 1;
        frontier[j] = '';
    };

    allElements[".display-frontier-scroll"].textContent = '0';

});


allElements[".second-options"].addEventListener("mouseover", () => {
    if (allElements[".second-options"].style.backgroundColor === "white") {

        allElements[".second-options"].style.backgroundColor = "rgb(220, 220, 220)";

    } else if (allElements[".second-options"].style.backgroundColor === "rgb(41, 41, 192)") {

        allElements[".second-options"].style.backgroundColor = "rgb(9, 12, 106)";
        allElements[".second-options"].style.color = "white";

    };

    allElements[".second-options"].style.transition =  "0.5s";
});


allElements[".second-options"].addEventListener("mouseout", () => {
    if (allElements[".second-options"].style.backgroundColor === "rgb(220, 220, 220)") {

        allElements[".second-options"].style.backgroundColor = "white";

    } else if (allElements[".second-options"].style.backgroundColor === "rgb(9, 12, 106)") {

        allElements[".second-options"].style.backgroundColor = "rgb(41, 41, 192)";
        allElements[".second-options"].style.color = "white";

    };
});


allElements[".second-options"].addEventListener("click", () => {

    if (allElements[".second-options"].style.color !== "white") {

        allElements[".second-options"].style.backgroundColor = "rgb(41, 41, 192)";
        allElements[".second-options"].style.color = "white";

        document.querySelectorAll(".second-option").forEach((button) => {
            button.style.display = "block";
        });

        document.querySelectorAll(".first-option").forEach((button) => {
            button.style.display = "none";
        });

    } else if (allElements[".second-options"].style.color === "white" || isStandard) {

        allElements[".second-options"].style.backgroundColor = "rgb(220, 220, 220)";
        allElements[".second-options"].style.color = "black";

        document.querySelectorAll(".second-option").forEach((button) => {
            button.style.display = "none";
        });

        document.querySelectorAll(".first-option").forEach((button) => {
            button.style.display = "block";
        });

    };

});


for (let operation in operations) {

    let operatorEvaluation = allElements[`.${operation}`];

    if (operatorEvaluation instanceof Element) {
        operatorEvaluation = [operatorEvaluation];
    };

    operatorEvaluation.forEach((button) => {
        button.addEventListener("click", () => {

            if (bracketCounter === 0 && !bracketContainer.includes(")")) {

                if (isInput && operand.length === 0) {

                    operand.push(operations[operation]);
                    equation = `${frontier[0]} ` + `${operations[operation]} `;
    
                    allElements[".display-equation-scroll"].textContent = `${equation}`;

                    isInput = !isInput;
    
                } else if (!isInput && operand.length === 0) {
    
                    frontier[0] = '0';
                    operand.push(operations[operation]);
                    equation = `${frontier[0]} ` + `${operations[operation]} `;
    
                    allElements[".display-equation-scroll"].textContent = `${equation}`;

                    isInput = !isInput;
    
                } else if (isInput && operand.length !== 0) {
    
                    let result = operate(frontier[0], frontier[1], operand.at(-1));
                    operand.push(operations[operation]);

                    if (equation.includes(")")) {
                        history.push(equation + `= ${result}`);
                    } else {
                        history.push(equation + `${frontier[1]} = ${result}`);
                    };

                    frontier[0] = `${result}`;
                    frontier[1] = '0';
    
                    equation = `${frontier[0]} ` + `${operations[operation]} `;
    
                    allElements[".display-equation-scroll"].textContent = `${equation}`;
                    allElements[".display-frontier-scroll"].textContent = `${result}`;
                    historyBox(history.at(-1), document.querySelector(".timeline .timeline-history"));

                    isInput = !isInput;
    
                } else if (!isInput && operand.length !== 0) {
    
                    operand[operand.length - 1] = operations[operation];
                    equation = `${frontier[0]} ` + `${operations[operation]} `;
    
                    allElements[".display-equation-scroll"].textContent = `${equation}`;

                };

            } else if (bracketCounter === 0 && bracketContainer.includes(")")) {

                bracketAnswer = evaluatePostfix(convertInfixToPostfix(tokenizeBrackets(bracketContainer)));
                bracketContainer = '';

                frontier[1] = `${bracketAnswer}`;
                button.dispatchEvent(new Event("click"));


            } else {

                if (!isInput) {

                    frontier[1] = '0';

                    if (nickname[bracketContainer.at(-1)] === undefined) {

                        equation = equation + `${frontier[1]} ${operations[operation]} `;
                        bracketContainer = bracketContainer + `${frontier[1]}` + `${nickname[operations[operation]]}`;

                    } else {

                        equation = equation.slice(0, -2) + `${operations[operation]} `;
                        bracketContainer = bracketContainer.slice(0, -1) + `${nickname[operations[operation]]}`;
                        
                    };


                    allElements[".display-equation-scroll"].textContent = equation;

                } else {

                    equation = equation + `${frontier[1]} ${operations[operation]} `;
                    bracketContainer = bracketContainer + `${frontier[1]}` + `${nickname[operations[operation]]}`;
                    
                    allElements[".display-equation-scroll"].textContent = equation;

                    frontier[1] = '0';
                    isInput = !isInput;

                };

            }
        });
    });
};


allElements[".equal"].forEach((button) => {
    button.addEventListener("click", () => {

        let operation;

        if (bracketCounter === 0 && bracketContainer.includes(")")) {

            bracketAnswer = evaluatePostfix(convertInfixToPostfix(tokenizeBrackets(bracketContainer)));
            bracketContainer = '';

            frontier[1] = `${bracketAnswer}`;

            button.dispatchEvent(new Event("click"));

        } else if (bracketCounter !== 0 && bracketContainer.includes("(")) {

            while (bracketCounter !== 0) {

                allElements[".right-bracket"].dispatchEvent(new Event("click"));

            };

            button.dispatchEvent(new Event("click"));

        } else {

            if (isInput && operand.length === 0) {

                equation = `${frontier[0]} ` + `= `;
    
                allElements[".display-equation-scroll"].textContent = `${equation}`;
                
                history.push(equation + `${frontier[0]}`);
                historyBox(history.at(-1), document.querySelector(".timeline .timeline-history"));
    
                isInput = !isInput;
    
            } else if (isInput && operand.length !== 0) {
    
                operation = Object.entries(operations).find(([_, value]) => value === operand.at(-1))[0];
    
                let result = operate(frontier[0], frontier[1], operand.at(-1));
    
                if (!equation.includes(")")) {
                    history.push(equation + `${frontier[1]} = ${result}`);
                    equation = `${frontier[0]} ` + `${operations[operation]} ` + `${frontier[1]} = `;
                } else {
                    equation = equation + "= ";
                    history.push(equation + `${result}`);
                };
    
                frontier[0] = `${result}`;
                frontier[1] = '0';
    
                allElements[".display-equation-scroll"].textContent = `${equation}`;
                allElements[".display-frontier-scroll"].textContent = `${result}`;
                historyBox(history.at(-1), document.querySelector(".timeline .timeline-history"));
    
                isInput = !isInput;
                
            } else if (!isInput && operand.length === 0) {
    
                isInput = true;
        
                allElements[".equal"][0].dispatchEvent(new Event("click"));
    
            } else if (!isInput && operand.length !== 0) {
    
                operation = Object.entries(operations).find(([_, value]) => value === operand.at(-1))[0];
                
                if (equation.includes(")")) {
    
                    frontier[1] = bracketAnswer;
    
                } else {
    
                    frontier[1] = readNumber(equation.split(" ").filter((value) => {
                        if (!isNaN(Number(value))) {
                            return value;
                        };
                    }).at(-1));
                    
                };
    
    
                let result = operate(frontier[0], frontier[1], operand.at(-1));
    
                equation = `${frontier[0]} ` + `${operations[operation]} ` + `${frontier[1]} = `;
                history.push(equation + `${result}`);
    
                allElements[".display-equation-scroll"].textContent = `${equation} `;
                allElements[".display-frontier-scroll"].textContent = `${result}`;
    
                frontier[0] = `${result}`;
                frontier[1] = '0';
    
                historyBox(history.at(-1), document.querySelector(".timeline .timeline-history"));

            };
        };
    });
});


for (let functional in singleFunctionals) {

    let functionalEvaluation = allElements[`.${functional}`];

    if (functionalEvaluation instanceof Element) {
        functionalEvaluation = [functionalEvaluation];
    };

    functionalEvaluation.forEach((button) => {

        let temporaryEquation;
        let holder;

        button.addEventListener("click", () => {

            if (bracketContainer.at(-1) !== ")" || frontier[1] !== '') {


                let factorialTest = [factorial(frontier[0]), factorial(frontier[1])];

                if (functional !== "factorial" || !factorialTest.some((element) => {return element === undefined}))  {
                    if (isInput && operand.length === 0) {
    
                        equation = `${nickname[functional]} ${frontier[0]} = `;
                        frontier[0] = `${readNumber(singleFunctionals[functional](frontier[0]))}`;
                        
                        allElements[".display-equation-scroll"].textContent = `${equation}`;
                        allElements[".display-frontier-scroll"].textContent = `${frontier[0]}`;
    
                        history.push(`${equation}  ${frontier[0]}`);
                        historyBox(history.at(-1), document.querySelector(".timeline .timeline-history"));
    
                    } else if (isInput && operand.length !== 0) {
    
                        temporaryEquation = `${frontier[0]} ${operand.at(-1)} ${nickname[functional]} ${frontier[1]} ? `
    
                        frontier[1] = `${readNumber(singleFunctionals[functional](frontier[1]))}`;
                        
                        allElements[".display-equation-scroll"].textContent = `${temporaryEquation}`;
                        allElements[".display-frontier-scroll"].textContent = `${frontier[1]}`;
    
                    } else if (!isInput && equation.includes('=')) {
                        holder = frontier[0];
                        allElements[".C"][0].dispatchEvent(new Event("click"));
            
                        frontier[0] = holder;
                        isInput = true;
                        button.dispatchEvent(new Event("click"));
                    };
                };
            };
        });
    });
};


allElements[".left-bracket"].addEventListener("click", () => {

    if (!equation.includes("=")) {

        if (!isInput && operand.length === 0) {

            frontier[0] = '0';
            frontier[1] = '0';
            operand.push("+");
            equation = `( `;
    
            bracketContainer = bracketContainer + "(";
    
            allElements[".display-equation-scroll"].textContent = equation;
    
        } else if (isInput && operand.length === 0) {
    
            allElements[".multiply"][0].dispatchEvent(new Event("click"));
    
            equation = equation + `( `;
            bracketContainer = bracketContainer + "(";
    
            allElements[".display-equation-scroll"].textContent = equation;
    
        } else if (!isInput && operand.length !== 0) {
    
            equation = equation + `( `;
            bracketContainer = bracketContainer + "(";
    
            allElements[".display-equation-scroll"].textContent = equation;
    
        } else if (isInput && operand.length !== 0) {

            if (bracketCounter === 0) {

                allElements[".multiply"][0].dispatchEvent(new Event("click"));
                bracketCounter--;

                allElements[".left-bracket"].dispatchEvent(new Event("click"));

            } else {

                equation = equation + `${frontier[1]} ${operations["multiply"]} ( `;
                bracketContainer = bracketContainer + `${frontier[1]}` + `${operations["multiply"]}` + `(`;
                frontier[1] = '0';
        
                allElements[".display-equation-scroll"].textContent = equation;
                isInput = !isInput;

            };
            
        };
    
        bracketCounter++;

    };

});


allElements[".right-bracket"].addEventListener("click", () => {

    if (bracketCounter > 0) {

        if (!isInput) {

            equation = equation + "0 " + ") ";
            bracketContainer = bracketContainer + "0)";

            allElements[".display-equation-scroll"].textContent = equation;

            frontier[1] = '';
            isInput = !isInput;

        } else {

            equation = equation + `${frontier[1]} ) `;
            bracketContainer = bracketContainer + `${frontier[1]}` + ")";
            frontier[1] = '';

            allElements[".display-equation-scroll"].textContent = equation;

        };

        bracketCounter--;

    };

});


document.addEventListener("keydown", (event) => {
    let pressedKey = event.key;

    switch (pressedKey) {

        case '0':
            allElements[`.zero`][0].dispatchEvent(new Event("click"));
            break;
        case '1':
            allElements[`.one`][0].dispatchEvent(new Event("click"));
            break;
        case '2':
            allElements[`.two`][0].dispatchEvent(new Event("click"));
            break;
        case '3':
            allElements[`.three`][0].dispatchEvent(new Event("click"));
            break;
        case '4':
            allElements[`.four`][0].dispatchEvent(new Event("click"));
            break;
        case '5':
            allElements[`.five`][0].dispatchEvent(new Event("click"));
            break;
        case '6':
            allElements[`.six`][0].dispatchEvent(new Event("click"));
            break;
        case '7':
            allElements[`.seven`][0].dispatchEvent(new Event("click"));
            break;
        case '8':
            allElements[`.eight`][0].dispatchEvent(new Event("click"));
            break;
        case '9':
            allElements[`.nine`][0].dispatchEvent(new Event("click"));
            break;
        case "+":
            allElements[`.plus`][0].dispatchEvent(new Event("click"));
            break;
        case "-":
            allElements[`.minus`][0].dispatchEvent(new Event("click"));
            break;
        case "=":
            allElements[`.equal`][0].dispatchEvent(new Event("click"));
            break;
        case "*":
            allElements[`.multiply`][0].dispatchEvent(new Event("click"));
            break;
        case "/":
            allElements[`.divide`][0].dispatchEvent(new Event("click"));
            break;
        case ".":
            allElements[`.decimal`][0].dispatchEvent(new Event("click"));
            break;
        case "!":
            allElements[`.factorial`].dispatchEvent(new Event("click"));
            break;
        case "%":
            allElements[`.percent`][0].dispatchEvent(new Event("click"));
            break;
        case "^":
            allElements[`.xPowerY`].dispatchEvent(new Event("click"));
            break;
        case "|":
            allElements[`.modulus`].dispatchEvent(new Event("click"));
            break;
        case "m":
            allElements[`.mod`].dispatchEvent(new Event("click"));
            break;
        case "r":
            allElements[`.yRootX`].dispatchEvent(new Event("click"));
            break;
        case "l":
            allElements[`.logXBaseY`].dispatchEvent(new Event("click"));
            break;
        case "c":
            allElements[`.nChooseR`].dispatchEvent(new Event("click"));
            break;
        case "p":
            allElements[`.pi`].dispatchEvent(new Event("click"));
            break;
        case "e":
            allElements[`.euler`].dispatchEvent(new Event("click"));
            break;
        case "n":
            allElements[`.negate`][0].dispatchEvent(new Event("click"));
            break;
        case "(":
            allElements[`.left-bracket`].dispatchEvent(new Event("click"));
            break;
        case ")":
            allElements[`.right-bracket`].dispatchEvent(new Event("click"));
            break;
        case "Delete":
            allElements[`.C`][0].dispatchEvent(new Event("click"));
            break;
        case "Backspace":
            allElements[`.backspace`][0].dispatchEvent(new Event("click"));
            break;
    };
    
});
