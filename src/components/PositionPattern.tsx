import React, { useContext } from "react";
import { G, Rect } from "react-native-svg";
import { OptionsContext } from "../context";

type PositionPatternProps = {
  placement: "top-left" | "top-right" | "bottom-left";
};

/**
 * Builds a positioning set of squares
 */
export default function PositionPattern({ placement }: PositionPatternProps) {
  const { cellSize, positionPatternColor, sideCount, positionRadius } =
    useContext(OptionsContext);
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

  // Get radii
  let outerRx: number | string = 0;
  let outerRy: number | string = 0;
  let innerRx: number | string = 0;
  let innerRy: number | string = 0;

  if (typeof positionRadius === "string") {
    outerRx = outerRy = innerRx = innerRy = positionRadius;
  }
  if (Array.isArray(positionRadius)) {
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

  return (
    <G>
      <Rect
        x={outerX + strokeCorrection}
        y={outerY + strokeCorrection}
        width={outerSize}
        height={outerSize}
        stroke={positionPatternColor}
        strokeWidth={cellSize}
        rx={outerRx}
        ry={outerRy}
      />
      <Rect
        x={outerX + innerOffset}
        y={outerY + innerOffset}
        width={innerSize}
        height={innerSize}
        fill={positionPatternColor}
        rx={innerRx}
        ry={innerRy}
      />
    </G>
  );
}
