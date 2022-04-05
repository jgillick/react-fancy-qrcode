import React, { useMemo } from "react";
import Svg, { Defs, G, Rect, LinearGradient, Stop } from "react-native-svg";
import QRCodeGenerator from "qrcode";

import { QRCodeRef, QRCodeProps, ContextOptions } from "./types";
import { OptionsContext } from "./context";
import Dot from "./components/Dot";
import Logo from "./components/Logo";
import PositionPattern from "./components/PositionPattern";

export default React.forwardRef<QRCodeRef, QRCodeProps>((props, ref) => {
  const COLOR_GRAD = "color-gradient";
  const POS_COLOR_GRAD = "position-color-gradient";

  // Default props
  props = {
    dotScale: 1,
    dotRadius: 0,
    color: "black",
    backgroundColor: "white",
    margin: 0,
    errorCorrection: "M",
    colorGradientDirection: ["0%", "0%", "100%", "100%"],
    positionPatternGradientDirection: ["0%", "0%", "100%", "100%"],
    ...props,
  };

  // Set logo size
  if (props.logo) {
    if (!props.logoSize) {
      props.logoSize = props.size * 0.2;
    }
  } else {
    props.logoSize = 0;
  }

  /**
   * Convert the QRCode data into a matrix of pixels
   */
  const { value, errorCorrection } = props;
  const matrix = useMemo((): number[][] => {
    const data = QRCodeGenerator.create(value, {
      errorCorrectionLevel: errorCorrection,
    }).modules.data as number[];
    const sideCount = Math.sqrt(data.length);

    // Convert array of pixels to rows/columns
    return data.reduce((rows, pixel, index) => {
      if (index % sideCount === 0) {
        rows.push([]);
      }
      rows[rows.length - 1].push(pixel);
      return rows;
    }, [] as number[][]);
  }, [value, errorCorrection]);

  /**
   * Create options object
   */
  const options = useMemo<ContextOptions>(() => {
    const sideCount = matrix.length;
    const opts: ContextOptions = {
      ...props,
      sideCount,
      cellSize: props.size / matrix.length,
      logoStartCell: -1,
      logoStopCell: -1,
      color: "black",
      positionPatternColor: "black",
    };

    // Colors
    if (Array.isArray(props.color)) {
      opts.color = COLOR_GRAD;
    } else if (typeof props.color === "string") {
      opts.color = props.color;
    }
    if (!props.positionPatternColor) {
      opts.positionPatternColor = opts.color;
    } else if (Array.isArray(props.positionPatternColor)) {
      opts.positionPatternColor = POS_COLOR_GRAD;
    } else if (typeof props.positionPatternColor === "string") {
      opts.positionPatternColor = props.positionPatternColor;
    }

    // Correct scale
    if (!opts.dotScale || opts.dotScale > 1 || opts.dotScale <= 0) {
      opts.dotScale = 1;
    }

    // Logo bounds
    if (props.logoSize && matrix.length) {
      const logoMargin = opts.cellSize * 0.1;
      const logoCells = Math.ceil(
        (props.logoSize + logoMargin) / opts.cellSize
      );
      const logoStartCell = Math.floor(matrix.length / 2 - logoCells / 2);
      const logoStopCell = sideCount - logoStartCell;

      opts.logoStartCell = logoStartCell;
      opts.logoStopCell = logoStopCell;
    }

    return opts;
  }, [matrix, props]);

  if (!matrix?.length) {
    return null;
  }

  const {
    size,
    color,
    colorGradientDirection,
    positionPatternColor,
    positionPatternGradientDirection,
    backgroundColor,
    logo,
    logoSize,
  } = options;
  const margin = options.margin || 0;
  return (
    <OptionsContext.Provider value={options}>
      <Svg
        ref={ref}
        viewBox={[-margin, -margin, size + margin * 2, size + margin * 2].join(
          " "
        )}
        width={size}
        height={size}
      >
        <Defs>
          {Array.isArray(color) && Array.isArray(colorGradientDirection) && (
            <LinearGradient
              id={COLOR_GRAD}
              x1={colorGradientDirection[0]}
              y1={colorGradientDirection[1]}
              x2={colorGradientDirection[2]}
              y2={colorGradientDirection[3]}
            >
              <Stop offset="0" stopColor={color[0]} stopOpacity="1" />
              <Stop offset="1" stopColor={color[1]} stopOpacity="1" />
            </LinearGradient>
          )}
          {Array.isArray(positionPatternColor) &&
            Array.isArray(positionPatternGradientDirection) && (
              <LinearGradient
                id={POS_COLOR_GRAD}
                x1={positionPatternGradientDirection[0]}
                y1={positionPatternGradientDirection[1]}
                x2={positionPatternGradientDirection[2]}
                y2={positionPatternGradientDirection[3]}
              >
                <Stop
                  offset="0"
                  stopColor={positionPatternColor[0]}
                  stopOpacity="1"
                />
                <Stop
                  offset="1"
                  stopColor={positionPatternColor[1]}
                  stopOpacity="1"
                />
              </LinearGradient>
            )}
        </Defs>
        <G>
          <Rect
            x={-margin}
            y={-margin}
            width={size + margin * 2}
            height={size + margin * 2}
            fill={backgroundColor}
          />
        </G>
        <PositionPattern placement="top-left" />
        <PositionPattern placement="top-right" />
        <PositionPattern placement="bottom-left" />
        <G>
          {matrix.map((rowData, row) =>
            rowData.map(
              (pixelValue, column) =>
                Boolean(value) && (
                  <Dot
                    {...{ value: pixelValue, row, column }}
                    key={`${row}-${column}`}
                  />
                )
            )
          )}
        </G>
        {logo && logoSize && <Logo />}
      </Svg>
    </OptionsContext.Provider>
  );
});
