import React from "react";
import QRCode from "./components/QRCode";

import { QRCodeRef, QRCodeProps } from "./types";

const svgDom = {
  Svg: "svg" as React.ElementType,
  Defs: "defs" as React.ElementType,
  G: "g" as React.ElementType,
  Rect: "rect" as React.ElementType,
  LinearGradient: "linearGradient" as React.ElementType,
  Stop: "stop" as React.ElementType,
  Image: "image" as React.ElementType,
};

export default React.forwardRef<QRCodeRef, QRCodeProps>((props, ref) => {
  return <QRCode ref={ref} {...props} svgDom={svgDom} />;
});

export { QRCodeRef } from "./types";
