import React, { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';

export interface HorizontalContainerProps {
    top: ReactNode;
    bottom: ReactNode;
    topDefaultPercentage?: number;
    bottomDefaultPercentage?: number;
    className?: string;
    minTopPercentage?: number;
    maxTopPercentage?: number;
    resizerClassName?: string;
    onResize?: (topPercentage: number, bottomPercentage: number) => void;
}

const HorizontalContainer: React.FC<HorizontalContainerProps> = ({
    top,
    bottom,
    topDefaultPercentage = 70,
    bottomDefaultPercentage,
    className = '',
    minTopPercentage = 20,
    maxTopPercentage = 80,
    resizerClassName = '',
    onResize
}) => {
    // Calculate bottom percentage if not provided
    const calculatedBottomDefault = bottomDefaultPercentage ?? (100 - topDefaultPercentage);

    const [topHeight, setTopHeight] = useState<number>(topDefaultPercentage);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newTopHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;

        // Apply constraints
        const constrainedHeight = Math.min(Math.max(newTopHeight, minTopPercentage), maxTopPercentage);
        const bottomHeight = 100 - constrainedHeight;

        setTopHeight(constrainedHeight);

        // Call onResize callback if provided
        onResize?.(constrainedHeight, bottomHeight);
    }, [isDragging, minTopPercentage, maxTopPercentage, onResize]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'row-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const bottomHeight = 100 - topHeight;

    return (
        <div
            ref={containerRef}
            className={`flex flex-col w-full h-full ${className}`}
        >
            <div
                className="flex-shrink-0 overflow-auto"
                style={{ height: `${topHeight}%` }}
            >
                {top}
            </div>

            <div
                className={`h-1 bg-gray-300 hover:bg-blue-500 cursor-row-resize flex-shrink-0 relative group transition-colors select-none ${isDragging ? 'bg-blue-500' : ''
                    } ${resizerClassName}`}
                onMouseDown={handleMouseDown}
            >
                <div className="absolute inset-x-0 -top-2 -bottom-2 group-hover:bg-blue-500/10" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="flex space-x-1">
                        <div className="h-0.5 w-4 bg-gray-500 group-hover:bg-white transition-colors"></div>
                        <div className="h-0.5 w-4 bg-gray-500 group-hover:bg-white transition-colors"></div>
                        <div className="h-0.5 w-4 bg-gray-500 group-hover:bg-white transition-colors"></div>
                    </div>
                </div>
            </div>

            <div
                className="flex-shrink-0 overflow-auto"
                style={{ height: `${bottomHeight}%` }}
            >
                {bottom}
            </div>
        </div>

    );
};

export default HorizontalContainer;