import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import QRCode from "react-fancy-qrcode";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <QRCode
        value={"https://github.com/jgillick/react-fancy-qrcode"}
        size={300}
        logo={require("./assets/fire.png")}
        dotRadius="50%"
        dotScale={0.8}
        positionRadius={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
