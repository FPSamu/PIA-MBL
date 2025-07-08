import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: "Get Started"
        }} 
      />
      <Stack.Screen 
        name="welcome" 
        options={{ 
          headerShown: false,
          title: "Welcome"
        }} 
      />
    </Stack>
  );
}
