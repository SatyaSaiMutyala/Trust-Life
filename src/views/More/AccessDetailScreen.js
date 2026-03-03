import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const InfoCard = ({ children }) => (
    <View style={styles.infoCard}>{children}</View>
);

const DetailRow = ({ label, value, valueColor, isLast }) => (
    <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
);

const AccessDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const accessLog = route.params?.accessLog || {};

    const isEmergency = accessLog.permissionType === 'emergency';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Access Details</Text>
                <View style={styles.platformBadge}>
                    <Icon
                        type={Icons.Ionicons}
                        name={accessLog.platform === 'Mobile App' ? 'phone-portrait-outline' : 'globe-outline'}
                        color="#6B7280"
                        size={ms(14)}
                    />
                    <Text style={styles.platformBadgeText}>{accessLog.platform}</Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageWrapper}>
                        {accessLog.avatar ? (
                            <Image source={accessLog.avatar} style={styles.profileImage} />
                        ) : (
                            <View style={[styles.profileImage, styles.defaultProfileAvatar]}>
                                <Icon type={Icons.MaterialIcons} name="person" size={ms(40)} color="#9CA3AF" />
                            </View>
                        )}
                    </View>
                    <Text style={styles.profileName}>{accessLog.name}</Text>
                    <Text style={[styles.profileRole, { color: accessLog.roleColor }]}>
                        {accessLog.role}
                    </Text>
                </View>

                {/* Activity Details Card */}
                <InfoCard>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardLabel}>ACTIVITY DETAILS</Text>
                        <Text style={styles.cardDate}>{accessLog.date}</Text>
                    </View>
                    <View style={[styles.activityBadge, { backgroundColor: accessLog.statusBgColor }]}>
                        <Text style={[styles.activityBadgeText, { color: accessLog.statusColor }]}>
                            {accessLog.status === 'DOWNLOADED' ? 'Downloaded Reports' : 'Reports Viewed'}
                        </Text>
                    </View>
                    <Text style={styles.reportTypes}>{accessLog.reportTypes || 'Blood Reports   BP Reports'}</Text>
                </InfoCard>

                {/* Permission Card */}
                <InfoCard>
                    <Text style={styles.permissionLabel}>Permission</Text>
                    <Text style={[
                        styles.permissionValue,
                        isEmergency && { color: '#DC2626' },
                    ]}>
                        {isEmergency ? 'Emergency Access' : 'Granted by me'}
                    </Text>
                </InfoCard>

                {/* Basic Details Card (Emergency only) */}
                {isEmergency && (
                    <InfoCard>
                        <Text style={styles.basicDetailsTitle}>Basic Details</Text>
                        <DetailRow label="Hospital Name" value={accessLog.hospitalName} />
                        <DetailRow label="Conatct" value={accessLog.contact} />
                        <DetailRow
                            label="Reason For Emergency Access"
                            value={accessLog.reasonForEmergency}
                            isLast
                        />
                    </InfoCard>
                )}
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
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
        marginLeft: ms(12),
    },
    platformBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        paddingHorizontal: ms(10),
        paddingVertical: vs(5),
        borderRadius: ms(14),
        elevation: 1,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    platformBadgeText: {
        fontFamily: regular,
        fontSize: ms(10),
        color: '#6B7280',
        marginLeft: ms(5),
    },

    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(40),
    },

    // Profile Section
    profileSection: {
        alignItems: 'center',
        marginVertical: vs(20),
    },
    profileImageWrapper: {
        width: ms(90),
        height: ms(90),
        borderRadius: ms(45),
        borderWidth: 2,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: ms(45),
    },
    defaultProfileAvatar: {
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileName: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
        marginTop: vs(10),
    },
    profileRole: {
        fontFamily: bold,
        fontSize: ms(12),
        marginTop: vs(4),
    },

    // Info Card
    infoCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    cardLabel: {
        fontFamily: bold,
        fontSize: ms(11),
        color: '#6B7280',
        letterSpacing: 0.5,
    },
    cardDate: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#9CA3AF',
    },
    activityBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: ms(12),
        paddingVertical: vs(5),
        borderRadius: ms(14),
        marginBottom: vs(10),
    },
    activityBadgeText: {
        fontFamily: bold,
        fontSize: ms(11),
    },
    reportTypes: {
        fontFamily: regular,
        fontSize: ms(12),
        color: blackColor,
    },

    // Permission
    permissionLabel: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        marginBottom: vs(6),
    },
    permissionValue: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
    },

    // Basic Details
    basicDetailsTitle: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(8),
    },
    detailRow: {
        paddingVertical: vs(10),
    },
    // detailRowBorder: {
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#F3F4F6',
    // },
    detailLabel: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
        marginBottom: vs(4),
    },
    detailValue: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
    },
});

export default AccessDetailScreen;
