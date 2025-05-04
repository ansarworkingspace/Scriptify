import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TerminalPosition = "bottom" | "left" | "right";

interface EditorStore {
  code: string;
  output: string[];
  isRunning: boolean;
  terminalPosition: TerminalPosition;
  terminalSize: number;
  setCode: (code: string) => void;
  setOutput: (output: string[]) => void;
  setIsRunning: (isRunning: boolean) => void;
  clearOutput: () => void;
  clearCode: () => void;
  setTerminalPosition: (position: TerminalPosition) => void;
  setTerminalSize: (size: number) => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      code: 'console.log("Hello, World!");',
      output: [],
      isRunning: false,
      terminalPosition: "right",
      terminalSize: 40,
      setCode: (code) => set({ code }),
      setOutput: (output) => set({ output }),
      setIsRunning: (isRunning) => set({ isRunning }),
      clearOutput: () => set({ output: [] }),
      clearCode: () => set({ code: 'console.log("Hello, World!");' }),
      setTerminalPosition: (position) => set({ terminalPosition: position }),
      setTerminalSize: (size) => set({ terminalSize: size }),
    }),
    {
      name: "editor-storage",
    }
  )
);
