import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "./colors";

export default function RootLayout() {
  return (
    <>
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
    </>
  );
}
