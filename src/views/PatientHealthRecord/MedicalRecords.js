import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Platform,
    StatusBar,
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

const MedicalRecords = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const title = route.params?.title || 'Medical Records';
    const [searchText, setSearchText] = useState('');
    const [records] = useState(GROUPED_RECORDS);

    const hasRecords = records.length > 0;

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Image
                source={require('../../assets/img/emptyReports.png')}
                style={styles.emptyImage}
                resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No Records Available</Text>
            <Text style={styles.emptyDesc}>
                Add your medical Records to keep it{'\n'}organized and easy to access.
            </Text>
            <TouchableOpacity style={styles.addRecordsBtn} activeOpacity={0.7}>
                <Icon
                    type={Icons.Feather}
                    name="plus"
                    color={whiteColor}
                    size={ms(18)}
                />
                <Text style={styles.addRecordsBtnText}>Add Records</Text>
            </TouchableOpacity>
        </View>
    );

    const renderRecordItem = (item) => (
        <View key={item.id} style={styles.recordCard}>
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
            <TouchableOpacity style={styles.downloadButton}>
                <Icon
                    type={Icons.Feather}
                    name="download"
                    color={blackColor}
                    size={ms(20)}
                />
            </TouchableOpacity>
        </View>
    );

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
                    {group.records.map((record) => renderRecordItem(record))}
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
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon
                            type={Icons.Ionicons}
                            name="arrow-back"
                            color={blackColor}
                            size={ms(20)}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{title}</Text>
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
        // paddingHorizontal: ms(20),
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
    downloadButton: {
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

export default MedicalRecords;
