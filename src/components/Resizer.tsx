import { FC, MouseEvent as ReactMouseEvent, useCallback, useState, useEffect, useRef } from 'react';
import { useEditorStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface ResizerProps {
    onResize: (delta: number) => void;
}

export const Resizer: FC<ResizerProps> = ({ onResize }) => {
    const [isDragging, setIsDragging] = useState(false);
    const { terminalPosition } = useEditorStore();
    const isHorizontal = terminalPosition === 'left' || terminalPosition === 'right';
    const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
    const frameRef = useRef<number | null>(null);

    const handleMouseDown = useCallback((e: ReactMouseEvent) => {
        setIsDragging(true);
        lastPositionRef.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        lastPositionRef.current = null;
        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
        }
    }, []);

    const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
        if (!isDragging || !lastPositionRef.current) return;

        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
        }

        frameRef.current = requestAnimationFrame(() => {
            if (!lastPositionRef.current) return;

            let delta = isHorizontal
                ? e.clientX - lastPositionRef.current.x
                : e.clientY - lastPositionRef.current.y;

            if (terminalPosition === 'right' || terminalPosition === 'bottom') {
                delta = -delta;
            }

            lastPositionRef.current = { x: e.clientX, y: e.clientY };
            onResize(delta);
        });
    }, [isDragging, isHorizontal, onResize, terminalPosition]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <motion.div
            className={`flex items-center justify-center transition-colors select-none
                ${isHorizontal
                    ? 'w-1 cursor-ew-resize hover:w-2'
                    : 'h-1 cursor-ns-resize hover:h-2'}`}
            onMouseDown={handleMouseDown}
            whileHover={{ scale: 1.5 }}
        >
            <div
                className={`bg-gray-600 rounded-full transition-all duration-200
                    ${isDragging ? 'bg-blue-500' : 'hover:bg-blue-500/50'}
                    ${isHorizontal
                        ? 'h-20 w-0.5'
                        : 'w-20 h-0.5'}`}
            />
        </motion.div>
    );
};