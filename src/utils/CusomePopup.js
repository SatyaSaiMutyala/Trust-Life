import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

const CustomPopup = ({visible, title, message, onClose, type = 'success'}) => {
  // Icon based on type
  const getIcon = () => {
    if (type === 'success') {
      return '✓';
    } else if (type === 'error') {
      return '✕';
    }
    return 'ℹ';
  };

  const getIconColor = () => {
    if (type === 'success') {
      return '#4CAF50';
    } else if (type === 'error') {
      return '#F44336';
    }
    return '#2196F3';
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          {/* Icon Circle */}
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: getIconColor() + '20'},
            ]}>
            <Text style={[styles.icon, {color: getIconColor()}]}>
              {getIcon()}
            </Text>
          </View>

          {/* Title */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* OK Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: moderateScale(24),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  icon: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  message: {
    fontSize: moderateScale(16),
    color: '#666666',
    textAlign: 'center',
    marginBottom: verticalScale(24),
    lineHeight: moderateScale(22),
  },
  button: {
    backgroundColor: '#6200EE', // primaryColor - change this to your app's primary color
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(48),
    borderRadius: moderateScale(8),
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default CustomPopup;