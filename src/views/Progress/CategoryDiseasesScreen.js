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

const CATEGORY_META = {
    Acute:               { icon: 'flash',            iconColor: '#EF4444', bg: '#FEF2F2' },
    Chronic:             { icon: 'time',              iconColor: '#3B82F6', bg: '#EFF6FF' },
    'Chronic Infectious':{ icon: 'bug',               iconColor: '#8B5CF6', bg: '#F5F3FF' },
    Genetic:             { icon: 'git-branch',        iconColor: '#10B981', bg: '#ECFDF5' },
    'Life Threats':      { icon: 'alert-circle',      iconColor: '#F59E0B', bg: '#FFFBEB' },
    Preventive:          { icon: 'shield-checkmark',  iconColor: '#0EA5E9', bg: '#F0F9FF' },
};

const DISEASES_BY_CATEGORY = {
    Acute: [
        { id: '1', name: 'Fever', category: 'Acute', status: 'Active', stability: 'Stable', stabilityColor: '#16A34A', stabilityBgColor: '#DCFCE7', date: '12 Jan, 2026  •  12:30 PM', description: 'Body temperature above normal, usually due to infection or inflammation.' },
        { id: '2', name: 'Infection', category: 'Acute', status: 'Active', stability: 'Unstable', stabilityColor: '#DC2626', stabilityBgColor: '#FEE2E2', date: '12 Jan 2026  •  12:30 PM', description: 'Infection markers are under control. Continue monitoring and follow recommended care.' },
        { id: '3', name: 'Allergy', category: 'Acute', status: 'Active', stability: 'Stable', stabilityColor: '#16A34A', stabilityBgColor: '#DCFCE7', date: '12 Jan 2026  •  12:30 PM', description: 'Your allergy levels are currently stable. No signs of an active reaction.' },
    ],
    Chronic: [
        { id: '1', name: 'Diabetes', category: 'Chronic', status: 'Active', stability: 'Stable', stabilityColor: '#16A34A', stabilityBgColor: '#DCFCE7', date: '12 Jan, 2026  •  12:30 PM', description: 'Tracks your blood sugar levels to help you manage and stay within a healthy range.' },
        { id: '2', name: 'Hypertension', category: 'Chronic', status: 'Active', stability: 'Unstable', stabilityColor: '#DC2626', stabilityBgColor: '#FEE2E2', date: '12 Jan 2026  •  12:30 PM', description: 'Monitors your blood pressure to maintain healthy heart and circulation.' },
        { id: '3', name: 'Thyroid', category: 'Chronic', status: 'Active', stability: 'Critical', stabilityColor: '#B45309', stabilityBgColor: '#FEF3C7', date: '12 Jan 2026  •  12:30 PM', description: 'Tracks your thyroid hormone levels to support metabolism and energy balance.' },
    ],
    'Chronic Infectious': [
        { id: '1', name: 'Chronic Kidney Disease', category: 'Chronic Infectious', status: 'Active', stability: 'Stable', stabilityColor: '#16A34A', stabilityBgColor: '#DCFCE7', date: '12 Jan, 2026  •  12:30 PM', description: 'Tracks your blood sugar levels to help you manage and stay within a healthy range.' },
        { id: '2', name: "Alzheimer's Disease", category: 'Chronic Infectious', status: 'Active', stability: 'Stable', stabilityColor: '#16A34A', stabilityBgColor: '#DCFCE7', date: '12 Jan 2026  •  12:30 PM', description: 'Tracks your thyroid hormone levels to support metabolism and energy balance.' },
    ],
    Genetic: [
        { id: '1', name: 'Sickle Cell Disease', category: 'Genetic', status: 'Active', stability: 'Stable', stabilityColor: '#16A34A', stabilityBgColor: '#DCFCE7', date: '12 Jan, 2026  •  12:30 PM', description: 'Inherited blood disorder affecting hemoglobin and red blood cell shape.' },
        { id: '2', name: 'Cystic Fibrosis', category: 'Genetic', status: 'Active', stability: 'Stable', stabilityColor: '#16A34A', stabilityBgColor: '#DCFCE7', date: '12 Jan 2026  •  12:30 PM', description: 'Genetic condition affecting the lungs and digestive system.' },
    ],
    'Life Threats': [
        { id: '1', name: 'Pneumonia', category: 'Life Threats', status: 'Active', stability: 'Stable', stabilityColor: '#16A34A', stabilityBgColor: '#DCFCE7', date: '12 Jan, 2026  •  12:30 PM', description: 'Serious lung infection that inflames air sacs and may fill them with fluid.' },
        { id: '2', name: 'Sepsis', category: 'Life Threats', status: 'Active', stability: 'Critical', stabilityColor: '#B45309', stabilityBgColor: '#FEF3C7', date: '12 Jan 2026  •  12:30 PM', description: 'Life-threatening response to infection that can lead to organ failure.' },
        { id: '3', name: 'Malnutrition', category: 'Life Threats', status: 'Active', stability: 'Stable', stabilityColor: '#16A34A', stabilityBgColor: '#DCFCE7', date: '12 Jan 2026  •  12:30 PM', description: 'Deficiencies in nutrients that affect body function and overall health.' },
    ],
    Preventive: [
        { id: '1', name: 'Annual Health Screening', category: 'Preventive', status: 'Active', stability: 'Stable', stabilityColor: '#16A34A', stabilityBgColor: '#DCFCE7', date: '12 Jan, 2026  •  12:30 PM', description: 'Regular health screenings to detect potential issues early.' },
        { id: '2', name: 'Vaccination Schedule', category: 'Preventive', status: 'Active', stability: 'Stable', stabilityColor: '#16A34A', stabilityBgColor: '#DCFCE7', date: '12 Jan 2026  •  12:30 PM', description: 'Stay up to date with recommended vaccinations for disease prevention.' },
    ],
};

