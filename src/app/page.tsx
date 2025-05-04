'use client';

import { useCallback, useEffect } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { Terminal } from '@/components/Terminal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEditorStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { PlayIcon, Trash2, Terminal as TerminalIcon } from 'lucide-react';
import Image from 'next/image';
import { ProblemGenerator } from '@/components/ProblemGenerator';
import { Resizer } from '@/components/Resizer';
import { TerminalPositionToggle } from '@/components/TerminalPositionToggle';

export default function Home() {
    const {
        code,
        setOutput,
        setIsRunning,
        clearOutput,
        isRunning,
        terminalPosition,
        terminalSize,
        setTerminalSize
    } = useEditorStore();

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

    // Add useEffect for keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                if (!isRunning) {
                    runCode();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [runCode, isRunning]);

    const handleResize = useCallback((delta: number) => {
        const containerSize = terminalPosition === 'bottom'
            ? window.innerHeight
            : window.innerWidth;
    
        const pixelSize = (terminalSize / 100) * containerSize;
        let newPixelSize;
        
        // Fix resize direction based on terminal position
        if (terminalPosition === 'right') {
            newPixelSize = Math.min(Math.max(pixelSize + delta, 100), containerSize * 0.9);
        } else if (terminalPosition === 'left') {
            newPixelSize = Math.min(Math.max(pixelSize - delta, 100), containerSize * 0.9);
        } else { // bottom
            newPixelSize = Math.min(Math.max(pixelSize - delta, 100), containerSize * 0.9);
        }
        
        const newPercentage = (newPixelSize / containerSize) * 100;
        setTerminalSize(Math.min(Math.max(newPercentage, 10), 90));
    }, [terminalPosition, terminalSize, setTerminalSize]);

 
  // Calculate styles based on terminal position
  const getLayoutStyles = () => {
    if (terminalPosition === 'bottom') {
      return {
        container: "flex flex-col gap-4 relative",
        editor: {
          width: '100%',
          height: `calc(${100 - terminalSize}vh - 6rem)`
        },
        resizer: {
          className: "absolute left-0 right-0 cursor-row-resize h-6 z-10 hover:bg-primary/10",
          style: { top: `calc(${100 - terminalSize}vh - 9rem)` }
        },
        terminal: {
          width: '100%',
          height: `calc(${terminalSize}vh - 6rem)`
        }
      };
    } else if (terminalPosition === 'right') {
      return {
        container: "flex flex-row gap-4 relative",
        editor: {
          width: `${100 - terminalSize}%`,
          height: 'calc(100vh - 6rem)'
        },
        resizer: {
          className: "absolute top-0 bottom-0 cursor-col-resize w-6 z-10 hover:bg-primary/10",
          style: { left: `calc(${100 - terminalSize}% - 12px)` }
        },
        terminal: {
          width: `${terminalSize}%`,
          height: 'calc(100vh - 6rem)'
        }
      };
    } else { // left
      return {
        container: "flex flex-row-reverse gap-4 relative",
        editor: {
          width: `${100 - terminalSize}%`,
          height: 'calc(100vh - 6rem)'
        },
        resizer: {
          className: "absolute top-0 bottom-0 cursor-col-resize w-6 z-10 hover:bg-primary/10",
          style: { right: `calc(${100 - terminalSize}% - 12px)` }
        },
        terminal: {
          width: `${terminalSize}%`,
          height: 'calc(100vh - 6rem)'
        }
      };
    }
  };

  const layoutStyles = getLayoutStyles();

  return (
    <div className="min-h-screen bg-background p-2 md:p-4">
      <main className="mx-auto max-w-[90rem] space-y-4">
        <div className="flex items-center justify-between py-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Image
              src="/bgrelogo.png"
              alt="Scriptify Logo"
              width={28}
              height={28}
              className="rounded-md"
            />
            <h1 className="text-lg font-bold text-foreground">Scriptify</h1>
          </motion.div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center space-x-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlayIcon className="h-3 w-3" />
              <span>Run</span>
            </motion.button>
            <ProblemGenerator />
            {/* Add Terminal Position Toggle here */}
            {/* <TerminalPositionToggle /> */}
            <ThemeToggle />
          </div>
        </div>

        <div id="resizable-container" className={layoutStyles.container}>
          <div 
            style={layoutStyles.editor}
            className="w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
            >
              <CodeEditor />
            </motion.div>
          </div>

          <div
            className={layoutStyles.resizer.className}
            style={layoutStyles.resizer.style}
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startY = e.clientY;
              
              const onMouseMove = (e: MouseEvent) => {
                const delta = terminalPosition === 'bottom' 
                  ? e.clientY - startY 
                  : terminalPosition === 'right' 
                    ? e.clientX - startX 
                    : startX - e.clientX; // left position
                handleResize(delta);
              };
              
              const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };
              
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={layoutStyles.terminal}
            className="w-full"
          >
            <Terminal />
          </motion.div>
        </div>
      </main>
    </div>
  );
}