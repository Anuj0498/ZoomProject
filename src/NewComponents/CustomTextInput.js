import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import Theme from '../Utils/Theme';

const styles = StyleSheet.create({
  placeholderColor: {
    color: Theme.darkGrey,
  },
  txtInput: {
    width: Theme.wp('90%'),
    height: Theme.hp('7%'),
    borderWidth: 0.5,
    borderRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: Theme.darkGrey,
    backgroundColor: Theme.lightGrey,
    paddingHorizontal: Theme.wp('5%'),
    alignSelf: Theme.align,
    color: Theme.black,
  },
  otpTextInput: {
    width: Theme.wp('90%'),
    height: Theme.hp('7%'),
    borderWidth: 0.5,
    borderRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: Theme.darkGrey,
    backgroundColor: Theme.darkGrey2,
    alignSelf: Theme.align,
    color: Theme.black,
    letterSpacing: 30,
    textAlign: 'center',
  },
  primaryTxtInput: {
    width: Theme.wp('90%'),
    height: Theme.hp('6%'),
    borderWidth: 1,
    borderRadius: 6,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: 'rgba(37, 22, 75, 1)',
    paddingHorizontal: Theme.wp('4%'),
    alignSelf: Theme.align,
    color: Theme.black,
  },
});

const CustomTextInput = React.forwardRef(
  (
    {
      placeholder,
      keyboardType,
      onChangeText,
      secureTextEntry,
      isEditable,
      value,
      maxLength,
      variant,
      rightIconPress,
    },
    ref
  ) => {
    return (
      <>
        {variant === 'OTP' ? (
          <TextInput
            ref={ref}
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
            editable={isEditable}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            style={styles.otpTextInput}
            selectionColor="green"
            autoComplete='off'
            placeholderTextColor={Theme.darkGrey}
            underlineColor='transparent'
            activeUnderlineColor='transparent'
          />
        ) : variant === 'primary' ? (
          <TextInput
            ref={ref}
            value={value}
            maxLength={maxLength}
            autoComplete='off'
            placeholder={placeholder}
            editable={isEditable}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            selectionColor="green"
            style={styles.primaryTxtInput}
            placeholderTextColor={Theme.darkGrey}
            underlineColor='transparent'
            activeUnderlineColor='transparent'
          />
        ) : variant === 'PASSWORD' ? (
          <TextInput
            ref={ref}
            value={value}
            maxLength={maxLength}
            autoComplete='off'
            placeholder={placeholder}
            editable={isEditable}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            selectionColor="green"
            style={styles.txtInput}
            placeholderTextColor={Theme.darkGrey}
            underlineColor='transparent'
            activeUnderlineColor='transparent'
            right={<TextInput.Icon name='eye' onPress={rightIconPress} />}
          />
        ) : (
          <TextInput
            ref={ref}
            value={value}
            maxLength={maxLength}
            autoComplete='off'
            placeholder={placeholder}
            editable={isEditable}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            style={styles.txtInput}
            selectionColor="green"
            placeholderTextColor={Theme.darkGrey}
            underlineColor='transparent'
            activeUnderlineColor='transparent'
          />
        )}
      </>
    );
  }
);

export default CustomTextInput;
