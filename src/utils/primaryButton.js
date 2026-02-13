import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { primaryColor } from './globalColors';

const PrimaryButton = ({
  title = 'Button',
  onPress,
  style = {},
  textStyle = {},
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={!disabled ? onPress : null}
      style={[
        styles.button,
        style,
        disabled && { opacity: 0.6 },
      ]}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: primaryColor || '#006D5D',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
