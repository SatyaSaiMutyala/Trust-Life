import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import Modal from 'react-native-modal';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const { width } = Dimensions.get('window');

const PERIOD_COLOR = '#E8837C';
const OVULATION_COLOR = '#F5E06D';
const FERTILITY_COLOR = '#A5C8E8';
const DEFAULT_COLOR = '#3D6B5E';

const TOTAL_DAYS = 31;
const ANGLE_PER_DAY = 360 / TOTAL_DAYS;

const PERIOD_DAYS = [1, 2, 3, 4, 5];
const OVULATION_DAYS = [13, 14, 15, 16];
const FERTILITY_DAYS = [10, 11, 12, 17, 18];

const getPhaseColor = (day) => {
    if (PERIOD_DAYS.includes(day)) return PERIOD_COLOR;
    if (OVULATION_DAYS.includes(day)) return OVULATION_COLOR;
    if (FERTILITY_DAYS.includes(day)) return FERTILITY_COLOR;
    return DEFAULT_COLOR;
};

const polarToCartesian = (centerX, centerY, radius, angleDeg) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
        x: centerX + radius * Math.cos(angleRad),
        y: centerY + radius * Math.sin(angleRad),
    };
};

const createArcSegment = (cx, cy, outerR, innerR, startAngle, endAngle) => {
    const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
    const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
    const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
    const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
        'Z',
    ].join(' ');
};

