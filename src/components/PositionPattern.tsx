import React from "react";
import { SVGObject, PositionRadius } from "../types";

type PositionPatternProps = {
  placement: "top-left" | "top-right" | "bottom-left";
  cellSize: number;
  sideCount: number;
  positionColor: string;
  positionRadius?: PositionRadius | PositionRadius[];
  svgDom: SVGObject;
};

/**
 * Builds a positioning set of squares
 */
export default function PositionPattern({
  placement,
  cellSize,
  positionColor,
  sideCount,
  positionRadius,
  svgDom,
}: PositionPatternProps) {
  const innerOffset = cellSize * 2;
  const innerSize = 3 * cellSize;
  let outerSize = 7 * cellSize;
  let outerX = 0;
  let outerY = 0;

  if (placement === "top-right") {
    outerX = (sideCount - 7) * cellSize;
  } else if (placement === "bottom-left") {
    outerY = (sideCount - 7) * cellSize;
  }

  // Keep the stroke inside the box
  outerSize -= cellSize;
  const strokeCorrection = cellSize / 2;

  // Get radius values
  let outerRx: number | string = 0;
  let outerRy: number | string = 0;
  let innerRx: number | string = 0;
  let innerRy: number | string = 0;
  if (
    typeof positionRadius === "string" ||
    typeof positionRadius === "number"
  ) {
    outerRx = outerRy = innerRx = innerRy = positionRadius;
  } else if (Array.isArray(positionRadius)) {
    if (typeof positionRadius[0] === "object") {
      outerRx = positionRadius[0].rx;
      outerRy = positionRadius[0].ry;
    } else {
      outerRx = outerRy = positionRadius[0];
    }

    if (typeof positionRadius[1] === "object") {
      innerRx = positionRadius[1].rx;
      innerRy = positionRadius[1].ry;
    } else {
      innerRx = innerRy = positionRadius[1];
    }
  }

  const { G, Rect } = svgDom;
  return (
    <G>
      <Rect
        x={outerX + strokeCorrection}
        y={outerY + strokeCorrection}
        width={outerSize}
        height={outerSize}
        stroke={positionColor}
        strokeWidth={cellSize}
        rx={outerRx}
        ry={outerRy}
        fillOpacity={0}
      />
      <Rect
        x={outerX + innerOffset}
        y={outerY + innerOffset}
        width={innerSize}
        height={innerSize}
        fill={positionColor}
        rx={innerRx}
        ry={innerRy}
      />
    </G>
  );
}
