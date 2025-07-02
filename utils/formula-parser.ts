import type { CellData, CellPosition } from "@/types/spreadsheet"

export function evaluateFormula(formula: string, cells: Record<string, CellData>): number {
  if (!formula.startsWith("=")) {
    throw new Error("Formula must start with =")
  }

  const expression = formula.slice(1)

  const processedExpression = replaceCellReferences(expression, cells)

  return evaluateExpression(processedExpression)
}

function replaceCellReferences(expression: string, cells: Record<string, CellData>): string {
  const cellRefRegex = /([A-Z]+)(\d+)/g

  return expression.replace(cellRefRegex, (match, colStr, rowStr) => {
    const col = columnStringToNumber(colStr)
    const row = Number.parseInt(rowStr) - 1
    const cellKey = `${col}-${row}`
    const cellData = cells[cellKey]

    if (!cellData) {
      return "0"
    }

    if (cellData.rawValue.startsWith("=")) {
      const numericValue = Number.parseFloat(cellData.displayValue)
      return isNaN(numericValue) ? "0" : numericValue.toString()
    }

    const numericValue = Number.parseFloat(cellData.rawValue)
    return isNaN(numericValue) ? "0" : numericValue.toString()
  })
}

function columnStringToNumber(colStr: string): number {
  let result = 0
  for (let i = 0; i < colStr.length; i++) {
    result = result * 26 + (colStr.charCodeAt(i) - 64)
  }
  return result - 1
}

function evaluateExpression(expression: string): number {
  expression = expression.replace(/\s/g, "")

  while (expression.includes("(")) {
    const innerMatch = expression.match(/$$[^()]+$$/)
    if (!innerMatch) break

    const innerExpression = innerMatch[0].slice(1, -1)
    const innerResult = evaluateExpression(innerExpression)
    expression = expression.replace(innerMatch[0], innerResult.toString())
  }

  expression = handleOperations(expression, ["*", "/"])

  expression = handleOperations(expression, ["+", "-"])

  const result = Number.parseFloat(expression)
  if (isNaN(result)) {
    throw new Error("Invalid expression")
  }

  return result
}

function handleOperations(expression: string, operators: string[]): string {
  for (const op of operators) {
    const regex = new RegExp(`(-?\\d+(?:\\.\\d+)?)\\${op}(-?\\d+(?:\\.\\d+)?)`)

    while (regex.test(expression)) {
      expression = expression.replace(regex, (match, left, right) => {
        const leftNum = Number.parseFloat(left)
        const rightNum = Number.parseFloat(right)

        let result: number
        switch (op) {
          case "+":
            result = leftNum + rightNum
            break
          case "-":
            result = leftNum - rightNum
            break
          case "*":
            result = leftNum * rightNum
            break
          case "/":
            if (rightNum === 0) throw new Error("Division by zero")
            result = leftNum / rightNum
            break
          default:
            throw new Error(`Unknown operator: ${op}`)
        }

        return result.toString()
      })
    }
  }

  return expression
}

export function detectCircularReference(
  formula: string,
  currentPosition: CellPosition,
  cells: Record<string, CellData>,
  visited: Set<string> = new Set(),
): boolean {
  const currentKey = `${currentPosition.col}-${currentPosition.row}`

  if (visited.has(currentKey)) {
    return true 
  }

  visited.add(currentKey)

  const cellRefRegex = /([A-Z]+)(\d+)/g
  let match

  while ((match = cellRefRegex.exec(formula)) !== null) {
    const col = columnStringToNumber(match[1])
    const row = Number.parseInt(match[2]) - 1
    const referencedKey = `${col}-${row}`
    const referencedCell = cells[referencedKey]

    if (referencedCell && referencedCell.rawValue.startsWith("=")) {
      if (detectCircularReference(referencedCell.rawValue, { col, row }, cells, new Set(visited))) {
        return true
      }
    }
  }

  return false
}
