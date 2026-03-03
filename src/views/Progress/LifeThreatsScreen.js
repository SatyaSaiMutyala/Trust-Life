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
        name: 'Pneumonia',
        category: 'Life threats',
        status: 'Active',
        stability: 'Stable',
        stabilityColor: primaryColor,
        stabilityBgColor: '#DCFCE7',
        date: '12 Jan, 2026  •  12:30 PM',
        description: 'Tracks your blood sugar levels to help you manage and stay within a healthy range.',
    },
    {
        id: '2',
        name: 'Sepsis',
        category: 'Life threats',
        status: 'Active',
        stability: 'Stable',
        stabilityColor: primaryColor,
        stabilityBgColor: '#DCFCE7',
        date: '12 Jan 2026  •  12:30 PM',
        description: 'Tracks your thyroid hormone levels to support metabolism and energy balance.',
    },
    {
        id: '3',
        name: 'Malnutrition',
        category: 'Life threats',
        status: 'Active',
        stability: 'Stable',
        stabilityColor: primaryColor,
        stabilityBgColor: '#DCFCE7',
        date: '12 Jan 2026  •  12:30 PM',
        description: 'Tracks your thyroid hormone levels to support metabolism and energy balance.',
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

const LifeThreatsScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                </TouchableOpacity>
                <View style={styles.headerTextWrap}>
                    <Text style={styles.headerTitle}>Life threats</Text>
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
                {CONDITIONS_DATA.map((item) => (
                    <ConditionCard
                        key={item.id}
                        item={item}
                        onPress={() => navigation.navigate('LifeThreatsDetailScreen', { condition: item })}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(8),
    },
    backButton: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
        elevation: 2, shadowColor: blackColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    headerTextWrap: { marginLeft: ms(12) },
    headerTitle: { fontFamily: bold, fontSize: ms(16), color: blackColor },
    headerSubtitle: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2) },
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

export default LifeThreatsScreen;
