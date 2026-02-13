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

const WeightManagementReadings = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [search, setSearch] = useState('');

    // Get readings from params or use default
    const allReadings = route?.params?.readings || [
        { id: '1', date: 'Mon, 11 Feb,2026,12:30 PM', bpm: 25, status:'morning' },
        { id: '2', date: 'Mon, 11 Feb,2026,12:30 PM', bpm: 25, status:'morning' },
        { id: '3', date: 'Mon, 11 Feb,2026,12:30 PM', bpm: 25, status:'morning' },
        { id: '4', date: 'Mon, 11 Feb,2026,12:30 PM', bpm: 25, status:'morning' },
        { id: '5', date: 'Mon, 11 Feb,2026,12:30 PM', bpm: 25, status:'morning' },
        { id: '6', date: 'Mon, 11 Feb,2026,12:30 PM', bpm: 25, status:'morning' },
        { id: '7', date: 'Mon, 11 Feb,2026,12:30 PM', bpm: 25, status:'morning' },
        { id: '8', date: 'Mon, 11 Feb,2026,12:30 PM', bpm: 25, status:'morning' },
    ];

    const filteredReadings = allReadings.filter((item) =>
        `${item.bpm} BPM`.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toLowerCase().includes(search.toLowerCase())
    );

    const renderReading = ({ item }) => (
        <View style={styles.readingCard}>
            <View style={styles.readingInfo}>
                <Text style={styles.readingDate}>{item.date}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.readingBpm}>{item.bpm} Kg</Text>
                    <Text style={{ paddingVertical: ms(5), paddingHorizontal: ms(15), backgroundColor: whiteColor, fontSize: ms(11), marginLeft: ms(15), borderRadius: ms(10) }}>{item.status} Kg</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.readingMenu}>
                <Icon type={Icons.Ionicons} name="ellipsis-horizontal" color="#999" size={ms(20)} />
            </TouchableOpacity>
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
                <Text style={styles.headerTitle}>Weight Management Readings</Text>
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

            {/* Readings List */}
            <FlatList
                data={filteredReadings}
                renderItem={renderReading}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon type={Icons.Ionicons} name="heart-outline" color="#CCC" size={ms(40)} />
                        <Text style={styles.emptyText}>No readings found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default WeightManagementReadings;

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

    // List
    listContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },
    readingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F6F8FB',
        borderRadius: ms(12),
        paddingHorizontal: ms(15),
        paddingVertical: vs(14),
        marginBottom: vs(8),
    },
    readingInfo: {
        flex: 1,
    },
    readingDate: {
        fontSize: ms(11),
        color: '#888',
        marginBottom: vs(4),
    },
    readingBpm: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    readingMenu: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
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
