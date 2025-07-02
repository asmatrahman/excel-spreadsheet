import { FormulaSheet } from "@/components/formula-sheet";
import { ModeToggle } from "@/components/mode-toggle";
import Spreadsheet from "@/components/spreadsheet";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen bg-background relative p-4">
      <div className="mb-2 flex items-center justify-end md:justify-between">
        <div className=" flex-col md:flex hidden">
          <h1 className="text-3xl font-bold text-foreground">
            Excel Spreadsheet
          </h1>
          <p className="text-mute-foreground">
            Click to select cells, double-click to edit. Use formulas starting
            with = (e.g., =A1+B2*3)
          </p>
        </div>
        <div className="mb-6 top-4 right-4 z-10 flex gap-2">
          <FormulaSheet />
          <ModeToggle />
          <Link
            href="https://github.com/asmatrahman/excel-spreadsheet.git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Github size={16} />
            <span className="text-sm font-medium">Source Code</span>
          </Link>
        </div>
      </div>

      <div className="h-full">
        <Spreadsheet />
      </div>
    </div>
  );
}
