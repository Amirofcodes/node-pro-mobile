import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ArticleListScreen from '../screens/ArticleListScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import CreateArticleScreen from '../screens/CreateArticleScreen';
import EditArticleScreen from '../screens/EditArticleScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="ArticleList"
          component={ArticleListScreen}
          options={{ title: 'Articles' }}
        />
        <Stack.Screen
          name="ArticleDetail"
          component={ArticleDetailScreen}
          options={{ title: 'Article Details' }}
        />
        <Stack.Screen
          name="CreateArticle"
          component={CreateArticleScreen}
          options={{ title: 'Create Article' }}
        />
        <Stack.Screen
          name="EditArticle"
          component={EditArticleScreen}
          options={{ title: 'Edit Article' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;