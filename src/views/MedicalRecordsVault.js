import React, { useState, useEffect } from 'react';
import {
    Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity,
    View, Image, ScrollView, FlatList, TextInput, Modal,
    KeyboardAvoidingView, Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { vs, ms } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import LoadLabReportsAction from '../redux/actions/LabReportsActions';
import DocumentPicker from 'react-native-document-picker';

import { StatusBar2 } from '../components/StatusBar';
import { heading, interMedium, interRegular, img_url } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, globalGradient, whiteColor, primaryColor, globalGradient2 } from '../utils/globalColors';
import MedicalRecordsShimmer from '../components/MedicalRecordsShimmer';

const { width } = Dimensions.get('window');

// ── Helpers ──────────────────────────────────────────────────────────────────
const getRangePct = (value, refLow, refHigh) => {
    const range = refHigh - (refLow || 0);
    if (range <= 0) return 50;
    const pct = ((value - (refLow || 0)) / range) * 100;
    return Math.max(3, Math.min(97, pct));
};

const statusColor = (s) =>
    s === 'normal' ? '#16A34A' : s === 'high' ? '#DC2626' : '#D97706';
const statusBg = (s) =>
    s === 'normal' ? '#DCFCE7' : s === 'high' ? '#FEE2E2' : '#FEF3C7';
const statusLabel = (s) =>
    s === 'normal' ? 'Normal' : s === 'high' ? 'High' : 'Low';

// ── Sparkline ─────────────────────────────────────────────────────────────────
const SparkLine = ({ spark, color }) => {
    const max = Math.max(...spark);
    const min = Math.min(...spark);
    const range = max - min || 1;
    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: vs(20), gap: ms(2) }}>
            {spark.map((v, i) => (
                <View key={i} style={{
                    width: ms(4),
                    height: vs(4) + vs(14) * ((v - min) / range),
                    backgroundColor: i === spark.length - 1 ? color : color + '35',
                    borderRadius: ms(2),
                }} />
            ))}
        </View>
    );
};

// ── Data ──────────────────────────────────────────────────────────────────────
const ANALYTE_NAMES = ['HbA1c', 'Glucose', 'TSH', 'Creatinine', 'Hemoglobin', 'LDL', 'ALT', 'Ferritin'];

const bioMarkersData = [
    { code: 'HB001',  name: 'Hemoglobin',       category: 'Blood Count', value: 13.2, unit: 'g/dL',    refLow: 13.5, refHigh: 17.5, status: 'low',    count: 18, trend: 'down',   spark: [14.1, 13.9, 14.2, 13.8, 13.5, 13.2] },
    { code: 'LDL003', name: 'LDL Cholesterol',   category: 'Lipid Panel', value: 138,  unit: 'mg/dL',   refLow: 0,    refHigh: 130,  status: 'high',   count: 11, trend: 'up',     spark: [120, 125, 128, 132, 135, 138] },
    { code: 'CHL003', name: 'Cholesterol',        category: 'Lipid Panel', value: 198,  unit: 'mg/dL',   refLow: 0,    refHigh: 200,  status: 'normal', count: 11, trend: 'stable', spark: [210, 205, 202, 200, 198, 198] },
    { code: 'TSH004', name: 'TSH',                category: 'Thyroid',     value: 2.4,  unit: 'mIU/L',   refLow: 0.5,  refHigh: 5.0,  status: 'normal', count: 9,  trend: 'stable', spark: [2.8, 2.6, 2.5, 2.4, 2.4, 2.4] },
    { code: 'HBA006', name: 'HbA1c',              category: 'Diabetes',    value: 5.9,  unit: '%',        refLow: 0,    refHigh: 5.7,  status: 'high',   count: 7,  trend: 'up',     spark: [5.4, 5.5, 5.6, 5.7, 5.8, 5.9] },
    { code: 'GLU002', name: 'Glucose',            category: 'Diabetes',    value: 102,  unit: 'mg/dL',   refLow: 70,   refHigh: 100,  status: 'high',   count: 10, trend: 'up',     spark: [91, 94, 96, 99, 101, 102] },
    { code: 'VD007',  name: 'Vitamin D3',         category: 'Vitamins',    value: 18,   unit: 'ng/mL',   refLow: 30,   refHigh: 100,  status: 'low',    count: 8,  trend: 'down',   spark: [28, 24, 22, 20, 19, 18] },
    { code: 'CRT008', name: 'Creatinine',         category: 'Kidney',      value: 0.94, unit: 'mg/dL',   refLow: 0.7,  refHigh: 1.2,  status: 'normal', count: 12, trend: 'stable', spark: [0.91, 0.92, 0.93, 0.94, 0.94, 0.94] },
    { code: 'OXY005', name: 'Oxygen Saturation',  category: 'Respiratory', value: 98,   unit: '%',        refLow: 95,   refHigh: 100,  status: 'normal', count: 3,  trend: 'stable', spark: [97, 98, 97, 98, 98, 98] },
    { code: 'BP001',  name: 'Blood Pressure',     category: 'Cardiac',     value: 128,  unit: 'mmHg',    refLow: 90,   refHigh: 120,  status: 'high',   count: 4,  trend: 'stable', spark: [135, 132, 130, 129, 128, 128] },
    { code: 'ALT009', name: 'ALT (SGPT)',         category: 'Liver',       value: 28,   unit: 'U/L',     refLow: 7,    refHigh: 56,   status: 'normal', count: 8,  trend: 'stable', spark: [32, 30, 29, 28, 28, 28] },
];

