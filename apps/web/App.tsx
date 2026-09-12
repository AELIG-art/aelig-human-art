import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>HumanArt</Text>
        <Text style={styles.title}>Physical art, durable evidence.</Text>
        <Text style={styles.copy}>
          The artist activation and collector verification flows will live here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f5f0e7",
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 28,
  },
  eyebrow: {
    color: "#9b3d22",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    color: "#1d2925",
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: -1.6,
    lineHeight: 47,
    marginTop: 12,
  },
  copy: {
    color: "#4d5853",
    fontSize: 17,
    lineHeight: 26,
    marginTop: 16,
  },
});
