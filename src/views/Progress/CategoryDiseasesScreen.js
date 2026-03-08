import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

// ── All diseases grouped by category ─────────────────────────────────────────
const DISEASES_BY_CATEGORY = {
    Acute: [
        {
            id: '1', name: 'Fever', category: 'Acute', status: 'Active',
            stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7',
            date: '12 Jan, 2026  •  12:30 PM',
            description: 'Body temperature above normal, usually due to infection or inflammation',
        },
        {
            id: '2', name: 'Infection', category: 'Acute', status: 'Active',
            stability: 'Unstable', stabilityColor: '#1F2937', stabilityBgColor: '#F3F4F6',
            date: '12 Jan 2026  •  12:30 PM',
            description: 'Infection markers are under control. Continue monitoring and follow recommended care.',
        },
        {
            id: '3', name: 'Allergy', category: 'Acute', status: 'Active',
            stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7',
            date: '12 Jan 2026  •  12:30 PM',
            description: 'Your allergy levels are currently stable. There are no signs of an active reaction, but continued monitoring is recommended.',
        },
    ],
    Chronic: [
        {
            id: '1', name: 'Diabetes', category: 'Chronic', status: 'Active',
            stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7',
            date: '12 Jan, 2026  •  12:30 PM',
            description: 'Tracks your blood sugar levels to help you manage and stay within a healthy range.',
        },
        {
            id: '2', name: 'Hypertension', category: 'Chronic', status: 'Active',
            stability: 'Unstable', stabilityColor: '#1F2937', stabilityBgColor: '#F3F4F6',
            date: '12 Jan 2026  •  12:30 PM',
            description: 'Monitors your blood pressure to maintain healthy heart and circulation.',
        },
        {
            id: '3', name: 'Thyroid', category: 'Chronic', status: 'Active',
            stability: 'Critical', stabilityColor: '#DC2626', stabilityBgColor: '#FEE2E2',
            date: '12 Jan 2026  •  12:30 PM',
            description: 'Tracks your thyroid hormone levels to support metabolism and energy balance.',
        },
    ],
    'Chronic Infectious': [
        {
            id: '1', name: 'Chronic kidney disease', category: 'Chronic Infectious', status: 'Active',
            stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7',
            date: '12 Jan, 2026  •  12:30 PM',
            description: 'Tracks your blood sugar levels to help you manage and stay within a healthy range.',
        },
        {
            id: '2', name: "Alzheimer's disease", category: 'Chronic Infectious', status: 'Active',
            stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7',
            date: '12 Jan 2026  •  12:30 PM',
            description: 'Tracks your thyroid hormone levels to support metabolism and energy balance.',
        },
    ],
    Genetic: [
        {
            id: '1', name: 'Sickle Cell Disease', category: 'Genetic', status: 'Active',
            stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7',
            date: '12 Jan, 2026  •  12:30 PM',
            description: 'Inherited blood disorder affecting hemoglobin and red blood cell shape.',
        },
        {
            id: '2', name: 'Cystic Fibrosis', category: 'Genetic', status: 'Active',
            stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7',
            date: '12 Jan 2026  •  12:30 PM',
            description: 'Genetic condition affecting the lungs and digestive system.',
        },
    ],
    'Life Threats': [
        {
            id: '1', name: 'Pneumonia', category: 'Life Threats', status: 'Active',
            stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7',
            date: '12 Jan, 2026  •  12:30 PM',
            description: 'Tracks your blood sugar levels to help you manage and stay within a healthy range.',
        },
        {
            id: '2', name: 'Sepsis', category: 'Life Threats', status: 'Active',
            stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7',
            date: '12 Jan 2026  •  12:30 PM',
            description: 'Tracks your thyroid hormone levels to support metabolism and energy balance.',
        },
        {
            id: '3', name: 'Malnutrition', category: 'Life Threats', status: 'Active',
            stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7',
            date: '12 Jan 2026  •  12:30 PM',
            description: 'Tracks your thyroid hormone levels to support metabolism and energy balance.',
        },
    ],
    Preventive: [
        {
            id: '1', name: 'Annual Health Screening', category: 'Preventive', status: 'Active',
            stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7',
            date: '12 Jan, 2026  •  12:30 PM',
            description: 'Regular health screenings to detect potential issues early.',
        },
        {
            id: '2', name: 'Vaccination Schedule', category: 'Preventive', status: 'Active',
            stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7',
            date: '12 Jan 2026  •  12:30 PM',
            description: 'Stay up to date with recommended vaccinations for disease prevention.',
        },
    ],
};

const StatusBadge = ({ status }) => (
    <View style={styles.statusBadge}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>{status}</Text>
    </View>
);

const StabilityBadge = ({ label, color, bgColor }) => (
    <View style={[styles.stabilityBadge, { backgroundColor: bgColor }]}>
        <Text style={[styles.stabilityText, { color }]}>{label}</Text>
    </View>
);

const ConditionCard = ({ item, onPress }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
        <View style={styles.cardTopRow}>
            <StatusBadge status={item.status} />
            <Text style={styles.cardDate}>{item.date}</Text>
        </View>
        <View style={styles.cardMiddleRow}>
            <Text style={styles.cardName}>{item.name}</Text>
            <StabilityBadge
                label={item.stability}
                color={item.stabilityColor}
                bgColor={item.stabilityBgColor}
            />
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.viewMore}>View more</Text>
    </TouchableOpacity>
);

const CategoryDiseasesScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const category = route.params?.category || 'Chronic';
    const diseases = DISEASES_BY_CATEGORY[category] || [];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.fullGradient}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>{category}</Text>
                        <Text style={styles.headerSubtitle}>My Active Health conditions</Text>
                    </View>
                </View>
                <Text style={styles.pageDescription}>
                    View, monitor, and manage your Active health{'\n'}conditions with ease.
                </Text>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {diseases.map((item) => (
                        <ConditionCard
                            key={item.id}
                            item={item}
                            onPress={() => navigation.navigate('CategoryDiseaseDetailScreen', { condition: item, category })}
                        />
                    ))}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    fullGradient: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(20), paddingTop: ms(50), paddingBottom: vs(8),
    },
    backButton: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center',
    },
    headerTextWrap: { marginLeft: ms(12) },
    headerTitle: { fontFamily: bold, fontSize: ms(16), color: whiteColor },
    headerSubtitle: { fontFamily: regular, fontSize: ms(11), color: 'rgba(255,255,255,0.8)', marginTop: vs(2) },
    pageDescription: {
        fontFamily: bold, fontSize: ms(14), color: blackColor,
        paddingHorizontal: ms(20), marginTop: vs(12), marginBottom: vs(16), lineHeight: ms(22),
    },
    scrollContent: { paddingHorizontal: ms(20), paddingBottom: vs(40) },
    card: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), marginBottom: vs(12) },
    cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(10) },
    cardDate: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF' },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7',
        paddingHorizontal: ms(10), paddingVertical: vs(4), borderRadius: ms(12),
    },
    statusDot: { width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: primaryColor, marginRight: ms(6) },
    statusText: { fontFamily: bold, fontSize: ms(10), color: primaryColor },
    stabilityBadge: { paddingHorizontal: ms(14), paddingVertical: vs(5), borderRadius: ms(14) },
    stabilityText: { fontFamily: bold, fontSize: ms(11) },
    cardMiddleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(8) },
    cardName: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    cardDescription: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(18), marginBottom: vs(8) },
    viewMore: { fontFamily: bold, fontSize: ms(12), color: primaryColor },
});

export default CategoryDiseasesScreen;
