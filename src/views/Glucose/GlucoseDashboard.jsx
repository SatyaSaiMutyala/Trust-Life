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
import Svg, { Path, Line, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Modal from 'react-native-modal';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const { width } = Dimensions.get('window');

const TIME_TABS = ['Day', 'Week', 'Month', '3Mon', 'Yearly'];

const FASTING_COLOR = '#E53935';
const BEFORE_MEAL_COLOR = '#1E88E5';
const AFTER_MEAL_COLOR = '#F9A825';
const BEDTIME_COLOR = '#333333';

const getTypeColor = (type) => {
    switch (type) {
        case 'Fasting': return FASTING_COLOR;
        case 'Before Meal': return BEFORE_MEAL_COLOR;
        case 'After Meal': return AFTER_MEAL_COLOR;
        case 'Bed time': return BEDTIME_COLOR;
        default: return '#999';
    }
};

const GlucoseDashboard = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('Day');
    const [readingMode, setReadingMode] = useState('manual');
    const [showBottomSheet, setShowBottomSheet] = useState(false);

    const subtitleText = readingMode === 'manual' ? 'Manual Reading' : 'Device Connected';

    // Sample readings data
    const readings = [
        { id: '1', date: 'Mon, 11 Feb,2026,12:30 PM', value: 25, type: 'Fasting' },
        { id: '2', date: 'Mon, 11 Feb,2026,12:30 PM', value: 60, type: 'Before Meal' },
        { id: '3', date: 'Mon, 11 Feb,2026,12:30 PM', value: 54, type: 'After Meal' },
        { id: '4', date: 'Mon, 11 Feb,2026,12:30 PM', value: 54, type: 'After Meal' },
        { id: '5', date: 'Mon, 11 Feb,2026,12:30 PM', value: 60, type: 'Bed time' },
        { id: '6', date: 'Mon, 11 Feb,2026,12:30 PM', value: 25, type: 'Fasting' },
    ];

    const hasData = readings.length > 0;

    // Chart dimensions
    const chartWidth = width - ms(80);
    const chartHeight = vs(120);

    // Fasting data points
    const fastingPoints = [
        { x: 0, y: 0.85 },
        { x: 0.15, y: 0.75 },
        { x: 0.3, y: 0.65 },
        { x: 0.45, y: 0.55 },
        { x: 0.6, y: 0.5 },
        { x: 0.75, y: 0.55 },
        { x: 0.9, y: 0.6 },
        { x: 1, y: 0.65 },
    ];

    // Before Meal data points
    const beforeMealPoints = [
        { x: 0, y: 0.7 },
        { x: 0.15, y: 0.6 },
        { x: 0.3, y: 0.5 },
        { x: 0.45, y: 0.42 },
        { x: 0.6, y: 0.38 },
        { x: 0.75, y: 0.42 },
        { x: 0.9, y: 0.48 },
        { x: 1, y: 0.52 },
    ];

    // After Meal data points
    const afterMealPoints = [
        { x: 0, y: 0.55 },
        { x: 0.15, y: 0.48 },
        { x: 0.3, y: 0.4 },
        { x: 0.45, y: 0.32 },
        { x: 0.6, y: 0.28 },
        { x: 0.75, y: 0.22 },
        { x: 0.9, y: 0.18 },
        { x: 1, y: 0.15 },
    ];

    // Bedtime data points
    const bedtimePoints = [
        { x: 0, y: 0.4 },
        { x: 0.15, y: 0.35 },
        { x: 0.3, y: 0.28 },
        { x: 0.45, y: 0.22 },
        { x: 0.6, y: 0.18 },
        { x: 0.75, y: 0.15 },
        { x: 0.9, y: 0.12 },
        { x: 1, y: 0.1 },
    ];

    // Create smooth curve path
    const createCurvePath = (dataPoints) => {
        const points = dataPoints.map(p => ({
            x: p.x * chartWidth,
            y: p.y * chartHeight,
        }));

        let path = `M ${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
            const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
            path += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
        }
        return path;
    };

    // Create filled area path
    const createAreaPath = (dataPoints) => {
        const curvePath = createCurvePath(dataPoints);
        const lastPoint = dataPoints[dataPoints.length - 1];
        return `${curvePath} L ${lastPoint.x * chartWidth},${chartHeight} L 0,${chartHeight} Z`;
    };

    // X-axis labels
    const xLabels = ['12:00', '12:00', '12:00', '12:00', '12:00'];

    // Y-axis labels
    const yLabels = ['40', '30', '20', '10', '0'];

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
                        <Text style={styles.headerTitle}>Glucose</Text>
                        <TouchableOpacity
                            style={styles.subtitleRow}
                            onPress={() => setShowBottomSheet(true)}
                        >
                            <Text style={styles.headerSubtitle}>{subtitleText}</Text>
                            <Icon type={Icons.Ionicons} name="chevron-down" color="#888" size={ms(14)} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerIconBg} onPress={() => navigation.navigate('SmartDeviceTracking')}>
                            <Icon type={Icons.Entypo} name="mobile" color={blackColor} size={ms(18)} />
                            <View style={styles.redDot} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIconBg} onPress={() => navigation.navigate('AddGlucoseReading')}>
                            <Icon type={Icons.Ionicons} name="add" color={blackColor} size={ms(20)} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Time Period Tabs */}
                <View style={styles.tabsContainer}>
                    {TIME_TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, selectedTab === tab && styles.activeTab]}
                            onPress={() => setSelectedTab(tab)}
                        >
                            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Date Navigator */}
                <View style={styles.dateNav}>
                    <TouchableOpacity>
                        <Icon type={Icons.Ionicons} name="chevron-back" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.dateText}>Today</Text>
                    <TouchableOpacity>
                        <Icon type={Icons.Ionicons} name="chevron-forward" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                </View>

                {/* Glucose Chart */}
                <View style={styles.chartCard}>
                    {/* Legend */}
                    <View style={styles.legendRow}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: FASTING_COLOR }]} />
                            <Text style={styles.legendText}>Fasting</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: BEFORE_MEAL_COLOR }]} />
                            <Text style={styles.legendText}>Before Meal</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: AFTER_MEAL_COLOR }]} />
                            <Text style={styles.legendText}>After meal</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: BEDTIME_COLOR }]} />
                            <Text style={styles.legendText}>Bed time</Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        {/* Y-axis labels */}
                        <View style={styles.yAxisLabels}>
                            {yLabels.map((label, i) => (
                                <Text key={i} style={styles.axisLabel}>{label}</Text>
                            ))}
                        </View>

                        <View style={styles.chartArea}>
                            <Svg width={chartWidth} height={chartHeight}>
                                <Defs>
                                    <SvgLinearGradient id="afterMealGradient" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0" stopColor={AFTER_MEAL_COLOR} stopOpacity="0.1" />
                                        <Stop offset="1" stopColor={AFTER_MEAL_COLOR} stopOpacity="0.01" />
                                    </SvgLinearGradient>
                                </Defs>

                                {/* Horizontal grid lines */}
                                {[0, 0.25, 0.5, 0.75, 1].map((pos, i) => (
                                    <Line
                                        key={i}
                                        x1="0"
                                        y1={pos * chartHeight}
                                        x2={chartWidth}
                                        y2={pos * chartHeight}
                                        stroke="#E5E7EB"
                                        strokeWidth="1"
                                        strokeDasharray="5,5"
                                    />
                                ))}

                                {/* After Meal filled area */}
                                <Path
                                    d={createAreaPath(afterMealPoints)}
                                    fill="url(#afterMealGradient)"
                                />

                                {/* Fasting curve line */}
                                <Path
                                    d={createCurvePath(fastingPoints)}
                                    fill="none"
                                    stroke={FASTING_COLOR}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Before Meal curve line */}
                                <Path
                                    d={createCurvePath(beforeMealPoints)}
                                    fill="none"
                                    stroke={BEFORE_MEAL_COLOR}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* After Meal curve line */}
                                <Path
                                    d={createCurvePath(afterMealPoints)}
                                    fill="none"
                                    stroke={AFTER_MEAL_COLOR}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Bedtime curve line */}
                                <Path
                                    d={createCurvePath(bedtimePoints)}
                                    fill="none"
                                    stroke={BEDTIME_COLOR}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </Svg>

                            {/* X-axis labels */}
                            <View style={styles.xAxisLabels}>
                                {xLabels.map((label, i) => (
                                    <Text key={i} style={styles.axisLabel}>{label}</Text>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                {hasData ? (
                    /* Recently Added Section */
                    <View style={styles.recentSection}>
                        <View style={styles.recentHeader}>
                            <Text style={styles.recentTitle}>Recently Added</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('GlucoseReadings', { readings })}>
                                <Text style={styles.viewAll}>View all</Text>
                            </TouchableOpacity>
                        </View>
                        {readings.slice(0, 4).map((item) => (
                            <View key={item.id} style={styles.readingCard}>
                                <View style={styles.readingCardHeader}>
                                    <Text style={styles.readingDate}>{item.date}</Text>
                                    <TouchableOpacity style={styles.readingMenu}>
                                        <Icon type={Icons.Ionicons} name="ellipsis-horizontal" color="#999" size={ms(20)} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.readingValueRow}>
                                    <Text style={styles.readingValue}>{item.value} mg/dL</Text>
                                    <View style={styles.readingTypeWrap}>
                                        <View style={[styles.readingDot, { backgroundColor: getTypeColor(item.type) }]} />
                                        <Text style={styles.readingTypeText}>{item.type}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    /* Explore Section */
                    <View style={styles.exploreSection}>
                        <Text style={styles.exploreTitle}>Explore</Text>

                        <View style={styles.exploreCard}>
                            <View style={styles.exploreCardIcon}>
                                <Icon type={Icons.Ionicons} name="fitness-outline" color={primaryColor} size={ms(24)} />
                            </View>
                            <View style={styles.exploreCardContent}>
                                <Text style={styles.exploreCardTitle}>How to add Glucose Reading</Text>
                                <Text style={styles.exploreCardDesc}>
                                    Enter your glucose value, select the reading type, and save to track your sugar levels...
                                </Text>
                                <TouchableOpacity>
                                    <Text style={styles.learnMore}>Learn More</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.exploreCard}>
                            <View style={styles.exploreCardIcon}>
                                <Icon type={Icons.Ionicons} name="watch-outline" color={primaryColor} size={ms(24)} />
                            </View>
                            <View style={styles.exploreCardContent}>
                                <Text style={styles.exploreCardTitle}>How to Connect Device to Get Glucose level</Text>
                                <Text style={styles.exploreCardDesc}>
                                    CConnect your glucose monitoring device to automatically sync and track your sugar...
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
                    {/* Handle bar */}
                    <View style={styles.handleBar} />

                    {/* Header */}
                    <View style={styles.bottomSheetHeader}>
                        <Text style={styles.bottomSheetTitle}>Choose you Preferred</Text>
                        <TouchableOpacity onPress={() => setShowBottomSheet(false)}>
                            <Icon type={Icons.Ionicons} name="close" color={blackColor} size={ms(22)} />
                        </TouchableOpacity>
                    </View>

                    {/* Smart Device Reading */}
                    <TouchableOpacity
                        style={styles.preferredOption}
                        onPress={() => {
                            setReadingMode('device');
                            setShowBottomSheet(false);
                        }}
                    >
                        <View style={styles.preferredOptionLeft}>
                            <View style={[styles.preferredIconBg, { backgroundColor: '#E8F5F3' }]}>
                                <Image source={require('../../assets/img/glucoseimg.png')} style={styles.preferredImg} />
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

                    {/* Manual Readings */}
                    <TouchableOpacity
                        style={styles.preferredOption}
                        onPress={() => {
                            setReadingMode('manual');
                            setShowBottomSheet(false);
                        }}
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

export default GlucoseDashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingBottom: vs(30),
    },
    // Header
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

    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        marginHorizontal: ms(15),
        marginTop: vs(10),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: vs(10),
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: primaryColor,
    },
    tabText: {
        fontSize: ms(13),
        color: '#888',
        fontWeight: '500',
    },
    activeTabText: {
        color: primaryColor,
        fontWeight: '700',
    },

    // Date Navigator
    dateNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: vs(15),
        gap: ms(20),
        paddingHorizontal: ms(20),
        marginBottom: ms(10),
    },
    dateText: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },

    // Chart
    chartCard: {
        marginHorizontal: ms(15),
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(15),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: ms(14),
        marginBottom: vs(12),
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(5),
    },
    legendDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
    },
    legendText: {
        fontSize: ms(10),
        fontWeight: '600',
        color: '#666',
    },
    chartContainer: {
        flexDirection: 'row',
    },
    yAxisLabels: {
        justifyContent: 'space-between',
        paddingRight: ms(8),
        paddingVertical: vs(2),
    },
    chartArea: {
        flex: 1,
    },
    axisLabel: {
        fontSize: ms(10),
        color: '#999',
    },
    xAxisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(5),
        paddingHorizontal: ms(2),
    },

    // Recently Added
    recentSection: {
        marginTop: vs(25),
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
        marginBottom: vs(8),
    },
    readingDate: {
        fontSize: ms(11),
        color: '#888',
    },
    readingValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    readingValue: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: blackColor,
    },
    readingTypeWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(6),
    },
    readingDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
    },
    readingTypeText: {
        fontSize: ms(12),
        color: '#666',
        fontWeight: '500',
    },
    readingMenu: {
        width: ms(30),
        height: ms(30),
        borderRadius: ms(15),
        backgroundColor: '#E8ECF0',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Explore
    exploreSection: {
        marginTop: vs(25),
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

    // Bottom Sheet Modal
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
