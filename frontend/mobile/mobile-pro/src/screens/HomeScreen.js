import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const menuItems = [
    { title: 'View Articles', icon: 'list', screen: 'Articles', color: '#4CAF50' },
    { title: 'Create New Article', icon: 'add-circle', screen: 'CreateArticle', color: '#2196F3' },
    { title: 'Search Articles', icon: 'search', screen: 'Articles', color: '#FFC107' },
    { title: 'My Profile', icon: 'person', screen: 'Profile', color: '#9C27B0' },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.title}
      style={[styles.menuItem, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Ionicons name={item.icon} size={32} color="#fff" />
      <Text style={styles.menuItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      padding: 20,
      alignItems: 'center',
    },
    headerText: {
      color: theme.colors.white,
      fontSize: 24,
      fontWeight: 'bold',
    },
    subHeaderText: {
      color: theme.colors.white,
      fontSize: 16,
      marginTop: 5,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    menuGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    menuItem: {
      width: '48%',
      aspectRatio: 1,
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
    },
    menuItemText: {
      color: '#fff',
      marginTop: 10,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    footer: {
      padding: 20,
      alignItems: 'center',
    },
    footerText: {
      color: theme.colors.text,
      fontSize: 14,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to NODE-PRO Mobile</Text>
        <Text style={styles.subHeaderText}>Manage your articles with ease</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.menuGrid}>
          {menuItems.map(renderMenuItem)}
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 NODE-PRO Mobile</Text>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;