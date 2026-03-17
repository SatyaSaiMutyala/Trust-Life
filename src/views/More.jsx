import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import Icon, { Icons } from '../components/Icons';
import { heading, interMedium, interRegular, img_url, login_entry_img } from '../config/Constants';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar2 } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';
import { vs, ms } from 'react-native-size-matters';
import { blackColor, primaryColor, whiteColor } from '../utils/globalColors';

const { width } = Dimensions.get('window');

// --- Section Row Item ---
const SectionRow = ({ icon, iconType, title, onPress, isLast, rightText }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.sectionRow, !isLast && styles.sectionRowBorder]}
        activeOpacity={0.6}
    >
        <View style={styles.sectionRowIconWrap}>
            <Icon type={iconType} name={icon} color={blackColor} size={ms(20)} />
        </View>
        <Text style={styles.sectionRowTitle}>{title}</Text>
        {rightText ? (
            <Text style={styles.sectionRowRightText}>{rightText}</Text>
        ) : (
            <Icon type={Icons.Ionicons} name="chevron-forward" color="#9CA3AF" size={ms(18)} />
        )}
    </TouchableOpacity>
);

// --- Quick Action Button ---
const QuickActionButton = ({ icon, iconType, label, onPress }) => (
    <TouchableOpacity style={styles.quickActionBtn} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.quickActionIconWrapper}>
            <Icon type={iconType} name={icon} color={blackColor} size={ms(18)} />
        </View>
        <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
);

