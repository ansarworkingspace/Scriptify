import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '@/lib/store';
import { Loader2, Trash2 } from 'lucide-react';

export const Terminal: FC = () => {
    const { output, isRunning, clearOutput } = useEditorStore();

    return (
        <div className="relative h-full w-full rounded-lg border border-border bg-black/90 p-4 font-mono text-sm text-white overflow-auto">
            <div className="absolute right-4 top-4 flex gap-2">
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
    );
};