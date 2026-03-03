import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { bold, regular } from '../../config/Constants';
import {
    blackColor,
    whiteColor,
    primaryColor,
    globalGradient,
} from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';

// Dummy prescription data
const GROUPED_PRESCRIPTIONS = [
    {
        date: 'Mon, 07 Feb, 2026',
        records: [
            { id: '1', medicine: 'Paracetamol', dosage: '500mg', duration: '2 Weeks', time: 'Morning' },
            { id: '2', medicine: 'Amoxicillin', dosage: '250mg', duration: '1 Week', time: 'Evening' },
        ],
    },
    {
        date: 'Tue, 08 Feb, 2026',
        records: [
            { id: '3', medicine: 'Cetirizine', dosage: '10mg', duration: '5 Days', time: 'Night' },
        ],
    },
    {
        date: 'Wed, 09 Feb, 2026',
        records: [
            { id: '4', medicine: 'Ibuprofen', dosage: '400mg', duration: '3 Days', time: 'Morning' },
            { id: '5', medicine: 'Metformin', dosage: '500mg', duration: '4 Weeks', time: 'Evening' },
        ],
    },
];

// Dummy bio-markers data
const BIO_MARKERS_DATA = [
    { code: 'GLU002', name: 'Glucose', count: 3 },
    { code: 'BP001', name: 'Blood Pressure', count: 4 },
    { code: 'CHL003', name: 'Cholesterol', count: 4 },
    { code: 'OXY005', name: 'Oxygen Saturation', count: 3 },
    { code: 'OXY005', name: 'Oxygen Saturation', count: 3 },
    { code: 'BP001', name: 'Blood Pressure', count: 4 },
    { code: 'BP001', name: 'Blood Pressure', count: 4 },
];

const getTimeIcon = (time) => {
    switch (time) {
        case 'Morning': return 'sunny-outline';
        case 'Evening': return 'partly-sunny-outline';
        case 'Night': return 'moon-outline';
        default: return 'time-outline';
    }
};

