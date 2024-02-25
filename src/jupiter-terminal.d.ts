declare global {
  interface Window {
    Jupiter: any; // Use 'any' or define a more specific type for 'JupiterTerminal'
  }
}

export {}; // This line is important to ensure the file is treated as a module
