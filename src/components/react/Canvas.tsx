import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DraggableCore } from 'react-draggable';




const ContextMenu = ({ x, y, onClose, options }) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            onClose();
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [onClose]);

    return (
        <div
            className="fixed bg-white shadow-lg rounded-md py-1 min-w-[150px] z-50"
            style={{
                left: Math.min(x, window.innerWidth - 150),
                top: y
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {options.map((option, index) => (
                <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                        option.onClick();
                        onClose();
                    }}
                >
                    {option.label}
                </div>
            ))}
        </div>
    );
};

const CustomDraggable = ({ children, onDrag, style, zoom, onClick }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [isActive, setIsActive] = useState(false);

    const handleDrag = useCallback((e, data) => {
        const deltaX = data.deltaX / zoom;
        const deltaY = data.deltaY / zoom;

        setPosition(prev => ({
            x: prev.x + deltaX,
            y: prev.y + deltaY
        }));

        onDrag?.(e, { ...data, deltaX, deltaY });
    }, [zoom, onDrag]);

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenuPos({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
    };

    const contextMenuOptions = [
        {
            label: 'Delete',
            onClick: () => console.log('Delete clicked')
        },
        {
            label: 'Duplicate',
            onClick: () => console.log('Duplicate clicked')
        },
        {
            label: 'Edit',
            onClick: () => console.log('Edit clicked')
        }
    ];

    const handleClick = (e) => {
        e.stopPropagation();
        setIsActive(!isActive);

        // fire custom callback for click event
        if (onClick) {
            onClick();
        }
    }

    return (
        <>
            <DraggableCore
                onStart={(e, data) => {
                    setIsDragging(true);
                    e.preventDefault();
                }}
                onDrag={handleDrag}
                onStop={() => setIsDragging(false)}
            >
                <div
                    className={isActive ? 'border-2 border-solid border-green-700 rounded-md' : ''}
                    style={{
                        ...style,
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        cursor: isDragging ? 'grabbing' : 'grab',
                        userSelect: 'none'
                    }}
                    onContextMenu={handleContextMenu}
                    onClick={handleClick}
                >
                    {children}
                </div>
            </DraggableCore>

            {showContextMenu && (
                <ContextMenu
                    x={contextMenuPos.x}
                    y={contextMenuPos.y}
                    options={contextMenuOptions}
                    onClose={() => setShowContextMenu(false)}
                />
            )}
        </>
    );
};

const ZoomableCanvas = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [showCanvasContextMenu, setShowCanvasContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const lastMousePosRef = useRef({ x: 0, y: 0 });

    const handleWheel = useCallback((e) => {
        e.preventDefault();
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 10);

        const newOffset = {
            x: mouseX - (mouseX - offset.x) * (newZoom / zoom),
            y: mouseY - (mouseY - offset.y) * (newZoom / zoom)
        };

        setZoom(newZoom);
        setOffset(newOffset);
    }, [zoom, offset]);

    const handleCanvasMouseDown = useCallback((e) => {
        if (e.target === canvasRef.current) {
            setIsDragging(true);
            lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        }
    }, []);

    const handleCanvasMouseMove = useCallback((e) => {
        if (isDragging) {
            const deltaX = e.clientX - lastMousePosRef.current.x;
            const deltaY = e.clientY - lastMousePosRef.current.y;

            setOffset(prev => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY
            }));

            lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        }
    }, [isDragging]);

    const handleCanvasMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleCanvasContextMenu = useCallback((e) => {
        e.preventDefault();
        setContextMenuPos({ x: e.clientX - 300, y: e.clientY - 300 });
        setShowCanvasContextMenu(true);
    }, []);

    const canvasContextMenuOptions = [
        {
            label: 'Add Rectangle',
            onClick: () => console.log('Add rectangle')
        },
        {
            label: 'Add Circle',
            onClick: () => console.log('Add circle')
        },
        {
            label: 'Clear Canvas',
            onClick: () => console.log('Clear canvas')
        }
    ];

    return (
        <div
            ref={canvasRef}
            className="bg-gray-100 w-full h-full relative overflow-hidden"
            style={{
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onWheel={handleWheel}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onContextMenu={handleCanvasContextMenu}
        >
            <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    transformOrigin: '0 0',
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #00000011 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                />

                <CustomDraggable
                    style={{ position: 'absolute', top: 100, left: 100 }}
                    zoom={zoom}
                    onDrag={(e, data) => {
                        console.log('Dragged with zoom:', zoom, 'Delta:', data.deltaX, data.deltaY);
                    }}
                    onClick={() => console.log('Clicked 1')}
                >
                    <div className="bg-blue-500 w-20 h-20 rounded shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-full h-full flex items-center justify-center text-white font-medium">
                            Drag Me
                        </div>
                    </div>
                </CustomDraggable>

                <CustomDraggable
                    style={{ position: 'absolute', top: 300, left: 300 }}
                    zoom={zoom}
                    onDrag={(e, data) => {
                        console.log('Dragged with zoom:', zoom, 'Delta:', data.deltaX, data.deltaY);
                    }}
                    onClick={() => console.log('Clicked 2')}
                >
                    <div className="bg-blue-500 w-20 h-20 rounded shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-full h-full flex items-center justify-center text-white font-medium">
                            Drag Me
                        </div>
                    </div>
                </CustomDraggable>
            </div>

            {showCanvasContextMenu && (
                <ContextMenu
                    x={contextMenuPos.x}
                    y={contextMenuPos.y}
                    options={canvasContextMenuOptions}
                    onClose={() => setShowCanvasContextMenu(false)}
                />
            )}
        </div>
    );
};

export default ZoomableCanvas;