import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
    Platform,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { bold, regular, img_url, doctor } from '../../config/Constants';
import {
    blackColor,
    primaryColor,
    whiteColor,
    globalGradient,
    grayColor,
} from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';
import { LoadCustomerProfileAction } from '../../redux/actions/CustomerProfileActions';

const TABS = ['Personal Information', 'Vital Info', 'Medical Summary', 'Wellness'];

const FILTERS = ['All', 'Lifestyle', 'Medical History', 'Family'];

const LIFESTYLE_CATEGORIES = [
    {
        id: 'habits',
        title: 'Habits',
        image: require('../../assets/img/habbit.png'),
        fields: [
            { label: 'Smoking Status', key: 'smoking_status', fallback: 'Non-smoker' },
            { label: 'Alcohol Consumption', key: 'alcohol_consumption', fallback: 'Occasionally' },
            { label: 'Tobacco Usage', key: 'tobacco_usage', fallback: 'No' },
        ],
    },
    {
        id: 'diet',
        title: 'Diet & Nutrition',
        image: require('../../assets/img/dite.png'),
        fields: [
            { label: 'Diet Type', key: 'diet_type', fallback: '-' },
            { label: 'Daily Water Intake', key: 'water_intake', fallback: '-' },
            { label: 'Caffeine Intake', key: 'caffeine_intake', fallback: '-' },
        ],
    },
    {
        id: 'activity',
        title: 'Physical Activity',
        image: require('../../assets/img/physicalactivites.png'),
        fields: [
            { label: 'Exercise Frequency', key: 'exercise_frequency', fallback: '-' },
            { label: 'Exercise Type', key: 'exercise_type', fallback: '-' },
            { label: 'Average Duration', key: 'avg_duration', fallback: '-' },
        ],
    },
    {
        id: 'work',
        title: 'Work & Stress',
        image: require('../../assets/img/workstress.png'),
        fields: [
            { label: 'Work Type', key: 'work_type', fallback: '-' },
            { label: 'Stress Level', key: 'stress_level', fallback: '-' },
        ],
    },
    {
        id: 'sleep',
        title: 'Sleep Pattern',
        image: require('../../assets/img/sleep.png'),
        fields: [
            { label: 'Avg Sleep Duration', key: 'sleep_duration', fallback: '-' },
            { label: 'Sleep Quality', key: 'sleep_quality', fallback: '-' },
        ],
    },
];

const MEDICAL_CATEGORIES = [
    {
        id: 'conditions',
        title: 'Existing Medical Conditions',
        type: 'chips',
        data: ['Diabetes', 'Heart Disease', 'Smoking Status'],
    },
    {
        id: 'medications',
        title: 'Current Medications',
        type: 'cards',
        data: [
            { Medicine: 'Paracetamol', Dosage: '250 mg', Frequency: 'Once daily', Duration: '3 days' },
            { Medicine: 'Amoxicillin', Dosage: '500 mg', Frequency: 'Twice daily', Duration: '5 days' },
        ],
    },
    {
        id: 'surgeries',
        title: 'Past Surgeries & Hospitalizations',
        type: 'cards',
        data: [
            { 'Surgery Name': 'Appendix Removal', 'Surgery Date': '25 Jan 2025' },
            { 'Surgery Name': 'Knee Replacement', 'Surgery Date': '10 Mar 2024' },
        ],
    },
    {
        id: 'allergies',
        title: 'Allergies & Reactions',
        type: 'allergyCards',
        data: [
            { category: 'Food Allergies', items: ['Penicillin', 'Penicillin', 'Penicillin', 'Penicillin'] },
            { category: 'Medicine Allergies', items: ['Aspirin', 'Ibuprofen'] },
        ],
    },
    {
        id: 'women',
        title: 'Women-Specific Details',
        type: 'womenCards',
        data: [
            { category: 'Pregnancy Status', items: ['Are you currently pregnant?', 'Planning Pregnancy'] },
            { category: 'Menstrual History', items: ['Irregular', 'Heavy / Painful periods'] },
        ],
    },
];

