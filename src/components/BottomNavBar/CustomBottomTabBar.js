
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
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
            <TouchableOpacity
              key={route.key}
              onPress={() => onPress(route)}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <Image
                source={iconSource}
                style={iconStyle}
                resizeMode="contain"
              />
              <Text style={[styles.label, focused && styles.labelActive]}>
                {cfg.label}
              </Text>
            </TouchableOpacity>
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
});

export default CustomBottomTabBar;
