import React, { useMemo, Component } from "react";
import { ImageSourcePropType } from "react-native";
import Svg, {
  Defs,
  G,
  Rect,
  LinearGradient,
  Stop,
  SvgProps,
} from "react-native-svg";
import QRCodeGenerator from "qrcode";

import Dot from "./components/Dot";
import Logo from "./components/Logo";
import PositionPattern from "./components/PositionPattern";

type ColorGradient = [string, string];
type ColorGradientDirection = [string, string, string, string];

type PositionRadius = string | number | { rx: string; ry: string };

export type QRCodeRef = Component<SvgProps, any, any> & {
  toDataURL: (cb: Function) => void;
};

export type QRCodeProps = {
  /**
   * The value to encode into the QR code
   */
  value: string;

  /**
   * The pixel width/height of the generated QR code
   * @default 100
   */
  size: number;

  /**
   * Space around the QR code (useful if you're generating an image with it)
   * @default 0
   */
  margin?: number;

  /**
   * Logo image to place in the center of the QR code
   */
  logo?: ImageSourcePropType;

  /**
   * How big to make the logo
   * Defaults to 20% of the QR code size.
   */
  logoSize?: number;

  /**
   * The QR code background color
   * @default white
   */
  backgroundColor?: string;

  /**
   * Primary color of the QR code dots.
   * If this is an array of strings, it's treated as a linear gradient
   * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/LinearGradient
   * @default black
   */
  color?: string | ColorGradient;

  /**
   * If color is defined as a linear gradient, this defines the gradient direction.
   * Array format: [x1, y1, x2, y2]
   * @default ['0%', '0%', '100%', '100%'],
   */
  colorGradientDirection?: ColorGradientDirection;

  /**
   * Color of the positioning squares in the top-left, top-right, and bottom-left.
   * Defaults to the color property
   */
  positionPatternColor?: string | ColorGradient;

  /**
   * If positionPatternColor is defined as a linear gradient, this defines the gradient direction.
   * Array format: [x1, y1, x2, y2]
   * @default ['0%', '0%', '100%', '100%'],
   */
  positionPatternGradientDirection?: ColorGradientDirection;

  /**
   * Set this to a number between 0.1 - 1 in order to scale the QR code dots.
   * @default 1
   */
  dotScale?: number;

  /**
   * The radius of each dot as a pixel or percent
   * @default 0
   */
  dotRadius?: string | number;

  /**
   * The radius of the positioning pattern squares.
   *
   * If defined as a pixel/percent, this will be used for all 3 patters, both outside and inside squares.
   * ```
   * positionRadius='5%'
   * ```
   *
   * If defined as an array, the first index is for the outer square and the second is for the inner square of each pattern.
   * ```
   * positionRadius={['20%', 10]}
   * ```
   *
   * You can also define each radius as an object with an rx and ry value (i.e. `{rx: '5%', ry: '10%'}`)
   * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/ry
   * ```
   * positionRadius={{rx: '5%', ry: '10%'}}
   * // or
   * positionRadius={[
   *  {rx: '5%', ry: '10%'},
   *  {rx: 1, ry: 20},
   * ]}
   * ```
   *
   * @default 0
   */
  positionRadius?: PositionRadius | PositionRadius[];

  /**
   * QR Code error correction mode
   * @see https://en.wikipedia.org/wiki/QR_code#Error_correction
   */
  errorCorrection?: "L" | "M" | "Q" | "H";
};

type Options = QRCodeProps & {
  color: string;
  positionPatternColor: string;

  // The col/row the logo starts on
  logoStartCell: number;

  // The col/row the logo stops on
  logoStopCell: number;

  // Size of each QR code dot, in pixels
  cellSize: number;

  // The number of dots on each side of the QR code
  sideCount: number;
};

export const OptionsContext = React.createContext<Options>({} as Options);

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
  const options = useMemo<Options>(() => {
    const sideCount = matrix.length;
    const opts: Options = {
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