const More = (props) => {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const walletAmount = 200;

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

    const showDialog = () => setVisible(true);
    const handleCancel = () => setVisible(false);

    const handleLogout = async () => {
        setVisible(false);
        await AsyncStorage.clear();
        global.online_status = 0;
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Splash" }],
            })
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {global.id == 0 ? (
                <TouchableOpacity
                    onPress={() => navigation.navigate("CheckPhone")}
                    style={styles.loginContainer}
                >
                    <Image
                        source={login_entry_img}
                        style={{ height: vs(150), width: ms(200) }}
                        resizeMode='contain'
                    />
                    <Text style={styles.loginText}>Click to Login</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.mainContainer}>
                    {/* Header */}
                    <View style={styles.headerGradient}>
                        <View style={styles.headerSection}>
                            {profilePic || props.profile_picture ? (
                                <Image
                                    source={{ uri: profilePic || `${img_url}${props.profile_picture}` }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <View style={[styles.profileImage, styles.defaultProfileIcon]}>
                                    <Icon type={Icons.MaterialIcons} name="person" size={ms(30)} color={blackColor} />
                                </View>
                            )}
                            <View style={styles.welcomeContainer}>
                                <Text style={styles.welcomeText}>Welcome</Text>
                                <Text style={styles.userName}>{global.customer_name || 'User'}</Text>
                            </View>
                            <View style={styles.headerIcons}>
                                <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('Notifications')}>
                                    <Icon type={Icons.Ionicons} name="notifications-outline" size={ms(20)} color={blackColor} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('settingsmore')}>
                                    <Icon type={Icons.Ionicons} name="settings-outline" size={ms(20)} color={blackColor} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Wallet Card */}
                        <View style={styles.walletCard}>
                            <View style={styles.walletLeft}>
                                <Text style={styles.walletLabel}>Wallet Amount</Text>
                                <Text style={styles.walletSubtext}>Use this wallet amount in test Booking</Text>
                            </View>
                            <Text style={styles.walletAmount}>₹{walletAmount}</Text>
                        </View>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* TrustMD Card */}
                        <TouchableOpacity
                            style={styles.trustMDCard}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('TrustMD')}
                        >
                            <Image
                                source={require('../assets/img/md.png')}
                                style={styles.trustMDImage}
                                resizeMode="contain"
                            />
                            <View style={styles.trustMDTextWrap}>
                                <Text style={styles.trustMDTitle}>TrustMD</Text>
                                <Text style={styles.trustMDDesc}>Patient health overview for tracking progress and risks.</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Quick Actions */}
                        <View style={styles.quickActionsRow}>
                            <QuickActionButton
                                icon="calendar-outline"
                                iconType={Icons.Ionicons}
                                label={"My  Bookings"}
                                onPress={() => navigation.navigate('LabOrders')}
                            />
                            <QuickActionButton
                                icon="people-outline"
                                iconType={Icons.Ionicons}
                                label={"Invite & Friends"}
                                onPress={() => navigation.navigate('InviteFriends')}
                            />
                            <QuickActionButton
                                icon="headset-outline"
                                iconType={Icons.Ionicons}
                                label="Support"
                                onPress={() => navigation.navigate('SupportScreen')}
                            />
                        </View>

                        {/* ACCOUNT Section */}
                        <Text style={styles.sectionHeader}>ACCOUNT</Text>
                        <View style={styles.sectionCard}>
                            <SectionRow
                                icon="person-outline"
                                iconType={Icons.Ionicons}
                                title="Profile"
                                onPress={() => navigation.navigate('ProfileScreen')}
                            />
                            <SectionRow
                                icon="people-outline"
                                iconType={Icons.Ionicons}
                                title="Personal Details"
                                onPress={() => navigation.navigate('Profile')}
                            />
                            <SectionRow
                                icon="person-add-outline"
                                iconType={Icons.Ionicons}
                                title="Add Members"
                                onPress={() => navigation.navigate('AddFamilyScreen', { isEdit: true })}
                            />
                            <SectionRow
                                icon="add-circle-outline"
                                iconType={Icons.Ionicons}
                                title="Address Book"
                                onPress={() => navigation.navigate('Address')}
                                isLast
                            />
                            <SectionRow
                                icon="language-outline"
                                iconType={Icons.Ionicons}
                                title="Language"
                                onPress={() => navigation.navigate('LanguageScreen')}
                                isLast
                            />
                        </View>

                        {/* DATA & TRANSPARENCY Section */}
                        <Text style={styles.sectionHeader}>DATA & TRANSPARENCY</Text>
                        <View style={styles.sectionCard}>
                            <SectionRow
                                icon="hand-left-outline"
                                iconType={Icons.Ionicons}
                                title="Consent Manager"
                                onPress={() => navigation.navigate('ConsentManagerScreen')}
                            />
                            <SectionRow
                                icon="shield-checkmark-outline"
                                iconType={Icons.Ionicons}
                                title="Data Access Log"
                                onPress={() => navigation.navigate('AccessLogScreen')}
                            />
                            <SectionRow
                                icon="document-lock-outline"
                                iconType={Icons.Ionicons}
                                title="Data Transparency Center"
                                onPress={() => navigation.navigate('DataTransparencyCenterScreen')}
                                isLast
                            />
                        </View>

                        {/* TRUST Section */}
                        <Text style={styles.sectionHeader}>TRUST</Text>
                        <View style={styles.sectionCard}>
                            <SectionRow
                                icon="document-text-outline"
                                iconType={Icons.Ionicons}
                                title="Annual Trust Report"
                                onPress={() => navigation.navigate('AnnualTrustReportScreen')}
                                isLast
                            />
                        </View>

                        {/* BILLING Section */}
                        <Text style={styles.sectionHeader}>BILLING</Text>
                        <View style={styles.sectionCard}>
                            <SectionRow
                                icon="gift-outline"
                                iconType={Icons.Ionicons}
                                title="Referral Incentives"
                                onPress={() => navigation.navigate('ReferralEarnings')}
                            />
                            <SectionRow
                                icon="trophy-outline"
                                iconType={Icons.Ionicons}
                                title="Rewards"
                                onPress={() => navigation.navigate('')}
                            />
                            <SectionRow
                                icon="options-outline"
                                iconType={Icons.Ionicons}
                                title="Subscription History"
                                onPress={() => navigation.navigate('SubscriptionPlans', { hasPlan: true })}
                                isLast
                            />
                        </View>

                        {/* SECURITY DETAILS Section */}
                        <Text style={styles.sectionHeader}>ABOUT</Text>
                        <View style={styles.sectionCard}>

                            <SectionRow
                                icon="information-circle-outline"
                                iconType={Icons.Ionicons}
                                title="App Version"
                                rightText="1.0.0"
                                onPress={() => { }}
                            />
                            <SectionRow
                                icon="lock-closed-outline"
                                iconType={Icons.Ionicons}
                                title="Security Center"
                                onPress={() => navigation.navigate('PrivacyPolicies')}
                            />
                            <SectionRow
                                icon="shield-checkmark-outline"
                                iconType={Icons.Ionicons}
                                title="Privacy Policy"
                                onPress={() => navigation.navigate('PrivacyPolicyScreen')}
                            />
                            <SectionRow
                                icon="document-text-outline"
                                iconType={Icons.Ionicons}
                                title="Terms of Service"
                                onPress={() => navigation.navigate('TermsOfServiceScreen')}
                            />
                            <SectionRow
                                icon="hand-left-outline"
                                iconType={Icons.Ionicons}
                                title="User Consent Agreement"
                                onPress={() => navigation.navigate('UserConsentAgreementScreen')}
                            />

                            <SectionRow
                                icon="star-outline"
                                iconType={Icons.Ionicons}
                                title="Rate Us in Store"
                                onPress={() => { }}
                            />
                        </View>

                        {/* Logout */}
                        <TouchableOpacity
                            style={styles.logoutRow}
                            activeOpacity={0.6}
                            onPress={showDialog}
                        >
                            <View style={styles.sectionRowIconWrap}>
                                <Icon type={Icons.Ionicons} name="log-out-outline" color={blackColor} size={ms(20)} />
                            </View>
                            <Text style={styles.sectionRowTitle}>Logout</Text>
                            <Icon type={Icons.Ionicons} name="chevron-forward" color="#9CA3AF" size={ms(18)} />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            )}

            {/* Logout Dialog */}
            {visible && (
                <View style={styles.dialogOverlay}>
                    <View style={styles.dialogContainer}>
                        <Icon
                            type={Icons.Feather}
                            name="log-out"
                            color={primaryColor}
                            size={ms(30)}
                            style={{ marginBottom: vs(15) }}
                        />
                        <Text style={styles.dialogTitle}>Logout</Text>
                        <Text style={styles.dialogMessage}>Are you sure you want to log out?</Text>
                        <View style={styles.dialogActions}>
                            <TouchableOpacity onPress={handleCancel} style={styles.dialogCancelBtn}>
                                <Text style={styles.dialogCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleLogout} style={styles.dialogLogoutBtn}>
                                <LinearGradient
                                    colors={['#006D5D', '#50A89C']}
                                    style={styles.dialogLogoutGradient}
                                >
                                    <Text style={styles.dialogLogoutText}>Yes, Logout</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    mainContainer: {
        flex: 1,
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontFamily: interRegular,
        fontSize: ms(16),
        color: blackColor,
        marginTop: vs(10),
    },

    // Header
    headerGradient: {
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        backgroundColor: primaryColor,
        borderBottomEndRadius: ms(25),
        borderBottomStartRadius: ms(25),
    },
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: ms(50),
        height: ms(50),
        borderRadius: ms(25),
        borderWidth: 2,
        borderColor: whiteColor,
    },
    defaultProfileIcon: {
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeContainer: {
        flex: 1,
        marginLeft: ms(12),
    },
    welcomeText: {
        fontFamily: interMedium,
        fontSize: ms(16),
        color: whiteColor,
    },
    userName: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: whiteColor,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
    },
    iconCircle: {
        backgroundColor: whiteColor,
        width: ms(38),
        height: ms(38),
        borderRadius: ms(19),
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Wallet Card
    walletCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        paddingHorizontal: ms(18),
        paddingVertical: vs(14),
        marginTop: ms(25),
        marginBottom: vs(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    walletLeft: {
        flex: 1,
        marginRight: ms(10),
    },
    walletLabel: {
        fontFamily: interMedium,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(3),
    },
    walletSubtext: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#6B7280',
    },
    walletAmount: {
        fontFamily: interMedium,
        fontSize: ms(26),
        color: blackColor,
    },

    // ScrollView
    scrollView: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: vs(15),
        paddingBottom: vs(100),
    },

    // TrustMD Card
    trustMDCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        paddingHorizontal: ms(16),
        paddingVertical: vs(16),
        marginBottom: vs(18),
    },
    trustMDImage: {
        width: ms(44),
        height: ms(44),
        borderRadius: ms(22),
        marginRight: ms(14),
    },
    trustMDTextWrap: {
        flex: 1,
    },
    trustMDTitle: {
        fontFamily: interMedium,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(2),
    },
    trustMDDesc: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#6B7280',
    },

    // Quick Actions
    quickActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(20),
    },
    quickActionBtn: {
        alignItems: 'center',
        width: (width - ms(60)) / 3,
        backgroundColor: whiteColor,
        paddingVertical: ms(14),
        borderRadius: ms(12),
    },
    quickActionIconWrapper: {
        backgroundColor: '#F3F4F6',
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    quickActionLabel: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: blackColor,
        textAlign: 'center',
    },

    // Section Headers & Cards
    sectionHeader: {
        fontFamily: heading,
        fontSize: ms(14),
        color: blackColor,
        letterSpacing: 0.5,
        marginBottom: vs(8),
        marginTop: vs(5),
    },
    sectionCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        paddingHorizontal: ms(16),
        marginBottom: vs(10),
    },
    sectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(12),
    },
    sectionRowIconWrap: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(14),
    },
    sectionRowTitle: {
        flex: 1,
        fontFamily: interMedium,
        fontSize: ms(14),
        color: blackColor,
    },
    sectionRowRightText: {
        fontFamily: interRegular,
        fontSize: ms(13),
        color: '#9CA3AF',
    },

    // Logout
    logoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        paddingHorizontal: ms(16),
        paddingVertical: vs(15),
        marginTop: vs(5),
    },

    // Logout Dialog
    dialogOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        zIndex: 20,
    },
    dialogContainer: {
        backgroundColor: whiteColor,
        borderTopLeftRadius: ms(25),
        borderTopRightRadius: ms(25),
        padding: ms(25),
        alignItems: 'center',
        paddingBottom: vs(65),
    },
    dialogTitle: {
        fontFamily: heading,
        fontSize: ms(20),
        color: blackColor,
        marginBottom: vs(8),
    },
    dialogMessage: {
        fontFamily: interRegular,
        fontSize: ms(14),
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(25),
    },
    dialogActions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    dialogCancelBtn: {
        flex: 1,
        height: vs(50),
        backgroundColor: '#F3F4F6',
        borderRadius: ms(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
    },
    dialogCancelText: {
        fontFamily: interMedium,
        fontSize: ms(16),
        color: blackColor,
    },
    dialogLogoutBtn: {
        flex: 1,
        height: vs(50),
        borderRadius: ms(12),
        overflow: 'hidden',
    },
    dialogLogoutGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogLogoutText: {
        fontFamily: interMedium,
        fontSize: ms(16),
        color: whiteColor,
    },
});

function mapStateToProps(state) {
    return {
        profile_picture: state.current_location.profile_picture,
    };
}

export default connect(mapStateToProps, null)(More);