const FAMILY_MEMBERS = [
    { id: 'father', title: 'Father', image: require('../../assets/img/father.png'), fields: [{ label: 'Name', value: 'Ramesh Kumar' }, { label: 'Mobile', value: '+91 9876543210' }, { label: 'Age', value: '55 Years' }] },
    { id: 'mother', title: 'Mother', image: require('../../assets/img/mother.png'), fields: [{ label: 'Name', value: 'Lakshmi Devi' }, { label: 'Mobile', value: '+91 9876543211' }, { label: 'Age', value: '50 Years' }] },
    { id: 'son', title: 'Son', image: require('../../assets/img/son.png'), fields: [{ label: 'Name', value: 'Arjun Kumar' }, { label: 'Mobile', value: '+91 9876543212' }, { label: 'Age', value: '8 Years' }] },
    { id: 'daughter', title: 'Daughter', image: require('../../assets/img/daugther.png'), fields: [{ label: 'Name', value: 'Priya Kumar' }, { label: 'Mobile', value: '+91 9876543213' }, { label: 'Age', value: '5 Years' }] },
    { id: 'other', title: 'Other Family Members', image: require('../../assets/img/other.png'), fields: [{ label: 'Name', value: 'Suresh Kumar' }, { label: 'Mobile', value: '+91 9876543214' }, { label: 'Relation', value: 'Brother' }] },
];

const MEDICAL_SUMMARY_DATA = [
    {
        id: '1',
        date: '07 Feb, 2026, 12:30 PM',
        summary: 'The patient has stable health with ongoing treatment for chronic...',
    },
    {
        id: '2',
        date: '15 Jan, 2026, 12:30 PM',
        summary: 'Follow-up visit. Vitals within normal range. Medication continued...',
    },
    {
        id: '3',
        date: '24 Dec, 2025, 12:30 PM',
        summary: 'Routine check-up completed. Blood work results normal...',
    },
    {
        id: '4',
        date: '24 Dec, 2025, 12:30 PM',
        summary: 'Initial consultation for recurring symptoms...',
    },
    {
        id: '5',
        date: '24 Dec, 2025, 12:30 PM',
        summary: 'Prescribed medication adjustment based on lab results...',
    },
    {
        id: '6',
        date: '24 Dec, 2025, 12:30 PM',
        summary: 'Scheduled follow-up for monitoring...',
    },
    {
        id: '7',
        date: '24 Dec, 2025, 12:30 PM',
        summary: 'Annual health screening completed...',
    },
];

const ACTION_CARDS = [
    {
        id: 'doctor_notes',
        title: 'View\nDoctor Notes',
        image: require('../../assets/img/vdn.png'),
        bgColor: '#DBEAFE',
    },
    {
        id: 'lab_reports',
        title: 'View\nLab Reports',
        image: require('../../assets/img/vlr.png'),
        bgColor: '#FEF2F2',
    },
    {
        id: 'medication',
        title: 'View\nMedication Presc...',
        image: require('../../assets/img/vmp.png'),
        bgColor: '#F0FDF4',
    },
];

const calculateAge = (dobString) => {
    if (!dobString) return '';
    let birthDate;
    if (dobString.includes('/')) {
        const [day, month, year] = dobString.split('/');
        birthDate = new Date(year, month - 1, day);
    } else if (dobString.includes('-')) {
        birthDate = new Date(dobString);
    } else {
        return '';
    }
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    if (months < 0) {
        years--;
        months += 12;
    }
    if (now.getDate() < birthDate.getDate()) {
        months--;
        if (months < 0) {
            years--;
            months += 12;
        }
    }
    return `${years} Years, ${months} Months`;
};

const formatDOBDisplay = (dobString) => {
    if (!dobString) return '';
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let day, month, year;
    if (dobString.includes('/')) {
        [day, month, year] = dobString.split('/');
    } else if (dobString.includes('-')) {
        [year, month, day] = dobString.split('-');
    } else {
        return dobString;
    }
    return `${parseInt(day)} ${monthNames[parseInt(month) - 1]} ${year}`;
};

