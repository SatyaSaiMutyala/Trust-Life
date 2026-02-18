import React, { useState, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const { width } = Dimensions.get('window');

const SLEEP_COLORS = {
    Deep: '#5C6BC0',
    Light: '#42A5F5',
    REM: '#26C6DA',
};

const QUALITY_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

const formatDuration = (mins) => {
    if (!mins) return '0h 0m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
};

// Estimate sleep stages from total duration (manual entry approximation)
const estimateStages = (totalMins) => ({
    deep: Math.round(totalMins * 0.2),
    light: Math.round(totalMins * 0.55),
    rem: Math.round(totalMins * 0.25),
});

const SleepTrackingDashboard = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [sleepEntries, setSleepEntries] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const addedEntry = route.params?.addedEntry;
            if (addedEntry) {
                setSleepEntries((prev) => [
                    { ...addedEntry, id: `sleep-${Date.now()}` },
                    ...prev,
                ]);
                navigation.setParams({ addedEntry: undefined });
            }
        }, [route.params?.addedEntry]),
    );

    // Totals from today's entries
    const todayLabel = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const todayEntries = sleepEntries.filter((e) => e.date === todayLabel);
    const totalMins = todayEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
    const avgQuality = todayEntries.length
        ? Math.round(todayEntries.reduce((sum, e) => sum + (e.quality || 0), 0) / todayEntries.length)
        : 0;

    const stages = estimateStages(totalMins);

    // Donut chart
    const donutRadius = ms(48);
    const donutStroke = ms(10);
    const donutCenter = donutRadius + donutStroke / 2;
    const circumference = 2 * Math.PI * donutRadius;

    const totalStagesMins = stages.deep + stages.light + stages.rem || 1;
    const segments = [
        { color: SLEEP_COLORS.Deep, value: stages.deep },
        { color: SLEEP_COLORS.Light, value: stages.light },
        { color: SLEEP_COLORS.REM, value: stages.rem },
    ];

    let cumulativeOffset = 0;
    const donutPaths = segments.map((seg) => {
        const pct = seg.value / totalStagesMins;
        const dashLength = pct * circumference;
        const offset = cumulativeOffset;
        cumulativeOffset += dashLength;
        return { ...seg, dashLength, offset };
    });

    // Sleep quality ring
    const smallRingRadius = ms(22);
    const smallRingStroke = ms(4);
    const smallRingCenter = smallRingRadius + smallRingStroke / 2;
    const smallCircumference = 2 * Math.PI * smallRingRadius;
    const qualityPct = avgQuality / 5;

    const handleRemoveEntry = (id) => {
        setSleepEntries((prev) => prev.filter((e) => e.id !== id));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Sleep Tracking</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SleepReadings', { sleepEntries })} style={styles.historyBtn}>
                        <Icon type={Icons.Ionicons} name="list-outline" color={primaryColor} size={ms(22)} />
                    </TouchableOpacity>
                </View>

                {/* Date Navigation */}
                <View style={styles.dateNav}>
                    <TouchableOpacity style={styles.dateArrow}>
                        <Icon type={Icons.Ionicons} name="chevron-back" color={blackColor} size={ms(18)} />
                    </TouchableOpacity>
                    <Text style={styles.dateText}>Today</Text>
                    <TouchableOpacity style={styles.dateArrow}>
                        <Icon type={Icons.Ionicons} name="chevron-forward" color={blackColor} size={ms(18)} />
                    </TouchableOpacity>
                </View>

                {/* Donut Chart Card */}
                <View style={styles.donutCard}>
                    <View style={styles.donutRow}>
                        {/* Left — Donut */}
                        <View style={styles.donutChartWrap}>
                            <Svg width={donutCenter * 2} height={donutCenter * 2}>
                                <Circle
                                    cx={donutCenter}
                                    cy={donutCenter}
                                    r={donutRadius}
                                    stroke="#EEEEEE"
                                    strokeWidth={donutStroke}
                                    fill="transparent"
                                />
                                {totalMins > 0 && donutPaths.map((seg, i) => (
                                    seg.dashLength > 0 && (
                                        <Circle
                                            key={i}
                                            cx={donutCenter}
                                            cy={donutCenter}
                                            r={donutRadius}
                                            stroke={seg.color}
                                            strokeWidth={donutStroke}
                                            fill="transparent"
                                            strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
                                            strokeDashoffset={-seg.offset}
                                            strokeLinecap="round"
                                            rotation="-90"
                                            origin={`${donutCenter}, ${donutCenter}`}
                                        />
                                    )
                                ))}
                            </Svg>
                            <View style={styles.donutCenterText}>
                                <Icon type={Icons.Ionicons} name="moon" color={SLEEP_COLORS.Deep} size={ms(16)} />
                                <Text style={styles.donutValue}>{formatDuration(totalMins)}</Text>
                                <Text style={styles.donutSub}>Total Sleep</Text>
                            </View>
                        </View>

                        {/* Right — Legend */}
                        <View style={styles.legendContainer}>
                            <View style={styles.legendRow}>
                                <View style={styles.legendLeft}>
                                    <View style={[styles.legendDot, { backgroundColor: SLEEP_COLORS.Deep }]} />
                                    <Text style={styles.legendLabel}>Deep</Text>
                                </View>
                                <View style={styles.legendRight}>
                                    <Icon type={Icons.Ionicons} name="time-outline" color="#999" size={ms(13)} />
                                    <Text style={styles.legendValue}>{stages.deep} mins</Text>
                                </View>
                            </View>
                            <View style={styles.legendRow}>
                                <View style={styles.legendLeft}>
                                    <View style={[styles.legendDot, { backgroundColor: SLEEP_COLORS.Light }]} />
                                    <Text style={styles.legendLabel}>Light</Text>
                                </View>
                                <View style={styles.legendRight}>
                                    <Icon type={Icons.Ionicons} name="time-outline" color="#999" size={ms(13)} />
                                    <Text style={styles.legendValue}>{stages.light} mins</Text>
                                </View>
                            </View>
                            <View style={styles.legendRow}>
                                <View style={styles.legendLeft}>
                                    <View style={[styles.legendDot, { backgroundColor: SLEEP_COLORS.REM }]} />
                                    <Text style={styles.legendLabel}>REM</Text>
                                </View>
                                <View style={styles.legendRight}>
                                    <Icon type={Icons.Ionicons} name="time-outline" color="#999" size={ms(13)} />
                                    <Text style={styles.legendValue}>{stages.rem} mins</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Quality Card */}
                <View style={styles.qualityCard}>
                    <View style={styles.qualityLeft}>
                        <View style={styles.qualityIconBg}>
                            <Icon type={Icons.Ionicons} name="star" color="#FFB300" size={ms(20)} />
                        </View>
                        <View>
                            <Text style={styles.qualityValue}>
                                {avgQuality > 0 ? QUALITY_LABELS[avgQuality] : '—'}
                            </Text>
                            <Text style={styles.qualityLabel}>Sleep Quality</Text>
                            <Text style={styles.qualityDate}>{todayLabel}</Text>
                        </View>
                    </View>
                    <View style={styles.qualityRingWrap}>
                        <Svg width={smallRingCenter * 2} height={smallRingCenter * 2}>
                            <Circle
                                cx={smallRingCenter}
                                cy={smallRingCenter}
                                r={smallRingRadius}
                                stroke="#F0F0F0"
                                strokeWidth={smallRingStroke}
                                fill="transparent"
                            />
                            {avgQuality > 0 && (
                                <Circle
                                    cx={smallRingCenter}
                                    cy={smallRingCenter}
                                    r={smallRingRadius}
                                    stroke="#FFB300"
                                    strokeWidth={smallRingStroke}
                                    fill="transparent"
                                    strokeDasharray={`${qualityPct * smallCircumference} ${smallCircumference}`}
                                    strokeLinecap="round"
                                    rotation="-90"
                                    origin={`${smallRingCenter}, ${smallRingCenter}`}
                                />
                            )}
                        </Svg>
                        <View style={styles.qualityRingCenter}>
                            <Text style={styles.qualityRingText}>{avgQuality > 0 ? avgQuality : '—'}</Text>
                            <Text style={styles.qualityRingUnit}>/5</Text>
                        </View>
                    </View>
                </View>

                {/* Log Sleep Card */}
                <View style={styles.logCard}>
                    <View style={styles.logCardTop}>
                        <View style={styles.logCardLeft}>
                            <Text style={styles.logCardTitle}>Sleep</Text>
                            <View style={styles.logMetaRow}>
                                <View style={styles.logMetaItem}>
                                    <Icon type={Icons.Ionicons} name="moon-outline" color="#888" size={ms(14)} />
                                    <Text style={styles.logMetaText}>{formatDuration(totalMins)}</Text>
                                </View>
                                <View style={styles.logMetaItem}>
                                    <Icon type={Icons.Ionicons} name="star-outline" color="#888" size={ms(14)} />
                                    <Text style={styles.logMetaText}>
                                        {avgQuality > 0 ? `${QUALITY_LABELS[avgQuality]}` : 'Not rated'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.addSleepBtn}
                                onPress={() => navigation.navigate('AddSleepEntry')}
                            >
                                <Icon type={Icons.Ionicons} name="add" color={blackColor} size={ms(15)} />
                                <Text style={styles.addSleepText}>Log Sleep</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.logCardIconBg}>
                            <Icon type={Icons.Ionicons} name="moon" color={SLEEP_COLORS.Deep} size={ms(40)} />
                        </View>
                    </View>
                </View>

                {/* Today's Entries */}
                {todayEntries.length > 0 && (
                    <View style={styles.loggedSection}>
                        <Text style={styles.sectionTitle}>Today's Sleep Logs</Text>
                        {todayEntries.map((entry) => (
                            <View key={entry.id} style={styles.loggedItem}>
                                <View style={styles.loggedIconBg}>
                                    <Icon type={Icons.Ionicons} name="moon-outline" color={primaryColor} size={ms(18)} />
                                </View>
                                <View style={styles.loggedInfo}>
                                    <Text style={styles.loggedName}>
                                        {entry.bedtime} → {entry.wakeTime}
                                    </Text>
                                    <Text style={styles.loggedMeta}>
                                        {formatDuration(entry.duration)}  •  {QUALITY_LABELS[entry.quality] || '—'}
                                        {entry.notes ? `  •  ${entry.notes}` : ''}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => handleRemoveEntry(entry.id)} style={styles.removeBtn}>
                                    <Icon type={Icons.Ionicons} name="close-circle-outline" color="#CCC" size={ms(18)} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {/* Empty State */}
                {todayEntries.length === 0 && (
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>Track Your Sleep</Text>
                        <Text style={styles.infoDesc}>
                            Log your bedtime and wake time to understand your sleep patterns and improve your rest.{' '}
                            <Text style={styles.infoLink} onPress={() => navigation.navigate('AddSleepEntry')}>
                                Add Entry
                            </Text>
                        </Text>
                    </View>
                )}

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default SleepTrackingDashboard;

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
        paddingBottom: ms(5),
    },
    backButton: {
        width: ms(36),
        height: ms(40),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        flex: 1,
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    historyBtn: {
        padding: ms(4),
    },

    // Date Nav
    dateNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(15),
        paddingVertical: vs(10),
    },
    dateArrow: {
        padding: ms(4),
    },
    dateText: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },

    // Donut Card
    donutCard: {
        marginHorizontal: ms(15),
        marginTop: vs(5),
        backgroundColor: '#F1F5F9',
        borderRadius: ms(16),
        paddingVertical: vs(20),
        paddingHorizontal: ms(15),
    },
    donutRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    donutChartWrap: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    donutCenterText: {
        position: 'absolute',
        alignItems: 'center',
    },
    donutValue: {
        fontSize: ms(12),
        fontWeight: 'bold',
        color: blackColor,
        marginTop: vs(1),
    },
    donutSub: {
        fontSize: ms(7),
        color: '#BBB',
        marginTop: vs(1),
    },

    // Legend
    legendContainer: {
        flex: 1,
        marginLeft: ms(15),
        gap: vs(14),
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    legendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(8),
    },
    legendRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
    },
    legendDot: {
        width: ms(10),
        height: ms(10),
        borderRadius: ms(5),
    },
    legendLabel: {
        fontSize: ms(12),
        fontWeight: '500',
        color: '#444',
    },
    legendValue: {
        fontSize: ms(11),
        color: '#888',
    },

    // Quality Card
    qualityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: ms(15),
        marginTop: vs(15),
        backgroundColor: '#F1F5F9',
        borderRadius: ms(16),
        paddingVertical: vs(15),
        paddingHorizontal: ms(15),
    },
    qualityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(12),
    },
    qualityIconBg: {
        width: ms(42),
        height: ms(42),
        borderRadius: ms(10),
        backgroundColor: '#FFF8E1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qualityValue: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    qualityLabel: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(1),
    },
    qualityDate: {
        fontSize: ms(10),
        color: '#BBB',
        marginTop: vs(1),
    },
    qualityRingWrap: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qualityRingCenter: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    qualityRingText: {
        fontSize: ms(11),
        fontWeight: 'bold',
        color: '#FFB300',
    },
    qualityRingUnit: {
        fontSize: ms(7),
        color: '#FFB300',
    },

    // Log Card
    logCard: {
        marginHorizontal: ms(15),
        marginTop: vs(15),
        backgroundColor: '#F1F5F9',
        borderRadius: ms(16),
        paddingVertical: vs(15),
        paddingHorizontal: ms(15),
    },
    logCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logCardLeft: {
        flex: 1,
    },
    logCardTitle: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
    },
    logMetaRow: {
        flexDirection: 'row',
        gap: ms(15),
        marginTop: vs(8),
    },
    logMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
    },
    logMetaText: {
        fontSize: ms(12),
        color: '#888',
    },
    logCardIconBg: {
        width: ms(70),
        height: ms(70),
        borderRadius: ms(12),
        backgroundColor: '#EEF0FB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addSleepBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(5),
        marginTop: vs(14),
        paddingVertical: ms(6),
        paddingHorizontal: ms(10),
        backgroundColor: whiteColor,
        borderRadius: ms(20),
        width: ms(110),
        justifyContent: 'center',
    },
    addSleepText: {
        fontSize: ms(12),
        color: blackColor,
        fontWeight: '500',
    },

    // Logged Section
    loggedSection: {
        marginHorizontal: ms(15),
        marginTop: vs(20),
    },
    sectionTitle: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(10),
    },
    loggedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F8FB',
        borderRadius: ms(12),
        paddingHorizontal: ms(12),
        paddingVertical: vs(12),
        marginBottom: vs(8),
    },
    loggedIconBg: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: '#E8F5F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
    },
    loggedInfo: {
        flex: 1,
    },
    loggedName: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },
    loggedMeta: {
        fontSize: ms(10),
        color: '#888',
        marginTop: vs(2),
    },
    removeBtn: {
        padding: ms(4),
    },

    // Info Card
    infoCard: {
        marginHorizontal: ms(15),
        marginTop: vs(20),
        backgroundColor: '#F6F8FB',
        borderRadius: ms(16),
        padding: ms(15),
    },
    infoTitle: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(6),
    },
    infoDesc: {
        fontSize: ms(11),
        color: '#888',
        lineHeight: ms(18),
    },
    infoLink: {
        color: primaryColor,
        fontWeight: '600',
    },
});
