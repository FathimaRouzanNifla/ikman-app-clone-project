import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
  name="listings/[categoryId]"
  options={{
    title: "Listings",
    headerShown: true,
    headerStyle: { backgroundColor: "#6A11CB" }, headerTintColor: "#fff",
    
   
  }}
/>

      <Stack.Screen name="listings/details/[id]" options={{ title: "Details", headerShown: false }} />
      
      <Stack.Screen name="settings/update" options={{ title: "Update Profile",presentation: "modal", headerShown: false,}}/>
      <Stack.Screen name="auth/login" options={{ title: "login", headerShown: false }} />
      <Stack.Screen name="auth/forgot-password" options={{ title: "forgot password", headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ title: "register", headerShown: false }} />
      <Stack.Screen name="favorites/index" options={{ title: "index", headerShown: false }} />
      <Stack.Screen name="chat/[chatId]" options={{ title: "chatid", headerShown: false }} />
      <Stack.Screen name="chat/list" options={{ title: "chatid", headerShown: false }} />
      <Stack.Screen name="create-listing/details-form" options={{ title: "form", headerShown: false }} />
    </Stack>
  );
}
