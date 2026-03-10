import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const PLAN_BENEFITS = [
    {
        id: '1',
        icon: 'bed-outline',
        iconType: Icons.Ionicons,
        title: 'In-patient Hospitalization',
        detail: 'Coverage provided up to the full Sum Insured for all hospitalization expenses exceeding 24 hours including nursing, OT charges, and diagnostic tests.',
    },
    {
        id: '2',
        icon: 'medkit-outline',
        iconType: Icons.Ionicons,
        title: 'Pre & Post Hospitalization',
        detail: 'Covers medical expenses 30 days before and 60 days after hospitalization including doctor consultations and prescribed medicines.',
    },
    {
        id: '3',
        icon: 'medical-outline',
        iconType: Icons.Ionicons,
        title: 'Daycare Procedures',
        detail: 'Covers 540+ daycare procedures that do not require 24-hour hospitalization due to technological advancements.',
    },
    {
        id: '4',
        icon: 'shield-checkmark-outline',
        iconType: Icons.Ionicons,
        title: 'No Claim Bonus',
        detail: 'Earn up to 50% bonus on sum insured for every claim-free year, rewarding healthy living.',
    },
    {
        id: '5',
        icon: 'leaf-outline',
        iconType: Icons.Ionicons,
        title: 'AYUSH Treatment',
        detail: 'Covers Ayurveda, Yoga, Unani, Siddha, and Homeopathy treatments at NABH-accredited hospitals.',
    },
];

const NEARBY_HOSPITALS = [
    { id: '1', name: 'City Care Hospital', distance: '2.4 km away', cashless: true },
    { id: '2', name: 'Apollo Specialty', distance: '4.1 km away', cashless: true },
];

const REVIEWS = [
    { id: '1', name: 'Rahul J.', initials: 'RJ', rating: 5, text: '"The claim process was surprisingly smooth. Had my father hospitalized for knee surgery and the cashless approval came within 2 hours."' },
    { id: '2', name: 'Priya S.', initials: 'PS', rating: 4, text: '"Good coverage and easy renewal. Customer support was helpful when I had questions about my policy."' },
];

const InsurancePlanDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const plan = route.params?.plan;
    const [expandedBenefit, setExpandedBenefit] = useState('1');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: vs(100) }}>

                {/* Hero Image */}
                <View style={styles.heroWrap}>
                    <Image source={plan?.image || require('../../assets/img/hospital-one.png')} style={styles.heroImage} resizeMode="cover" />
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                    </TouchableOpacity>

                    {/* Stats Strip */}
                    <View style={styles.statsStrip}>
                        <View style={styles.statItem}>
                            <Icon type={Icons.Ionicons} name="business-outline" size={ms(22)} color={primaryColor} />
                            <Text style={styles.statValue}>6,500+</Text>
                            <Text style={styles.statLabel}>HOSPITALS</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Icon type={Icons.Ionicons} name="checkmark-circle-outline" size={ms(22)} color={primaryColor} />
                            <Text style={styles.statValue}>98%</Text>
                            <Text style={styles.statLabel}>SETTLEMENT</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Icon type={Icons.Ionicons} name="time-outline" size={ms(22)} color={primaryColor} />
                            <Text style={styles.statValue}>2 Years</Text>
                            <Text style={styles.statLabel}>WAITING</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.body}>
                    {/* Plan Info */}
                    <Text style={styles.planName}>{plan?.name || 'Star Health Insurance'}</Text>
                    <Text style={styles.planDesc}>{plan?.description || 'Comprehensive health coverage for hospital treatments and emergencies.'}</Text>

                    {/* Coverage Row */}
                    <View style={styles.coverageRow}>
                        <Text style={styles.coverageLabel}>Coverage</Text>
                        <Text style={styles.coverageValue}>{plan?.coverage || '₹5,00,000'}</Text>
                    </View>

                    {/* Plan Benefits */}
                    <Text style={styles.sectionTitle}>Plan Benefits</Text>
                    {PLAN_BENEFITS.map((b) => {
                        const isOpen = expandedBenefit === b.id;
                        return (
                            <TouchableOpacity
                                key={b.id}
                                style={styles.benefitCard}
                                activeOpacity={0.8}
                                onPress={() => setExpandedBenefit(isOpen ? null : b.id)}
                            >
                                <View style={styles.benefitRow}>
                                    <View style={styles.benefitIconWrap}>
                                        <Icon type={b.iconType} name={b.icon} size={ms(18)} color={primaryColor} />
                                    </View>
                                    <Text style={styles.benefitTitle}>{b.title}</Text>
                                    <Icon
                                        type={Icons.Ionicons}
                                        name={isOpen ? 'chevron-up' : 'chevron-down'}
                                        size={ms(18)}
                                        color="#9CA3AF"
                                    />
                                </View>
                                {isOpen && (
                                    <Text style={styles.benefitDetail}>{b.detail}</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}

                    {/* Nearby Hospitals */}
                    <View style={styles.nearbyCard}>
                        <View style={styles.nearbyHeader}>
                            <Text style={styles.sectionTitle}>Nearby Hospitals</Text>
                            <Icon type={Icons.Ionicons} name="map-outline" size={ms(20)} color={primaryColor} />
                        </View>
                        <View style={styles.nearbySearch}>
                            <Icon type={Icons.Ionicons} name="search-outline" size={ms(16)} color="#9CA3AF" />
                            <TextInput
                                style={styles.nearbyInput}
                                placeholder="Search by city or area..."
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        {NEARBY_HOSPITALS.map((h) => (
                            <View key={h.id} style={styles.hospitalRow}>
                                <View style={styles.hospitalIconWrap}>
                                    <Icon type={Icons.Ionicons} name="location-outline" size={ms(18)} color="#6B7280" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.hospitalName}>{h.name}</Text>
                                    <Text style={styles.hospitalMeta}>
                                        {h.distance}{h.cashless ? '  •  Cashless available' : ''}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Reviews */}
                    <View style={styles.reviewsHeader}>
                        <Text style={styles.sectionTitle}>Reviews</Text>
                        <View style={styles.ratingBadge}>
                            <Icon type={Icons.Ionicons} name="star" size={ms(14)} color="#F59E0B" />
                            <Text style={styles.ratingVal}>4.8</Text>
                            <Text style={styles.ratingCount}>(2.4k reviews)</Text>
                        </View>
                    </View>
                    {REVIEWS.map((r) => (
                        <View key={r.id} style={styles.reviewCard}>
                            <View style={styles.reviewTop}>
                                <View style={styles.reviewAvatar}>
                                    <Text style={styles.reviewInitials}>{r.initials}</Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: ms(10) }}>
                                    <Text style={styles.reviewName}>{r.name}</Text>
                                    <View style={styles.starsRow}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Icon key={i} type={Icons.Ionicons} name="star" size={ms(13)} color={i < r.rating ? '#F59E0B' : '#E5E7EB'} />
                                        ))}
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.reviewText}>{r.text}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.premiumLabel}>Monthly Premium</Text>
                    <Text style={styles.premiumValue}>{plan?.premium || '₹450'}<Text style={styles.premiumPer}> /mo</Text></Text>
                </View>
                <TouchableOpacity
                    style={styles.buyBtn}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('InsuranceNomineeDetails', { plan })}
                >
                    <Text style={styles.buyBtnText}>Buy Policy Now</Text>
                    <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(16)} color={whiteColor} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default InsurancePlanDetailScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },

    // Hero
    heroWrap: { position: 'relative' },
    heroImage: { width: '100%', height: vs(220), backgroundColor: '#E5E7EB' },
    backBtn: {
        position: 'absolute',
        top: ms(50),
        left: ms(16),
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: whiteColor,
        justifyContent: 'center', alignItems: 'center',
        elevation: 4,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    statsStrip: {
        flexDirection: 'row',
        backgroundColor: whiteColor,
        marginHorizontal: ms(16),
        marginTop: -vs(30),
        borderRadius: ms(16),
        paddingVertical: vs(14),
        elevation: 5,
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    },
    statItem: { flex: 1, alignItems: 'center', gap: vs(3) },
    statValue: { fontFamily: bold, fontSize: ms(15), color: blackColor },
    statLabel: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF', letterSpacing: 0.5 },
    statDivider: { width: 1, backgroundColor: '#E5E7EB', marginVertical: vs(4) },

    // Body
    body: { paddingHorizontal: ms(16), paddingTop: vs(18) },
    planName: { fontFamily: bold, fontSize: ms(18), color: blackColor, marginBottom: vs(5) },
    planDesc: { fontFamily: regular, fontSize: ms(13), color: '#6B7280', lineHeight: ms(20), marginBottom: vs(14) },
    coverageRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: whiteColor, borderRadius: ms(12), paddingHorizontal: ms(16), paddingVertical: vs(12),
        marginBottom: vs(20),
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    coverageLabel: { fontFamily: regular, fontSize: ms(13), color: '#6B7280' },
    coverageValue: { fontFamily: bold, fontSize: ms(16), color: blackColor },

    // Section title
    sectionTitle: { fontFamily: bold, fontSize: ms(16), color: blackColor, marginBottom: vs(10) },

    // Benefits
    benefitCard: {
        backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), marginBottom: vs(8),
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    benefitRow: { flexDirection: 'row', alignItems: 'center' },
    benefitIconWrap: {
        width: ms(36), height: ms(36), borderRadius: ms(10),
        backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    benefitTitle: { flex: 1, fontFamily: bold, fontSize: ms(13), color: blackColor },
    benefitDetail: {
        fontFamily: regular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(18),
        marginTop: vs(10), paddingTop: vs(10), borderTopWidth: 1, borderTopColor: '#F3F4F6',
    },

    // Nearby
    nearbyCard: {
        backgroundColor: whiteColor, borderRadius: ms(16), padding: ms(16), marginBottom: vs(20),
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    nearbyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(10) },
    nearbySearch: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
        borderRadius: ms(10), paddingHorizontal: ms(12), paddingVertical: vs(8), gap: ms(8), marginBottom: vs(12),
    },
    nearbyInput: { flex: 1, fontFamily: regular, fontSize: ms(13), color: blackColor, padding: 0 },
    hospitalRow: { flexDirection: 'row', alignItems: 'center', gap: ms(10), paddingVertical: vs(8), borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    hospitalIconWrap: { width: ms(36), height: ms(36), borderRadius: ms(18), backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
    hospitalName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    hospitalMeta: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginTop: vs(2) },

    // Reviews
    reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(10) },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    ratingVal: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    ratingCount: { fontFamily: regular, fontSize: ms(12), color: '#9CA3AF' },
    reviewCard: {
        backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), marginBottom: vs(10),
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    reviewTop: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(8) },
    reviewAvatar: {
        width: ms(38), height: ms(38), borderRadius: ms(19),
        backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center',
    },
    reviewInitials: { fontFamily: bold, fontSize: ms(13), color: whiteColor },
    reviewName: { fontFamily: bold, fontSize: ms(13), color: blackColor, marginBottom: vs(3) },
    starsRow: { flexDirection: 'row', gap: ms(2) },
    reviewText: { fontFamily: regular, fontSize: ms(12), color: '#4B5563', lineHeight: ms(18) },

    // Bottom CTA
    bottomBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: whiteColor, paddingHorizontal: ms(20), paddingVertical: vs(14),
        borderTopWidth: 1, borderTopColor: '#F0F0F0',
        elevation: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: -3 },
    },
    premiumLabel: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF' },
    premiumValue: { fontFamily: bold, fontSize: ms(18), color: blackColor },
    premiumPer: { fontFamily: regular, fontSize: ms(12), color: '#9CA3AF' },
    buyBtn: {
        flexDirection: 'row', alignItems: 'center', gap: ms(8),
        backgroundColor: primaryColor, borderRadius: ms(30),
        paddingHorizontal: ms(22), paddingVertical: vs(12),
    },
    buyBtnText: { fontFamily: bold, fontSize: ms(14), color: whiteColor },
});
