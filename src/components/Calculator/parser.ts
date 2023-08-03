enum TokenType {
  NUMBER = 'NUMBER',
  LEFT_PARENTHESES = 'LEFT_PARENTHESES',
  RIGHT_PARENTHESES = 'RIGHT_PARENTHESES',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  STAR = 'STAR',
  DIV = 'DIV',
  POW = 'POW',
}

interface Token {
  type: TokenType
  lexeme: string
  value: any | null
}

interface Expression {
  evaluate(): number
  toString(): string
}

class BinaryExpression implements Expression {
  constructor(
    private left: Expression,
    private operator: Token,
    private right: Expression,
  ) {}

  evaluate(): number {
    const left = this.left.evaluate()
    const right = this.right.evaluate()

    switch (this.operator.type) {
      case TokenType.PLUS:
        return left + right
      case TokenType.MINUS:
        return left - right
      case TokenType.STAR:
        return left * right
      case TokenType.DIV:
        return left / right
      case TokenType.POW:
        return left ** right
      default:
        throw new Error(`Unknown binary operator ${this.operator.type}`)
    }
  }

  toString(): string {
    return `(${this.left.toString()} ${this.operator.type} ${this.right.toString()})`
  }
}

class GroupingExpression implements Expression {
  constructor(private expression: Expression) {}

  evaluate(): number {
    return this.expression.evaluate()
  }

  toString(): string {
    return `( ${this.expression.toString()} )`
  }
}

class NegativeExpression implements Expression {
  constructor(private expression: Expression) {}

  evaluate(): number {
    return -this.expression.evaluate()
  }

  toString(): string {
    return `- ( ${this.expression.toString()} )`
  }
}

class NumberExpression implements Expression {
  constructor(private value: number) {}

  evaluate(): number {
    return this.value
  }

  toString(): string {
    return this.value.toString()
  }
}

class Parser {
  constructor(private tokens: Token[]) {}

  private current = 0

  parse(): Expression {
    return this.add()
  }

  add(): Expression {
    return this.parseBinary(() => this.mul(), () => this.mul(), TokenType.PLUS, TokenType.MINUS)
  }

  mul(): Expression {
    return this.parseBinary(() => this.pow(), () => this.pow(), TokenType.STAR, TokenType.DIV)
  }

  pow(): Expression {
    return this.parseBinary(() => this.base(), () => this.pow(), TokenType.POW)
  }

  parseBinary(startExpression: () => Expression, repeatingExpression: () => Expression, ...types: TokenType[]): Expression {
    let expression = startExpression()

    if (this.match(...types)) {
      if (this.isEnd())
        throw new Error('Missing right-hand side(RHS) of binary expression.')

      const operator = this.previous()
      const right = repeatingExpression()

      expression = new BinaryExpression(expression, operator, right)
      return expression
    }

    return expression
  }

  base(): Expression {
    if (this.match(TokenType.MINUS)) {
      const expression = this.parse()
      return new NegativeExpression(expression)
    }
    else if (this.match(TokenType.NUMBER)) {
      return new NumberExpression(this.previous().value as number)
    }
    else if (this.match(TokenType.LEFT_PARENTHESES)) {
      const expression = this.parse()
      if (!this.match(TokenType.RIGHT_PARENTHESES))
        throw new Error(' ) not found.')
      return new GroupingExpression(expression)
    }
    else {
      throw new Error(`Number or parentheses expected, but got ${this.peek().type}`)
    }
  }

  match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance()
        return true
      }
    }

    return false
  }

  check(type: TokenType): boolean {
    if (this.isEnd())
      return false
    return this.peek().type === type
  }

  isEnd(): boolean {
    return this.current >= this.tokens.length
  }

  advance(): Token {
    return this.tokens[this.current++]
  }

  peek(): Token {
    return this.tokens[this.current]
  }

  previous(): Token {
    return this.tokens[this.current - 1]
  }
}

export default Parser
