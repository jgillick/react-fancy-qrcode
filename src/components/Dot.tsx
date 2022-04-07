import React from "react";
import { SVGObject } from "../types";

type PixelProps = {
  value: number;
  row: number;
  column: number;
  cellSize: number;
  color: string;
  logoStartCell: number;
  logoStopCell: number;
  sideCount: number;
  dotScale: number;
  dotRadius: string | number;
  svgDom: SVGObject;
};

/**
 * Creates a single pixel dot in the QRCode
 */
export default React.memo(
  ({
    value,
    row,
    column,
    cellSize,
    color,
    logoStartCell,
    logoStopCell,
    sideCount,
    dotScale,
    dotRadius,
    svgDom,
  }: PixelProps) => {
    if (!value) {
      return null;
    }

    const inPositioningPattern = () => {
      // Top left
      if (column <= 7 && row <= 7) {
        return true;
      }
      // Top right
      if (column >= sideCount - 8 && row <= 7) {
        return true;
      }
      // Bottom left
      if (column <= 7 && row >= sideCount - 7) {
        return true;
      }
      return false;
    };

    const inLogoArea =
      logoStartCell &&
      logoStopCell &&
      column >= logoStartCell &&
      column < logoStopCell &&
      row >= logoStartCell &&
      row < logoStopCell;

    // Do not add pixels to logo or positioning pattern areas
    if (inLogoArea || inPositioningPattern()) {
      return null;
    }

    // Scale the dot
    const size = cellSize * (dotScale || 1);
    const offset = dotScale !== 1 ? (cellSize - size) / 2 : 0;
    const x = column * cellSize + offset;
    const y = row * cellSize + offset;

    const { Rect } = svgDom;
    return (
      <Rect
        x={x}
        y={y}
        width={size}
        height={size}
        fill={color}
        ry={dotRadius}
      />
    );
  }
);
