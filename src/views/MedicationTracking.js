import React, { useState, useEffect } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { s, vs, ms } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle } from 'react-native-svg';

// Importing your specific project utilities/config
import { StatusBar2 } from '../components/StatusBar';
import { bold, img_url, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, globalGradient, whiteColor, primaryColor, grayColor } from '../utils/globalColors';
const { width } = Dimensions.get('window');
const FILTER_TABS = ['Today', 'Upcoming', 'Completed', 'Calendar'];

// Sample medication data - replace with actual data from API/storage
const SAMPLE_MEDICATIONS = [
    { id: 1, name: 'Paracetamol', dosage: '500 Mg', time: '8.00 AM', schedule: 'Before Breakfast', dateTime: '01:20 PM,', status: null },
    { id: 2, name: 'Paracetamol', dosage: '500 Mg', time: '8.00 AM', schedule: 'Before Breakfast', dateTime: '01:20 PM, 25/01/2026', status: null },
    { id: 3, name: 'Paracetamol', dosage: '500 Mg', time: '8.00 AM', schedule: 'Before Breakfast', dateTime: '01:20 PM, 25/01/2026', status: 'taken' },
    { id: 4, name: 'Paracetamol', dosage: '500 Mg', time: '8.00 AM', schedule: 'Before Breakfast', dateTime: '01:20 PM, 25/01/2026', status: 'taken' },
    { id: 5, name: 'Paracetamol', dosage: '500 Mg', time: '8.00 AM', schedule: 'Before Breakfast', dateTime: '01:20 PM, 25/01/2026', status: 'taken' },
];

