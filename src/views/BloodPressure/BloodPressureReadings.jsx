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

const SYSTOLIC_COLOR = '#E53935';
const DIASTOLIC_COLOR = '#1E88E5';

const BloodPressureReadings = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [search, setSearch] = useState('');

    const allReadings = route?.params?.readings || [
        { id: '1', date: 'Mon, 11 Feb,2026,12:30 PM', systolic: 120, diastolic: 80 },
        { id: '2', date: 'Mon, 11 Feb,2026,12:30 PM', systolic: 118, diastolic: 78 },
        { id: '3', date: 'Mon, 11 Feb,2026,12:30 PM', systolic: 122, diastolic: 82 },
        { id: '4', date: 'Mon, 11 Feb,2026,12:30 PM', systolic: 115, diastolic: 75 },
        { id: '5', date: 'Mon, 11 Feb,2026,12:30 PM', systolic: 125, diastolic: 85 },
        { id: '6', date: 'Mon, 11 Feb,2026,12:30 PM', systolic: 130, diastolic: 88 },
        { id: '7', date: 'Mon, 11 Feb,2026,12:30 PM', systolic: 117, diastolic: 77 },
        { id: '8', date: 'Mon, 11 Feb,2026,12:30 PM', systolic: 121, diastolic: 81 },
    ];

    const filteredReadings = allReadings.filter((item) =>
        `${item.systolic}/${item.diastolic} mmHg`.toLowerCase().includes(search.toLowerCase()) ||
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
            <View style={styles.readingRow}>
                <View style={[styles.readingDot, { backgroundColor: DIASTOLIC_COLOR }]} />
                <Text style={styles.readingBp}>{item.diastolic} mmHg</Text>
                <Text style={styles.readingLabel}>Diastolic</Text>
            </View>
            <View style={styles.readingRow}>
                <View style={[styles.readingDot, { backgroundColor: SYSTOLIC_COLOR }]} />
                <Text style={styles.readingBp}>{item.systolic} mmHg</Text>
                <Text style={styles.readingLabel}>Systolic</Text>
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
                <Text style={styles.headerTitle}>Blood Pressure Readings</Text>
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
                        <Icon type={Icons.Ionicons} name="fitness-outline" color="#CCC" size={ms(40)} />
                        <Text style={styles.emptyText}>No readings found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default BloodPressureReadings;

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
        marginBottom: vs(8),
    },
    readingDate: {
        fontSize: ms(11),
        color: '#888',
    },
    readingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(8),
        paddingVertical:ms(10),
        backgroundColor:whiteColor,
        paddingHorizontal:ms(10),
        borderRadius:ms(12)
    },
    readingDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        marginRight: ms(8),
    },
    readingBp: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: blackColor,
        marginRight: ms(8),
    },
    readingLabel: {
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
