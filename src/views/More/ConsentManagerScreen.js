import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const MOCK_MANAGERS = [
    {
        id: '1',
        name: 'Ramesh Kumar',
        role: 'FATHER',
        roleColor: primaryColor,
        date: '21 Feb 2026 • 10:45 AM',
        phone: '+91786347385',
        email: 'rameshkumar4378@gmail.com',
        accessType: 'View access',
        duration: '10 Mins',
        enabled: false,
        avatar: null,
    },
    {
        id: '2',
        name: 'Ramesh Kumar',
        role: 'FATHER',
        roleColor: primaryColor,
        date: '21 Feb 2026 • 10:45 AM',
        phone: '+91786347385',
        email: 'rameshkumar4378@gmail.com',
        accessType: 'View access',
        duration: '10 Mins',
        enabled: true,
        avatar: null,
    },
    {
        id: '3',
        name: 'Ramesh Kumar',
        role: 'FATHER',
        roleColor: primaryColor,
        date: '21 Feb 2026 • 10:45 AM',
        phone: '+91786347385',
        email: 'rameshkumar4378@gmail.com',
        accessType: 'View access',
        duration: '10 Mins',
        enabled: false,
        avatar: null,
    },
];

const ManagerCard = ({ item, onToggle }) => (
    <View style={styles.card}>
        <View style={styles.cardDateRow}>
            <Text style={styles.cardDate}>{item.date}</Text>
            <TouchableOpacity>
                <Icon type={Icons.Ionicons} name="ellipsis-horizontal" size={ms(18)} color="#9CA3AF" />
            </TouchableOpacity>
        </View>

        <View style={styles.cardProfileRow}>
            <View style={styles.avatarWrap}>
                {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                ) : (
                    <Icon type={Icons.MaterialIcons} name="person" size={ms(24)} color="#9CA3AF" />
                )}
            </View>
            <View style={styles.cardNameWrap}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={[styles.cardRole, { color: item.roleColor }]}>{item.role}</Text>
            </View>
            <Switch
                value={item.enabled}
                onValueChange={() => onToggle(item.id)}
                trackColor={{ false: '#E5E7EB', true: primaryColor }}
                thumbColor={whiteColor}
                style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
            />
        </View>

        <View style={styles.badgeRow}>
            <View style={[styles.badge, { borderColor: primaryColor }]}>
                <Text style={[styles.badgeText, { color: primaryColor }]}>{item.accessType}</Text>
            </View>
            <View style={[styles.badge, { borderColor: primaryColor }]}>
                <Text style={[styles.badgeText, { color: primaryColor }]}>{item.duration}</Text>
            </View>
        </View>

        <View style={styles.contactRow}>
            <Text style={styles.contactText}>{item.phone}</Text>
            <Text style={styles.contactText}>{item.email}</Text>
        </View>
    </View>
);

const ConsentManagerScreen = () => {
    const navigation = useNavigation();
    const [managers, setManagers] = useState(MOCK_MANAGERS);
    const [search, setSearch] = useState('');
    const isEmpty = managers.length === 0;

    const handleToggle = (id) => {
        setManagers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
        );
    };

    const filtered = managers.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    // Empty State
    if (isEmpty) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar2 />
                <LinearGradient
                    colors={globalGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 3 }}
                    locations={[0, 0.08]}
                    style={styles.gradientBg}
                >
                    <View style={styles.emptyHeader}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.emptyContent}>
                        <Text style={styles.emptyText}>
                            Give access to your health reports and manage it whenever you like.
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('AddConsentManagerScreen')}
                        >
                            <LinearGradient
                                colors={['#006D5D', '#50A89C']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.addBtn}
                            >
                                <Icon type={Icons.Ionicons} name="add" size={ms(18)} color={whiteColor} />
                                <Text style={styles.addBtnText}>Add Consent Manager</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    // List State
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.gradientBg}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Consent Manager</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchWrap}>
                    <View style={styles.searchBar}>
                        <Icon type={Icons.Ionicons} name="search-outline" size={ms(18)} color="#9CA3AF" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            placeholderTextColor="#9CA3AF"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {filtered.map((item) => (
                        <ManagerCard key={item.id} item={item} onToggle={handleToggle} />
                    ))}
                </ScrollView>

                {/* FAB */}
                <TouchableOpacity
                    style={styles.fab}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('AddConsentManagerScreen')}
                >
                    <Icon type={Icons.Ionicons} name="add" size={ms(24)} color={whiteColor} />
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradientBg: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(12),
    },
    backButton: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
        elevation: 2, shadowColor: blackColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: whiteColor,
        marginLeft: ms(12),
    },

    // Search
    searchWrap: {
        paddingHorizontal: ms(20),
        marginBottom: vs(12),
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        paddingHorizontal: ms(14),
        height: vs(42),
    },
    searchInput: {
        flex: 1,
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        marginLeft: ms(8),
        paddingVertical: 0,
    },

    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(100),
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    cardDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(10),
    },
    cardDate: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#9CA3AF',
    },
    cardProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    avatarWrap: {
        width: ms(42),
        height: ms(42),
        borderRadius: ms(21),
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    avatar: {
        width: ms(42),
        height: ms(42),
        borderRadius: ms(21),
    },
    cardNameWrap: {
        flex: 1,
    },
    cardName: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
    },
    cardRole: {
        fontFamily: bold,
        fontSize: ms(10),
        marginTop: vs(2),
    },

    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(8),
        marginBottom: vs(10),
    },
    badge: {
        borderWidth: 1,
        borderRadius: ms(6),
        paddingHorizontal: ms(10),
        paddingVertical: vs(4),
    },
    badgeText: {
        fontFamily: bold,
        fontSize: ms(10),
    },

    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(12),
    },
    contactText: {
        fontFamily: regular,
        fontSize: ms(10),
        color: '#6B7280',
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: vs(30),
        right: ms(20),
        width: ms(50),
        height: ms(50),
        borderRadius: ms(25),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },

    // Empty State
    emptyHeader: {
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
    },
    emptyContent: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: ms(20),
        paddingBottom: vs(60),
    },
    emptyText: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
        lineHeight: ms(24),
        marginBottom: vs(20),
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: ms(12),
        paddingHorizontal: ms(18),
        paddingVertical: vs(12),
        gap: ms(6),
    },
    addBtnText: {
        fontFamily: bold,
        fontSize: ms(13),
        color: whiteColor,
    },
});

export default ConsentManagerScreen;
