import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
    Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';

const DashedDivider = () => (
    <View style={{ height: 1, overflow: 'hidden', marginVertical: vs(8) }}>
        <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: '#DADADA' }} />
    </View>
);

const RescheduleAppointmentDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const appointment = route.params?.appointment || {};
    const [patient, setPatient] = useState(null);
    const [slotUnavailable, setSlotUnavailable] = useState(false);

    useEffect(() => {
        if (route.params?.patient) {
            setPatient(route.params.patient);
        }
    }, [route.params?.patient]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reschedule Appointment Details</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* Doctor Card */}
                <View style={styles.card}>
                    <View style={styles.doctorRow}>
                        <View style={styles.smallAvatarBg}>
                            <Icon type={Icons.MaterialIcons} name="person" size={ms(38)} color="#90CAF9" />
                        </View>
                        <View style={styles.doctorInfo}>
                            <Text style={styles.specialtyLabel}>{appointment.specialty || 'General Physician'}</Text>
                            <Text style={styles.doctorName}>{appointment.doctorName || 'Dr. Anil Sharma'}</Text>
                            <Text style={styles.doctorId}>ID:{appointment.appointmentId || '584684745'}</Text>
                        </View>
                        <View style={styles.ratingBlock}>
                            <View style={styles.ratingRow}>
                                <Icon type={Icons.MaterialIcons} name="star" size={ms(12)} color="#FFC107" />
                                <Text style={styles.ratingText}>{appointment.rating || '4.5'}</Text>
                            </View>
                            <Text style={styles.reviewsText}>86k Reviews</Text>
                        </View>
                    </View>
                </View>

                {/* Appointment Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Appointment Details</Text>
                    <View style={styles.rowBetween}>
                        <Text style={styles.appointmentDate}>{appointment.appointmentDateTime || 'Mon,17 Feb,2026, 11:30'}</Text>
                        <TouchableOpacity style={styles.changeDateBtn} onPress={() => navigation.goBack()}>
                            <Text style={styles.changeDateText}>Change Date</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Patient Details */}
                <View style={styles.card}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.sectionTitle}>Patient  Details</Text>
                        {!patient && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('PatientDetailsScreen', { appointment })}
                            >
                                <Text style={styles.addText}>ADD</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {patient && (
                        <View style={styles.patientBlock}>
                            <View style={styles.patientTopRow}>
                                <View style={styles.patientAvatarSmall}>
                                    <Icon type={Icons.MaterialIcons} name="person" size={ms(24)} color="#BDBDBD" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.patientName}>{patient.fullName}</Text>
                                    <Text style={styles.patientDob}>{patient.dob}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('PatientDetailsScreen', { appointment, patient })}
                                >
                                    <Text style={styles.addText}>Change</Text>
                                </TouchableOpacity>
                            </View>

                            <DashedDivider />
                            <View style={styles.patientDetailRow}>
                                <Text style={styles.detailLabel}>Gender</Text>
                                <Text style={styles.detailValue}>{patient.gender}</Text>
                            </View>
                            <View style={styles.patientDetailRow}>
                                <Text style={styles.detailLabel}>Mobile Number</Text>
                                <Text style={styles.detailValue}>{patient.mobile}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Price Breakdown */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Price Breakdown</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Consultation Fee</Text>
                        <Text style={styles.priceValue}>₹600</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Platform Fee</Text>
                        <Text style={styles.priceValue}>₹20</Text>
                    </View>
                    <DashedDivider />
                    <View style={styles.priceRow}>
                        <Text style={styles.priceTotalLabel}>Total Price</Text>
                        <Text style={styles.priceTotalValue}>₹620</Text>
                    </View>
                </View>

                {/* Policies */}
                <View style={styles.policyCard}>
                    <Text style={styles.sectionTitle}>Policies</Text>
                    <TouchableOpacity>
                        <Text style={styles.policyLink}>Cancellation Policies Information</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: vs(100) }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <PrimaryButton
                    title="Pay ₹620"
                    onPress={() => navigation.navigate('PaymentSuccessScreen', {
                        doctor: {
                            name: appointment.doctorName,
                            specialty: appointment.specialty,
                            rating: appointment.rating,
                        },
                        selectedSlot: '11:30',
                        selectedDate: 'Mon, 17 Feb, 2026',
                        patient,
                    })}
                    style={{ marginTop: 0 }}
                />
                <Text style={styles.secureText}>Your booking is secure and confidential</Text>
            </View>

            {/* Slot Unavailable Modal */}
            <Modal
                visible={slotUnavailable}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSlotUnavailable(false)}
            >
                <View style={styles.slotOverlay}>
                    <View style={styles.slotPopup}>
                        <TouchableOpacity
                            style={styles.slotCloseBtn}
                            onPress={() => setSlotUnavailable(false)}
                        >
                            <Icon type={Icons.Ionicons} name="close" size={ms(20)} color="#555" />
                        </TouchableOpacity>

                        <View style={styles.slotIconWrap}>
                            <Icon type={Icons.MaterialIcons} name="event-busy" size={ms(60)} color={primaryColor} />
                        </View>

                        <Text style={styles.slotTitle}>Slot Unavailable</Text>
                        <Text style={styles.slotMessage}>
                            The selected date and time are{'\n'}no longer available. Please choose a different slot.
                        </Text>

                        <TouchableOpacity
                            style={styles.slotChangeBtn}
                            onPress={() => {
                                setSlotUnavailable(false);
                                navigation.goBack();
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.slotChangeBtnText}>Change Date & Time</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default RescheduleAppointmentDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        paddingTop: ms(48),
        paddingBottom: ms(12),
    },
    backBtn: {
        marginRight: ms(12),
    },
    headerTitle: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
    },

    scroll: {
        paddingHorizontal: ms(16),
        paddingTop: vs(14),
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(14),
        marginBottom: vs(10),
    },

    // Doctor row
    doctorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallAvatarBg: {
        width: ms(56),
        height: ms(56),
        borderRadius: ms(8),
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
    },
    doctorInfo: {
        flex: 1,
    },
    specialtyLabel: {
        fontSize: ms(10),
        color: '#888',
        marginBottom: vs(2),
    },
    doctorName: {
        fontSize: ms(13),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(2),
    },
    doctorId: {
        fontSize: ms(10),
        color: '#888',
    },
    ratingBlock: {
        alignItems: 'flex-end',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(2),
    },
    ratingText: {
        fontSize: ms(11),
        fontWeight: '600',
        color: blackColor,
    },
    reviewsText: {
        fontSize: ms(9),
        color: '#999',
        marginTop: vs(2),
    },

    // Section title
    sectionTitle: {
        fontSize: ms(13),
        fontWeight: '500',
        color: blackColor,
        marginBottom: vs(10),
    },

    // Appointment
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    appointmentDate: {
        fontSize: ms(12),
        color: '#444',
        fontWeight: '500',
    },
    changeDateBtn: {
        paddingHorizontal: ms(12),
        paddingVertical: vs(5),
        borderRadius: ms(20),
        borderWidth: 1,
        borderColor: primaryColor,
    },
    changeDateText: {
        fontSize: ms(11),
        color: primaryColor,
        fontWeight: '500',
    },

    // Patient
    addText: {
        fontSize: ms(13),
        color: primaryColor,
        fontWeight: '700',
    },
    patientBlock: {
        marginTop: vs(4),
    },
    patientTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
        marginBottom: vs(10),
    },
    patientAvatarSmall: {
        width: ms(38),
        height: ms(38),
        borderRadius: ms(19),
        backgroundColor: '#F1F1F1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    patientName: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },
    patientDob: {
        fontSize: ms(11),
        color: '#888',
    },
    patientDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: vs(4),
    },
    detailLabel: {
        fontSize: ms(12),
        color: '#888',
    },
    detailValue: {
        fontSize: ms(12),
        color: blackColor,
        fontWeight: '500',
    },

    // Price
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: vs(4),
    },
    priceLabel: {
        fontSize: ms(12),
        color: '#555',
    },
    priceValue: {
        fontSize: ms(12),
        color: blackColor,
        fontWeight: '500',
    },
    priceTotalLabel: {
        fontSize: ms(13),
        fontWeight: '700',
        color: blackColor,
    },
    priceTotalValue: {
        fontSize: ms(13),
        fontWeight: '700',
        color: blackColor,
    },

    // Policies
    policyLink: {
        fontSize: ms(12),
        color: '#3B82F6',
        fontWeight: '400',
    },
    policyCard: {
        borderRadius: ms(12),
        padding: ms(14),
        marginBottom: vs(10),
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: ms(16),
        paddingBottom: vs(25),
        paddingTop: vs(10),
    },
    secureText: {
        textAlign: 'center',
        fontSize: ms(11),
        color: '#999',
        marginTop: vs(6),
    },

    // Slot Unavailable Modal
    slotOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    slotPopup: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        paddingHorizontal: ms(24),
        paddingVertical: vs(24),
        alignItems: 'center',
        marginHorizontal: ms(30),
        width: '85%',
    },
    slotCloseBtn: {
        position: 'absolute',
        top: ms(12),
        right: ms(12),
        zIndex: 1,
    },
    slotIconWrap: {
        marginBottom: vs(16),
        marginTop: vs(8),
    },
    slotTitle: {
        fontSize: ms(16),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(8),
    },
    slotMessage: {
        fontSize: ms(13),
        color: '#666',
        textAlign: 'center',
        lineHeight: ms(20),
        marginBottom: vs(20),
    },
    slotChangeBtn: {
        borderWidth: 1.5,
        borderColor: primaryColor,
        borderRadius: ms(25),
        paddingVertical: vs(12),
        paddingHorizontal: ms(30),
        width: '100%',
        alignItems: 'center',
    },
    slotChangeBtnText: {
        fontSize: ms(14),
        fontWeight: '600',
        color: primaryColor,
    },
});
