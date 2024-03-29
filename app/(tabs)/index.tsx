import { router } from "expo-router";
import { StyleSheet, View, Text, Button } from "react-native";
import { Switch } from '@gluestack-ui/themed';
import { useUserStore } from "@/store/userStore";

export default function TabOneScreen() {
  const user = useUserStore((state) => state.user);
  console.log(user);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      
      <Switch size="md" isDisabled={user?.activeForDonation}  />
      
      <View style={styles.separator} />
      <Button title="Login" onPress={() => router.push("/auth/register")} />
      <Button
        title="Go to new user"
        onPress={() => router.push("/auth/new-user/newUser")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
