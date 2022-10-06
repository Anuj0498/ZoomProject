import {
  ActionSheetIOS,
  Alert,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Image,
} from 'react-native';
import {
  PERMISSIONS,
  Permission,
  PermissionStatus,
  RESULTS,
  checkMultiple,
  openSettings,
  requestMultiple,
} from 'react-native-permissions';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Errors,
  EventType,
  LiveStreamStatus,
  PhoneFailedReason,
  PhoneStatus,
  RecordingStatus,
  ShareStatus,
  VideoPreferenceMode,
  ZoomVideoSdkChatMessage,
  ZoomVideoSdkChatMessageType,
  ZoomVideoSdkUser,
  ZoomVideoSdkUserType,
  useZoom,
} from '@zoom/react-native-videosdk';
import React, { useEffect, useRef, useState } from 'react';

import { Icon } from '../../../Components/icon';
import LinearGradient from 'react-native-linear-gradient';
import VideoView from '../../../Components/VideoView/VideoView';
import generateJwt from '../../../Utils/hooks/jwt';
import deviceInfoModule from 'react-native-device-info';
import { use } from 'i18next';
import { useIsMounted } from '../../../Utils/hooks/hooks';
import Images from '../../../Utils/Images';
import { useIsFocused } from '@react-navigation/native';
import { ZoomVideoSdkVideoHelper } from '@zoom/react-native-videosdk/lib/typescript/native/ZoomVideoSdkVideoHelper.d.ts';
import GalleryView from '../../../Components/GalleryView/GalleryView';

