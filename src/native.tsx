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
});
