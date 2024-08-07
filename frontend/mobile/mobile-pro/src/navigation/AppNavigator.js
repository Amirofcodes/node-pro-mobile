import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ArticleListScreen from '../screens/ArticleListScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import CreateArticleScreen from '../screens/CreateArticleScreen';
import EditArticleScreen from '../screens/EditArticleScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ArticleStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ArticleList" component={ArticleListScreen} options={{ title: 'Articles' }} />
    <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
    <Stack.Screen name="CreateArticle" component={CreateArticleScreen} />
    <Stack.Screen name="EditArticle" component={EditArticleScreen} />
  </Stack.Navigator>
);

const MainTab = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Articles') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Articles" component={ArticleStack} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const RootNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Main" component={MainTab} />
  </Stack.Navigator>
);

export default RootNavigator;