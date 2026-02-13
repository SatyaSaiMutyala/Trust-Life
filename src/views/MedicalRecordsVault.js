import React, { useState, useEffect } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, FlatList, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { s, vs, ms } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import LoadLabReportsAction from '../redux/actions/LabReportsActions';

// Importing your specific project utilities/config
import { StatusBar2 } from '../components/StatusBar';
import { bold, docIcon, img_url, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, globalGradient, whiteColor, primaryColor, grayColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';
import MedicalRecordsShimmer from '../components/MedicalRecordsShimmer';

const { width } = Dimensions.get('window');

// --- Report List Item Component (Same style as More.jsx ProfileListItem) ---
const ReportListItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.listItemContainer}>
        {/* Left Icon */}
        <View style={styles.listItemIconWrapper}>
            <Icon
                type={Icons.MaterialCommunityIcons}
                name="file-document-outline"
                color={primaryColor}
                size={ms(24)}
            />
        </View>

        {/* Title and Subtitle */}
        <View style={styles.listItemTextContent}>
            <Text style={styles.listItemTitle}>{item.name}</Text>
            <Text style={styles.listItemSubtitle} numberOfLines={1} ellipsizeMode='tail'>{item.date}</Text>
        </View>

        {/* Right Arrow */}
        <View style={styles.listItemArrowWrapper}>
            <Icon
                type={Icons.Ionicons}
                name="chevron-forward-outline"
                color='#9CA3AF'
                style={{ fontSize: ms(20) }}
            />
        </View>
    </TouchableOpacity>
);

