import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EditorStore {
    code: string;
    output: string[];
    isRunning: boolean;
    setCode: (code: string) => void;
    setOutput: (output: string[]) => void;
    setIsRunning: (isRunning: boolean) => void;
    clearOutput: () => void;
    clearCode: () => void;
}

export const useEditorStore = create<EditorStore>()(
    persist(
        (set) => ({
            code: 'console.log("Hello, World!");',
            output: [],
            isRunning: false,
            setCode: (code) => set({ code }),
            setOutput: (output) => set({ output }),
            setIsRunning: (isRunning) => set({ isRunning }),
            clearOutput: () => set({ output: [] }),
            clearCode: () => set({ code: 'console.log("Hello, World!");' }),
        }),
        {
            name: 'editor-storage',
        }
    )
);