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

// Dummy grouped data
const GROUPED_RECORDS = [
    {
        date: 'Mon, 07 Feb, 2026, 12:44:35',
        records: [
            { id: '1', name: 'Suresh Kumar' },
            { id: '2', name: 'Suresh Kumar' },
        ],
    },
    {
        date: 'Mon, 07 Feb, 2026, 12:55:35',
        records: [
            { id: '3', name: 'Suresh Kumar' },
        ],
    },
    {
        date: 'Mon, 07 Feb, 2026, 13:55:35',
        records: [
            { id: '4', name: 'Suresh Kumar' },
            { id: '5', name: 'Suresh Kumar' },
        ],
    },
];

const MedicationPrescription = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const title = route.params?.title || 'Medication Prescription';
    const [searchText, setSearchText] = useState('');
    const [records] = useState(GROUPED_RECORDS);
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
                    ? prev.filter((item) => item !== id)
                    : [...prev, id];
                if (updated.length === 0) {
                    setSelectionMode(false);
                }
                return updated;
            });
        } else {
            navigation.navigate('PrescriptionDetail', {
                name: item.name,
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
            <TouchableOpacity style={styles.addRecordsBtn} activeOpacity={0.7} onPress={() => navigation.navigate('UploadPrescription')}>
                <Icon
                    type={Icons.Feather}
                    name="plus"
                    color={whiteColor}
                    size={ms(18)}
                />
                <Text style={styles.addRecordsBtnText}>Add Prescriptions</Text>
            </TouchableOpacity>
        </View>
    );

    const renderRecordItem = (item, groupDate) => {
        const isSelected = selectedIds.includes(item.id);
        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.recordCard, isSelected && styles.recordCardSelected]}
                activeOpacity={0.7}
                onLongPress={() => handleLongPress(item.id)}
                onPress={() => handleCardPress(item.id, item, groupDate)}
            >
                {selectionMode && (
                    <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                        {isSelected && (
                            <Icon
                                type={Icons.Feather}
                                name="check"
                                color={whiteColor}
                                size={ms(14)}
                            />
                        )}
                    </View>
                )}
                <View style={styles.docIconWrap}>
                    <Icon
                        type={Icons.Ionicons}
                        name="document-text-outline"
                        color={blackColor}
                        size={ms(26)}
                    />
                </View>
                <View style={styles.recordInfo}>
                    <Text style={styles.recordName}>{item.name}</Text>
                </View>
                {!selectionMode && (
                    <View style={styles.arrowButton}>
                        <Icon
                            type={Icons.Feather}
                            name="chevron-right"
                            color={blackColor}
                            size={ms(20)}
                        />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderDataState = () => (
        <FlatList
            data={records}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
                <View style={styles.searchContainer}>
                    <Icon
                        type={Icons.Feather}
                        name="search"
                        color="#9CA3AF"
                        size={ms(18)}
                    />
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
                    {group.records.map((record) => renderRecordItem(record, group.date))}
                </View>
            )}
        />
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
                            <Icon
                                type={Icons.Feather}
                                name="share-2"
                                color={whiteColor}
                                size={ms(20)}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Content */}
                {hasRecords ? renderDataState() : renderEmptyState()}
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({

    flex1:{
        flex:1
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
        paddingBottom: vs(5),
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

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(25),
        paddingHorizontal: ms(20),
        height: vs(45),
        marginBottom: vs(16),
    },
    searchInput: {
        flex: 1,
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        marginLeft: ms(5),
        paddingVertical: 0,
    },

    // List
    listContent: {
        paddingTop: vs(16),
        paddingBottom: vs(30),
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

    // Record Card
    recordCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: ms(14),
        paddingHorizontal: ms(14),
        paddingVertical: vs(12),
        marginBottom: vs(10),
    },
    recordCardSelected: {
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
    docIconWrap: {
        width: ms(44),
        height: ms(44),
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordInfo: {
        flex: 1,
        marginLeft: ms(10),
    },
    recordName: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
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
});

export default MedicationPrescription;
