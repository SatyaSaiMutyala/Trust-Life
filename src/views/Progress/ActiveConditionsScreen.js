import React from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const CONDITIONS = [
    {
        label: 'Acute',
        count: '3',
        icon: 'flash',
        iconColor: '#EF4444',
        bgColor: '#FEE2E2',
        category: 'Acute',
        description: 'Short-term conditions that need immediate attention',
        tag: 'Urgent',
    },
    {
        label: 'Chronic',
        count: '3',
        icon: 'time',
        iconColor: '#3B82F6',
        bgColor: '#DBEAFE',
        category: 'Chronic',
        description: 'Long-term conditions requiring ongoing management',
        tag: 'Ongoing',
    },
    {
        label: 'Chronic Infectious',
        count: '2',
        icon: 'bug',
        iconColor: '#8B5CF6',
        bgColor: '#EDE9FE',
        category: 'Chronic Infectious',
        description: 'Progressive infections needing continuous monitoring',
        tag: 'Monitor',
    },
    {
        label: 'Genetic',
        count: '2',
        icon: 'git-branch',
        iconColor: '#10B981',
        bgColor: '#DCFCE7',
        category: 'Genetic',
        description: 'Hereditary conditions linked to your genetic profile',
        tag: 'Inherited',
    },
    {
        label: 'Life Threats',
        count: '3',
        icon: 'alert-circle',
        iconColor: '#F59E0B',
        bgColor: '#FEF3C7',
        category: 'Life Threats',
        description: 'Critical conditions that require close monitoring',
        tag: 'Critical',
    },
    {
        label: 'Preventive',
        count: '2',
        icon: 'shield-checkmark',
        iconColor: '#0EA5E9',
        bgColor: '#E0F2FE',
        category: 'Preventive',
        description: 'Preventive measures and health screenings',
        tag: 'Proactive',
    },
];

const totalConditions = CONDITIONS.reduce((sum, c) => sum + parseInt(c.count), 0);

const ConditionCard = ({ item, onPress }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={onPress}>
        {/* Left accent bar */}
        <View style={[styles.cardAccent, { backgroundColor: item.iconColor }]} />

        <View style={styles.cardInner}>
            {/* Icon + Title + Tag */}
            <View style={styles.cardTop}>
                <View style={[styles.iconWrap, { backgroundColor: item.bgColor }]}>
                    <Icon type={Icons.Ionicons} name={item.icon} size={ms(22)} color={item.iconColor} />
                </View>
                <View style={styles.cardMeta}>
                    <Text style={styles.cardLabel}>{item.label}</Text>
                    <View style={styles.tagBadge}>
                        <View style={[styles.tagDot, { backgroundColor: item.iconColor }]} />
                        <Text style={styles.tagText}>{item.tag}</Text>
                    </View>
                </View>
                {/* Count */}
                <View style={styles.countWrap}>
                    <Text style={styles.countNumber}>{item.count}</Text>
                    <Text style={styles.countSub}>cases</Text>
                </View>
            </View>

            {/* Description + Arrow */}
            <View style={styles.cardBottom}>
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.arrowBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(14)} color={whiteColor} />
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

