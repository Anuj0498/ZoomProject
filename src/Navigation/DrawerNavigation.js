import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerHeaderProps,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import React, { useCallback, useEffect, useState } from 'react';
import {
  getFocusedRouteNameFromRoute,
  useFocusEffect,
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {
  getSessionDetailsZoom,
  getSessionTokenForZoom,
} from '../redux/reducer/liveCounsellingReducer/liveCounsellingReducer';
import {
  parentUserInfo,
  useAuth,
  userInformation,
} from '../redux/reducer/auth/AuthReducer';
import { useDispatch, useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth } from 'aws-amplify';
import CallScreen from '../Screens/zoom/CallScreen/CallScreen';
import ForgotPin from '../Screens/Authentication/Forgot/ForgotPin/ForgotPin';
import Icons from '../Utils/Icons';
import Images from '../Utils/Images';
import IntroScreen from '../Screens/zoom/IntroScreen/IntroScreen';
import JoinScreen from '../Screens/zoom/JoinScreen/JoinScreen';
import LinearGradient from 'react-native-linear-gradient';
import MyProfiles from '../Screens/Authentication/VerifyOtp/MyProfiles';
import SetNewPin from '../Screens/Authentication/Forgot/ForgotPin/SetNewPin';
import TabNavigation from './TabNavigation';
import Theme from '../Utils/Theme';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScheduleSessionDetail from '../Screens/LiveCounselling/ScheduleSessionDetails/SessionDetails';
import Discovery from '../Screens/LiveCounselling/DiscoveryAndExploration/Discovery';
import CareerDetail from '../Screens/LandingPages/CareerDetails/CareerDetails';
import ScheduleSession from '../Screens/LiveCounselling/ScheduleSession/ScheduleSession';
import BuyPackageStack from '../Screens/BuyPackage/BuyPackageStack';
import { getPremiumStatus } from '../redux/reducer/home/HomeReducers';

export default function DrawerNavigation() {
  const dispatch = useDispatch();
  const Drawer = createDrawerNavigator();
  const w = Dimensions.get('window').width;
  const [isPinExist, setIsPinExist] = useState(false);
  const [route, setRoute] = useState();
  const navigation = useNavigation();
  const { getUserDiagnosticCompletionState, getStatus } = useSelector(
    (state) => state?.home
  );
  const { userInformationState, parentData } = useSelector(
    (state) => state?.auth
  );
  const { parentChildList } = useSelector((state) => state?.account);
  const [userDetails, setUserDetails] = useState();
  const [childHash, setChildHash] = useState();

  useEffect(() => {
    const getPin = async () => {
      const pin = await AsyncStorage.getItem('PinInfo');
      const pin_done = await AsyncStorage.getItem('PIN_DONE');
      if (pin === null && pin_done === null) {
        navigation.navigate('TabNavigation');
      } else {
        navigation.navigate('MyProfiles');
      }
    };
    getPin();
  }, []);

  useEffect(() => {
    const getName = async () => {
      const data = await AsyncStorage.getItem('UserInfo');
      const parseData = JSON.parse(data);
      const payload = {
        userEmail: parseData?.userEmail,
        userFirstName: parseData?.userFirstName,
        userLastName: parseData?.userLastName,
        hash: parseData?.hash,
      };
      // alert(JSON.stringify(, null, 5));

      dispatch(userInformation(payload));
    };
    getName();
  }, [getStatus]);

  useEffect(() => {
    const getParentName = async () => {
      const data = await AsyncStorage.getItem('ParentData');
      const parseData = JSON.parse(data);
      const payload = {
        userEmail: parseData?.userEmail,
        userFirstName: parseData?.userFirstName,
        userLastName: parseData?.userLastName,
      };
      dispatch(parentUserInfo(payload));
    };
    getParentName();
  }, []);

  function CustomDrawerContent(props) {
    const width = useWindowDimensions().width * 0.5;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [route, setRoute] = useState('');
    const [roomName, setRoomName] = useState('');
    const [roomPassword, setRoomPassword] = useState('');
    const [webHook, setWebHook] = useState('');
    const [name, setName] = useState();
    const [lastName, setLastName] = useState();
    const [currentProgressStatus, setCurrentProgressStatus] = useState(0);

    useEffect(() => {
      const getRoute = () => {
        const { state } = props;
        const { routes, index } = state;
        const focusedRoute = routes[index]?.name;
        setRoute(focusedRoute);
      };
      getRoute();
    }, []);

    const logout = async () => {
      try {
        await AsyncStorage.clear();
        await Auth.signOut();
        dispatch(useAuth(false));
      } catch (error) {
        console.log('error signing out: ', error);
      }
    };

    useEffect(() => {
      dispatch(getSessionDetailsZoom()).then((res) => {
        let roomName =
          res?.payload?.data?.SessionData[0]?.RoomName?.split('/')[1];
        let roomPassword =
          res?.payload?.data?.SessionData[0]?.RoomName.split('/')[2];
        setRoomPassword(roomPassword);
        setRoomName(roomName);
        const body = {
          roomName: res?.payload?.data?.SessionData[0]?.RoomName?.split('/')[1],
          roomPassword:
            res?.payload?.data?.SessionData[0]?.RoomName.split('/')[2],
        };
        dispatch(getSessionTokenForZoom(body)).then((res) => {
          setWebHook(res?.payload?.data?.JWT);
        });
      });
    }, []);

    useEffect(() => {
      if (getUserDiagnosticCompletionState) {
        setCurrentProgressStatus(
          getUserDiagnosticCompletionState?.data?.detail?.data?.PROGRESS
        );
      }
    }, [getUserDiagnosticCompletionState]);

    const headerFirstName = () => {
      if (
        route === 'MyProfiles' ||
        route === 'ForgotPin' ||
        route === 'SetNewPin'
      ) {
        return `${parentData?.userFirstName}`;
      } else {
        return `${userInformationState?.userFirstName}`;
      }
    };

    const headerLastName = () => {
      if (
        route === 'MyProfiles' ||
        route === 'ForgotPin' ||
        route === 'SetNewPin'
      ) {
        return `${parentData?.userLastName}`;
      } else {
        return `${userInformationState?.userLastName}`;
      }
    };

    const returnValue = () => {
      if (getStatus?.data?.detail?.data?.isPremium == true) {
        return 'Explore';
      } else {
        return 'Unlock';
      }
    };
    return (
      <DrawerContentScrollView {...props}>
        <KeyboardAvoidingView style={styles.menuContainer}>
          <View style={styles.menuItemsCard}>
            <View>
              <Text style={styles.headerName}>{headerFirstName()}</Text>
            </View>
            <View>
              <Text style={styles.headerSubName}>{headerLastName()}</Text>
            </View>
          </View>
          <LinearGradient
            colors={['rgb(246,237,215)', '#f8f9fa']}
            start={{ x: 0, y: 0.8 }}
            end={{ x: 1, y: 0.8 }}>
            <DrawerItem
              icon={({ focused, color, size }) => (
                <Image source={Icons.diamond} style={styles.imageIcon} />
              )}
              label={`${returnValue()} Premium`}
              labelStyle={[
                styles.labelStyle,
                { fontWeight: '700', color: 'rgb(199,153,23)', fontSize: 16 },
              ]}
              // onPress={() => {
              //   props.navigation.reset({
              //     index: 0,
              //     routes: [{ name: 'MyProfiles' }],
              //   });
              // }}
            />
          </LinearGradient>
          {route !== 'MyProfiles' &&
            route !== 'ForgotPin' &&
            route !== 'SetNewPin' &&
            parentChildList?.data?.detail?.data.length > 0 && (
              <View>
                <DrawerItem
                  icon={({ focused, color, size }) => (
                    <Image
                      source={Icons.switch_profile}
                      style={styles.imageIcon}
                    />
                  )}
                  label='Switch Profile'
                  labelStyle={styles.labelStyle}
                  onPress={() => {
                    props.navigation.reset({
                      index: 0,
                      routes: [{ name: 'MyProfiles' }],
                    });
                  }}
                />
              </View>
            )}
          <View style={styles.DrawerItemContainer}>
            {route !== 'MyProfiles' &&
              route !== 'ForgotPin' &&
              route !== 'SetNewPin' &&
              getUserDiagnosticCompletionState?.data?.detail?.data?.PROGRESS >
                0 &&
              getUserDiagnosticCompletionState?.data?.detail?.data?.SECTION
                ?.BEHAVIOUR === 'Y' && (
                <View style={{ width: '90%' }}>
                  <DrawerItem
                    icon={({ focused, color, size }) => (
                      <Image
                        source={Icons.personality_animal}
                        style={styles.imageIcon}
                      />
                    )}
                    label='Personality Animal'
                    labelStyle={styles.labelStyle}
                    onPress={() => {
                      if (route === 'MyProfiles') {
                        props.navigation.navigate('TabNavigation', {
                          screen: 'HomeTab',
                          params: {
                            screen: 'Home',
                          },
                        });
                      } else {
                        props.navigation.navigate('PersonalityAnimal');
                      }
                    }}
                  />
                </View>
              )}
          </View>
          {currentProgressStatus >= 1 &&
          route !== 'MyProfiles' &&
          route !== 'ForgotPin' &&
          route !== 'SetNewPin' ? (
            <View>
              <DrawerItem
                icon={({ focused, color, size }) => (
                  <AntDesign name='heart' size={22} color='black' />
                )}
                label='Favourites'
                labelStyle={styles.labelStyle}
                onPress={() => {
                  if (
                    route === 'MyProfiles' ||
                    route === 'ForgotPin' ||
                    route === 'SetNewPin'
                  ) {
                    props.navigation.navigate('TabNavigation', {
                      screen: 'HomeTab',
                      params: {
                        screen: 'Favourite',
                      },
                    });
                  } else {
                    props.navigation.navigate('Favourite');
                  }
                }}
              />
            </View>
          ) : null}

          {!userInformationState?.hash &&
          route !== 'MyProfiles' &&
          route !== 'ForgotPin' &&
          route !== 'SetNewPin' ? (
            <View>
              <DrawerItem
                icon={({ focused, color, size }) => (
                  <Image source={Icons.my_dossier} style={styles.imageIcon} />
                )}
                label='My Dossier'
                labelStyle={styles.labelStyle}
                onPress={() => {
                  if (
                    route === 'MyProfiles' ||
                    route === 'ForgotPin' ||
                    route === 'SetNewPin'
                  ) {
                    props.navigation.navigate('TabNavigation', {
                      screen: 'HomeTab',
                      params: {
                        screen: 'MyDossierStack',
                      },
                    });
                  } else {
                    props.navigation.navigate('MyDossierStack');
                  }
                }}
              />
            </View>
          ) : null}

          {!userInformationState?.hash &&
          route !== 'MyProfiles' &&
          route !== 'ForgotPin' &&
          route !== 'SetNewPin' ? (
            <View>
              <DrawerItem
                icon={({ focused, color, size }) => (
                  <Image
                    source={Icons.assign_packages}
                    style={styles.imageIcon}
                  />
                )}
                label='Assign Packages'
                labelStyle={styles.labelStyle}
                onPress={() => {
                  if (
                    route === 'MyProfiles' ||
                    route === 'ForgotPin' ||
                    route === 'SetNewPin'
                  ) {
                    props.navigation.navigate('TabNavigation', {
                      screen: 'HomeTab',
                      params: {
                        screen: 'Home',
                      },
                    });
                  } else {
                    props.navigation.navigate('AssignPackages');
                  }
                }}
              />
            </View>
          ) : null}

          {!userInformationState?.hash &&
          route !== 'MyProfiles' &&
          route !== 'ForgotPin' &&
          route !== 'SetNewPin' ? (
            <View>
              <DrawerItem
                icon={({ focused, color, size }) => (
                  <Image
                    source={Icons.manage_c_profile}
                    style={styles.imageIcon}
                  />
                )}
                label='Manage Child Profiles'
                labelStyle={styles.labelStyle}
                onPress={() => {
                  if (
                    route === 'MyProfiles' ||
                    route === 'ForgotPin' ||
                    route === 'SetNewPin'
                  ) {
                    props.navigation.navigate('TabNavigation', {
                      screen: 'HomeTab',
                      params: {
                        screen: 'Home',
                      },
                    });
                  } else {
                    props.navigation.navigate('ManageProfile');
                  }
                }}
              />
            </View>
          ) : null}

          {userInformationState?.hash &&
          route !== 'MyProfiles' &&
          route !== 'ForgotPin' &&
          route !== 'SetNewPin' ? (
            <View>
              <DrawerItem
                icon={({ focused, color, size }) => (
                  <Image
                    source={Icons.manage_c_profile}
                    style={styles.imageIcon}
                  />
                )}
                label='Your Profile'
                labelStyle={styles.labelStyle}
                onPress={() => {
                  if (
                    route === 'MyProfiles' ||
                    route === 'ForgotPin' ||
                    route === 'SetNewPin'
                  ) {
                    props.navigation.navigate('TabNavigation', {
                      screen: 'HomeTab',
                      params: {
                        screen: 'Home',
                      },
                    });
                  } else {
                    props.navigation.navigate('AccountSettings');
                  }
                }}
              />
            </View>
          ) : null}

          {!userInformationState?.hash &&
          route !== 'MyProfiles' &&
          route !== 'ForgotPin' &&
          route !== 'SetNewPin' ? (
            <View>
              <DrawerItem
                icon={({ focused, color, size }) => (
                  <Image
                    source={Icons.account_settings}
                    style={styles.imageIcon}
                  />
                )}
                label='Account Settings'
                labelStyle={styles.labelStyle}
                onPress={() => {
                  if (
                    route === 'MyProfiles' ||
                    route === 'ForgotPin' ||
                    route === 'SetNewPin'
                  ) {
                    props.navigation.navigate('TabNavigation', {
                      screen: 'HomeTab',
                      params: {
                        screen: 'Home',
                      },
                    });
                  } else {
                    props.navigation.navigate('AccountSettings');
                  }
                }}
              />
            </View>
          ) : null}

          <View>
            <DrawerItem
              icon={({ focused, color, size }) => (
                <Image source={Icons.logout} style={styles.imageIcon} />
              )}
              label='Log out'
              labelStyle={styles.labelStyle}
              onPress={() => {
                logout();
              }}
            />
          </View>
          <View>
            <DrawerItem
              icon={({ focused, color, size }) => (
                <Image source={Images.zoomVideo} style={styles.imageIcon} />
              )}
              label='Zoom Testing'
              labelStyle={styles.labelStyle}
              onPress={() => {
                roomName != '' &&
                  webHook != '' &&
                  props.navigation.navigate('IntroScreen', {
                    sessionName: roomName,
                    displayName: userInformationState?.userFirstName,
                    sessionPassword: roomPassword,
                    roleType: '1',
                    sessionIdleTimeoutMins: '40',
                    webHook: webHook,
                  });
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(222, 217, 217, 0.3)',
              height: 2,
              width: '80%',
              margin: 16,
              alignSelf: 'center',
            }}></View>
        </KeyboardAvoidingView>
      </DrawerContentScrollView>
    );
  }

  const HeaderImage = () => {
    return (
      <Image
        style={{
          marginRight: 15,
          width: widthPercentageToDP('11%'),
          height: widthPercentageToDP('11%'),
          marginBottom: 5,
        }}
        source={Icons.circle_male}
      />
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'front',
        headerShown: true,
        headerTitle: '',
        headerRight: () => <HeaderImage />,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name='MyProfiles' component={MyProfiles} />
      <Drawer.Screen name='ForgotPin' component={ForgotPin} />
      <Drawer.Screen name='Discovery' component={Discovery} />
      <Drawer.Screen name='CareerDetail' component={CareerDetail} />
      <Drawer.Screen name='ScheduleSession' component={ScheduleSession} />
      <Drawer.Screen name='SetNewPin' component={SetNewPin} />
      <Drawer.Screen
        name='IntroScreen'
        component={IntroScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name='CallScreen'
        component={CallScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name='JoinScreen'
        component={JoinScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen name='TabNavigation' component={TabNavigation} />
      <Drawer.Screen name='BuyPackageStack' component={BuyPackageStack} />
    </Drawer.Navigator>
  );
}
const styles = StyleSheet.create({
  DrawerItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: '5%',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  menuItemsCard: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    paddingVertical: 20,
    marginStart: 20,
  },
  headerName: {
    fontSize: 22,
    color: 'rgba(37, 22, 75, 1)',
    fontWeight: '700',
  },
  headerSubName: {
    fontSize: 16,
    color: 'rgba(37, 22, 75, 1)',
    fontWeight: '400',
  },
  imageContainer: {
    flex: 0.4,
    borderColor: '#512E8A',
    borderWidth: 1,
    borderRadius: 200,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  image: {
    resizeMode: 'contain',
    aspectRatio: 1, // Your aspect ratio
  },
  imageIcon: {
    height: 22,
    width: 22,
  },
  PathIcon: {
    height: 20,
    width: 8,
  },
  labelStyle: {
    color: 'rgba(37, 22, 75, 1)',
    fontSize: 13,
    fontWeight: '400',
    marginStart: -16,
  },
});
