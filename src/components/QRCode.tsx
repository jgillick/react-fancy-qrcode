import React, { useMemo } from "react";
import QRCodeGenerator from "qrcode";

import { generateDataMatrix } from "../utils";
import { QRCodeRef, QRCodeSVGProps } from "../types";
import Dot from "./Dot";
import Logo from "./Logo";
import PositionPattern from "./PositionPattern";

export default React.memo(
  React.forwardRef<QRCodeRef, QRCodeSVGProps>(
    (
      {
        value = "",
        size,
        logo,
        svgDom,
        logoSize = 0,
        dotScale = 1,
        dotRadius = 0,
        color = "black",
        backgroundColor = "white",
        margin = 0,
        errorCorrection = "M",
        colorGradientDirection = ["0%", "0%", "100%", "100%"],

        positionColor,
        positionRadius = 0,
        positionGradientDirection = ["0%", "0%", "100%", "100%"],
      },
      ref
    ) => {
      const COLOR_GRAD = "colorGradient";
      const POS_COLOR_GRAD = "positionColorGradient";

      // Set logo size
      if (logo) {
        if (!logoSize) {
          logoSize = size * 0.2;
        }
      }

      // Convert the QRCode data into a matrix of pixels
      const matrix = generateDataMatrix(value, errorCorrection);
      if (!matrix.length) {
        return null;
      }
      const sideCount = matrix.length;
      const cellSize = size / sideCount;

      // Normalize Colors
      let colorGradient: string[] = [];
      let posColorGradient: string[] = [];
      if (Array.isArray(color)) {
        colorGradient = color;
        color = `url(#${COLOR_GRAD})`;
      }
      if (!positionColor) {
        positionColor = color;
      }
      if (Array.isArray(positionColor)) {
        posColorGradient = positionColor;
        positionColor = `url(#${POS_COLOR_GRAD})`;
      }

      // Keep scale between 0.1 - 1
      if (!dotScale || dotScale > 1 || dotScale <= 0.1) {
        dotScale = 1;
      }

      // Calculate logo cell bounds
      let logoStartCell = -1;
      let logoStopCell = -1;
      if (logoSize && matrix.length) {
        const logoMargin = cellSize * 0.1;
        const logoCells = Math.ceil((logoSize + logoMargin) / cellSize);
        logoStartCell = Math.floor(sideCount / 2 - logoCells / 2);
        logoStopCell = sideCount - logoStartCell;
      }

      const { Svg, Defs, G, Rect, LinearGradient, Stop } = svgDom;
      return (
        <Svg
          viewBox={[
            -margin,
            -margin,
            size + margin * 2,
            size + margin * 2,
          ].join(" ")}
          width={size}
          height={size}
          ref={ref}
        >
          {/* Linear Gradient Definitions */}
          <Defs>
            {Boolean(
              colorGradient?.length && Array.isArray(colorGradientDirection)
            ) && (
              <LinearGradient
                id={COLOR_GRAD}
                x1={colorGradientDirection[0]}
                y1={colorGradientDirection[1]}
                x2={colorGradientDirection[2]}
                y2={colorGradientDirection[3]}
              >
                <Stop offset="0" stopColor={colorGradient[0]} stopOpacity="1" />
                <Stop offset="1" stopColor={colorGradient[1]} stopOpacity="1" />
              </LinearGradient>
            )}
            {Boolean(
              posColorGradient?.length &&
                Array.isArray(positionGradientDirection)
            ) && (
              <LinearGradient
                id={POS_COLOR_GRAD}
                x1={positionGradientDirection[0]}
                y1={positionGradientDirection[1]}
                x2={positionGradientDirection[2]}
                y2={positionGradientDirection[3]}
              >
                <Stop
                  offset="0"
                  stopColor={posColorGradient[0]}
                  stopOpacity="1"
                />
                <Stop
                  offset="1"
                  stopColor={posColorGradient[1]}
                  stopOpacity="1"
                />
              </LinearGradient>
            )}
          </Defs>

          {/* Background */}
          <G>
            <Rect
              x={-margin}
              y={-margin}
              width={size + margin * 2}
              height={size + margin * 2}
              fill={backgroundColor}
            />
          </G>

          {/* Placement patterns  */}
          <G>
            <PositionPattern
              placement="top-left"
              cellSize={cellSize}
              positionColor={positionColor}
              sideCount={sideCount}
              positionRadius={positionRadius}
              svgDom={svgDom}
            />
            <PositionPattern
              placement="top-right"
              cellSize={cellSize}
              positionColor={positionColor}
              sideCount={sideCount}
              positionRadius={positionRadius}
              svgDom={svgDom}
            />
            <PositionPattern
              placement="bottom-left"
              cellSize={cellSize}
              positionColor={positionColor}
              sideCount={sideCount}
              positionRadius={positionRadius}
              svgDom={svgDom}
            />
          </G>

          {/*  QRCode Data Dots */}
          <G>
            {matrix.map((rowData, row) =>
              rowData.map(
                (pixelValue, column) =>
                  Boolean(value) && (
                    <Dot
                      value={pixelValue}
                      row={row}
                      column={column}
                      cellSize={cellSize}
                      color={color as string}
                      logoStartCell={logoStartCell}
                      logoStopCell={logoStopCell}
                      sideCount={sideCount}
                      dotScale={dotScale || 1}
                      dotRadius={dotRadius || 0}
                      svgDom={svgDom}
                      key={`${row}-${column}`}
                    />
                  )
              )
            )}
          </G>

          {/* Logo */}
          {logo && logoSize && (
            <G>
              <Logo
                logo={logo}
                logoSize={logoSize}
                size={size}
                svgDom={svgDom}
              />
            </G>
          )}
        </Svg>
      );
    }
  )
);
