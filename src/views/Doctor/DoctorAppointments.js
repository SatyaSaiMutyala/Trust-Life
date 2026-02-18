import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import StandaloneBottomBar from '../../components/BottomNavBar/StandaloneBottomBar';

// ── Constants ─────────────────────────────────────────────────────────────────
const TABS = ['All', 'Current', 'Completed', 'Cancelled'];

const STATUS_STYLE = {
    Confirmed: { bg: '#4CAF50', color: '#fff' },
    Completed: { bg: '#388E3C', color: '#fff' },
    Cancelled: { bg: '#FFCDD2', color: '#E53935' },
};

const MOCK_APPOINTMENTS = [
    {
        id: '1',
        status: 'Confirmed',
        date: '17 Feb 2026,12:30',
        doctorName: 'Dr. Anil Sharma',
        rating: 4.5,
        specialty: 'General Physician',
        address: '9-547/77/67 Beside Metro station Prakash Nagar ,Hydera...',
        amountPaid: '₹620',
        appointmentId: '#7326453845',
        appointmentDateTime: '11:30, Mon,17 Feb,2026',
        consultationType: 'Clinic',
        consultationAddress: 'Prakash Health Clinic, 9-547/77/67 Beside Metro Station, Prakash Nagar, Hyderabad',
        paymentVia: 'Phone pay',
        transactionId: '8373753609606',
    },
    {
        id: '2',
        status: 'Completed',
        date: '17 Feb 2026,12:30',
        doctorName: 'Dr. Anil Sharma',
        rating: 4.5,
        specialty: 'General Physician',
        address: '9-547/77/67 Beside Metro station Prakash Nagar ,Hydera...',
        amountPaid: '₹620',
        appointmentId: '#7326453846',
        appointmentDateTime: '11:30, Mon,17 Feb,2026',
        consultationType: 'Clinic',
        consultationAddress: 'Prakash Health Clinic, 9-547/77/67 Beside Metro Station, Prakash Nagar, Hyderabad',
        paymentVia: 'Phone pay',
        transactionId: '8373753609607',
    },
    {
        id: '3',
        status: 'Cancelled',
        date: '17 Feb 2026,12:30',
        doctorName: 'Dr. Anil Sharma',
        rating: 4.5,
        specialty: 'General Physician',
        address: '',
        amountPaid: '₹620',
        appointmentId: '#7326453847',
        appointmentDateTime: '11:30, Mon,17 Feb,2026',
        consultationType: 'Clinic',
        consultationAddress: 'Prakash Health Clinic, 9-547/77/67 Beside Metro Station, Prakash Nagar, Hyderabad',
        paymentVia: 'Phone pay',
        transactionId: '8373753609608',
    },
];

