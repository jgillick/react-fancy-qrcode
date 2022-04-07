import QRCodeGenerator from "qrcode";
import { ErrorCorrection } from "./types";

export const generateDataMatrix = (
  value: string,
  errorCorrection: ErrorCorrection
): number[][] => {
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
};
