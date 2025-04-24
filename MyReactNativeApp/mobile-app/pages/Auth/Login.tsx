import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation<any>();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }

        setLoading(true);
        try {
            const url = "http://192.168.1.106:3001/auth/login";
            const res = await axios.post(url, { email, password });

            const token = res.data?.token;
            if (token) {
                await AsyncStorage.setItem("authToken", token);
                Alert.alert("Success", "Login successful!");
                navigation.navigate("pending-tasks");
            } else {
                throw new Error("Token not found in response");
            }
        } catch (error: any) {
            Alert.alert(
                "Login Failed",
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                    Log in to your account to manage your tasks
                </Text>

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.passwordInput}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#6b7280" />
                    </TouchableOpacity>
                </View>


                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Log In</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.signupText}>
                    Don’t have an account?
                    <Text
                        style={styles.signupLink}
                        onPress={() => navigation.navigate("Signup")}
                    >
                        {" "}Sign up
                    </Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        marginBottom: 12,
        paddingRight: 12,
    },
    passwordInput: {
        flex: 1,
        height: 48,
        paddingHorizontal: 12,
    },
    eyeIcon: {
        paddingHorizontal: 4,
    },

    container: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
    },
    box: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 12,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 4,
    },
    subtitle: {
        textAlign: "center",
        color: "#6b7280",
        marginBottom: 16,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#BFA77A",
        height: 48,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    signupText: {
        textAlign: "center",
        marginTop: 16,
        color: "#6b7280",
    },
    signupLink: {
        color: "#BFA77A",
        fontWeight: "bold",
    },
});
