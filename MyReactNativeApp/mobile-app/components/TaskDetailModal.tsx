import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    assignedTo: string;
    priority: "High" | "Medium" | "Low";
    status: "To Do" | "In Progress" | "Done";
    recurring: string;
    createdAt: string;
}

interface Props {
    visible: boolean;
    onClose: () => void;
    loading: boolean;
    task: Task | null;
    onStatusUpdate?: () => void;
}

const TaskDetailModal = ({ visible, onClose, loading, task, onStatusUpdate }: Props) => {
    const [updating, setUpdating] = useState(false);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High":
                return "#dc2626";
            case "Medium":
                return "#f97316";
            case "Low":
            default:
                return "#16a34a";
        }
    };

    const getNextStatus = (status: string) => {
        if (status === "To Do") return "In Progress";
        if (status === "In Progress") return "Done";
        return null;
    };

    const handleStatusUpdate = async () => {
        if (!task || task.status === "Done") return;

        const nextStatus = getNextStatus(task.status);
        if (!nextStatus) return;

        try {
            setUpdating(true);
            const token = await AsyncStorage.getItem("authToken");

            await axios.put(
                `http://192.168.1.106:3001/user-task/${task.id}/status`,
                { status: nextStatus },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            Alert.alert("Success", `Status updated to "${nextStatus}"`);
            onClose();
            onStatusUpdate?.();
        } catch (err) {
            Alert.alert("Error", "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    {loading || !task ? (
                        <View style={styles.loader}>
                            <ActivityIndicator size="large" color="#BFA77A" />
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                            <Text style={styles.title}>{task.title}</Text>
                            <Text style={styles.text}>{task.description}</Text>

                            <View style={styles.row}>
                                <Text style={styles.label}>Status:</Text>
                                <View style={[styles.tag, { backgroundColor: "#e0e7ff" }]}>
                                    <Text style={styles.tagText}>{task.status}</Text>
                                </View>
                                {task.status !== "Done" && (
                                    <TouchableOpacity onPress={handleStatusUpdate} disabled={updating}>
                                        <Feather
                                            name="arrow-right"
                                            size={20}
                                            color="#BFA77A"
                                            style={{ marginLeft: 8, opacity: updating ? 0.5 : 1 }}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Priority:</Text>
                                <View
                                    style={[
                                        styles.tag,
                                        { backgroundColor: getPriorityColor(task.priority) },
                                    ]}
                                >
                                    <Text style={styles.tagText}>{task.priority}</Text>
                                </View>
                            </View>

                            <Text style={styles.text}>Due: {task.dueDate}</Text>
                            <Text style={styles.text}>Recurring: {task.recurring}</Text>
                            <Text style={styles.text}>Assigned to: {task.assignedTo}</Text>
                            <Text style={styles.text}>Created at: {task.createdAt}</Text>

                            <TouchableOpacity style={styles.button} onPress={onClose}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        width: "100%",
        maxHeight: "85%",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#BFA77A",
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        color: "#333",
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        color: "#555",
        marginRight: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    tag: {
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    tagText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    button: {
        backgroundColor: "#BFA77A",
        padding: 14,
        borderRadius: 10,
        marginTop: 24,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 16,
    },
});

export default TaskDetailModal;
