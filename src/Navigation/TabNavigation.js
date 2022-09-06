import * as React from 'react';

import { Image, ImageBackground, Platform, StyleSheet } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import CareerPassportStack from '../Screens/CareerPassport/CareerPassportStack';
import DashboardStack from '../Screens/Dashboard/DashboardStack';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from '../Utils/Icons';
import Images from '../Utils/Images';
import LandingStack from '../Screens/LandingPages/LandingStack';
import LiveCounsellingStack from '../Screens/LiveCounselling/LiveCounsellingStack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileBuilderStack from '../Screens/ProfileBuilder/ProfileBuilderStack';
import StudyAbroad from '../Screens/StudyAbroad/StudyAbroad';
import StudyAbroadStack from '../Screens/StudyAbroad/studyAbroadStack';

const Home = createNativeStackNavigator();
const CarrierExplorer = createNativeStackNavigator();
const LiveCounselling = createNativeStackNavigator();
const CarrierPassport = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

export default function TabNavigation({ route }) {
  return (
    <Tab.Navigator
      initialRouteName={'HomeTab'}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height:
            Platform.OS === 'ios'
              ? heightPercentageToDP('12%')
              : heightPercentageToDP('7%'),
          width: '100%',
          paddingTop:
            Platform.OS === 'android'
              ? heightPercentageToDP('0.5%')
              : heightPercentageToDP('3%'),
          // alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarActiveTintColor: '#5E50FF',
        tabBarInactiveTintColor: '#25164B',
        tabBarStyle: { backgroundColor: '#FEF9F9' },
      }}>
      <Tab.Screen
        name='HomeTab'
        component={LandingStack}
        initialParams={{ addNewChild: route?.params?.addNewChild }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{
                width: widthPercentageToDP('4%'),
                height: widthPercentageToDP('4%'),
                alignSelf: 'center',
                tintColor: color,
              }}
              source={Icons.home}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Career Explorer'
        component={DashboardStack}
        options={{
          tabBarLabel: 'Career Explorer',
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{
                width: widthPercentageToDP('4%'),
                height: widthPercentageToDP('4%'),
                alignSelf: 'center',
                tintColor: color,
              }}
              source={Icons.careers}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Live Counselling'
        component={LiveCounsellingStack}
        options={{
          tabBarLabel: 'Live Counselling',
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{
                width: widthPercentageToDP('4%'),
                height: widthPercentageToDP('4%'),
                alignSelf: 'center',
                tintColor: color,
              }}
              source={Icons.counselling}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name='Career Passport'
        component={ProfileBuilderStack}
        options={{
          tabBarLabel: 'Career Passport',
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{
                width: widthPercentageToDP('4%'),
                height: widthPercentageToDP('4%'),
                alignSelf: 'center',
                tintColor: color,
              }}
              source={Icons.study_abroad}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name='StudyAbroad'
        component={StudyAbroadStack}
        options={{
          tabBarLabel: 'Study Abroad',
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{
                width: widthPercentageToDP('4%'),
                height: widthPercentageToDP('4%'),
                alignSelf: 'center',
                tintColor: color,
              }}
              source={Icons.study_abroad}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  AvtarBox: {
    width: widthPercentageToDP('10%'),
    height: widthPercentageToDP('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
