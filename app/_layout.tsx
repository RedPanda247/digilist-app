import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" /* backgroundColor={colors.background1} */ />
      <Stack>
        {/* Disable header */}
        <Stack.Screen 
          name="index" 
          options={{ 
            title: "DigiList",
            headerShown: false,
            
          }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
