"use client"

import { Calculator, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface FormulaExample {
  formula: string
  description: string
  example: string
  category: string
}

const formulaExamples: FormulaExample[] = [
  {
    formula: "=A1+B1",
    description: "Add two cells",
    example: "=A1+B1 → Adds values in cells A1 and B1",
    category: "Basic Math",
  },
  {
    formula: "=A1-B1",
    description: "Subtract two cells",
    example: "=A1-B1 → Subtracts B1 from A1",
    category: "Basic Math",
  },
  {
    formula: "=A1*B1",
    description: "Multiply two cells",
    example: "=A1*B1 → Multiplies A1 by B1",
    category: "Basic Math",
  },
  {
    formula: "=A1/B1",
    description: "Divide two cells",
    example: "=A1/B1 → Divides A1 by B1",
    category: "Basic Math",
  },
  {
    formula: "=A1+B1*C1",
    description: "Mixed operations (follows order of operations)",
    example: "=A1+B1*C1 → First multiplies B1*C1, then adds A1",
    category: "Advanced Math",
  },
  {
    formula: "=(A1+B1)*C1",
    description: "Use parentheses to control order",
    example: "=(A1+B1)*C1 → First adds A1+B1, then multiplies by C1",
    category: "Advanced Math",
  },
  {
    formula: "=A1+B2+C3",
    description: "Add multiple cells",
    example: "=A1+B2+C3 → Adds values from three different cells",
    category: "Advanced Math",
  },
  {
    formula: "=A1*2+B1/3",
    description: "Mix cell references with numbers",
    example: "=A1*2+B1/3 → Multiplies A1 by 2, divides B1 by 3, then adds",
    category: "Advanced Math",
  },
  {
    formula: "=10+5*2",
    description: "Pure number calculations",
    example: "=10+5*2 → Results in 20 (5*2=10, then 10+10=20)",
    category: "Numbers Only",
  },
  {
    formula: "=(10+5)*2",
    description: "Parentheses with numbers",
    example: "=(10+5)*2 → Results in 30 (10+5=15, then 15*2=30)",
    category: "Numbers Only",
  },
]

const categories = Array.from(new Set(formulaExamples.map((f) => f.category)))

export function FormulaSheet() {
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null)

  const copyToClipboard = async (formula: string) => {
    try {
      await navigator.clipboard.writeText(formula)
      setCopiedFormula(formula)
      setTimeout(() => setCopiedFormula(null), 2000)
    } catch (err) {
      console.error("Failed to copy formula:", err)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors shadow-lg">
          <Calculator size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Calculator size={20} />
            Formula Reference
          </SheetTitle>
          <SheetDescription>
            Click on any formula to copy it to your clipboard, then paste it into a cell.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 pb-6">
          {categories.map((category) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              </div>

              <div className="space-y-3">
                {formulaExamples
                  .filter((f) => f.category === category)
                  .map((formula, index) => (
                    <div
                      key={`${category}-${index}`}
                      className="p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
                      onClick={() => copyToClipboard(formula.formula)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-primary">
                              {formula.formula}
                            </code>
                            {copiedFormula === formula.formula ? (
                              <Check size={14} className="text-green-500 flex-shrink-0" />
                            ) : (
                              <Copy
                                size={14}
                                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              />
                            )}
                          </div>
                          <p className="text-sm text-card-foreground font-medium mb-1">{formula.description}</p>
                          <p className="text-xs text-muted-foreground">{formula.example}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {category !== categories[categories.length - 1] && <Separator className="mt-4" />}
            </div>
          ))}

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 text-card-foreground">Tips:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• All formulas must start with the = sign</li>
              <li>• Use parentheses () to control calculation order</li>
              <li>• Cell references are case-insensitive (A1 = a1)</li>
              <li>• Operations follow standard math precedence (* / before + -)</li>
              <li>• Circular references will show #CIRC! error</li>
              <li>• Invalid formulas will show #ERROR!</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
