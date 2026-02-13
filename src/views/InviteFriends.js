import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    Share,
    Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { vs, ms } from 'react-native-size-matters';
import Clipboard from '@react-native-clipboard/clipboard';

// Project utilities
import { StatusBar2 } from '../components/StatusBar';
import { bold, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, primaryColor, grayColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';

const { width } = Dimensions.get('window');

// Earning card data
const EARNING_PLANS = [
    { id: 1, earn: '100', plan: '499' },
    { id: 2, earn: '160', plan: '799' },
    { id: 3, earn: '200', plan: '999' },
];

const InviteFriends = () => {
    const navigation = useNavigation();
    const [referralCode] = useState('7643590');
    const [copied, setCopied] = useState(false);
    const [showHowItWorks, setShowHowItWorks] = useState(false);

    const copyToClipboard = () => {
        Clipboard.setString(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Use my referral code ${referralCode} to sign up and get exciting rewards! Download the app now.`,
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    // Earning Card Component
    const EarningCard = ({ earn, plan }) => (
        <View style={styles.earningCard}>
            <Text style={styles.earnAmount}>Get ₹{earn}</Text>
            <Text style={styles.planText}>For ₹{plan} Plan</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.earningsButton} onPress={() => navigation.navigate('ReferralEarnings')}>
                        <Text style={styles.earningsButtonText}>Referral Earnings</Text>
                    </TouchableOpacity>
                </View>

                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                    <Image
                        source={require('../assets/img/referal.png')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                {/* Title and Description */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Invite Friends & Earn Up to ₹200</Text>
                    <Text style={styles.description}>
                        Invite & share your code—earn rewards when your friends buy a Subscription plan , referral amount credited safely to your wallet.
                    </Text>
                </View>

                {/* Earning Cards */}
                <View style={styles.earningCardsContainer}>
                    {EARNING_PLANS.map((plan) => (
                        <EarningCard key={plan.id} earn={plan.earn} plan={plan.plan} />
                    ))}
                </View>

                {/* Share Referral Code Section */}
                <View style={styles.referralSection}>
                    <Text style={styles.shareLabel}>Share referral code</Text>

                    <View style={styles.codeContainer}>
                        <Text style={styles.codeText}>{referralCode}</Text>
                        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                            <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy'}</Text>
                            <Icon type={Icons.Ionicons} name="copy-outline" color={blackColor} size={ms(18)} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Invite & Earn Button */}
                <PrimaryButton style={{marginVertical:10}} onPress={handleShare} title='Invite & Earn' />

                {/* How it works */}
                <TouchableOpacity style={styles.howItWorksBtn} onPress={() => setShowHowItWorks(true)}>
                    <Text style={styles.howItWorksText}>How it works</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* How It Works Bottom Sheet Modal */}
            <Modal
                visible={showHowItWorks}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowHowItWorks(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>How it works</Text>
                            <TouchableOpacity onPress={() => setShowHowItWorks(false)} style={styles.closeButton}>
                                <Icon type={Icons.Ionicons} name="close" color={blackColor} size={ms(24)} />
                            </TouchableOpacity>
                        </View>

                        {/* Steps */}
                        <View style={styles.stepsContainer}>
                            {/* Step 1 */}
                            <View style={styles.stepItem}>
                                <View style={styles.stepCircle}>
                                    <Text style={styles.stepNumber}>1</Text>
                                </View>
                                <Text style={styles.stepTitle}>Login</Text>
                                <Text style={styles.stepDescription}>Log in using the link shared .</Text>
                            </View>

                            <View style={styles.stepLine} />

                            {/* Step 2 */}
                            <View style={styles.stepItem}>
                                <View style={styles.stepCircle}>
                                    <Text style={styles.stepNumber}>2</Text>
                                </View>
                                <Text style={styles.stepTitle}>Referral code</Text>
                                <Text style={styles.stepDescription}>Enter the referral code when you start the app</Text>
                            </View>

                            <View style={styles.stepLine} />

                            {/* Step 3 */}
                            <View style={styles.stepItem}>
                                <View style={styles.stepCircle}>
                                    <Text style={styles.stepNumber}>3</Text>
                                </View>
                                <Text style={styles.stepTitle}>Get Earn ₹100,</Text>
                                <Text style={styles.stepDescription}>Once the referred user purchases a package, ₹100 is instantly added to your wallet.</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default InviteFriends;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(30),
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(20),
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
    earningsButton: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(8),
        borderRadius: ms(20),
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    earningsButtonText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: blackColor,
    },

    // Illustration
    illustrationContainer: {
        alignItems: 'center',
        marginBottom: vs(25),
    },
    illustration: {
        width: width * 0.7,
        height: vs(180),
    },

    // Text Content
    textContainer: {
        alignItems: 'center',
        marginBottom: vs(25),
    },
    title: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(12),
    },
    description: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        textAlign: 'center',
        lineHeight: ms(22),
        paddingHorizontal: ms(10),
    },

    // Earning Cards
    earningCardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(20),
        borderWidth:1,
        borderStyle:'dashed',
        paddingVertical: ms(15),
        paddingHorizontal:ms(10),
        borderColor:'#9CA3AF',
        borderRadius:ms(10)
    },
    earningCard: {
        flex: 1,
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        paddingVertical: vs(15),
        paddingHorizontal: ms(10),
        marginHorizontal: ms(5),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    earnAmount: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
        marginBottom: vs(4),
    },
    planText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: blackColor,
    },

    // Referral Section
    referralSection: {
        alignItems: 'center',
        marginBottom: vs(10),
    },
    shareLabel: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(12),
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        borderRadius: ms(25),
        paddingVertical: vs(15),
        paddingHorizontal: ms(20),
        width: '100%',
    },
    codeText: {
        fontFamily: bold,
        fontSize: ms(20),
        color: blackColor,
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(5),
    },
    copyText: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
    },

    // Invite Button
    inviteButton: {
        backgroundColor: primaryColor,
        borderRadius: ms(25),
        paddingVertical: vs(16),
        alignItems: 'center',
        marginBottom: vs(10),
    },
    inviteButtonText: {
        fontFamily: bold,
        fontSize: ms(16),
        color: whiteColor,
    },

    // How it works
    howItWorksBtn: {
        alignItems: 'center',
        // paddingVertical: vs(5),
    },
    howItWorksText: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
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
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(25),
        position: 'relative',
    },
    modalTitle: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        padding: ms(5),
    },
    stepsContainer: {
        alignItems: 'center',
    },
    stepItem: {
        alignItems: 'center',
    },
    stepCircle: {
        width: ms(32),
        height: ms(32),
        borderRadius: ms(16),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    stepNumber: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
    },
    stepLine: {
        width: 1,
        height: vs(25),
        backgroundColor: blackColor,
        marginVertical: vs(5),
    },
    stepTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(5),
    },
    stepDescription: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        textAlign: 'center',
        lineHeight: ms(20),
        paddingHorizontal: ms(20),
    },
});
