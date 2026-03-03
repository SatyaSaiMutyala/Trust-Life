import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';
import InputField from '../../utils/InputField';

const LAB_CATEGORIES = [
    {
        title: 'Haematology',
        tests: [
            'Haematology', 'TC, DC', 'ESR', 'BT, CT',
            'Direct & Indirect Coombs Test', 'Absolute Eosinophil Count',
            'Platelet count', 'Coagulation Profile (PT, APTT, INR)',
        ],
        hasMore: true,
    },
    {
        title: 'Biochemistry',
        tests: [
            'Serum Bilirubin (Total & Direct)', 'Iron Profile',
            'Total Protein / Albumin', 'Liver Function Test',
            'S-Uric Acid', 'Lipid Profile',
            'FBS, PPBS', 'Blood Urea/BUN',
            'S-Creatinine', 'Kidney Function Test',
        ],
        hasMore: true,
    },
    {
        title: 'Microbiology & Serology',
        tests: [
            'AFB Smear/Stain', 'Gram Stain',
            'HIV Test I & II', 'HBSAg',
            'HCV', 'Typhidot',
            'Widal', 'HIV Western Blot',
            'CRP', 'Blood Grouping & Rh',
        ],
        hasMore: true,
    },
    {
        title: 'Special Tests',
        tests: [
            'ABG (Arterial Blood Gas)', 'Pregnancy Test',
            'Semen Analysis', 'AFP',
            'Synovial Fluid Analysis', 'Pleural Fluid Analysis',
        ],
        hasMore: true,
    },
    {
        title: 'Hormone Lab',
        tests: [
            'FSH', 'LH',
            'PRL', 'T3, T4, TSH',
            'FT3, FT4, TSH', 'TSH',
            'PTH', 'Vit D',
        ],
        hasMore: false,
    },
    {
        title: 'Clinical Pathology',
        tests: [
            'Complete Urine Analysis', 'Urine Ketone',
            'Urine - Bile Salt / Bile Pigment', 'Stool Routine',
            'Stool Occult Blood',
        ],
        hasMore: false,
    },
    {
        title: 'Cultural & Sensitivity',
        tests: [
            'Urine (Manual/Automated with MIC)',
            'Pus (Manual/Automated with MIC)',
            'Blood (Manual/Automated with MIC)',
            'Sputum (Manual/Automated with MIC)',
            'Stool (Manual/Automated with MIC)',
            'Stool (Manual/Automated with MIC) ',
        ],
        hasMore: false,
    },
];

const INITIAL_SELECTED = [
    'Direct & Indirect Coombs Test',
    'Liver Function Test',
    'S-Creatinine',
    'HCV',
    'Synovial Fluid Analysis',
    'T3, T4, TSH',
    'PTH',
    'Stool Occult Blood',
    'Stool (Manual/Automated with MIC)',
];

