import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2, StatusBar3, StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const TIMELINE_DATA = [
    { date: '24 Feb, 2019', title: 'Hypothyroidism Diagnosed', subtitle: 'Dr. Sarah Smith • Routine Check' },
    { date: '24 Feb, 2019', title: 'Hypothyroidism Diagnosed', subtitle: 'Dr. Sarah Smith • Routine Check' },
    { date: '24 Feb, 2019', title: 'Hypothyroidism Diagnosed', subtitle: 'Dr. Sarah Smith • Routine Check' },
    { date: '24 Feb, 2019', title: 'Hypothyroidism Diagnosed', subtitle: 'Dr. Sarah Smith • Routine Check' },
    { date: '24 Feb, 2019', title: 'Hypothyroidism Diagnosed', subtitle: 'Dr. Sarah Smith • Routine Check' },
    { date: '24 Feb, 2019', title: 'Hypothyroidism Diagnosed', subtitle: 'Dr. Sarah Smith • Routine Check' },
];

const MedicalTimelineScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Medical Timeline</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {TIMELINE_DATA.map((item, idx) => (
                    <View key={idx} style={styles.timelineRow}>
                        {/* Line + Dot column */}
                        <View style={styles.timelineDotCol}>
                            {/* Top line segment */}
                            <View style={[styles.lineSegment, idx === 0 && { backgroundColor: 'transparent' }]} />
                            {/* Dot */}
                            <View style={styles.dotOuter}>
                                <View style={styles.dotInner} />
                            </View>
                            {/* Bottom line segment */}
                            <View style={[styles.lineSegment, idx === TIMELINE_DATA.length - 1 && { backgroundColor: 'transparent' }]} />
                        </View>

                        {/* Card */}
                        <TouchableOpacity style={styles.timelineCard} activeOpacity={0.7} onPress={() => navigation.navigate('MedicalSummaryScreen')}>
                            <View style={styles.cardContent}>
                                <View style={styles.cardTextWrap}>
                                    <Text style={styles.timelineDate}>{item.date}</Text>
                                    <Text style={styles.timelineTitle}>{item.title}</Text>
                                    <Text style={styles.timelineSubtitle}>{item.subtitle}</Text>
                                </View>
                                <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(20)} color="#CCC" />
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default MedicalTimelineScreen;

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
        marginRight: ms(12),
    },
    headerTitle: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
    },
    scroll: {
        paddingHorizontal: ms(16),
        paddingTop: vs(10),
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    timelineDotCol: {
        alignItems: 'center',
        width: ms(30),
        marginRight: ms(10),
    },
    lineSegment: {
        width: ms(3),
        flex: 1,
        backgroundColor: '#B2DFDB',
    },
    dotOuter: {
        width: ms(16),
        height: ms(16),
        borderRadius: ms(8),
        backgroundColor: '#B2DFDB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotInner: {
        width: ms(10),
        height: ms(10),
        borderRadius: ms(5),
        backgroundColor: primaryColor,
    },
    timelineCard: {
        flex: 1,
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(14),
        marginVertical: vs(6),
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTextWrap: {
        flex: 1,
    },
    timelineDate: {
        fontSize: ms(11),
        color: '#999',
        marginBottom: vs(4),
    },
    timelineTitle: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(2),
    },
    timelineSubtitle: {
        fontSize: ms(11),
        color: '#888',
    },
});
