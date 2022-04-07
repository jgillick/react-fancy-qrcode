import React from "react";
import { SVGObject, ImageSourcePropType } from "../types";

type LogoProps = {
  size: number;
  logo: ImageSourcePropType;
  logoSize: number;
  svgDom: SVGObject;
};

export default function Logo({ size, logo, logoSize, svgDom }: LogoProps) {
  if (!logoSize) {
    return null;
  }
  const logoPosition = (size - logoSize) / 2;

  const { Image } = svgDom;
  // eslint-disable-next-line react-native-a11y/has-valid-accessibility-ignores-invert-colors
  return (
    <Image
      x={logoPosition}
      y={logoPosition}
      width={logoSize}
      height={logoSize}
      href={logo}
    />
  );
}
