import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const SEVERITY_COLORS = {
    Low: '#22C55E',
    Medium: '#F59E0B',
    High: '#EF4444',
};

const PAIN_REGION_IMAGES = {
    'Frontal Region': require('../../assets/img/left.png'),
    'Temporal Region': require('../../assets/img/rs.png'),
    'Periorbital Region': require('../../assets/img/ls.png'),
    'Parietal Region': require('../../assets/img/right.png'),
};

const MigraineDashboard = () => {
    const navigation = useNavigation();
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // February 2026

    const readings = [
        {
            id: '1',
            date: 'Mon, 11 Feb,2026,12:30 PM',
            painRegion: 'Frontal Region',
            severity: 'Low',
            startedDate: '11 Feb,2026',
            endedDate: '12 Feb,2026',
        },
        {
            id: '2',
            date: 'Mon, 11 Feb,2026,12:30 PM',
            painRegion: 'Temporal Region',
            severity: 'Medium',
            startedDate: '11 Feb,2026',
            endedDate: '12 Feb,2026',
        },
        {
            id: '3',
            date: 'Mon, 11 Feb,2026,12:30 PM',
            painRegion: 'Temporal Region',
            severity: 'High',
            startedDate: '11 Feb,2026',
            endedDate: '12 Feb,2026',
        },
        {
            id: '4',
            date: 'Mon, 11 Feb,2026,12:30 PM',
            painRegion: 'Frontal Region',
            severity: 'Low',
            startedDate: '11 Feb,2026',
            endedDate: '12 Feb,2026',
        },
    ];

    // Calendar date severity mapping (day -> severity)
    const dateSeverityMap = {
        11: 'Low',
        13: 'Medium',
        14: 'Medium',
        15: 'Medium',
        16: 'High',
        20: 'Medium',
        21: 'Medium',
        22: 'Medium',
        24: 'High',
    };

    const getMonthName = (date) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return months[date.getMonth()];
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1; // Monday = 0
    };

    const goToPrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const weeks = [];

        // Build flat array (null = empty, number = day)
        const allCells = [];
        for (let i = 0; i < firstDay; i++) allCells.push(null);
        for (let d = 1; d <= daysInMonth; d++) allCells.push(d);
        while (allCells.length % 7 !== 0) allCells.push(null);

        // Render week by week
        for (let w = 0; w < allCells.length; w += 7) {
            const weekDays = allCells.slice(w, w + 7);

            const weekCells = weekDays.map((day, i) => {
                if (day === null) {
                    return <View key={`empty-${w}-${i}`} style={styles.calendarCell} />;
                }

                const severity = dateSeverityMap[day];

                if (!severity) {
                    return (
                        <View key={day} style={styles.calendarCell}>
                            <View style={styles.calendarDay}>
                                <Text style={styles.calendarDayText}>{day}</Text>
                            </View>
                        </View>
                    );
                }

                // Check if neighbors in the same row also have severity
                const prevDay = i > 0 ? weekDays[i - 1] : null;
                const nextDay = i < 6 ? weekDays[i + 1] : null;
                const prevHasSeverity = prevDay !== null && !!dateSeverityMap[prevDay];
                const nextHasSeverity = nextDay !== null && !!dateSeverityMap[nextDay];

                return (
                    <View key={day} style={styles.calendarCell}>
                        <View style={[
                            styles.calendarDayBand,
                            { backgroundColor: SEVERITY_COLORS[severity] },
                            !prevHasSeverity && { borderTopLeftRadius: ms(17), borderBottomLeftRadius: ms(17) },
                            !nextHasSeverity && { borderTopRightRadius: ms(17), borderBottomRightRadius: ms(17) },
                        ]}>
                            <Text style={[styles.calendarDayText, styles.calendarDayTextActive]}>
                                {day}
                            </Text>
                        </View>
                    </View>
                );
            });

            weeks.push(
                <View key={`week-${w / 7}`} style={styles.calendarRow}>{weekCells}</View>
            );
        }

        return weeks;
    };

    const renderReadingCard = (item) => (
        <View key={item.id} style={styles.readingCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.readingDate}>{item.date}</Text>
                <TouchableOpacity style={styles.readingMenu}>
                    <Icon type={Icons.Ionicons} name="ellipsis-horizontal" color="#999" size={ms(20)} />
                </TouchableOpacity>
            </View>

            <View style={styles.cardContentRow}>
                <View style={styles.cardLeft}>
                    <Image
                        source={PAIN_REGION_IMAGES[item.painRegion]}
                        style={styles.painRegionImage}
                    />
                    <Text style={styles.painRegionText}>{item.painRegion}</Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLORS[item.severity] }]}>
                    <Text style={styles.severityBadgeText}>{item.severity}</Text>
                </View>
            </View>

            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Started Date</Text>
                <Text style={styles.cardInfoValue}>{item.startedDate}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Ended Date</Text>
                <Text style={styles.cardInfoValue}>{item.endedDate}</Text>
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
                        <Text style={styles.headerTitle}>Migraine Management</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerIconBg} onPress={() => navigation.navigate('AddMigraine')}>
                            <Icon type={Icons.Ionicons} name="add" color={blackColor} size={ms(20)} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Calendar */}
                <View style={styles.calendarContainer}>
                    {/* Month Navigator */}
                    <View style={styles.monthNav}>
                        <TouchableOpacity onPress={goToPrevMonth}>
                            <Icon type={Icons.Ionicons} name="chevron-back" color={blackColor} size={ms(20)} />
                        </TouchableOpacity>
                        <Text style={styles.monthText}>{getMonthName(currentMonth)}</Text>
                        <TouchableOpacity onPress={goToNextMonth}>
                            <Icon type={Icons.Ionicons} name="chevron-forward" color={blackColor} size={ms(20)} />
                        </TouchableOpacity>
                    </View>

                    {/* Weekday Headers */}
                    <View style={styles.calendarRow}>
                        {WEEKDAYS.map((day) => (
                            <View key={day} style={styles.calendarCell}>
                                <Text style={styles.weekdayText}>{day}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Calendar Days */}
                    {renderCalendar()}
                </View>

                {/* Severity Legend */}
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: SEVERITY_COLORS.Low }]} />
                        <Text style={styles.legendText}>Low</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: SEVERITY_COLORS.Medium }]} />
                        <Text style={styles.legendText}>Medium</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: SEVERITY_COLORS.High }]} />
                        <Text style={styles.legendText}>High</Text>
                    </View>
                </View>

                {/* Recently Added */}
                <View style={styles.recentSection}>
                    <View style={styles.recentHeader}>
                        <Text style={styles.recentTitle}>Recently Added</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('MigraineReadings', { readings })}>
                            <Text style={styles.viewAll}>View all</Text>
                        </TouchableOpacity>
                    </View>

                    {readings.map((item) => renderReadingCard(item))}
                </View>

                <View style={{ height: ms(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default MigraineDashboard;

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

    // Calendar
    calendarContainer: {
        marginHorizontal: ms(15),
        marginTop: vs(10),
        paddingBottom: vs(10),
    },
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(5),
        marginBottom: vs(15),
    },
    monthText: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    calendarRow: {
        flexDirection: 'row',
    },
    calendarCell: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: vs(6),
    },
    weekdayText: {
        fontSize: ms(13),
        fontWeight: '600',
        color: '#888',
    },
    calendarDay: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarDayBand: {
        width: '100%',
        height: ms(34),
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarDayText: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
    },
    calendarDayTextActive: {
        color: whiteColor,
        fontWeight: 'bold',
    },

    // Legend
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: ms(20),
        marginVertical: vs(10),
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
        color: '#888',
        fontWeight: '500',
    },

    // Recently Added
    recentSection: {
        marginTop: vs(15),
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
        marginBottom: vs(10),
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
    cardContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(10),
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
    },
    painRegionImage: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        resizeMode: 'cover',
    },
    painRegionText: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    severityBadge: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(6),
        borderRadius: ms(20),
    },
    severityBadgeText: {
        fontSize: ms(12),
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
