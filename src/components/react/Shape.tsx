import React from "react";

// Shared Props for Polygon and other shapes
type PolygonProps = {
    points: [number, number][];
    fill?: string;
    fillOpacity?: number;
    opacity?: number;
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    children?: React.ReactNode;
};

// Generic Polygon Component
const Polygon = ({
    points,
    fill = "none",
    fillOpacity = 1,
    opacity = 1,
    stroke = "none",
    strokeWidth = 1,
    strokeOpacity = 1,
}: PolygonProps) => {
    return (
        <polygon
            points={points.map(([x, y]) => `${x},${y}`).join(" ")}
            fill={fill}
            fillOpacity={fillOpacity}
            opacity={opacity}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
        />
    );
};

// Triangle Component using Polygon
type TriangleProps = Omit<PolygonProps, "points"> & {
    base: number;
    height: number;
    position?: [number, number];
};

const Triangle = ({
    base,
    height,
    position = [0, 0],
    ...rest
}: TriangleProps) => {
    const [x, y] = position;
    const points: [number, number][] = [
        [x, y],
        [x + base / 2, y - height],
        [x - base / 2, y],
    ];
    return <Polygon points={points} {...rest} />;
};

// Rectangle Component using Polygon
type RectangleProps = Omit<PolygonProps, "points"> & {
    width: number;
    height: number;
    position?: [number, number];
};

const Rectangle = ({
    width,
    height,
    position = [0, 0],
    ...rest
}: RectangleProps) => {
    const [x, y] = position;
    const points: [number, number][] = [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height],
    ];
    return <Polygon points={points} {...rest} />;
};

export { Polygon, Triangle, Rectangle };
export type { PolygonProps, TriangleProps, RectangleProps };