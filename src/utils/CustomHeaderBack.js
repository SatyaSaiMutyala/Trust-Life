// CustomHeaderBack.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon, { Icons } from '../components/Icons';
import { whiteColor } from './globalColors';

const CustomHeaderBack = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.headerButton} onPress={onPress}>
      <Icon
        type={Icons.Ionicons}
        name="arrow-back"
        color={whiteColor}
        size={ms(20)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    width: ms(35),
    height: ms(35),
    borderRadius: ms(17.5),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(30),
  },
});

export default CustomHeaderBack;
