import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Theme from '../Utils/Theme';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Theme.newBlueColor,
    borderRadius: 16,
    alignItems: Theme.align,
    justifyContent: Theme.align,
    width: Theme.wp('90%'),
    height: Theme.hp('7%'),
    alignSelf: Theme.align,
  },
  secondaryButton: {
    alignItems: Theme.align,
  },
  secondaryButtonStyle: {
    borderRadius: 6,
    alignItems: Theme.align,
    justifyContent: Theme.align,
    width: Theme.wp('90%'),
    height: Theme.hp('6%'),
  },
  labelStyle: {
    color: Theme.white,
    fontWeight: '400',
    fontSize: Theme.txtMedium1,
  },
  secondaryLabelStyle: {
    color: Theme.txtBlue,
    fontWeight: '600',
    fontSize: Theme.txtMedium,
  },
});

const CustomButton = ({ label, onPress, variant, isDisable, loading }) => {
  return (
    <>
      {variant === 'primary' ? (
        <TouchableOpacity
          onPress={onPress}
          style={[
            styles.buttonStyle,
            {
              backgroundColor: isDisable ? '#DDDDDD' : Theme.newBlueColor,
            },
          ]}
          disabled={isDisable}>
          {loading ? (
            <ActivityIndicator size={'small'} color='white' />
          ) : (
            <Text
              style={[
                styles.labelStyle,
                {
                  color: isDisable ? '#8E8E8E' : Theme.white,
                },
              ]}>
              {label}
            </Text>
          )}
        </TouchableOpacity>
      ) : variant === 'secondary' ? (
        <TouchableOpacity style={styles.secondaryButton} onPress={onPress}>
          <LinearGradient
            colors={[Theme.yellow, Theme.secondary3]}
            style={[
              styles.secondaryButtonStyle,
              {
                opacity: isDisable ? 0.4 : 1,
              },
            ]}>
            <Text style={styles.secondaryLabelStyle}>{label}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}
    </>
  );
};

export default CustomButton;
