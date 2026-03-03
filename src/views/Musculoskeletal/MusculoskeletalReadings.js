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

const DEFAULT_READINGS = [
    {
        id: '1',
        date: 'Mon, 11 Feb,2026,12:30 PM',
        painLocation: 'Neck',
        severity: 'Dull',
        trigger: 'Injury',
        startDateTime: '2:30PM,11 Feb,2026',
        endDateTime: '2:30PM ,13 Feb,2026',
    },
    {
        id: '2',
        date: 'Mon, 11 Feb,2026,12:30 PM',
        painLocation: 'Neck',
        severity: 'Dull',
        trigger: 'Injury',
        startDateTime: '2:30PM,11 Feb,2026',
        endDateTime: '2:30PM ,13 Feb,2026',
    },
    {
        id: '3',
        date: 'Mon, 11 Feb,2026,12:30 PM',
        painLocation: 'Neck',
        severity: 'Dull',
        trigger: 'Injury',
        startDateTime: '2:30PM,11 Feb,2026',
        endDateTime: '2:30PM ,13 Feb,2026',
    },
    {
        id: '4',
        date: 'Mon, 11 Feb,2026,12:30 PM',
        painLocation: 'Neck',
        severity: 'Dull',
        trigger: 'Injury',
        startDateTime: '2:30PM,11 Feb,2026',
        endDateTime: '2:30PM ,13 Feb,2026',
    },
];

const MusculoskeletalReadings = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [search, setSearch] = useState('');

    const allReadings = route?.params?.readings || DEFAULT_READINGS;

    const filteredReadings = allReadings.filter((item) =>
        item.painLocation.toLowerCase().includes(search.toLowerCase()) ||
        item.severity.toLowerCase().includes(search.toLowerCase()) ||
        item.trigger.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toLowerCase().includes(search.toLowerCase())
    );

    const renderReading = ({ item }) => (
        <View style={styles.readingCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.readingDate}>{item.date}</Text>
                <TouchableOpacity style={styles.readingMenu}>
                    <Icon type={Icons.Ionicons} name="ellipsis-horizontal" color="#999" size={ms(18)} />
                </TouchableOpacity>
            </View>

            <View style={styles.cardContentRow}>
                <View>
                    <Text style={styles.cardSmallLabel}>Pain location</Text>
                    <Text style={styles.painLocationText}>{item.painLocation}</Text>
                </View>
                <View style={styles.severityBadge}>
                    <Text style={styles.severityBadgeText}>{item.severity}</Text>
                </View>
            </View>

            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Trigger</Text>
                <Text style={styles.cardInfoValue}>{item.trigger}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Starting Date & time</Text>
                <Text style={styles.cardInfoValue}>{item.startDateTime}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Ending Date & Time</Text>
                <Text style={styles.cardInfoValue}>{item.endDateTime}</Text>
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
                <Text style={styles.headerTitle}>Musculoskeletal</Text>
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

            {/* Section Header */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recently Added</Text>
            </View>

            {/* Readings List */}
            <FlatList
                data={filteredReadings}
                renderItem={renderReading}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon type={Icons.Ionicons} name="medkit-outline" color="#CCC" size={ms(40)} />
                        <Text style={styles.emptyText}>No records found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default MusculoskeletalReadings;

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

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        marginBottom: vs(12),
    },
    sectionTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
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
        width: ms(30),
        height: ms(30),
        borderRadius: ms(15),
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
    cardSmallLabel: {
        fontSize: ms(11),
        color: '#888',
        marginBottom: vs(2),
    },
    painLocationText: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
    },
    severityBadge: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(5),
        borderRadius: ms(20),
        backgroundColor: '#E0E7EF',
    },
    severityBadgeText: {
        fontSize: ms(12),
        fontWeight: 'bold',
        color: blackColor,
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
