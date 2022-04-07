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
  // return (
  //   <Svg width={100} height={100}>
  //     <Rect x={0} y={0} width={100} height={100} fill={"blue"} />
  //   </Svg>
  // );
});

export { QRCodeRef } from "./types";