const AddLabTestScreen = () => {
    const navigation = useNavigation();
    const [selectedTests, setSelectedTests] = useState(new Set(INITIAL_SELECTED));
    const [labName, setLabName] = useState('');

    const toggleTest = (test) => {
        setSelectedTests((prev) => {
            const next = new Set(prev);
            if (next.has(test)) {
                next.delete(test);
            } else {
                next.add(test);
            }
            return next;
        });
    };

    const clearAll = () => setSelectedTests(new Set());

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Lab Tests',
            subtitle: 'Saved Successfully',
            targetScreen: 'TrustMD',
            useNavigate: true,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Lab Tests</Text>
                <Text style={styles.headerDate}>4 Feb 2026, 10:30 AM</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* Hospital Section */}
                <View style={styles.hospitalSection}>
                    <View style={{ marginBottom: ms(20) }}>
                        <Image source={require('../../assets/img/pluse.png')} style={{ width: ms(68), height: ms(68) }} resizeMode="contain" />
                    </View>
                    <Text style={styles.hospitalName}>Rama lab</Text>
                    <Text style={styles.hospitalAddress}>
                        9-126,Prakash Nagar, Hyderabad, Telangana, 5013356
                    </Text>
                    <Text style={styles.hospitalContact}>
                        +918375456  RamaHospital @gmail.com
                    </Text>
                </View>

                {/* Doctor Information */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Doctor Information</Text>
                    <View style={styles.doctorRow}>
                        <View style={styles.doctorAvatar}>
                            <Icon type={Icons.MaterialIcons} name="person" size={ms(32)} color="#BDBDBD" />
                        </View>
                        <View style={styles.doctorInfo}>
                            <Text style={styles.doctorName}>Dr.sindhu</Text>
                            <Text style={styles.doctorDegree}>MBBS, MD</Text>
                        </View>
                        <View style={styles.specialtyBadge}>
                            <Text style={styles.specialtyText}>Cardiologist</Text>
                        </View>
                    </View>
                </View>

                {/* Patient Information */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Patient Information</Text>
                    <View style={styles.patientRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.patientName}>Rahul Kumar</Text>
                            <Text style={styles.patientGender}>Male</Text>
                            <View style={styles.bloodBadge}>
                                <Text style={styles.bloodText}>Blood O⁺</Text>
                            </View>
                        </View>
                        <Text style={styles.patientAge}>27y, 3m, 6d</Text>
                    </View>
                </View>

                {/* Lab Name */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Lab Name</Text>
                    <InputField
                        placeholder="Enter lab Name"
                        value={labName}
                        onChangeText={setLabName}
                    />
                </View>

                {/* Tests Section */}
                <View style={styles.testsHeader}>
                    <View>
                        <Text style={styles.testsTitle}>Tests</Text>
                        <Text style={styles.testsCount}>{selectedTests.size} Tests Added</Text>
                    </View>
                    <TouchableOpacity onPress={clearAll}>
                        <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                </View>

                {LAB_CATEGORIES.map((category, catIdx) => (
                    <View key={catIdx} style={styles.categorySection}>
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                        <View style={styles.testsGrid}>
                            {category.tests.map((test, testIdx) => {
                                const isSelected = selectedTests.has(test);
                                return (
                                    <TouchableOpacity
                                        key={testIdx}
                                        style={styles.testItem}
                                        onPress={() => toggleTest(test)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                                            {isSelected && (
                                                <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(14)} />
                                            )}
                                        </View>
                                        <Text style={styles.testLabel} numberOfLines={2}>{test}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {category.hasMore && (
                            <TouchableOpacity style={styles.moreBtn}>
                                <Text style={styles.moreText}>10+ more</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <View style={{ height: vs(100) }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <PrimaryButton
                    title="Save Tests"
                    onPress={handleSave}
                    style={{ marginTop: 0 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default AddLabTestScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        paddingTop: ms(48),
        paddingBottom: ms(12),
    },
    backBtn: {
        marginRight: ms(10),
    },
    headerTitle: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
        flex: 1,
    },
    headerDate: {
        fontSize: ms(11),
        color: '#666',
        fontWeight: '500',
    },
    scroll: {
        paddingHorizontal: ms(16),
        paddingTop: vs(10),
    },

    // Hospital
    hospitalSection: {
        alignItems: 'center',
        paddingVertical: vs(20),
    },
    hospitalName: {
        fontSize: ms(18),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(6),
    },
    hospitalAddress: {
        fontSize: ms(11),
        color: '#666',
        textAlign: 'center',
        lineHeight: ms(16),
        marginBottom: vs(2),
    },
    hospitalContact: {
        fontSize: ms(11),
        color: '#666',
        textAlign: 'center',
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    cardTitle: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(12),
    },

    // Doctor
    doctorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    doctorAvatar: {
        width: ms(48),
        height: ms(48),
        borderRadius: ms(24),
        backgroundColor: '#F1F1F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    doctorInfo: {
        flex: 1,
    },
    doctorName: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    doctorDegree: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
    },
    specialtyBadge: {
        backgroundColor: '#F1F5F9',
        borderRadius: ms(16),
        paddingHorizontal: ms(12),
        paddingVertical: vs(5),
    },
    specialtyText: {
        fontSize: ms(11),
        color: '#555',
        fontWeight: '500',
    },

    // Patient
    patientRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    patientName: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    patientGender: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
    },
    bloodBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: ms(10),
        paddingVertical: vs(3),
        borderRadius: ms(12),
        marginTop: vs(6),
    },
    bloodText: {
        fontSize: ms(10),
        fontWeight: '600',
        color: '#EF4444',
    },
    patientAge: {
        fontSize: ms(12),
        color: '#555',
        fontWeight: '500',
    },

    // Tests Header
    testsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: vs(8),
        marginBottom: vs(10),
    },
    testsTitle: {
        fontSize: ms(16),
        fontWeight: '700',
        color: blackColor,
    },
    testsCount: {
        fontSize: ms(12),
        color: '#888',
        marginTop: vs(2),
    },
    clearText: {
        fontSize: ms(13),
        color: '#888',
        fontWeight: '500',
    },

    // Category
    categorySection: {
        marginBottom: vs(12),
    },
    categoryTitle: {
        fontSize: ms(14),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(10),
    },
    testsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    testItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        marginBottom: vs(12),
        paddingRight: ms(8),
    },
    checkbox: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(6),
        borderWidth: 1.5,
        borderColor: '#D0D5DD',
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(8),
    },
    checkboxActive: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },
    testLabel: {
        fontSize: ms(12),
        color: '#444',
        flex: 1,
    },
    moreBtn: {
        marginTop: vs(2),
        marginBottom: vs(4),
    },
    moreText: {
        fontSize: ms(12),
        color: primaryColor,
        fontWeight: '600',
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
        paddingTop: vs(10),
        backgroundColor: '#F5F7FA',
    },
});