const MedicalRecordsVault = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { data: labReports, loading } = useSelector(state => state.lab_reports);

    const [activeTab, setActiveTab] = useState(route.params?.activeTab || 'Lab'); // 'Lab' or 'Upload'
    const [profilePic, setProfilePic] = useState(null);
    const [selectedMember, setSelectedMember] = useState('My self');
    const [reports, setReports] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    // Family members list - you can fetch this from API
    const familyMembers = ['My self', 'Father', 'Mother', 'Spouse'];

    useEffect(() => {
        loadProfilePic();
        loadReports();
    }, []);

    // Update activeTab when route params change
    useEffect(() => {
        if (route.params?.activeTab) {
            setActiveTab(route.params.activeTab);
        }
    }, [route.params?.activeTab]);

    useFocusEffect(
        React.useCallback(() => {
            if (activeTab === 'Lab') {
                dispatch(LoadLabReportsAction(global.id));
            }
            return () => {
                // Optional cleanup function
            };
        }, [activeTab, dispatch])
    );

    // Set isInitialLoad to false when loading completes
    useEffect(() => {
        if (!loading && isInitialLoad) {
            setIsInitialLoad(false);
        }
    }, [loading]);

    const loadProfilePic = async () => {
        try {
            const savedProfilePic = await AsyncStorage.getItem('profile_picture');
            if (savedProfilePic) {
                setProfilePic(`${img_url}${savedProfilePic}`);
            }
        } catch (error) {
            console.log('Error loading profile pic:', error);
        }
    };

    const loadReports = async () => {
        // TODO: Fetch reports from API
        // For now using dummy data - replace with your API call
        const dummyReports = [
            { id: 1, name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44:35' },
            { id: 2, name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44:35' },
            { id: 3, name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44:35' },
            { id: 4, name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44:35' },
            { id: 5, name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44:35' },
        ];
        setReports(dummyReports);
    };

    const renderEmptyState = () => (
        <View style={styles.contentArea}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/img/vaultFamily1.png')}
                    style={styles.illustration}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.mainTitle}>
                    Add Your Family's Health{"\n"}Records. Track Their Status.
                </Text>
                <Text style={styles.description}>
                    Store your family's health records securely, add reports easily, and track their status anytime.
                </Text>
            </View>
            <View style={{ width: '100%' }}>
                <PrimaryButton onPress={() => navigation.navigate('UploadHealthReport')} title='Upload Health Report' />
            </View>
        </View>
    );

    const renderReportsList = () => (
        <View style={styles.reportsContainer}>
            {/* Family Members Horizontal Scroll */}
            <View style={styles.membersRow}>
                <TouchableOpacity style={styles.addReportBtn} onPress={() => navigation.navigate('UploadHealthReport')}>
                    <Icon type={Icons.Feather} name="plus" size={ms(16)} color={blackColor} />
                    <Text style={styles.addReportText}>Add Report</Text>
                </TouchableOpacity>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.membersScroll}>
                    {familyMembers.map((member, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.memberChip,
                                selectedMember === member && styles.memberChipActive
                            ]}
                            onPress={() => setSelectedMember(member)}
                        >
                            <Text style={[
                                styles.memberChipText,
                                selectedMember === member && styles.memberChipTextActive
                            ]}>
                                {member}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Recent Reports */}
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            <FlatList
                data={reports}
                renderItem={({ item }) => (
                    <ReportListItem
                        item={item}
                        onPress={() => navigation.navigate('ReportDetails', { report: item })}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.reportsList}
            />
        </View>
    );

    const renderLabReportsList = () => (
        <View style={styles.labReportsContainer}>
            {/* Search Bar */}
            {/* <View style={styles.searchContainer}>
                <Icon type={Icons.Feather} name="search" color={'gray'} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search with name"
                    placeholderTextColor={'gray'}
                />
            </View> */}

            {/* Recent Reports Title */}
            <Text style={styles.recentReportsText}>Recent Reports</Text>

            {/* Lab Reports List */}
            {labReports && labReports.result && labReports.result.length > 0 ? (
                <FlatList
                    data={labReports.result}
                    renderItem={({ item }) => (
                        <View style={styles.labReportItem}>
                            <View style={styles.labReportContent}>
                                <Icon
                                    type={Icons.AntDesign}
                                    name="pdffile1"
                                    color={primaryColor}
                                    size={ms(22)}
                                />
                                <View style={styles.labReportTextContainer}>
                                    <Text style={styles.labReportTitle}>{item.patient_name}</Text>
                                    <Text style={styles.labReportSubtitle}>
                                        {item.report_date || 'Mon, Nov 10, 2025, 12:44:35'}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={() => navigation.navigate('PDFViewer', {
                                        pdfUrl: item.report_url,
                                        title: item.patient_name || 'Lab Report'
                                    })}
                                >
                                    <Text style={styles.viewButtonText}>View</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.reportsList}
                />
            ) : (
                <View style={styles.noDataContainer}>
                    <View style={styles.noDataIconCircle}>
                        <Icon
                            type={Icons.MaterialCommunityIcons}
                            name="file-document-outline"
                            color={primaryColor}
                            size={ms(60)}
                        />
                    </View>
                    <Text style={styles.noDataTitle}>No Reports Found</Text>
                    <Text style={styles.noDataSubtext}>
                        You don't have any medical reports yet. Your test results will appear here once available.
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header Gradient Section - Same as original */}
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.35]}
                style={styles.headerGradient}
            >
                <View style={styles.topRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">Medical Records Vault</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('Notifications')}>
                            <Icon type={Icons.MaterialIcons} name="notifications-none" size={ms(20)} color={blackColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            {profilePic ? (
                                <Image
                                    source={{ uri: profilePic }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <View style={[styles.profileImage, styles.defaultProfileIcon]}>
                                    <Icon type={Icons.MaterialIcons} name="person" size={ms(20)} color={grayColor} />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Segmented Control / Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Lab' && styles.activeTab]}
                        onPress={() => setActiveTab('Lab')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Lab' && styles.activeTabText]}>
                            Lab Report
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Upload' && styles.activeTab]}
                        onPress={() => setActiveTab('Upload')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Upload' && styles.activeTabText]}>
                            Upload Health Report
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content Area */}
                {loading && isInitialLoad ? (
                    <MedicalRecordsShimmer activeTab={activeTab} />
                ) : (
                    activeTab === 'Upload' ? (
                        renderEmptyState()
                    ) : (
                        renderLabReportsList()
                    )
                )}
            </LinearGradient>
        </SafeAreaView>
    );
};

export default MedicalRecordsVault;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    headerGradient: {
        flex: 1,
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(20),
    },
    backButton: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    headerTitle: {
        flex: 1,
        fontSize: ms(20),
        fontFamily: bold,
        color: whiteColor,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
    },
    iconCircle: {
        backgroundColor: whiteColor,
        padding: ms(8),
        borderRadius: ms(20),
    },
    profileImage: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        borderWidth: 1,
        borderColor: whiteColor,
    },
    defaultProfileIcon: {
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: ms(25),
        padding: ms(4),
    },
    tab: {
        flex: 1,
        paddingVertical: vs(12),
        alignItems: 'center',
        borderRadius: ms(22),
    },
    activeTab: {
        backgroundColor: whiteColor,
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
        color: blackColor,
    },
    contentArea: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: ms(15),
        justifyContent: 'center',
    },
    imageContainer: {
        marginBottom: vs(10),
    },
    illustration: {
        width: width * 0.7,
        height: vs(180),
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: vs(10),
    },
    mainTitle: {
        fontSize: ms(20),
        fontFamily: bold,
        color: blackColor,
        textAlign: 'center',
        lineHeight: ms(26),
        marginBottom: vs(10),
    },
    description: {
        fontSize: ms(14),
        color: '#444',
        textAlign: 'center',
        lineHeight: ms(20),
        paddingHorizontal: ms(10),
    },
    // Reports List Styles
    reportsContainer: {
        flex: 1,
        paddingHorizontal: ms(0),
        paddingTop: vs(15),
    },
    membersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(20),
    },
    addReportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(12),
        paddingVertical: vs(10),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: ms(20),
        marginRight: ms(10),
    },
    addReportText: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
        marginLeft: ms(5),
    },
    membersScroll: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberChip: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(10),
        borderRadius: ms(20),
        backgroundColor: '#F5F5F5',
        marginRight: ms(8),
    },
    memberChipActive: {
        backgroundColor: primaryColor,
    },
    memberChipText: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
    },
    memberChipTextActive: {
        color: whiteColor,
        fontFamily: bold,
    },
    sectionTitle: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
        marginBottom: vs(15),
        paddingHorizontal: ms(5),
    },
    reportsList: {
        paddingBottom: vs(20),
    },
    // List Item Styles (Same as More.jsx ProfileListItem)
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(15),
        paddingHorizontal: ms(15),
        backgroundColor: '#F9FAFB',
        marginBottom: ms(10),
        borderRadius: ms(10),
    },
    listItemIconWrapper: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
        backgroundColor: '#E8F5F5',
        borderRadius: ms(10),
    },
    listItemTextContent: {
        flex: 1,
        justifyContent: 'center',
    },
    listItemTitle: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
    },
    listItemSubtitle: {
        fontSize: ms(11),
        fontFamily: regular,
        color: '#6B7280',
        marginTop: vs(2),
    },
    listItemArrowWrapper: {
        width: ms(20),
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    // Lab Reports Styles
    labReportsContainer: {
        flex: 1,
        paddingTop: vs(15),
    },
    searchContainer: {
        backgroundColor: whiteColor,
        borderRadius: ms(10),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        height: vs(45),
        marginBottom: vs(20),
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        fontSize: ms(18),
        marginRight: ms(10),
    },
    searchInput: {
        flex: 1,
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        paddingVertical: 0,
    },
    recentReportsText: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
        marginBottom: vs(15),
    },
    labReportItem: {
        backgroundColor: '#F9FAFB',
        borderRadius: ms(10),
        marginBottom: vs(10),
    },
    labReportContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: ms(15),
    },
    labReportTextContainer: {
        flex: 1,
        marginLeft: ms(15),
    },
    labReportTitle: {
        fontSize: ms(15),
        color: blackColor,
        fontWeight: '800',
    },
    labReportSubtitle: {
        fontFamily: regular,
        fontSize: ms(11),
        color: 'gray',
        marginTop: vs(2),
    },
    viewButton: {
        paddingHorizontal: ms(15),
        paddingVertical: vs(8),
        borderRadius: ms(20),
        borderWidth: 1,
        borderColor: primaryColor,
        backgroundColor: whiteColor,
        marginLeft: ms(10),
    },
    viewButtonText: {
        color: primaryColor,
        fontFamily: bold,
        fontSize: ms(12),
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: ms(30),
        marginTop: vs(50),
    },
    noDataIconCircle: {
        width: ms(120),
        height: ms(120),
        borderRadius: ms(60),
        backgroundColor: '#F0F9FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(25),
        borderWidth: 3,
        borderColor: '#E0F2FE',
    },
    noDataTitle: {
        fontFamily: bold,
        fontSize: ms(22),
        color: blackColor,
        marginBottom: vs(12),
        letterSpacing: 0.5,
    },
    noDataSubtext: {
        fontFamily: regular,
        fontSize: ms(14),
        color: 'gray',
        textAlign: 'center',
        lineHeight: ms(22),
        paddingHorizontal: ms(10),
    },
});
