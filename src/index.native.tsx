import React from "react";
import Svg, {
  Defs,
  G,
  Rect,
  LinearGradient,
  Stop,
  Image,
} from "react-native-svg";
import QRCode from "./components/QRCode";

import { QRCodeRef, QRCodeProps } from "./types";

const svgDom = {
  Svg,
  Defs,
  G,
  Rect,
  LinearGradient,
  Stop,
  Image,
};

export default React.forwardRef<QRCodeRef, QRCodeProps>((props, ref) => {
  return <QRCode ref={ref} {...props} svgDom={svgDom} />;
  // return (
  //   <Svg width={100} height={100}>
  //     <Rect x={0} y={0} width={100} height={100} fill={"blue"} />
  //   </Svg>
  // );
});
