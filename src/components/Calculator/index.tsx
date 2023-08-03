import { useState } from 'react'

enum BackgroundGroup {
  NUMBER = 'number',
  OPERATOR = 'operator',
}

function InputButton(props: { input: string; showValue?: string; backgroundGroup: BackgroundGroup; onClick: () => void }) {
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
      {props.showValue || props.input}
    </button>
  )
}

function Calculator() {
  const [input, setInput] = useState<string>('')
  const [result, setResult] = useState<string>('')

  return (
    <div className="grid grid-cols-[repeat(4,5rem)] grid-rows-[minmax(8rem,auto)_repeat(6,4rem)] justify-center mt-8 gap-px">

      <div className="col-span-4 bg-black/[.75] flex flex-col items-end justify-around p-3 break-words rounded-md">
        <div className="text-2xl text-white">{input}</div>
        <div className="text-4xl text-white">{result}</div>
      </div>

      <InputButton input="(" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => setInput(`${input}(`)}/>
      <InputButton input=")" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => setInput(`${input})`)}/>
      <InputButton input="C" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => setInput('')}/>
      <InputButton input="DEL" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => setInput(`${input}(`)}/>

      <InputButton input="%" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => setInput(`${input}%`)}/>
      <InputButton input="^" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => setInput(`${input}^`)}/>
      <InputButton input="C" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => setInput('')}/>
      <InputButton input="÷" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => setInput(`${input}/`)}/>

      <InputButton input="7" backgroundGroup={BackgroundGroup.NUMBER} onClick={() => setInput(`${input}7`)}/>
      <InputButton input="8" backgroundGroup={BackgroundGroup.NUMBER} onClick={() => setInput(`${input}8`)}/>
      <InputButton input="9" backgroundGroup={BackgroundGroup.NUMBER} onClick={() => setInput(`${input}9`)}/>
      <InputButton input="×" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => setInput(`${input}*`)}/>

      <InputButton input="4" backgroundGroup={BackgroundGroup.NUMBER} onClick={() => setInput(`${input}4`)}/>
      <InputButton input="5" backgroundGroup={BackgroundGroup.NUMBER} onClick={() => setInput(`${input}5`)}/>
      <InputButton input="6" backgroundGroup={BackgroundGroup.NUMBER} onClick={() => setInput(`${input}6`)}/>
      <InputButton input="-" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => setInput(`${input}-`)}/>

      <InputButton input="1" backgroundGroup={BackgroundGroup.NUMBER} onClick={() => setInput(`${input}(`)}/>
      <InputButton input="2" backgroundGroup={BackgroundGroup.NUMBER} onClick={() => setInput(`${input}(`)}/>
      <InputButton input="3" backgroundGroup={BackgroundGroup.NUMBER} onClick={() => setInput(`${input}(`)}/>
      <InputButton input="+" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => setInput(`${input}(`)}/>

      <InputButton input="+/-" backgroundGroup={BackgroundGroup.NUMBER} onClick={() => setInput(`${input}(`)}/>
      <InputButton input="0" backgroundGroup={BackgroundGroup.NUMBER} onClick={() => setInput(`${input}(`)}/>
      <InputButton input="." backgroundGroup={BackgroundGroup.NUMBER} onClick={() => setInput(`${input}(`)}/>
      <InputButton input="=" backgroundGroup={BackgroundGroup.OPERATOR} onClick={() => setInput(`${input}(`)}/>
    </div>
  )
}

export default Calculator
