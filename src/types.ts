import { Component } from "react";
import { SvgProps } from "react-native-svg";
import { ImageSourcePropType } from "react-native";

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

export type ContextOptions = QRCodeProps & {
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
