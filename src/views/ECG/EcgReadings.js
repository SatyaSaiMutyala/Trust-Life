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
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const DEFAULT_READINGS = [
    {
        id: '1', date: 'Mon, 11 Feb, 2026, 10:30 AM',
        rhythm: 'Normal Sinus', heartRate: '72 bpm',
        interpretation: 'Normal', qrs: '88 ms', pr: '160 ms', qtc: '410 ms',
    },
    {
        id: '2', date: 'Tue, 12 Feb, 2026, 9:15 AM',
        rhythm: 'Sinus Tachycardia', heartRate: '105 bpm',
        interpretation: 'Borderline', qrs: '92 ms', pr: '148 ms', qtc: '430 ms',
    },
    {
        id: '3', date: 'Wed, 13 Feb, 2026, 8:00 AM',
        rhythm: 'Normal Sinus', heartRate: '68 bpm',
        interpretation: 'Normal', qrs: '84 ms', pr: '155 ms', qtc: '405 ms',
    },
    {
        id: '4', date: 'Thu, 14 Feb, 2026, 7:45 AM',
        rhythm: 'Sinus Bradycardia', heartRate: '52 bpm',
        interpretation: 'Borderline', qrs: '90 ms', pr: '170 ms', qtc: '420 ms',
    },
];

const INTERPRETATION_COLORS = {
    Normal: { bg: '#D1FAE5', text: primaryColor },
    Borderline: { bg: '#FEF3C7', text: '#D97706' },
    Abnormal: { bg: '#FEE2E2', text: '#EF4444' },
};

const EcgReadings = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [search, setSearch] = useState('');

    const allReadings = route?.params?.readings || DEFAULT_READINGS;

    const filteredReadings = allReadings.filter((item) =>
        item.rhythm.toLowerCase().includes(search.toLowerCase()) ||
        item.interpretation.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toLowerCase().includes(search.toLowerCase())
    );

    const renderReading = ({ item }) => {
        const ic = INTERPRETATION_COLORS[item.interpretation] || INTERPRETATION_COLORS.Normal;
        return (
            <View style={styles.readingCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.readingDate}>{item.date}</Text>
                    <TouchableOpacity style={styles.menuBtn}>
                        <Icon type={Icons.Ionicons} name="ellipsis-horizontal" color="#999" size={ms(18)} />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardContentRow}>
                    <Text style={styles.rhythmText}>{item.rhythm}</Text>
                    <View style={[styles.badge, { backgroundColor: ic.bg }]}>
                        <Text style={[styles.badgeText, { color: ic.text }]}>{item.interpretation}</Text>
                    </View>
                </View>

                <View style={styles.cardInfoRow}>
                    <Text style={styles.infoLabel}>Heart Rate</Text>
                    <Text style={styles.infoValue}>{item.heartRate}</Text>
                </View>
                <View style={styles.cardInfoRow}>
                    <Text style={styles.infoLabel}>QRS / PR / QTc</Text>
                    <Text style={styles.infoValue}>{item.qrs}  {item.pr}  {item.qtc}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ECG Management</Text>
                <View style={{ width: ms(40) }} />
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Icon type={Icons.Ionicons} name="search" color="#999" size={ms(18)} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by rhythm, interpretation..."
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recently Added</Text>
            </View>

            {/* List */}
            <FlatList
                data={filteredReadings}
                renderItem={renderReading}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon type={Icons.Ionicons} name="heart-outline" color="#CCC" size={ms(40)} />
                        <Text style={styles.emptyText}>No ECG records found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default EcgReadings;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(15), paddingTop: ms(50), paddingBottom: ms(10),
    },
    backButton: { width: ms(40), height: ms(40), justifyContent: 'center', alignItems: 'flex-start' },
    headerTitle: { flex: 1, fontSize: ms(16), fontWeight: 'bold', color: blackColor },

    searchContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F1F5F9', borderRadius: ms(25),
        marginHorizontal: ms(20), paddingHorizontal: ms(14),
        paddingVertical: vs(10), marginBottom: vs(15), gap: ms(8),
    },
    searchInput: { flex: 1, fontSize: ms(14), color: blackColor, padding: 0 },

    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: ms(20), marginBottom: vs(12),
    },
    sectionTitle: { fontSize: ms(16), fontWeight: 'bold', color: blackColor },

    listContent: { paddingHorizontal: ms(20), paddingBottom: vs(30) },

    readingCard: {
        backgroundColor: '#F6F8FB', borderRadius: ms(12),
        paddingHorizontal: ms(15), paddingVertical: vs(14), marginBottom: vs(8),
    },
    cardHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: vs(10),
    },
    readingDate: { fontSize: ms(11), color: '#888' },
    menuBtn: {
        width: ms(30), height: ms(30), borderRadius: ms(18),
        backgroundColor: '#E8ECF0', justifyContent: 'center', alignItems: 'center',
    },
    cardContentRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: vs(10),
    },
    rhythmText: { fontSize: ms(14), fontWeight: '600', color: blackColor },
    badge: { paddingHorizontal: ms(16), paddingVertical: vs(3), borderRadius: ms(20) },
    badgeText: { fontSize: ms(12), fontWeight: 'bold' },
    cardInfoRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: vs(3),
    },
    infoLabel: { fontSize: ms(12), color: '#888' },
    infoValue: { fontSize: ms(12), fontWeight: '600', color: blackColor },

    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: vs(80), gap: vs(10) },
    emptyText: { fontSize: ms(14), color: '#999' },
});