const ActiveConditionsScreen = () => {
    const navigation = useNavigation();

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
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>Active Conditions</Text>
                        <Text style={styles.headerSubtitle}>My Active Health Conditions</Text>
                    </View>
                </View>

                {/* Summary banner */}
                <View style={styles.banner}>
                    <View style={styles.bannerItem}>
                        <Text style={styles.bannerNum}>{CONDITIONS.length}</Text>
                        <Text style={styles.bannerLbl}>Categories</Text>
                    </View>
                    <View style={styles.bannerDivider} />
                    <View style={styles.bannerItem}>
                        <Text style={styles.bannerNum}>{totalConditions}</Text>
                        <Text style={styles.bannerLbl}>Total Cases</Text>
                    </View>
                    <View style={styles.bannerDivider} />
                    <View style={styles.bannerItem}>
                        <Text style={[styles.bannerNum, { color: '#EF4444' }]}>
                            {CONDITIONS.filter(c => c.tag === 'Critical' || c.tag === 'Urgent')
                                .reduce((s, c) => s + parseInt(c.count), 0)}
                        </Text>
                        <Text style={styles.bannerLbl}>Need Attention</Text>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text style={styles.sectionLabel}>All Condition Categories</Text>

                    {CONDITIONS.map((item, index) => (
                        <ConditionCard
                            key={index}
                            item={item}
                            onPress={() => navigation.navigate('CategoryDiseasesScreen', { category: item.category })}
                        />
                    ))}

                    <View style={{ height: vs(40) }} />
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
        paddingBottom: vs(16),
    },
    backBtn: {
        width: ms(38), height: ms(38), borderRadius: ms(19),
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTextWrap: { flex: 1, marginLeft: ms(12) },
    headerTitle: { fontFamily: bold, fontSize: ms(20), color: whiteColor },
    headerSubtitle: {
        fontFamily: regular, fontSize: ms(11),
        color: 'rgba(255,255,255,0.75)', marginTop: vs(2),
    },

    // Banner
    banner: {
        flexDirection: 'row',
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        marginHorizontal: ms(20),
        marginBottom: vs(20),
        paddingVertical: vs(14),
        elevation: 5,
        shadowColor: primaryColor,
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    bannerItem: { flex: 1, alignItems: 'center' },
    bannerNum: { fontFamily: bold, fontSize: ms(22), color: primaryColor },
    bannerLbl: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(2) },
    bannerDivider: { width: 1, backgroundColor: '#E5E7EB', marginVertical: vs(4) },

    // Scroll
    scrollContent: { paddingHorizontal: ms(16), paddingBottom: vs(40) },
    sectionLabel: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#9CA3AF',
        marginBottom: vs(12),
        marginLeft: ms(4),
        letterSpacing: 0.3,
    },

    // Card
    card: {
        flexDirection: 'row',
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        marginBottom: vs(12),
        overflow: 'hidden',
        elevation: 3,
        shadowColor: primaryColor,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        borderWidth: 1,
        borderColor: '#E8F4F2',
    },
    cardAccent: {
        width: ms(5),
        borderTopLeftRadius: ms(16),
        borderBottomLeftRadius: ms(16),
    },
    cardInner: {
        flex: 1,
        padding: ms(14),
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    iconWrap: {
        width: ms(46), height: ms(46), borderRadius: ms(13),
        justifyContent: 'center', alignItems: 'center',
    },
    cardMeta: {
        flex: 1,
        marginLeft: ms(12),
    },
    cardLabel: {
        fontFamily: bold,
        fontSize: ms(15),
        color: blackColor,
        marginBottom: vs(4),
    },
    tagBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FAF8',
        borderRadius: ms(20),
        paddingHorizontal: ms(8),
        paddingVertical: vs(2),
        alignSelf: 'flex-start',
        gap: ms(4),
        borderWidth: 1,
        borderColor: '#D1EDE9',
    },
    tagDot: {
        width: ms(6), height: ms(6), borderRadius: ms(3),
    },
    tagText: {
        fontFamily: bold,
        fontSize: ms(10),
        color: primaryColor,
    },
    countWrap: {
        alignItems: 'center',
        backgroundColor: '#EBF6F4',
        borderRadius: ms(12),
        paddingHorizontal: ms(12),
        paddingVertical: vs(6),
        borderWidth: 1.5,
        borderColor: primaryColor + '40',
        minWidth: ms(52),
    },
    countNumber: {
        fontFamily: bold,
        fontSize: ms(18),
        color: primaryColor,
        lineHeight: ms(20),
    },
    countSub: {
        fontFamily: regular,
        fontSize: ms(9),
        color: primaryColor + 'AA',
    },
    cardBottom: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardDesc: {
        flex: 1,
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        lineHeight: ms(17),
    },
    arrowBtn: {
        width: ms(30), height: ms(30), borderRadius: ms(15),
        backgroundColor: primaryColor,
        justifyContent: 'center', alignItems: 'center',
        marginLeft: ms(10),
    },
});

export default ActiveConditionsScreen;
