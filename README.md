# QR Code Generator for React and React Native

Customizable QR code generated for React &amp; React Native.

(React support is a work in progress)

This was inspired by the [react-native-qrcode-svg](https://github.com/awesomejerry/react-native-qrcode-svg) and intended to provide more customization.

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
