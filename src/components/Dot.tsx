import React, { useContext, useMemo } from "react";
import { Rect } from "react-native-svg";
import { OptionsContext } from "../";

type PixelProps = {
  value: number;
  row: number;
  column: number;
};

/**
 * Creates a single pixel dot in the QRCode
 */
export default function Dot({ value, row, column }: PixelProps) {
  const {
    cellSize,
    color,
    logoStartCell,
    logoStopCell,
    sideCount,
    dotScale,
    dotRadius,
  } = useContext(OptionsContext);

  const inLogoArea =
    logoStartCell &&
    logoStopCell &&
    column >= logoStartCell &&
    column < logoStopCell &&
    row >= logoStartCell &&
    row < logoStopCell;
  const inPositioningPattern = useMemo(() => {
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
  }, [column, row, sideCount]);

  // Do not add pixels to logo or positioning pattern areas
  if (!value || inLogoArea || inPositioningPattern) {
    return null;
  }

  // Scale the dot
  const size = cellSize * (dotScale || 1);
  const offset = dotScale !== 1 ? (cellSize - size) / 2 : 0;
  const x = column * cellSize + offset;
  const y = row * cellSize + offset;

  return (
    <Rect x={x} y={y} width={size} height={size} fill={color} ry={dotRadius} />
  );
}
