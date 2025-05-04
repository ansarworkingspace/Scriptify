import { FC } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useEditorStore, type TerminalPosition } from '@/lib/store';
import { motion } from 'framer-motion';

export const TerminalPositionToggle: FC = () => {
    const { terminalPosition, setTerminalPosition } = useEditorStore();

    const positions: { value: TerminalPosition; icon: React.ReactElement; label: string }[] = [
        { value: 'bottom', icon: <ArrowDown className="w-4 h-4" />, label: 'Bottom' },
        { value: 'right', icon: <ArrowRight className="w-4 h-4" />, label: 'Right' },
        { value: 'left', icon: <ArrowLeft className="w-4 h-4" />, label: 'Left' },
    ];

    return (
        <div className="flex items-center gap-1">
            {positions.map(({ value, icon, label }) => (
                <motion.button
                    key={value}
                    onClick={() => setTerminalPosition(value)}
                    className={`
                        p-1.5 rounded-md transition-all
                        ${terminalPosition === value
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={`Move terminal to ${label}`}
                >
                    {icon}
                </motion.button>
            ))}
        </div>
    );
};