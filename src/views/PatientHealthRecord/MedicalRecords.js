import React, { useState } from 'react';
import {
    View, Text, SafeAreaView, TouchableOpacity,
    StyleSheet, ScrollView, Dimensions, Modal,
    TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { heading, interMedium, interRegular } from '../../config/Constants';
import { blackColor, whiteColor, primaryColor, globalGradient, globalGradient2 } from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const MUTED  = '#64748B';
const BORDER = 'rgba(15,118,110,0.13)';
const SLATE  = '#334155';

// ── Static Data ───────────────────────────────────────────────────────────────
const STATS = [
    { label: 'Last Visit',         value: 'Mar 09', sub: 'Dr. Priya Nair' },
    { label: 'Next Appointment',   value: 'Apr 3',  sub: 'Endocrinology' },
    { label: 'Abnormal Markers',   value: '4',      sub: 'need attention', valueColor: '#DC2626', subColor: '#DC2626' },
    { label: 'Med Adherence',      value: '87%',    sub: 'last 30 days' },
];

const DOC_COLORS = [
    { bg: '#EDE9FE', tx: '#7C3AED' },
    { bg: '#CCFBF1', tx: '#0D9488' },
    { bg: '#FEF3C7', tx: '#D97706' },
    { bg: '#FEF2F2', tx: '#DC2626' },
    { bg: '#EFF6FF', tx: '#1D4ED8' },
    { bg: '#F0FDF4', tx: '#16A34A' },
];

const VISIT_TYPE_STYLE = {
    'Follow-up':        { bg: '#CCFBF1', tx: '#0D9488' },
    'Consultation':     { bg: '#EDE9FE', tx: '#7C3AED' },
    'Sick Visit':       { bg: '#FEF2F2', tx: '#DC2626' },
    'Annual Checkup':   { bg: '#EFF6FF', tx: '#1D4ED8' },
    'Specialist Visit': { bg: '#FEF3C7', tx: '#D97706' },
};

const medStatusStyle = {
    new:          { bg: '#CCFBF1', tx: '#0D9488', label: 'New Rx' },
    continued:    { bg: '#F0FDF4', tx: '#16A34A', label: 'Continued' },
    discontinued: { bg: '#F1F5F9', tx: '#64748B', label: 'Stopped' },
};

const EVENTS = [
    {
        id: 1, doc: 'Dr. Priya Nair', sp: 'Endocrinologist', cl: 'Apollo Hospitals, Hyderabad',
        date: 'Mar 09, 2025', type: 'Follow-up', ci: 1,
        cc: 'Quarterly diabetes review – HbA1c follow-up',
        notes: 'Excellent progress this quarter. HbA1c improved from 6.8% to 5.9%. Fasting glucose still marginally elevated at 102 mg/dL. Advised strict carbohydrate restriction and 30 min daily walk. Vitamin D and B12 supplementation to continue. No changes to Metformin dosage.',
        vitals: [{ l: 'Blood Pressure', v: '118/76 mmHg' }, { l: 'Weight', v: '74.2 kg' }, { l: 'Temperature', v: '98.4°F' }, { l: 'SpO₂', v: '99%' }],
        dx: ['Type 2 Diabetes – Controlled', 'Vitamin D Deficiency'],
        labs: [{
            name: 'Complete Blood Count + HbA1c', lab: 'Apollo Diagnostics', pdf: 'cbc_hba1c.pdf',
            markers: [
                { n: 'HbA1c',          v: '5.9',  u: '%',     lo: 0,    hi: 5.7,  st: 'high' },
                { n: 'Fasting Glucose', v: '102',  u: 'mg/dL', lo: 70,   hi: 100,  st: 'high' },
                { n: 'Hemoglobin',      v: '13.2', u: 'g/dL',  lo: 13.5, hi: 17.5, st: 'low'  },
                { n: 'WBC Count',       v: '7.2',  u: 'K/μL',  lo: 4.5,  hi: 11,   st: 'normal' },
            ],
        }],
        meds: [
            { n: 'Metformin 500mg',      dose: '3× daily – continued', color: '#0D9488', st: 'continued' },
            { n: 'Vitamin D3 60,000 IU', dose: 'Weekly – newly added',  color: '#1D4ED8', st: 'new' },
            { n: 'Vitamin B12 1500mcg',  dose: 'Daily – newly added',   color: '#D97706', st: 'new' },
            { n: 'Pantoprazole 40mg',    dose: 'Daily – continued',     color: '#16A34A', st: 'continued' },
        ],
        fu: { doc: 'Dr. Priya Nair', date: 'June 2025', note: 'HbA1c + Urine Microalbumin review' },
    },
    {
        id: 2, doc: 'Dr. Suresh Reddy', sp: 'Cardiologist', cl: 'Yashoda Hospitals, Secunderabad',
        date: 'Feb 14, 2025', type: 'Consultation', ci: 3,
        cc: 'Elevated LDL cholesterol – lipid management consultation',
        notes: 'Patient referred after lipid profile showed LDL 138 mg/dL. ECG entirely normal. No symptoms of chest pain or dyspnoea. Dietary counselling given. Initiated Rosuvastatin 10mg at night. Repeat lipid profile in 6 weeks.',
        vitals: [{ l: 'Blood Pressure', v: '128/82 mmHg' }, { l: 'Weight', v: '74.5 kg' }, { l: 'Temperature', v: '98.2°F' }, { l: 'SpO₂', v: '98%' }],
        dx: ['Hypercholesterolemia', 'Borderline hypertension'],
        labs: [{
            name: 'Lipid Profile', lab: 'Dr. Lal Pathlabs', pdf: 'lipid_profile.pdf',
            markers: [
                { n: 'Total Cholesterol', v: '198', u: 'mg/dL', lo: 0,  hi: 200, st: 'normal' },
                { n: 'LDL Cholesterol',   v: '138', u: 'mg/dL', lo: 0,  hi: 130, st: 'high'   },
                { n: 'HDL Cholesterol',   v: '52',  u: 'mg/dL', lo: 40, hi: 60,  st: 'normal' },
                { n: 'Triglycerides',     v: '142', u: 'mg/dL', lo: 0,  hi: 150, st: 'normal' },
            ],
        }],
        meds: [
            { n: 'Rosuvastatin 10mg', dose: 'Once nightly – newly prescribed', color: '#7C3AED', st: 'new' },
        ],
        fu: { doc: 'Dr. Suresh Reddy', date: 'Apr 18, 2025', note: 'Lipid profile review + Stress test decision' },
    },
    {
        id: 3, doc: 'Dr. Kavitha Iyer', sp: 'General Physician', cl: 'Care Clinic, Banjara Hills',
        date: 'Jan 07, 2025', type: 'Sick Visit', ci: 2,
        cc: 'Fever 102°F, sore throat, body ache for 3 days',
        notes: 'Throat congested. Mild tonsillar hypertrophy. Rapid strep test negative. Viral pharyngitis. Paracetamol SOS and ORS prescribed. No antibiotics – Penicillin allergy documented.',
        vitals: [{ l: 'Blood Pressure', v: '116/74 mmHg' }, { l: 'Weight', v: '74.8 kg' }, { l: 'Temperature', v: '102.1°F' }, { l: 'SpO₂', v: '97%' }],
        dx: ['Viral Pharyngitis', 'Mild fever'],
        labs: [],
        meds: [
            { n: 'Paracetamol 500mg', dose: 'SOS – short course', color: '#64748B', st: 'discontinued' },
            { n: 'ORS sachets',       dose: '3× daily for hydration', color: '#64748B', st: 'discontinued' },
        ],
        fu: { doc: 'Self-care', date: 'Only if not resolved in 7 days', note: 'Consult if fever persists or worsens' },
    },
];


// ── Helpers ───────────────────────────────────────────────────────────────────
const getInitials = name => name.replace('Dr. ', '').split(' ').slice(0, 2).map(p => p[0]).join('');

const markerColor = st =>
    st === 'normal' ? { fill: '#16A34A', bg: '#F0FDF4', label: 'Normal' }
    : st === 'high'  ? { fill: '#DC2626', bg: '#FEF2F2', label: 'High'   }
    :                  { fill: '#D97706', bg: '#FEF3C7', label: 'Low'    };

const markerPos = (v, lo, hi) => {
    const range = hi - lo;
    if (!range) return 50;
    const pct = ((parseFloat(v) - lo) / range) * 100;
    return Math.max(4, Math.min(94, pct));
};

// ── Sub-components ────────────────────────────────────────────────────────────
const SectionLabel = ({ text }) => (
    <View style={st.seclblRow}>
        <Text style={st.seclbl}>{text}</Text>
        <View style={st.seclblLine} />
    </View>
);

const BiomarkerRow = ({ item }) => {
    const mc = markerColor(item.st);
    const pos = markerPos(item.v, item.lo, item.hi);
    return (
        <View style={st.bmRow}>
            <Text style={st.bmName} numberOfLines={1}>{item.n}</Text>
            <Text style={[st.bmVal, { color: mc.fill }]}>{item.v} <Text style={st.bmUnit}>{item.u}</Text></Text>
            <View style={st.bmBar}>
                <View style={[st.bmFill, { width: `${Math.min(pos, 100)}%`, backgroundColor: mc.fill + '25' }]} />
                <View style={[st.bmDot, { left: `${pos}%`, backgroundColor: mc.fill }]} />
            </View>
            <Text style={st.bmRef}>{item.lo > 0 ? `${item.lo}–${item.hi}` : `<${item.hi}`}</Text>
            <View style={[st.bmPill, { backgroundColor: mc.bg }]}>
                <Text style={[st.bmPillTx, { color: mc.fill }]}>{mc.label}</Text>
            </View>
        </View>
    );
};

const downloadReport = async (fileName) => {
    try {
        const { dirs } = RNFetchBlob.fs;
        const dest = `${dirs.DownloadDir}/${fileName}`;
        await RNFetchBlob.config({
            fileCache: true, path: dest,
            addAndroidDownloads: { useDownloadManager: true, notification: true, path: dest, description: 'Lab Report', mime: 'application/pdf' },
        }).fetch('GET', `https://example.com/reports/${fileName}`);
    } catch (e) { console.log('Download error:', e); }
};

const VisitCard = ({ event, expanded, onToggle }) => {
    const dc = DOC_COLORS[event.ci % DOC_COLORS.length];
    const vt = VISIT_TYPE_STYLE[event.type] || { bg: '#F1F5F9', tx: '#64748B' };
    return (
        <View style={st.visitCard}>
            <TouchableOpacity style={st.visitHeader} activeOpacity={0.75} onPress={onToggle}>
                <View style={[st.docAvatar, { backgroundColor: dc.bg }]}>
                    <Text style={[st.docAvatarTx, { color: dc.tx }]}>{getInitials(event.doc)}</Text>
                </View>
                <View style={st.visitMeta}>
                    <Text style={st.visitDoc}>{event.doc}</Text>
                    <Text style={st.visitSp}>{event.sp}</Text>
                    <Text style={st.visitCl} numberOfLines={1}>{event.cl}</Text>
                </View>
                <View style={st.visitRight}>
                    <Text style={st.visitDate}>{event.date}</Text>
                    <View style={[st.vtypeBadge, { backgroundColor: vt.bg }]}>
                        <Text style={[st.vtypeText, { color: vt.tx }]}>{event.type}</Text>
                    </View>
                </View>
                <Icon type={Icons.Ionicons} name={expanded ? 'chevron-up' : 'chevron-down'} size={ms(16)} color={MUTED} style={{ marginLeft: ms(4) }} />
            </TouchableOpacity>

            <View style={st.divider} />

            {expanded && (
                <View style={st.visitBody}>
                    <SectionLabel text="Chief Complaint" />
                    <View style={st.noteBox}>
                        <Text style={[st.noteText, { fontStyle: 'italic', color: MUTED }]}>{event.cc}</Text>
                    </View>

                    <SectionLabel text="Vitals" />
                    <View style={st.vitalsGrid}>
                        {event.vitals.map((v, i) => (
                            <View key={i} style={st.vitalBox}>
                                <Text style={st.vitalLabel}>{v.l}</Text>
                                <Text style={st.vitalValue}>{v.v}</Text>
                            </View>
                        ))}
                    </View>

                    <SectionLabel text="Doctor's Notes" />
                    <View style={st.noteBox}>
                        <Text style={st.noteText}>{event.notes}</Text>
                    </View>

                    <SectionLabel text="Diagnoses" />
                    <View style={st.tagRow}>
                        {event.dx.map((d, i) => (
                            <View key={i} style={st.dxTag}>
                                <Text style={st.dxTagTx}>{d}</Text>
                            </View>
                        ))}
                    </View>

                    {event.labs.length > 0 && (
                        <>
                            <SectionLabel text="Lab Reports from this Visit" />
                            {event.labs.map((lab, li) => (
                                <View key={li} style={st.labCard}>
                                    <View style={st.labCardHdr}>
                                        <View style={st.labCardTitle}>
                                            <View style={st.pdfBadge}><Text style={st.pdfBadgeTx}>PDF</Text></View>
                                            <View style={{ flex: 1, minWidth: 0 }}>
                                                <Text style={st.labName} numberOfLines={1}>{lab.name}</Text>
                                                <Text style={st.labLab} numberOfLines={1}>{lab.lab}</Text>
                                            </View>
                                        </View>
                                        <View style={st.labActions}>
                                            <TouchableOpacity style={st.dlBtn} activeOpacity={0.7}
                                                onPress={() => downloadReport(lab.pdf)}>
                                                <Icon type={Icons.Ionicons} name="download-outline" size={ms(11)} color={primaryColor} />
                                                <Text style={st.dlBtnTx}>Download</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[st.dlBtn, st.viewBtn]} activeOpacity={0.7}>
                                                <Icon type={Icons.Ionicons} name="eye-outline" size={ms(11)} color={whiteColor} />
                                                <Text style={[st.dlBtnTx, { color: whiteColor }]}>View</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={st.bmList}>
                                        {lab.markers.map((m, mi) => <BiomarkerRow key={mi} item={m} />)}
                                    </View>
                                </View>
                            ))}
                        </>
                    )}

                    <SectionLabel text="Medications at this Visit" />
                    <View style={st.medSection}>
                        {event.meds.map((m, mi) => {
                            const ms2 = medStatusStyle[m.st];
                            return (
                                <View key={mi} style={st.medRow}>
                                    <View style={[st.medDot, { backgroundColor: m.color }]} />
                                    <View style={st.medInfo}>
                                        <Text style={st.medName}>{m.n}</Text>
                                        <Text style={st.medDose}>{m.dose}</Text>
                                    </View>
                                    <View style={[st.medBadge, { backgroundColor: ms2.bg }]}>
                                        <Text style={[st.medBadgeTx, { color: ms2.tx }]}>{ms2.label}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    <View style={st.fuBanner}>
                        <View style={{ flex: 1 }}>
                            <Text style={st.fuDoc}>Follow-up: {event.fu.doc}</Text>
                            <Text style={st.fuNote}>{event.fu.note}</Text>
                        </View>
                        <Text style={st.fuDate}>{event.fu.date}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const MedicalRecords = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const title = route.params?.title || 'Medical Records';
    const [expanded, setExpanded] = useState({ 1: true });
    const [showModal, setShowModal] = useState(false);
    const [doctorName, setDoctorName] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [pickedFile, setPickedFile] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const toggle = id => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    const openFilePicker = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
                allowMultiSelection: false,
            });
            if (result?.[0]) setPickedFile(result[0]);
        } catch (e) {
            if (!DocumentPicker.isCancel(e)) console.log('File picker error:', e);
        }
    };

    const handleSubmit = () => {
        setShowModal(false);
        setDoctorName('');
        setAppointmentDate('');
        setPickedFile(null);
    };

    const renderContent = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scrollPad}>

            {/* Stats Row */}
            <View style={st.statsRow}>
                {STATS.map((s, i) => (
                    <View key={i} style={st.statCard}>
                        <Text style={st.statLabel}>{s.label}</Text>
                        <Text style={[st.statValue, s.valueColor ? { color: s.valueColor } : {}]}>{s.value}</Text>
                        <Text style={[st.statSub, s.subColor ? { color: s.subColor } : {}]}>{s.sub}</Text>
                    </View>
                ))}
            </View>

            {/* Clinical Timeline */}
            <Text style={st.timelineTitle}>Clinical Timeline</Text>
            <Text style={st.timelineSub}>Each visit with associated labs and prescriptions</Text>

            <View style={st.timeline}>
                <View style={st.timelineLine} />
                {EVENTS.map(event => (
                    <View key={event.id} style={st.timelineItem}>
                        <View style={st.timelineDot}>
                            <View style={st.timelineDotInner} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <VisitCard
                                event={event}
                                expanded={!!expanded[event.id]}
                                onToggle={() => toggle(event.id)}
                            />
                        </View>
                    </View>
                ))}
            </View>

            <View style={{ height: vs(40) }} />
        </ScrollView>
    );

    return (
        <LinearGradient
            colors={globalGradient2}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.25]}
            style={st.flex1}
        >
            <SafeAreaView style={st.fullGradient}>
                <StatusBar2 />

                {/* Header */}
                <View style={st.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={st.backButton}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={st.headerTitle}>{title}</Text>
                </View>

                {renderContent()}

                {/* FAB */}
                <TouchableOpacity style={st.fab} activeOpacity={0.85} onPress={() => setShowModal(true)}>
                    <Icon type={Icons.Ionicons} name="add" size={ms(26)} color={whiteColor} />
                </TouchableOpacity>

                {/* Add Visit Modal */}
                <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={st.modalOverlay}>
                        <TouchableOpacity style={st.modalBackdrop} activeOpacity={1} onPress={() => setShowModal(false)} />
                        <View style={st.modalSheet}>
                            {/* Modal Header */}
                            <View style={st.modalHeader}>
                                <Text style={st.modalTitle}>Add Visit Record</Text>
                                <TouchableOpacity onPress={() => setShowModal(false)} style={st.modalCloseBtn}>
                                    <Icon type={Icons.Ionicons} name="close" size={ms(18)} color={MUTED} />
                                </TouchableOpacity>
                            </View>

                            {/* Doctor Name */}
                            <Text style={st.fieldLabel}>Doctor Name</Text>
                            <View style={st.inputWrap}>
                                <Icon type={Icons.Ionicons} name="person-outline" size={ms(16)} color={MUTED} />
                                <TextInput
                                    style={st.input}
                                    placeholder="e.g. Dr. Priya Nair"
                                    placeholderTextColor="#9CA3AF"
                                    value={doctorName}
                                    onChangeText={setDoctorName}
                                />
                            </View>

                            {/* Date of Appointment */}
                            <Text style={st.fieldLabel}>Date of Appointment</Text>
                            <TouchableOpacity style={st.inputWrap} activeOpacity={0.7} onPress={() => setShowDatePicker(true)}>
                                <Icon type={Icons.Ionicons} name="calendar-outline" size={ms(16)} color={MUTED} />
                                <Text style={[st.input, !appointmentDate && { color: '#9CA3AF' }]}>
                                    {appointmentDate || 'Select date'}
                                </Text>
                                <Icon type={Icons.Ionicons} name="chevron-down" size={ms(14)} color={MUTED} />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(_e, date) => {
                                        setShowDatePicker(false);
                                        if (date) {
                                            setSelectedDate(date);
                                            setAppointmentDate(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                                        }
                                    }}
                                />
                            )}

                            {/* Upload Document */}
                            <Text style={st.fieldLabel}>Upload Document</Text>
                            <TouchableOpacity style={st.uploadZone} activeOpacity={0.8} onPress={openFilePicker}>
                                <Icon type={Icons.Ionicons} name="cloud-upload-outline" size={ms(22)} color={primaryColor} />
                                <View style={{ flex: 1 }}>
                                    <Text style={st.uploadTitle}>
                                        {pickedFile ? pickedFile.name : 'Tap to upload'}
                                    </Text>
                                    <Text style={st.uploadSub}>
                                        {pickedFile ? pickedFile.size
                                            ? `${(pickedFile.size / 1024).toFixed(0)} KB`
                                            : 'File selected'
                                        : <Text><Text style={st.uploadSubLink}>PDF</Text>, JPG or PNG</Text>}
                                    </Text>
                                </View>
                                {pickedFile
                                    ? <Icon type={Icons.Ionicons} name="checkmark-circle" size={ms(20)} color={primaryColor} />
                                    : <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(16)} color={MUTED} />
                                }
                            </TouchableOpacity>

                            {/* Submit */}
                            <TouchableOpacity style={st.submitBtn} activeOpacity={0.85} onPress={handleSubmit}>
                                <Text style={st.submitBtnText}>Save Record</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default MedicalRecords;

