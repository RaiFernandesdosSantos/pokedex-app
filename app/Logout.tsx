import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const LogoutScreen = () => {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      router.replace("/login");
    };
    performLogout();
  }, [logout, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(228, 227, 231)", // Light gray background as per theme
  },
  text: {
    fontSize: 18,
    color: "rgb(41, 39, 39)", // Dark text as per theme
    fontWeight: "bold",
  },
});

export default LogoutScreen;
