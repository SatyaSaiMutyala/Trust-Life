import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const { width } = Dimensions.get('window');
const CARD_GAP = ms(12);
const CARD_WIDTH = (width - ms(15) * 2 - CARD_GAP) / 2;

const MOCK_DOCTORS = [
    { id: '1', name: 'Dr. Ramesh Kumar', rating: 4.5, reviews: '86k', specialty: 'General Physician', online: false },
    { id: '2', name: 'Dr. Anil Sharma',  rating: 4.5, reviews: '86k', specialty: 'General Physician', online: false },
    { id: '3', name: 'Dr. Ramesh Kumar', rating: 4.5, reviews: '86k', specialty: 'Dermatologist',     online: false },
    { id: '4', name: 'Dr. Anil Sharma',  rating: 4.5, reviews: '86k', specialty: 'General Physician', online: true  },
    { id: '5', name: 'Dr. Anil Sharma',  rating: 4.5, reviews: '86k', specialty: 'General Physician', online: true  },
    { id: '6', name: 'Dr. Anil Sharma',  rating: 4.5, reviews: '86k', specialty: 'General Physician', online: false },
];

const FILTERS = ['Specialization', 'Experience'];

const DoctorCard = ({ item, index, onPress }) => (
    <TouchableOpacity
        style={[
            styles.card,
            index % 2 === 0 ? { marginRight: CARD_GAP / 2 } : { marginLeft: CARD_GAP / 2 },
        ]}
        activeOpacity={0.85}
        onPress={onPress}
    >
        {/* Avatar */}
        <View style={styles.avatarWrap}>
            <View style={styles.avatarBg}>
                <Icon type={Icons.MaterialIcons} name="person" size={ms(40)} color="#90CAF9" />
            </View>
            <View style={[styles.statusDot, { backgroundColor: item.online ? '#4CAF50' : '#F44336' }]} />
        </View>

        {/* Name */}
        <Text style={styles.doctorName} numberOfLines={1}>{item.name}</Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
            <Icon type={Icons.MaterialIcons} name="star" size={ms(12)} color="#FFC107" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewText}>  {item.reviews} Reviews</Text>
        </View>

        {/* Specialty badge */}
        <View style={styles.specialtyBadge}>
            <Text style={styles.specialtyText} numberOfLines={1}>{item.specialty}</Text>
            <Icon type={Icons.MaterialIcons} name="north-east" size={ms(12)} color="#555" />
        </View>
    </TouchableOpacity>
);

const DoctorSpecialistList = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const specialtyName = route.params?.specialtyName || 'Doctors';

    const [search, setSearch] = useState('');

    const filtered = search.trim()
        ? MOCK_DOCTORS.filter((d) =>
              d.name.toLowerCase().includes(search.toLowerCase()) ||
              d.specialty.toLowerCase().includes(search.toLowerCase()),
          )
        : MOCK_DOCTORS;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{specialtyName}</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Icon type={Icons.Feather} name="search" color="#999" size={ms(18)} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for Specialized Doctors"
                    placeholderTextColor="#AAAAAA"
                    value={search}
                    onChangeText={setSearch}
                />
                <TouchableOpacity>
                    <Icon type={Icons.Ionicons} name="options-outline" color={primaryColor} size={ms(20)} />
                </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity
                        style={styles.filterChip}
                        onPress={() => navigation.navigate('DoctorFilters')}
                    >
                        <Icon type={Icons.Ionicons} name="options-outline" color="#444" size={ms(13)} />
                        <Text style={styles.filterChipText}>Filters</Text>
                        <Icon type={Icons.Ionicons} name="chevron-down" color="#888" size={ms(13)} />
                    </TouchableOpacity>

                    {FILTERS.map((f) => (
                        <TouchableOpacity key={f} style={styles.filterChip}>
                            <Text style={styles.filterChipText}>{f}</Text>
                            <Icon type={Icons.Ionicons} name="chevron-down" color="#888" size={ms(13)} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Doctor Grid */}
            <FlatList
                data={filtered}
                renderItem={({ item, index }) => (
                    <DoctorCard
                        item={item}
                        index={index}
                        onPress={() => navigation.navigate('DoctorProfileScreen', { doctor: item })}
                    />
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={styles.grid}
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Icon type={Icons.Ionicons} name="search-outline" color="#CCC" size={ms(40)} />
                        <Text style={styles.emptyText}>No doctors found</Text>
                    </View>
                }
            />

        </SafeAreaView>
    );
};

export default DoctorSpecialistList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(10),
    },
    backBtn: {
        width: ms(36),
        height: ms(36),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        flex: 1,
    },

    // Search
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(25),
        marginHorizontal: ms(15),
        paddingHorizontal: ms(14),
        paddingVertical: vs(10),
        gap: ms(8),
        marginBottom: vs(10),
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    searchInput: {
        flex: 1,
        fontSize: ms(13),
        color: blackColor,
        padding: 0,
    },

    // Filters
    filterWrapper: {
        height: vs(44),
        marginBottom: ms(5),
    },
    filterRow: {
        paddingHorizontal: ms(15),
        alignItems: 'center',
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(12),
        paddingVertical: vs(7),
        borderRadius: ms(20),
        borderWidth: 1,
        borderColor: '#D0D0D0',
        backgroundColor: whiteColor,
        marginRight: ms(8),
    },
    filterChipText: {
        fontSize: ms(12),
        color: '#444',
        fontWeight: '500',
        marginHorizontal: ms(4),
    },

    // Grid
    grid: {
        paddingHorizontal: ms(15),
        paddingBottom: vs(20),
    },

    // Doctor Card
    card: {
        width: CARD_WIDTH,
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        marginBottom: ms(12),
        padding: ms(12),
        alignItems: 'center',
    },
    avatarWrap: {
        position: 'relative',
        marginBottom: vs(8),
    },
    avatarBg: {
        width: ms(70),
        height: ms(70),
        borderRadius: ms(35),
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    statusDot: {
        position: 'absolute',
        bottom: ms(2),
        right: ms(2),
        width: ms(11),
        height: ms(11),
        borderRadius: ms(6),
        borderWidth: 1.5,
        borderColor: whiteColor,
    },
    doctorName: {
        fontSize: ms(12),
        fontWeight: '700',
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(4),
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    ratingText: {
        fontSize: ms(11),
        fontWeight: '600',
        color: blackColor,
        marginLeft: ms(2),
    },
    reviewText: {
        fontSize: ms(10),
        color: '#999',
    },
    specialtyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
        backgroundColor: '#F1F5F9',
        paddingHorizontal: ms(10),
        paddingVertical: vs(5),
        borderRadius: ms(20),
        alignSelf: 'stretch',
        justifyContent: 'space-between',
    },
    specialtyText: {
        fontSize: ms(10),
        color: '#444',
        fontWeight: '500',
        flex: 1,
    },

    // Empty
    emptyWrap: {
        alignItems: 'center',
        paddingTop: vs(60),
        gap: vs(10),
    },
    emptyText: {
        fontSize: ms(14),
        color: '#999',
    },
});
