import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';
import Icon, { Icons } from './Icons';
import { bold, regular } from '../config/Constants';
import { primaryColor, whiteColor, blackColor } from '../utils/globalColors';

const { width } = Dimensions.get('window');

const NetworkModal = () => {
  const [isOffline, setIsOffline] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOffline) {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Pulse the icon continuously while offline
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.15,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    } else {
      pulseAnim.stopAnimation();
    }
  }, [isOffline]);

  return (
    <Modal
      transparent
      visible={isOffline}
      animationType="none"
      onRequestClose={() => {}}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          {/* Icon Circle */}
          <LinearGradient
            colors={['#E8534A', '#C0392B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Icon
                type={Icons.MaterialIcons}
                name="wifi-off"
                size={ms(42)}
                color={whiteColor}
                style={{}}
              />
            </Animated.View>
          </LinearGradient>

          {/* Title */}
          <Text style={styles.title}>No Internet Connection</Text>

          {/* Message */}
          <Text style={styles.message}>
            Please check your Wi-Fi or mobile data.{'\n'}
            The app will resume once you're back online.
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Reconnecting indicator */}
          <View style={styles.reconnectRow}>
            <ActivityIndicator size="small" color={primaryColor} />
            <Text style={styles.reconnectText}>Waiting for connection...</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: whiteColor,
    borderRadius: ms(20),
    paddingVertical: vs(30),
    paddingHorizontal: ms(25),
    alignItems: 'center',
    elevation: 10,
    shadowColor: blackColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  iconCircle: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(20),
    elevation: 5,
    shadowColor: '#E8534A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: ms(20),
    fontFamily: bold,
    color: blackColor,
    marginBottom: vs(10),
    textAlign: 'center',
  },
  message: {
    fontSize: ms(13),
    fontFamily: regular,
    color: '#666',
    textAlign: 'center',
    lineHeight: ms(20),
    marginBottom: vs(20),
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: vs(16),
  },
  reconnectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  reconnectText: {
    fontSize: ms(13),
    fontFamily: regular,
    color: primaryColor,
  },
});

export default NetworkModal;
