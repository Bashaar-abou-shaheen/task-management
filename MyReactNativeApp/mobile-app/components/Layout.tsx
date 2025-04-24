import React from "react";
import { View, StyleSheet } from "react-native";
import Navbar from "./Navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Navbar />
        <View style={styles.screenContent}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
  },
  mainContent: {
    flex: 1,
    flexDirection: "column",
  },
  screenContent: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
});

export default Layout;
