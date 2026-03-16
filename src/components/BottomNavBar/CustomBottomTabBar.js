
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Animated,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { primaryColor } from '../../utils/globalColors';

const BAR_H = ms(62);

const TAB_CONFIG = {
  Home: {
    icon: require('../../assets/img/fhome.png'),
    label: 'Home',
    tintable: true,
  },
  Reports: {
    icon: require('../../assets/img/ftracking.png'),
    label: 'Tracking',
    tintable: true,
  },
  PatientHealthRecords: {
    icon: require('../../assets/img/frecords.png'),
    label: 'Records',
    tintable: false,
  },
  HealthTrend: {
    icon: require('../../assets/img/fprogress.png'),
    label: 'Progress',
    tintable: false,
  },
  More: {
    activeIcon: require('../../assets/img/active_more.png'),
    inactiveIcon: require('../../assets/img/inactive_more.png'),
    label: 'More',
    hasSeparateIcons: true,
  },
};

const AnimatedTab = ({ focused, iconSource, iconStyle, label, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1 : 0,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  const iconScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const translateY = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.tab, focused && styles.tabFocused]}
    >
      <Animated.View style={{ transform: [{ scale: iconScale }, { translateY }] }}>
        <Image
          source={iconSource}
          style={iconStyle}
          resizeMode="contain"
        />
      </Animated.View>
      <Text style={[styles.label, focused && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const CustomBottomTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const safeBottom = insets.bottom > 0 ? insets.bottom : 0;

  const onPress = (route) => {
    const idx = state.routes.indexOf(route);
    if (state.index === idx) return;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!event.defaultPrevented) navigation.navigate(route.name);
  };

  return (
    <View style={[styles.wrap, { paddingBottom: safeBottom }]}>
      <View style={styles.bar}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const cfg = TAB_CONFIG[route.name];
          if (!cfg) return null;

          let iconSource;
          const iconStyle = [styles.tabIcon];

          if (cfg.hasSeparateIcons) {
            iconSource = focused ? cfg.activeIcon : cfg.inactiveIcon;
          } else {
            iconSource = cfg.icon;
            if (cfg.tintable) {
              iconStyle.push({ tintColor: focused ? primaryColor : '#4B5563' });
            }
          }

          return (
            <AnimatedTab
              key={route.key}
              focused={focused}
              iconSource={iconSource}
              iconStyle={iconStyle}
              label={cfg.label}
              onPress={() => onPress(route)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  bar: {
    flexDirection: 'row',
    height: BAR_H,
    alignItems: 'center',
    paddingHorizontal: ms(8),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(6),
    borderRadius: ms(12),
    marginHorizontal: ms(3),
    marginVertical: ms(4),
  },
  tabIcon: {
    width: ms(30),
    height: ms(30),
    marginBottom: ms(3),
  },
  label: {
    color: '#6B7280',
    fontSize: ms(11),
    fontWeight: '600',
    textAlign: 'center',
  },
  labelActive: {
    color: primaryColor,
    fontWeight: '700',
  },
  tabFocused: {
    backgroundColor: primaryColor + '18',
  },
});

export default CustomBottomTabBar;
