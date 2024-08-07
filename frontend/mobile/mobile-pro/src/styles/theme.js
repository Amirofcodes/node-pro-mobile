import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const commonStyles = {
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  textVariants: {
    header: {
      fontFamily: 'System',
      fontSize: 36,
      fontWeight: 'bold',
    },
    body: {
      fontFamily: 'System',
      fontSize: 16,
    },
  },
};

export const lightTheme = {
  ...DefaultTheme,
  ...commonStyles,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#000000',
    border: '#C7C7CC',
    notification: '#FF3B30',
    surface: '#FFFFFF',
    white: '#FFFFFF',
  },
};

export const darkTheme = {
  ...DarkTheme,
  ...commonStyles,
  colors: {
    ...DarkTheme.colors,
    primary: '#0A84FF',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#38383A',
    notification: '#FF453A',
    surface: '#1C1C1E',
    white: '#FFFFFF',
  },
};