const PatientMedicalSummary = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(0);
    const [activeFilter, setActiveFilter] = useState('All');
    const [expandedCard, setExpandedCard] = useState(null);
    const [expandedSummary, setExpandedSummary] = useState('1');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(LoadCustomerProfileAction(global.id))
            .then((response) => {
                setProfileData(response.result);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const toggleExpand = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    const genderDisplay = profileData?.gender
        ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1)
        : '-';

    const renderPersonalInfoCard = () => (
        <View style={styles.personalCard}>
            <View style={styles.profileRow}>
                <Image
                    style={styles.profileImage}
                    resizeMode="cover"
                    source={
                        profileData?.profile_picture
                            ? { uri: `${img_url}${profileData.profile_picture}` }
                            : doctor
                    }
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                        {profileData?.customer_name || 'User'}
                    </Text>
                    {profileData?.date_of_birth ? (
                        <Text style={styles.profileAge}>
                            {calculateAge(profileData.date_of_birth)}
                        </Text>
                    ) : null}
                </View>
            </View>
            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Surname</Text>
                    <Text style={styles.infoValue}>{profileData?.surname || '-'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Gender</Text>
                    <Text style={styles.infoValue}>{genderDisplay}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Date of Birth</Text>
                    <Text style={styles.infoValue}>
                        {formatDOBDisplay(profileData?.date_of_birth) || '-'}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderFilterChips = () => (
        <View style={styles.filterRow}>
            {FILTERS.map((filter) => (
                <TouchableOpacity
                    key={filter}
                    style={[
                        styles.filterChip,
                        activeFilter === filter && styles.filterChipActive,
                    ]}
                    onPress={() => setActiveFilter(filter)}
                >
                    <Text
                        style={[
                            styles.filterText,
                            activeFilter === filter && styles.filterTextActive,
                        ]}
                        numberOfLines={1}
                    >
                        {filter}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderLifestyleCards = () => (
        <>
            {LIFESTYLE_CATEGORIES.map((cat) => {
                const isExpanded = expandedCard === cat.id;
                return (
                    <View key={cat.id}>
                        <TouchableOpacity
                            style={styles.expandCard}
                            activeOpacity={0.7}
                            onPress={() => toggleExpand(cat.id)}
                        >
                            <Image source={cat.image} style={styles.expandCardImage} />
                            <Text style={styles.expandCardTitle}>{cat.title}</Text>
                            <Icon
                                type={Icons.Feather}
                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                color={blackColor}
                                size={ms(18)}
                            />
                        </TouchableOpacity>
                        {isExpanded && (
                            <View style={styles.expandedContent}>
                                {cat.fields.map((field, idx) => (
                                    <View key={field.key}>
                                        <View style={styles.expandedRow}>
                                            <Text style={styles.expandedLabel}>{field.label}</Text>
                                            <Text style={styles.expandedValue}>
                                                {profileData?.[field.key] || field.fallback}
                                            </Text>
                                        </View>
                                        {idx < cat.fields.length - 1 && (
                                            <View style={styles.expandedDivider} />
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                );
            })}
        </>
    );

    const renderMedicalHistoryCards = () => (
        <>
            {MEDICAL_CATEGORIES.map((cat) => {
                const isExpanded = expandedCard === cat.id;
                return (
                    <View key={cat.id}>
                        <TouchableOpacity
                            style={styles.medicalExpandCard}
                            activeOpacity={0.7}
                            onPress={() => toggleExpand(cat.id)}
                        >
                            <Text style={styles.medicalExpandTitle}>{cat.title}</Text>
                            <Icon
                                type={Icons.Feather}
                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                color={blackColor}
                                size={ms(18)}
                            />
                        </TouchableOpacity>
                        {isExpanded && (
                            <View style={styles.medicalExpandedContent}>
                                {cat.type === 'chips' && (
                                    <View style={styles.chipsRow}>
                                        {cat.data.map((chip, idx) => (
                                            <View key={idx} style={styles.chipItem}>
                                                <Text style={styles.chipText}>{chip}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                                {cat.type === 'cards' && (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {cat.data.map((card, idx) => (
                                            <View key={idx} style={styles.medDataCard}>
                                                {Object.entries(card).map(([key, val], i) => (
                                                    <View key={i} style={styles.medDataRow}>
                                                        <Text style={styles.medDataLabel}>{key}</Text>
                                                        <Text style={styles.medDataValue}>{val}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}
                                {cat.type === 'allergyCards' && (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {cat.data.map((group, idx) => (
                                            <View key={idx} style={styles.allergyCard}>
                                                <View style={styles.allergyCategoryChip}>
                                                    <Text style={styles.allergyCategoryText}>{group.category}</Text>
                                                </View>
                                                <View style={styles.allergyItemsRow}>
                                                    {group.items.map((item, i) => (
                                                        <Text key={i} style={styles.allergyItemText}>{i + 1}. {item}</Text>
                                                    ))}
                                                </View>
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}
                                {cat.type === 'womenCards' && (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {cat.data.map((group, idx) => (
                                            <View key={idx} style={styles.allergyCard}>
                                                <View style={styles.allergyCategoryChip}>
                                                    <Text style={styles.allergyCategoryText}>{group.category}</Text>
                                                </View>
                                                {group.items.map((item, i) => (
                                                    <Text key={i} style={styles.womenItemText}>{item}</Text>
                                                ))}
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>
                        )}
                    </View>
                );
            })}
        </>
    );

    const renderFamilyCards = () => (
        <>
            {FAMILY_MEMBERS.map((member) => {
                const isExpanded = expandedCard === member.id;
                return (
                    <View key={member.id}>
                        <TouchableOpacity
                            style={styles.expandCard}
                            activeOpacity={0.7}
                            onPress={() => toggleExpand(member.id)}
                        >
                            <Image source={member.image} style={styles.expandCardImage} />
                            <Text style={styles.expandCardTitle}>{member.title}</Text>
                            <Icon
                                type={Icons.Feather}
                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                color={blackColor}
                                size={ms(18)}
                            />
                        </TouchableOpacity>
                        {isExpanded && (
                            <View style={styles.expandedContent}>
                                {member.fields.map((field, idx) => (
                                    <View key={field.label}>
                                        <View style={styles.expandedRow}>
                                            <Text style={styles.expandedLabel}>{field.label}</Text>
                                            <Text style={styles.expandedValue}>{field.value}</Text>
                                        </View>
                                        {idx < member.fields.length - 1 && (
                                            <View style={styles.expandedDivider} />
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                );
            })}
        </>
    );

    const renderFilteredContent = () => {
        switch (activeFilter) {
            case 'Lifestyle':
                return renderLifestyleCards();
            case 'Medical History':
                return renderMedicalHistoryCards();
            case 'Family':
                return renderFamilyCards();
            case 'All':
            default:
                return (
                    <>
                        {renderLifestyleCards()}
                        {renderMedicalHistoryCards()}
                        {renderFamilyCards()}
                    </>
                );
        }
    };

    const renderPersonalInfoTab = () => (
        <>
            {renderPersonalInfoCard()}
            {renderFilterChips()}
            {renderFilteredContent()}
        </>
    );

    const toggleSummaryExpand = (id) => {
        setExpandedSummary(expandedSummary === id ? null : id);
    };

    const renderMiniPatientCard = () => (
        <View style={styles.miniPatientCard}>
            <Text style={styles.miniPatientLabel}>Patient  Information</Text>
            <View style={styles.miniProfileRow}>
                <Image
                    style={styles.miniProfileImage}
                    resizeMode="cover"
                    source={
                        profileData?.profile_picture
                            ? { uri: `${img_url}${profileData.profile_picture}` }
                            : doctor
                    }
                />
                <Text style={styles.miniProfileName}>
                    {profileData?.customer_name || 'User'}
                </Text>
                {profileData?.date_of_birth ? (
                    <Text style={styles.miniProfileAge}>
                        {calculateAge(profileData.date_of_birth)}
                    </Text>
                ) : null}
            </View>
        </View>
    );

    const renderMedicalSummaryTab = () => (
        <>
            {renderMiniPatientCard()}
            <Text style={styles.sectionTitle}>Medical Summary</Text>
            {MEDICAL_SUMMARY_DATA.map((item) => {
                const isExpanded = expandedSummary === item.id;
                return (
                    <View key={item.id}>
                        <TouchableOpacity
                            style={styles.summaryCard}
                            activeOpacity={0.7}
                            onPress={() => toggleSummaryExpand(item.id)}
                        >
                            <Text style={styles.summaryDate}>{item.date}</Text>
                            <Icon
                                type={Icons.Feather}
                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                color={blackColor}
                                size={ms(18)}
                            />
                        </TouchableOpacity>
                        {isExpanded && (
                            <View style={styles.summaryExpandedContent}>
                                <Text style={styles.summaryText}>{item.summary}</Text>
                                <View style={styles.actionCardsRow}>
                                    {ACTION_CARDS.map((card) => (
                                        <TouchableOpacity
                                            key={card.id}
                                            style={[styles.actionCard, { backgroundColor: card.bgColor }]}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                if (card.id === 'doctor_notes') {
                                                    navigation.navigate('DoctorNotes', { date: item.date });
                                                } else if (card.id === 'lab_reports') {
                                                    navigation.navigate('LabReports', { date: item.date });
                                                } else if (card.id === 'medication') {
                                                    navigation.navigate('MedicationPrescription', { date: item.date });
                                                }
                                            }}
                                        >
                                            <Image
                                                source={card.image}
                                                style={styles.actionCardImage}
                                            />
                                            <Text style={styles.actionCardTitle} numberOfLines={2}>
                                                {card.title}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                );
            })}
        </>
    );

    const renderPlaceholderTab = (title) => (
        <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>{title} - Coming Soon</Text>
        </View>
    );

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.13]}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon
                            type={Icons.Ionicons}
                            name="arrow-back"
                            color={blackColor}
                            size={ms(20)}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                        Patient & Medical Summary
                    </Text>
                </View>

                {/* Tab Bar */}
                <View style={styles.tabBarWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabBarContainer}
                    >
                        {TABS.map((tab, index) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.tabItem,
                                    activeTab === index && styles.tabItemActive,
                                ]}
                                onPress={() => setActiveTab(index)}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === index && styles.tabTextActive,
                                    ]}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Content */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {activeTab === 0 && renderPersonalInfoTab()}
                    {activeTab === 1 && renderPlaceholderTab('Vital Info')}
                    {activeTab === 2 && renderMedicalSummaryTab()}
                    {activeTab === 3 && renderPlaceholderTab('Wellness')}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const PROFILE_IMAGE_SIZE = ms(60);

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
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
        fontSize: ms(18),
        color: whiteColor,
        marginLeft: ms(12),
    },

    // Tab Bar
    tabBarContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(10),
        marginTop:ms(10)
    },
    tabItem: {
        paddingBottom: vs(6),
        paddingHorizontal: ms(10),
        borderBottomWidth: ms(1),
        borderBottomColor: '#ccc',
    },
    tabItemActive: {
        borderBottomColor: primaryColor,
        borderBottomWidth:ms(3),
    },
    tabText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#9CA3AF',
    },
    tabTextActive: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
    },

    // Content
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },

    // Personal Information Card
    personalCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(16),
        padding: ms(18),
        marginBottom: vs(16),
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(14),
    },
    profileImage: {
        width: PROFILE_IMAGE_SIZE,
        height: PROFILE_IMAGE_SIZE,
        borderRadius: PROFILE_IMAGE_SIZE / 2,
        borderWidth: ms(2),
        borderColor: '#E5E7EB',
    },
    profileInfo: {
        flex: 1,
        marginLeft: ms(14),
    },
    profileName: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
    },
    profileAge: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        marginTop: vs(2),
    },

    // Info Rows
    infoSection: {
        marginTop: vs(4),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(10),
    },
    infoLabel: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#6B7280',
    },
    infoValue: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
    },
    divider: {
        height: ms(0.5),
        backgroundColor: '#E5E7EB',
    },

    // Filter Chips
    filterRow: {
        flexDirection: 'row',
        gap: ms(8),
        marginBottom: vs(16),
    },
    filterChip: {
        paddingHorizontal: ms(14),
        paddingVertical: vs(6),
        borderRadius: ms(20),
        backgroundColor: '#F1F5F9',
    },
    filterChipActive: {
        backgroundColor: primaryColor,
    },
    filterText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    filterTextActive: {
        fontFamily: bold,
        color: whiteColor,
    },

    // Expandable Cards
    expandCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(14),
        paddingHorizontal: ms(14),
        paddingVertical: vs(12),
        marginBottom: vs(10),
    },
    expandCardImage: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(10),
        resizeMode: 'contain',
    },
    expandCardTitle: {
        flex: 1,
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginLeft: ms(12),
    },

    // Expanded Content
    expandedContent: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(12),
        paddingHorizontal: ms(16),
        paddingVertical: vs(8),
        marginTop: vs(-6),
        marginBottom: vs(10),
    },
    expandedRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(10),
    },
    expandedLabel: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    expandedValue: {
        fontFamily: bold,
        fontSize: ms(12),
        color: blackColor,
    },
    expandedDivider: {
        height: ms(0.5),
        backgroundColor: '#E5E7EB',
    },

    // Medical History Expandable Cards
    medicalExpandCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(14),
        paddingHorizontal: ms(14),
        paddingVertical: vs(14),
        marginBottom: vs(10),
    },
    medicalExpandTitle: {
        flex: 1,
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
    },
    medicalExpandedContent: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(12),
        paddingHorizontal: ms(14),
        paddingVertical: vs(12),
        marginTop: vs(-6),
        marginBottom: vs(10),
    },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(8),
    },
    chipItem: {
        paddingHorizontal: ms(14),
        paddingVertical: vs(6),
        borderRadius: ms(20),
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    chipText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: blackColor,
    },
    medDataCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(14),
        marginRight: ms(10),
        minWidth: ms(180),
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    medDataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: vs(6),
    },
    medDataLabel: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    medDataValue: {
        fontFamily: bold,
        fontSize: ms(12),
        color: blackColor,
        marginLeft: ms(10),
    },
    allergyCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(14),
        marginRight: ms(10),
        minWidth: ms(200),
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    allergyCategoryChip: {
        alignSelf: 'flex-start',
        paddingHorizontal: ms(12),
        paddingVertical: vs(5),
        borderRadius: ms(16),
        backgroundColor: '#F1F5F9',
        marginBottom: vs(8),
    },
    allergyCategoryText: {
        fontFamily: bold,
        fontSize: ms(11),
        color: blackColor,
    },
    allergyItemsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(6),
    },
    allergyItemText: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
    },
    womenItemText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        marginBottom: vs(4),
    },

    // Mini Patient Card (Medical Summary Tab)
    miniPatientCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(16),
        padding: ms(14),
        marginBottom: vs(16),
        marginTop: vs(10),
    },
    miniPatientLabel: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(10),
    },
    miniProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniProfileImage: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        borderWidth: ms(1),
        borderColor: '#E5E7EB',
    },
    miniProfileName: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginLeft: ms(10),
    },
    miniProfileAge: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        marginLeft: ms(10),
    },

    // Section Title
    sectionTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
        marginBottom: vs(12),
    },

    // Summary Cards (Medical Summary Tab)
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: ms(14),
        paddingHorizontal: ms(16),
        paddingVertical: vs(14),
        marginBottom: vs(10),
    },
    summaryDate: {
        flex: 1,
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
    },
    summaryExpandedContent: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(14),
        paddingHorizontal: ms(16),
        paddingVertical: vs(10),
        marginTop: vs(-6),
        marginBottom: vs(10),
    },
    summaryText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        lineHeight: ms(18),
        marginBottom: vs(12),
    },
    actionCardsRow: {
        gap: ms(10),
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
    },
    actionCard: {
        width: ms(90),
        borderRadius: ms(12),
        padding: ms(10),
        alignItems: 'center',
    },
    actionCardImage: {
        width: ms(60),
        height: ms(60),
        resizeMode: 'contain',
        marginBottom: vs(6),
    },
    actionCardTitle: {
        fontFamily: regular,
        fontSize: ms(10),
        color: blackColor,
        textAlign: 'center',
    },

    // Placeholder
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: vs(60),
    },
    placeholderText: {
        fontFamily: regular,
        fontSize: ms(14),
        color: '#9CA3AF',
    },
});

export default PatientMedicalSummary;