const MenstrualCycleDashboard = () => {
    const navigation = useNavigation();
    const [readingMode, setReadingMode] = useState('manual');
    const [showBottomSheet, setShowBottomSheet] = useState(false);

    const subtitleText = readingMode === 'manual' ? 'Manual Reading' : 'Device Connected';

    const readings = [
        { id: '1', date: 'Mon, 11 Feb,2026,12:30 PM', startDate: '24 Feb,2026', endDate: '24 Feb,2026', flow: 'Light', mood: 'Relaxed', moodEmoji: '😊' },
        { id: '2', date: 'Mon, 11 Feb,2026,12:30 PM', startDate: '24 Feb,2026', endDate: '24 Feb,2026', flow: 'Light', mood: 'Relaxed', moodEmoji: '😊' },
        { id: '3', date: 'Mon, 11 Feb,2026,12:30 PM', startDate: '24 Feb,2026', endDate: '24 Feb,2026', flow: 'Light', mood: 'Relaxed', moodEmoji: '😊' },
        { id: '4', date: 'Mon, 11 Feb,2026,12:30 PM', startDate: '24 Feb,2026', endDate: '24 Feb,2026', flow: 'Light', mood: 'Relaxed', moodEmoji: '😊' },
    ];

    const hasData = readings.length > 0;

    const chartSize = width * 0.78;
    const cx = chartSize / 2;
    const cy = chartSize / 2;
    const outerRadius = chartSize / 2 - ms(18);
    const innerRadius = outerRadius - ms(26);
    const textRadius = outerRadius + ms(14);
    const gap = 0.8;

    const days = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Menstrual Cycle</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerIconBg} onPress={() => navigation.navigate('AddMenstrualCycle')}>
                            <Icon type={Icons.Ionicons} name="add" color={blackColor} size={ms(20)} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Circular Chart */}
                <View style={styles.chartWrapper}>
                    <Svg width={chartSize} height={chartSize}>
                        {/* Ring Segments */}
                        {days.map((day) => {
                            const startAngle = (day - 1) * ANGLE_PER_DAY + gap;
                            const endAngle = day * ANGLE_PER_DAY - gap;
                            const color = getPhaseColor(day);

                            return (
                                <Path
                                    key={`seg-${day}`}
                                    d={createArcSegment(cx, cy, outerRadius, innerRadius, startAngle, endAngle)}
                                    fill={color}
                                />
                            );
                        })}

                        {/* Day Numbers */}
                        {days.map((day) => {
                            const angle = (day - 0.5) * ANGLE_PER_DAY;
                            const pos = polarToCartesian(cx, cy, textRadius, angle);
                            const rotation = angle;

                            return (
                                <SvgText
                                    key={`txt-${day}`}
                                    x={pos.x}
                                    y={pos.y}
                                    fontSize={ms(10)}
                                    fontWeight="600"
                                    fill={blackColor}
                                    textAnchor="middle"
                                    alignmentBaseline="central"
                                    transform={`rotate(${rotation}, ${pos.x}, ${pos.y})`}
                                >
                                    {day}
                                </SvgText>
                            );
                        })}

                        {/* Center Text */}
                        <SvgText
                            x={cx}
                            y={cy - ms(14)}
                            fontSize={ms(14)}
                            fontWeight="500"
                            fill="#888"
                            textAnchor="middle"
                            alignmentBaseline="central"
                        >
                            Day
                        </SvgText>
                        <SvgText
                            x={cx}
                            y={cy + ms(6)}
                            fontSize={ms(22)}
                            fontWeight="bold"
                            fill={blackColor}
                            textAnchor="middle"
                            alignmentBaseline="central"
                        >
                            02
                        </SvgText>
                        <SvgText
                            x={cx}
                            y={cy + ms(24)}
                            fontSize={ms(11)}
                            fontWeight="400"
                            fill="#888"
                            textAnchor="middle"
                            alignmentBaseline="central"
                        >
                            of current cycle
                        </SvgText>
                    </Svg>
                </View>

                {/* Legend */}
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: PERIOD_COLOR }]} />
                        <Text style={styles.legendText}>Period days</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: OVULATION_COLOR }]} />
                        <Text style={styles.legendText}>Ovulation</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: FERTILITY_COLOR }]} />
                        <Text style={styles.legendText}>Fertility days</Text>
                    </View>
                </View>

                {hasData ? (
                    <View style={styles.recentSection}>
                        <View style={styles.recentHeader}>
                            <Text style={styles.recentTitle}>Recently Added</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('MenstrualCycleReadings', { readings })}>
                                <Text style={styles.viewAll}>View all</Text>
                            </TouchableOpacity>
                        </View>
                        {readings.slice(0, 3).map((item) => (
                            <View key={item.id} style={styles.readingCard}>
                                <View style={styles.readingCardHeader}>
                                    <Text style={styles.readingDate}>{item.date}</Text>
                                    <TouchableOpacity style={styles.readingMenu}>
                                        <Icon type={Icons.Ionicons} name="ellipsis-horizontal" color="#999" size={ms(20)} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.dateInfoRow}>
                                    <Text style={styles.dateInfoLabel}>Starting</Text>
                                    <Text style={styles.dateInfoValue}>{item.startDate}</Text>
                                </View>
                                <View style={styles.dateInfoRow}>
                                    <Text style={styles.dateInfoLabel}>Ending</Text>
                                    <Text style={styles.dateInfoValue}>{item.endDate}</Text>
                                </View>
                                <View style={styles.badgesRow}>
                                    <View style={styles.badge}>
                                        <View style={styles.badgeDot} />
                                        <Text style={styles.badgeText}>{item.flow}</Text>
                                    </View>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeEmoji}>{item.moodEmoji}</Text>
                                        <Text style={styles.badgeText}>{item.mood}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.exploreSection}>
                        <Text style={styles.exploreTitle}>Explore</Text>
                        <View style={styles.exploreCard}>
                            <View style={styles.exploreCardIcon}>
                                <Icon type={Icons.Ionicons} name="calendar-outline" color={primaryColor} size={ms(24)} />
                            </View>
                            <View style={styles.exploreCardContent}>
                                <Text style={styles.exploreCardTitle}>How to Add Menstrual cycle Reading</Text>
                                <Text style={styles.exploreCardDesc}>
                                    Enter your temperature value, select the unit and measurement method, then save.
                                </Text>
                                <TouchableOpacity>
                                    <Text style={styles.learnMore}>Learn More</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

            </ScrollView>

            {/* Bottom Sheet Modal */}
            <Modal
                isVisible={showBottomSheet}
                onBackdropPress={() => setShowBottomSheet(false)}
                onBackButtonPress={() => setShowBottomSheet(false)}
                onSwipeComplete={() => setShowBottomSheet(false)}
                swipeDirection="down"
                style={styles.bottomSheetModal}
                backdropOpacity={0.5}
            >
                <View style={styles.bottomSheet}>
                    <View style={styles.handleBar} />
                    <View style={styles.bottomSheetHeader}>
                        <Text style={styles.bottomSheetTitle}>Choose you Preferred</Text>
                        <TouchableOpacity onPress={() => setShowBottomSheet(false)}>
                            <Icon type={Icons.Ionicons} name="close" color={blackColor} size={ms(22)} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.preferredOption}
                        onPress={() => { setReadingMode('device'); setShowBottomSheet(false); }}
                    >
                        <View style={styles.preferredOptionLeft}>
                            <View style={[styles.preferredIconBg, { backgroundColor: '#E8F5F3' }]}>
                                <Image source={require('../../assets/img/watch.png')} style={styles.preferredImg} />
                            </View>
                            <View style={styles.preferredTextWrap}>
                                <Text style={styles.preferredOptionText}>Smart Device Reading</Text>
                                <Text style={styles.preferredOptionDesc}>Sync readings automatically from your connected device.</Text>
                            </View>
                        </View>
                        {readingMode === 'device' ? (
                            <View style={styles.checkCircle}>
                                <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(14)} />
                            </View>
                        ) : (
                            <View style={{ marginRight: ms(5) }}>
                                <Icon type={Icons.FontAwesome} name="circle-thin" color={blackColor} size={ms(28)} />
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.preferredOption}
                        onPress={() => { setReadingMode('manual'); setShowBottomSheet(false); }}
                    >
                        <View style={styles.preferredOptionLeft}>
                            <View style={[styles.preferredIconBg, { backgroundColor: '#FFF3E0' }]}>
                                <Image source={require('../../assets/img/mobile.png')} style={styles.preferredImg} />
                            </View>
                            <View style={styles.preferredTextWrap}>
                                <Text style={styles.preferredOptionText}>Manual Readings</Text>
                                <Text style={styles.preferredOptionDesc}>Enter your readings manually anytime.</Text>
                            </View>
                        </View>
                        {readingMode === 'manual' ? (
                            <View style={styles.checkCircle}>
                                <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(14)} />
                            </View>
                        ) : (
                            <View style={{ marginRight: ms(5) }}>
                                <Icon type={Icons.FontAwesome} name="circle-thin" color={blackColor} size={ms(28)} />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default MenstrualCycleDashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingBottom: vs(30),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(10),
    },
    backButton: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerCenter: {
        flex: 1,
    },
    headerTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(2),
    },
    headerSubtitle: {
        fontSize: ms(12),
        color: '#888',
        marginRight: ms(4),
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
    },
    headerIconBg: {
        width: ms(38),
        height: ms(38),
        borderRadius: ms(19),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    redDot: {
        position: 'absolute',
        top: ms(6),
        right: ms(6),
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        backgroundColor: 'red',
    },

    // Circular Chart
    chartWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: vs(10),
        marginBottom: vs(20),
    },

    // Legend
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: ms(18),
        marginBottom: vs(25),
        paddingHorizontal: ms(20),
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(6),
    },
    legendDot: {
        width: ms(10),
        height: ms(10),
        borderRadius: ms(5),
    },
    legendText: {
        fontSize: ms(12),
        fontWeight: '500',
        color: '#555',
    },

    // Recently Added
    recentSection: {
        paddingHorizontal: ms(15),
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(12),
    },
    recentTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    viewAll: {
        fontSize: ms(13),
        color: '#888',
        fontWeight: '500',
    },
    readingCard: {
        backgroundColor: '#F6F8FB',
        borderRadius: ms(12),
        paddingHorizontal: ms(15),
        paddingVertical: vs(12),
        marginBottom: vs(8),
    },
    readingCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(6),
    },
    readingDate: {
        fontSize: ms(11),
        color: '#888',
    },
    readingMenu: {
        width: ms(30),
        height: ms(30),
        borderRadius: ms(15),
        backgroundColor: '#E8ECF0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(4),
    },
    dateInfoLabel: {
        fontSize: ms(12),
        color: '#888',
    },
    dateInfoValue: {
        fontSize: ms(12),
        fontWeight: '600',
        color: blackColor,
    },
    badgesRow: {
        flexDirection: 'row',
        gap: ms(8),
        marginTop: vs(6),
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(16),
        paddingHorizontal: ms(10),
        paddingVertical: vs(5),
        gap: ms(5),
    },
    badgeDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        backgroundColor: PERIOD_COLOR,
    },
    badgeEmoji: {
        fontSize: ms(14),
    },
    badgeText: {
        fontSize: ms(11),
        fontWeight: '500',
        color: blackColor,
    },

    // Explore
    exploreSection: {
        paddingHorizontal: ms(15),
    },
    exploreTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(12),
    },
    exploreCard: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderRadius: ms(12),
        padding: ms(15),
        marginBottom: vs(12),
        alignItems: 'flex-start',
    },
    exploreCardIcon: {
        width: ms(44),
        height: ms(44),
        borderRadius: ms(22),
        backgroundColor: '#E8F5F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    exploreCardContent: {
        flex: 1,
    },
    exploreCardTitle: {
        fontSize: ms(13),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(4),
    },
    exploreCardDesc: {
        fontSize: ms(11),
        color: '#888',
        lineHeight: ms(16),
        marginBottom: vs(6),
    },
    learnMore: {
        fontSize: ms(12),
        color: primaryColor,
        fontWeight: '600',
    },

    // Bottom Sheet
    bottomSheetModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    bottomSheet: {
        backgroundColor: whiteColor,
        borderTopLeftRadius: ms(20),
        borderTopRightRadius: ms(20),
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
        paddingTop: vs(10),
    },
    handleBar: {
        width: ms(40),
        height: vs(4),
        backgroundColor: '#DDD',
        borderRadius: ms(2),
        alignSelf: 'center',
        marginBottom: vs(15),
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(20),
    },
    bottomSheetTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    preferredOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: vs(14),
        backgroundColor: '#F1F5F9',
        marginVertical: ms(5),
        paddingHorizontal: ms(10),
        borderRadius: ms(15),
    },
    preferredOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    preferredIconBg: {
        width: ms(44),
        height: ms(44),
        borderRadius: ms(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    preferredImg: {
        width: ms(28),
        height: ms(28),
        resizeMode: 'contain',
    },
    preferredTextWrap: {
        flex: 1,
    },
    preferredOptionText: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    preferredOptionDesc: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
        lineHeight: ms(16),
    },
    checkCircle: {
        width: ms(26),
        height: ms(26),
        borderRadius: ms(13),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
