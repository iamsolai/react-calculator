import React, { useReducer } from 'react'
import DigitButton from './DigitButton'
import './styles.css'
import OperationButton from './OperationButton'

export const ACTION = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate',
  ALL_CLEAR: 'all-clear',
  DELETE_DIGIT: 'delete-digit',
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.ADD_DIGIT:
      if (state.overwrite === true) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === '0' && state.currentOperand === '0') return state
      if (payload.digit === '.' && state.currentOperand.includes('.'))
        return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      }

    case ACTION.ALL_CLEAR:
      return {}

    case ACTION.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          currentOperand: null,
          previousOperand: state.currentOperand,
          operation: payload.operation,
        }
      }
      return {
        ...state,
        operation: payload.operation,
        previousOperand: evaluate(state),
        currentOperand: null,
      }

    case ACTION.EVALUATE: {
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }
      return {
        ...state,
        overwrite: true,
        operation: null,
        previousOperand: null,
        currentOperand: evaluate(state),
      }
    }
    case ACTION.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})

function formatter(operand) {
  if (operand == null) return

  const [digit, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(digit)
  return `${INTEGER_FORMATTER.format(digit)}.${decimal}`
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const previous = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)

  if (isNaN(previous) || isNaN(current)) return ''

  let computationResult = ''
  switch (operation) {
    case '+':
      computationResult = previous + current
      break
    case '-':
      computationResult = previous - current
      break
    case 'x':
      computationResult = previous * current
      break
    case '÷':
      computationResult = previous / current
      break
  }
  return computationResult.toString()
}

export default function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {},
  )
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatter(previousOperand)} {operation}
        </div>
        <div id="display" className="current-operand">
          {formatter(currentOperand)}
        </div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION.ALL_CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTION.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton dispatch={dispatch} operation="÷" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton dispatch={dispatch} operation="x" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION.EVALUATE })}
      >
        =
      </button>
    </div>
  )
}
