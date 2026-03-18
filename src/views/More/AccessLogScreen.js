import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient, globalGradient2 } from '../../utils/globalColors';
import { heading, interMedium, interRegular } from '../../config/Constants';

const FILTER_TABS = ['All', 'You', 'Family', 'Doctors'];

const ACCESS_LOG_DATA = [
    {
        id: '1',
        name: 'Ramesh Kumar',
        role: 'FATHER',
        roleColor: '#16A34A',
        roleBgColor: '#DCFCE7',
        avatar: null,
        status: 'DOWNLOADED',
        statusColor: '#16A34A',
        statusBgColor: '#DCFCE7',
        viewDuration: '25 mins viewed',
        record: 'Blood Test Report',
        permission: 'Granted by you',
        permissionType: 'granted',
        date: '21 Feb 2026 • 10:45 AM',
        platform: 'Mobile App',
        category: 'Family',
        reportTypes: 'Blood Reports   BP Reports',
    },
    {
        id: '2',
        name: 'Dr.sindhu sai',
        role: 'DOCTOR',
        roleColor: '#2563EB',
        roleBgColor: '#DBEAFE',
        avatar: null,
        status: 'VIEWED',
        statusColor: '#2563EB',
        statusBgColor: '#DBEAFE',
        viewDuration: null,
        record: 'Blood Test Report',
        permission: 'Granted by you',
        permissionType: 'granted',
        date: '21 Feb 2026 • 10:45 AM',
        platform: 'Web',
        category: 'Doctors',
        reportTypes: 'Blood Reports   BP Reports',
    },
    {
        id: '3',
        name: 'Emergency',
        role: 'HOSPITAL',
        roleColor: '#DC2626',
        roleBgColor: '#FEE2E2',
        avatar: require('../../assets/img/emergency.png'),
        status: 'VIEWED',
        statusColor: '#2563EB',
        statusBgColor: '#DBEAFE',
        viewDuration: null,
        record: 'Blood Test Report',
        permission: 'Emergency access',
        permissionType: 'emergency',
        date: '21 Feb 2026 • 10:45 AM',
        platform: 'Web',
        category: 'Doctors',
        reportTypes: 'Blood Reports   BP Reports',
        hospitalName: 'Rama Hospital',
        contact: '+917348368576',
        reasonForEmergency: 'Accident',
    },
];

const FilterTab = ({ title, isActive, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.filterTab, isActive && styles.filterTabActive]}
        activeOpacity={0.7}
    >
        <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
            {title}
        </Text>
    </TouchableOpacity>
);

const AccessLogCard = ({ item, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        {/* Top Row: Avatar + Name/Role + Status */}
        <View style={styles.cardTopRow}>
            <View style={styles.avatarContainer}>
                {item.avatar ? (
                    <Image source={item.avatar} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.defaultAvatar]}>
                        <Icon type={Icons.MaterialIcons} name="person" size={ms(24)} color="#9CA3AF" />
                    </View>
                )}
            </View>
            <View style={styles.cardNameSection}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={[styles.roleText, { color: item.roleColor }]}>{item.role}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.statusBgColor }]}>
                <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
            </View>
        </View>

        {/* View Duration */}
        {item.viewDuration && (
            <Text style={styles.viewDuration}>{item.viewDuration}</Text>
        )}

        {/* Record */}
        <View style={styles.infoRow}>
            <Icon type={Icons.Ionicons} name="document-text-outline" color="#6B7280" size={ms(16)} />
            <Text style={styles.infoLabel}>Record: </Text>
            <Text style={styles.infoValue}>{item.record}</Text>
        </View>

        {/* Permission */}
        <View style={styles.infoRow}>
            {item.permissionType === 'emergency' ? (
                <>
                    <Icon type={Icons.Ionicons} name="warning-outline" color="#DC2626" size={ms(16)} />
                    <Text style={styles.infoLabel}>Permission: </Text>
                    <Text style={[styles.infoValue, { color: '#DC2626' }]}>{item.permission}</Text>
                </>
            ) : (
                <>
                    <Icon type={Icons.Ionicons} name="shield-checkmark-outline" color="#6B7280" size={ms(16)} />
                    <Text style={styles.infoLabel}>Permission: </Text>
                    <Text style={styles.infoValue}>{item.permission}</Text>
                </>
            )}
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
            <Text style={styles.footerDate}>{item.date}</Text>
            <View style={styles.footerPlatformWrap}>
                <Icon
                    type={Icons.Ionicons}
                    name={item.platform === 'Mobile App' ? 'phone-portrait-outline' : 'globe-outline'}
                    color="#9CA3AF"
                    size={ms(12)}
                />
                <Text style={styles.footerPlatform}>{item.platform}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const EmptyState = () => (
    <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
            <Icon type={Icons.Ionicons} name="shield-checkmark-outline" color={primaryColor} size={ms(50)} />
        </View>
        <Text style={styles.emptyTitle}>No access activity yet</Text>
        <Text style={styles.emptySubtext}>
            No access has been recorded. You'll be notified whenever your records are viewed.
        </Text>
    </View>
);

const AccessLogScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = ACCESS_LOG_DATA.filter((item) => {
        const matchesTab = activeTab === 'All' || item.category === activeTab;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.fullGradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Access log</Text>
                </View>

                {/* Subtitle */}
                <Text style={styles.subtitle}>See who viewed your medical records</Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Icon type={Icons.Feather} name="search" color="#9CA3AF" size={ms(18)} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {FILTER_TABS.map((tab) => (
                            <FilterTab
                                key={tab}
                                title={tab}
                                isActive={activeTab === tab}
                                onPress={() => setActiveTab(tab)}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* List */}
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AccessLogCard
                            item={item}
                            onPress={() => navigation.navigate('AccessDetailScreen', { accessLog: item })}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<EmptyState />}
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fullGradient: {
        flex: 1,
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: vs(8),
    },
    backButton: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTitle: {
        flex: 1,
        fontFamily: heading,
        fontSize: ms(18),
        color: whiteColor,
        marginLeft: ms(12),
    },

    // Subtitle
    subtitle: {
        fontFamily: interMedium,
        fontSize: ms(16),
        color: blackColor,
        marginTop: vs(8),
        marginBottom: vs(15),
        lineHeight: ms(24),
    },

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(25),
        paddingHorizontal: ms(15),
        height: vs(45),
        marginBottom: vs(12),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchInput: {
        flex: 1,
        fontFamily: interRegular,
        fontSize: ms(14),
        color: blackColor,
        marginLeft: ms(8),
        paddingVertical: 0,
    },

    // Filter Tabs
    filterRow: {
        marginBottom: vs(12),
    },
    filterTab: {
        paddingHorizontal: ms(18),
        paddingVertical: vs(8),
        borderRadius: ms(20),
        backgroundColor: whiteColor,
        marginRight: ms(8),
    },
    filterTabActive: {
        backgroundColor: primaryColor,
    },
    filterTabText: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: blackColor,
    },
    filterTabTextActive: {
        fontFamily: interMedium,
        color: whiteColor,
    },

    // List
    listContent: {
        paddingBottom: vs(80),
        flexGrow: 1,
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: ms(12),
    },
    avatar: {
        width: ms(44),
        height: ms(44),
        borderRadius: ms(22),
    },
    defaultAvatar: {
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardNameSection: {
        flex: 1,
    },
    cardName: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    roleText: {
        fontFamily: interMedium,
        fontSize: ms(10),
        marginTop: vs(2),
    },
    statusBadge: {
        paddingHorizontal: ms(10),
        paddingVertical: vs(4),
        borderRadius: ms(12),
    },
    statusText: {
        fontFamily: interMedium,
        fontSize: ms(10),
    },
    viewDuration: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#16A34A',
        marginTop: vs(6),
        marginLeft: ms(56),
    },

    // Info Rows
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(8),
        marginLeft: ms(56),
    },
    infoLabel: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#6B7280',
        marginLeft: ms(6),
    },
    infoValue: {
        fontFamily: interMedium,
        fontSize: ms(11),
        color: blackColor,
    },

    // Card Footer
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: vs(10),
        paddingTop: vs(10),
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    footerDate: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#9CA3AF',
    },
    footerPlatformWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerPlatform: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#9CA3AF',
        marginLeft: ms(4),
    },

    // Empty State
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: vs(80),
        paddingHorizontal: ms(30),
    },
    emptyIconCircle: {
        width: ms(100),
        height: ms(100),
        borderRadius: ms(50),
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(20),
    },
    emptyTitle: {
        fontFamily: interMedium,
        fontSize: ms(16),
        color: blackColor,
        marginBottom: vs(8),
    },
    emptySubtext: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: ms(20),
    },
});

export default AccessLogScreen;
