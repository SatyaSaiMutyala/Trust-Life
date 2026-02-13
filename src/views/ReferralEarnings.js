import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { vs, ms } from 'react-native-size-matters';

// Project utilities
import { StatusBar2 } from '../components/StatusBar';
import { bold, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../utils/globalColors';

// Sample referral data
const REFERRALS = [
    { id: 1, name: 'Rahul', date: '10:30 AM , 25/01/2026', amount: '100', image: require('../assets/img/man.png') },
    { id: 2, name: 'Subbu', date: '10:30 AM , 25/01/2026', amount: '100', image: require('../assets/img/boy.png') },
    { id: 3, name: 'Rajesh', date: '10:30 AM , 25/01/2026', amount: null, image: require('../assets/img/old-man.png') },
    { id: 4, name: 'Mani Kumar', date: '10:30 AM , 25/01/2026', amount: null, image: require('../assets/img/man.png') },
    { id: 5, name: 'Vicky', date: '10:30 AM , 25/01/2026', amount: null, image: require('../assets/img/boy.png') },
    { id: 6, name: 'Surekha', date: '10:30 AM , 25/01/2026', amount: null, image: require('../assets/img/woman.png') },
];

// Steps data
const STEPS = [
    { id: 1, title: 'Login', description: 'Log in using the link shared .' },
    { id: 2, title: 'Referral code', description: 'Enter the referral code when you start the app' },
    { id: 3, title: 'Purchase Plan', description: 'Enter the referral code when you start the app' },
    { id: 4, title: 'Get Rewards', description: 'Once the referred user purchases a package, ₹100 is instantly added to your wallet.' },
];

const ReferralEarnings = () => {
    const navigation = useNavigation();
    const totalEarnings = '200';
    const [selectedReferral, setSelectedReferral] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleReferralPress = (item) => {
        setSelectedReferral(item);
        setShowModal(true);
    };

    const ReferralItem = ({ item }) => (
        <TouchableOpacity style={styles.referralItem} onPress={() => handleReferralPress(item)}>
            <Image source={item.image} style={styles.profileImage} />
            <View style={styles.referralInfo}>
                <Text style={styles.referralName}>{item.name}</Text>
                <Text style={styles.referralDate}>{item.date}</Text>
            </View>
            {item.amount && (
                <View style={styles.amountContainer}>
                    <Text style={styles.plusSign}>+</Text>
                    <Text style={styles.amountText}>₹{item.amount}</Text>
                </View>
            )}
            <Icon type={Icons.Ionicons} name="chevron-forward" color="#9CA3AF" size={ms(20)} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            <View style={styles.mainContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>

                    {REFERRALS.length > 0 && (
                        <TouchableOpacity style={styles.helpButton}>
                            <Icon type={Icons.Feather} name="help-circle" color={blackColor} size={ms(22)} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Content based on data */}
                {REFERRALS.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Image
                            source={require('../assets/img/norefeerals.png')}
                            style={styles.emptyImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.emptyText}>No earning yet</Text>
                    </View>
                ) : (
                    <>
                        {/* Earnings Card */}
                        <View style={styles.earningsCard}>
                            <Text style={styles.earningsLabel}>Referral Earnings</Text>
                            <Text style={styles.earningsAmount}>₹{totalEarnings}</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Recent Referrals</Text>
                        <ScrollView
                            style={styles.scrollView}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {REFERRALS.map((item) => (
                                <ReferralItem key={item.id} item={item} />
                            ))}
                        </ScrollView>
                    </>
                )}
            </View>

            {/* Referral Details Bottom Sheet Modal */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalProfileRow}>
                                {selectedReferral && (
                                    <Image source={selectedReferral.image} style={styles.modalProfileImage} />
                                )}
                                <View style={styles.modalProfileInfo}>
                                    <Text style={styles.modalProfileName}>{selectedReferral?.name}</Text>
                                    <Text style={styles.modalProfileDate}>{selectedReferral?.date}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                                <Icon type={Icons.Ionicons} name="close" color={blackColor} size={ms(24)} />
                            </TouchableOpacity>
                        </View>

                        {/* Amount Credited */}
                        <View style={styles.amountCreditedRow}>
                            <Text style={styles.amountCreditedLabel}>Amount Credited</Text>
                            <View style={styles.amountCreditedValue}>
                                <Text style={styles.creditedPlus}>+</Text>
                                <Text style={styles.creditedAmount}>₹{selectedReferral?.amount || '100'}</Text>
                            </View>
                        </View>

                        {/* Steps Timeline */}
                        <View style={styles.stepsContainer}>
                            {STEPS.map((step, index) => (
                                <View key={step.id} style={styles.stepRow}>
                                    <View style={styles.stepIndicator}>
                                        <View style={styles.stepCircle}>
                                            <Text style={styles.stepNumber}>{step.id}</Text>
                                        </View>
                                        {index < STEPS.length - 1 && <View style={styles.stepLine} />}
                                    </View>
                                    <View style={styles.stepContent}>
                                        <Text style={styles.stepTitle}>{step.title}</Text>
                                        <Text style={styles.stepDescription}>{step.description}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default ReferralEarnings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: vs(30),
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(25),
    },
    backButton: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(20),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpButton: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Earnings Card
    earningsCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(20),
        marginBottom: vs(25),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    earningsLabel: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(8),
    },
    earningsAmount: {
        fontFamily: bold,
        fontSize: ms(28),
        color: blackColor,
    },

    // Section Title
    sectionTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
        marginBottom: vs(15),
    },

    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: vs(50),
    },
    emptyImage: {
        width: ms(220),
        height: vs(220),
        marginBottom: vs(15),
    },
    emptyText: {
        fontFamily: regular,
        fontSize: ms(16),
        color: blackColor,
        textAlign: 'center',
    },

    // Referral Item
    referralItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: ms(12),
        padding: ms(15),
        marginBottom: vs(12),
    },
    profileImage: {
        width: ms(45),
        height: ms(45),
        borderRadius: ms(22.5),
        marginRight: ms(12),
    },
    referralInfo: {
        flex: 1,
    },
    referralName: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(3),
    },
    referralDate: {
        fontFamily: regular,
        fontSize: ms(12),
        color: blackColor,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: ms(10),
    },
    plusSign: {
        fontFamily: regular,
        fontSize: ms(14),
        color: '#22C55E',
        marginRight: ms(2),
    },
    amountText: {
        fontFamily: bold,
        fontSize: ms(14),
        color: '#22C55E',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: whiteColor,
        borderTopLeftRadius: ms(25),
        borderTopRightRadius: ms(25),
        paddingHorizontal: ms(20),
        paddingTop: vs(20),
        paddingBottom: vs(40),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: vs(20),
    },
    modalProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalProfileImage: {
        width: ms(45),
        height: ms(45),
        borderRadius: ms(22.5),
        marginRight: ms(12),
    },
    modalProfileInfo: {
        justifyContent: 'center',
    },
    modalProfileName: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
        marginBottom: vs(3),
    },
    modalProfileDate: {
        fontFamily: regular,
        fontSize: ms(12),
        color: blackColor,
    },
    closeButton: {
        padding: ms(5),
    },

    // Amount Credited
    amountCreditedRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(25),
    },
    amountCreditedLabel: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
    },
    amountCreditedValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    creditedPlus: {
        fontFamily: regular,
        fontSize: ms(16),
        color: '#22C55E',
        marginRight: ms(2),
    },
    creditedAmount: {
        fontFamily: bold,
        fontSize: ms(16),
        color: '#22C55E',
    },

    // Steps Timeline
    stepsContainer: {
        paddingLeft: ms(5),
    },
    stepRow: {
        flexDirection: 'row',
    },
    stepIndicator: {
        alignItems: 'center',
        marginRight: ms(15),
    },
    stepCircle: {
        width: ms(28),
        height: ms(28),
        borderRadius: ms(14),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumber: {
        fontFamily: bold,
        fontSize: ms(12),
        color: whiteColor,
    },
    stepLine: {
        width: 2,
        height: vs(45),
        backgroundColor: primaryColor,
        marginVertical: vs(3),
    },
    stepContent: {
        flex: 1,
        paddingTop: vs(2),
        paddingBottom: vs(15),
    },
    stepTitle: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(3),
    },
    stepDescription: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
        lineHeight: ms(18),
    },
});
