import { store } from "@/store/store";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import "../global.css";

const _layout = () => {
  return (
    <SafeAreaView className="flex-1">
      <Provider store={store}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="index"
          />
        </Stack>
      </Provider>
    </SafeAreaView>
  );
};

export default _layout;
