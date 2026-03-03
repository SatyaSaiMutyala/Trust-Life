

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, {
  Circle,
  Line,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor } from '../utils/globalColors';
import { bold } from '../config/Constants';

/* ───────────── Gauge Config ───────────── */
const GAUGE_SIZE = ms(260);
const CX = GAUGE_SIZE / 2;
const CY = GAUGE_SIZE / 2;
const R = ms(105);
const STROKE_W = ms(24);

const SCORE = 320;
const MIN_SCORE = 300;
const MAX_SCORE = 900;

const NORMALIZED_SCORE = Math.max(
  0,
  Math.min(1, (SCORE - MIN_SCORE) / (MAX_SCORE - MIN_SCORE))
);

const CIRCUMFERENCE = 2 * Math.PI * R;
// const DASH_OFFSET = CIRCUMFERENCE * (1 - NORMALIZED_SCORE);
const ROTATE_DEG = 150;

/* ───────────── Helpers ───────────── */
const toRad = (deg) => (deg * Math.PI) / 180;
const polar = (cx, cy, r, deg) => ({
  x: cx + r * Math.cos(toRad(deg)),
  y: cy + r * Math.sin(toRad(deg)),
});

const TICK_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/* ───────────── Breakdown Data ───────────── */
const BREAKDOWN_DATA = [
  {
    title: 'Regularity of Health Actions',
    score: 18,
    total: 25,
    color: '#3B82F6',
    desc: "You've taken health action regularly with no long gaps",
    tooltip: 'Increased by 2 points + 18/25',
    tooltipDesc: "You've taken health action regularly with no long gaps",
  },
  {
    title: 'Consistency Over time',
    score: 21,
    total: 25,
    color: '#F59E0B',
    desc: 'Your engagement has been steady month over month',
    tooltip: 'Stable at 21/25',
    tooltipDesc: 'Your engagement has been steady month over month',
  },
  {
    title: 'Follow - through on Medical Guidance',
    score: 14,
    total: 20,
    color: '#10B981',
    desc: 'Some recommended follow-ups are pending',
    tooltip: 'Decreased by 1 point + 14/20',
    tooltipDesc: 'Some recommended follow-ups are pending',
  },
  {
    title: 'Stability of health Indicators',
    score: 12,
    total: 15,
    color: '#3B82F6',
    secondColor: '#F59E0B',
    desc: 'Your health markers are being monitored consistently',
    tooltip: 'Stable at 12/15',
    tooltipDesc: 'Your health markers are being monitored consistently',
  },
  {
    title: 'Preventive care engagement',
    score: 11,
    total: 15,
    color: '#3B82F6',
    desc: 'You are mostly on track with preventive care',
    tooltip: 'Increased by 1 point + 11/15',
    tooltipDesc: 'You are mostly on track with preventive care',
  },
];

/* ───────────── Gauge Component ───────────── */
// const ScoreGauge = () => (
//   <View style={styles.gaugeContainer}>
//     <Svg width={GAUGE_SIZE} height={GAUGE_SIZE}>
//       <Defs>
//         <RadialGradient id="greenGlow" cx="50%" cy="50%" r="55%">
//           <Stop offset="60%" stopColor={primaryColor} stopOpacity="0.25" />
//           <Stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
//         </RadialGradient>

//         <RadialGradient id="innerShadow" cx="50%" cy="46%" r="50%">
//           <Stop offset="0%" stopColor="#FFFFFF" />
//           <Stop offset="85%" stopColor="#F2F2F2" />
//           <Stop offset="100%" stopColor="#D6D6D6" />
//         </RadialGradient>
//       </Defs>

//       <Circle cx={CX} cy={CY} r={R + 10} fill="url(#greenGlow)" />

//       <Circle
//         cx={CX}
//         cy={CY}
//         r={R}
//         fill="none"
//         stroke="none"
//         strokeWidth={STROKE_W}
//       />

//       <Circle
//         cx={CX}
//         cy={CY}
//         r={R}
//         fill="none"
//         stroke='none'
//         strokeWidth={STROKE_W}
//         strokeDasharray={CIRCUMFERENCE}
//         strokeDashoffset={DASH_OFFSET}
//         strokeLinecap="round"
//         transform={`rotate(${ROTATE_DEG}, ${CX}, ${CY})`}
//       />

//       <Circle cx={CX} cy={CY} r={R - 6} fill="url(#innerShadow)" />

