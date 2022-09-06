import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/Utils/locale/i18n';
import { Provider as StoreProvider } from 'react-redux';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { RootStack } from './src/Screens/Authentication/AuthStack';
import { ZoomVideoSdkProvider } from '@zoom/react-native-videosdk';

const App = () => {

  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'green' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1NumberOfLines={2}
        text1Style={{
          fontSize: 12,
          fontWeight: '400',
        }}
      />
    ),
    /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
    error: (props) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 12,
        }}
        text2Style={{
          fontSize: 10,
        }}
        text1NumberOfLines={2}
      />
    ),
    tomatoToast: ({ text1, props }) => (
      <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    ),
  };

  const Stack = createNativeStackNavigator();
  return (
    // <StoreProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <ZoomVideoSdkProvider
            config={{
              appGroupId: '{Your Apple Group ID here}',
              domain: 'zoom.us',
              enableLog: true,
              enableFullHD: true,
            }}>
            <RootStack />
          </ZoomVideoSdkProvider>
        </NavigationContainer>
        <Toast position={'bottom'} config={toastConfig} />
      </SafeAreaProvider>
    // </StoreProvider>
  );
};
export default App;
