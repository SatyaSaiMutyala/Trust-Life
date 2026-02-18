import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, G, Line, Text as SvgText } from 'react-native-svg';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../utils/globalColors';

// ── Gauge helpers ─────────────────────────────────────────────────────────
const toRad = (deg) => (deg * Math.PI) / 180;

const polar = (cx, cy, r, deg) => ({
    x: cx + r * Math.cos(toRad(deg)),
    y: cy + r * Math.sin(toRad(deg)),
});

// Stroke-based arc path from startDeg → endDeg (clockwise, SVG y-down)
const arcD = (cx, cy, r, start, end) => {
    const s = polar(cx, cy, r, start);
    const e = polar(cx, cy, r, end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
};

// ── Gauge config ──────────────────────────────────────────────────────────
const CX = 95;
const CY = 100;
const R = 80;
const SW = 18;    // stroke width
const GAP = 3;     // degrees gap between segments
const SCORE = 82;

// 180°=left → 360°=right, clockwise through the top (270°=top)
// score 100 → 180° (stable, far left)
// score 0   → 360° (critical, far right)
const scoreToAngle = (s) => 180 + (1 - s / 100) * 180;
const NEEDLE_ANGLE = scoreToAngle(SCORE); // 212.4°

const SEGMENTS = [
    { color: '#4CAF50', start: 180 + GAP, end: 225 - GAP, label: 'Stable', labelDeg: 202 },
    { color: '#FF9800', start: 225 + GAP, end: 270 - GAP, label: 'Moderate', labelDeg: 247 },
    { color: '#FFD600', start: 270 + GAP, end: 315 - GAP, label: 'Attention', labelDeg: 292 },
    { color: '#F44336', start: 315 + GAP, end: 360 - GAP, label: 'Critical', labelDeg: 337 },
];

// ── HealthGauge ────────────────────────────────────────────────────────────
const HealthGauge = () => {
    // Needle: triangle pointing from center toward arc
    const tip = polar(CX, CY, R - SW / 2 - 2, NEEDLE_ANGLE);
    const perp1 = polar(CX, CY, 5, NEEDLE_ANGLE + 90);
    const perp2 = polar(CX, CY, 5, NEEDLE_ANGLE - 90);
    const needlePath = `M ${tip.x.toFixed(1)} ${tip.y.toFixed(1)} L ${perp1.x.toFixed(1)} ${perp1.y.toFixed(1)} L ${perp2.x.toFixed(1)} ${perp2.y.toFixed(1)} Z`;

    return (
        <Svg width={190} height={105} viewBox="0 0 190 105">
            {/* Background track */}
            <Path
                d={arcD(CX, CY, R, 181, 359)}
                fill="none"
                stroke="#E8E8E8"
                strokeWidth={SW}
                strokeLinecap="butt"
            />

            {/* Colored segments */}
            {SEGMENTS.map((seg) => {
                const lp = polar(CX, CY, R, seg.labelDeg);
                const rot = seg.labelDeg - 270;
                return (
                    <G key={seg.label}>
                        <Path
                            d={arcD(CX, CY, R, seg.start, seg.end)}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={SW}
                            strokeLinecap="butt"
                        />
                        <SvgText
                            x={lp.x.toFixed(1)}
                            y={lp.y.toFixed(1)}
                            fontSize="7.5"
                            fontWeight="600"
                            fill={whiteColor}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            transform={`rotate(${rot.toFixed(1)}, ${lp.x.toFixed(1)}, ${lp.y.toFixed(1)})`}
                        >
                            {seg.label}
                        </SvgText>
                    </G>
                );
            })}

            {/* Needle */}
            <Path d={needlePath} fill="#222" />

            {/* Center dot */}
            <Circle cx={CX} cy={CY} r={5} fill="#444" />

            {/* Score circle */}
            <Circle cx={CX} cy={CY} r={19} fill={primaryColor} />
            <SvgText
                x={CX}
                y={CY - 3}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="11"
                fontWeight="bold"
                fill={whiteColor}
            >
                {SCORE}
            </SvgText>
            <SvgText
                x={CX}
                y={CY + 7}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="5"
                fill={whiteColor}
            >
                Score
            </SvgText>
        </Svg>
    );
};

// ── Reusable pieces ───────────────────────────────────────────────────────
const Card = ({ children }) => <View style={styles.card}>{children}</View>;

const CardHeader = ({ label, value, valueGreen }) => (
    <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={[styles.cardValue, valueGreen && { color: primaryColor }]}>{value}</Text>
    </View>
);

const SubRow = ({ label, value }) => (
    <View style={styles.subRow}>
        <Text style={styles.subLabel}>{label}</Text>
        <Text style={styles.subValue}>{value}</Text>
    </View>
);

const BulletRow = ({ label, value }) => (
    <View style={styles.subRow}>
        <Text style={styles.subLabel}>• {label}</Text>
        <Text style={styles.subValue}>{value}</Text>
    </View>
);

const CheckBtn = ({ onPress }) => (
    <TouchableOpacity style={styles.checkBtn} activeOpacity={0.8} onPress={onPress}>
        <Text style={styles.checkBtnText}>Check Details</Text>
    </TouchableOpacity>
);

// ── Main screen ───────────────────────────────────────────────────────────
const CheckHealthStatus = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(22)} color={blackColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Check Health Status</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* ── Card 1: Health Score ── */}
                <Card>
                    <Text style={styles.cardTitle}>My Health Score card</Text>
                    <View style={styles.scoreRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.statusLabel}>Health Status</Text>
                            <Text style={[styles.statusValue, { color: '#4CAF50' }]}>Stable</Text>
                            <View style={{ marginTop: vs(10), alignSelf: 'flex-start' }}>
                                <CheckBtn />
                            </View>
                        </View>
                        <HealthGauge />
                    </View>
                </Card>

                {/* ── Card 2: Health Risk Alerts ── */}
                <Card>
                    <CardHeader label="My Health Risk Alerts :" value="0" />
                    <View style={styles.btnRight}>
                        <CheckBtn />
                    </View>
                </Card>

                {/* ── Card 3: Active Health Conditions ── */}
                <Card>
                    <CardHeader label="My Active Health Conditions :" value="2" />
                    <SubRow label="Acute :" value="0" />
                    <SubRow label="Chronic :" value="0" />
                    <SubRow label="Chronic Progressive :" value="0" />
                    <SubRow label="Genetic :" value="0" />
                    <SubRow label="Life threats :" value="0" />
                    <View style={styles.btnRight}>
                        <CheckBtn />
                    </View>
                </Card>

                {/* ── Card 4: Vitals Monitoring ── */}
                <Card>
                    <CardHeader label="My Vitals Monitoring :" value="Stable : 10" />
                    <SubRow label="Concern :" value="0" />
                    <SubRow label="Needs Attention :" value="0" />
                    <View style={styles.btnRight}>
                        <CheckBtn onPress={() => navigation.navigate('AnalysisCheck')} />
                    </View>
                </Card>

                {/* ── Card 5: Lifestyle Habits ── */}
                <Card>
                    <CardHeader label="My Lifestyle Habits Monitoring :" value="Stable" valueGreen />
                    <SubRow label="Food Habits :" value="0" />
                    <SubRow label="Sleep/Rest :" value="0" />
                    <SubRow label="Fitness :" value="0" />
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: vs(3) }}>
                        <Text style={{ fontSize: ms(13), color: '#444', flex: 1 }}>Medication</Text>
                        <Text style={{ fontSize: ms(13), color: '#444', fontWeight: '500', width: ms(90) }}>0</Text>
                    </View>
                    <View style={styles.btnRight}>
                        <CheckBtn />
                    </View>
                </Card>

                {/* ── Card 6: Health Monitoring ── */}
                <Card>
                    <CardHeader label="My Health Monitoring :" value="Stable" />
                    <BulletRow label="BP :" value="Stable" />
                    <BulletRow label="Glucose :" value="Stable" />
                    <BulletRow label="Menstrual Cycle :" value="Stable" />
                    <View style={styles.btnRight}>
                        <CheckBtn />
                    </View>
                </Card>

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default CheckHealthStatus;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },

    // ── Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(12),
    },
    backBtn: {
        marginRight: ms(12),
        width: ms(32),
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },

    scroll: {
        paddingHorizontal: ms(14),
        paddingTop: vs(14),
        paddingBottom: vs(20),
        gap: vs(12),
    },

    // ── Card
    card: {
        backgroundColor: '#F1F5F9',
        borderRadius: ms(10),
        padding: ms(14),
    },
    cardTitle: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(8),
    },

    // ── Score section
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(8),
    },
    statusLabel: {
        fontSize: ms(11),
        color: '#888',
    },
    statusValue: {
        fontSize: ms(14),
        fontWeight: 'bold',
        marginTop: vs(2),
    },

    // ── Card header row
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    cardLabel: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
        flex: 1,
        flexWrap: 'wrap',
    },
    cardValue: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: blackColor,
        width: ms(90),
    },

    // ── Sub rows
    subRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(3),
    },
    subLabel: {
        fontSize: ms(13),
        color: '#444',
    },
    subValue: {
        fontSize: ms(13),
        color: '#444',
        fontWeight: '500',
        width: ms(90),
    },

    // ── Buttons
    btnRight: {
        alignItems: 'flex-end',
        marginTop: vs(8),
    },
    rowWithBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
    },
    checkBtn: {
        backgroundColor: primaryColor,
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: vs(6),
    },
    checkBtnText: {
        color: whiteColor,
        fontSize: ms(12),
        fontWeight: '600',
    },
});
