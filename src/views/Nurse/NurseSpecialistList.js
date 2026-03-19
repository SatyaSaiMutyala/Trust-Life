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
    Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import LinearGradient from 'react-native-linear-gradient';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { heading, interMedium, interRegular } from '../../config/Constants';

const { width } = Dimensions.get('window');
const CARD_GAP = ms(12);
const CARD_WIDTH = (width - ms(15) * 2 - CARD_GAP) / 2;

const MOCK_NURSES = [
    { id: '1', name: 'Suresh Varma',   rating: 4.5, reviews: '86k', online: true,  image: require('../../assets/img/nurse-six.png')   },
    { id: '2', name: 'Leela',          rating: 4.5, reviews: '86k', online: false, image: require('../../assets/img/nurse-seven.png') },
    { id: '3', name: 'Suma',           rating: 4.5, reviews: '86k', online: false, image: require('../../assets/img/nurse-eight.png') },
    { id: '4', name: 'Anil Kumar',     rating: 4.5, reviews: '86k', online: true,  image: require('../../assets/img/nurse-six.png')   },
    { id: '5', name: 'Sathosh Kumar',  rating: 4.5, reviews: '86k', online: false, image: require('../../assets/img/nurse-seven.png') },
    { id: '6', name: 'Leela',          rating: 4.5, reviews: '86k', online: true,  image: require('../../assets/img/nurse-eight.png') },
    { id: '7', name: 'Anil Kumar',     rating: 4.5, reviews: '86k', online: false, image: require('../../assets/img/nurse-six.png')   },
    { id: '8', name: 'Suma',           rating: 4.5, reviews: '86k', online: false, image: require('../../assets/img/nurse-seven.png') },
];

const FILTERS = ['Experience', 'Consultation Type'];

const NurseCard = ({ item, index, onPress }) => (
    <TouchableOpacity
        style={[
            styles.card,
            index % 2 === 0 ? { marginRight: CARD_GAP / 2 } : { marginLeft: CARD_GAP / 2 },
        ]}
        activeOpacity={0.85}
        onPress={onPress}
    >
        <View style={styles.avatarWrap}>
            <Image source={item.image} style={styles.avatarBg} resizeMode="cover" />
            <View style={[styles.statusDot, { backgroundColor: item.online ? '#4CAF50' : '#9CA3AF' }]} />
        </View>
        <Text style={styles.nurseName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.ratingRow}>
            <Icon type={Icons.MaterialIcons} name="star" size={ms(13)} color="#FFC107" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewText}>  {item.reviews} Reviews</Text>
        </View>
    </TouchableOpacity>
);

const NurseSpecialistList = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const nurseType = route.params?.specialtyName || 'Nurses';
    const flow = route.params?.flow;

    const [search, setSearch] = useState('');

    const filtered = search.trim()
        ? MOCK_NURSES.filter((n) => n.name.toLowerCase().includes(search.toLowerCase()))
        : MOCK_NURSES;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{nurseType}</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Icon type={Icons.Feather} name="search" color="#999" size={ms(18)} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for Specialized pediatric Nurse"
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
                        <TouchableOpacity style={styles.filterChip}>
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

                {/* Nurse Grid */}
                <FlatList
                    data={filtered}
                    renderItem={({ item, index }) => (
                        <NurseCard
                            item={item}
                            index={index}
                            onPress={() => navigation.navigate('NurseProfileScreen', { doctor: item, flow })}
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
                            <Text style={styles.emptyText}>No nurses found</Text>
                        </View>
                    }
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

export default NurseSpecialistList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    gradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(10),
    },
    backBtn: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    headerTitle: {
        fontSize: ms(16),
        fontFamily: interMedium,
        color: whiteColor,
        flex: 1,
    },
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
        backgroundColor: whiteColor,
        marginRight: ms(8),
        gap: ms(3),
    },
    filterChipText: {
        fontSize: ms(12),
        color: '#444',
        fontFamily: interMedium,
        marginHorizontal: ms(2),
    },
    grid: {
        paddingHorizontal: ms(15),
        paddingBottom: vs(20),
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        marginBottom: ms(12),
        padding: ms(14),
        alignItems: 'center',
    },
    avatarWrap: {
        position: 'relative',
        marginBottom: vs(8),
    },
    avatarBg: {
        width: ms(72),
        height: ms(72),
        borderRadius: ms(36),
        overflow: 'hidden',
    },
    statusDot: {
        position: 'absolute',
        bottom: ms(2),
        right: ms(2),
        width: ms(12),
        height: ms(12),
        borderRadius: ms(6),
        borderWidth: 2,
        borderColor: whiteColor,
    },
    nurseName: {
        fontSize: ms(12),
        fontFamily: interMedium,
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(4),
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: ms(11),
        fontFamily: interMedium,
        color: blackColor,
        marginLeft: ms(2),
    },
    reviewText: {
        fontSize: ms(10),
        color: '#999',
    },
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