const MedicationPrescription = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const title = route.params?.title || 'Medication Prescription';
    const [activeTab, setActiveTab] = useState('Prescription');
    const [searchText, setSearchText] = useState('');
    const [records] = useState(GROUPED_PRESCRIPTIONS);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const hasRecords = records.length > 0;

    const handleLongPress = useCallback((id) => {
        if (!selectionMode) {
            setSelectionMode(true);
            setSelectedIds([id]);
        }
    }, [selectionMode]);

    const handleCardPress = useCallback((id, item, groupDate) => {
        if (selectionMode) {
            setSelectedIds((prev) => {
                const updated = prev.includes(id)
                    ? prev.filter((i) => i !== id)
                    : [...prev, id];
                if (updated.length === 0) {
                    setSelectionMode(false);
                }
                return updated;
            });
        } else {
            navigation.navigate('PrescriptionDetail', {
                name: item.medicine,
                date: groupDate,
            });
        }
    }, [selectionMode, navigation]);

    const cancelSelection = useCallback(() => {
        setSelectionMode(false);
        setSelectedIds([]);
    }, []);

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Image
                source={require('../../assets/img/emptyPrescription.png')}
                style={styles.emptyImage}
                resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No Prescriptions Available</Text>
            <Text style={styles.emptyDesc}>
                Add your medication prescriptions to keep it{'\n'}organized and easy to access.
            </Text>
            <TouchableOpacity
                style={styles.addRecordsBtn}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('AddPrescription')}
            >
                <Icon type={Icons.Feather} name="plus" color={whiteColor} size={ms(18)} />
                <Text style={styles.addRecordsBtnText}>Add Prescription</Text>
            </TouchableOpacity>
        </View>
    );

    const renderPrescriptionItem = (item, groupDate) => {
        const isSelected = selectedIds.includes(item.id);
        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.prescriptionCard, isSelected && styles.prescriptionCardSelected]}
                activeOpacity={0.7}
                onLongPress={() => handleLongPress(item.id)}
                onPress={() => handleCardPress(item.id, item, groupDate)}
            >
                {selectionMode && (
                    <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                        {isSelected && (
                            <Icon type={Icons.Feather} name="check" color={whiteColor} size={ms(14)} />
                        )}
                    </View>
                )}
                <View style={styles.pillIconWrap}>
                    <Icon type={Icons.Ionicons} name="medkit-outline" color={primaryColor} size={ms(22)} />
                </View>
                <View style={styles.prescriptionInfo}>
                    <Text style={styles.medicineName}>{item.medicine} <Text style={styles.dosageText}>{item.dosage}</Text></Text>
                    <View style={styles.prescriptionMeta}>
                        <View style={styles.durationBadge}>
                            <Icon type={Icons.Ionicons} name="calendar-outline" color={primaryColor} size={ms(12)} />
                            <Text style={styles.durationText}>{item.duration}</Text>
                        </View>
                        <View style={styles.timeBadge}>
                            <Icon type={Icons.Ionicons} name={getTimeIcon(item.time)} color="#6B7280" size={ms(12)} />
                            <Text style={styles.timeText}>{item.time}</Text>
                        </View>
                    </View>
                </View>
                {!selectionMode && (
                    <View style={styles.arrowButton}>
                        <Icon type={Icons.Feather} name="chevron-right" color="#9CA3AF" size={ms(20)} />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderPrescriptionTab = () => {
        if (!hasRecords) return renderEmptyState();

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={records}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={
                        <View style={styles.searchContainer}>
                            <Icon type={Icons.Feather} name="search" color="#9CA3AF" size={ms(18)} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search"
                                placeholderTextColor="#9CA3AF"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>
                    }
                    renderItem={({ item: group }) => (
                        <View style={styles.dateGroup}>
                            <Text style={styles.dateHeader}>{group.date}</Text>
                            {group.records.map((record) => renderPrescriptionItem(record, group.date))}
                        </View>
                    )}
                />
                {/* Floating Add Button */}
                <TouchableOpacity
                    style={styles.fab}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('AddPrescription')}
                >
                    <Icon type={Icons.Feather} name="plus" size={ms(26)} color={whiteColor} />
                </TouchableOpacity>
            </View>
        );
    };

    const renderBioMarkersTab = () => (
        <View style={styles.bioContainer}>
            {/* Table Header */}
            <View style={styles.bioHeaderRow}>
                <Text style={[styles.bioHeaderText, { flex: 0.8 }]}>Code</Text>
                <Text style={[styles.bioHeaderText, { flex: 1.2, textAlign: 'center' }]}>Bio-Markers</Text>
                <Text style={[styles.bioHeaderText, { flex: 0.5, textAlign: 'right', marginRight: ms(20) }]}>Count</Text>
            </View>

            {/* Table Rows */}
            <FlatList
                data={BIO_MARKERS_DATA}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: vs(30), paddingHorizontal: ms(2) }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.bioRow}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('BioMarkerDetail', { name: item.name, code: item.code })}
                    >
                        <Text style={[styles.bioCode, { flex: 0.8 }]}>{item.code}</Text>
                        <Text style={[styles.bioName, { flex: 1.2, textAlign: 'center' }]}>{item.name}</Text>
                        <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={styles.bioCount}>{item.count}</Text>
                            <Icon type={Icons.Ionicons} name="chevron-forward" color="#9CA3AF" size={ms(16)} />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.25]}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.fullGradient}>
                <StatusBar2 />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => selectionMode ? cancelSelection() : navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon
                            type={Icons.Ionicons}
                            name={selectionMode ? 'close' : 'arrow-back'}
                            color={blackColor}
                            size={ms(20)}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {selectionMode ? `${selectedIds.length} Selected` : title}
                    </Text>
                    {selectionMode && (
                        <TouchableOpacity style={styles.shareButton} activeOpacity={0.7}>
                            <Icon type={Icons.Feather} name="share-2" color={whiteColor} size={ms(20)} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Tab Switcher */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Prescription' && styles.activeTab]}
                        onPress={() => setActiveTab('Prescription')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Prescription' && styles.activeTabText]}>
                            Prescription
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Bio' && styles.activeTab]}
                        onPress={() => setActiveTab('Bio')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Bio' && styles.activeTabText]}>
                            Bio-markers
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {activeTab === 'Prescription' ? renderPrescriptionTab() : renderBioMarkersTab()}
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    flex1: {
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
        paddingBottom: vs(12),
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
        fontFamily: bold,
        fontSize: ms(18),
        color: whiteColor,
        marginLeft: ms(12),
    },
    shareButton: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Tabs
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: ms(25),
        padding: ms(4),
        marginBottom: vs(12),
    },
    tab: {
        flex: 1,
        paddingVertical: vs(12),
        alignItems: 'center',
        borderRadius: ms(22),
    },
    activeTab: {
        backgroundColor: primaryColor,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    tabText: {
        fontSize: ms(14),
        color: whiteColor,
        fontWeight: '500',
    },
    activeTabText: {
        color: whiteColor,
        fontWeight: '700',
    },

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(25),
        paddingHorizontal: ms(15),
        height: vs(45),
        marginBottom: vs(16),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchInput: {
        flex: 1,
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        marginLeft: ms(8),
        paddingVertical: 0,
    },

    // List
    listContent: {
        paddingTop: vs(10),
        paddingBottom: vs(90),
    },

    // Date Group
    dateGroup: {
        marginBottom: vs(8),
    },
    dateHeader: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
        marginBottom: vs(8),
    },

    // Prescription Card
    prescriptionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: ms(14),
        paddingHorizontal: ms(14),
        paddingVertical: vs(14),
        marginBottom: vs(10),
    },
    prescriptionCardSelected: {
        backgroundColor: '#E8F5F2',
        borderWidth: 1,
        borderColor: primaryColor,
    },
    checkbox: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(6),
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
        backgroundColor: whiteColor,
    },
    checkboxChecked: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },
    pillIconWrap: {
        width: ms(44),
        height: ms(44),
        borderRadius: ms(22),
        backgroundColor: '#E8F5F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    prescriptionInfo: {
        flex: 1,
        marginLeft: ms(12),
    },
    medicineName: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
    },
    dosageText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    prescriptionMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(6),
        gap: ms(10),
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5F2',
        paddingHorizontal: ms(8),
        paddingVertical: vs(3),
        borderRadius: ms(12),
        gap: ms(4),
    },
    durationText: {
        fontFamily: bold,
        fontSize: ms(11),
        color: primaryColor,
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
    },
    timeText: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
    },
    arrowButton: {
        width: ms(36),
        height: ms(36),
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: ms(30),
    },
    emptyImage: {
        width: ms(120),
        height: ms(120),
        marginBottom: vs(24),
    },
    emptyTitle: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
        marginBottom: vs(8),
    },
    emptyDesc: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: ms(20),
        marginBottom: vs(24),
    },
    addRecordsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: primaryColor,
        paddingHorizontal: ms(24),
        paddingVertical: vs(12),
        borderRadius: ms(10),
        gap: ms(8),
    },
    addRecordsBtnText: {
        fontFamily: bold,
        fontSize: ms(14),
        color: whiteColor,
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: vs(25),
        right: ms(0),
        width: ms(56),
        height: ms(56),
        borderRadius: ms(28),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },

    // Bio-markers
    bioContainer: {
        flex: 1,
        paddingTop: vs(15),
    },
    bioHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        marginBottom: vs(10),
    },
    bioHeaderText: {
        fontSize: ms(14),
        fontFamily: bold,
        color: '#6B7280',
    },
    bioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(18),
        paddingHorizontal: ms(15),
        backgroundColor: '#F1F5F9',
        borderRadius: ms(12),
        marginBottom: vs(8),
    },
    bioCode: {
        fontSize: ms(13),
        fontFamily: bold,
        color: '#374151',
    },
    bioName: {
        fontSize: ms(14),
        fontFamily: bold,
        color: '#1F2937',
    },
    bioCount: {
        fontSize: ms(14),
        fontFamily: bold,
        color: '#374151',
        marginRight: ms(4),
    },
});

export default MedicationPrescription;
