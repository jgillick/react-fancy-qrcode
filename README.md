# QR Code Generator for React and React Native

Customizable QR code generated for React &amp; React Native.

(React support is a work in progress)

This was inspired by the [react-native-qrcode-svg](https://github.com/awesomejerry/react-native-qrcode-svg) and intended to provide more customization.

## Install

With Yarn

```bash
yarn add react-fancy-qrcode
```

Or with npm

```bash
npm install -S react-fancy-qrcode
```

## Example

```jsx
<QRCode
  value={"https://github.com/jgillick/react-fancy-qrcode"}
  size={400}
  dotScale={0.9}
  dotRadius="50%"
  positionRadius={["5%", "1%"]}
  errorCorrection="H"
  logo={require("images/Telegram_logo.png")}
/>
```

<img src="./example.png" width="400">

## Saving QR Code Image

You can use the react ref to download the image data from the QR code SVG.

```jsx
import React, { useCallback, useRef } from 'react';
import QRCode, { QRCodeRef } from 'react-fancy-qrcode';

function RenderQRCode() {

  const svgRef = useRef<QRCodeRef>();
  const download = useCallback(() => {
    svgRef.current?.toDataURL((data) => {
      console.log(data);
    })
  }, [svgRef.current])

  return (
    <QRCode
      ref={svgRef}
      value={"https://github.com/jgillick/react-fancy-qrcode"}
      size={400}
    />
  )
}

```
