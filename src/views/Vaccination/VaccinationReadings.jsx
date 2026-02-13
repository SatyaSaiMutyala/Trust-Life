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

const VaccinationReadings = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [search, setSearch] = useState('');

    const allReadings = route?.params?.readings || [
        {
            id: '1',
            date: 'Mon, 11 Feb,2026,12:30 PM',
            name: 'Covid',
            batchNumber: 'UTG5758KERT',
            totalDoses: 4,
            completedDoses: 3,
            takenDate: '11 Feb,2026',
            nextDue: '25 Mar,2026',
        },
        {
            id: '2',
            date: 'Mon, 11 Feb,2026,12:30 PM',
            name: 'Covid',
            batchNumber: 'UTG5758KERT',
            totalDoses: 4,
            completedDoses: 4,
            takenDate: '11 Feb,2026',
            nextDue: '25 Mar,2026',
        },
        {
            id: '3',
            date: 'Mon, 11 Feb,2026,12:30 PM',
            name: 'Covid',
            batchNumber: 'UTG5758KERT',
            totalDoses: 4,
            completedDoses: 3,
            takenDate: '11 Feb,2026',
            nextDue: '25 Mar,2026',
        },
        {
            id: '4',
            date: 'Mon, 11 Feb,2026,12:30 PM',
            name: 'Covid',
            batchNumber: 'UTG5758KERT',
            totalDoses: 4,
            completedDoses: 4,
            takenDate: '11 Feb,2026',
            nextDue: '25 Mar,2026',
        },
    ];

    const filteredReadings = allReadings.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toLowerCase().includes(search.toLowerCase())
    );

    const renderDoseCircles = (total, completed) => {
        const circles = [];
        for (let i = 0; i < total; i++) {
            const isCompleted = i < completed;
            circles.push(
                <View
                    key={i}
                    style={[
                        styles.doseCircle,
                        isCompleted ? styles.doseCompleted : styles.dosePending,
                    ]}
                >
                    {isCompleted ? (
                        <Icon type={Icons.Ionicons} name="checkmark" size={ms(12)} color={whiteColor} />
                    ) : (
                        <Text style={styles.doseNumber}>{i + 1}</Text>
                    )}
                </View>
            );
        }
        return circles;
    };

    const renderReading = ({ item }) => (
        <View style={styles.readingCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.readingDate}>{item.date}</Text>
                <TouchableOpacity style={styles.readingMenu}>
                    <Icon type={Icons.Ionicons} name="ellipsis-horizontal" color="#999" size={ms(20)} />
                </TouchableOpacity>
            </View>

            <View style={styles.cardNameRow}>
                <Text style={styles.cardVaccineName}>{item.name}</Text>
                <Text style={styles.cardBatchNumber}>{item.batchNumber}</Text>
            </View>

            <View style={styles.doseRow}>
                {renderDoseCircles(item.totalDoses, item.completedDoses)}
            </View>

            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Taken Date</Text>
                <Text style={styles.cardInfoValue}>{item.takenDate}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Next Due</Text>
                <Text style={styles.cardInfoValue}>{item.nextDue}</Text>
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
                <Text style={styles.headerTitle}>Vaccination Readings</Text>
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
                        <Icon type={Icons.Ionicons} name="medkit-outline" color="#CCC" size={ms(40)} />
                        <Text style={styles.emptyText}>No vaccination records found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default VaccinationReadings;

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
        marginBottom: vs(8),
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
    cardNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    cardVaccineName: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
    },
    cardBatchNumber: {
        fontSize: ms(12),
        color: '#888',
        fontWeight: '500',
    },
    doseRow: {
        flexDirection: 'row',
        gap: ms(6),
        marginBottom: vs(10),
    },
    doseCircle: {
        width: ms(26),
        height: ms(26),
        borderRadius: ms(13),
        justifyContent: 'center',
        alignItems: 'center',
    },
    doseCompleted: {
        backgroundColor: primaryColor,
    },
    dosePending: {
        backgroundColor: '#CBD5E1',
    },
    doseNumber: {
        fontSize: ms(11),
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
