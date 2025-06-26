import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

// Placeholder for Pokémon logo (replace with actual asset if available)
const POKEMON_LOGO = {
  uri: "https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png",
};

const { width } = Dimensions.get("window");

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async () => {
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await register(email, password);
      // Redirection is handled by the root layout based on auth state change
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={POKEMON_LOGO} style={styles.logo} />
      <Text style={styles.title}>Register as Trainer</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#555"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#555"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#555"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Start Journey</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.switchText}>Already a trainer? Login</Text>
      </TouchableOpacity>
      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>Or register with:</Text>
        <View style={styles.badgeContainer}>
          <TouchableOpacity style={[styles.badge, styles.googleBadge]}>
            <Text style={styles.badgeText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.badge, styles.facebookBadge]}>
            <Text style={styles.badgeText}>Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgb(228, 227, 231)", // Light gray background as per theme
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 24,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "rgb(41, 39, 39)", // Dark text as per theme
    marginBottom: 24,
    textShadowColor: "rgb(206, 52, 58)", // Red shadow for Pokémon vibe
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  input: {
    width: "100%",
    padding: 14,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: "#FFF",
    borderColor: "rgb(41, 39, 39)", // Dark border as per theme
    borderWidth: 2,
    fontSize: 16,
    color: "rgb(41, 39, 39)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    width: "100%",
    padding: 16,
    backgroundColor: "rgb(206, 52, 58)", // Red button as per theme
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "rgb(41, 39, 39)",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  switchText: {
    marginTop: 18,
    color: "rgb(41, 39, 39)", // Dark text as per theme
    fontWeight: "600",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  socialContainer: {
    marginTop: 24,
    width: "100%",
    alignItems: "center",
  },
  socialText: {
    color: "rgb(41, 39, 39)",
    fontSize: 16,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  badge: {
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  googleBadge: {
    backgroundColor: "#EA4335", // Google red
    borderColor: "rgb(41, 39, 39)",
    borderWidth: 1,
  },
  facebookBadge: {
    backgroundColor: "#1877F2", // Facebook blue
    borderColor: "rgb(41, 39, 39)",
    borderWidth: 1,
  },
  badgeText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RegisterScreen;