const STABILITY_ICON = {
    Stable:   { icon: 'checkmark-circle', color: '#16A34A' },
    Unstable: { icon: 'close-circle',     color: '#DC2626' },
    Critical: { icon: 'warning',          color: '#B45309' },
};

const ConditionCard = ({ item, meta, onPress }) => {
    const stabIcon = STABILITY_ICON[item.stability] || STABILITY_ICON.Stable;
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={onPress}>
            {/* Top row */}
            <View style={styles.cardTopRow}>
                <View style={[styles.iconCircle, { backgroundColor: meta.bg }]}>
                    <Icon type={Icons.Ionicons} name={meta.icon} size={ms(18)} color={meta.iconColor} />
                </View>
                <View style={{ flex: 1, marginLeft: ms(10) }}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardDate}>{item.date}</Text>
                </View>
                <View style={[styles.stabilityBadge, { backgroundColor: item.stabilityBgColor }]}>
                    <Icon type={Icons.Ionicons} name={stabIcon.icon} size={ms(12)} color={stabIcon.color} />
                    <Text style={[styles.stabilityText, { color: item.stabilityColor }]}>{item.stability}</Text>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Description */}
            <Text style={styles.cardDescription}>{item.description}</Text>

            {/* Footer */}
            <View style={styles.cardFooter}>
                <View style={styles.activeBadge}>
                    <View style={styles.activeDot} />
                    <Text style={styles.activeText}>Active</Text>
                </View>
                <TouchableOpacity style={styles.viewMoreBtn} onPress={onPress}>
                    <Text style={styles.viewMoreText}>View details</Text>
                    <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(12)} color={primaryColor} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const CategoryDiseasesScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const category = route.params?.category || 'Chronic';
    const diseases = DISEASES_BY_CATEGORY[category] || [];
    const meta = CATEGORY_META[category] || CATEGORY_META.Chronic;

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
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: ms(12) }}>
                        <Text style={styles.headerTitle}>{category}</Text>
                        <Text style={styles.headerSubtitle}>My Active Health Conditions</Text>
                    </View>
                    {/* <View style={[styles.headerIconWrap, { backgroundColor: meta.bg }]}>
                        <Icon type={Icons.Ionicons} name={meta.icon} size={ms(22)} color={meta.iconColor} />
                    </View> */}
                </View>

                {/* Summary strip */}
                <View style={styles.summaryStrip}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{diseases.length}</Text>
                        <Text style={styles.summaryLabel}>Conditions</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>
                            {diseases.filter(d => d.stability === 'Stable').length}
                        </Text>
                        <Text style={styles.summaryLabel}>Stable</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: '#DC2626' }]}>
                            {diseases.filter(d => d.stability !== 'Stable').length}
                        </Text>
                        <Text style={styles.summaryLabel}>Needs Attention</Text>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text style={styles.sectionLabel}>
                        {diseases.length} condition{diseases.length !== 1 ? 's' : ''} found
                    </Text>
                    {diseases.map((item) => (
                        <ConditionCard
                            key={item.id}
                            item={item}
                            meta={meta}
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

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(14),
    },
    backButton: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: { fontFamily: bold, fontSize: ms(18), color: whiteColor },
    headerSubtitle: { fontFamily: regular, fontSize: ms(11), color: 'rgba(255,255,255,0.75)', marginTop: vs(2) },
    headerIconWrap: {
        width: ms(44), height: ms(44), borderRadius: ms(22),
        justifyContent: 'center', alignItems: 'center',
    },

    // Summary strip
    summaryStrip: {
        flexDirection: 'row',
        marginHorizontal: ms(20),
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        paddingVertical: vs(12),
        marginBottom: vs(16),
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryValue: {
        fontFamily: bold,
        fontSize: ms(20),
        color: blackColor,
    },
    summaryLabel: {
        fontFamily: regular,
        fontSize: ms(10),
        color: '#9CA3AF',
        marginTop: vs(2),
    },
    summaryDivider: {
        width: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: vs(4),
    },

    // Scroll
    scrollContent: { paddingHorizontal: ms(16), paddingBottom: vs(40) },
    sectionLabel: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        marginBottom: vs(10),
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        padding: ms(16),
        marginBottom: vs(12),
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    iconCircle: {
        width: ms(42), height: ms(42), borderRadius: ms(21),
        justifyContent: 'center', alignItems: 'center',
    },
    cardName: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
    },
    cardDate: {
        fontFamily: regular,
        fontSize: ms(10),
        color: '#9CA3AF',
        marginTop: vs(2),
    },
    stabilityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
        paddingHorizontal: ms(10),
        paddingVertical: vs(4),
        borderRadius: ms(20),
    },
    stabilityText: {
        fontFamily: bold,
        fontSize: ms(10),
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: vs(10),
    },
    cardDescription: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        lineHeight: ms(18),
        marginBottom: vs(12),
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    activeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        paddingHorizontal: ms(10),
        paddingVertical: vs(4),
        borderRadius: ms(20),
        gap: ms(5),
    },
    activeDot: {
        width: ms(7), height: ms(7), borderRadius: ms(4),
        backgroundColor: '#16A34A',
    },
    activeText: {
        fontFamily: bold,
        fontSize: ms(10),
        color: '#16A34A',
    },
    viewMoreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
    },
    viewMoreText: {
        fontFamily: bold,
        fontSize: ms(12),
        color: primaryColor,
    },
});

export default CategoryDiseasesScreen;
