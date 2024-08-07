import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../styles/theme';

export const useDarkMode = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  return { isDarkMode, theme };
};