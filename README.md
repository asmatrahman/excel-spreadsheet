# Excel-like Spreadsheet Component

A modern, responsive spreadsheet component built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Grid Layout**: 18×15 cell grid with column headers (A-Z) and row numbers
- **Cell Interaction**: Click to select, double-click to edit, keyboard navigation
- **Formula Support**: Basic math operations (+, -, *, /) with cell references (A1, B2, etc.)
- **Error Handling**: Circular reference detection and graceful error display
- **Persistence**: Automatic save/load to localStorage
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive Design**: Modern, minimal UI that adapts to different screen sizes

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Navigation**: Use arrow keys to move between cells
- **Editing**: Double-click a cell or press Enter to start editing
- **Formulas**: Start with `=` (e.g., `=A1+B2*3`, `=SUM(A1:A5)`)
- **Save**: Press Enter or click outside to save changes
- **Delete**: Press Delete or Backspace to clear cell content

## Architecture

### State Management
Uses React Context with useReducer for centralized state management. The state includes:
- Cell data (raw values, computed values, errors)
- Selection and editing state
- Grid dimensions

### Formula Parser
Custom-built expression evaluator that:
- Parses cell references (A1, B2, etc.)
- Evaluates mathematical expressions with proper operator precedence
- Detects and prevents circular references
- Handles errors gracefully

### Components
- `Spreadsheet`: Main container with state management
- `Cell`: Individual cell component with editing capabilities
- Custom hooks for spreadsheet context

### Persistence
Automatically saves grid state to localStorage and restores on page load.

## Technical Decisions

1. **React Context + useReducer**: Chosen for built-in state management without external dependencies
2. **Custom Formula Parser**: Implemented from scratch for full control and learning purposes
3. **Tailwind CSS**: For rapid, consistent styling with responsive design
4. **TypeScript**: For type safety and better developer experience
5. **Accessibility First**: Full keyboard navigation and ARIA labels for screen readers

## Future Enhancements

- More formula functions (SUM, AVERAGE, etc.)
- Cell formatting (bold, italic, colors)
- Row/column insertion and deletion
- Import/export functionality
- Collaborative editing
