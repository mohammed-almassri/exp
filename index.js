class Token {
  constructor(lexeme, type) {
    this.lexeme = lexeme;
    this.type = type;
  }
}

const lex = string => {
  string = string + "\0";
  let state = 0;
  let lexeme = "";
  const tokens = [];
  for (let i = 0; i < string.length; i++) {
    const c = string[i];
    const reset = () => {
      lexeme = "";
      i--;
      state = 0;
    };
    switch (state) {
      case 0:
        if (isLetter(c)) {
          lexeme += c;
          state = 1;
        } else if (isDigit(c)) {
          lexeme += c;
          state = 2;
        } else if (isOperator(c)) {
          lexeme += c;
          state = 5;
        } else if (isWhiteSpace(c)) {
          continue;
        }
        continue;
      case 1:
        if (isLetter(c) || isDigit(c)) {
          lexeme += c;
          continue;
        } else {
          tokens.push(new Token(lexeme, "identifier"));
          reset();
        }
        break;
      case 2:
        if (isDigit(c)) {
          lexeme += c;
          continue;
        } else if (c == ".") {
          lexeme += c;
          state = 3;
          continue;
        } else {
          tokens.push(new Token(lexeme, "integer"));
          reset();
        }
        break;
      case 3:
        if (isDigit(c)) {
          lexeme += c;
          state = 4;
          continue;
        } else {
        }
        break;
      case 4:
        if (isDigit(c)) {
          lexeme += c;
          continue;
        } else {
          tokens.push(new Token(lexeme, "double"));
          reset();
        }
        break;
      case 5:
        tokens.push(new Token(lexeme, "operator"));
        reset();
        break;
    }
  }
  return tokens;
};
const isDigit = a => {
  return charIn(a, "0123456789");
};

const isWhiteSpace = a => {
  return charIn(a, " \t\n");
};

const isLetter = a => {
  return charIn(a.toLowerCase(), "qwertyuioplkjhgfdsazxcvbnm");
};

const isOperator = a => {
  return charIn(a, "+-/*^%=");
};

const charIn = (i, s) => {
  return s.indexOf(i) !== -1;
};

class ASTNode {
  constructor(val) {
    this.val = val;
  }
  eval() {
    if (this.left) {
      return operators[this.val].calc(this.left.eval(), this.right.eval());
    } else {
      return this.val;
    }
  }
}

const operators = {
  "+": {
    lexeme: "+",
    precedence: 10,
    calc: (a, b) => a + b,
    assoc: "left"
  },
  "-": {
    lexeme: "-",
    precedence: 10,
    calc: (a, b) => a - b,
    assoc: "left"
  },
  "/": {
    lexeme: "/",
    precedence: 20,
    calc: (a, b) => a / b,
    assoc: "left"
  },
  "*": {
    lexeme: "*",
    precedence: 20,
    calc: (a, b) => a * b,
    assoc: "left"
  },
  "%": {
    lexeme: "%",
    precedence: 20,
    calc: (a, b) => a % b,
    assoc: "left"
  },
  "^": {
    lexeme: "^",
    precedence: 30,
    calc: (a, b) => Math.pow(a, b),
    assoc: "right"
  }
};

function parse(tokens) {
  if (tokens.length == 1) {
    if (tokens[0].type == "integer") {
      return Number.parseInt(tokens[0].lexeme);
    }
    if (tokens[0].type == "double") {
      return Number.parseFloat(tokens[0].lexeme);
    }
  } else {
    let op = [];
    let minPrec = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < tokens.length; i++) {
      token = tokens[i];
      if (token.type == "operator") {
        const lexeme = token.lexeme;
        const precedence = operators[lexeme].precedence;
        if (minPrec > precedence) {
          minPrec = precedence;
        }
        op.push([precedence, i, lexeme]);
      }
    }
    op = op
      .filter(a => a[0] == minPrec)
      .sort((a, b) => {
        if (operators[a[2]].assoc == "right") {
          return a[1] > b[1];
        }
        return a[1] <= b[1];
      });
    const index = op[0][1];
    const left = parse(tokens.slice(0, index));
    const right = parse(tokens.slice(index + 1, tokens.length));
    return operators[op[0][2]].calc(left, right);
  }
}