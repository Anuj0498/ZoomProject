import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CallScreen from '../zoom/CallScreen/CallScreen';
import IntroScreen from '../zoom/IntroScreen/IntroScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export const RootStack = () => {
  const MainStack = createNativeStackNavigator();

  const ZoomStack = () => {
    return (
      <MainStack.Navigator
        initialRouteName='IntroScreen'
        screenOptions={{
          headerShown: false,
        }}>
        <MainStack.Screen name='IntroScreen' component={IntroScreen} />
        <MainStack.Screen name='CallScreen' component={CallScreen} />
      </MainStack.Navigator>
    );
  };

  return (
    <MainStack.Navigator
      headerMode='none'
      screenOptions={{
        headerShown: false,
      }}>
      <>
        <MainStack.Screen
          name='ZoomStack'
          component={ZoomStack}
        />
      </>
    </MainStack.Navigator>
  );
};
