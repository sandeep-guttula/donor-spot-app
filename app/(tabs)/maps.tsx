import { View, Text, StyleSheet } from "react-native";
import React from "react";

const maps = () => {
  return (
    <View>
      <Text>Map</Text>
    </View>
  );
};

export default maps;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: 300,
    width: 300,
  },
  map: {
    flex: 1,
  },
});
