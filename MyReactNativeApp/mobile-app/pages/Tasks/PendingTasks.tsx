import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
    Modal,
    ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import Layout from "../../components/Layout";
import TaskDetailModal from "../../components/TaskDetailModal";

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

export default function PendingTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const isFocused = useIsFocused(); 

    const loadToken = async () => {
        const storedToken = await AsyncStorage.getItem("authToken");
        setToken(storedToken);
    };

    const fetchTasks = async () => {
        if (!token) return;

        try {
            const res = await axios.get("http://192.168.1.106:3001/user-task", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res);

            setTasks(res.data.tasks);
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };


    const openModal = (task: Task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High":
                return "#dc2626"; // red
            case "Medium":
                return "#f97316"; // orange
            case "Low":
            default:
                return "#16a34a"; // green
        }
    };

    useEffect(() => {
        loadToken();
    }, []);

    useEffect(() => {
        if (token && isFocused) fetchTasks();
    }, [token, isFocused]);

    return (
        <Layout >
            <View style={styles.container}>
                <Text style={styles.title}>Pending Tasks</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#BFA77A" />
                ) : (
                    <FlatList
                        data={tasks
                            .filter((task) => task.status !== "Done") 
                            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                </View>
                                <Text style={styles.cardText}>Due: {item.dueDate}</Text>
                                <Text style={styles.cardText}>Assigned to: {item.assignedTo}</Text>
                                <View
                                    style={[
                                        styles.priorityTag,
                                        { backgroundColor: getPriorityColor(item.priority) },
                                    ]}
                                >
                                    <Text style={styles.priorityText}>{item.priority}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}

                <TaskDetailModal
                    visible={modalVisible}
                    task={selectedTask}
                    loading={loading}
                    onClose={() => setModalVisible(false)}
                    onStatusUpdate={fetchTasks}
                />
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#f8fafc",
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 16,
        color: "#BFA77A",
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#BFA77A",
    },
    deleteText: {
        fontSize: 16,
        color: "red",
    },
    cardText: {
        fontSize: 12,
        color: "#4b5563",
    },
    priorityTag: {
        marginTop: 8,
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priorityText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        width: "100%",
        borderRadius: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#BFA77A",
        paddingVertical: 10,
        borderRadius: 8,
    },
    closeText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "600",
    },
});