const CallScreen = ({ navigation, route }) => {
  const [isInSession, setIsInSession] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [users, setUsersInSession] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [fullScreenUser, setFullScreenUser] = useState();
  const [sharingUser, setSharingUser] = useState();
  const [videoInfo, setVideoInfo] = useState();
  const [newName, setNewName] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [contentHeight, setContentHeight] = useState('100%');
  const [isSharing, setIsSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(true);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [isLongTouch, setIsLongTouch] = useState(false);
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const [isMicOriginalOn, setIsMicOriginalOn] = useState(false);
  const isLongTouchRef = useRef(isLongTouch);
  const chatInputRef = useRef(null);
  const videoInfoTimer = useRef(0);
  const focus = useIsFocused();
  // react-native-reanimated issue: https://github.com/software-mansion/react-native-reanimated/issues/920
  // Not able to reuse animated style in multiple views.
  const uiOpacity = useSharedValue(0);
  const inputOpacity = useSharedValue(0);
  const chatOpacity = useSharedValue(0);
  const chatSendButtonScale = useSharedValue(0);
  const isMounted = useIsMounted();
  const zoom = useZoom();
  const windowHeight = useWindowDimensions().height;
  let touchTimer;
  isLongTouchRef.current = isLongTouch;

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

  // useEffect(() => {
  //   focus &&
  //     (async () => {
  //       if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
  //         return;
  //       }

  //       const permissions = platformPermissions[Platform.OS];
  //       let blockedAny = false;
  //       let notGranted = [];

  //       checkMultiple(permissions).then((statuses, PermissionStatus) => {
  //         permissions.map((p) => {
  //           const status = statuses[p];
  //           if (status === RESULTS.BLOCKED) {
  //             blockedAny = true;
  //           } else if (status !== RESULTS.GRANTED) {
  //             notGranted.push(p);
  //           }
  //         });
  //         notGranted.length && requestMultiple(notGranted);
  //         blockedAny && openSettings();
  //       });
  //     })();
  // }, [focus]);

  useEffect(() => {
    focus &&
      (async () => {
        const { params } = route;
        console.log('params=> ', params);
        const token = await generateJwt(params.sessionName, params.roleType);
        try {
          await zoom.joinSession({
            sessionName: "348-7935-681-7d52f8",
            sessionPassword: "0f928f63",
            // token: params.webHook ? params.webHook : token,
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiblpMd1k4cmx0RXhSdm5aTmI0TFV4Rjh2OEZxcnJNYU9kVVlDIiwiaWF0IjoxNjY0NTIwMjA3LCJleHAiOjE2NjQ2NjQyMDcsInRwYyI6IjM0OC03OTM1LTY4MS03ZDUyZjgiLCJwd2QiOiIwZjkyOGY2MyIsInVzZXJfaWRlbnRpdHkiOiJzd2FkaGluIHBhdHJvIiwic2Vzc2lvbl9rZXkiOiIzNDgtNzkzNS02ODEtN2Q1MmY4Iiwicm9sZV90eXBlIjoxfQ.969ABUs5mZYxXiczNYt-69H6m9w7ey2dfOsWykFWR2g",
            userName: params.displayName,
            audioOptions: {
              connect: true,
              mute: true,
            },
            videoOptions: {
              localVideoOn: true,
            },
            sessionIdleTimeoutMins: parseInt(params.sessionIdleTimeoutMins, 10),
          });
          await zoom.shareHelper.lockShare(false);
        } catch (e) {
          console.log('err=> ', err);
          Alert.alert('Failed to join the session');
          setTimeout(() => navigation.goBack(), 1000);
        }
      })();
  }, [focus]);

  // useEffect(() => {
  //   console.log('here');
  //   (async () => {
  //     const myself = await zoom.session.getMySelf();

  //     setUserInfo(myself);

  //     setFullScreenUser(myself);
  //   })();
  // }, [zoom?.session?.userId !== '']);

  useEffect(() => {
    const updateVideoInfo = () => {
      // console.log('fullScreenUser12321', fullScreenUser);
      videoInfoTimer.current = setTimeout(async () => {
        if (!isMounted()) return;

        const videoOn = await fullScreenUser?.videoStatus.isOn();

        // Video statistic info doesn't update when there's no remote users
        if (!fullScreenUser || !videoOn || users.length < 2) {
          clearTimeout(videoInfoTimer.current);
          setVideoInfo('');
          return;
        }

        const fps = isSharing
          ? await fullScreenUser.shareStatisticInfo.getFps()
          : await fullScreenUser.videoStatisticInfo.getFps();

        const height = isSharing
          ? await fullScreenUser.shareStatisticInfo.getHeight()
          : await fullScreenUser.videoStatisticInfo.getHeight();

        const width = isSharing
          ? await fullScreenUser.shareStatisticInfo.getWidth()
          : await fullScreenUser.videoStatisticInfo.getWidth();

        setVideoInfo(`${width}x${height} ${fps}FPS`);
        updateVideoInfo();
      }, 1000);
    };

    updateVideoInfo();

    return () => clearTimeout(videoInfoTimer.current);
  }, [fullScreenUser, users, isMounted, isSharing]);

  useEffect(() => {
    const sessionJoinListener = zoom.addListener(
      EventType.onSessionJoin,
      async (session) => {
        // console.log("session Join", deviceInfoModule.getModel(), session);
        setIsInSession(true);
        toggleUI();
        zoom.session.getSessionName().then(setSessionName);
        // alert(JSON.stringify(session));
        // console.log('alert==>>session', JSON.stringify(session));

        const mySelf = await new ZoomVideoSdkUser(session.mySelf);
        // console.log('alert==>>sessionMYSELF', JSON.stringify(mySelf));
        const remoteUsers = await zoom.session.getRemoteUsers();
        const muted = await mySelf.audioStatus.isMuted();
        const videoOn = await mySelf.videoStatus.isOn();
        const speakerOn = await zoom.audioHelper.getSpeakerStatus();

        setUsersInSession([...remoteUsers, mySelf]);
        setIsMuted(muted);
        setIsVideoOn(videoOn);
        setIsSpeakerOn(speakerOn);
        setFullScreenUser(mySelf);
        setUserInfo(mySelf);
        // console.log(fullScreenUser);
      }
    );

    const userJoinListener = zoom.addListener(
      EventType.onUserJoin,
      async ({ remoteUsers }) => {
        if (!isMounted()) return;
        // console.log("user Join", deviceInfoModule.getModel(), remoteUsers);
        const mySelf = await zoom.session.getMySelf();
        const remote = remoteUsers.map((user) => new ZoomVideoSdkUser(user));
        // console.log("remote", remote);
        setUsersInSession([mySelf, ...remote]);
      }
    );

    const sessionLeaveListener = zoom.addListener(
      EventType.onSessionLeave,
      () => {
        setIsInSession(false);
        setUsersInSession([]);
        navigation.goBack();
      }
    );

    const sessionNeedPasswordListener = zoom.addListener(
      EventType.onSessionNeedPassword,
      () => {
        Alert.alert('SessionNeedPassword');
      }
    );

    const sessionPasswordWrongListener = zoom.addListener(
      EventType.onSessionPasswordWrong,
      () => {
        Alert.alert('SessionPasswordWrong');
      }
    );

    const userVideoStatusChangedListener = zoom.addListener(
      EventType.onUserVideoStatusChanged,
      async ({ changedUsers }) => {
        const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
        changedUsers.map((u) => {
          if (mySelf.userId === u.userId) {
            mySelf.videoStatus.isOn().then((on) => setIsVideoOn(on));
          }
        });
      }
    );

    const userAudioStatusChangedListener = zoom.addListener(
      EventType.onUserAudioStatusChanged,
      async ({ changedUsers }) => {
        const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
        changedUsers.map((u) => {
          if (mySelf.userId === u.userId) {
            mySelf.audioStatus.isMuted().then((muted) => setIsMuted(muted));
          }
        });
      }
    );

    const userLeaveListener = zoom.addListener(
      EventType.onUserLeave,
      async ({ remoteUsers, leftUsers }) => {
        console.log('leave');
        if (!isMounted()) return;
        const mySelf = await zoom.session.getMySelf();
        const remote = remoteUsers.map((user) => new ZoomVideoSdkUser(user));
        if (fullScreenUser) {
          leftUsers.map((user) => {
            if (fullScreenUser.userId === user.userId) {
              setFullScreenUser(mySelf);
              return;
            }
          });
        } else {
          setFullScreenUser(mySelf);
        }
        setUsersInSession([mySelf, ...remote]);
      }
    );

    const userNameChangedListener = zoom.addListener(
      EventType.onUserNameChanged,
      async ({ changedUser }) => {
        setUsersInSession(
          users.map((u) => {
            if (u && u.userId === changedUser.userId) {
              return new ZoomVideoSdkUser(changedUser);
            }
            return u;
          })
        );
      }
    );

    const userShareStatusChangeListener = zoom.addListener(
      EventType.onUserShareStatusChanged,
      async ({ user, status }) => {
        try {
          const shareUser = new ZoomVideoSdkUser(user);
          const mySelf = await zoom.session.getMySelf();

          if (user.userId && status === ShareStatus.Start) {
            console.log('User =>>>>>>>>>>>>>>>>', shareUser);
            setSharingUser(shareUser);
            setFullScreenUser(shareUser);
            setIsSharing(shareUser.userId === mySelf.userId);
          } else {
            setSharingUser(undefined);
            setIsSharing(false);
          }
        } catch (e) {
          console.log("ERrrrrrrrr=>>>>>>>>>", e);
        }
      }
    );

    const commandReceived = zoom.addListener(
      EventType.onCommandReceived,
      (params) => {
        console.log("inside")
        // console.log(
        //   'sender: ' + params.sender + ', command: ' + params.command
        // );
      }
    );

    const chatNewMessageNotify = zoom.addListener(
      EventType.onChatNewMessageNotify,
      (newMessage) => {
        if (!isMounted()) return;
        setChatMessages([
          new ZoomVideoSdkChatMessage(newMessage),
          ...chatMessages,
        ]);
      }
    );

    const liveStreamStatusChangeListener = zoom.addListener(
      EventType.onLiveStreamStatusChanged,
      ({ status }) => {
        // console.log(`onLiveStreamStatusChanged: ${status}`);
      }
    );

    const cloudRecordingStatusListener = zoom.addListener(
      EventType.onCloudRecordingStatus,
      ({ status }) => {
        // console.log(`cloudRecordingStatusListener: ${status}`);
        if (status === RecordingStatus.Start) {
          setIsRecordingStarted(true);
        } else {
          setIsRecordingStarted(false);
        }
      }
    );

    // const inviteByPhoneStatusListener = zoom.addListener(
    //   EventType.onInviteByPhoneStatus,
    //   (params) => {
    //     console.log('status: ' + params.status + ', reason: ' + params.reason);
    //   }
    // );

    const eventErrorListener = zoom.addListener(
      EventType.onError,
      async (error) => {
        console.log('Error: ' + JSON.stringify(error));
        // Alert.alert('Error: ' + JSON.stringify(error));
        switch (error.errorType) {
          case Errors.SessionJoinFailed:
            // Alert.alert('Failed to join the session');
            // setTimeout(() => navigation.goBack(), 1000);
            break;
          default:
        }
      }
    );

    return () => {
      sessionJoinListener.remove();
      sessionLeaveListener.remove();
      sessionPasswordWrongListener.remove();
      sessionNeedPasswordListener.remove();
      userVideoStatusChangedListener.remove();
      userAudioStatusChangedListener.remove();
      userJoinListener.remove();
      userLeaveListener.remove();
      userNameChangedListener.remove();
      userShareStatusChangeListener.remove();
      chatNewMessageNotify.remove();
      liveStreamStatusChangeListener.remove();
      cloudRecordingStatusListener.remove();
      // inviteByPhoneStatusListener.remove();
      eventErrorListener.remove();
      commandReceived.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, route, users, chatMessages, isMounted]);

  const keyboardHeightChange = (isOpen, height) => {
    if (!isOpen) {
      scaleChatSend(false);
      chatInputRef.current?.clear();
    }
    setIsKeyboardOpen(!isOpen);
    setContentHeight(windowHeight - height);
  };

  // onPress event for FlatList since RN doesn't provide container-on-press event
  const onListTouchStart = () => {
    touchTimer = setTimeout(() => {
      setIsLongTouch(true);
    }, 200);
  };

  // onPress event for FlatList since RN doesn't provide container-on-press event
  const onListTouchEnd = (event) => {
    // Toggle UI behavior
    // - Toggle only when user list or chat list is tapped
    // - Block toggling when tapping on a list item
    // - Block toggling when keyboard is shown
    if (event._targetInst.elementType.includes('Scroll') && isKeyboardOpen) {
      !isLongTouchRef.current && toggleUI();
    }
    clearTimeout(touchTimer);
    setIsLongTouch(false);
  };

  const uiOpacityAnimatedStyle = useAnimatedStyle(() => ({
    opacity: uiOpacity.value,
  }));

  const chatOpacityAnimatedStyle = useAnimatedStyle(() => ({
    opacity: chatOpacity.value,
  }));

  const inputOpacityAnimatedStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
  }));

  const chatSendButtonScaleAnimatedStyle = useAnimatedStyle(() => ({
    width: 38 * chatSendButtonScale.value,
    marginLeft: 8 * chatSendButtonScale.value,
    transform: [{ scale: chatSendButtonScale.value }],
  }));

  const toggleUI = () => {
    const easeIn = Easing.in(Easing.exp);
    const easeOut = Easing.out(Easing.exp);
    uiOpacity.value = withTiming(uiOpacity.value === 0 ? 100 : 0, {
      duration: 300,
      easing: uiOpacity.value === 0 ? easeIn : easeOut,
    });
    // inputOpacity.value = withTiming(inputOpacity.value === 0 ? 100 : 0, {
    //   duration: 300,
    //   easing: inputOpacity.value === 0 ? easeIn : easeOut,
    // });
  };

  const toggleInput = () => {
    const easeIn = Easing.in(Easing.exp);
    const easeOut = Easing.out(Easing.exp);
    inputOpacity.value = withTiming(inputOpacity.value === 0 ? 100 : 0, {
      duration: 300,
      easing: inputOpacity.value === 0 ? easeIn : easeOut,
    });
    chatOpacity.value = withTiming(chatOpacity.value === 0 ? 100 : 0, {
      duration: 300,
      easing: uiOpacity.value === 0 ? easeIn : easeOut,
    });
  };

  const sendChatMessage = () => {
    chatInputRef.current?.clear();
    zoom.chatHelper.sendChatToAll(chatMessage);
    setChatMessage('');
    // send the chat as a command
    zoom.cmdChannel.sendCommand(null, chatMessage);
  };

  const scaleChatSend = (show) => {
    const easeIn = Easing.in(Easing.exp);
    const easeOut = Easing.out(Easing.exp);
    chatSendButtonScale.value = withTiming(show ? 1 : 0, {
      duration: 500,
      easing: show ? easeIn : easeOut,
    });
  };

  const leaveSession = async (endSession) => {
    setIsInSession(false);
    const mySelf = await zoom.session.getMySelf();

    let userIndex = users.indexOf(users.find((e) => e.userId == mySelf.userId));
    users.splice(userIndex, 1);
    setUsersInSession(users);

    zoom.leaveSession(!endSession);

    navigation.goBack();
  };

  const onPressAudio = async () => {
    const mySelf = await zoom.session.getMySelf();
    const muted = await mySelf.audioStatus.isMuted();
    setIsMuted(muted);
    muted
      ? zoom.audioHelper.unmuteAudio(mySelf.userId)
      : zoom.audioHelper.muteAudio(mySelf.userId);
  };

  const onPressSpeaker = async () => {
    const speakerStatus = await zoom.audioHelper.getSpeakerStatus();

    const setSpeaker = await zoom.audioHelper.setSpeaker(!speakerStatus);

    setIsSpeakerOn(speakerStatus);

  }

  const onSwitchCamera = async () => {
    const cameraList = await zoom.videoHelper.getCameraList();
    console.log(cameraList); // [{"deviceId": "1", "deviceName": "Built-in Camera Front"}, {"deviceId": "0", "deviceName": "Built-in Camera Back"}]

    await zoom.videoHelper.switchCamera();
  }

  const onPressVideo = async () => {
    const mySelf = await zoom.session.getMySelf();
    console.log('mySelf=> ', mySelf);
    const videoOn = await mySelf.videoStatus.isOn();
    console.log(mySelf.videoStatus);
    console.log('videoOn=> ', videoOn);
    setIsVideoOn(videoOn);
    videoOn ? zoom.videoHelper.stopVideo() : zoom.videoHelper.startVideo();

    // const cameraList = await zoom.videoHelper.getCameraList(); // [{"deviceId": "1", "deviceName": "Built-in Camera Front"}, {"deviceId": "0", "deviceName": "Built-in Camera Back"}]
    // console.log(cameraList);

    // const cameraSwitch = await zoom.videoHelper.switchCamera();  // working Ahhhh yeahhhhhhhh
    // console.log(cameraSwitch);

    // const canSwitchSpeaker = await zoom.audioHelper.canSwitchSpeaker(); //working
    // console.log(canSwitchSpeaker);

    // const speakerStatus = await zoom.audioHelper.getSpeakerStatus(); // working
    // console.log(speakerStatus);

    // const numOfCamera = await zoom.videoHelper.getNumberOfCameras(); //crashes
    // console.log(numOfCamera);

    // const camera = await (zoom.videoHelper.rotateMyVideo()); // crashes
    // console.log(camera);

    // const isOtherSharing = await zoom.shareHelper.isOtherSharing(); // working
    // console.log(isOtherSharing);

    // const isScreenSharingOut = await zoom.shareHelper.isScreenSharingOut();
    // console.log(isScreenSharingOut);

    // const isShareLocked = await zoom.shareHelper.isShareLocked();
    // console.log(isShareLocked);

    // const isSharingOut = await zoom.shareHelper.isSharingOut();
    // console.log(isSharingOut);



    // console.log('before');
    // zoom.shareHelper.lockShare(true);
    // console.log('after');
  };

  const onPressShare = async () => {
    const isOtherSharing = await zoom.shareHelper.isOtherSharing();
    const isShareLocked = await zoom.shareHelper.isShareLocked();

    // if (isOtherSharing) {
    //   Alert.alert('Other is sharing');
    // } else if (isShareLocked) {
    //   Alert.alert('Share is locked by host');
    // } else if (isSharing) {
    //   zoom.shareHelper.stopShare();
    // } else {
    //   zoom.shareHelper.shareScreen();
    // }
    if (isSharing) {
      zoom.shareHelper.stopShare();
    } else {
      zoom.shareHelper.shareScreen();
    }
  };


  const onPressMore = async () => {
    const mySelf = await zoom.session.getMySelf();
    const isShareLocked = await zoom.shareHelper.isShareLocked();
    const isFullScreenUserManager = await fullScreenUser?.getIsManager();
    const canSwitchSpeaker = await zoom.audioHelper.canSwitchSpeaker();
    const canStartRecording = await zoom.recordingHelper.canStartRecording();
    const isSupportPhoneFeature =
      await zoom.phoneHelper.isSupportPhoneFeature();
    let options = [
      // { text: 'Switch Camera', onPress: () => zoom.videoHelper.switchCamera() },
      {
        text: `${isMicOriginalOn ? 'Disable' : 'Enable'} Original Sound`,
        onPress: async () => {
          zoom.audioSettingHelper.enableMicOriginalInput(!isMicOriginalOn);
          // console.log(
          //   `Original sound ${isMicOriginalOn ? 'Disabled' : 'Enabled'}`
          // );
          setIsMicOriginalOn(!isMicOriginalOn);
        },
      },
      {
        text: 'Set Video Preference',
        onPress: async () => {
          zoom.videoHelper.setVideoQualityPreference({
            mode: VideoPreferenceMode.Balance,
            maximumFrameRate: 0,
            minimumFrameRate: 0,
          });
        },
      },
    ];

    if (isSupportPhoneFeature) {
      options = [
        ...options,
        {
          text: `Invite By Phone`,
          onPress: async () => {
            // console.log(await zoom.phoneHelper.getSupportCountryInfo());
            zoom.phoneHelper.inviteByPhone(
              '<Country Code>',
              '<Phone Number>',
              '<Display Name>'
            );
          },
        },
      ];
    }

    if (canSwitchSpeaker) {
      options = [
        ...options,
        {
          text: `Turn ${isSpeakerOn ? 'off' : 'on'} Speaker`,
          onPress: async () => {
            zoom.audioHelper.setSpeaker(!isSpeakerOn);
            setIsSpeakerOn(!isSpeakerOn);
          },
        },
      ];
    }

    if (mySelf.isHost) {
      options = [
        ...options,
        {
          text: `${isShareLocked ? 'Unlock' : 'Lock'} Share`,
          onPress: () => zoom.shareHelper.lockShare(!isShareLocked),
        },
        {
          text: `${isFullScreenUserManager ? 'Revoke' : 'Make'} Manager`,
          onPress: () => {
            fullScreenUser &&
              (isFullScreenUserManager
                ? zoom.userHelper.revokeManager(fullScreenUser.userId)
                : zoom.userHelper.makeManager(fullScreenUser.userId));
          },
        },
        {
          text: 'Change Name',
          onPress: () => setIsRenameModalVisible(true),
        },
      ];

      if (canStartRecording) {
        options = [
          ...options,
          {
            text: `${isRecordingStarted ? 'Start' : 'Stop'} Recording`,
            onPress: async () => {
              if (!isRecordingStarted) {
                zoom.recordingHelper.startCloudRecording();
              } else {
                zoom.recordingHelper.stopCloudRecording();
              }
            },
          },
        ];
      }
    }

    if (Platform.OS === 'android') {
      Alert.alert('More options', '', options, { cancelable: true });
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...options.map((option) => option.text)],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          // eslint-disable-next-line eqeqeq
          if (buttonIndex != 0) {
            options[buttonIndex - 1].onPress();
          }
        }
      );
    }
  };

  const onPressLeave = async () => {
    const mySelf = await zoom.session.getMySelf();
    const options = [
      {
        text: 'Leave Session',
        onPress: () => leaveSession(false),
      },
    ];

    if (mySelf.isHost) {
      options.unshift({
        text: 'End Session',
        onPress: () => leaveSession(true),
      });
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...options.map((option) => option.text)],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex !== 0) {
            options[buttonIndex - 1].onPress();
          }
        }
      );
    } else {
      Alert.alert('Do you want to leave this session?', '', options, {
        cancelable: true,
      });
    }
  };

  const contentStyles = {
    ...styles.container,
    height: contentHeight,
  };
  // console.log('fullScreenUse43ede3er', JSON.stringify(fullScreenUser));
  return (
    <View style={contentStyles}>
      {console.log(deviceInfoModule.getModel(), fullScreenUser, 'here')}
      <StatusBar hidden />
      <View style={styles.fullScreenVideo}>
        <VideoView
          user={fullScreenUser}
          sharing={fullScreenUser?.userId === sharingUser?.userId}
          onPress={() => {
            isKeyboardOpen ? toggleUI() : Keyboard.dismiss();
          }}
          fullScreen
        />
      </View>

      <LinearGradient
        style={styles.fullScreenVideo}
        colors={[
          'rgba(0,0,0,0.6)',
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0.6)',
        ]}
        locations={[0, 0.12, 0.88, 1]}
        pointerEvents='none'
      />

      <SafeAreaView style={styles.safeArea} pointerEvents='box-none'>
        <Animated.View
          style={[styles.contents, uiOpacityAnimatedStyle]}
          pointerEvents='box-none'>
          <View style={styles.topWrapper} pointerEvents='box-none'>
            <View style={styles.sessionInfo}>
              <View style={styles.sessionInfoHeader}>
                <Text style={styles.sessionName}>{sessionName}</Text>
                <Icon
                  name={route.params.sessionPassword ? 'locked' : 'unlocked'}
                />
              </View>
              <Text style={styles.numberOfUsers}>
                {`Participants: ${users.length}`}
              </Text>
            </View>

            <View style={styles.topRightWrapper}>
              {/* <TouchableOpacity
                style={styles.leaveButton}
                onPress={onPressLeave}>
                <Text style={styles.leaveText}>LEAVE</Text>
              </TouchableOpacity> */}
              {fullScreenUser && videoInfo?.length !== 0 && (
                <View style={styles.videoInfo}>
                  <Text style={styles.videoInfoText}>{videoInfo}</Text>
                </View>
              )}
            </View>
          </View>

          <Animated.View
            style={[styles.middleWrapper, chatOpacityAnimatedStyle]}
            pointerEvents='box-none'>
            <FlatList
              contentContainerStyle={styles.chatList}
              onTouchStart={onListTouchStart}
              onTouchEnd={onListTouchEnd}
              data={chatMessages}
              renderItem={({ item }) => (
                <View style={styles.chatMessage}>
                  <Text style={styles.chatUser}>
                    {item.senderUser.userName}:
                  </Text>
                  <Text style={styles.chatContent}> {item.content}</Text>
                </View>
              )}
              keyExtractor={(item, index) =>
                `${String(item.timestamp)}${index}`
              }
              showsVerticalScrollIndicator={false}
              fadingEdgeLength={50}
              inverted
            />
            {/* <View style={styles.controls}>
              <Icon
                containerStyle={styles.controlButton}
                name={isMuted ? 'unmute' : 'mute'}
                onPress={onPressAudio}
              />
              <Icon
                containerStyle={styles.controlButton}
                name={isSharing ? 'shareOff' : 'shareOn'}
                onPress={onPressShare}
              />
              <Icon
                containerStyle={styles.controlButton}
                name={isVideoOn ? 'videoOff' : 'videoOn'}
                onPress={onPressVideo}
              />
              <Icon
                containerStyle={styles.controlButton}
                name='more'
                onPress={onPressMore}
              />
            </View> */}
          </Animated.View>
        </Animated.View>

        <View style={styles.bottomWrapper} pointerEvents='box-none'>
          {isInSession && (
            <FlatList
              style={styles.userList}
              contentContainerStyle={styles.userListContentContainer}
              onTouchStart={onListTouchStart}
              onTouchEnd={onListTouchEnd}
              data={users}
              extraData={users}
              renderItem={({ item }) => (
                // <VideoView
                //   user={item.userId == userInfo?.userId ? userInfo : item}
                //   focused={item.userId === fullScreenUser?.userId}
                //   onPress={(selectedUser) => {
                //     setFullScreenUser(selectedUser);
                //   }}
                //   key={item.userId}
                // />
                <GalleryView
                  user={item.userId == userInfo?.userId ? userInfo : item}
                  focused={item.userId === fullScreenUser?.userId}
                  onPress={(selectedUser) => {
                    setFullScreenUser(selectedUser);
                  }}
                  key={item.userId}
                />
              )}
              keyExtractor={(item) => item.userId}
              fadingEdgeLength={50}
              decelerationRate={0}
              snapToAlignment='center'
              snapToInterval={100}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
          )}
          <Animated.View style={inputOpacityAnimatedStyle}>
            <View style={styles.chatInputWrapper}>
              <TextInput
                style={styles.chatInput}
                ref={chatInputRef}
                placeholder='Type comment'
                placeholderTextColor='#AAA'
                onChangeText={(text) => {
                  scaleChatSend(text.length !== 0);
                  setChatMessage(text);
                }}
                onSubmitEditing={sendChatMessage}
              />
              <Animated.View
                style={[
                  chatSendButtonScaleAnimatedStyle,
                  styles.chatSendButton,
                ]}>
                <Icon name='chatSend' onPress={sendChatMessage} />
              </Animated.View>
            </View>
          </Animated.View>
        </View>

        <Modal
          animationType='fade'
          transparent={true}
          visible={isRenameModalVisible}
          statusBarTranslucent>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
            <View style={styles.modal}>
              <Text style={styles.modalTitleText}>Change Name</Text>
              <TextInput
                style={styles.renameInput}
                placeholder='New name'
                placeholderTextColor='#AAA'
                onChangeText={(text) => setNewName(text)}
              />
              <View style={styles.modalActionContainer}>
                <TouchableOpacity
                  style={styles.modalAction}
                  onPress={() => {
                    if (fullScreenUser) {
                      zoom.userHelper.changeName(
                        newName,
                        fullScreenUser.userId
                      );
                      setNewName('');
                      setIsRenameModalVisible(false);
                    }
                  }}>
                  <Text style={styles.modalActionText}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalAction}
                  onPress={() => {
                    setNewName('');
                    setIsRenameModalVisible(false);
                  }}>
                  <Text style={styles.modalActionText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {!isInSession && (
          <View style={styles.connectingWrapper}>
            <Text style={styles.connectingText}>Connecting...</Text>
          </View>
        )}
      </SafeAreaView>
      {isInSession && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: 'rgba(67, 13, 155, 1)',
            height: '10%',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity onPress={onPressAudio}>
            <Image source={Images.zoomMic} style={{ height: 45, width: 45 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressSpeaker}>
            <Image
              source={Images.zoomAudio}
              style={{ height: 45, width: 45 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressVideo}>
            <Image
              source={Images.zoomVideo}
              style={{ height: 45, width: 45 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleInput}>
            <Image
              source={Images.zoomMessage}
              style={{ height: 45, width: 45 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressLeave}>
            <Image
              source={Images.zoomLeave}
              style={{ height: 45, width: 45, top: 1 }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default CallScreen;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#232323',
  },
  fullScreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '90%',
  },
  connectingWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  safeArea: {
    flex: 0.9,
  },
  contents: {
    flex: 1,
    alignItems: 'stretch',
  },
  sessionInfo: {
    width: 200,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sessionInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  numberOfUsers: {
    fontSize: 13,
    color: '#FFF',
  },
  topWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 8,
    paddingTop: 16,
  },
  topRightWrapper: {
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  middleWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  bottomWrapper: {
    paddingHorizontal: 8,
  },
  leaveButton: {
    paddingVertical: 4,
    paddingHorizontal: 24,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  leaveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E02828',
  },
  videoInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  videoInfoText: {
    fontSize: 12,
    color: '#FFF',
  },
  chatList: {
    paddingRight: 16,
  },
  chatMessage: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  chatUser: {
    fontSize: 14,
    color: '#CCC',
  },
  chatContent: {
    fontSize: 14,
    color: '#FFF',
  },
  controls: {
    alignSelf: 'center',
    paddingTop: 24,
  },
  controlButton: {
    marginBottom: 12,
  },
  userList: {
    width: '100%',
  },
  userListContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  chatInputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    height: 40,
    marginVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#666',
    color: '#AAA',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  chatSendButton: {
    height: 36,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingLeft: 24,
    paddingRight: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  modalTitleText: {
    fontSize: 18,
    marginBottom: 8,
  },
  modalActionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalAction: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  moreItem: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moreItemText: {
    fontSize: 16,
  },
  moreItemIcon: {
    width: 36,
    height: 36,
    marginLeft: 48,
  },
  moreModalTitle: {
    fontSize: 24,
  },
  renameInput: {
    width: 200,
    marginTop: 16,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#AAA',
    color: '#000',
  },
  keyboardArea: {
    height: 0,
    width: 0,
    zIndex: -100,
  },
});