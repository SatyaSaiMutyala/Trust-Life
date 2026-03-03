import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const CONDITIONS_DATA = [
    {
        id: '1',
        name: 'Fever',
        status: 'Active',
        stability: 'Stable',
        stabilityColor: primaryColor,
        stabilityBgColor: '#DCFCE7',
        date: '12 Jan, 2026  •  12:30 PM',
        description: 'Body temperature above normal, usually due to infection or inflammation',
    },
    {
        id: '2',
        name: 'Infection',
        status: 'Active',
        stability: 'unstable',
        stabilityColor: '#1F2937',
        stabilityBgColor: '#F3F4F6',
        date: '12 Jan 2026  •  12:30 PM',
        description: 'Infection markers are under control. Continue monitoring and follow recommended care.',
    },
    {
        id: '3',
        name: 'Allergy',
        status: 'Active',
        stability: 'Stable',
        stabilityColor: primaryColor,
        stabilityBgColor: '#DCFCE7',
        date: '12 Jan 2026  •  12:30 PM',
        description: 'Your allergy levels are currently stable. There are no signs of an active reaction, but continued monitoring is recommended.',
    },
];

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
        {/* Top Row: Status badge + Date */}
        <View style={styles.cardTopRow}>
            <StatusBadge status={item.status} />
            <Text style={styles.cardDate}>{item.date}</Text>
        </View>

        {/* Name + Stability */}
        <View style={styles.cardMiddleRow}>
            <Text style={styles.cardName}>{item.name}</Text>
            <StabilityBadge
                label={item.stability}
                color={item.stabilityColor}
                bgColor={item.stabilityBgColor}
            />
        </View>

        {/* Description */}
        <Text style={styles.cardDescription}>{item.description}</Text>

        {/* View More */}
        <Text style={styles.viewMore}>View more</Text>
    </TouchableOpacity>
);

const AcuteConditionsScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                </TouchableOpacity>
                <View style={styles.headerTextWrap}>
                    <Text style={styles.headerTitle}>Acute</Text>
                    <Text style={styles.headerSubtitle}>My Active Health conditions</Text>
                </View>
            </View>

            {/* Subtitle */}
            <Text style={styles.pageDescription}>
                View, monitor, and manage your Active health{'\n'}conditions with ease.
            </Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {CONDITIONS_DATA.map((item) => (
                    <ConditionCard
                        key={item.id}
                        item={item}
                        onPress={() => navigation.navigate('ConditionDetailScreen', { condition: item })}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(8),
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
    headerTextWrap: {
        marginLeft: ms(12),
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
    },
    headerSubtitle: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
        marginTop: vs(2),
    },

    // Page Description
    pageDescription: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        paddingHorizontal: ms(20),
        marginTop: vs(12),
        marginBottom: vs(16),
        lineHeight: ms(22),
    },

    // Scroll
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(40),
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(10),
    },
    cardDate: {
        fontFamily: regular,
        fontSize: ms(10),
        color: '#9CA3AF',
    },

    // Status Badge
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        paddingHorizontal: ms(10),
        paddingVertical: vs(4),
        borderRadius: ms(12),
    },
    statusDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        backgroundColor: primaryColor,
        marginRight: ms(6),
    },
    statusText: {
        fontFamily: bold,
        fontSize: ms(10),
        color: primaryColor,
    },

    // Stability Badge
    stabilityBadge: {
        paddingHorizontal: ms(14),
        paddingVertical: vs(5),
        borderRadius: ms(14),
    },
    stabilityText: {
        fontFamily: bold,
        fontSize: ms(11),
    },

    // Card Middle
    cardMiddleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(8),
    },
    cardName: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
    },

    // Description
    cardDescription: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        lineHeight: ms(18),
        marginBottom: vs(8),
    },

    // View More
    viewMore: {
        fontFamily: bold,
        fontSize: ms(12),
        color: primaryColor,
    },
});

export default AcuteConditionsScreen;
