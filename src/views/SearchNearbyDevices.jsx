import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../utils/globalColors';

const MOCK_DEVICES = [
    {
        id: '1',
        name: 'Sony Smart watch',
        model: 'SGBH466',
        image: require('../assets/img/smartwatch.png'),
        paired: true,
    },
];

const SearchNearbyDevices = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');

    const filteredDevices = MOCK_DEVICES.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    const renderDevice = ({ item }) => (
        <View style={styles.deviceCard}>
            <Image source={item.image} style={styles.deviceImage} />
            <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{item.name}</Text>
                <Text style={styles.deviceModel}>Model : {item.model}</Text>
            </View>
            <View style={[styles.badge, item.paired ? styles.badgePaired : styles.badgeDefault]}>
                <Text style={[styles.badgeText, item.paired && styles.badgeTextPaired]}>
                    {item.paired ? 'Paired' : 'Connect'}
                </Text>
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
                <Text style={styles.headerTitle}>Search Nearby Devices</Text>
                <View style={{ width: ms(40) }} />
            </View>

            {/* Description */}
            <Text style={styles.description}>
                Scan and find available devices to connect and start syncing your heart rate readings easily.
            </Text>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Icon type={Icons.Ionicons} name="search" color="#999" size={ms(18)} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Smart Device"
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Device List */}
            <FlatList
                data={filteredDevices}
                renderItem={renderDevice}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon type={Icons.Ionicons} name="bluetooth-outline" color="#CCC" size={ms(40)} />
                        <Text style={styles.emptyText}>No devices found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default SearchNearbyDevices;

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
    description: {
        fontSize: ms(13),
        color: '#888',
        lineHeight: ms(20),
        paddingHorizontal: ms(20),
        marginTop: vs(5),
        marginBottom: vs(15),
        textAlign: 'center',
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
        marginBottom: vs(20),
        gap: ms(8),
    },
    searchInput: {
        flex: 1,
        fontSize: ms(14),
        color: blackColor,
        padding: 0,
    },

    // Device List
    listContainer: {
        paddingHorizontal: ms(20),
    },
    deviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(12),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    deviceImage: {
        width: ms(44),
        height: ms(44),
        borderRadius: ms(22),
        resizeMode: 'contain',
    },
    deviceInfo: {
        flex: 1,
        marginLeft: ms(12),
    },
    deviceName: {
        fontSize: ms(14),
        fontWeight: '700',
        color: blackColor,
    },
    deviceModel: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
    },
    badge: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(6),
        borderRadius: ms(20),
    },
    badgePaired: {
        backgroundColor: primaryColor,
    },
    badgeDefault: {
        backgroundColor: '#F1F5F9',
    },
    badgeText: {
        fontSize: ms(12),
        fontWeight: '600',
        color: '#888',
    },
    badgeTextPaired: {
        color: whiteColor,
    },

    // Empty
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: vs(60),
        gap: vs(10),
    },
    emptyText: {
        fontSize: ms(14),
        color: '#999',
    },
});
