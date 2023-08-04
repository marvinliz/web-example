import { useState } from 'react'
import type { Token } from './parser'
import Parser, { TokenType } from './parser'

enum BackgroundGroup {
  NUMBER = 'number',
  OPERATOR = 'operator',
}

function InputButton(props: { token?: Token; displayValue?: string; backgroundGroup: BackgroundGroup; onClick: () => void }) {
  let backGroundClassName
  switch (props.backgroundGroup) {
    case BackgroundGroup.NUMBER:
      backGroundClassName = 'bg-gray-600 hover:bg-gray-700'
      break
    case BackgroundGroup.OPERATOR:
      backGroundClassName = 'bg-gray-700 hover:bg-gray-600'
      break
  }

  return (
    <button
      className={`text-2xl text-white ${backGroundClassName} rounded-md`}
      onClick={() => props.onClick()}
    >
      {props.token?.value ?? props.displayValue}
    </button>
  )
}

function Calculator() {
  const LEFT_PARENTHESES = { type: TokenType.LEFT_PARENTHESES, value: '(' }
  const RIGHT_PARENTHESES = { type: TokenType.RIGHT_PARENTHESES, value: ')' }
  const PLUS = { type: TokenType.PLUS, value: '+' }
  const MINUS = { type: TokenType.MINUS, value: '-' }
  const MULTIPLY = { type: TokenType.MULTIPLY, value: '*' }
  const DIVIDE = { type: TokenType.DIVIDE, value: '/' }
  const PERCENT = { type: TokenType.REMINDER, value: '%' }
  const POWER = { type: TokenType.POWER, value: '^' }
  const NUMBER_0 = { type: TokenType.NUMBER, value: '1' }
  const NUMBER_1 = { type: TokenType.NUMBER, value: '1' }
  const NUMBER_2 = { type: TokenType.NUMBER, value: '2' }
  const NUMBER_3 = { type: TokenType.NUMBER, value: '3' }
  const NUMBER_4 = { type: TokenType.NUMBER, value: '4' }
  const NUMBER_5 = { type: TokenType.NUMBER, value: '5' }
  const NUMBER_6 = { type: TokenType.NUMBER, value: '6' }
  const NUMBER_7 = { type: TokenType.NUMBER, value: '7' }
  const NUMBER_8 = { type: TokenType.NUMBER, value: '8' }
  const NUMBER_9 = { type: TokenType.NUMBER, value: '9' }
  const DOT = { type: TokenType.NUMBER, value: '.' }

  const [tokens, setTokens] = useState<Token[]>([])
  const [result, setResult] = useState<string>()

  const lastToken = () => tokens[tokens.length - 1]
  const firstToken = () => tokens[0]
  const clearTokens = () => {
    setTokens([])
    setResult('')
  }
  const removeLastToken = () => {
    setTokens(tokens.slice(0, -1))
  }
  const removeFirstToken = () => {
    setTokens(tokens.slice(1))
  }
  const addFirstToken = (token: Token) => {
    setTokens([token, ...tokens])
  }
  const addLastToken = (token: Token) => {
    setTokens([...tokens, token])
  }
  const addNumber = (token: Token) => {
    if (tokens.length === 0 || lastToken().type !== TokenType.NUMBER)
      addLastToken(token)
    else
      tokens[tokens.length - 1] = { ...lastToken(), value: lastToken().value + token.value }
  }
  const changeNegitive = () => {
    if (tokens.length === 0)
      addLastToken(MINUS)
    else
      firstToken().type === TokenType.MINUS ? removeFirstToken() : addFirstToken(MINUS)
  }
  const calculate = () => {
    setResult(new Parser(tokens).parse().evaluate().toString())
    setTokens([])
  }

  return (
    <div className="grid grid-cols-[repeat(4,5rem)] grid-rows-[minmax(8rem,auto)_repeat(6,4rem)] justify-center mt-8 gap-px">

      <div className="col-span-4 bg-black/[.75] flex flex-col items-end justify-around p-3 break-words rounded-md">
        <div className="text-2xl text-white">{tokens.map(v => v.value).join('')}</div>
        <div className="text-4xl text-white">{result}</div>
      </div>

      <InputButton token={LEFT_PARENTHESES} backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => addLastToken(LEFT_PARENTHESES)}/>
      <InputButton token={RIGHT_PARENTHESES} backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => addLastToken(RIGHT_PARENTHESES)}/>
      <InputButton displayValue="C" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => clearTokens()}/>
      <InputButton displayValue="DEL" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => removeLastToken()}/>

      <InputButton token={PERCENT} backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => addLastToken(PERCENT)}/>
      <InputButton token={POWER} backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => addLastToken(POWER)}/>
      <InputButton displayValue="C" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => clearTokens()}/>
      <InputButton token={DIVIDE} backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => addLastToken(DIVIDE)}/>

      <InputButton token={NUMBER_7} backgroundGroup={BackgroundGroup.NUMBER} onClick={() => addNumber(NUMBER_7)}/>
      <InputButton token={NUMBER_8} backgroundGroup={BackgroundGroup.NUMBER} onClick={() => addNumber(NUMBER_8)}/>
      <InputButton token={NUMBER_9} backgroundGroup={BackgroundGroup.NUMBER} onClick={() => addNumber(NUMBER_9)}/>
      <InputButton token={MULTIPLY} backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => addLastToken(MULTIPLY)}/>

      <InputButton token={NUMBER_4} backgroundGroup={BackgroundGroup.NUMBER} onClick={() => addNumber(NUMBER_4)}/>
      <InputButton token={NUMBER_5} backgroundGroup={BackgroundGroup.NUMBER} onClick={() => addNumber(NUMBER_5)}/>
      <InputButton token={NUMBER_6} backgroundGroup={BackgroundGroup.NUMBER} onClick={() => addNumber(NUMBER_6)}/>
      <InputButton token={MINUS} backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => addLastToken(MINUS)}/>

      <InputButton token={NUMBER_1} backgroundGroup={BackgroundGroup.NUMBER} onClick={() => addNumber(NUMBER_1)}/>
      <InputButton token={NUMBER_2} backgroundGroup={BackgroundGroup.NUMBER} onClick={() => addNumber(NUMBER_2)}/>
      <InputButton token={NUMBER_3} backgroundGroup={BackgroundGroup.NUMBER} onClick={() => addNumber(NUMBER_3)}/>
      <InputButton token={PLUS} backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => addLastToken(PLUS)}/>

      <InputButton displayValue="+/-" backgroundGroup={BackgroundGroup.NUMBER} onClick={() => changeNegitive()}/>
      <InputButton token={NUMBER_0} backgroundGroup={BackgroundGroup.NUMBER} onClick={() => addNumber(NUMBER_0)}/>
      <InputButton token={DOT} backgroundGroup={BackgroundGroup.NUMBER} onClick={() => addNumber(DOT)}/>
      <InputButton displayValue="=" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => calculate()}/>
    </div>
  )
}

export default Calculator
