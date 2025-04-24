// App.tsx (React Native version)
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./pages/Auth/Login";
import SignupScreen from "./pages/Auth/Signup";
import PendingTasks from "./pages/Tasks/PendingTasks";
import CompletedTasks from "./pages/Tasks/CompletedTasks";

// Screens

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pending-tasks"
          component={PendingTasks}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="completed-tasks"
          component={CompletedTasks}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
