import QRCode from "react-fancy-qrcode";
import fire from "./fire.png";
import "./App.css";

function App() {
  return (
    <div className="App">
      <QRCode
        value={"https://github.com/jgillick/react-fancy-qrcode"}
        size={300}
        dotRadius="50%"
        dotScale={0.8}
        positionRadius={10}
        logo={fire}
      />
    </div>
  );
}

export default App;
