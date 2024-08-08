import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const menuItems = [
    { title: 'View Articles', icon: 'list', screen: 'Articles', params: { screen: 'ArticleList' }, color: '#4CAF50' },
    { title: 'Create New Article', icon: 'add-circle', screen: 'Articles', params: { screen: 'CreateArticle' }, color: '#2196F3' },
    { title: 'My Profile', icon: 'person', screen: 'Profile', color: '#9C27B0' },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.title}
      style={[styles.menuItem, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate(item.screen, item.params)}
    >
      <Ionicons name={item.icon} size={32} color="#fff" />
      <Text style={styles.menuItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.colors.text }]}>NODE-PRO Mobile</Text>
        <Text style={[styles.subHeaderText, { color: theme.colors.text }]}>Manage your articles with ease</Text>
      </View>
      <View style={styles.menuGrid}>
        {menuItems.map(renderMenuItem)}
      </View>
      <Text style={[styles.footerText, { color: theme.colors.text }]}>© 2024 NODE-PRO Mobile</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    marginTop: 5,
  },
  menuGrid: {
    flex: 1,
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
  footerText: {
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomeScreen;