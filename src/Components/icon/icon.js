import {
  Image,
  ImageStyle,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { Icons } from './icons';
import React from 'react';

export function Icon(props) {
  const { styleOverride, name, containerStyle, onPress } = props;
  const style = { ...styles.container, ...styleOverride };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={containerStyle}>
        <Image style={style} source={Icons[name]} />
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={containerStyle}>
        <Image style={style} source={Icons[name]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    resizeMode: 'contain',
  },
});
