import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    TouchableOpacity,
    Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Navbar = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation<any>();

    const handleLogout = async () => {
        try {
          await AsyncStorage.removeItem("authToken"); 
        } catch (error) {
          console.error("Error removing token:", error);
        } finally {
          setMenuVisible(false);
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        }
      };

    const navigateToPendingTasks = () => {
        setMenuVisible(false);
        navigation.navigate("pending-tasks");
    };

    const navigateToCompletedTasks = () => {
        setMenuVisible(false);
        navigation.navigate("completed-tasks");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}>Task Management</Text>

                <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                    <Feather name="more-vertical" size={24} color="#BFA77A" />
                </TouchableOpacity>

                <Modal
                    transparent
                    animationType="fade"
                    visible={menuVisible}
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setMenuVisible(false)}
                    >
                        <View style={styles.menu}>
                            <TouchableOpacity onPress={navigateToPendingTasks} style={styles.menuItem}>
                                <Text style={styles.menuText}>Pending Tasks</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={navigateToCompletedTasks} style={styles.menuItem}>
                                <Text style={styles.menuText}>Completed Tasks</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                                <Text style={styles.menuText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
        height: 64,
        paddingHorizontal: 24,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#BFA77A",
        letterSpacing: 1,
    },
    menuButton: {
        padding: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        paddingTop: 70,
        paddingRight: 20,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    menu: {
        width: 150,
        backgroundColor: "#fff",
        borderRadius: 6,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 5,
    },
    menuItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    menuText: {
        fontSize: 16,
        color: "#333",
    },
});

export default Navbar;
