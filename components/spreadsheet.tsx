"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import Cell from "./cell"
import type { SpreadsheetState, SpreadsheetAction, CellData } from "@/types/spreadsheet"
import { evaluateFormula, detectCircularReference } from "@/utils/formula-parser"

const initialState: SpreadsheetState = {
  cells: {},
  selectedCell: null,
  editingCell: null,
  rows: 18,
  cols: 15,
}

const SpreadsheetContext = createContext<{
  state: SpreadsheetState
  dispatch: React.Dispatch<SpreadsheetAction>
} | null>(null)

function spreadsheetReducer(state: SpreadsheetState, action: SpreadsheetAction): SpreadsheetState {
  switch (action.type) {
    case "SELECT_CELL":
      return {
        ...state,
        selectedCell: action.position,
        editingCell: null,
      }

    case "START_EDITING":
      return {
        ...state,
        editingCell: action.position,
      }

    case "STOP_EDITING":
      return {
        ...state,
        editingCell: null,
      }

    case "UPDATE_CELL":
      const newCells = { ...state.cells }
      const cellKey = `${action.position.col}-${action.position.row}`

      if (action.value === "") {
        delete newCells[cellKey]
      } else {
        newCells[cellKey] = {
          rawValue: action.value,
          displayValue: action.value,
          position: action.position,
        }
      }

      const updatedCells = recalculateFormulas(newCells)

      return {
        ...state,
        cells: updatedCells,
        editingCell: null,
      }

    case "LOAD_STATE":
      return action.state

    default:
      return state
  }
}

function recalculateFormulas(cells: Record<string, CellData>): Record<string, CellData> {
  const updatedCells = { ...cells }
  const formulaCells: string[] = []

  Object.keys(updatedCells).forEach((key) => {
    if (updatedCells[key].rawValue.startsWith("=")) {
      formulaCells.push(key)
    }
  })

  formulaCells.forEach((key) => {
    const cell = updatedCells[key]

    if (detectCircularReference(cell.rawValue, cell.position, updatedCells)) {
      updatedCells[key] = {
        ...cell,
        displayValue: "#CIRC!",
        error: "Circular reference detected",
      }
      return
    }

    try {
      const result = evaluateFormula(cell.rawValue, updatedCells)
      updatedCells[key] = {
        ...cell,
        displayValue: result.toString(),
        error: undefined,
      }
    } catch (error) {
      updatedCells[key] = {
        ...cell,
        displayValue: "#ERROR!",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  })

  return updatedCells
}

export default function Spreadsheet() {
  const [state, dispatch] = useReducer(spreadsheetReducer, initialState)

  useEffect(() => {
    const saved = localStorage.getItem("spreadsheet-data")
    if (saved) {
      try {
        const savedState = JSON.parse(saved)
        dispatch({ type: "LOAD_STATE", state: savedState })
      } catch (error) {
        console.error("Failed to load saved data:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("spreadsheet-data", JSON.stringify(state))
  }, [state])

  const getColumnHeader = (index: number): string => {
    let result = ""
    let num = index
    while (num >= 0) {
      result = String.fromCharCode(65 + (num % 26)) + result
      num = Math.floor(num / 26) - 1
    }
    return result
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!state.selectedCell || state.editingCell) return

      const { col, row } = state.selectedCell
      let newCol = col
      let newRow = row

      switch (e.key) {
        case "ArrowUp":
          newRow = Math.max(0, row - 1)
          e.preventDefault()
          break
        case "ArrowDown":
          newRow = Math.min(state.rows - 1, row + 1)
          e.preventDefault()
          break
        case "ArrowLeft":
          newCol = Math.max(0, col - 1)
          e.preventDefault()
          break
        case "ArrowRight":
          newCol = Math.min(state.cols - 1, col + 1)
          e.preventDefault()
          break
        case "Enter":
          dispatch({ type: "START_EDITING", position: { col, row } })
          e.preventDefault()
          break
        case "Delete":
        case "Backspace":
          dispatch({ type: "UPDATE_CELL", position: { col, row }, value: "" })
          e.preventDefault()
          break
        default:
          if (e.key.length === 1 && /[a-zA-Z0-9=]/.test(e.key)) {
            dispatch({ type: "START_EDITING", position: { col, row } })
          }
          return
      }

      if (newCol !== col || newRow !== row) {
        dispatch({ type: "SELECT_CELL", position: { col: newCol, row: newRow } })
      }
    },
    [state.selectedCell, state.editingCell, state.rows, state.cols],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <SpreadsheetContext.Provider value={{ state, dispatch }}>
      <div className="bg-card rounded-lg shadow-lg overflow-hidden h-full flex flex-col border border-border">
        <div className="overflow-auto flex-1">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="w-12 h-8 bg-muted border border-border text-xs font-medium text-muted-foreground"></th>
                {Array.from({ length: state.cols }, (_, i) => (
                  <th
                    key={i}
                    className="w-24 h-8 bg-muted border border-border text-xs font-medium text-muted-foreground"
                  >
                    {getColumnHeader(i)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: state.rows }, (_, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="w-12 h-8 bg-muted border border-border text-xs font-medium text-muted-foreground text-center">
                    {rowIndex + 1}
                  </td>
                  {Array.from({ length: state.cols }, (_, colIndex) => (
                    <Cell key={`${colIndex}-${rowIndex}`} position={{ col: colIndex, row: rowIndex }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
        <div className="bg-muted px-4 py-2 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {state.selectedCell && (
                <span>
                  Selected: {getColumnHeader(state.selectedCell.col)}
                  {state.selectedCell.row + 1}
                </span>
              )}
            </div>
            <div className="text-xs">
              Use arrow keys to navigate • Double-click or Enter to edit • Formulas start with =
            </div>
          </div>
        </div>
      </div>
    </SpreadsheetContext.Provider>
  )
}

export function useSpreadsheet() {
  const context = useContext(SpreadsheetContext)
  if (!context) {
    throw new Error("useSpreadsheet must be used within SpreadsheetContext")
  }
  return context
}
