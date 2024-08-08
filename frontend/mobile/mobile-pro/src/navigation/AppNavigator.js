import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ArticleListScreen from "../screens/ArticleListScreen";
import ArticleDetailScreen from "../screens/ArticleDetailScreen";
import CreateArticleScreen from "../screens/CreateArticleScreen";
import EditArticleScreen from "../screens/EditArticleScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import AIArticleCreationScreen from "../screens/AIArticleCreationScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ArticleStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="ArticleList"
        component={ArticleListScreen}
        options={{ title: "Articles" }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: "Article Details" }}
      />
      <Stack.Screen
        name="CreateArticle"
        component={CreateArticleScreen}
        options={{ title: "Create Article" }}
      />
      <Stack.Screen
        name="EditArticle"
        component={EditArticleScreen}
        options={{ title: "Edit Article" }}
      />
    </Stack.Navigator>
  );
};

const MainTab = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Articles") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Articles"
        component={ArticleStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const RootNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Main" component={MainTab} />
    <Stack.Screen 
      name="AIArticleCreation" 
      component={AIArticleCreationScreen}
      options={{
        headerShown: true,
        title: "AI Article Creation"
      }}
    />
  </Stack.Navigator>
);

export default RootNavigator;