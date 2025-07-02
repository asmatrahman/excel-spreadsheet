"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useSpreadsheet } from "./spreadsheet"
import type { CellPosition } from "@/types/spreadsheet"

interface CellProps {
  position: CellPosition
}

export default function Cell({ position }: CellProps) {
  const { state, dispatch } = useSpreadsheet()
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const cellKey = `${position.col}-${position.row}`
  const cellData = state.cells[cellKey]
  const isSelected = state.selectedCell?.col === position.col && state.selectedCell?.row === position.row
  const isEditing = state.editingCell?.col === position.col && state.editingCell?.row === position.row

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    if (isEditing) {
      setInputValue(cellData?.rawValue || "")
    }
  }, [isEditing, cellData?.rawValue])

  const handleClick = () => {
    dispatch({ type: "SELECT_CELL", position })
  }

  const handleDoubleClick = () => {
    dispatch({ type: "START_EDITING", position })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      dispatch({ type: "STOP_EDITING" })
    }
  }

  const handleInputBlur = () => {
    handleSave()
  }

  const handleSave = () => {
    dispatch({ type: "UPDATE_CELL", position, value: inputValue })
  }

  const displayValue = cellData?.displayValue || ""
  const hasError = cellData?.error

  return (
    <td
      className={`
      w-24 h-8 border border-border relative cursor-cell bg-card
      ${isSelected ? "ring-2 ring-ring ring-inset bg-accent" : "hover:bg-accent/50"}
      ${hasError ? "bg-destructive/10" : ""}
    `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      role="gridcell"
      tabIndex={isSelected ? 0 : -1}
      aria-label={`Cell ${String.fromCharCode(65 + position.col)}${position.row + 1}`}
      aria-selected={isSelected}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          className="w-full h-full px-1 text-xs border-none outline-none bg-card text-card-foreground"
          aria-label={`Editing cell ${String.fromCharCode(65 + position.col)}${position.row + 1}`}
        />
      ) : (
        <div
          className={`
          w-full h-full px-1 text-xs flex items-center
          ${hasError ? "text-destructive font-medium" : "text-card-foreground"}
          ${displayValue.startsWith("=") ? "font-mono" : ""}
        `}
          title={hasError ? cellData.error : cellData?.rawValue}
        >
          {displayValue}
        </div>
      )}
    </td>
  )
}
