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
import { regular, bold, img_url, login_entry_img } from '../config/Constants';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar2 } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';
import { vs, ms } from 'react-native-size-matters';
import { blackColor, primaryColor, whiteColor } from '../utils/globalColors';

const { width } = Dimensions.get('window');

// --- Profile List Item Component (Original Style) ---
const ProfileListItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.listItemContainer}>
        {/* Left Icon */}
        <View style={styles.listItemIconWrapper}>
            <Icon
                type={item.type}
                name={item.icon}
                color={blackColor}
                style={{ fontSize: ms(20) }}
            />
        </View>

        {/* Title and Subtitle */}
        <View style={styles.listItemTextContent}>
            <Text style={styles.listItemTitle}>{item.title}</Text>
            {item.subtitle && (
                <Text style={styles.listItemSubtitle} numberOfLines={1} ellipsizeMode='tail'>
                    {item.subtitle}
                </Text>
            )}
        </View>

        {/* Right Arrow */}
        <View style={styles.listItemArrowWrapper}>
            <Icon
                type={Icons.Ionicons}
                name="chevron-forward-outline"
                color={blackColor}
                style={{ fontSize: ms(20) }}
            />
        </View>
    </TouchableOpacity>
);

// --- Quick Action Button Component ---
const QuickActionButton = ({ icon, iconType, label, onPress }) => (
    <TouchableOpacity style={styles.quickActionBtn} onPress={onPress}>
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
    const walletAmount = 200; // TODO: Fetch from API

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

    // Profile menu items
    const profileData = [
        {
            id: 1,
            title: 'Personal Information',
            subtitle: 'Enter your basic details for accurate health...',
            icon: 'person-outline',
            type: Icons.Ionicons,
            action: 'Profile'
        },
        {
            id: 2,
            title: 'My Prescriptions',
            subtitle: 'View and manage your saved prescripti...',
            icon: 'medical-outline',
            type: Icons.Ionicons,
            action: 'My Prescriptions'
        },
        {
            id: 3,
            title: 'Address Book',
            subtitle: 'Edit, Add and manage your delivery ad...',
            icon: 'add-circle-outline',
            type: Icons.Ionicons,
            action: 'Address Book'
        },
        {
            id: 4,
            title: 'Privacy Policy',
            subtitle: 'Your data, your control—learn more her...',
            icon: 'lock-closed-outline',
            type: Icons.Ionicons,
            action: 'Privacy Policies'
        },
        {
            id: 5,
            title: 'Subscription',
            subtitle: 'Manage your subscription plans and ben...',
            icon: 'card-outline',
            type: Icons.Ionicons,
            action: 'Subscription'
        },
        {
            id: 6,
            title: 'Terms and conditions',
            subtitle: 'Your data, your control—learn more her...',
            icon: 'document-text-outline',
            type: Icons.Ionicons,
            action: 'Terms'
        },
    ];

    const logoutItem = {
        id: 7,
        title: 'Logout',
        icon: 'log-out-outline',
        type: Icons.Ionicons,
        action: 'Logout'
    };

    // --- Handlers ---
    const handleItemPress = async (actionName) => {
        if (actionName === "Profile") {
            navigation.navigate("Profile");
        } else if (actionName === 'My Booking') {
            navigation.navigate("LabOrders");
        } else if (actionName === 'Address Book') {
            navigation.navigate("Address");
        } else if (actionName === 'Privacy Policies') {
            navigation.navigate("PrivacyPolicies");
        } else if (actionName === 'Help') {
            navigation.navigate("FaqCategories");
        } else if (actionName === 'Logout') {
            showDialog();
        } else if (actionName === 'My Prescriptions') {
            navigation.navigate("MyPrescriptions");
        } else if (actionName === 'Subscription') {
            navigation.navigate("SubscriptionPlans", { hasPlan: true });
        } else if (actionName === 'Terms') {
            navigation.navigate("TermsAndConditions");
        }
    };

    const showDialog = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

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
                    {/* Header with Gradient */}
                    <View
                        style={styles.headerGradient}
                    >
                        <View style={styles.headerSection}>
                            {/* Profile Image */}
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

                            {/* Welcome Text */}
                            <View style={styles.welcomeContainer}>
                                <Text style={styles.welcomeText}>Welcome</Text>
                                <Text style={styles.userName}>{global.customer_name || 'User'}</Text>
                            </View>

                            {/* Header Icons */}
                            <View style={styles.headerIcons}>
                                <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('Notifications')}>
                                    <Icon type={Icons.Ionicons} name="notifications-outline" size={ms(20)} color={blackColor} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('settingsmore')}>
                                    <Icon type={Icons.Ionicons} name="settings-outline" size={ms(20)} color={blackColor} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* White Body Content */}
                        {/* Wallet Card */}
                        <View style={styles.walletCard}>
                            <Text style={styles.walletLabel}>Wallet Amount</Text>
                            <Text style={styles.walletAmount}>₹{walletAmount}</Text>
                            <Text style={styles.walletSubtext}>Pay instantly using your wallet.</Text>
                        </View>

                    </View>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Quick Actions */}
                        <View style={styles.quickActionsRow}>
                            <QuickActionButton
                                icon="calendar-outline"
                                iconType={Icons.Ionicons}
                                label="My  Bookings"
                                onPress={() => navigation.navigate('LabOrders')}
                            />
                            <QuickActionButton
                                icon="people-outline"
                                iconType={Icons.Ionicons}
                                label="Invite & Friends"
                                onPress={() => navigation.navigate('InviteFriends')}
                            />
                            <QuickActionButton
                                icon="headset-outline"
                                iconType={Icons.Ionicons}
                                label="Help Us"
                                onPress={() => navigation.navigate('FaqCategories')}
                            />
                        </View>

                        {/* Profile List Items */}
                        <View style={styles.listContainer}>
                            {profileData.map((item) => (
                                <ProfileListItem
                                    key={item.id}
                                    item={item}
                                    onPress={() => handleItemPress(item.action)}
                                />
                            ))}

                            {/* Logout Item */}
                            <ProfileListItem
                                item={logoutItem}
                                onPress={() => handleItemPress(logoutItem.action)}
                            />
                        </View>
                    </ScrollView>
                </View>
            )
            }

            {/* Logout Dialog */}
            {
                visible && (
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
                )
            }
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
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
        fontFamily: regular,
        fontSize: ms(16),
        color: blackColor,
        marginTop: vs(10),
    },

    // Header with Gradient
    headerGradient: {
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        // paddingBottom: vs(20),
        backgroundColor: primaryColor,
        borderBottomEndRadius:ms(25),
        borderBottomStartRadius:ms(25)
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
        fontFamily: bold,
        fontSize: ms(16),
        color: whiteColor,
    },
    userName: {
        fontFamily: regular,
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

    // White Body Content
    scrollView: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: vs(20),
        paddingBottom: vs(100),
    },

    // Wallet Card
    walletCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        padding: ms(15),
        marginBottom: vs(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginTop:ms(25)
    },
    walletLabel: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(5),
    },
    walletAmount: {
        fontFamily: bold,
        fontSize: ms(28),
        color: blackColor,
        marginBottom: vs(5),
    },
    walletSubtext: {
        fontFamily: regular,
        fontSize: ms(10),
        color: blackColor,
    },

    // Quick Actions
    quickActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(25),
    },
    quickActionBtn: {
        alignItems: 'center',
        width: (width - ms(60)) / 3,
        backgroundColor:'#F9FAFB',
        paddingVertical:ms(12),
        borderRadius:ms(10)
    },
    quickActionIconWrapper: {
        backgroundColor: whiteColor,
        width: ms(40),
        height: ms(40),
        borderRadius: ms(30),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(8),

    },
    quickActionLabel: {
        fontFamily: regular,
        fontSize: ms(12),
        color: blackColor,
        textAlign: 'center',
    },

    // List Items
    listContainer: {
        gap: vs(10),
    },
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(15),
        paddingHorizontal: ms(15),
        backgroundColor: '#F9FAFB',
        marginBottom: ms(0),
        borderRadius: ms(10),
    },
    listItemIconWrapper: {
        width: ms(35),
        height: ms(35),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(15),
    },
    listItemTextContent: {
        flex: 1,
        justifyContent: 'center',
    },
    listItemTitle: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
    },
    listItemSubtitle: {
        fontSize: ms(10),
        color: '#6B7280',
        marginTop: vs(2),
    },
    listItemArrowWrapper: {
        width: ms(20),
        justifyContent: 'center',
        alignItems: 'flex-end',
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
        paddingBottom: vs(40),
    },
    dialogTitle: {
        fontFamily: bold,
        fontSize: ms(20),
        color: blackColor,
        marginBottom: vs(8),
    },
    dialogMessage: {
        fontFamily: regular,
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
        fontFamily: bold,
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
        fontFamily: bold,
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
