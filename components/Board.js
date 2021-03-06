import * as R from 'rambda'
import React from 'react'
import * as Cell from './Cell'
import * as L from './lib/index.js'

// LOGIC ===========================================================================================
// let cell1 = ...
// let board = [cell1, cell2, cell3, cell4, cell5, cell6]

export let getStatusAt = R.curry((i, board) => {
  return R.view(R.lensPath(`${i}.status`), board)
})

export let setStatusAt = R.curry((i, status, board) => {
  return R.set(R.lensPath(`${i}.status`), status, board)
})

export let setStatusesBy = R.curry((predFn, status, board) => {
  return R.map(cell => predFn(cell) ? {...cell, status} : cell, board)
})

export let getStatusesBy = R.curry((predFn, board) => {
  return R.chain(cell => predFn(cell) ? [cell.status] : [], board)
})

export let getSymbolsBy = R.curry((predFn, board) => {
  return R.chain(cell => predFn(cell) ? [cell.symbol] : [], board)
})

export let canOpenAt = R.curry((i, board) => {
  return i < board.length
    && Cell.isClosed(board[i])
    && getStatusesBy(Cell.isBlocking, board).length < 2
})

export let areOpensEqual = (board) => {
  let openSymbols = getSymbolsBy(Cell.isOpen, board)
  return openSymbols.length == 2 && L.allEquals(openSymbols)
}

export let areOpensDifferent = (board) => {
  let openSymbols = getSymbolsBy(Cell.isOpen, board)
  return openSymbols.length >= 2 && !L.allEquals(openSymbols)
}

let charCodeA = 'A'.charCodeAt(0)

export let makeRandom = (m, n) => {
  if ((m * n / 2) > 26) throw new Error('too big')
  if (m * n % 2) throw new Error('must be even')

  return R.pipe(
    () => R.range(0, m * n / 2),
    R.map(i => String.fromCharCode(i + charCodeA)),
    R.chain(x => [x, x]),
    L.shuffle,
    R.map(symbol => ({symbol, status: Cell.Status.Closed})),
  )()
}

// VIEW ============================================================================================
export function BoardView({board, onClickAt}) {
  return <>
    <div className="board">
      {board.map((cell, i) =>
        <Cell.View key={i} cell={cell} onClick={_ => onClickAt(i)}/>
      )}
    </div>
    <style jsx>{`
      .board {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        width: 640px;
        height: 480px;
        gap: 2px;
      }
    `}</style>
  </>
}

export function ScreenView({background, test, children}) {
  return <>
    <div className="screen">
      {children}
    </div>
    <style jsx>{`
      .screen {
        display: flex;
        width: 640px;
        height: 480px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: ${background};
      }
      :global(.screen h1) {
        font-size: 3rem;
      }
    `}</style>
  </>
}