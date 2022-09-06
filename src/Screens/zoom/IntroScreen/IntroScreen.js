import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  checkMultiple,
  openSettings,
  requestMultiple,
} from 'react-native-permissions';
import React, { useEffect, useRef, useState } from 'react';

import Theme from '../../../Utils/Theme';
import Images from '../../../Utils/Images';
import { useIsFocused } from '@react-navigation/native';
import config from '../../../config/config';

const IntroScreen = ({ navigation, route }) => {
  const [notGranted, setNotGranted] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const focus = useIsFocused();

  // TODO: Enable photo library permission when sharing view is done.
  const platformPermissions = {
    ios: [
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.MICROPHONE,
      //PERMISSIONS.IOS.PHOTO_LIBRARY,
    ],
    android: [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      //PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ],
  };

  useEffect(() => {
    setRoomName(config.roomName);
    setRoomPassword(config.roomPassword);
  }, []);

  useEffect(() => {
    focus &&
      (async () => {
        if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
          return;
        }

        const permissions = platformPermissions[Platform.OS];
        let blockedAny = false;
        let notGranted = [];

        checkMultiple(permissions).then((statuses, PermissionStatus) => {
          permissions.map((p) => {
            const status = statuses[p];
            if (status === RESULTS.BLOCKED) {
              blockedAny = true;
            } else if (status !== RESULTS.GRANTED) {
              notGranted.push(p);
            }
          });
          notGranted.length && requestMultiple(notGranted);
          blockedAny && openSettings();
        });
      })();
  }, [focus]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <View style={styles.headingContainer}>
          <Text style={styles.Heading}>Welcome</Text>
          <Text style={styles.subHeading}>
            Please check your camera and audio settings.
          </Text>
        </View>
        <View style={styles.imgContainer}>
          <Image
            source={Images.counselorImg}
            resizeMode='contain'
            style={styles.img}
          />
          <View style={styles.joinedContainer}>
            <Image
              source={
                !notGranted.includes('android.permission.CAMERA')
                  ? Images.greenTick
                  : Images.crossIcon
              }
              resizeMode='contain'
            />
            <Text style={styles.joinText}>Camera</Text>
          </View>

          <View style={styles.joinedContainer}>
            <Image
              source={
                !notGranted.includes('android.permission.RECORD_AUDIO')
                  ? Images.greenTick
                  : Images.crossIcon
              }
              resizeMode='contain'
            />
            <Text style={styles.joinText}>Microphone</Text>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            disabled={notGranted.length > 0}
            style={styles.testBtn}
            onPress={() => {
              roomName != '' && 
                roomPassword != ''
                navigation.navigate('CallScreen', {
                  sessionName: roomName,
                  displayName: "demo",
                  sessionPassword: roomPassword,
                  roleType: '1',
                  sessionIdleTimeoutMins: '40',
                });
            }}>
            <Text style={styles.testText}>Join</Text>
          </TouchableOpacity>

          {/* <Text style={styles.sessionTime}>Your Session is starting in</Text>
          <Text style={styles.timeText}>10:00 Mins</Text> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(67, 13, 155, 1)',
  },
  scrollview: {
    flex: 1,
  },
  headingContainer: {
    alignItems: 'center',
    paddingVertical: Theme.hp('5%'),
  },
  Heading: {
    color: '#fff',
    fontSize: Theme.txtLarge1,
  },
  subHeading: {
    color: '#fff',
    fontSize: Theme.txtMedium,
    paddingTop: 7,
  },
  imgContainer: {
    alignItems: 'center',
  },
  img: {
    width: Theme.wp('95%'),
    height: Theme.hp('30%'),
  },
  joinedContainer: {
    width: Theme.wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '2%',
  },
  joinText: {
    paddingLeft: Theme.wp('2%'),
    letterSpacing: 0.7,
    color: '#fff',
  },
  btnContainer: {
    alignItems: 'center',
    marginTop: Theme.hp('15%'),
  },
  testBtn: {
    backgroundColor: 'rgba(148, 164, 55, 1)',
    borderRadius: 12,
    width: Theme.wp('22%'),
    height: Theme.hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  testText: {
    color: '#fff',
    fontWeight: '600',
  },
  sessionTime: {
    color: '#fff',
    paddingTop: Theme.hp('2%'),
    fontSize: Theme.txtMedium1,
  },
  timeText: {
    color: 'rgba(235, 199, 74, 1)',
    fontSize: Theme.txtMedium1,
    letterSpacing: 0.5,
    paddingTop: Theme.hp('2%'),
  },
});
