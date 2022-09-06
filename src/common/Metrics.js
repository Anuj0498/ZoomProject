  import { Dimensions, Platform } from "react-native";

import DeviceInfo from 'react-native-device-info';

const { width, height } = Dimensions.get("window");

const screenWidth = width < height ? width : height;
const screenHeight = width < height ? height : width;

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

const scale = size => (screenWidth / guidelineBaseWidth) * +size;

const IS_IPHONE_X = screenHeight === 812 || screenHeight === 896;
const HAS_NOTCH = DeviceInfo.hasNotch();
const NAVBAR_HEIGHT = Platform.OS === 'ios' ? 70 : 60;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const generatedFontSize = (iosFontSize: number, androidFontSize: ?number) =>
  Platform.select({
    ios: scale(iosFontSize),
    android: androidFontSize || iosFontSize
  });

export default {
  NAVBAR_HEIGHT,
  HAS_NOTCH,
  STATUSBAR_HEIGHT,
  screenWidth,
  generatedFontSize,
  IS_IPHONE_X
};
