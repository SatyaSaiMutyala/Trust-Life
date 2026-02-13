import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const { width } = Dimensions.get('window');
const TIME_TABS = ['Day', 'Week', 'Month', '3Mon', 'Yearly'];
const VACCINATION_COLOR = primaryColor;

const VaccinationDashboard = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('Day');

    const vaccinations = [
        {
            id: '1',
            date: 'Mon, 11 Feb,2026,12:30 PM',
            name: 'Covid',
            batchNumber: 'UTG5758KERT',
            totalDoses: 4,
            completedDoses: 3,
            takenDate: '11 Feb,2026',
            nextDue: '25 Mar,2026',
        },
        {
            id: '2',
            date: 'Mon, 11 Feb,2026,12:30 PM',
            name: 'Covid',
            batchNumber: 'UTG5758KERT',
            totalDoses: 4,
            completedDoses: 2,
            takenDate: '11 Feb,2026',
            nextDue: '25 Mar,2026',
        },
        {
            id: '3',
            date: 'Mon, 11 Feb,2026,12:30 PM',
            name: 'Covid',
            batchNumber: 'UTG5758KERT',
            totalDoses: 4,
            completedDoses: 4,
            takenDate: '11 Feb,2026',
            nextDue: '25 Mar,2026',
        },
    ];

    const completedCount = vaccinations.length;

    // Ring chart config
    const ringSize = ms(160);
    const strokeWidth = ms(12);
    const radius = (ringSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = completedCount > 0 ? Math.min(completedCount / 10, 1) : 0;
    const strokeDashoffset = circumference * (1 - progress);

    const renderDoseCircles = (total, completed) => {
        const circles = [];
        for (let i = 0; i < total; i++) {
            const isCompleted = i < completed;
            circles.push(
                <View
                    key={i}
                    style={[
                        styles.doseCircle,
                        isCompleted ? styles.doseCompleted : styles.dosePending,
                    ]}
                >
                    {isCompleted ? (
                        <Icon type={Icons.Ionicons} name="checkmark" size={ms(12)} color={whiteColor} />
                    ) : (
                        <Text style={styles.doseNumber}>{i + 1}</Text>
                    )}
                </View>
            );
        }
        return circles;
    };

    const renderVaccinationCard = (item) => (
        <View key={item.id} style={styles.readingCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.readingDate}>{item.date}</Text>
                <TouchableOpacity style={styles.readingMenu}>
                    <Icon type={Icons.Ionicons} name="ellipsis-horizontal" color="#999" size={ms(20)} />
                </TouchableOpacity>
            </View>

            <View style={styles.cardNameRow}>
                <Text style={styles.cardVaccineName}>{item.name}</Text>
                <Text style={styles.cardBatchNumber}>{item.batchNumber}</Text>
            </View>

            <View style={styles.doseRow}>
                {renderDoseCircles(item.totalDoses, item.completedDoses)}
            </View>

            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Taken Date</Text>
                <Text style={styles.cardInfoValue}>{item.takenDate}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Next Due</Text>
                <Text style={styles.cardInfoValue}>{item.nextDue}</Text>
            </View>
        </View>
    );

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
                        <Text style={styles.headerTitle}>Vaccination Tracking</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerIconBg} onPress={() => navigation.navigate('AddVaccination')}>
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

                {/* Ring Chart */}
                <View style={styles.chartWrapper}>
                    <View style={styles.ringContainer}>
                        <Svg width={ringSize} height={ringSize}>
                            <Circle
                                cx={ringSize / 2}
                                cy={ringSize / 2}
                                r={radius}
                                stroke="#E8ECF0"
                                strokeWidth={strokeWidth}
                                fill="none"
                            />
                            <Circle
                                cx={ringSize / 2}
                                cy={ringSize / 2}
                                r={radius}
                                stroke={VACCINATION_COLOR}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                rotation="-90"
                                origin={`${ringSize / 2}, ${ringSize / 2}`}
                            />
                        </Svg>
                        <View style={styles.ringCenter}>
                            <Text style={styles.ringCount}>
                                {String(completedCount).padStart(2, '0')}
                            </Text>
                            <Text style={styles.ringLabel}>Vaccination completed</Text>
                        </View>
                    </View>
                </View>

                {/* Recently Added */}
                <View style={styles.recentSection}>
                    <View style={styles.recentHeader}>
                        <Text style={styles.recentTitle}>Recently Added</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('VaccinationReadings', { readings: vaccinations })}>
                            <Text style={styles.viewAll}>View all</Text>
                        </TouchableOpacity>
                    </View>

                    {vaccinations.map((item) => renderVaccinationCard(item))}
                </View>

                <View style={{ height: ms(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default VaccinationDashboard;

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
        fontSize: ms(18),
        fontWeight: 'bold',
        color: blackColor,
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

    // Ring Chart
    chartWrapper: {
        alignItems: 'center',
        paddingVertical: vs(15),
    },
    ringContainer: {
        width: ms(160),
        height: ms(160),
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringCenter: {
        position: 'absolute',
        alignItems: 'center',
    },
    ringCount: {
        fontSize: ms(36),
        fontWeight: 'bold',
        color: blackColor,
    },
    ringLabel: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
    },

    // Recently Added
    recentSection: {
        marginTop: vs(10),
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

    // Reading Card
    readingCard: {
        backgroundColor: '#F6F8FB',
        borderRadius: ms(12),
        paddingHorizontal: ms(15),
        paddingVertical: vs(14),
        marginBottom: vs(8),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    readingDate: {
        fontSize: ms(11),
        color: '#888',
    },
    readingMenu: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: '#E8ECF0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    cardVaccineName: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
    },
    cardBatchNumber: {
        fontSize: ms(12),
        color: '#888',
        fontWeight: '500',
    },
    doseRow: {
        flexDirection: 'row',
        gap: ms(6),
        marginBottom: vs(10),
    },
    doseCircle: {
        width: ms(26),
        height: ms(26),
        borderRadius: ms(13),
        justifyContent: 'center',
        alignItems: 'center',
    },
    doseCompleted: {
        backgroundColor: primaryColor,
    },
    dosePending: {
        backgroundColor: '#CBD5E1',
    },
    doseNumber: {
        fontSize: ms(11),
        fontWeight: 'bold',
        color: whiteColor,
    },
    cardInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(3),
    },
    cardInfoLabel: {
        fontSize: ms(12),
        color: '#888',
    },
    cardInfoValue: {
        fontSize: ms(12),
        fontWeight: '600',
        color: blackColor,
    },
});