const MedicationTracking = () => {
    const navigation = useNavigation();
    const [profilePic, setProfilePic] = useState(null);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Today');
    const [medications, setMedications] = useState(SAMPLE_MEDICATIONS);

    // Check if there's data
    const hasData = medications.length < 0;

    // Calculate progress
    const totalMedicines = medications.length;
    const takenCount = medications.filter(m => m.status === 'taken').length;
    const percentage = totalMedicines > 0 ? Math.round((takenCount / totalMedicines) * 100) : 0;

    useEffect(() => {
        loadProfilePic();
    }, []);

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

    const markMedicine = (id, status) => {
        setMedications(medications.map(med =>
            med.id === id ? { ...med, status } : med
        ));
    };

    const getCurrentDate = () => {
        const date = new Date();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'short' };
        const formatted = date.toLocaleDateString('en-GB', options);
        const parts = formatted.split(', ');
        return `${parts[0]},  ${parts[1]}`;
    };

    const renderProgressCircle = () => {
        const size = ms(120);
        const strokeWidth = ms(8);
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <View style={styles.progressContainer}>
                <Svg width={size} height={size}>
                    {/* Background Circle */}
                    <Circle
                        stroke="#D1D5DB"
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress Circle */}
                    <Circle
                        stroke={primaryColor}
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </Svg>
                <View style={styles.progressTextContainer}>
                    <Text style={styles.progressPercentage}>{percentage}%</Text>
                    <Text style={styles.progressLabel}>Done</Text>
                </View>
            </View>
        );
    };

    const renderMedicineCard = (medicine, index) => (
        <View key={medicine.id} style={styles.medicineCard}>
            {/* DateTime Header */}
            <Text style={styles.dateTimeText}>{medicine.dateTime}</Text>

            {/* Schedule */}
            <Text style={styles.scheduleText}>{medicine.schedule}</Text>

            {/* Medicine Info Row */}
            <View style={styles.medicineInfoRow}>
                <View>
                    <Text style={styles.medicineName}>{medicine.name}</Text>
                    <Text style={styles.medicineDetails}>
                        {medicine.dosage} | {medicine.time}
                    </Text>
                </View>
                <Text style={styles.medicineCount}>{String(index + 1).padStart(2, '0')} Medicine</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <View style={styles.markCheckContainer}>
                    <TouchableOpacity
                        style={[
                            styles.checkCircle,
                            medicine.status === 'taken' && styles.checkCircleActive
                        ]}
                        onPress={() => markMedicine(medicine.id, medicine.status === 'taken' ? null : 'taken')}
                    >
                        {medicine.status === 'taken' && (
                            <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(14)} />
                        )}
                    </TouchableOpacity>
                    <Text style={styles.markText}>Mark</Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.skipButton,
                            medicine.status === 'skipped' && styles.skipButtonActive
                        ]}
                        onPress={() => markMedicine(medicine.id, 'skipped')}
                    >
                        <Text style={[
                            styles.skipButtonText,
                            medicine.status === 'skipped' && styles.skipButtonTextActive
                        ]}>Skip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.takenButton,
                            medicine.status === 'taken' && styles.takenButtonActive
                        ]}
                        onPress={() => markMedicine(medicine.id, 'taken')}
                    >
                        <Text style={styles.takenButtonText}>Mark as Taken</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    // Render empty state (no data)
    const renderEmptyState = () => (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.5]}
            style={styles.headerGradient}
        >
            {/* Top Header Row */}
            <View style={styles.topRow}>
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon
                        type={Icons.Ionicons}
                        name="arrow-back"
                        size={ms(20)}
                        color={primaryColor}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Medication Tracking</Text>
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
                                <Icon type={Icons.MaterialIcons} name="person" size={ms(20)} color={blackColor} />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Content Area */}
            <View style={styles.contentArea}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/img/notracker.png')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.mainTitle}>
                        Never Miss Your Medication
                    </Text>
                    <Text style={styles.description}>
                        Create a doctor-suggested medicine course to get daily reminders, track doses, and stay consistent with your treatment.
                    </Text>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => navigation.navigate('AddMedicines')}
                >
                    <Icon type={Icons.Feather} name="plus" size={ms(20)} color={whiteColor} />
                    <Text style={styles.createButtonText}>Create Medication Course</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );

    // Render data state (with medications)
    const renderDataState = () => (
        <View style={styles.dataContainer}>
            {/* Header with gradient */}
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.8]}
                style={styles.dataHeaderGradient}
            >
                {/* Top Header Row */}
                <View style={styles.topRow}>

                    <View>
                        <Text style={styles.headerTitle}>Medication Tracking</Text>
                        <Text style={styles.dateText}>{getCurrentDate()}</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconCircle}>
                            <Icon type={Icons.MaterialIcons} name="notifications-none" size={ms(20)} color={blackColor} />
                        </TouchableOpacity>
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
                    </View>
                </View>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsContainer}
                >
                    {FILTER_TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.filterTab,
                                selectedTab === tab && styles.filterTabActive
                            ]}
                            onPress={() => setSelectedTab(tab)}
                        >
                            <Text style={[
                                styles.filterTabText,
                                selectedTab === tab && styles.filterTabTextActive
                            ]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </LinearGradient>

            {/* Content Area */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Progress Circle */}
                {renderProgressCircle()}

                {/* Medicine Count */}
                <Text style={styles.medicineCountText}>
                    {takenCount}/{totalMedicines}  Medicines Taken
                </Text>

                {/* Medicine Cards */}
                {medications.map((medicine, index) => renderMedicineCard(medicine, index))}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {hasData ? renderDataState() : renderEmptyState()}

            {/* Subscription Plans Bottom Sheet Modal */}
            <Modal
                visible={showSubscriptionModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowSubscriptionModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.bottomSheet}>
                        {/* Header */}
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Subscription Plans</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowSubscriptionModal(false)}
                            >
                                <Icon type={Icons.Ionicons} name="close" color={blackColor} size={ms(20)} />
                            </TouchableOpacity>
                        </View>

                        {/* Subtitle */}
                        <Text style={styles.sheetSubtitle}>Smarter Care, Better Health</Text>
                        <Text style={styles.sheetDescription}>
                            Manage your medicines, get timely reminders, follow doctor-guided courses, and track your progress—all in one simple, reliable plan.
                        </Text>

                        {/* Plan Card */}
                        <View style={styles.planCard}>
                            {/* Recommended Badge */}
                            <View style={styles.recommendedBadge}>
                                <Text style={styles.recommendedText}>Recommended Plan</Text>
                            </View>

                            <View style={styles.planContent}>
                                <View style={styles.planHeader}>
                                    <View style={styles.planInfo}>
                                        <View style={styles.planCheckCircle}>
                                            <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(14)} />
                                        </View>
                                        <View style={styles.planTitleContainer}>
                                            <Text style={styles.planDuration}>Yearly</Text>
                                            <Text style={styles.planName}>Gold Health Plan</Text>
                                        </View>
                                    </View>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.price}>₹999</Text>
                                        <Text style={styles.originalPrice}>₹1999</Text>
                                    </View>
                                </View>

                                <Text style={styles.includesText}>Includes</Text>
                                <View style={styles.featureItem}>
                                    <View style={styles.bulletPoint} />
                                    <Text style={styles.featureText}>4 Family Checkup</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <View style={styles.bulletPoint} />
                                    <Text style={styles.featureText}>Medication Tracking</Text>
                                </View>
                            </View>
                        </View>

                        {/* See More Plans */}
                        <TouchableOpacity style={styles.seeMoreBtn}>
                            <Text style={styles.seeMoreText}>See more Plans</Text>
                        </TouchableOpacity>

                        {/* Continue Button */}
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={() => {
                                setShowSubscriptionModal(false);
                                navigation.navigate('AddMedicines');
                            }}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default MedicationTracking;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    // Empty State Styles
    headerGradient: {
        flex: 1,
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(15),
    },
    backButton: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        justifyContent: 'center',
        alignItems: 'center',
        // marginRight: ms(8),
        backgroundColor: whiteColor,

    },
    headerTitle: {
        fontSize: ms(20),
        fontFamily: bold,
        color: whiteColor,
    },
    dateText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: whiteColor,
        marginTop: vs(2),
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
    contentArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: vs(40),
    },
    imageContainer: {
        marginBottom: vs(30),
    },
    illustration: {
        width: width * 0.8,
        height: vs(220),
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: vs(30),
        paddingHorizontal: ms(10),
    },
    mainTitle: {
        fontSize: ms(20),
        fontFamily: bold,
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(12),
    },
    description: {
        fontSize: ms(14),
        fontFamily: regular,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: ms(20),
    },
    createButton: {
        backgroundColor: primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: vs(12),
        paddingHorizontal: ms(25),
        borderRadius: ms(12),
        width: '100%',
        shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    createButtonText: {
        color: whiteColor,
        fontFamily: bold,
        fontSize: ms(15),
        marginLeft: ms(8),
    },

    // Data State Styles
    dataContainer: {
        flex: 1,
    },
    dataHeaderGradient: {
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(20),
    },
    tabsContainer: {
        flexDirection: 'row',
        gap: ms(10),
        paddingTop: vs(10),
    },
    filterTab: {
        paddingHorizontal: ms(18),
        paddingVertical: vs(10),
        borderRadius: ms(25),
        backgroundColor: '#1A1A1A0F',
    },
    filterTabActive: {
        backgroundColor: whiteColor,
    },
    filterTabText: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
    },
    filterTabTextActive: {
        color: blackColor,
        fontFamily: bold,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: vs(20),
        paddingBottom: vs(100),
    },
    // Progress Circle Styles
    progressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: vs(15),
    },
    progressTextContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    progressPercentage: {
        fontSize: ms(28),
        fontFamily: bold,
        color: blackColor,
    },
    progressLabel: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
    },
    medicineCountText: {
        fontSize: ms(16),
        fontFamily: regular,
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(20),
    },
    // Medicine Card Styles
    medicineCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: ms(15),
        padding: ms(15),
        marginBottom: vs(15),
    },
    dateTimeText: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
        marginBottom: vs(5),
    },
    scheduleText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
        marginBottom: vs(12),
    },
    medicineInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: vs(15),
    },
    medicineName: {
        fontSize: ms(15),
        fontFamily: bold,
        color: blackColor,
    },
    medicineDetails: {
        fontSize: ms(12),
        fontFamily: regular,
        color: grayColor,
        marginTop: vs(2),
    },
    medicineCount: {
        fontSize: ms(13),
        fontFamily: regular,
        color: grayColor,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    markCheckContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkCircle: {
        width: ms(24),
        height: ms(24),
        borderRadius: ms(12),
        borderWidth: 2,
        borderColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(8),
    },
    checkCircleActive: {
        backgroundColor: primaryColor,
    },
    markText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
    },
    skipButton: {
        paddingHorizontal: ms(20),
        paddingVertical: vs(10),
        borderRadius: ms(8),
        backgroundColor: '#E5E5E5',
    },
    skipButtonActive: {
        backgroundColor: grayColor,
    },
    skipButtonText: {
        fontSize: ms(13),
        fontFamily: bold,
        color: blackColor,
    },
    skipButtonTextActive: {
        color: whiteColor,
    },
    takenButton: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(10),
        borderRadius: ms(8),
        backgroundColor: primaryColor,
    },
    takenButtonActive: {
        backgroundColor: primaryColor,
    },
    takenButtonText: {
        fontSize: ms(13),
        fontFamily: bold,
        color: whiteColor,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: whiteColor,
        borderTopLeftRadius: ms(25),
        borderTopRightRadius: ms(25),
        paddingHorizontal: ms(20),
        paddingTop: ms(20),
        paddingBottom: ms(30),
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(15),
    },
    sheetTitle: {
        fontSize: ms(18),
        fontFamily: bold,
        color: blackColor,
    },
    closeButton: {
        width: ms(32),
        height: ms(32),
        borderRadius: ms(16),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sheetSubtitle: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(8),
    },
    sheetDescription: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
        textAlign: 'center',
        lineHeight: ms(18),
        marginBottom: vs(20),
    },
    planCard: {
        borderWidth: 1,
        borderColor: primaryColor,
        borderRadius: ms(15),
        overflow: 'hidden',
        marginBottom: vs(15),
    },
    recommendedBadge: {
        backgroundColor: primaryColor,
        paddingVertical: vs(8),
        paddingHorizontal: ms(15),
        alignSelf: 'flex-start',
        borderBottomRightRadius: ms(15),
    },
    recommendedText: {
        fontSize: ms(11),
        fontFamily: bold,
        color: whiteColor,
    },
    planContent: {
        padding: ms(15),
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: vs(12),
    },
    planInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    planCheckCircle: {
        width: ms(24),
        height: ms(24),
        borderRadius: ms(12),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
    },
    planTitleContainer: {
        flexDirection: 'column',
    },
    planDuration: {
        fontSize: ms(12),
        fontFamily: regular,
        color: grayColor,
    },
    planName: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: ms(20),
        fontFamily: bold,
        color: blackColor,
        marginRight: ms(8),
    },
    originalPrice: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
        textDecorationLine: 'line-through',
    },
    includesText: {
        fontSize: ms(12),
        fontFamily: regular,
        color: grayColor,
        marginBottom: vs(8),
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    bulletPoint: {
        width: ms(6),
        height: ms(6),
        borderRadius: ms(3),
        backgroundColor: blackColor,
        marginRight: ms(10),
    },
    featureText: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
    },
    seeMoreBtn: {
        alignItems: 'center',
        marginBottom: vs(20),
    },
    seeMoreText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
        textDecorationLine: 'underline',
    },
    continueButton: {
        backgroundColor: primaryColor,
        paddingVertical: vs(14),
        borderRadius: ms(12),
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: ms(16),
        fontFamily: bold,
        color: whiteColor,
    },
});
