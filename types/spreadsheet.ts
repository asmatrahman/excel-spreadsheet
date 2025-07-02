export interface CellPosition {
  col: number
  row: number
}

export interface CellData {
  rawValue: string
  displayValue: string
  position: CellPosition
  error?: string
}

export interface SpreadsheetState {
  cells: Record<string, CellData>
  selectedCell: CellPosition | null
  editingCell: CellPosition | null
  rows: number
  cols: number
}

export type SpreadsheetAction =
  | { type: "SELECT_CELL"; position: CellPosition }
  | { type: "START_EDITING"; position: CellPosition }
  | { type: "STOP_EDITING" }
  | { type: "UPDATE_CELL"; position: CellPosition; value: string }
  | { type: "LOAD_STATE"; state: SpreadsheetState }
