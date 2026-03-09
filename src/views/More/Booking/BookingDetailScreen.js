import React, { useState } from 'react';
import {
  SafeAreaView, StyleSheet, View, Text,
  ScrollView, TouchableOpacity, Image,
  Modal, Pressable, TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../../components/StatusBar';
import Icon, { Icons } from '../../../components/Icons';
import LinearGradient from 'react-native-linear-gradient';
import { bold, regular } from '../../../config/Constants';
import { blackColor, globalGradient2, primaryColor, whiteColor } from '../../../utils/globalColors';

const CANCEL_REASONS = [
  'Change in Consultation Type',
  'Doctor Not Available',
  'Booked by Mistake',
  'Long Waiting Time',
  'Found Another Doctor',
  'Financial Reason',
];

// Star Rating component
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

const BookingDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const booking = route.params?.booking || {};
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(1);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const isConfirmed = booking.status === 'Confirmed' || !booking.status;
  const isCompleted = booking.status === 'Completed';
  const isCancelled = booking.status === 'Cancelled';

  const handleCancelAppointment = () => {
    setCancelModal(false);
    setSelectedReason(null);
    navigation.navigate('SuccessScreen', {
      title: 'Successfully',
      subtitle: 'Appointment Cancelled',
      type: 'cancel',
      targetScreen: 'LabOrders',
      delay: 2000,
    });
  };

  const handleSubmitFeedback = () => {
    setFeedbackModal(false);
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      navigation.navigate('LabOrders');
    }, 2000);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Confirmed': return { color: '#065F46', bg: '#DCFCE7' };
      case 'Completed': return { color: '#92400E', bg: '#FEF3C7' };
      case 'Cancelled': return { color: '#991B1B', bg: '#FEE2E2' };
      default: return { color: '#374151', bg: '#F3F4F6' };
    }
  };

  const sc = getStatusConfig(booking.status);

  const gradientColors = isCancelled
    ? ['#FECACA', '#FFF1F1']
    : globalGradient2;

  const bgColor = isCancelled ? '#FFF1F1' : '#F5F7FA';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar2 />
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 3 }}
        locations={[0, 0.05]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backBtn, isCancelled && { backgroundColor: 'rgba(0,0,0,0.08)' }]}
            onPress={() => navigation.goBack()}
          >
            <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={isCancelled ? blackColor : whiteColor} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerName, isCancelled && { color: blackColor }]}>{booking.doctor || 'Dr. Anil Sharma'}</Text>
            <Text style={[styles.headerDate, isCancelled && { color: '#6B7280' }]}>{booking.date || '17 Feb 2026,12:30'}</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Confirmed: ID row + status badge */}
          {isConfirmed && (
            <View style={styles.idRow}>
              <Text style={styles.idText}>Appointment ID: #7326453845</Text>
              <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                <Text style={[styles.statusText, { color: sc.color }]}>{booking.status || 'Confirmed'}</Text>
              </View>
            </View>
          )}

          {/* Completed: status text + message + appointment ID */}
          {isCompleted && (
            <View style={styles.completedHeader}>
              <Text style={styles.completedStatusText}>Completed</Text>
              <Text style={styles.completedMessage}>
                Thanks for booking with us! Your Appointment has been successfully completed.
              </Text>
              <Text style={styles.completedId}>Appointment ID: #7326453845</Text>
            </View>
          )}

          {/* Cancelled: status text */}
          {isCancelled && (
            <View style={styles.idRow}>
              <Text style={styles.idText}>Appointment ID: #7326453845</Text>
              <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                <Text style={[styles.statusText, { color: sc.color }]}>Cancelled</Text>
              </View>
            </View>
          )}

          {/* Appointment Date & Time */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Appointment Date & Time</Text>
            <Text style={styles.sectionValue}>{booking.appointmentDate || '11:30, Mon,17 Feb,2026'}</Text>
          </View>

          {/* Doctor Details */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Doctor Details</Text>
            <View style={styles.doctorRow}>
              <Text style={styles.doctorName}>{booking.doctor || 'Dr. Anil Sharma'}</Text>
              <View style={styles.ratingRow}>
                <Icon type={Icons.Ionicons} name="star" size={ms(16)} color="#FBBF24" />
                <Text style={styles.ratingText}>{booking.rating || 4.5}</Text>
              </View>
            </View>
            <Text style={styles.specialtyText}>{booking.specialty || 'General Physician'}</Text>
          </View>

          {/* Patient Details */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Patient  Details</Text>
            <View style={styles.patientRow}>
              <View style={styles.avatarWrap}>
                <Icon type={Icons.Ionicons} name="person" size={ms(30)} color="#9CA3AF" />
              </View>
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>Rahul Majika</Text>
                <Text style={styles.patientDob}>12 Jan 1995</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItemRow}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>Male</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItemRow}>
              <Text style={styles.detailLabel}>Mobile Number</Text>
              <Text style={styles.detailValue}>+91789579568</Text>
            </View>
          </View>

          {/* Consultation Type */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Consultation Type</Text>
            <View style={styles.consultRow}>
              <Icon type={Icons.Ionicons} name="videocam-outline" size={ms(20)} color={blackColor} />
              <Text style={styles.consultText}>Video call</Text>
            </View>
            <Text style={styles.consultDesc}>
              Your video call with the doctor will start at your booked appointment time
            </Text>
          </View>

          {/* Payment Details */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.detailItemRow}>
              <Text style={styles.detailLabel}>Amount Paid</Text>
              <Text style={styles.detailValue}>₹620</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItemRow}>
              <Text style={styles.detailLabel}>Payment via</Text>
              <Text style={styles.detailValue}>Phone pay</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItemRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>8373753609606</Text>
            </View>
          </View>

          {/* Feedback section for Completed */}
          {isCompleted && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Feedback</Text>
              <Text style={styles.feedbackLabel}>Rate {booking.doctor || 'Dr. Anil Sharma'}</Text>
              <StarRating rating={feedbackRating} setRating={setFeedbackRating} />
            </View>
          )}

          {/* Note for Confirmed */}
          {isConfirmed && (
            <View style={styles.noteSection}>
              <Text style={styles.noteTitle}>Note :</Text>
              <Text style={styles.noteDesc}>
                This appointment is non-refundable. No refund will be issued upon cancellation.
              </Text>
            </View>
          )}

          <View style={{ height: vs(100) }} />
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          {isConfirmed && (
            <>
              <TouchableOpacity style={styles.videoBtn}>
                <Icon type={Icons.Ionicons} name="videocam-outline" size={ms(18)} color={whiteColor} />
                <Text style={styles.videoBtnText}>Start a Video call</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCancelModal(true)}>
                <Text style={styles.cancelText}>Cancel Appointment</Text>
              </TouchableOpacity>
            </>
          )}
          {isCompleted && (
            <TouchableOpacity style={styles.rescheduleFooterBtn} onPress={() => setFeedbackModal(true)}>
              <Text style={styles.rescheduleFooterBtnText}>Reschedule</Text>
            </TouchableOpacity>
          )}
          {isCancelled && (
            <TouchableOpacity style={styles.videoBtn}>
              <Text style={styles.videoBtnText}>Try again</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Feedback Bottom Sheet */}
        <Modal
          visible={feedbackModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setFeedbackModal(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalBackdrop} onPress={() => setFeedbackModal(false)} />
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Feedback</Text>
                <TouchableOpacity onPress={() => setFeedbackModal(false)} style={styles.sheetCloseBtn}>
                  <Icon type={Icons.Ionicons} name="close" size={ms(20)} color="#888" />
                </TouchableOpacity>
              </View>

              <Text style={styles.feedbackLabel}>Rate {booking.doctor || 'Dr. Anil Sharma'}</Text>
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

              <TouchableOpacity
                style={styles.submitFeedbackBtn}
                onPress={handleSubmitFeedback}
                activeOpacity={0.8}
              >
                <Text style={styles.submitFeedbackBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Feedback Success Popup */}
        <Modal
          visible={feedbackSuccess}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.successOverlay}>
            <View style={styles.successPopup}>
              <Image
                source={require('../../../assets/img/checkMark.png')}
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

        {/* Cancellation Reason Bottom Sheet */}
        <Modal
          visible={cancelModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCancelModal(false)}
        >
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
                onPress={handleCancelAppointment}
                disabled={!selectedReason}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel Appointment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default BookingDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  gradient: { flex: 1, paddingTop: ms(50) },
  scroll: { paddingHorizontal: ms(20), paddingTop: vs(10) },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: ms(20), marginBottom: vs(20),
  },
  backBtn: {
    width: ms(38), height: ms(38), borderRadius: ms(19),
    backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center',
    marginRight: ms(12),
  },
  headerInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerName: { fontFamily: bold, fontSize: ms(16), color: whiteColor },
  headerDate: { fontFamily: regular, fontSize: ms(12), color: 'rgba(255,255,255,0.8)' },

  // Confirmed: ID & Status Row
  idRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: vs(20),
  },
  idText: { fontFamily: regular, fontSize: ms(13), color: '#374151' },
  statusBadge: {
    borderRadius: ms(20), paddingHorizontal: ms(16), paddingVertical: vs(6),
  },
  statusText: { fontFamily: bold, fontSize: ms(13) },

  // Completed Header
  completedHeader: {
    alignItems: 'center', marginBottom: vs(20),
  },
  completedStatusText: {
    fontFamily: bold, fontSize: ms(18), color: '#4CAF50', marginBottom: vs(8),
  },
  completedMessage: {
    fontFamily: regular, fontSize: ms(13), color: '#374151',
    textAlign: 'center', lineHeight: ms(20), marginBottom: vs(8),
  },
  completedId: {
    fontFamily: regular, fontSize: ms(13), color: '#374151',
  },

  // Section Card
  sectionCard: {
    backgroundColor: whiteColor, borderRadius: ms(14),
    padding: ms(16), marginBottom: vs(16),
  },
  sectionTitle: { fontFamily: bold, fontSize: ms(14), color: blackColor, marginBottom: vs(10) },
  sectionValue: { fontFamily: regular, fontSize: ms(13), color: '#374151' },

  // Doctor
  doctorRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  doctorName: { fontFamily: bold, fontSize: ms(14), color: blackColor },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
  ratingText: { fontFamily: bold, fontSize: ms(14), color: blackColor },
  specialtyText: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', marginTop: vs(2) },

  // Patient
  patientRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: vs(14),
  },
  avatarWrap: {
    width: ms(55), height: ms(55), borderRadius: ms(28),
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
    marginRight: ms(14),
  },
  patientInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  patientName: { fontFamily: bold, fontSize: ms(14), color: blackColor },
  patientDob: { fontFamily: regular, fontSize: ms(12), color: '#6B7280' },

  // Detail rows
  detailItemRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: vs(10),
  },
  detailLabel: { fontFamily: regular, fontSize: ms(13), color: primaryColor },
  detailValue: { fontFamily: bold, fontSize: ms(13), color: blackColor },
  detailDivider: {
    borderBottomWidth: 1, borderStyle: 'dashed', borderBottomColor: '#D1D5DB',
  },

  // Consultation
  consultRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(6) },
  consultText: { fontFamily: bold, fontSize: ms(14), color: blackColor },
  consultDesc: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(18) },

  // Note
  noteSection: { marginBottom: vs(10) },
  noteTitle: { fontFamily: bold, fontSize: ms(13), color: blackColor, marginBottom: vs(4) },
  noteDesc: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(18) },

  // Feedback (inline in Completed)
  feedbackLabel: {
    fontFamily: regular, fontSize: ms(13), color: '#374151', marginBottom: vs(8),
  },
  starsRow: {
    flexDirection: 'row', gap: ms(6),
  },

  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: whiteColor, paddingHorizontal: ms(20),
    paddingTop: vs(12), paddingBottom: vs(30),
    borderTopLeftRadius: ms(20), borderTopRightRadius: ms(20),
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 5,
  },
  videoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: primaryColor, borderRadius: ms(30),
    paddingVertical: vs(14), gap: ms(8), marginBottom: vs(10),
  },
  videoBtnText: { fontFamily: bold, fontSize: ms(14), color: whiteColor },
  cancelText: {
    fontFamily: bold, fontSize: ms(14), color: '#EF4444',
    textAlign: 'center',
  },
  rescheduleFooterBtn: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: primaryColor, borderRadius: ms(30), paddingVertical: vs(14),
  },
  rescheduleFooterBtnText: { fontFamily: bold, fontSize: ms(14), color: whiteColor },

  // Bottom Sheet (shared by cancel & feedback)
  modalOverlay: {
    flex: 1, justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheet: {
    backgroundColor: whiteColor, borderTopLeftRadius: ms(24), borderTopRightRadius: ms(24),
    padding: ms(20), paddingBottom: vs(30),
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: vs(16),
  },
  sheetTitle: { fontFamily: bold, fontSize: ms(16), color: blackColor },
  sheetCloseBtn: {
    width: ms(32), height: ms(32), borderRadius: ms(16),
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },

  // Feedback Modal
  feedbackInput: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(12),
    padding: ms(14), fontFamily: regular, fontSize: ms(13),
    color: blackColor, minHeight: vs(100), textAlignVertical: 'top',
    marginBottom: vs(16),
  },
  submitFeedbackBtn: {
    backgroundColor: primaryColor, borderRadius: ms(30),
    paddingVertical: vs(14), alignItems: 'center',
  },
  submitFeedbackBtnText: { fontFamily: bold, fontSize: ms(14), color: whiteColor },

  // Feedback Success Popup
  successOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  successPopup: {
    backgroundColor: whiteColor, borderRadius: ms(20),
    padding: ms(30), alignItems: 'center', width: '70%',
  },
  successCheckImage: {
    width: ms(60), height: ms(60), marginBottom: vs(14),
  },
  successRatingRow: {
    flexDirection: 'row', alignItems: 'center', gap: ms(4), marginBottom: vs(8),
  },
  successRatingText: { fontFamily: bold, fontSize: ms(16), color: blackColor },
  successThankText: { fontFamily: bold, fontSize: ms(14), color: '#374151' },

  // Cancel Modal
  reasonRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: vs(12), borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  reasonText: { fontFamily: regular, fontSize: ms(14), color: '#374151' },
  radio: {
    width: ms(20), height: ms(20), borderRadius: ms(10),
    borderWidth: 2, borderColor: '#D1D5DB',
    justifyContent: 'center', alignItems: 'center',
  },
  radioSelected: { borderColor: primaryColor },
  radioInner: {
    width: ms(10), height: ms(10), borderRadius: ms(5),
    backgroundColor: primaryColor,
  },
  cancelBtn: {
    backgroundColor: '#EF4444', borderRadius: ms(30),
    paddingVertical: vs(14), alignItems: 'center',
    marginTop: vs(20),
  },
  cancelBtnText: { fontFamily: bold, fontSize: ms(14), color: whiteColor },
});
