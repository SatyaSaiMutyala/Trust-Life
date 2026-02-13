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
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../utils/globalColors';

const { width } = Dimensions.get('window');

const TIME_TABS = ['Day', 'Week', 'Month', '3Mon', 'Yearly'];

const HeartRateDashboard = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('Day');
    const [readingMode, setReadingMode] = useState('manual'); // 'manual' or 'device'
    const [showBottomSheet, setShowBottomSheet] = useState(false);

    const subtitleText = readingMode === 'manual' ? 'Manual Reading' : 'Device Connected';

    // Sample readings data (replace with real data from API/storage)
    const readings = [
        { id: '1', date: 'Mon, 11 Feb,2026,12:30 PM', bpm: 25 },
        { id: '2', date: 'Mon, 11 Feb,2026,12:30 PM', bpm: 25 },
        { id: '3', date: 'Mon, 11 Feb,2026,12:30 PM', bpm: 25 },
        { id: '4', date: 'Mon, 11 Feb,2026,12:30 PM', bpm: 25 },
    ];

    const hasData = readings.length > 0;

    // Chart dimensions
    const chartWidth = width - ms(80);
    const chartHeight = vs(120);

    // Sample BPM data points (normalized 0-1 for Y axis, where 0 = top, 1 = bottom)
    const dataPoints = [
        { x: 0, y: 0.85 },
        { x: 0.12, y: 0.7 },
        { x: 0.24, y: 0.55 },
        { x: 0.36, y: 0.45 },
        { x: 0.48, y: 0.38 },
        { x: 0.6, y: 0.35 },
        { x: 0.72, y: 0.4 },
        { x: 0.84, y: 0.5 },
        { x: 1, y: 0.6 },
    ];

    // Highlighted point index (the one showing "25 BPM" tooltip)
    const highlightIndex = 5;

    // Create smooth curve path
    const createCurvePath = () => {
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

    // Create filled area path (under the curve)
    const createAreaPath = () => {
        const curvePath = createCurvePath();
        const lastPoint = dataPoints[dataPoints.length - 1];
        return `${curvePath} L ${lastPoint.x * chartWidth},${chartHeight} L 0,${chartHeight} Z`;
    };

    const highlightPoint = {
        x: dataPoints[highlightIndex].x * chartWidth,
        y: dataPoints[highlightIndex].y * chartHeight,
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
                        <Text style={styles.headerTitle}>Heart Rate log</Text>
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
                        <TouchableOpacity style={styles.headerIconBg} onPress={() => navigation.navigate('AddHeartRateReading')}>
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

                {/* BPM Chart */}
                <View style={styles.chartCard}>
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
                                    <SvgLinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0" stopColor={primaryColor} stopOpacity="0.3" />
                                        <Stop offset="1" stopColor={primaryColor} stopOpacity="0.02" />
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

                                {/* Filled area under curve */}
                                <Path
                                    d={createAreaPath()}
                                    fill="url(#areaGradient)"
                                />

                                {/* Main curve line */}
                                <Path
                                    d={createCurvePath()}
                                    fill="none"
                                    stroke={primaryColor}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Vertical indicator line at highlight point */}
                                <Line
                                    x1={highlightPoint.x}
                                    y1={highlightPoint.y}
                                    x2={highlightPoint.x}
                                    y2={chartHeight}
                                    stroke={primaryColor}
                                    strokeWidth="1"
                                    strokeDasharray="4,4"
                                />

                                {/* Highlight circle */}
                                <Circle
                                    cx={highlightPoint.x}
                                    cy={highlightPoint.y}
                                    r={6}
                                    fill={whiteColor}
                                    stroke={primaryColor}
                                    strokeWidth={3}
                                />
                            </Svg>

                            {/* BPM Tooltip */}
                            <View style={[
                                styles.bpmTooltip,
                                { left: highlightPoint.x - ms(30), top: highlightPoint.y - vs(35) }
                            ]}>
                                <Text style={styles.bpmTooltipText}>25 BPM</Text>
                            </View>

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
                            <TouchableOpacity onPress={() => navigation.navigate('HeartRateReadings', { readings })}>
                                <Text style={styles.viewAll}>View all</Text>
                            </TouchableOpacity>
                        </View>
                        {readings.slice(0, 4).map((item) => (
                            <View key={item.id} style={styles.readingCard}>
                                <View style={styles.readingInfo}>
                                    <Text style={styles.readingDate}>{item.date}</Text>
                                    <Text style={styles.readingBpm}>{item.bpm} BPM</Text>
                                </View>
                                <TouchableOpacity style={styles.readingMenu}>
                                    <Icon type={Icons.Ionicons} name="ellipsis-horizontal" color="#999" size={ms(20)} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                ) : (
                    /* Explore Section (shown when no data) */
                    <View style={styles.exploreSection}>
                        <Text style={styles.exploreTitle}>Explore</Text>

                        <View style={styles.exploreCard}>
                            <View style={styles.exploreCardIcon}>
                                <Icon type={Icons.Ionicons} name="heart-outline" color={primaryColor} size={ms(24)} />
                            </View>
                            <View style={styles.exploreCardContent}>
                                <Text style={styles.exploreCardTitle}>How to Add Heart Rate Reading</Text>
                                <Text style={styles.exploreCardDesc}>
                                    Learn how to manually add your heart rate reading to keep track of your health.
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
                                <Text style={styles.exploreCardTitle}>How to Connect Device to Get Heart Rate</Text>
                                <Text style={styles.exploreCardDesc}>
                                    Connect your smart device to automatically sync your heart rate data.
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
                                <Image source={require('../assets/img/watch.png')} style={styles.preferredImg} />
                            </View>
                            <Text style={styles.preferredOptionText}>Smart Device Reading</Text>
                        </View>
                        {readingMode === 'device' ? (
                            <View style={styles.checkCircle}>
                                <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(14)} />
                            </View>
                        ) : (
                            <View style={{marginRight:ms(5)}}>
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
                                <Image source={require('../assets/img/mobile.png')} style={styles.preferredImg} />
                            </View>
                            <Text style={styles.preferredOptionText}>Manual Readings</Text>
                        </View>
                        {readingMode === 'manual' ? (
                            <View style={styles.checkCircle}>
                                <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(14)} />
                            </View>
                        ) : (
                            <View style={{marginRight:ms(5)}}>
                                <Icon type={Icons.FontAwesome} name="circle-thin" color={blackColor} size={ms(28)} />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default HeartRateDashboard;

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
    headerIcon: {
        width: ms(36),
        height: ms(36),
        justifyContent: 'center',
        alignItems: 'center',
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
        marginBottom:ms(10)
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
    bpmTooltip: {
        position: 'absolute',
        backgroundColor: primaryColor,
        borderRadius: ms(8),
        paddingHorizontal: ms(10),
        paddingVertical: vs(4),
    },
    bpmTooltipText: {
        color: whiteColor,
        fontSize: ms(11),
        fontWeight: '700',
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F6F8FB',
        borderRadius: ms(12),
        paddingHorizontal: ms(15),
        paddingVertical: vs(14),
        marginBottom: vs(8),
    },
    readingInfo: {
        flex: 1,
    },
    readingDate: {
        fontSize: ms(11),
        color: '#888',
        marginBottom: vs(4),
    },
    readingBpm: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    readingMenu: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
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
        backgroundColor:'#F1F5F9',
        marginVertical:ms(5),
        paddingHorizontal:ms(10),
        borderRadius:ms(15)
    },
    preferredOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
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
    preferredOptionText: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    checkCircle: {
        width: ms(26),
        height: ms(26),
        borderRadius: ms(13),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unCheckCirle:{
    alignItems:'center'
    },
    toggleOff: {
        width: ms(44),
        height: ms(24),
        borderRadius: ms(12),
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        paddingHorizontal: ms(3),
    },
    toggleKnobOff: {
        width: ms(18),
        height: ms(18),
        borderRadius: ms(9),
        backgroundColor: whiteColor,
    },
});
