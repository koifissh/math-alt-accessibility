export function generateAltText(latex) {
    function getWordForm(form, n) {
        const numberWords = {
            ones: {
                0: { singularCardinal: "zero", pluralCardinal: "zeroes", singularOrdinal: "zeroth", pluralOrdinal: "zeroths" },
                1: { singularCardinal: "one", pluralCardinal: "ones", singularOrdinal: "first", pluralOrdinal: "firsts" },
                2: { singularCardinal: "two", pluralCardinal: "twos", singularOrdinal: "second", pluralOrdinal: "seconds", singularFractional: "half", pluralFractional: "halves" },
                3: { singularCardinal: "three", pluralCardinal: "threes", singularOrdinal: "third", pluralOrdinal: "thirds" },
                4: { singularCardinal: "four", pluralCardinal: "fours", singularOrdinal: "fourth", pluralOrdinal: "fourths", singularFractional: "quarter", pluralFractional: "quarters" },
                5: { singularCardinal: "five", pluralCardinal: "fives", singularOrdinal: "fifth", pluralOrdinal: "fifths" },
                6: { singularCardinal: "six", pluralCardinal: "sixes", singularOrdinal: "sixth", pluralOrdinal: "sixths" },
                7: { singularCardinal: "seven", pluralCardinal: "sevens", singularOrdinal: "seventh", pluralOrdinal: "sevenths" },
                8: { singularCardinal: "eight", pluralCardinal: "eights", singularOrdinal: "eighth", pluralOrdinal: "eighths" },
                9: { singularCardinal: "nine", pluralCardinal: "nines", singularOrdinal: "ninth", pluralOrdinal: "ninths" }
            },
            teens: {
                10: { singularCardinal: "ten", pluralCardinal: "tens", singularOrdinal: "tenth", pluralOrdinal: "tenths" },
                11: { singularCardinal: "eleven", pluralCardinal: "elevens", singularOrdinal: "eleventh", pluralOrdinal: "elevenths" },
                12: { singularCardinal: "twelve", pluralCardinal: "twelves", singularOrdinal: "twelfth", pluralOrdinal: "twelfths" },
                13: { singularCardinal: "thirteen", pluralCardinal: "thirteens", singularOrdinal: "thirteenth", pluralOrdinal: "thirteenths" },
                14: { singularCardinal: "fourteen", pluralCardinal: "fourteens", singularOrdinal: "fourteenth", pluralOrdinal: "fourteenths" },
                15: { singularCardinal: "fifteen", pluralCardinal: "fifteens", singularOrdinal: "fifteenth", pluralOrdinal: "fifteenths" },
                16: { singularCardinal: "sixteen", pluralCardinal: "sixteens", singularOrdinal: "sixteenth", pluralOrdinal: "sixteenths" },
                17: { singularCardinal: "seventeen", pluralCardinal: "seventeens", singularOrdinal: "seventeenth", pluralOrdinal: "seventeenths" },
                18: { singularCardinal: "eighteen", pluralCardinal: "eighteens", singularOrdinal: "eighteenth", pluralOrdinal: "eighteenths" },
                19: { singularCardinal: "nineteen", pluralCardinal: "nineteens", singularOrdinal: "nineteenth", pluralOrdinal: "nineteenths" }
            },
            tens: {
                20: { singularCardinal: "twenty", pluralCardinal: "twenties", singularOrdinal: "twentieth", pluralOrdinal: "twentieths" },
                30: { singularCardinal: "thirty", pluralCardinal: "thirties", singularOrdinal: "thirtieth", pluralOrdinal: "thirtieths" },
                40: { singularCardinal: "forty", pluralCardinal: "forties", singularOrdinal: "fortieth", pluralOrdinal: "fortieths" },
                50: { singularCardinal: "fifty", pluralCardinal: "fifties", singularOrdinal: "fiftieth", pluralOrdinal: "fiftieths" },
                60: { singularCardinal: "sixty", pluralCardinal: "sixties", singularOrdinal: "sixtieth", pluralOrdinal: "sixtieths" },
                70: { singularCardinal: "seventy", pluralCardinal: "seventies", singularOrdinal: "seventieth", pluralOrdinal: "seventieths" },
                80: { singularCardinal: "eighty", pluralCardinal: "eighties", singularOrdinal: "eightieth", pluralOrdinal: "eightieths" },
                90: { singularCardinal: "ninety", pluralCardinal: "nineties", singularOrdinal: "ninetieth", pluralOrdinal: "ninetieths" },
                100: { singularCardinal: "hundred", pluralCardinal: "hundreds", singularOrdinal: "hundredth", pluralOrdinal: "hundredths" }
            },
            scales: {
                1: { singularCardinal: "thousand", pluralCardinal: "thousands", singularOrdinal: "thousandth", pluralOrdinal: "thousandths" },
                2: { singularCardinal: "million", pluralCardinal: "millions", singularOrdinal: "millionth", pluralOrdinal: "millionths" },
                3: { singularCardinal: "billion", pluralCardinal: "billions", singularOrdinal: "billionth", pluralOrdinal: "billionths" }
            }
        };

        const helper = (form, n) => {
            if (n < 0) {
                return ' negative ' + helper(form, -n);
            }
            if (n < 10) {
                return numberWords["ones"][n][form] || numberWords["ones"][n][form.replace("Fractional", "Ordinal")];
            }
            if (n < 20) {
                return numberWords["teens"][n][form.replace("Fractional", "Ordinal")];
            }
            if (n < 100 && n % 10 == 0) {
                return numberWords["tens"][n][form.replace("Fractional", "Ordinal")];
            }
            if (n < 100) {
                return numberWords["tens"][n - (n % 10)]["singularCardinal"] + " " + numberWords["ones"][n % 10][form.replace("Fractional", "Ordinal")];
            }
            if (n < 1000 && n % 100 == 0) {
                return (n / 100 == 1 ? "" : numberWords["ones"][n / 100]["singularCardinal"]) + " " + numberWords["tens"][100][form.replace("Fractional", "Ordinal")];
            }
            if (n < 1000) {
                return (n / 100 < 2 ? "" : numberWords["ones"][(n - (n % 100)) / 100]["singularCardinal"]) + " hundred " + helper(form.replace("Fractional", "Ordinal"), n % 100);
            }
            for (let i = 1, scale = 1000; i < 4; i++, scale *= 1000) {
                if (n < scale * 1000 && (n / scale) % 1 == 0) {
                    return (n / scale == 1 ? "" : helper("singularCardinal", Math.floor(n / scale))) + " " + numberWords["scales"][i][form.replace("Fractional", "Ordinal")];
                }
                if (n < scale * 1000) {
                    return (n / scale == 1 ? "" : helper("singularCardinal", Math.floor(n / scale))) + " " + numberWords["scales"][i]["singularCardinal"] + " " + (helper(form.replace("Fractional", "Ordinal"), n % scale));
                }
            }
        };

        return helper(form, n);
    }

    const replacements = [
        // Remove unnessesary formatting
        { regex: /\\(text)/g, alt: '' },
        { regex: /\\(quad|,|!|:|;)/g, alt: ' ' },
        { regex: /\\(dfrac)/g, alt: '\\frac' },
        { regex: / {2}/g, alt: ' ' },
        { regex: /(\d)\{,\}(\d)/g, alt: (match, a, b) => {
            return `${a}${b}`;
        }},

        // Pre-formatting
        { regex: /\\right\)\\left\(/g, alt: '\\right) all \\cdot\\left(' },
        { regex: /(\d|!)\\left\(/g, alt: '$1\\cdot\\left(' },
        { regex: /(\d)([a-zA-Z]|\\)/g, alt: (match, digit, letter) => {
                return `${digit} ${letter}`;
        }},
        { regex: /([a-zA-Z])(\d|\\)/g, alt: (match, letter, digit) => {
             return `${letter} ${digit}`;
        }},

        // Lowercase Greek
        { regex: /\\alpha/g, alt: ' alpha ' },
        { regex: /\\beta/g, alt: ' beta ' },
        { regex: /\\gamma/g, alt: ' gamma ' },
        { regex: /\\delta/g, alt: ' delta ' },
        { regex: /\\epsilon/g, alt: ' epsilon ' },
        { regex: /\\zeta/g, alt: ' zeta ' },
        { regex: /\\eta/g, alt: ' eta ' },
        { regex: /\\theta/g, alt: ' theta ' },
        { regex: /\\iota/g, alt: ' iota ' },
        { regex: /\\kappa/g, alt: ' kappa ' },
        { regex: /\\lambda/g, alt: ' lambda ' },
        { regex: /\\mu/g, alt: ' mu ' },
        { regex: /\\nu/g, alt: ' nu ' },
        { regex: /\\xi/g, alt: ' xi ' },
        { regex: /\\omicron/g, alt: ' omicron ' },
        { regex: /\\pi/g, alt: ' pi ' },
        { regex: /\\rho/g, alt: ' rho ' },
        { regex: /\\sigma/g, alt: ' sigma ' },
        { regex: /\\tau/g, alt: ' tau ' },
        { regex: /\\upsilon/g, alt: ' upsilon ' },
        { regex: /\\phi/g, alt: ' phi ' },
        { regex: /\\chi/g, alt: ' chi ' },
        { regex: /\\psi/g, alt: ' psi ' },
        { regex: /\\omega/g, alt: ' omega ' },

        // Uppercase Greek
        { regex: /\\Alpha/g, alt: ' Alpha ' },
        { regex: /\\Beta/g, alt: ' Beta ' },
        { regex: /\\Gamma/g, alt: ' Gamma ' },
        { regex: /\\Delta/g, alt: ' Delta ' },
        { regex: /\\Epsilon/g, alt: ' Epsilon ' },
        { regex: /\\Zeta/g, alt: ' Zeta ' },
        { regex: /\\Eta/g, alt: ' Eta ' },
        { regex: /\\Theta/g, alt: ' Theta ' },
        { regex: /\\Iota/g, alt: ' Iota ' },
        { regex: /\\Kappa/g, alt: ' Kappa ' },
        { regex: /\\Lambda/g, alt: ' Lambda ' },
        { regex: /\\Mu/g, alt: ' Mu ' },
        { regex: /\\Nu/g, alt: ' Nu ' },
        { regex: /\\Xi/g, alt: ' Xi ' },
        { regex: /\\Omicron/g, alt: ' Omicron ' },
        { regex: /\\Pi/g, alt: ' Pi ' },
        { regex: /\\Rho/g, alt: ' Rho ' },
        { regex: /\\Sigma/g, alt: ' Sigma ' },
        { regex: /\\Tau/g, alt: ' Tau ' },
        { regex: /\\Upsilon/g, alt: ' Upsilon ' },
        { regex: /\\Phi/g, alt: ' Phi ' },
        { regex: /\\Chi/g, alt: ' Chi ' },
        { regex: /\\Psi/g, alt: ' Psi ' },
        { regex: /\\Omega/g, alt: ' Omega ' },

        // Derivative Fractions
        { regex: /\\frac{d\^(\d+|\{\d+\})\s*(.)}{d\s*(.)\^(\d+|\{\d+\})}/g, alt: (match, power, dependent, independent, power2) => {
            return ` ${getWordForm("singularOrdinal", parseInt(power, 10))} derivative of ${dependent} with respect to ${independent} of ` 
        }},
        { regex: /\\frac{d\^(\d+|\{\d+\})}{d\s*(.)\^(\d+|\{\d+\})}/g, alt: (match, power, independent) => {
            return ` ${getWordForm("singularOrdinal", parseInt(power, 10))} derivative with respect to ${independent} of ` 
        }},
        { regex: /\\frac{d\s*(.)}{d\s*(.)}/g, alt: ' derivative of $1 with respect to $2 of ' },
        { regex: /\\frac{d}{d\s*(.)}/g, alt: ' derivative with respect to $1 of ' },

        // Partial Derivative Fractions
        { regex: /\\frac{\\partial\^(\d+|\{\d+\})\s(.)}{\\partial\s(.)\^(\d+|\{\d+\})}/g, alt: (match, power, dependent, independent, power2) => {
            return ` ${getWordForm("singularOrdinal", parseInt(power, 10))} partial derivative of ${dependent} with respect to ${independent} of ` 
        }},
        { regex: /\\frac{\\partial\^(\d+|\{\d+\})}{\\partial\s(.)\^(\d+|\{\d+\})}/g, alt: (match, power, independent) => {
            return ` ${getWordForm("singularOrdinal", parseInt(power, 10))} partial derivative with respect to ${independent} of ` 
        }},
        { regex: /\\frac{\\partial\s(.)}{\\partial\s(.)}/g, alt: ' partial derivative of $1 with respect to $2 of ' },
        { regex: /\\frac{\\partial}{\\partial\s(.)}/g, alt: ' partial derivative with respect to $1 of ' },


        // Fractions
        { regex: /(-\d+|\d+)\\frac{(\d+)}{(\d+)}/g, alt: (match, whole, top, bottom) => {
            return ` ${whole} and ${top} ${getWordForm(top == 1 ? "singularFractional" : "pluralFractional", parseInt(bottom, 10))} ` 
        }},
        { regex: /\\frac{(-\d+|\d+)}{(\d+)}/g, alt: (match, top, bottom) => {
            return ` ${top} ${getWordForm(top == 1 ? "singularFractional" : "pluralFractional", parseInt(bottom, 10))} ` 
        }},
        { regex: /\\frac{([^}]+)}{([^}]+)}/g, alt: ' the fraction $1 over $2 ' },

        // Combinitorics
        { regex: /C\s*\\left\(\s*([A-Za-z\d\s\\\+-\^\_]+)\,\s*([A-Za-z\d\s\\\+-\^\_]+)\s*\\right\)/g, alt: ' $1 choose $2 ' },
        { regex: /P\s*\\left\(\s*([A-Za-z\d\s\\\+-\^\_]+)\,\s*([A-Za-z\d\s\\\+-\^\_]+)\s*\\right\)/g, alt: ' $1 permute $2 ' },

        { regex: /_(.|\{[A-Za-z\d\s\\\+-\^\_]+\})\s*C\s*_(.|\{[A-Za-z\d\s\\\+-\^\_]+\})/g, alt: ' $1 choose $2 ' },
        { regex: /_(.|\{[A-Za-z\d\s\\\+-\^\_]+\})\s*P\s*_(.|\{[A-Za-z\d\s\\\+-\^\_]+\})/g, alt: ' $1 permute $2 ' },

        // Motion Functions
        { regex: /s\s*\\left\(\s*t\s*\\right\)/g, alt: ' the position of t ' },
        { regex: /v\s*\\left\(\s*t\s*\\right\)/g, alt: ' the velocity of t ' },
        { regex: /a\s*\\left\(\s*t\s*\\right\)/g, alt: ' the acceleration of t ' },

        // Functions in the Style of f^{-1}(x) and f(x)
        { regex: /(^|\(|\\times|\\cdot|\\div|\+|-)\s*(\S)\s*\^\{-1\}\s*\\left\s*\(([A-Za-z\d\s\\\+-\^\_]+)\s*\\right\s*\)/g, alt: ' $1 $2 inverse of $3 ' },
        { regex: /(^|\(|\\times|\\cdot|\\div|\+|-)\s*(\S)\s*\\left\s*\(([A-Za-z\d\s\\\+-\^\_]+)\s*\\right\s*\)/g, alt: ' $1 $2 of $3 ' },
        { regex: /(^)\s*(\S)\s*\\left\s*\(([A-Za-z\d\s\\\+-\^\_]+)\s*\\right\s*\)/g, alt: ' $1 of $2 ' },

        // Points
        { regex: /\\left\(\s*([A-Za-z\d\s\\\+-\^\_]+)\,\s*([A-Za-z\d\s\\\+-\^\_]+)\s*\\right\)/g, alt: (match, xcoord, ycoord) => {
            return ` point at x is ${xcoord}, y is ${ycoord} ` 
        }},

        // Absolute Values, Expressions & Quantities
        { regex: /\\left\|([A-Za-z\d\s\\\+-\^\_]+)\\right\|/g, alt: 'the absolute value of $1 ' },
        { regex: /\\left\(([A-Za-z\d\s\\\+-\^\_]+)\\right\)/g, alt: 'the quantity $1 ' },
        { regex: /\\left\[([A-Za-z\d\s\\\+-\^\_]+)\\right\]/g, alt: 'the expression $1 ' },

        // Roots
        { regex: /\\sqrt\[3\]\{([^}]+)\}/g, alt: 'cube root of $1 ' },
        { regex: /\\sqrt\[2\]\{([^}]+)\}/g, alt: 'square root of $1 ' },
        { regex: /\\sqrt\[(-\d+|\d+)\]\{([^}]+)\}/g, alt: (match, root, number) => {
            return ` ${getWordForm("singularOrdinal", parseInt(root, 10))} root of ${number} ` 
        }},
        { regex: /\\sqrt\[([^}]+)\]\{([^}]+)\}/g, alt: (match, root, number) => {
            return ` ${root} root of ${number} ` 
        }},
        { regex: /\\sqrt\{([^}]+)\}/g, alt: 'square root of $1 ' },

        // Logarithmic functions
        { 
            regex: /(\\ln|\\log)(_\{[^}]+\}|_\d|)/g, alt: (match, func, base) => {
                if (func == "\\ln") {
                    return " natural log of ";
                } else if (func == "\\log" && base != "") {
                    return ` log base ${base.replace("_","")} of `;
                } else if (func == "\\log") {
                    return " log base 10 of ";
                }
            }
        },

        // Inverse Trig Functions
        { 
            regex: /(\\sin|\\cos|\\tan|\\csc|\\sec|\\cot|\\arcsin|\\arccos|\\arctan)\^(-1|\{-1\})/g, alt: (match, func) => {
                if (func == "\\sin") {
                    return " inverse sine of ";
                } else if (func == "\\cos") {
                    return " inverse cosine of ";
                } else if (func == "\\tan") {
                    return " inverse tangent of ";
                } else if (func == "\\csc") {
                    return " inverse cosecant of ";
                } else if (func == "\\sec") {
                    return " inverse secant of ";
                } else if (func == "\\cot") {
                    return " inverse cotangent of ";
                } else if (func == "\\arcsin") {
                    return " inverse arcsine of ";
                } else if (func == "\\arccos") {
                    return " inverse arccosine of ";
                } else if (func == "\\arctan") {
                    return " inverse arctangent of ";
                }
            }
        },
        // Squared Trig Functions
        { 
            regex: /(\\sin|\\cos|\\tan|\\csc|\\sec|\\cot|\\arcsin|\\arccos|\\arctan)\^(2|\{2\})/g, alt: (match, func) => {
                if (func == "\\sin") {
                    return " sine squared of ";
                } else if (func == "\\cos") {
                    return " cosine squared of ";
                } else if (func == "\\tan") {
                    return " tangent squared of ";
                } else if (func == "\\csc") {
                    return " cosecant squared of ";
                } else if (func == "\\sec") {
                    return " secant squared of ";
                } else if (func == "\\cot") {
                    return " cotangent squared of ";
                } else if (func == "\\arcsin") {
                    return " arcsine squared of ";
                } else if (func == "\\arccos") {
                    return " arccosine squared of ";
                } else if (func == "\\arctan") {
                    return " arctangent squared of ";
                }
            }
        },
        // Cubed Trig Functions
        { 
            regex: /(\\sin|\\cos|\\tan|\\csc|\\sec|\\cot|\\arcsin|\\arccos|\\arctan)\^(3|\{3\})/g, alt: (match, func) => {
                if (func == "\\sin") {
                    return " sine cubed of ";
                } else if (func == "\\cos") {
                    return " cosine cubed of ";
                } else if (func == "\\tan") {
                    return " tangent cubed of ";
                } else if (func == "\\csc") {
                    return " cosecant cubed of ";
                } else if (func == "\\sec") {
                    return " secant cubed of ";
                } else if (func == "\\cot") {
                    return " cotangent cubed of ";
                } else if (func == "\\arcsin") {
                    return " arcsine cubed of ";
                } else if (func == "\\arccos") {
                    return " arccosine cubed of ";
                } else if (func == "\\arctan") {
                    return " arctangent cubed of ";
                }
            }
        },
        // Other Powers of Trig Functions
        { 
            regex: /(\\sin|\\cos|\\tan|\\csc|\\sec|\\cot|\\arcsin|\\arccos|\\arctan)\^(\d|\{\d+\})/g, alt: (match, func, power) => {
                if (func == "\\sin") {
                    return ` sine to the ${getWordForm("singularOrdinal", parseInt(power.replace("{","").replace("}",""), 10))} power of `;
                } else if (func == "\\cos") {
                    return ` cosine to the ${getWordForm("singularOrdinal", parseInt(power.replace("{","").replace("}",""), 10))} power of `;
                } else if (func == "\\tan") {
                    return ` tangent to the ${getWordForm("singularOrdinal", parseInt(power.replace("{","").replace("}",""), 10))} power of `;
                } else if (func == "\\csc") {
                    return ` cosecant to the ${getWordForm("singularOrdinal", parseInt(power.replace("{","").replace("}",""), 10))} power of `;
                } else if (func == "\\sec") {
                    return ` secant to the ${getWordForm("singularOrdinal", parseInt(power.replace("{","").replace("}",""), 10))} power of `;
                } else if (func == "\\cot") {
                    return ` cotangent to the ${getWordForm("singularOrdinal", parseInt(power.replace("{","").replace("}",""), 10))} power of `;
                } else if (func == "\\arcsin") {
                    return ` arcsine to the ${getWordForm("singularOrdinal", parseInt(power.replace("{","").replace("}",""), 10))} power of `;
                } else if (func == "\\arccos") {
                    return ` arccosine to the ${getWordForm("singularOrdinal", parseInt(power.replace("{","").replace("}",""), 10))} power of `;
                } else if (func == "\\arctan") {
                    return ` arctangent to the ${getWordForm("singularOrdinal", parseInt(power.replace("{","").replace("}",""), 10))} power of `;
                }
            }
        },
        // Regular Trig Functions
        { 
            regex: /(\\sin|\\cos|\\tan|\\csc|\\sec|\\cot|\\arcsin|\\arccos|\\arctan)/g, alt: (match, func) => {
                if (func == "\\sin") {
                    return " sine of ";
                } else if (func == "\\cos") {
                    return " cosine of ";
                } else if (func == "\\tan") {
                    return " tangent of ";
                } else if (func == "\\csc") {
                    return " cosecant of ";
                } else if (func == "\\sec") {
                    return " secant of ";
                } else if (func == "\\cot") {
                    return " cotangent of ";
                } else if (func == "\\arcsin") {
                    return " arcsine of ";
                } else if (func == "\\arccos") {
                    return " arccosine of ";
                } else if (func == "\\arctan") {
                    return " arctangent of ";
                }
            }
        },

        // Integrals
        { regex: /\\int\_([a-zA-Z\d]|\{[a-zA-Z\d]+\})\^([a-zA-Z\d]|\{[a-zA-Z\d]+\})/g, alt: ` the integral from $1 to $2 of ` },
        { regex: /\\int/g, alt: ' the integral of ' },

        // Summations
        { regex: /\\sum\_([^}]+|\{[^}]+\})\^([^}]+)/g, alt: ` the sum from $1 to $2 of ` },
        { regex: /\\sum/g, alt: ' the sum of ' },

        // Limits
        { regex: /\\lim\_\{(\d+|\\[a-zA-Z]+|[a-zA-Z]+)\s\\to\s(\d+|\\[a-zA-Z]+|[a-zA-Z]+)\^-\}/g, alt: ` limit as $1 approaches $2 from the negative direction of ` },
        { regex: /\\lim\_\{(\d+|\\[a-zA-Z]+|[a-zA-Z]+)\s\\to\s(\d+|\\[a-zA-Z]+|[a-zA-Z]+)\^\+\}/g, alt: ` limit as $1 approaches $2 from the positive direction of ` },
        { regex: /\\lim\_\{(\d+|\\[a-zA-Z]+|[a-zA-Z]+)\s\\to\s(\d+|\\[a-zA-Z]+|[a-zA-Z]+)\}/g, alt: ` limit as $1 approaches $2 of ` },
        { regex: /\\lim/g, alt: ' limit of ' },

        // Symbols
        { regex: /\\infty/g, alt: ' infinity ' },
        { regex: /\\%/g, alt: ' percent ' },
        { regex: /(\d+|\\[a-zA-Z]+|[a-zA-Z]+|\d+\s|\\[a-zA-Z]+\s|[a-zA-Z]+\s*)!/g, alt: ' $1 factorial ' },
        { regex: /_/g, alt: ' subscript ' },
        { regex: /(\\times|\\cdot)\s*\\dots\s*(\\times|\\cdot)/g, alt: ' and so on times ' },
        { regex: /\\div\\s*\\dots\s*\\div/g, alt: ' and so on divided by ' },
        { regex: /\+\\s*\\dots\s*\+/g, alt: ' and so on plus ' },
        { regex: /-\\s*\\dots\s*-/g, alt: ' and so on minus ' },

        //Powers
        { regex: /\^(3|\{3\})/g, alt: ' cubed ' },
        { regex: /\^(2|\{2\})/g, alt: ' squared ' },
        { regex: /\^(\d+)/g, alt: (match, power) => {
            return ` to the ${getWordForm("singularOrdinal", parseInt(power.replace("{","").replace("}",""), 10))} power ` 
        }},
        { regex: /\^({([^}]+)}|([^}]+))/g, alt: (match, power) => {
            return ` to the ${power} power ` 
        }},

        // Operators
        { regex: /\\times|\\cdot/g, alt: ' times ' },
        { regex: /\\div/g, alt: ' divided by ' },
        { regex: /\\pm/g, alt: ' plus or minus ' },
        { regex: /(\d+|\\[a-zA-Z]+|[a-zA-Z]+|\}|\]|\)|\\right\|)\s*\+/g, alt: ' $1 plus ' },
        { regex: /(\d+|\\[a-zA-Z]+|[a-zA-Z]+|\}|\]|\)|\\right\|)\s*-/g, alt: ' $1 minus ' },
        { regex: /\+/g, alt: ' positive ' },
        { regex: /-/g, alt: ' negative ' },

        // Relations
        { regex: /=/g, alt: ' equals ' },
        { regex: /\\neq/g, alt: ' does not equal ' },
        { regex: /</g, alt: ' is less than ' },
        { regex: />/g, alt: ' is greater than ' },
        { regex: /\\leq/g, alt: ' is less than or equal to ' },
        { regex: /\\geq/g, alt: ' is greater than or equal to ' },

        // Formatting
        { regex: /\\\\/g, alt: '. ' },
        { regex: / {2}/g, alt: ' ' },
        { regex: / \./g, alt: '.' },
        { regex: / \,/g, alt: ',' },
        { regex: /\?/g, alt: ' blank' },
        { regex: / {2}/g, alt: ' ' }
    ];

    replacements.forEach(({ regex, alt }) => {
        latex = latex.replace(regex, alt);
    });

    latex = latex.replace(/\{|\}/g, ''); // Remove any remaining braces

    return latex.trim();
}
