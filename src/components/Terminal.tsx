import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '@/lib/store';
import { Loader2, Trash2, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export const Terminal: FC = () => {
    const { output, isRunning, clearOutput, terminalPosition, setTerminalPosition } = useEditorStore();

    return (
        <div className="relative h-full w-full rounded-lg border border-border bg-black/90 font-mono text-sm text-white">
            <div className="flex items-center justify-between p-2 border-b border-border">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Terminal Position Controls */}
                    <div className="flex items-center gap-1 mr-2">
                        <button
                            onClick={() => setTerminalPosition('bottom')}
                            className={`p-1 rounded hover:bg-gray-700 ${terminalPosition === 'bottom' ? 'text-primary' : 'text-muted-foreground'}`}
                            title="Move to Bottom"
                        >
                            <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setTerminalPosition('left')}
                            className={`p-1 rounded hover:bg-gray-700 ${terminalPosition === 'left' ? 'text-primary' : 'text-muted-foreground'}`}
                            title="Move to Left"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setTerminalPosition('right')}
                            className={`p-1 rounded hover:bg-gray-700 ${terminalPosition === 'right' ? 'text-primary' : 'text-muted-foreground'}`}
                            title="Move to Right"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                    <button 
                        onClick={clearOutput}
                        className="text-muted-foreground hover:text-white transition-colors"
                        title="Clear Terminal"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    
                    <AnimatePresence mode="popLayout">
                        {isRunning && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="p-4 overflow-auto h-[calc(100%-2.5rem)]">
                {output.map((line, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`mb-1 ${line.startsWith('Error:')
                                ? 'text-red-400'
                                : line.startsWith('Warning:')
                                    ? 'text-yellow-400'
                                    : 'text-white'
                            }`}
                    >
                        <span className={line.startsWith('Error:') ? 'text-red-400' : line.startsWith('Warning:') ? 'text-yellow-400' : 'text-green-400'}>
                            {'>'}
                        </span>{' '}
                        {line}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};