//       {TICK_ANGLES.map((angle) => {
//         const s = polar(CX, CY, R - 12, angle);
//         const e = polar(CX, CY, R - 24, angle);
//         return (
//           <Line
//             key={angle}
//             x1={s.x}
//             y1={s.y}
//             x2={e.x}
//             y2={e.y}
//             stroke="#D1D5DB"
//             strokeWidth={1.5}
//             strokeLinecap="round"
//           />
//         );
//       })}
//     </Svg>

//     <View style={styles.gaugeCenterText}>
//       <Text style={styles.gaugeScore}>{SCORE}</Text>
//       <Text style={styles.gaugeOutOf}>out of {MAX_SCORE}</Text>
//     </View>

//     <View style={styles.gaugeLabels}>
//       <Text style={styles.gaugeMinMax}>{MIN_SCORE}</Text>
//       <Text style={styles.gaugeMinMax}>{MAX_SCORE}</Text>
//     </View>
//   </View>
// );

const ARC_DEG = 240;
const START_DEG = 150;
const ARC_LENGTH = (ARC_DEG / 360) * CIRCUMFERENCE;
const DASH_OFFSET = ARC_LENGTH * (1 - NORMALIZED_SCORE);

const ScoreGauge = () => (
  <View style={styles.gaugeContainer}>
    <Svg width={GAUGE_SIZE} height={GAUGE_SIZE}>
      <Defs>
        {/* Gradient for the progress arc - teal to green */}
        <LinearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#0C5E50" />
          <Stop offset="40%" stopColor="#1A7E70" />
          <Stop offset="100%" stopColor="#3BB89A" />
        </LinearGradient>

        {/* Subtle green glow behind the gauge */}
        <RadialGradient id="greenGlow" cx="50%" cy="50%" r="55%">
          <Stop offset="55%" stopColor="#1A7E70" stopOpacity="0.15" />
          <Stop offset="100%" stopColor="#1A7E70" stopOpacity="0" />
        </RadialGradient>

        {/* Inner circle shadow for depth */}
        <RadialGradient id="innerShadow" cx="50%" cy="46%" r="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="80%" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="92%" stopColor="#F2F2F2" stopOpacity="1" />
          <Stop offset="100%" stopColor="#D5D5D5" stopOpacity="1" />
        </RadialGradient>
      </Defs>

      {/* Green glow behind gauge */}
      {/* <Circle cx={CX} cy={CY} r={R + 12} fill="url(#greenGlow)" /> */}

      {/* Background arc (light gray) */}
      <Circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="#F1F5F9"
        strokeWidth={STROKE_W}
        strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
        strokeLinecap="round"
        transform={`rotate(${START_DEG}, ${CX}, ${CY})`}
      />

      {/* Progress arc (gradient green) */}
      <Circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="url(#arcGradient)"
        strokeWidth={STROKE_W}
        strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
        strokeDashoffset={DASH_OFFSET}
        strokeLinecap="round"
        transform={`rotate(${START_DEG}, ${CX}, ${CY})`}
      />

      {/* Inner white circle with shadow */}
      <Circle cx={CX} cy={CY} r={R - ms(6)} fill="url(#innerShadow)" />

      {/* Tick marks along the arc */}
      {Array.from({ length: 7 }).map((_, i) => {
        const angle = START_DEG + (ARC_DEG / 6) * i;
        const s = polar(CX, CY, R - ms(12), angle);
        const e = polar(CX, CY, R - ms(24), angle);
        return (
          <Line
            key={i}
            x1={s.x}
            y1={s.y}
            x2={e.x}
            y2={e.y}
            stroke="#D1D5DB"
            strokeWidth={ms(1.5)}
            strokeLinecap="round"
          />
        );
      })}
    </Svg>

    {/* Center text */}
    <View style={styles.gaugeCenterText}>
      <Text style={styles.gaugeScore}>{SCORE}</Text>
      <Text style={styles.gaugeOutOf}>out of {MAX_SCORE}</Text>
    </View>

    {/* 300 / 900 labels at exact arc start & end */}
    <Text style={[styles.gaugeMinMax, {
      position: 'absolute',
      left: polar(CX, CY, R + STROKE_W / 2 + ms(10), START_DEG).x - ms(18),
      top: polar(CX, CY, R + STROKE_W / 2 + ms(10), START_DEG).y - ms(4),
    }]}>{MIN_SCORE}</Text>
    <Text style={[styles.gaugeMinMax, {
      position: 'absolute',
      left: polar(CX, CY, R + STROKE_W / 2 + ms(10), START_DEG + ARC_DEG).x - ms(4),
      top: polar(CX, CY, R + STROKE_W / 2 + ms(10), START_DEG + ARC_DEG).y - ms(4),
    }]}>{MAX_SCORE}</Text>
  </View>
);

