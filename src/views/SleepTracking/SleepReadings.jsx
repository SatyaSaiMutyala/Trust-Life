import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const QUALITY_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
const QUALITY_COLORS = ['', '#EF5350', '#FF9800', '#FFC107', '#66BB6A', '#26A69A'];

const formatDuration = (mins) => {
    if (!mins) return '0h 0m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
};

const SleepReadings = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const sleepEntries = route.params?.sleepEntries || [];

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardIconBg}>
                <Icon type={Icons.Ionicons} name="moon-outline" color={primaryColor} size={ms(20)} />
            </View>
            <View style={styles.cardInfo}>
                <Text style={styles.cardDate}>{item.date}</Text>
                <Text style={styles.cardTime}>
                    {item.bedtime} → {item.wakeTime}
                </Text>
                {item.notes ? (
                    <Text style={styles.cardNotes} numberOfLines={1}>{item.notes}</Text>
                ) : null}
            </View>
            <View style={styles.cardRight}>
                <Text style={styles.cardDuration}>{formatDuration(item.duration)}</Text>
                <View style={[styles.qualityBadge, { backgroundColor: QUALITY_COLORS[item.quality] + '22' }]}>
                    <Text style={[styles.qualityBadgeText, { color: QUALITY_COLORS[item.quality] }]}>
                        {QUALITY_LABELS[item.quality] || '—'}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sleep History</Text>
                <View style={{ width: ms(36) }} />
            </View>

            <FlatList
                data={sleepEntries}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon type={Icons.Ionicons} name="moon-outline" color="#CCC" size={ms(48)} />
                        <Text style={styles.emptyText}>No sleep entries yet</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AddSleepEntry')}>
                            <Text style={styles.emptyLink}>Log your first sleep</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default SleepReadings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
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

    // List
    listContent: {
        paddingHorizontal: ms(15),
        paddingTop: vs(10),
        paddingBottom: vs(30),
    },

    // Card
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F8FB',
        borderRadius: ms(14),
        paddingHorizontal: ms(14),
        paddingVertical: vs(14),
        marginBottom: vs(10),
    },
    cardIconBg: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        backgroundColor: '#E8F5F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    cardInfo: {
        flex: 1,
    },
    cardDate: {
        fontSize: ms(11),
        color: '#999',
        marginBottom: vs(2),
    },
    cardTime: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },
    cardNotes: {
        fontSize: ms(11),
        color: '#AAA',
        marginTop: vs(2),
    },
    cardRight: {
        alignItems: 'flex-end',
        gap: vs(6),
    },
    cardDuration: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: blackColor,
    },
    qualityBadge: {
        paddingHorizontal: ms(8),
        paddingVertical: vs(3),
        borderRadius: ms(10),
    },
    qualityBadgeText: {
        fontSize: ms(10),
        fontWeight: '600',
    },

    // Empty
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: vs(80),
        gap: vs(10),
    },
    emptyText: {
        fontSize: ms(14),
        color: '#999',
    },
    emptyLink: {
        fontSize: ms(13),
        color: primaryColor,
        fontWeight: '600',
    },
});
