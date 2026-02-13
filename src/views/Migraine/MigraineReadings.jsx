import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor } from '../../utils/globalColors';

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

const MigraineReadings = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [search, setSearch] = useState('');

    const allReadings = route?.params?.readings || [
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
        {
            id: '5',
            date: 'Mon, 11 Feb,2026,12:30 PM',
            painRegion: 'Temporal Region',
            severity: 'High',
            startedDate: '11 Feb,2026',
            endedDate: '12 Feb,2026',
        },
    ];

    const filteredReadings = allReadings.filter((item) =>
        item.painRegion.toLowerCase().includes(search.toLowerCase()) ||
        item.severity.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toLowerCase().includes(search.toLowerCase())
    );

    const renderReading = ({ item }) => (
        <View style={styles.readingCard}>
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

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Migraine Management</Text>
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
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
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
                        <Text style={styles.emptyText}>No migraine records found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default MigraineReadings;

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
    viewAllText: {
        fontSize: ms(13),
        color: '#888',
        fontWeight: '500',
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