// ── Styles ────────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
    flex1:        { flex: 1 },
    fullGradient: { flex: 1, paddingHorizontal: ms(16), paddingTop: ms(50) },

    // Header
    header:      { flexDirection: 'row', alignItems: 'center', paddingBottom: vs(12) },
    backButton:  { width: ms(34), height: ms(34), borderRadius: ms(17), backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: blackColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    headerTitle: { flex: 1, fontFamily: heading, fontSize: ms(18), color: whiteColor, marginLeft: ms(12) },

    scrollPad: { paddingTop: vs(4), paddingBottom: vs(40) },

    // Stats Row
    statsRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(14) },
    statCard:   { flex: 1, minWidth: (width - ms(32) - ms(8)) / 2, backgroundColor: whiteColor, borderRadius: ms(10), padding: ms(10), borderWidth: 0.5, borderColor: BORDER },
    statLabel:  { fontFamily: interRegular, fontSize: ms(9), color: MUTED, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: vs(3) },
    statValue:  { fontFamily: interMedium, fontSize: ms(18), color: blackColor },
    statSub:    { fontFamily: interRegular, fontSize: ms(10), color: primaryColor, marginTop: vs(2) },

    // FAB
    fab: { position: 'absolute', bottom: vs(24), right: ms(4), width: ms(52), height: ms(52), borderRadius: ms(26), backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6 },

    // Modal
    modalOverlay:   { flex: 1, justifyContent: 'flex-end' },
    modalBackdrop:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
    modalSheet:     { backgroundColor: whiteColor, borderTopLeftRadius: ms(20), borderTopRightRadius: ms(20), padding: ms(20), paddingBottom: vs(36) },
    modalHeader:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(18) },
    modalTitle:     { fontFamily: heading, fontSize: ms(16), color: blackColor },
    modalCloseBtn:  { width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

    // Fields
    fieldLabel: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(6) },
    inputWrap:  { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: BORDER, borderRadius: ms(10), paddingHorizontal: ms(12), height: vs(44), gap: ms(8), marginBottom: vs(14), backgroundColor: '#FAFAFA' },
    input:      { flex: 1, fontFamily: interRegular, fontSize: ms(13), color: blackColor, padding: 0 },

    // Upload Zone (in modal)
    uploadZone:    { flexDirection: 'row', alignItems: 'center', gap: ms(12), borderWidth: 1.5, borderStyle: 'dashed', borderColor: primaryColor + '55', borderRadius: ms(12), padding: ms(14), backgroundColor: primaryColor + '05', marginBottom: vs(20) },
    uploadTitle:   { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    uploadSub:     { fontFamily: interRegular, fontSize: ms(11), color: MUTED, marginTop: vs(2) },
    uploadSubLink: { fontFamily: interMedium, color: primaryColor },

    // Submit
    submitBtn:     { backgroundColor: primaryColor, borderRadius: ms(12), paddingVertical: vs(13), alignItems: 'center' },
    submitBtnText: { fontFamily: heading, fontSize: ms(14), color: whiteColor },

    // Timeline
    timelineTitle: { fontFamily: heading, fontSize: ms(16), color: blackColor, marginBottom: vs(2) },
    timelineSub:   { fontFamily: interRegular, fontSize: ms(11), color: MUTED, marginBottom: vs(14) },
    timeline:      { position: 'relative', paddingLeft: ms(24) },
    timelineLine:  { position: 'absolute', left: ms(8), top: ms(18), bottom: ms(18), width: 1.5, backgroundColor: primaryColor + '40' },
    timelineItem:  { flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(14) },
    timelineDot:   { position: 'absolute', left: -ms(24), top: ms(16), width: ms(18), height: ms(18), borderRadius: ms(9), borderWidth: 2, borderColor: primaryColor, backgroundColor: '#F8FFFE', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
    timelineDotInner: { width: ms(6), height: ms(6), borderRadius: ms(3), backgroundColor: primaryColor },

    // Visit Card
    visitCard:   { backgroundColor: whiteColor, borderRadius: ms(14), borderWidth: 0.5, borderColor: BORDER, overflow: 'hidden', flex: 1 },
    visitHeader: { flexDirection: 'row', alignItems: 'center', padding: ms(12), gap: ms(10) },
    docAvatar:   { width: ms(40), height: ms(40), borderRadius: ms(20), justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    docAvatarTx: { fontFamily: interMedium, fontSize: ms(12) },
    visitMeta:   { flex: 1, minWidth: 0 },
    visitDoc:    { fontFamily: interMedium, fontSize: ms(12), color: blackColor },
    visitSp:     { fontFamily: interRegular, fontSize: ms(10), color: MUTED },
    visitCl:     { fontFamily: interRegular, fontSize: ms(9), color: '#94A3B8', marginTop: vs(1) },
    visitRight:  { alignItems: 'flex-end', flexShrink: 0 },
    visitDate:   { fontFamily: interMedium, fontSize: ms(10), color: blackColor },
    vtypeBadge:  { borderRadius: ms(4), paddingHorizontal: ms(6), paddingVertical: vs(2), marginTop: vs(3) },
    vtypeText:   { fontFamily: interMedium, fontSize: ms(9) },
    divider:     { height: 0.5, backgroundColor: BORDER, marginHorizontal: ms(12) },

    // Visit Body
    visitBody:  { padding: ms(12) },
    seclblRow:  { flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(6) },
    seclbl:     { fontFamily: interMedium, fontSize: ms(9), color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, marginRight: ms(8) },
    seclblLine: { flex: 1, height: 0.5, backgroundColor: BORDER },

    noteBox:  { backgroundColor: '#F8FFFE', borderLeftWidth: 3, borderLeftColor: primaryColor, borderRadius: ms(6), padding: ms(10) },
    noteText: { fontFamily: interRegular, fontSize: ms(11), color: SLATE, lineHeight: vs(18) },

    vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8) },
    vitalBox:   { flex: 1, minWidth: (width - ms(80)) / 2, backgroundColor: '#F8FFFE', borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(8), padding: ms(8) },
    vitalLabel: { fontFamily: interRegular, fontSize: ms(9), color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(2) },
    vitalValue: { fontFamily: interMedium, fontSize: ms(12), color: blackColor },

    tagRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(4) },
    dxTag:   { backgroundColor: '#FEF2F2', borderRadius: ms(6), paddingHorizontal: ms(8), paddingVertical: vs(3) },
    dxTagTx: { fontFamily: interMedium, fontSize: ms(10), color: '#DC2626' },

    // Lab Card
    labCard:      { backgroundColor: '#F8FFFE', borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(10), overflow: 'hidden', marginBottom: vs(8) },
    labCardHdr:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: ms(10), borderBottomWidth: 0.5, borderBottomColor: BORDER, gap: ms(10) },
    labCardTitle: { flexDirection: 'row', alignItems: 'center', gap: ms(8), flex: 1, minWidth: 0 },
    pdfBadge:     { backgroundColor: '#FEE2E2', borderRadius: ms(4), paddingHorizontal: ms(5), paddingVertical: vs(2) },
    pdfBadgeTx:   { fontFamily: interMedium, fontSize: ms(9), color: '#DC2626' },
    labName:      { fontFamily: interMedium, fontSize: ms(11), color: blackColor, flexShrink: 1 },
    labLab:       { fontFamily: interRegular, fontSize: ms(10), color: MUTED, flexShrink: 1 },
    labActions:   { flexDirection: 'row', gap: ms(6) },
    dlBtn:        { flexDirection: 'row', alignItems: 'center', gap: ms(3), borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(6), paddingHorizontal: ms(8), paddingVertical: vs(4) },
    dlBtnTx:      { fontFamily: interRegular, fontSize: ms(10), color: primaryColor },
    viewBtn:      { backgroundColor: primaryColor, borderColor: primaryColor },

    // Biomarker Row (in lab card)
    bmList:   { padding: ms(10), gap: vs(8) },
    bmRow:    { flexDirection: 'row', alignItems: 'center', gap: ms(6) },
    bmName:   { fontFamily: interRegular, fontSize: ms(10), color: blackColor, width: ms(100), flexShrink: 0 },
    bmVal:    { fontFamily: interMedium, fontSize: ms(10), width: ms(52), flexShrink: 0 },
    bmUnit:   { fontFamily: interRegular, fontSize: ms(9), color: MUTED },
    bmBar:    { flex: 1, height: vs(5), backgroundColor: '#E2E8F0', borderRadius: ms(3), position: 'relative', overflow: 'visible' },
    bmFill:   { position: 'absolute', top: 0, height: '100%', borderRadius: ms(3) },
    bmDot:    { position: 'absolute', top: -vs(4), width: ms(13), height: ms(13), borderRadius: ms(7), borderWidth: 2, borderColor: whiteColor, marginLeft: -ms(6) },
    bmRef:    { fontFamily: interRegular, fontSize: ms(9), color: '#94A3B8', width: ms(48), textAlign: 'right', flexShrink: 0 },
    bmPill:   { borderRadius: ms(4), paddingHorizontal: ms(5), paddingVertical: vs(1), flexShrink: 0 },
    bmPillTx: { fontFamily: interMedium, fontSize: ms(9) },

    // Medications
    medSection: { gap: vs(6) },
    medRow:     { backgroundColor: '#F8FFFE', borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(8), padding: ms(10), flexDirection: 'row', alignItems: 'center', gap: ms(10) },
    medDot:     { width: ms(10), height: ms(10), borderRadius: ms(5), flexShrink: 0 },
    medInfo:    { flex: 1 },
    medName:    { fontFamily: interMedium, fontSize: ms(11), color: blackColor },
    medDose:    { fontFamily: interRegular, fontSize: ms(10), color: MUTED, marginTop: vs(1) },
    medBadge:   { borderRadius: ms(4), paddingHorizontal: ms(7), paddingVertical: vs(2), flexShrink: 0 },
    medBadgeTx: { fontFamily: interMedium, fontSize: ms(9) },

    // Follow-up
    fuBanner: { backgroundColor: '#EFF6FF', borderWidth: 0.5, borderColor: 'rgba(29,78,216,0.18)', borderRadius: ms(10), padding: ms(12), flexDirection: 'row', alignItems: 'center', marginTop: vs(10) },
    fuDoc:    { fontFamily: interMedium, fontSize: ms(11), color: '#1D4ED8' },
    fuNote:   { fontFamily: interRegular, fontSize: ms(10), color: 'rgba(29,78,216,0.65)', marginTop: vs(2) },
    fuDate:   { fontFamily: interMedium, fontSize: ms(11), color: '#1D4ED8' },

});
