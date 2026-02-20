

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ms } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { primaryColor } from '../../utils/globalColors';

const { width: SCREEN_W } = Dimensions.get('window');

const TAB_CONFIG = {
  Home: { activeImg: require('../../assets/img/home_active2.png'), inactiveImg: require('../../assets/img/home_inactive1.png'), label: 'Home' },
  Reports: { activeImg: require('../../assets/img/active-folder.png'), inactiveImg: require('../../assets/img/inactive-folder.png'), label: 'Medical Records' },
  HealthTrend: { activeImg: require('../../assets/img/analysis_active2.png'), inactiveImg: require('../../assets/img/analysis_inactive1.png'), label: 'Health Trend' },
  More: { activeImg: require('../../assets/img/active_more.png'), inactiveImg: require('../../assets/img/inactive_more.png'), label: 'More' },
};

const GLOBE = ms(55);
const CURVE_W = GLOBE * 0.6;  // half-width of the dip opening
const CURVE_D = ms(14);       // how deep the dip goes
const BAR_H = ms(55);         // bar content height
const CORNER = 20;

const CustomBottomTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const safeBottom = insets.bottom > 0 ? insets.bottom : 0;
  const svgH = BAR_H + safeBottom;
  const cx = SCREEN_W / 2;

  // SVG: rounded-top rectangle with a smooth dip in the center
  const path = [
    `M0,${CORNER}`,
    `Q0,0 ${CORNER},0`,
    `L${cx - CURVE_W},0`,
    `Q${cx - CURVE_W + 8},0 ${cx - CURVE_W / 2},${CURVE_D}`,
    `Q${cx},${CURVE_D * 2} ${cx + CURVE_W / 2},${CURVE_D}`,
    `Q${cx + CURVE_W - 8},0 ${cx + CURVE_W},0`,
    `L${SCREEN_W - CORNER},0`,
    `Q${SCREEN_W},0 ${SCREEN_W},${CORNER}`,
    `L${SCREEN_W},${svgH}`,
    `L0,${svgH}`,
    'Z',
  ].join(' ');

  const onPress = (route) => {
    const idx = state.routes.indexOf(route);
    if (state.index === idx) return;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!event.defaultPrevented) navigation.navigate(route.name);
  };

  return (
    <View style={[styles.wrap, { height: svgH + GLOBE / 2 }]}>
      {/* Shadow layer behind the bar */}
      <View style={[styles.shadowBar, { height: svgH }]} />

      {/* Bar with notch */}
      <Svg width={SCREEN_W} height={svgH} style={styles.svg}>
        <Path d={path} fill="#F1F5F9" />
      </Svg>

      {/* Globe – vertically centered on the dip's deepest point */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('TrustMD')}
        style={[styles.globeWrap, { top: GLOBE / 4 - CURVE_D }]}
      >
          <Image source={require('../../assets/img/md.png')} style={styles.globeImage} resizeMode="contain" />

      </TouchableOpacity>

      {/* Tabs – sit inside the bar area */}
      <View style={[styles.tabs, { height: BAR_H, bottom: safeBottom }]}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const isCenter = route.name === 'TrustMD';
          const cfg = TAB_CONFIG[route.name];

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => onPress(route)}
              activeOpacity={0.7}
              style={styles.tab}
            >
              {isCenter ? (
                <View style={styles.centerLabelWrap}>
                  <Text style={[styles.label, focused && styles.labelActive]}>
                    Trust MD
                  </Text>
                </View>
              ) : (
                <>
                  <Image
                    source={focused ? cfg.activeImg : cfg.inactiveImg}
                    style={styles.tabIcon}
                    resizeMode="contain"
                  />
                  <Text style={[styles.label, focused && styles.labelActive]}>
                    {cfg.label}
                  </Text>
                </>
              )}
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
    width: '100%',
  },
  svg: {
    position: 'absolute',
    bottom: 0,

  },
  globeWrap: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 2,
  },
  globe: {
    width: GLOBE,
    height: GLOBE,
    borderRadius: GLOBE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  globeImage: {
    width: GLOBE * 1,
    height: GLOBE * 1,
  },
  tabs: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: ms(8),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tabIcon: {
    width: ms(22),
    height: ms(22),
  },
  centerLabelWrap: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  label: {
    color: '#999',
    fontSize: ms(9),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
    lineHeight: ms(12),
  },
  labelActive: {
    color: primaryColor,
    fontWeight: '700',
  },
});

export default CustomBottomTabBar;
