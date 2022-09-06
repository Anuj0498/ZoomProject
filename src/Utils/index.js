import React from 'react';
import {Toast} from 'native-base';
import {
  RefreshControl,
  Alert,
  StatusBar,
  Platform,
  Linking,
  NativeModules,
  ToastAndroid,
} from 'react-native';

import Constants from '../common/Constants';

import {Colors, Fonts} from '../common';

let userData = {};

class utils {
  confirmAlert(title, msg, callback) {
    Alert.alert(
      title,
      msg,
      [
        {text: 'NO', onPress: () => callback('error')},
        {text: 'YES', onPress: () => callback('success')},
      ],
      {cancelable: false},
    );
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  validateEmail(str) {
    var newPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return newPattern.test(str);
  }

  isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  _refreshControl(refhresList, isRef = false) {
    return (
      <RefreshControl
        refreshing={isRef}
        onRefresh={refhresList}
        title={'Pull to Refresh'}
        tintColor={Constants.secondry}
        colors={['white']}
        progressBackgroundColor={Constants.secondry}
      />
    );
  }

  serializeObj(obj) {
    var str = [];
    for (var p in obj)
      if (obj[p] != '') {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    return str.join('&');
  }

  _renderStatusBar(barStyle = 'light-content', barColor = 'transparent') {
    if (Platform.OS === 'ios') {
      return (
        <StatusBar
          animated
          translucent
          barStyle={barStyle}
          StatusBarAnimation="fade"
          backgroundColor={'transparent'}
        />
      );
    } else {
      return (
        <StatusBar
          animated
          StatusBarAnimation="fade"
          backgroundColor="black"
          barStyle={barStyle}
        />
      );
    }
  }

  getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  showToast(msg = '') {
    Toast.show({
      text: msg,
      position: 'bottom',
      textStyle: {
        color: Colors.white,
        fontFamily: Constants.fontRegular,
        fontSize: 16,
      },
      type: 'danger',
      duration: 3000,
      style: {
        backgroundColor: '#000',
        minHeight: 50,
        borderRadius: 5,
      },
    });
  }
}
export default new utils();
