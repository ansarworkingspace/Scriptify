'use client';

import { useCallback, useState } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { Terminal } from '@/components/Terminal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEditorStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { PlayIcon, Trash2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { ProblemGenerator } from '@/components/ProblemGenerator';

export default function Home() {
  const { code, setOutput, setIsRunning, clearOutput, clearCode, isRunning } = useEditorStore();
  const [editorWidth, setEditorWidth] = useState('60%');

  const handleResize = useCallback((e: MouseEvent) => {
    const container = document.getElementById('resizable-container');
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newWidth >= 30 && newWidth <= 70) {
        setEditorWidth(`${newWidth}%`);
      }
    }
  }, []);

  const startResize = useCallback(() => {
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  }, [handleResize]);

  const stopResize = useCallback(() => {
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  }, [handleResize]);

  const runCode = useCallback(async () => {
    clearOutput();
    setIsRunning(true);

    try {
      const worker = new Worker(new URL('../lib/code-worker.ts', import.meta.url));

      worker.onmessage = (e) => {
        const { success, output, error } = e.data;
        setOutput(output);
        setIsRunning(false);
        worker.terminate();
      };

      worker.postMessage(code);
    } catch (error: any) {
      setOutput([`Error: ${error.message}`]);
      setIsRunning(false);
    }
  }, [code, setOutput, setIsRunning, clearOutput]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <main className="mx-auto max-w-[90rem] space-y-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Image
              src="/bgrelogo.png"
              alt="Scriptify Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Scriptify JS Compiler</h1>
              <p className="text-sm text-muted-foreground">
                Write and execute JavaScript code in real-time with console output.
              </p>
            </div>
          </motion.div>
          <div className="flex items-center gap-4">
          <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlayIcon className="h-4 w-4" />
              <span>Run Code</span>
            </motion.button>
            <ProblemGenerator />
            <ThemeToggle />
          </div>
        </div>

        <div id="resizable-container" className="flex flex-col lg:flex-row gap-4 relative">
          <div style={{ width: editorWidth }} className="w-full transition-all">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-[calc(100vh-12rem)]"
            >
              <CodeEditor />
            </motion.div>
          </div>

          <div
            className="absolute top-0 bottom-0 cursor-col-resize w-4 hover:bg-primary/10 transition-colors"
            style={{ left: `calc(${editorWidth} - 8px)` }}
            onMouseDown={startResize}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ width: `calc(100% - ${editorWidth})` }}
            className="w-full transition-all h-[calc(100vh-12rem)]"
          >
            <Terminal />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