/* ───────────── Breakdown Item ───────────── */
const BreakdownItem = ({ item, showTooltip, onToggleTooltip }) => {
  const pct = (item.score / item.total) * 100;

  return (
    <View style={styles.breakdownItem}>
      <View style={styles.breakdownHeader}>
        <Text style={styles.breakdownTitle}>{item.title}</Text>
        <View style={styles.breakdownScoreRow}>
          <Text style={styles.breakdownScore}>
            {item.score}/{item.total}
          </Text>
          <TouchableOpacity onPress={onToggleTooltip}>
            <Icon
              type={Icons.Ionicons}
              name="information-circle-outline"
              size={ms(18)}
              color="#C0C0C0"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressBg}>
        {item.secondColor ? (
          <View style={{ flexDirection: 'row', height: '100%' }}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: item.color, width: `${pct * 0.6}%` },
              ]}
            />
            <View
              style={[
                styles.progressFill,
                { backgroundColor: item.secondColor, width: `${pct * 0.4}%` },
              ]}
            />
          </View>
        ) : (
          <View
            style={[
              styles.progressFill,
              { backgroundColor: item.color, width: `${pct}%` },
            ]}
          />
        )}
      </View>

      <Text style={styles.breakdownDesc}>{item.desc}</Text>

      {showTooltip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipTitle}>{item.tooltip}</Text>
          <Text style={styles.tooltipDesc}>{item.tooltipDesc}</Text>
        </View>
      )}
    </View>
  );
};

/* ───────────── Main Screen ───────────── */
const HealthScoreDetails = () => {
  const navigation = useNavigation();
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar2 />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon type={Icons.Ionicons} name="arrow-back" size={ms(22)} color={blackColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Health Continuity Score</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <ScoreGauge />

        <Text style={styles.statusTitle}>Strong & Stable</Text>
        <Text style={styles.statusSub}>
          Your engagement with health has been consistent{'\n'}over the last 3 months
        </Text>

        <View style={styles.breakdownList}>
          {BREAKDOWN_DATA.map((item, i) => (
            <BreakdownItem
              key={i}
              item={item}
              showTooltip={activeTooltip === i}
              onToggleTooltip={() =>
                setActiveTooltip(activeTooltip === i ? null : i)
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthScoreDetails;

/* ───────────── Styles ───────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: whiteColor },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingTop: ms(50),
  },
  headerTitle: {
    marginLeft: ms(12),
    fontSize: ms(16),
    fontFamily: bold,
    color: blackColor,
  },

  scroll: {
    alignItems: 'center',
    paddingHorizontal: ms(16),
  },

  gaugeContainer: { marginTop: vs(16), alignItems: 'center' },
  gaugeCenterText: {
    position: 'absolute',
    width: GAUGE_SIZE,
    height: GAUGE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeScore: { fontSize: ms(52), fontFamily: bold, color: '#166B5E' },
  gaugeOutOf: { fontSize: ms(15), color: '#777', marginTop: vs(-4) },
  gaugeMinMax: { fontSize: ms(14), color: '#666', fontWeight: '600' },

  statusTitle: {
    marginTop: vs(16),
    fontSize: ms(19),
    fontFamily: bold,
    color: blackColor,
  },
  statusSub: {
    marginTop: vs(6),
    fontSize: ms(12),
    color: '#888',
    textAlign: 'center',
    lineHeight: ms(20),
  },

  breakdownList: { width: '100%', marginTop: vs(28) },
  breakdownItem: { marginBottom: vs(20) },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownTitle: { fontSize: ms(13), fontFamily: bold, color: blackColor, flex: 1 },
  breakdownScoreRow: { flexDirection: 'row', alignItems: 'center', gap: ms(6) },
  breakdownScore: { fontSize: ms(14), fontFamily: bold },

  progressBg: {
    height: vs(6),
    backgroundColor: '#E8E8E8',
    borderRadius: ms(3),
    overflow: 'hidden',
    marginTop: vs(6),
  },
  progressFill: { height: '100%', borderRadius: ms(3) },

  breakdownDesc: { fontSize: ms(11), color: '#999', marginTop: vs(4) },

  tooltip: {
    backgroundColor: whiteColor,
    borderRadius: ms(10),
    padding: ms(12),
    marginTop: vs(8),
    elevation: 4,
  },
  tooltipTitle: { fontSize: ms(12), fontFamily: bold },
  tooltipDesc: { fontSize: ms(11), color: '#888', marginTop: vs(2) },
});
