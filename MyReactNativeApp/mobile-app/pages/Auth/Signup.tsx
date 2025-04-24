import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
    ScrollView,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { KeyboardTypeOptions } from "react-native";

export default function SignupScreen() {
    const [form, setForm] = useState({
        name: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigation = useNavigation<any>();

    const handleChange = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (
            !form.name ||
            !form.userName ||
            !form.email ||
            !form.password ||
            !form.confirmPassword
        ) {
            return Alert.alert("Validation Error", "Please fill all fields");
        }

        if (form.password !== form.confirmPassword) {
            return Alert.alert("Validation Error", "Passwords do not match");
        }

        setLoading(true);
        try {
            const res = await axios.put("http://192.168.1.106:3001/auth/signup", form);

            const token = res.data?.token;
            if (token) {
                await AsyncStorage.setItem("authToken", token);
                Alert.alert("Success", "Signup successful!");
                navigation.navigate("pending-tasks");
            } else {
                throw new Error("Token not found in response");
            }
        } catch (error: any) {
            Alert.alert(
                "Signup Failed",
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.box}>
                <View style={styles.header}>
                    <Text style={styles.title}>Sign Up</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    </TouchableOpacity>
                </View>

                {[
                    { name: "name", placeholder: "Name" },
                    { name: "userName", placeholder: "Username" },
                    { name: "email", placeholder: "Email", keyboardType: "email-address"  as KeyboardTypeOptions },
                ].map((field) => (
                    <TextInput
                        key={field.name}
                        placeholder={field.placeholder}
                        value={form[field.name as keyof typeof form]}
                        onChangeText={(text) => handleChange(field.name as keyof typeof form, text)}
                        style={styles.input}
                        keyboardType={field.keyboardType || "default"}
                        autoCapitalize="none"
                    />
                ))}

                {/* Password Field */}
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Password"
                        value={form.password}
                        onChangeText={(text) => handleChange("password", text)}
                        style={styles.passwordInput}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#6b7280" />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password Field */}
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Re-enter Password"
                        value={form.confirmPassword}
                        onChangeText={(text) => handleChange("confirmPassword", text)}
                        style={styles.passwordInput}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                        <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#6b7280" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
                </TouchableOpacity>

                <Text style={styles.signupText}>
                    Already have an account?
                    <Text style={styles.signupLink} onPress={() => navigation.navigate("Login")}>
                        {" "}Sign in
                    </Text>
                </Text>
            </View>
        </ScrollView>
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
        flexGrow: 1,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 24,
    },
    box: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 12,
        elevation: 4,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    loginLink: {
        fontSize: 14,
        color: "#BFA77A",
        fontWeight: "600",
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
