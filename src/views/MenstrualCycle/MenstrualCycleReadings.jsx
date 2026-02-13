import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor } from '../../utils/globalColors';

const PERIOD_COLOR = '#E8837C';

const MenstrualCycleReadings = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [search, setSearch] = useState('');

    const allReadings = route?.params?.readings || [
        { id: '1', date: 'Mon, 11 Feb,2026,12:30 PM', startDate: '24 Feb,2026', endDate: '24 Feb,2026', flow: 'Light', mood: 'Relaxed', moodEmoji: '😊' },
        { id: '2', date: 'Mon, 11 Feb,2026,12:30 PM', startDate: '24 Feb,2026', endDate: '24 Feb,2026', flow: 'Light', mood: 'Relaxed', moodEmoji: '😊' },
        { id: '3', date: 'Mon, 11 Feb,2026,12:30 PM', startDate: '24 Feb,2026', endDate: '24 Feb,2026', flow: 'Light', mood: 'Relaxed', moodEmoji: '😊' },
        { id: '4', date: 'Mon, 11 Feb,2026,12:30 PM', startDate: '24 Feb,2026', endDate: '24 Feb,2026', flow: 'Light', mood: 'Relaxed', moodEmoji: '😊' },
        { id: '5', date: 'Mon, 11 Feb,2026,12:30 PM', startDate: '24 Feb,2026', endDate: '24 Feb,2026', flow: 'Heavy', mood: 'Calm', moodEmoji: '😌' },
        { id: '6', date: 'Mon, 11 Feb,2026,12:30 PM', startDate: '24 Feb,2026', endDate: '24 Feb,2026', flow: 'Medium', mood: 'Normal', moodEmoji: '😐' },
        { id: '7', date: 'Mon, 11 Feb,2026,12:30 PM', startDate: '24 Feb,2026', endDate: '24 Feb,2026', flow: 'Light', mood: 'Relaxed', moodEmoji: '😊' },
        { id: '8', date: 'Mon, 11 Feb,2026,12:30 PM', startDate: '24 Feb,2026', endDate: '24 Feb,2026', flow: 'Medium', mood: 'Worried', moodEmoji: '😟' },
    ];

    const filteredReadings = allReadings.filter((item) =>
        item.flow.toLowerCase().includes(search.toLowerCase()) ||
        item.mood.toLowerCase().includes(search.toLowerCase()) ||
        item.startDate.toLowerCase().includes(search.toLowerCase()) ||
        item.endDate.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toLowerCase().includes(search.toLowerCase())
    );

    const renderReading = ({ item }) => (
        <View style={styles.readingCard}>
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
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Menstrual Cycle</Text>
                <View style={{ width: ms(40) }} />
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Icon type={Icons.Ionicons} name="search" color="#999" size={ms(18)} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Section Title */}
            <Text style={styles.sectionTitle}>Recently Added</Text>

            {/* Readings List */}
            <FlatList
                data={filteredReadings}
                renderItem={renderReading}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon type={Icons.Ionicons} name="calendar-outline" color="#CCC" size={ms(40)} />
                        <Text style={styles.emptyText}>No readings found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default MenstrualCycleReadings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
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
    headerTitle: {
        flex: 1,
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(25),
        marginHorizontal: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: vs(10),
        marginBottom: vs(15),
        gap: ms(8),
    },
    searchInput: {
        flex: 1,
        fontSize: ms(14),
        color: blackColor,
        padding: 0,
    },

    // Section Title
    sectionTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        paddingHorizontal: ms(20),
        marginBottom: vs(12),
    },

    // List
    listContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
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
});