const DUMMY_REPORTS = [
    { id: 1, name: 'Complete Blood Count', lab: 'Apollo Diagnostics', date: 'Mar 14, 2025', size: '1.2 MB', status: 'new',      markers: ['Hemoglobin', 'WBC', 'Platelets', '+9'] },
    { id: 2, name: 'Lipid Profile',        lab: 'Dr. Lal Pathlabs',   date: 'Mar 12, 2025', size: '890 KB', status: 'new',      markers: ['Total Chol.', 'LDL', 'HDL', '+4'] },
    { id: 3, name: 'Thyroid Panel',        lab: 'SRL Diagnostics',    date: 'Feb 28, 2025', size: '640 KB', status: 'reviewed', markers: ['TSH', 'Free T4', 'Free T3'] },
    { id: 4, name: 'HbA1c & Glucose',     lab: 'Thyrocare',           date: 'Jan 18, 2025', size: '540 KB', status: 'reviewed', markers: ['HbA1c', 'Fasting Glucose', '+2'] },
    { id: 5, name: 'Vitamin D & B12',     lab: 'Metropolis',          date: 'Dec 05, 2024', size: '320 KB', status: 'reviewed', markers: ['Vitamin D3', 'Vitamin B12'] },
];

// ── Main Screen ────────────────────────────────────────────────────────────────
const MedicalRecordsVault = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { data: labReports, loading } = useSelector(state => state.lab_reports);

    const [activeTab, setActiveTab] = useState(route.params?.activeTab || 'Lab');
    const [profilePic, setProfilePic] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [bmSearch, setBmSearch] = useState('');
    const [bmFilter, setBmFilter] = useState('all'); // 'all' | 'abnormal' | 'normal'
    const [showModal, setShowModal] = useState(false);
    const [doctorName, setDoctorName] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [pickedFile, setPickedFile] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => { loadProfilePic(); }, []);

    useEffect(() => {
        if (route.params?.activeTab) setActiveTab(route.params.activeTab);
    }, [route.params?.activeTab]);

    useFocusEffect(
        React.useCallback(() => {
            if (activeTab === 'Lab') dispatch(LoadLabReportsAction(global.id));
        }, [activeTab, dispatch])
    );

    useEffect(() => {
        if (!loading && isInitialLoad) setIsInitialLoad(false);
    }, [loading]);

    const loadProfilePic = async () => {
        try {
            const saved = await AsyncStorage.getItem('profile_picture');
            if (saved) setProfilePic(`${img_url}${saved}`);
        } catch (e) {}
    };

    // ── File Picker ───────────────────────────────────────────────────────────
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

    // ── Biomarkers filtered list ───────────────────────────────────────────────
    const filteredBiomarkers = bioMarkersData.filter(b => {
        const q = bmSearch.toLowerCase();
        const matchSearch = b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
        const matchFilter =
            bmFilter === 'all' ||
            (bmFilter === 'abnormal' && b.status !== 'normal') ||
            (bmFilter === 'normal' && b.status === 'normal');
        return matchSearch && matchFilter;
    });

    const abnormalCount = bioMarkersData.filter(b => b.status !== 'normal').length;

    // ── Lab Reports derived ───────────────────────────────────────────────────
    const apiReports = labReports?.result ?? [];
    const displayReports = apiReports.length > 0 ? null : DUMMY_REPORTS; // use dummy when API empty

    // ── Render: Lab Reports ───────────────────────────────────────────────────
    const renderLabReportsList = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPad}>
            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Total Reports</Text>
                    <Text style={styles.statValue}>{apiReports.length || DUMMY_REPORTS.length}</Text>
                    <Text style={styles.statSub}>+2 this month</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Markers Tracked</Text>
                    <Text style={styles.statValue}>47</Text>
                    <Text style={styles.statSub}>across all reports</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Storage Used</Text>
                    <Text style={styles.statValue}>23<Text style={styles.statValueUnit}> MB</Text></Text>
                    <Text style={styles.statSub}>of 1 GB plan</Text>
                </View>
            </View>

            {/* Section Header */}
            <View style={styles.secHeader}>
                <View>
                    <Text style={styles.secTitle}>Stored Reports</Text>
                    <Text style={styles.secSub}>Tap any report to view or download</Text>
                </View>
                <TouchableOpacity style={styles.ghostBtn}>
                    <Icon type={Icons.Ionicons} name="list-outline" size={ms(12)} color={primaryColor} />
                    <Text style={styles.ghostBtnText}>All Reports</Text>
                </TouchableOpacity>
            </View>

            {/* Reports Grid */}
            {apiReports.length > 0 ? (
                // API reports
                <View style={styles.reportsGrid}>
                    {apiReports.map((item, i) => (
                        <TouchableOpacity key={i} style={styles.reportCard} activeOpacity={0.85}
                            onPress={() => navigation.navigate('PDFViewer', {
                                pdfUrl: item.report_url,
                                title: item.patient_name || 'Lab Report',
                            })}>
                            <View style={styles.reportCardAccent} />
                            <View style={styles.reportCardTop}>
                                <View style={styles.pdfBadge}><Text style={styles.pdfBadgeText}>PDF</Text></View>
                                <View style={[styles.reportStatusBadge, { backgroundColor: '#F0FDF4' }]}>
                                    <Text style={[styles.reportStatusText, { color: primaryColor }]}>New</Text>
                                </View>
                            </View>
                            <Text style={styles.reportName} numberOfLines={2}>{item.patient_name}</Text>
                            <Text style={styles.reportLab} numberOfLines={1}>Lab Report</Text>
                            <View style={styles.reportFooter}>
                                <Text style={styles.reportDate}>{item.report_date || 'Recent'}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                // Dummy reports grid
                <View style={styles.reportsGrid}>
                    {DUMMY_REPORTS.map((item, i) => (
                        <TouchableOpacity key={i} style={styles.reportCard} activeOpacity={0.85}>
                            <View style={styles.reportCardAccent} />
                            <View style={styles.reportCardTop}>
                                <View style={styles.pdfBadge}><Text style={styles.pdfBadgeText}>PDF</Text></View>
                                <View style={[styles.reportStatusBadge,
                                    { backgroundColor: item.status === 'new' ? primaryColor + '15' : '#F1F5F9' }]}>
                                    <Text style={[styles.reportStatusText,
                                        { color: item.status === 'new' ? primaryColor : '#64748B' }]}>
                                        {item.status === 'new' ? 'New' : 'Reviewed'}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.reportName} numberOfLines={2}>{item.name}</Text>
                            <Text style={styles.reportLab} numberOfLines={1}>{item.lab}</Text>
                            <View style={styles.reportMarkers}>
                                {item.markers.slice(0, 3).map((m, j) => (
                                    <View key={j} style={styles.markerChip}>
                                        <Text style={styles.markerChipText}>{m}</Text>
                                    </View>
                                ))}
                                {item.markers.length > 3 && (
                                    <View style={styles.markerChip}>
                                        <Text style={styles.markerChipText}>{item.markers[3]}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.reportFooter}>
                                <Text style={styles.reportDate}>{item.date}</Text>
                                <Text style={styles.reportSize}>{item.size}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {/* Add card */}
                    <TouchableOpacity style={[styles.reportCard, styles.addReportCard]} activeOpacity={0.7}
                        onPress={openFilePicker}>
                        <Icon type={Icons.Ionicons} name="add" size={ms(28)} color={primaryColor + '60'} />
                        <Text style={styles.addReportText}>Add report</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={{ height: vs(40) }} />
        </ScrollView>
    );

    // ── Render: Bio-Markers ───────────────────────────────────────────────────
    const renderBioMarkersTab = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPad}>
            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Markers Monitored</Text>
                    <Text style={styles.statValue}>{bioMarkersData.length}</Text>
                    <Text style={styles.statSub}>unique biomarkers</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Abnormal Now</Text>
                    <Text style={[styles.statValue, { color: '#DC2626' }]}>{abnormalCount}</Text>
                    <Text style={[styles.statSub, { color: '#DC2626' }]}>need attention</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Tests This Year</Text>
                    <Text style={styles.statValue}>63</Text>
                    <Text style={styles.statSub}>individual tests</Text>
                </View>
            </View>

            {/* Search + Filter */}
            <View style={styles.bmHeader}>
                <View style={styles.searchWrap}>
                    <Icon type={Icons.Ionicons} name="search-outline" size={ms(14)} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search biomarkers..."
                        placeholderTextColor="#9CA3AF"
                        value={bmSearch}
                        onChangeText={setBmSearch}
                    />
                </View>
                <View style={styles.filterGroup}>
                    {['all', 'abnormal', 'normal'].map(f => (
                        <TouchableOpacity key={f} style={[styles.filterChip, bmFilter === f && styles.filterChipActive]}
                            onPress={() => setBmFilter(f)}>
                            <Text style={[styles.filterChipText, bmFilter === f && styles.filterChipTextActive]}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Biomarker Cards */}
            <View style={styles.bmTable}>
                {filteredBiomarkers.map((b, i) => {
                    const color = statusColor(b.status);
                    const bg = statusBg(b.status);
                    const fillPct = getRangePct(b.value, b.refLow, b.refHigh);
                    const isAnalyte = ANALYTE_NAMES.includes(b.name);
                    return (
                        <TouchableOpacity key={i} style={[styles.bmRow, i < filteredBiomarkers.length - 1 && styles.bmRowBorder]}
                            activeOpacity={0.7}
                            onPress={() => isAnalyte
                                ? navigation.navigate('AnalyteTrendScreen', { analyteName: b.name })
                                : navigation.navigate('BioMarkerDetailScreen', { name: b.name, code: b.code })
                            }>
                            {/* Name */}
                            <View style={styles.bmNameCol}>
                                <Text style={styles.bmName}>{b.name}</Text>
                                <Text style={styles.bmCat}>{b.category}</Text>
                            </View>

                            {/* Value + times tested */}
                            <View style={styles.bmValueCol}>
                                <Text style={[styles.bmValue, { color: b.status !== 'normal' ? color : blackColor }]}>
                                    {b.value}<Text style={styles.bmUnit}> {b.unit}</Text>
                                </Text>
                                <View style={styles.testedRow}>
                                    <Icon type={Icons.Ionicons} name="flask-outline" size={ms(10)} color="#9CA3AF" />
                                    <Text style={styles.testedText}>{b.count}× tested</Text>
                                </View>
                            </View>

                            {/* Status + trend */}
                            <View style={styles.bmStatusCol}>
                                <View style={[styles.statusPill, { backgroundColor: bg }]}>
                                    <Text style={[styles.statusPillText, { color }]}>{statusLabel(b.status)}</Text>
                                </View>
                                <SparkLine spark={b.spark} color={color} />
                                <View style={styles.trendRow}>
                                    <Icon type={Icons.Ionicons}
                                        name={b.trend === 'up' ? 'trending-up' : b.trend === 'down' ? 'trending-down' : 'remove'}
                                        size={ms(11)}
                                        color={b.trend === 'stable' ? primaryColor : b.trend === 'up' ? '#DC2626' : '#3B82F6'} />
                                    <Text style={[styles.trendText, {
                                        color: b.trend === 'stable' ? primaryColor : b.trend === 'up' ? '#DC2626' : '#3B82F6',
                                    }]}>
                                        {b.trend === 'up' ? 'Rising' : b.trend === 'down' ? 'Falling' : 'Stable'}
                                    </Text>
                                </View>
                            </View>

                            <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(13)} color="#D1D5DB" />
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Action Row */}
            <View style={styles.actionRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.actionTitle}>Schedule Next Test</Text>
                    <Text style={styles.actionSub}>Based on your history, Lipid Panel is due in 2 months</Text>
                </View>
                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionBtnText}>Remind Me</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: vs(40) }} />
        </ScrollView>
    );

    // ── Main JSX ──────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.35]}
                style={styles.headerGradient}
            >
                {/* Header */}
                <View style={styles.topRow}>
                    {route.name !== 'TrustMD' && (
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.headerTitle} numberOfLines={1}>Diagnostic Reports</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('Notifications')}>
                            <Icon type={Icons.MaterialIcons} name="notifications-none" size={ms(20)} color={blackColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            {profilePic ? (
                                <Image source={{ uri: profilePic }} style={styles.profileImage} />
                            ) : (
                                <View style={[styles.profileImage, styles.defaultProfileIcon]}>
                                    <Icon type={Icons.MaterialIcons} name="person" size={ms(20)} color={blackColor} />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Lab' && styles.activeTab]}
                        onPress={() => setActiveTab('Lab')}>
                        <Icon type={Icons.Ionicons} name="document-text-outline" size={ms(13)}
                            color={activeTab === 'Lab' ? primaryColor : whiteColor} />
                        <Text style={[styles.tabText, activeTab === 'Lab' && styles.activeTabText]}>Lab Reports</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Bio' && styles.activeTab]}
                        onPress={() => setActiveTab('Bio')}>
                        <Icon type={Icons.Ionicons} name="analytics-outline" size={ms(13)}
                            color={activeTab === 'Bio' ? primaryColor : whiteColor} />
                        <Text style={[styles.tabText, activeTab === 'Bio' && styles.activeTabText]}>Bio-Markers</Text>
                        {abnormalCount > 0 && (
                            <View style={styles.tabBadge}>
                                <Text style={styles.tabBadgeText}>{abnormalCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.contentArea}>
                    {loading && isInitialLoad ? (
                        <MedicalRecordsShimmer activeTab={activeTab} />
                    ) : activeTab === 'Bio' ? (
                        renderBioMarkersTab()
                    ) : (
                        renderLabReportsList()
                    )}
                </View>

                {/* FAB */}
                <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => setShowModal(true)}>
                    <Icon type={Icons.Ionicons} name="add" size={ms(26)} color={whiteColor} />
                </TouchableOpacity>

                {/* Add Visit Modal */}
                <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowModal(false)} />
                        <View style={styles.modalSheet}>
                            {/* Modal Header */}
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Add Visit Record</Text>
                                <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalCloseBtn}>
                                    <Icon type={Icons.Ionicons} name="close" size={ms(18)} color="#64748B" />
                                </TouchableOpacity>
                            </View>

                            {/* Doctor Name */}
                            <Text style={styles.fieldLabel}>Doctor Name</Text>
                            <View style={styles.inputWrap}>
                                <Icon type={Icons.Ionicons} name="person-outline" size={ms(16)} color="#64748B" />
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="e.g. Dr. Priya Nair"
                                    placeholderTextColor="#9CA3AF"
                                    value={doctorName}
                                    onChangeText={setDoctorName}
                                />
                            </View>

                            {/* Date of Appointment */}
                            <Text style={styles.fieldLabel}>Date of Appointment</Text>
                            <TouchableOpacity style={styles.inputWrap} activeOpacity={0.7} onPress={() => setShowDatePicker(true)}>
                                <Icon type={Icons.Ionicons} name="calendar-outline" size={ms(16)} color="#64748B" />
                                <Text style={[styles.fieldInput, !appointmentDate && { color: '#9CA3AF' }]}>
                                    {appointmentDate || 'Select date'}
                                </Text>
                                <Icon type={Icons.Ionicons} name="chevron-down" size={ms(14)} color="#64748B" />
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
                            <Text style={styles.fieldLabel}>Upload Document</Text>
                            <TouchableOpacity style={styles.modalUploadZone} activeOpacity={0.8} onPress={openFilePicker}>
                                <Icon type={Icons.Ionicons} name="cloud-upload-outline" size={ms(22)} color={primaryColor} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.modalUploadTitle}>
                                        {pickedFile ? pickedFile.name : 'Tap to upload'}
                                    </Text>
                                    <Text style={styles.modalUploadSub}>
                                        {pickedFile
                                            ? pickedFile.size ? `${(pickedFile.size / 1024).toFixed(0)} KB` : 'File selected'
                                            : 'PDF, JPG or PNG'}
                                    </Text>
                                </View>
                                {pickedFile
                                    ? <Icon type={Icons.Ionicons} name="checkmark-circle" size={ms(20)} color={primaryColor} />
                                    : <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(16)} color="#64748B" />}
                            </TouchableOpacity>

                            {/* Submit */}
                            <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={handleSubmit}>
                                <Text style={styles.submitBtnText}>Save Record</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default MedicalRecordsVault;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    headerGradient: { flex: 1, paddingTop: ms(50) },
    contentArea: { flex: 1, backgroundColor: 'transparent' },

    // Header
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(16), paddingHorizontal: ms(20) },
    backButton: { width: ms(34), height: ms(34), borderRadius: ms(17), backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center', marginRight: ms(12) },
    headerTitle: { flex: 1, fontSize: ms(20), fontFamily: heading, color: whiteColor },
    headerIcons: { flexDirection: 'row', alignItems: 'center', gap: ms(10) },
    iconCircle: { backgroundColor: whiteColor, padding: ms(8), borderRadius: ms(20) },
    profileImage: { width: ms(35), height: ms(35), borderRadius: ms(17.5), borderWidth: 1, borderColor: whiteColor },
    defaultProfileIcon: { backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center' },

    // Tabs
    tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: ms(25), padding: ms(4), marginHorizontal: ms(20), marginBottom: vs(2) },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ms(5), paddingVertical: vs(10), borderRadius: ms(22) },
    activeTab: { backgroundColor: whiteColor, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
    tabText: { fontSize: ms(13), fontFamily: interMedium, color: whiteColor },
    activeTabText: { color: primaryColor },
    tabBadge: { backgroundColor: primaryColor, borderRadius: ms(8), paddingHorizontal: ms(5), paddingVertical: vs(1) },
    tabBadgeText: { fontSize: ms(9), fontFamily: interMedium, color: whiteColor },

    scrollPad: { paddingHorizontal: ms(14), paddingTop: vs(14) },

    // Stats Row
    statsRow: { flexDirection: 'row', gap: ms(8), marginBottom: vs(14) },
    statCard: { flex: 1, backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(11), borderWidth: 0.5, borderColor: primaryColor + '22' },
    statLabel: { fontFamily: interRegular, fontSize: ms(9), color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(3) },
    statValue: { fontFamily: interMedium, fontSize: ms(20), color: blackColor },
    statValueUnit: { fontSize: ms(12), color: '#64748B' },
    statSub: { fontFamily: interRegular, fontSize: ms(9), color: primaryColor, marginTop: vs(2) },

    // Upload Zone
    uploadZone: {
        borderWidth: 1.5, borderStyle: 'dashed', borderColor: primaryColor + '55',
        borderRadius: ms(14), padding: ms(20), alignItems: 'center',
        backgroundColor: primaryColor + '05', marginBottom: vs(16),
    },
    uploadIconCircle: { width: ms(48), height: ms(48), borderRadius: ms(24), backgroundColor: primaryColor + '18', justifyContent: 'center', alignItems: 'center', marginBottom: vs(10) },
    uploadTitle: { fontFamily: heading, fontSize: ms(14), color: blackColor, marginBottom: vs(4) },
    uploadSub: { fontFamily: interRegular, fontSize: ms(12), color: '#64748B' },
    uploadSubLink: { color: primaryColor, fontFamily: interMedium },
    uploadHint: { fontFamily: interRegular, fontSize: ms(10), color: '#94A3B8', marginTop: vs(8), textAlign: 'center' },

    // Section Header
    secHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: vs(12) },
    secTitle: { fontFamily: heading, fontSize: ms(15), color: blackColor },
    secSub: { fontFamily: interRegular, fontSize: ms(11), color: '#64748B', marginTop: vs(2) },
    ghostBtn: { flexDirection: 'row', alignItems: 'center', gap: ms(4), borderWidth: 1, borderColor: primaryColor, borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(5) },
    ghostBtnText: { fontFamily: interMedium, fontSize: ms(11), color: primaryColor },

    // Reports Grid
    reportsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    reportCard: {
        width: (width - ms(28) - ms(10)) / 2,
        backgroundColor: whiteColor, borderRadius: ms(12),
        padding: ms(12), borderWidth: 0.5, borderColor: primaryColor + '20',
        overflow: 'hidden', marginBottom: ms(10),
    },
    reportCardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: ms(3), backgroundColor: primaryColor, borderRadius: ms(12) },
    reportCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8), marginTop: vs(2) },
    pdfBadge: { backgroundColor: '#FEE2E2', borderRadius: ms(4), paddingHorizontal: ms(6), paddingVertical: vs(2) },
    pdfBadgeText: { fontFamily: interMedium, fontSize: ms(9), color: '#DC2626', letterSpacing: 0.5 },
    reportStatusBadge: { borderRadius: ms(5), paddingHorizontal: ms(7), paddingVertical: vs(2) },
    reportStatusText: { fontFamily: interMedium, fontSize: ms(9) },
    reportName: { fontFamily: heading, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    reportLab: { fontFamily: interRegular, fontSize: ms(10), color: '#64748B', marginBottom: vs(8) },
    reportMarkers: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(4), marginBottom: vs(8) },
    markerChip: { backgroundColor: primaryColor + '15', borderRadius: ms(4), paddingHorizontal: ms(6), paddingVertical: vs(2) },
    markerChipText: { fontFamily: interMedium, fontSize: ms(9), color: primaryColor },
    reportFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: primaryColor + '20', paddingTop: vs(8) },
    reportDate: { fontFamily: interRegular, fontSize: ms(10), color: '#64748B' },
    reportSize: { fontFamily: interRegular, fontSize: ms(10), color: '#94A3B8' },
    addReportCard: { justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', opacity: 0.7 },
    addReportText: { fontFamily: interRegular, fontSize: ms(12), color: '#94A3B8', marginTop: vs(4) },

    // Biomarker Search + Filter
    bmHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(10), marginBottom: vs(12) },
    searchWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: whiteColor, borderRadius: ms(8), borderWidth: 0.5, borderColor: primaryColor + '30', paddingHorizontal: ms(10), height: vs(36) },
    searchIcon: { marginRight: ms(6) },
    searchInput: { flex: 1, fontFamily: interRegular, fontSize: ms(12), color: blackColor, padding: 0 },
    filterGroup: { flexDirection: 'row', gap: ms(5) },
    filterChip: { paddingHorizontal: ms(10), paddingVertical: vs(5), borderRadius: ms(20), borderWidth: 0.5, borderColor: primaryColor + '40', backgroundColor: 'transparent' },
    filterChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    filterChipText: { fontFamily: interMedium, fontSize: ms(10), color: '#64748B' },
    filterChipTextActive: { color: whiteColor },

    // Biomarker Table
    bmTable: { backgroundColor: whiteColor, borderRadius: ms(12), borderWidth: 0.5, borderColor: primaryColor + '20', overflow: 'hidden', marginBottom: vs(14) },
    bmRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(12), paddingHorizontal: ms(12), gap: ms(8) },
    bmRowBorder: { borderBottomWidth: 0.5, borderBottomColor: primaryColor + '10' },
    bmNameCol: { width: ms(90) },
    bmName: { fontFamily: interMedium, fontSize: ms(11), color: blackColor },
    bmCat: { fontFamily: interRegular, fontSize: ms(9), color: '#64748B', marginTop: vs(1) },
    bmValueCol: { flex: 1, alignItems: 'center' },
    bmValue: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    bmUnit: { fontFamily: interRegular, fontSize: ms(10), color: '#64748B' },
    rangeBar: { height: vs(5), backgroundColor: '#E2E8F0', borderRadius: ms(3), overflow: 'visible', marginTop: vs(4), marginBottom: vs(3), position: 'relative' },
    rangeFill: { height: '100%', borderRadius: ms(3) },
    rangeDot: { position: 'absolute', width: ms(8), height: ms(8), borderRadius: ms(4), borderWidth: 2, borderColor: whiteColor, top: vs(-1.5), transform: [{ translateX: -ms(4) }] },
    rangeText: { fontFamily: interRegular, fontSize: ms(9), color: '#94A3B8' },
    testedRow: { flexDirection: 'row', alignItems: 'center', gap: ms(3), marginTop: vs(4) },
    testedText: { fontFamily: interRegular, fontSize: ms(9), color: '#9CA3AF' },
    bmStatusCol: { alignItems: 'flex-end', gap: vs(3) },
    statusPill: { borderRadius: ms(6), paddingHorizontal: ms(7), paddingVertical: vs(2) },
    statusPillText: { fontFamily: interMedium, fontSize: ms(9), letterSpacing: 0.2 },
    trendRow: { flexDirection: 'row', alignItems: 'center', gap: ms(2), marginTop: vs(2) },
    trendText: { fontFamily: interMedium, fontSize: ms(9) },

    // Action Row
    actionRow: { flexDirection: 'row', alignItems: 'center', gap: ms(12), backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(14), borderWidth: 0.5, borderColor: primaryColor + '20' },
    actionTitle: { fontFamily: heading, fontSize: ms(13), color: blackColor, marginBottom: vs(2) },
    actionSub: { fontFamily: interRegular, fontSize: ms(11), color: '#64748B' },
    actionBtn: { backgroundColor: primaryColor, borderRadius: ms(8), paddingHorizontal: ms(14), paddingVertical: vs(8) },
    actionBtnText: { fontFamily: interMedium, fontSize: ms(12), color: whiteColor },

    // FAB
    fab: {
        position: 'absolute', bottom: vs(24), right: ms(20),
        width: ms(54), height: ms(54), borderRadius: ms(27),
        backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center',
        elevation: 6, shadowColor: primaryColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 6,
    },

    // Modal
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
    modalSheet: {
        backgroundColor: whiteColor, borderTopLeftRadius: ms(24), borderTopRightRadius: ms(24),
        paddingHorizontal: ms(20), paddingTop: vs(20), paddingBottom: vs(36),
    },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(18) },
    modalTitle: { fontFamily: heading, fontSize: ms(16), color: blackColor },
    modalCloseBtn: { width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
    fieldLabel: { fontFamily: interMedium, fontSize: ms(13), color: '#374151', marginBottom: vs(6) },
    inputWrap: {
        flexDirection: 'row', alignItems: 'center', gap: ms(10),
        borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(10),
        paddingHorizontal: ms(12), paddingVertical: vs(10), marginBottom: vs(14), backgroundColor: '#F9FAFB',
    },
    fieldInput: { flex: 1, fontFamily: interRegular, fontSize: ms(13), color: blackColor, padding: 0 },
    modalUploadZone: {
        flexDirection: 'row', alignItems: 'center', gap: ms(12),
        borderWidth: 1.5, borderStyle: 'dashed', borderColor: primaryColor + '55',
        borderRadius: ms(12), padding: ms(14), backgroundColor: primaryColor + '06', marginBottom: vs(20),
    },
    modalUploadTitle: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    modalUploadSub: { fontFamily: interRegular, fontSize: ms(11), color: '#64748B', marginTop: vs(2) },
    submitBtn: {
        backgroundColor: primaryColor, borderRadius: ms(12),
        paddingVertical: vs(13), alignItems: 'center',
    },
    submitBtnText: { fontFamily: interMedium, fontSize: ms(14), color: whiteColor },
});
