import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ms, vs } from 'react-native-size-matters';
import { blackColor, primaryColor, whiteColor } from '../../utils/globalColors';
import { heading, interMedium, interRegular, img_url } from '../../config/Constants';
import Icon, { Icons } from '../../components/Icons';
import { StatusBar4 } from '../../components/StatusBar';

const PROFILE_IMAGE_SIZE = ms(90);

const InfoRow = ({ label, value, isLast }) => (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const SectionBadge = ({ title, color, bgColor }) => (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
        <Text style={[styles.badgeText, { color }]}>{title}</Text>
    </View>
);

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        loadProfilePic();
    }, []);

    const loadProfilePic = async () => {
        try {
            const savedPic = await AsyncStorage.getItem('profile_picture');
            if (savedPic) {
                setProfilePic(`${img_url}${savedPic}`);
            }
        } catch (error) {
            console.log('Error loading profile pic:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity
                    style={styles.editBtn}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('PersonalDetails', { isEdit: true })}
                >
                    <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Image & Name */}
                <View style={styles.profileCenter}>
                    <View style={styles.profileImageWrapper}>
                        {profilePic ? (
                            <Image source={{ uri: profilePic }} style={styles.profileImage} />
                        ) : (
                            <View style={[styles.profileImage, styles.defaultAvatar]}>
                                <Icon type={Icons.MaterialIcons} name="person" size={ms(40)} color="#9CA3AF" />
                            </View>
                        )}
                        <TouchableOpacity style={styles.cameraIcon} activeOpacity={0.7}>
                            <Icon type={Icons.Entypo} name="camera" size={ms(12)} color={whiteColor} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.profileName}>{global.customer_name || 'User'}</Text>
                    <Text style={styles.profileGender}>MALE</Text>
                </View>

                {/* Personal Details */}
                <View style={styles.card}>
                    <SectionBadge title="PERSONAL DETAILS" color="#166534" bgColor="#DCFCE7" />
                    <InfoRow label="Date Of Birth" value="24 Jan 2001" />
                    <InfoRow label="Age" value="25 Years, 1 Month, 3 Days" />
                    <InfoRow label="Mobile Number" value="+91 7345437673" />
                    <InfoRow label="Email Address" value="ramesh3245@gmail.com" isLast />
                </View>

                {/* Family Doctor */}
                <View style={styles.card}>
                    <SectionBadge title="FAMILY DOCTOR DETAILS" color="#1E40AF" bgColor="#DBEAFE" />
                    <InfoRow label="Name" value="Dr. Sindhu Sai" />
                    <InfoRow label="Mobile Number" value="+91 7345437673" isLast />
                </View>

                {/* Caretaker */}
                <View style={styles.card}>
                    <SectionBadge title="CARETAKER DETAILS" color="#92400E" bgColor="#FEF3C7" />
                    <InfoRow label="Name" value="Dr. Sindhu Sai" />
                    <InfoRow label="Mobile Number" value="+91 7345437673" isLast />
                </View>

                {/* Emergency */}
                <View style={styles.card}>
                    <SectionBadge title="EMERGENCY DETAILS" color="#065F46" bgColor="#D1FAE5" />
                    <InfoRow label="Name" value="Dr. Sindhu Sai" />
                    <InfoRow label="Mobile Number" value="+91 7345437673" isLast />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
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
        fontFamily: heading,
        fontSize: ms(18),
        color: blackColor,
        marginLeft: ms(12),
    },
    editBtn: {
        backgroundColor: primaryColor,
        paddingHorizontal: ms(18),
        paddingVertical: vs(6),
        borderRadius: ms(20),
    },
    editBtnText: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: whiteColor,
    },

    // Scroll
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(40),
    },

    // Profile
    profileCenter: {
        alignItems: 'center',
        marginVertical: vs(20),
    },
    profileImageWrapper: {
        width: PROFILE_IMAGE_SIZE,
        height: PROFILE_IMAGE_SIZE,
        borderRadius: PROFILE_IMAGE_SIZE / 2,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: PROFILE_IMAGE_SIZE / 2,
    },
    defaultAvatar: {
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: primaryColor,
        width: ms(24),
        height: ms(24),
        borderRadius: ms(12),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: whiteColor,
    },
    profileName: {
        fontFamily: heading,
        fontSize: ms(16),
        color: blackColor,
        marginTop: vs(10),
    },
    profileGender: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
        marginTop: vs(2),
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },

    // Badge
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: ms(12),
        paddingVertical: vs(4),
        borderRadius: ms(20),
        marginBottom: vs(10),
    },
    badgeText: {
        fontFamily: interMedium,
        fontSize: ms(11),
    },

    // Info Row
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(10),
    },
    infoRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    infoLabel: {
        fontFamily: interRegular,
        fontSize: ms(13),
        color: '#6B7280',
    },
    infoValue: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
});

export default ProfileScreen;
