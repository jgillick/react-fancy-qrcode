import React, { useContext } from "react";
import { G, Image } from "react-native-svg";
import { OptionsContext } from "../";

export default function Logo() {
  const {
    size,
    logo,
    logoSize,
    logoStartCell,
    logoStopCell,
    cellSize,
    margin,
  } = useContext(OptionsContext);

  if (!logoSize) {
    return null;
  }

  // Position logo inside the block cleared for the logo
  const codeMargin = margin || 0;
  const spaceSize = (logoStopCell - logoStartCell) * cellSize;
  const logoPosition = (size - logoSize - codeMargin * 2) / 2;

  return (
    <G x={logoPosition} y={logoPosition}>
      {/* eslint-disable-next-line react-native-a11y/has-valid-accessibility-ignores-invert-colors */}
      <Image
        width={logoSize}
        height={logoSize}
        preserveAspectRatio="xMidYMid slice"
        href={logo}
        clipPath="url(#clip-logo)"
      />
    </G>
  );
}
