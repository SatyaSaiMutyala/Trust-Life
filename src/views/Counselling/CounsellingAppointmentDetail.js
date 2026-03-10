import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
    Pressable,
    TextInput,
    Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const STATUS_STYLE = {
    Confirmed: { bg: '#E8F5E9', color: '#4CAF50' },
    Completed: { bg: '#E8F5E9', color: '#388E3C' },
    Cancelled: { bg: '#FFCDD2', color: '#E53935' },
};

const CANCEL_REASONS = [
    'Change in Session Type',
    'Counsellor Not Available',
    'Booked by Mistake',
    'Schedule Conflict',
    'Found Another Counsellor',
    'Financial Reason',
];

const SectionCard = ({ title, children }) => (
    <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

const CounsellorMini = ({ name, specialty, rating }) => (
    <View>
        <View style={styles.counsellorRow}>
            <Text style={styles.counsellorName}>{name}</Text>
            <View style={styles.ratingRow}>
                <Icon type={Icons.Ionicons} name="star" color="#FFB300" size={ms(14)} />
                <Text style={styles.ratingText}>{rating}</Text>
            </View>
        </View>
        <Text style={styles.counsellorSpecialty}>{specialty}</Text>
    </View>
);

const PaymentRow = ({ label, value, isLast }) => (
    <View style={[styles.paymentRow, !isLast && styles.paymentRowBorder]}>
        <Text style={styles.paymentLabel}>{label}</Text>
        <Text style={styles.paymentValue}>{value}</Text>
    </View>
);

const StarRating = ({ rating, setRating }) => (
    <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}>
                <Icon
                    type={Icons.Ionicons}
                    name={i <= rating ? 'star' : 'star-outline'}
                    color={i <= rating ? '#FFB300' : '#D1D5DB'}
                    size={ms(24)}
                />
            </TouchableOpacity>
        ))}
    </View>
);

const CounsellingAppointmentDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const appointment = route.params?.appointment || {};
    const [cancelModal, setCancelModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null);
    const [feedbackRating, setFeedbackRating] = useState(1);
    const [feedbackModal, setFeedbackModal] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    const isConfirmed = appointment.status === 'Confirmed';
    const isCompleted = appointment.status === 'Completed';
    const statusStyle = STATUS_STYLE[appointment.status] || STATUS_STYLE.Confirmed;

    const handleSubmitFeedback = () => {
        setFeedbackModal(false);
        setFeedbackSuccess(true);
        setTimeout(() => {
            setFeedbackSuccess(false);
            navigation.goBack();
        }, 2000);
    };

    const handleCancelSession = () => {
        setCancelModal(false);
        setSelectedReason(null);
        navigation.navigate('SuccessScreen', {
            title: 'Successfully',
            subtitle: 'Session Cancelled',
            type: 'cancel',
            targetScreen: 'CounsellingScreen',
            delay: 2000,
        });
    };

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

                {isConfirmed && (
                    <View style={styles.idRow}>
                        <Text style={styles.appointmentId}>Session ID: {appointment.appointmentId}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                            <Text style={[styles.statusText, { color: statusStyle.color }]}>{appointment.status}</Text>
                        </View>
                    </View>
                )}

                {isCompleted && (
                    <View style={styles.completedHeader}>
                        <Text style={styles.completedStatusText}>Completed</Text>
                        <Text style={styles.completedMessage}>
                            Thanks for your session! Your counselling session has been successfully completed.
                        </Text>
                        <Text style={styles.completedId}>Session ID: {appointment.appointmentId}</Text>
                    </View>
                )}

                <SectionCard title="Session Date & Time">
                    <Text style={styles.sectionContent}>{appointment.appointmentDateTime}</Text>
                </SectionCard>

                <SectionCard title="Counsellor Details">
                    <CounsellorMini
                        name={appointment.doctorName}
                        specialty={appointment.specialty}
                        rating={appointment.rating}
                    />
                </SectionCard>

                <SectionCard title="Patient Details">
                    <CounsellorMini
                        name={appointment.doctorName}
                        specialty={appointment.specialty}
                        rating={appointment.rating}
                    />
                </SectionCard>

                <SectionCard title="Session Details">
                    <Text style={styles.consultLabel}>Session Type</Text>
                    <Text style={styles.consultValue}>{appointment.consultationType}</Text>
                    <Text style={[styles.consultLabel, { marginTop: vs(12) }]}>Session Address</Text>
                    <Text style={styles.consultValue}>{appointment.consultationAddress}</Text>
                </SectionCard>

                <SectionCard title="Payment Details">
                    <PaymentRow label="Amount Paid" value={appointment.amountPaid} />
                    <PaymentRow label="Payment via" value={appointment.paymentVia} />
                    <PaymentRow label="Transaction ID" value={appointment.transactionId} isLast />
                </SectionCard>

                {isCompleted && (
                    <SectionCard title="Feedback">
                        <Text style={styles.feedbackLabel}>Rate {appointment.doctorName}</Text>
                        <StarRating rating={feedbackRating} setRating={setFeedbackRating} />
                    </SectionCard>
                )}

                {isConfirmed && (
                    <View style={styles.noteSection}>
                        <Text style={styles.noteLabel}>Note :</Text>
                        <Text style={styles.noteText}>
                            This session is non-refundable. No refund will be issued upon cancellation.
                        </Text>
                    </View>
                )}

                <View style={{ height: vs(20) }} />
            </ScrollView>

            {isConfirmed && (
                <View style={styles.bottomBtns}>
                    <TouchableOpacity style={styles.directionBtn} activeOpacity={0.8}>
                        <Icon type={Icons.Ionicons} name="navigate" color={primaryColor} size={ms(18)} />
                        <Text style={styles.directionBtnText}>Direction</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setCancelModal(true)}>
                        <Text style={styles.cancelText}>Cancel Session</Text>
                    </TouchableOpacity>
                </View>
            )}

            {isCompleted && (
                <View style={styles.bottomBtns}>
                    <TouchableOpacity style={styles.rescheduleBtn} activeOpacity={0.8} onPress={() => setFeedbackModal(true)}>
                        <Text style={styles.rescheduleBtnText}>Reschedule Session</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Feedback Bottom Sheet */}
            <Modal visible={feedbackModal} animationType="slide" transparent={true} onRequestClose={() => setFeedbackModal(false)}>
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setFeedbackModal(false)} />
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Feedback</Text>
                            <TouchableOpacity onPress={() => setFeedbackModal(false)} style={styles.sheetCloseBtn}>
                                <Icon type={Icons.Ionicons} name="close" size={ms(20)} color="#888" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.feedbackLabel}>Rate {appointment.doctorName}</Text>
                        <StarRating rating={feedbackRating} setRating={setFeedbackRating} />
                        <Text style={[styles.feedbackLabel, { marginTop: vs(20) }]}>Description</Text>
                        <TextInput
                            style={styles.feedbackInput}
                            placeholder="Describe your experience"
                            placeholderTextColor="#AAA"
                            multiline
                            value={feedbackText}
                            onChangeText={setFeedbackText}
                        />
                        <TouchableOpacity style={styles.submitFeedbackBtn} onPress={handleSubmitFeedback} activeOpacity={0.8}>
                            <Text style={styles.submitFeedbackBtnText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Feedback Success Popup */}
            <Modal visible={feedbackSuccess} transparent={true} animationType="fade">
                <View style={styles.successOverlay}>
                    <View style={styles.successPopup}>
                        <Image
                            source={require('../../assets/img/checkMark.png')}
                            style={styles.successCheckImage}
                            resizeMode="contain"
                        />
                        <View style={styles.successRatingRow}>
                            <Icon type={Icons.Ionicons} name="star" color="#FFB300" size={ms(16)} />
                            <Text style={styles.successRatingText}>{feedbackRating}.0</Text>
                        </View>
                        <Text style={styles.successThankText}>Thank You For Feedback</Text>
                    </View>
                </View>
            </Modal>

            {/* Cancel Reason Bottom Sheet */}
            <Modal visible={cancelModal} animationType="slide" transparent={true} onRequestClose={() => setCancelModal(false)}>
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setCancelModal(false)} />
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Reason for cancellation</Text>
                            <TouchableOpacity onPress={() => setCancelModal(false)} style={styles.sheetCloseBtn}>
                                <Icon type={Icons.Ionicons} name="close" size={ms(20)} color="#888" />
                            </TouchableOpacity>
                        </View>
                        {CANCEL_REASONS.map((reason, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.reasonRow}
                                onPress={() => setSelectedReason(reason)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.reasonText}>{reason}</Text>
                                <View style={[styles.radio, selectedReason === reason && styles.radioSelected]}>
                                    {selectedReason === reason && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[styles.cancelBtn, !selectedReason && { opacity: 0.5 }]}
                            onPress={handleCancelSession}
                            disabled={!selectedReason}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelBtnText}>Cancel Session</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default CounsellingAppointmentDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
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
        paddingHorizontal: ms(16),
        paddingBottom: vs(20),
    },
    idRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: vs(16),
    },
    appointmentId: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
        flex: 1,
    },
    statusBadge: {
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: vs(5),
    },
    statusText: {
        fontSize: ms(12),
        fontWeight: '600',
    },
    sectionCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(16),
        marginBottom: vs(12),
    },
    sectionTitle: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(10),
    },
    sectionContent: {
        fontSize: ms(14),
        color: '#444',
    },
    counsellorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    counsellorName: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
    },
    ratingText: {
        fontSize: ms(14),
        color: blackColor,
        fontWeight: '600',
    },
    counsellorSpecialty: {
        fontSize: ms(12),
        color: '#777',
        marginTop: vs(3),
    },
    consultLabel: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(3),
    },
    consultValue: {
        fontSize: ms(13),
        color: '#555',
        lineHeight: ms(20),
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(10),
    },
    paymentRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    paymentLabel: {
        fontSize: ms(13),
        color: '#777',
    },
    paymentValue: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
    },
    noteSection: {
        paddingVertical: vs(14),
    },
    noteLabel: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(6),
    },
    noteText: {
        fontSize: ms(13),
        color: '#666',
        lineHeight: ms(20),
    },
    bottomBtns: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(25),
        paddingTop: vs(12),
        gap: vs(12),
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
        width: '100%',
        backgroundColor: '#EFF6FF',
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
    completedHeader: {
        alignItems: 'center',
        paddingVertical: vs(16),
    },
    completedStatusText: {
        fontSize: ms(16),
        fontWeight: '700',
        color: '#4CAF50',
        marginBottom: vs(8),
    },
    completedMessage: {
        fontSize: ms(13),
        color: '#555',
        textAlign: 'center',
        lineHeight: ms(20),
        marginBottom: vs(10),
        paddingHorizontal: ms(10),
    },
    completedId: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
    },
    feedbackLabel: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
        marginBottom: vs(8),
    },
    starsRow: {
        flexDirection: 'row',
        gap: ms(6),
    },
    rescheduleBtn: {
        backgroundColor: primaryColor,
        borderRadius: ms(30),
        paddingVertical: vs(14),
        alignItems: 'center',
        width: '100%',
    },
    rescheduleBtnText: {
        fontSize: ms(15),
        fontWeight: '700',
        color: whiteColor,
    },
    feedbackInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: ms(10),
        padding: ms(12),
        fontSize: ms(13),
        color: blackColor,
        minHeight: vs(80),
        textAlignVertical: 'top',
        marginTop: vs(8),
        backgroundColor: '#F9FAFB',
    },
    submitFeedbackBtn: {
        backgroundColor: primaryColor,
        borderRadius: ms(12),
        paddingVertical: vs(14),
        alignItems: 'center',
        marginTop: vs(20),
    },
    submitFeedbackBtnText: {
        fontSize: ms(15),
        fontWeight: '700',
        color: whiteColor,
    },
    successOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    successPopup: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        paddingHorizontal: ms(40),
        paddingVertical: vs(30),
        alignItems: 'center',
    },
    successCheckImage: {
        width: ms(60),
        height: ms(60),
        marginBottom: vs(12),
    },
    successRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
        marginBottom: vs(8),
    },
    successRatingText: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
    },
    successThankText: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomSheet: {
        backgroundColor: whiteColor,
        borderTopLeftRadius: ms(20),
        borderTopRightRadius: ms(20),
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
        paddingTop: vs(16),
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(16),
    },
    sheetTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    sheetCloseBtn: {
        width: ms(32),
        height: ms(32),
        borderRadius: ms(16),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reasonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: vs(14),
    },
    reasonText: {
        fontSize: ms(14),
        color: blackColor,
        fontWeight: '500',
        flex: 1,
    },
    radio: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(11),
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: primaryColor,
    },
    radioInner: {
        width: ms(12),
        height: ms(12),
        borderRadius: ms(6),
        backgroundColor: primaryColor,
    },
    cancelBtn: {
        backgroundColor: '#E53935',
        borderRadius: ms(12),
        paddingVertical: vs(14),
        alignItems: 'center',
        marginTop: vs(16),
    },
    cancelBtnText: {
        fontSize: ms(15),
        fontWeight: '700',
        color: whiteColor,
    },
});
