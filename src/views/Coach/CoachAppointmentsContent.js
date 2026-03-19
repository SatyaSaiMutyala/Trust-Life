import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import { heading, interMedium, interRegular } from '../../config/Constants';

const TABS = ['All', 'Current', 'Completed', 'Cancelled'];

const STATUS_STYLE = {
    Confirmed: { bg: '#4CAF50', color: '#fff' },
    Completed: { bg: '#388E3C', color: '#fff' },
    Cancelled: { bg: '#FFCDD2', color: '#E53935' },
};

const MOCK_COACH_APPOINTMENTS = [
    {
        id: '1',
        status: 'Confirmed',
        date: '17 Feb 2026, 10:00',
        doctorName: 'Ramesh Kumar',
        rating: 4.5,
        specialty: 'Gym Coach',
        address: 'FitZone Gym, Kondapur, Hyderabad...',
        amountPaid: '₹850',
        appointmentId: '#C8326453845',
        appointmentDateTime: '10:00, Mon, 17 Feb, 2026',
        consultationType: 'In-Person',
        consultationAddress: 'FitZone Gym, Plot 23, Kondapur, Hyderabad - 500084',
        paymentVia: 'Google Pay',
        transactionId: '9473853609701',
    },
    {
        id: '2',
        status: 'Completed',
        date: '10 Feb 2026, 09:00',
        doctorName: 'Susheel Varma',
        rating: 4.8,
        specialty: 'Nutrition Coach',
        address: 'WellnessHub, Banjara Hills, Hydera...',
        amountPaid: '₹700',
        appointmentId: '#C8326453846',
        appointmentDateTime: '09:00, Tue, 10 Feb, 2026',
        consultationType: 'Online',
        consultationAddress: 'Online Session via App',
        paymentVia: 'Phone Pay',
        transactionId: '9473853609702',
    },
    {
        id: '3',
        status: 'Cancelled',
        date: '05 Feb 2026, 11:30',
        doctorName: 'Rahul Kumar',
        rating: 4.3,
        specialty: 'Fitness Coach',
        address: '',
        amountPaid: '₹600',
        appointmentId: '#C8326453847',
        appointmentDateTime: '11:30, Thu, 05 Feb, 2026',
        consultationType: 'In-Person',
        consultationAddress: 'ActiveLife Studio, Madhapur, Hyderabad - 500081',
        paymentVia: 'UPI',
        transactionId: '9473853609703',
    },
];

const AppointmentCard = ({ item }) => {
    const navigation = useNavigation();
    const statusStyle = STATUS_STYLE[item.status] || STATUS_STYLE.Confirmed;

    const handleViewDetails = () => {
        navigation.navigate('CoachAppointmentDetail', { appointment: item });
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardTopRow}>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status}</Text>
                </View>
                <Text style={styles.cardDate}>{item.date}</Text>
            </View>

            <View style={styles.coachRow}>
                <Text style={styles.coachName}>{item.doctorName}</Text>
                <View style={styles.ratingRow}>
                    <Icon type={Icons.Ionicons} name="star" color="#FFB300" size={ms(13)} />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>

            <Text style={styles.specialty}>{item.specialty}</Text>

            {!!item.address && (
                <View style={styles.addressSection}>
                    <Text style={styles.addressLabel}>Session Address</Text>
                    <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
                </View>
            )}

            <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Amount Paid</Text>
                <Text style={styles.amountValue}>{item.amountPaid}</Text>
            </View>

            {item.status === 'Confirmed' && (
                <TouchableOpacity style={styles.outlineBtn} onPress={handleViewDetails} activeOpacity={0.8}>
                    <Text style={styles.outlineBtnText}>View Details</Text>
                </TouchableOpacity>
            )}
            {item.status === 'Completed' && (
                <TouchableOpacity style={styles.filledBtn} onPress={handleViewDetails} activeOpacity={0.8}>
                    <Text style={styles.filledBtnText}>Reschedule Session</Text>
                </TouchableOpacity>
            )}
            {item.status === 'Cancelled' && (
                <TouchableOpacity style={styles.filledBtn} onPress={handleViewDetails} activeOpacity={0.8}>
                    <Text style={styles.filledBtnText}>Book Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const CoachAppointmentsContent = () => {
    const [activeTab, setActiveTab] = useState('All');

    const filtered = MOCK_COACH_APPOINTMENTS.filter((a) => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Current') return a.status === 'Confirmed';
        return a.status === activeTab;
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Coach Sessions</Text>
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
                        <Text style={styles.emptyText}>No sessions found</Text>
                    </View>
                }
            />
        </View>
    );
};

export default CoachAppointmentsContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    header: {
        paddingHorizontal: ms(16),
        paddingTop: ms(50),
        paddingBottom: vs(15),
    },
    headerTitle: {
        fontSize: ms(20),
        fontFamily: interMedium,
        color: blackColor,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'center',
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
        fontFamily: interMedium,
    },
    tabLabelActive: {
        color: primaryColor,
        fontFamily: interMedium,
    },
    tabUnderline: {
        position: 'absolute',
        bottom: 0,
        left: ms(12),
        right: ms(12),
        height: 3,
        backgroundColor: primaryColor,
        borderRadius: 2,
    },
    tabDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: vs(10),
    },
    listContent: {
        paddingHorizontal: ms(14),
        paddingBottom: vs(20),
        gap: vs(12),
    },
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(14),
        marginTop: ms(10),
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
        fontFamily: interMedium,
    },
    cardDate: {
        fontSize: ms(11),
        color: '#888',
    },
    coachRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(2),
    },
    coachName: {
        fontSize: ms(14),
        fontFamily: interMedium,
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
        fontFamily: interMedium,
    },
    specialty: {
        fontSize: ms(12),
        color: '#666',
        marginBottom: vs(6),
    },
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
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    amountLabel: {
        fontSize: ms(13),
        color: '#555',
        fontFamily: interMedium,
    },
    amountValue: {
        fontSize: ms(14),
        fontFamily: interMedium,
        color: blackColor,
    },
    outlineBtn: {
        borderRadius: ms(18),
        paddingVertical: vs(10),
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
    },
    outlineBtnText: {
        fontSize: ms(13),
        color: blackColor,
        fontFamily: interMedium,
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
        fontFamily: interMedium,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: vs(80),
    },
    emptyText: {
        fontSize: ms(14),
        color: '#999',
    },
});
