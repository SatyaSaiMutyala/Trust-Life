import React, { useState, useEffect } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { s, vs, ms } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Line, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

// Importing your specific project utilities/config
import { StatusBar2 } from '../components/StatusBar';
import { bold, img_url, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, globalGradient, whiteColor, primaryColor, grayColor } from '../utils/globalColors';

const { width } = Dimensions.get('window');

const MAIN_TABS = ['Trends Analysis', 'Reports'];
const FILTER_TABS = ['Preference', 'Sugar', 'Thyroid', 'Cholesterol'];

// Sample reports data
const SAMPLE_REPORTS = [
    { id: 1, name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44' },
    { id: 2, name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44' },
    { id: 3, name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44' },
    { id: 4, name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44' },
    { id: 5, name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44' },
];

const HealthTrend = () => {
    const navigation = useNavigation();
    const [profilePic, setProfilePic] = useState(null);
    const [activeMainTab, setActiveMainTab] = useState('Trends Analysis');
    const [selectedFilter, setSelectedFilter] = useState('Sugar');
    const [reports, setReports] = useState(SAMPLE_REPORTS);
    const [selectedReports, setSelectedReports] = useState([1, 2, 3]); // Default selected

    // Toggle report selection
    const toggleReportSelection = (reportId) => {
        setSelectedReports(prev => {
            if (prev.includes(reportId)) {
                return prev.filter(id => id !== reportId);
            } else {
                return [...prev, reportId];
            }
        });
    };

    useEffect(() => {
        loadProfilePic();
    }, []);

    // Reset to Trends Analysis tab when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            setActiveMainTab('Trends Analysis');
        }, [])
    );

    const loadProfilePic = async () => {
        try {
            const savedProfilePic = await AsyncStorage.getItem('profile_picture');
            if (savedProfilePic) {
                setProfilePic(`${img_url}${savedProfilePic}`);
            }
        } catch (error) {
            console.log('Error loading profile pic:', error);
        }
    };

    // HbA1c Line Chart Component
    const HbA1cChart = () => {
        const chartWidth = width - ms(80);
        const chartHeight = vs(100);

        const createLinePath = () => {
            const points = [
                { x: 0, y: 0.4 },
                { x: 0.12, y: 0.25 },
                { x: 0.24, y: 0.45 },
                { x: 0.36, y: 0.2 },
                { x: 0.48, y: 0.5 },
                { x: 0.60, y: 0.25 },
                { x: 0.72, y: 0.45 },
                { x: 0.84, y: 0.75 },
                { x: 1, y: 0.4 },
            ];

            let path = `M ${points[0].x * chartWidth},${points[0].y * chartHeight}`;
            for (let i = 1; i < points.length; i++) {
                path += ` L ${points[i].x * chartWidth},${points[i].y * chartHeight}`;
            }
            return path;
        };

        const xLabels = ['25 Mar', '30 Apr', '21 May', '28 Mar', '19 Mar', '28 Mar'];

        return (
            <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>HbA1c (Glycated Hemoglobin)</Text>
                    <TouchableOpacity
                        style={styles.analysisButton}
                        onPress={() => navigation.navigate('HealthAnalysisScreen', { title: 'HbA1c' })}
                    >
                        <Text style={styles.analysisButtonText}>Analysis</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={blackColor} />
                    </TouchableOpacity>
                </View>

                <View style={styles.valueRow}>
                    <View style={styles.valueDot} />
                    <Text style={styles.valueLabel}>Current value : </Text>
                    <Text style={styles.valueText}>4.5%</Text>
                    <Text style={styles.normalLabel}>Normal value : </Text>
                    <Text style={styles.normalText}>5%</Text>
                </View>

                <View style={styles.chartContainer}>
                    <View style={styles.yAxisLabels}>
                        <Text style={styles.axisLabel}>6</Text>
                        <Text style={styles.axisLabel}>4</Text>
                        <Text style={styles.axisLabel}>2</Text>
                        <Text style={styles.axisLabel}>0</Text>
                    </View>

                    <View style={styles.chartArea}>
                        <Svg width={chartWidth} height={chartHeight}>
                            {/* Dashed horizontal lines */}
                            {[0, 0.33, 0.66, 1].map((pos, i) => (
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
                            {/* Main line */}
                            <Path
                                d={createLinePath()}
                                fill="none"
                                stroke={primaryColor}
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                            />
                            {/* Highlight dot */}
                            <Circle
                                cx={chartWidth * 0.84}
                                cy={chartHeight * 0.75}
                                r={ms(5)}
                                fill={primaryColor}
                            />
                        </Svg>

                        <View style={styles.xAxisLabels}>
                            {xLabels.map((label, i) => (
                                <Text key={i} style={styles.xAxisLabel}>{label}</Text>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    // FBS Area Chart Component
    const FBSChart = () => {
        const chartWidth = width - ms(50);
        const chartHeight = vs(80);

        const createAreaPath = () => {
            return `
                M 0,${chartHeight}
                L 0,${chartHeight * 0.6}
                C ${chartWidth * 0.1},${chartHeight * 0.5} ${chartWidth * 0.15},${chartHeight * 0.4} ${chartWidth * 0.22},${chartHeight * 0.35}
                C ${chartWidth * 0.3},${chartHeight * 0.25} ${chartWidth * 0.4},${chartHeight * 0.45} ${chartWidth * 0.5},${chartHeight * 0.4}
                C ${chartWidth * 0.6},${chartHeight * 0.35} ${chartWidth * 0.7},${chartHeight * 0.5} ${chartWidth * 0.8},${chartHeight * 0.3}
                C ${chartWidth * 0.9},${chartHeight * 0.1} ${chartWidth * 0.95},${chartHeight * 0.35} ${chartWidth},${chartHeight * 0.4}
                L ${chartWidth},${chartHeight}
                Z
            `;
        };

        return (
            <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>FBS</Text>
                    <TouchableOpacity
                        style={styles.analysisButton}
                        onPress={() => navigation.navigate('HealthAnalysisScreen', { title: 'FBS' })}
                    >
                        <Text style={styles.analysisButtonText}>Analysis</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={blackColor} />
                    </TouchableOpacity>
                </View>

                <View style={styles.valueRow}>
                    <View style={styles.valueDot} />
                    <Text style={styles.valueLabel}>Current value : </Text>
                    <Text style={styles.valueText}>105 mg/dL</Text>
                    <Text style={styles.normalLabel}>Normal value </Text>
                    <Text style={styles.normalText}>120/80</Text>
                </View>

                <View style={styles.areaChartContainer}>
                    <Svg width={chartWidth} height={chartHeight}>
                        <Defs>
                            <SvgLinearGradient id="fbsGradient" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0" stopColor={primaryColor} stopOpacity="0.8" />
                                <Stop offset="1" stopColor={primaryColor} stopOpacity="0.3" />
                            </SvgLinearGradient>
                        </Defs>
                        <Path
                            d={createAreaPath()}
                            fill="url(#fbsGradient)"
                        />
                        {/* Highlight dot */}
                        <Circle
                            cx={chartWidth * 0.5}
                            cy={chartHeight * 0.4}
                            r={ms(5)}
                            fill={whiteColor}
                            stroke={primaryColor}
                            strokeWidth="2"
                        />
                    </Svg>
                </View>
            </View>
        );
    };

    // PPBS Area Chart Component
    const PPBSChart = () => {
        const chartWidth = width - ms(50);
        const chartHeight = vs(80);

        const createAreaPath = () => {
            return `
                M 0,${chartHeight}
                L 0,${chartHeight * 0.7}
                C ${chartWidth * 0.12},${chartHeight * 0.5} ${chartWidth * 0.2},${chartHeight * 0.35} ${chartWidth * 0.28},${chartHeight * 0.4}
                C ${chartWidth * 0.38},${chartHeight * 0.5} ${chartWidth * 0.48},${chartHeight * 0.3} ${chartWidth * 0.58},${chartHeight * 0.35}
                C ${chartWidth * 0.68},${chartHeight * 0.4} ${chartWidth * 0.78},${chartHeight * 0.25} ${chartWidth * 0.88},${chartHeight * 0.3}
                L ${chartWidth},${chartHeight * 0.4}
                L ${chartWidth},${chartHeight}
                Z
            `;
        };

        return (
            <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>PPBS</Text>
                    <TouchableOpacity
                        style={styles.analysisButton}
                        onPress={() => navigation.navigate('HealthAnalysisScreen', { title: 'PPBS' })}
                    >
                        <Text style={styles.analysisButtonText}>Analysis</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={blackColor} />
                    </TouchableOpacity>
                </View>

                <View style={styles.valueRow}>
                    <View style={styles.valueDot} />
                    <Text style={styles.valueLabel}>Current value : </Text>
                    <Text style={styles.valueText}>105 mg/dL</Text>
                    <Text style={styles.normalLabel}>Normal value </Text>
                    <Text style={styles.normalText}>120/80</Text>
                </View>

                <View style={styles.areaChartContainer}>
                    <Svg width={chartWidth} height={chartHeight}>
                        <Defs>
                            <SvgLinearGradient id="ppbsGradient" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0" stopColor={primaryColor} stopOpacity="0.8" />
                                <Stop offset="1" stopColor={primaryColor} stopOpacity="0.3" />
                            </SvgLinearGradient>
                        </Defs>
                        <Path
                            d={createAreaPath()}
                            fill="url(#ppbsGradient)"
                        />
                        {/* Highlight dot */}
                        <Circle
                            cx={chartWidth * 0.28}
                            cy={chartHeight * 0.4}
                            r={ms(5)}
                            fill={whiteColor}
                            stroke={primaryColor}
                            strokeWidth="2"
                        />
                    </Svg>
                </View>
            </View>
        );
    };

    // Render Trends Analysis Tab Content
    const renderTrendsAnalysis = () => (
        <>
            {/* Filter Tabs */}
            <View style={styles.filterWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {FILTER_TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.filterTab,
                                selectedFilter === tab && styles.filterTabActive
                            ]}
                            onPress={() => setSelectedFilter(tab)}
                        >
                            <Text style={[
                                styles.filterTabText,
                                selectedFilter === tab && styles.filterTabTextActive
                            ]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Charts */}
            <ScrollView
                style={styles.chartsScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.chartsContent}
            >
                <HbA1cChart />
                <FBSChart />
                <PPBSChart />
            </ScrollView>
        </>
    );

    // Render Reports Tab Content
    const renderReportsTab = () => (
        <ScrollView
            style={styles.reportsScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.reportsContent}
        >
            <Text style={styles.recentReportsTitle}>Recent Reports</Text>
            {reports.map((report) => {
                const isSelected = selectedReports.includes(report.id);
                return (
                    <TouchableOpacity
                        key={report.id}
                        style={styles.reportCard}
                        onPress={() => toggleReportSelection(report.id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.gridIcon}>
                            <Icon type={Icons.MaterialCommunityIcons} name="dots-grid" size={ms(18)} color={blackColor} />
                        </View>
                        <View style={styles.documentIcon}>
                            <Icon type={Icons.Ionicons} name="document-text-outline" size={ms(28)} color={blackColor} />
                        </View>
                        <View style={styles.reportInfo}>
                            <Text style={styles.reportName}>{report.name}</Text>
                            <Text style={styles.reportDate}>{report.date}</Text>
                        </View>
                        <View style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected
                        ]}>
                            {isSelected && (
                                <Icon
                                    type={Icons.Ionicons}
                                    name="checkmark"
                                    size={ms(16)}
                                    color={whiteColor}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.22]}
                style={styles.headerGradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Trend Health Care</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('Notifications')}>
                            <Icon type={Icons.MaterialIcons} name="notifications-none" size={ms(20)} color={blackColor} />
                            <View style={styles.notificationBadge}>
                                <Text style={styles.badgeText}>0</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('LabCart')}>
                            <Icon type={Icons.Feather} name="shopping-cart" size={ms(18)} color={blackColor} />
                            <View style={styles.notificationBadge}>
                                <Text style={styles.badgeText}>0</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            {profilePic ? (
                                <Image
                                    source={{ uri: profilePic }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <View style={[styles.profileImage, styles.defaultProfileIcon]}>
                                    <Icon type={Icons.MaterialIcons} name="person" size={ms(20)} color={blackColor} />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Tabs */}
                <View style={styles.mainTabsContainer}>
                    {MAIN_TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.mainTab,
                                activeMainTab === tab && styles.mainTabActive
                            ]}
                            onPress={() => setActiveMainTab(tab)}
                        >
                            <Text style={[
                                styles.mainTabText,
                                activeMainTab === tab && styles.mainTabTextActive
                            ]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tab Content */}
                {activeMainTab === 'Trends Analysis' ? renderTrendsAnalysis() : renderReportsTab()}
            </LinearGradient>
        </SafeAreaView>
    );
};

export default HealthTrend;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerGradient: {
        flex: 1,
        paddingTop: ms(50),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        marginBottom: vs(10),
    },
    headerTitle: {
        fontSize: ms(20),
        fontFamily: bold,
        color: whiteColor,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
    },
    iconCircle: {
        backgroundColor: whiteColor,
        padding: ms(8),
        borderRadius: ms(20),
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: -ms(2),
        right: -ms(2),
        backgroundColor: '#FF4444',
        width: ms(16),
        height: ms(16),
        borderRadius: ms(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: whiteColor,
        fontSize: ms(10),
        fontFamily: bold,
    },
    profileImage: {
        width: ms(38),
        height: ms(38),
        borderRadius: ms(19),
        borderWidth: 2,
        borderColor: whiteColor,
    },
    defaultProfileIcon: {
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Main Tabs
    mainTabsContainer: {
        flexDirection: 'row',
        marginHorizontal: ms(20),
        marginBottom: vs(15),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },
    mainTab: {
        paddingVertical: vs(12),
        marginRight: ms(25),
    },
    mainTabActive: {
        borderBottomWidth: 2,
        borderBottomColor: blackColor,
    },
    mainTabText: {
        fontSize: ms(15),
        fontFamily: regular,
        color: '#000000B2',
    },
    mainTabTextActive: {
        fontFamily: bold,
        color: blackColor,
    },
    // Filter Tabs
    filterWrapper: {
        marginBottom: vs(15),
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: ms(20),
        gap: ms(10),
    },
    filterTab: {
        paddingHorizontal: ms(20),
        paddingVertical: vs(10),
        borderRadius: ms(25),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: whiteColor,
    },
    filterTabActive: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },
    filterTabText: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
    },
    filterTabTextActive: {
        color: whiteColor,
        fontFamily: bold,
    },
    // Charts
    chartsScrollView: {
        flex: 1,
        paddingHorizontal: ms(20),
    },
    chartsContent: {
        paddingBottom: vs(18),
    },
    chartCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        padding: ms(18),
        marginBottom: vs(15),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(12),
    },
    chartTitle: {
        fontSize: ms(15),
        fontFamily: bold,
        color: blackColor,
    },
    analysisButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: ms(14),
        paddingVertical: vs(7),
        borderRadius: ms(20),
        gap: ms(4),
    },
    analysisButtonText: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(15),
        flexWrap: 'wrap',
    },
    valueDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        backgroundColor: primaryColor,
        marginRight: ms(8),
    },
    valueLabel: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
    },
    valueText: {
        fontSize: ms(12),
        fontFamily: bold,
        color: blackColor,
        marginRight: ms(15),
    },
    normalLabel: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
    },
    normalText: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    yAxisLabels: {
        justifyContent: 'space-between',
        height: vs(100),
        marginRight: ms(10),
    },
    axisLabel: {
        fontSize: ms(11),
        fontFamily: regular,
        color: blackColor,
    },
    chartArea: {
        flex: 1,
    },
    xAxisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(8),
    },
    xAxisLabel: {
        fontSize: ms(9),
        fontFamily: regular,
        color: blackColor,
    },
    areaChartContainer: {
        marginHorizontal: ms(-5),
    },
    // Reports Tab
    reportsScrollView: {
        flex: 1,
        paddingHorizontal: ms(20),
    },
    reportsContent: {
        paddingBottom: vs(120),
    },
    recentReportsTitle: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
        marginBottom: vs(15),
    },
    reportCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: ms(12),
        padding: ms(15),
        marginBottom: vs(12),
    },
    gridIcon: {
        marginRight: ms(10),
    },
    documentIcon: {
        marginRight: ms(12),
    },
    reportInfo: {
        flex: 1,
    },
    reportName: {
        fontSize: ms(14),
        fontFamily: bold,
        color: blackColor,
        marginBottom: vs(2),
    },
    reportDate: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
    },
    checkbox: {
        width: ms(28),
        height: ms(28),
        borderRadius: ms(6),
        borderWidth: 2,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: whiteColor,
    },
    checkboxSelected: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },
});
