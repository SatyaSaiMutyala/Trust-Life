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
import { StatusBar, StatusBar2, StatusBar3 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor } from '../../utils/globalColors';

const SUMMARY_DATA = [
    {
        date: '07 Feb,2026,12:30PM',
        description: 'The patient has stable health with ongoing treatment for chronic...',
    },
    { date: '15 Jan,2026, 12:30 PM' },
    { date: '24 Dec,2025, 12:30 PM' },
    { date: '24 Dec,2025, 12:30 PM' },
    { date: '24 Dec,2025, 12:30 PM' },
    { date: '24 Dec,2025, 12:30 PM' },
    { date: '24 Dec,2025, 12:30 PM' },
];

const VIEW_CARDS = [
    { image: require('../../assets/img/vdn.png'), label: 'View\nDoctor Notes', screen: 'ViewDoctorNoteScreen' },
    { image: require('../../assets/img/vlr.png'), label: 'View\nLab Reports' },
    { image: require('../../assets/img/vmp.png'), label: 'View\nMedication Presc...', screen: 'ViewPrescriptionScreen' },
];

const MedicalSummaryScreen = () => {
    const navigation = useNavigation();
    const [expandedIdx, setExpandedIdx] = useState(0);

    const toggleItem = (idx) => {
        setExpandedIdx(expandedIdx === idx ? null : idx);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar3 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Medical Summary</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {SUMMARY_DATA.map((item, idx) => (
                    <View key={idx} style={styles.card}>
                        <TouchableOpacity
                            style={styles.cardHeader}
                            onPress={() => toggleItem(idx)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.dateText}>{item.date}</Text>
                            <Icon
                                type={Icons.FontAwesome}
                                name={expandedIdx === idx ? 'caret-up' : 'caret-down'}
                                size={ms(18)}
                                color="#333"
                            />
                        </TouchableOpacity>

                        {expandedIdx === idx && item.description && (
                            <View style={styles.expandedContent}>
                                <Text style={styles.descriptionText}>{item.description}</Text>
                                <View style={styles.viewCardsRow}>
                                    {VIEW_CARDS.map((card, cIdx) => (
                                        <TouchableOpacity
                                            key={cIdx}
                                            style={styles.viewCard}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                if (card.screen) navigation.navigate(card.screen);
                                            }}
                                        >
                                            <Image source={card.image} style={styles.viewCardImage} resizeMode="contain" />
                                            <Text style={styles.viewCardLabel}>{card.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                ))}
                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default MedicalSummaryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        paddingTop: ms(48),
        paddingBottom: ms(12),
    },
    backBtn: {
        marginRight: ms(12),
    },
    headerTitle: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
    },
    scroll: {
        paddingHorizontal: ms(16),
        paddingTop: vs(14),
    },
    card: {
        backgroundColor: '#F1F5F9',
        borderRadius: ms(12),
        paddingHorizontal: ms(16),
        paddingVertical: vs(14),
        marginBottom: vs(8),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: ms(13),
        fontWeight: '500',
        color: blackColor,
    },
    expandedContent: {
        marginTop: vs(10),
    },
    descriptionText: {
        fontSize: ms(12),
        color: '#666',
        lineHeight: ms(18),
        marginBottom: vs(12),
    },
    viewCardsRow: {
        flexDirection: 'row',
        gap: ms(10),
    },
    viewCard: {
        flex: 1,
        backgroundColor: '#F8F9FB',
        borderRadius: ms(12),
        paddingVertical: vs(12),
        alignItems: 'center',
    },
    viewCardImage: {
        width: ms(60),
        height: ms(60),
        marginBottom: vs(8),
    },
    viewCardLabel: {
        fontSize: ms(10),
        color: '#444',
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: ms(14),
    },
});
