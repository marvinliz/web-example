export enum TokenType {
  NUMBER = 'NUMBER',
  LEFT_PARENTHESES = 'LEFT_PARENTHESES',
  RIGHT_PARENTHESES = 'RIGHT_PARENTHESES',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  REMINDER = 'REMINDER',
  POWER = 'POWER',
}

export interface Token {
  type: TokenType
  value: string
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
      case TokenType.MULTIPLY:
        return left * right
      case TokenType.DIVIDE:
        return left / right
      case TokenType.POWER:
        return left ** right
      case TokenType.REMINDER:
        return left % right
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

  private add(): Expression {
    return this.parseBinary(() => this.mul(), () => this.mul(), TokenType.PLUS, TokenType.MINUS)
  }

  private mul(): Expression {
    return this.parseBinary(() => this.pow(), () => this.pow(), TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.REMINDER)
  }

  private pow(): Expression {
    return this.parseBinary(() => this.leaf(), () => this.leaf(), TokenType.POWER)
  }

  private parseBinary(startExpression: () => Expression, repeatingExpression: () => Expression, ...types: TokenType[]): Expression {
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

  private leaf(): Expression {
    if (this.match(TokenType.MINUS)) {
      const expression = this.parse()
      return new NegativeExpression(expression)
    }
    else if (this.match(TokenType.NUMBER)) {
      return new NumberExpression(Number.parseFloat(this.previous().value))
    }
    else if (this.match(TokenType.LEFT_PARENTHESES)) {
      const expression = this.parse()
      if (!this.match(TokenType.RIGHT_PARENTHESES))
        throw new Error(' ) not found.')
      return new GroupingExpression(expression)
    }
    else {
      throw new Error(`Leaf expression expected, but got ${this.peek().type}`)
    }
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance()
        return true
      }
    }

    return false
  }

  private check(type: TokenType): boolean {
    if (this.isEnd())
      return false
    return this.peek().type === type
  }

  private isEnd(): boolean {
    return this.current >= this.tokens.length
  }

  private advance(): Token {
    return this.tokens[this.current++]
  }

  private peek(): Token {
    return this.tokens[this.current]
  }

  private previous(): Token {
    return this.tokens[this.current - 1]
  }
}

export default Parser
