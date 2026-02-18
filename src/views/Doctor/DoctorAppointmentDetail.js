import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const STATUS_STYLE = {
    Confirmed: { bg: '#4CAF50', color: '#fff' },
    Completed: { bg: '#388E3C', color: '#fff' },
    Cancelled: { bg: '#FFCDD2', color: '#E53935' },
};

// ── Section wrapper ────────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

// ── Info row (label + value in same row) ──────────────────────────────────────
const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

// ── Doctor mini card ──────────────────────────────────────────────────────────
const DoctorMini = ({ name, specialty, rating }) => (
    <View>
        <View style={styles.doctorRow}>
            <Text style={styles.doctorName}>{name}</Text>
            <View style={styles.ratingRow}>
                <Icon type={Icons.Ionicons} name="star" color="#FFB300" size={ms(13)} />
                <Text style={styles.ratingText}>{rating}</Text>
            </View>
        </View>
        <Text style={styles.doctorSpecialty}>{specialty}</Text>
    </View>
);

// ── Main Screen ────────────────────────────────────────────────────────────────
const DoctorAppointmentDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const appointment = route.params?.appointment || {};

    const statusStyle = STATUS_STYLE[appointment.status] || STATUS_STYLE.Confirmed;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(22)} color={blackColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{appointment.doctorName}</Text>
                <Text style={styles.headerDate}>{appointment.date}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* Appointment ID + Status */}
                <View style={styles.idRow}>
                    <Text style={styles.appointmentId}>Appointment ID : {appointment.appointmentId}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{appointment.status}</Text>
                    </View>
                </View>

                {/* <View style={styles.divider} /> */}

                {/* Appointment Date & Time */}
                <Section title="Appointment Date & Time">
                    <Text style={styles.sectionContent}>{appointment.appointmentDateTime}</Text>
                </Section>

                {/* <View style={styles.divider} /> */}

                {/* Doctor Details */}
                <Section title="Doctor Details">
                    <DoctorMini
                        name={appointment.doctorName}
                        specialty={appointment.specialty}
                        rating={appointment.rating}
                    />
                </Section>


                {/* Patient Details */}
                <Section title="Patient  Details">
                    <DoctorMini
                        name={appointment.doctorName}
                        specialty={appointment.specialty}
                        rating={appointment.rating}
                    />
                </Section>


                {/* Consultation Details */}
                <Section title="Consultation Details">
                    <Text style={styles.consultLabel}>Consultation Type</Text>
                    <Text style={styles.consultValue}>{appointment.consultationType}</Text>
                    <Text style={[styles.consultLabel, { marginTop: vs(8) }]}>Consultation Address</Text>
                    <Text style={styles.consultValue}>{appointment.consultationAddress}</Text>
                </Section>


                {/* Payment Details */}
                <Section title="Payment Details">
                    <InfoRow label="Amount Paid" value={appointment.amountPaid} />
                    <InfoRow label="Payment via" value={appointment.paymentVia} />
                    <InfoRow label="Transaction ID" value={appointment.transactionId} />
                </Section>


                {/* Note */}
                <View style={styles.noteSection}>
                    <Text style={styles.noteLabel}>Note :</Text>
                    <Text style={styles.noteText}>
                        This appointment is non-refundable. No refund will be issued upon cancellation.
                    </Text>
                </View>

                <View style={{ height: vs(20) }} />
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.bottomBtns}>
                <TouchableOpacity style={styles.directionBtn} activeOpacity={0.8}>
                    <Icon type={Icons.Ionicons} name="navigate" color={primaryColor} size={ms(18)} />
                    <Text style={styles.directionBtnText}>Direction</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8}>
                    <Text style={styles.cancelText}>Cancel Appointment</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default DoctorAppointmentDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(12),
    },
    backBtn: {
        marginRight: ms(10),
        width: ms(30),
        alignItems: 'flex-start',
    },
    headerTitle: {
        flex: 1,
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
    },
    headerDate: {
        fontSize: ms(11),
        color: '#888',
    },

    scroll: {
        paddingBottom: vs(20),
    },

    // ID row
    idRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(16),
        paddingVertical: vs(12),
    },
    appointmentId: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
        flex: 1,
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

    divider: {
        height: vs(8),
        backgroundColor: '#F3F4F6',
    },

    // Section
    section: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(14),
    },
    sectionTitle: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(8),
    },
    sectionContent: {
        fontSize: ms(14),
        color: '#444',
    },

    // Doctor mini
    doctorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    doctorName: {
        fontSize: ms(14),
        fontWeight: '600',
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
    doctorSpecialty: {
        fontSize: ms(12),
        color: '#777',
        marginTop: vs(2),
    },

    // Consultation
    consultLabel: {
        fontSize: ms(13),
        color: '#777',
        marginBottom: vs(2),
    },
    consultValue: {
        fontSize: ms(14),
        color: '#444',
    },

    // Info row
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(4),
    },
    infoLabel: {
        fontSize: ms(13),
        color: '#777',
    },
    infoValue: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
    },

    // Note
    noteSection: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(14),
    },
    noteLabel: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(4),
    },
    noteText: {
        fontSize: ms(13),
        color: '#666',
        lineHeight: ms(20),
    },

    // Bottom buttons
    bottomBtns: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(25),
        paddingTop: vs(12),
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: vs(12),
        backgroundColor: whiteColor,
        alignItems: 'center',
    },
    directionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: ms(8),
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: ms(30),
        paddingVertical: vs(12),
        paddingHorizontal: ms(40),
        width: '100%',
    },
    directionBtnText: {
        fontSize: ms(14),
        color: blackColor,
        fontWeight: '500',
    },
    cancelText: {
        fontSize: ms(14),
        color: '#E53935',
        fontWeight: '600',
    },
});