// ── AppointmentCard ────────────────────────────────────────────────────────────
const AppointmentCard = ({ item }) => {
    const navigation = useNavigation();
    const statusStyle = STATUS_STYLE[item.status] || STATUS_STYLE.Confirmed;

    const handleViewDetails = () => {
        navigation.navigate('DoctorAppointmentDetail', { appointment: item });
    };

    return (
        <View style={styles.card}>
            {/* Top row: status badge + date */}
            <View style={styles.cardTopRow}>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status}</Text>
                </View>
                <Text style={styles.cardDate}>{item.date}</Text>
            </View>

            {/* Doctor name + rating */}
            <View style={styles.doctorRow}>
                <Text style={styles.doctorName}>{item.doctorName}</Text>
                <View style={styles.ratingRow}>
                    <Icon type={Icons.Ionicons} name="star" color="#FFB300" size={ms(13)} />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>

            {/* Specialty */}
            <Text style={styles.specialty}>{item.specialty}</Text>

            {/* Address (if available) */}
            {!!item.address && (
                <View style={styles.addressSection}>
                    <Text style={styles.addressLabel}>Clinic Address</Text>
                    <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
                </View>
            )}

            {/* Amount paid */}
            <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Amount Paid</Text>
                <Text style={styles.amountValue}>{item.amountPaid}</Text>
            </View>

            {/* Action button */}
            {item.status === 'Confirmed' && (
                <TouchableOpacity style={styles.outlineBtn} onPress={handleViewDetails} activeOpacity={0.8}>
                    <Text style={styles.outlineBtnText}>View Details</Text>
                </TouchableOpacity>
            )}
            {item.status === 'Completed' && (
                <TouchableOpacity style={styles.filledBtn} activeOpacity={0.8}>
                    <Text style={styles.filledBtnText}>Reschedule appointment</Text>
                </TouchableOpacity>
            )}
            {item.status === 'Cancelled' && (
                <TouchableOpacity style={styles.filledBtn} activeOpacity={0.8}>
                    <Text style={styles.filledBtnText}>Book Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// ── Main Screen ────────────────────────────────────────────────────────────────
const DoctorAppointments = () => {
    const [activeTab, setActiveTab] = useState('All');

    const filtered = MOCK_APPOINTMENTS.filter((a) => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Current') return a.status === 'Confirmed';
        return a.status === activeTab;
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Doctor Appointments</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={styles.tabItem}
                        onPress={() => setActiveTab(tab)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
                            {tab}
                        </Text>
                        {activeTab === tab && <View style={styles.tabUnderline} />}
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.tabDivider} />

            {/* List */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <AppointmentCard item={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No appointments found</Text>
                    </View>
                }
            />

            {/* Bottom Nav */}
            <StandaloneBottomBar activeTab="appointments" />
        </SafeAreaView>
    );
};

export default DoctorAppointments;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },

    // Header
    header: {
        paddingHorizontal: ms(16),
        paddingTop: ms(50),
        paddingBottom: vs(15),
    },
    headerTitle: {
        fontSize: ms(20),
        fontWeight: 'bold',
        color: blackColor,
    },

    // Tabs
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: ms(10),
    },
    tabItem: {
        alignItems: 'center',
        paddingHorizontal: ms(12),
        paddingBottom: vs(8),
    },
    tabLabel: {
        fontSize: ms(13),
        color: '#888',
        fontWeight: '500',
    },
    tabLabelActive: {
        color: primaryColor,
        fontWeight: '700',
    },
    tabUnderline: {
        position: 'absolute',
        bottom: 0,
        left: ms(12),
        right: ms(12),
        height: 2,
        backgroundColor: primaryColor,
        borderRadius: 2,
    },
    tabDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: vs(10),
    },

    // List
    listContent: {
        paddingHorizontal: ms(14),
        paddingBottom: vs(20),
        gap: vs(12),
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(14),
        marginTop: ms(10),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(8),
    },
    statusBadge: {
        borderRadius: ms(20),
        paddingHorizontal: ms(12),
        paddingVertical: vs(3),
    },
    statusText: {
        fontSize: ms(12),
        fontWeight: '600',
    },
    cardDate: {
        fontSize: ms(11),
        color: '#888',
    },

    // Doctor row
    doctorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(2),
    },
    doctorName: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: blackColor,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(3),
    },
    ratingText: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '600',
    },
    specialty: {
        fontSize: ms(12),
        color: '#666',
        marginBottom: vs(6),
    },

    // Address
    addressSection: {
        marginBottom: vs(6),
    },
    addressLabel: {
        fontSize: ms(11),
        color: '#999',
        marginBottom: vs(1),
    },
    addressText: {
        fontSize: ms(12),
        color: '#555',
    },

    // Amount
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    amountLabel: {
        fontSize: ms(13),
        color: '#555',
        fontWeight: '500',
    },
    amountValue: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: blackColor,
    },

    // Buttons
    outlineBtn: {
        borderRadius: ms(18),
        paddingVertical: vs(10),
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
    },
    outlineBtnText: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
    },
    filledBtn: {
        borderRadius: ms(18),
        backgroundColor: primaryColor,
        paddingVertical: vs(10),
        alignItems: 'center',
    },
    filledBtnText: {
        fontSize: ms(13),
        color: whiteColor,
        fontWeight: '600',
    },

    // Empty
    emptyContainer: {
        alignItems: 'center',
        paddingTop: vs(80),
    },
    emptyText: {
        fontSize: ms(14),
        color: '#999',
    },
});
