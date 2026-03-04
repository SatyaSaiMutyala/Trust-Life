import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { bold, regular } from '../config/Constants';
import { blackColor, primaryColor, whiteColor, grayColor } from '../utils/globalColors';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const TABS = [
    { key: 'Food', icon: 'food-apple-outline', type: Icons.MaterialCommunityIcons },
    { key: 'Sleep', icon: 'power-sleep', type: Icons.MaterialCommunityIcons },
    { key: 'Fitness', icon: 'dumbbell', type: Icons.MaterialCommunityIcons },
    { key: 'Medication', icon: 'pill', type: Icons.MaterialCommunityIcons },
];

const DAYS_HEADER = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const getMonthData = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Convert Sunday=0 to Monday-start (Mon=0, Sun=6)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    return { daysInMonth, startOffset };
};

// Sample tracked days (these would come from API)
const TRACKED_DAYS = {
    Food: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22],
    Sleep: [1, 2, 5, 6, 8, 9, 10, 12, 13, 16, 17, 19, 20, 21],
    Fitness: [1, 3, 5, 8, 10, 12, 14, 16, 18, 20, 22],
    Medication: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22],
};

const ContinuityTracking = () => {
    const navigation = useNavigation();
    const today = new Date();
    const [selectedTab, setSelectedTab] = useState('Food');
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const { daysInMonth, startOffset } = getMonthData(currentYear, currentMonth);
    const trackedDays = TRACKED_DAYS[selectedTab] || [];

    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

    const goToPrevMonth = useCallback(() => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(y => y - 1);
        } else {
            setCurrentMonth(m => m - 1);
        }
    }, [currentMonth]);

    const goToNextMonth = useCallback(() => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(y => y + 1);
        } else {
            setCurrentMonth(m => m + 1);
        }
    }, [currentMonth]);

    const isToday = (day) => {
        return day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
    };

    const renderCalendarDays = () => {
        const cells = [];
        // Empty cells for offset
        for (let i = 0; i < startOffset; i++) {
            cells.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
        }
        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const tracked = trackedDays.includes(day);
            const todayDay = isToday(day);
            cells.push(
                <View key={day} style={styles.calendarCell}>
                    <View style={[
                        styles.dayCircle,
                        tracked && styles.dayCircleTracked,
                        todayDay && styles.dayCircleToday,
                    ]}>
                        <Text style={[
                            styles.dayText,
                            tracked && styles.dayTextTracked,
                            todayDay && styles.dayTextToday,
                        ]}>
                            {day}
                        </Text>
                    </View>
                </View>
            );
        }
        return cells;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={[primaryColor, grayColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Continuity tracking</Text>
                </View>

                {/* Content Card */}
                <View style={styles.card}>
                    {/* Tabs */}
                    <View style={styles.tabsRow}>
                        {TABS.map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                style={styles.tabItem}
                                onPress={() => setSelectedTab(tab.key)}
                            >
                                <Icon
                                    type={tab.type}
                                    name={tab.icon}
                                    size={ms(22)}
                                    color={selectedTab === tab.key ? primaryColor : '#999'}
                                />
                                <Text style={[
                                    styles.tabLabel,
                                    selectedTab === tab.key && styles.tabLabelActive,
                                ]}>
                                    {tab.key}
                                </Text>
                                {selectedTab === tab.key && <View style={styles.tabIndicator} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.tabDivider} />

                    {/* Month Navigator */}
                    <View style={styles.monthNav}>
                        <TouchableOpacity onPress={goToPrevMonth}>
                            <Icon type={Icons.Ionicons} name="chevron-back" size={ms(20)} color={blackColor} />
                        </TouchableOpacity>
                        <Text style={styles.monthTitle}>{monthName} {currentYear}</Text>
                        <TouchableOpacity onPress={goToNextMonth}>
                            <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(20)} color={blackColor} />
                        </TouchableOpacity>
                    </View>

                    {/* Days Header */}
                    <View style={styles.daysHeaderRow}>
                        {DAYS_HEADER.map((d) => (
                            <View key={d} style={styles.calendarCell}>
                                <Text style={styles.daysHeaderText}>{d}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Calendar Grid */}
                    <View style={styles.calendarGrid}>
                        {renderCalendarDays()}
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const CELL_SIZE = (width - ms(40) - ms(28)) / 7;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    gradient: {
        flex: 1,
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(20),
    },
    backBtn: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    headerTitle: {
        fontSize: ms(18),
        fontFamily: bold,
        color: whiteColor,
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        paddingVertical: ms(16),
        paddingHorizontal: ms(14),
    },

    // Tabs
    tabsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tabItem: {
        alignItems: 'center',
        flex: 1,
        paddingBottom: ms(10),
    },
    tabLabel: {
        fontSize: ms(11),
        fontFamily: regular,
        color: '#999',
        marginTop: ms(4),
    },
    tabLabelActive: {
        color: blackColor,
        fontFamily: bold,
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '80%',
        height: ms(3),
        backgroundColor: primaryColor,
        borderRadius: ms(2),
    },
    tabDivider: {
        height: 1,
        backgroundColor: '#E8E8E8',
        marginBottom: ms(16),
    },

    // Month Navigator
    monthNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ms(16),
        paddingHorizontal: ms(4),
    },
    monthTitle: {
        fontSize: ms(15),
        fontFamily: bold,
        color: blackColor,
    },

    // Days Header
    daysHeaderRow: {
        flexDirection: 'row',
        marginBottom: ms(8),
    },
    daysHeaderText: {
        fontSize: ms(10),
        fontFamily: bold,
        color: '#999',
        textAlign: 'center',
    },

    // Calendar
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarCell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: ms(4),
    },
    dayCircle: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayCircleTracked: {
        backgroundColor: '#E2F5EC',
    },
    dayCircleToday: {
        borderWidth: 1.5,
        borderColor: primaryColor,
        backgroundColor: 'transparent',
    },
    dayText: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
    },
    dayTextTracked: {
        color: blackColor,
    },
    dayTextToday: {
        color: primaryColor,
        fontFamily: bold,
    },
});

export default ContinuityTracking;
