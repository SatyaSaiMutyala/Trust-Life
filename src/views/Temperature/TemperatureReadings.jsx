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

const FAHRENHEIT_COLOR = '#E53935';
const CELSIUS_COLOR = '#1E88E5';

const TemperatureReadings = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [search, setSearch] = useState('');

    const allReadings = route?.params?.readings || [
        { id: '1', date: 'Mon, 11 Feb,2026,12:30 PM', fahrenheit: 98.6, celsius: 37.0, method: 'Mouth' },
        { id: '2', date: 'Mon, 11 Feb,2026,12:30 PM', fahrenheit: 99.1, celsius: 37.3, method: 'Mouth' },
        { id: '3', date: 'Mon, 11 Feb,2026,12:30 PM', fahrenheit: 98.2, celsius: 36.8, method: 'Mouth' },
        { id: '4', date: 'Mon, 11 Feb,2026,12:30 PM', fahrenheit: 100.4, celsius: 38.0, method: 'Mouth' },
        { id: '5', date: 'Mon, 11 Feb,2026,12:30 PM', fahrenheit: 97.8, celsius: 36.6, method: 'Underarm' },
        { id: '6', date: 'Mon, 11 Feb,2026,12:30 PM', fahrenheit: 99.5, celsius: 37.5, method: 'Ear' },
        { id: '7', date: 'Mon, 11 Feb,2026,12:30 PM', fahrenheit: 98.6, celsius: 37.0, method: 'Mouth' },
        { id: '8', date: 'Mon, 11 Feb,2026,12:30 PM', fahrenheit: 98.9, celsius: 37.2, method: 'Forehead' },
    ];

    const filteredReadings = allReadings.filter((item) =>
        `${item.fahrenheit}°F`.includes(search) ||
        `${item.celsius}°C`.includes(search) ||
        item.method.toLowerCase().includes(search.toLowerCase()) ||
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
            <View style={styles.methodBadge}>
                <Text style={styles.methodBadgeText}>{item.method}</Text>
            </View>
            <View style={styles.tempValuesRow}>
                <View style={styles.tempValueItem}>
                    <Text style={styles.tempLabel}>Fahrenheit</Text>
                    <View style={[styles.readingDot, { backgroundColor: FAHRENHEIT_COLOR }]} />
                    <Text style={styles.tempValue}>{item.fahrenheit}°F</Text>
                </View>
                <View style={styles.tempValueItem}>
                    <Text style={styles.tempLabel}>Celsius</Text>
                    <View style={[styles.readingDot, { backgroundColor: CELSIUS_COLOR }]} />
                    <Text style={styles.tempValue}>{item.celsius}°C</Text>
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
                <Text style={styles.headerTitle}>Body Temperature</Text>
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
                        <Icon type={Icons.Ionicons} name="thermometer-outline" color="#CCC" size={ms(40)} />
                        <Text style={styles.emptyText}>No readings found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default TemperatureReadings;

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
    methodBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#1A2B4A',
        borderRadius: ms(12),
        paddingHorizontal: ms(12),
        paddingVertical: vs(4),
        marginBottom: vs(8),
    },
    methodBadgeText: {
        fontSize: ms(10),
        color: whiteColor,
        fontWeight: '600',
    },
    tempValuesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tempValueItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(5),
    },
    tempLabel: {
        fontSize: ms(11),
        color: '#888',
    },
    readingDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
    },
    tempValue: {
        fontSize: ms(13),
        fontWeight: 'bold',
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
