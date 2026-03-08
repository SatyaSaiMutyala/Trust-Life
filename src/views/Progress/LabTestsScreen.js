import React from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const LAB_TESTS = [
    { doctor: 'Dr.Sindhu recommended', date: '14 Nov 2025, 9:30 AM', testName: 'Neuronal ( Paraneoplastic ) Autoantibodies' },
    { doctor: 'Dr.Sindhu recommended', date: '14 Nov 2025, 9:30 AM', testName: 'Neuronal ( Paraneoplastic ) Autoantibodies' },
    { doctor: 'Dr.Sindhu recommended', date: '14 Nov 2025, 9:30 AM', testName: 'Neuronal ( Paraneoplastic ) Autoantibodies' },
    { doctor: 'Dr.Sindhu recommended', date: '14 Nov 2025, 9:30 AM', testName: 'Neuronal ( Paraneoplastic ) Autoantibodies' },
    { doctor: 'Dr.Sindhu recommended', date: '14 Nov 2025, 9:30 AM', testName: 'Neuronal ( Paraneoplastic ) Autoantibodies' },
];

const LabTestsScreen = () => {
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
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Lab Tests</Text>
                    <View style={{ flex: 1 }} />
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Up to date</Text>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {LAB_TESTS.map((item, index) => (
                        <View key={index} style={styles.card}>
                            <LinearGradient
                                colors={['#FBCFE8', whiteColor]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.doctorPill}
                            >
                                <Icon type={Icons.MaterialCommunityIcons} name="stethoscope" size={ms(14)} color={blackColor} />
                                <Text style={styles.doctorPillText}>{item.doctor}</Text>
                            </LinearGradient>

                            <Text style={styles.dateText}>{item.date}</Text>
                            <Text style={styles.testName}>{item.testName}</Text>
                        </View>
                    ))}
                    <View style={{ height: vs(40) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    fullGradient: {
        flex: 1,
        paddingHorizontal: ms(14),
        paddingTop: ms(50),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ms(16),
    },
    backBtn: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(18),
        color: whiteColor,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#065F46',
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: vs(6),
        gap: ms(6),
    },
    statusDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        backgroundColor: '#34D399',
    },
    statusText: {
        fontFamily: bold,
        fontSize: ms(12),
        color: whiteColor,
    },
    scrollContent: {
        paddingBottom: vs(40),
    },
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    doctorPill: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: vs(8),
        alignSelf: 'flex-start',
        marginBottom: vs(12),
        gap: ms(8),
    },
    doctorPillText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#374151',
    },
    dateText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        marginBottom: vs(12),
    },
    testName: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
    },
});

export default LabTestsScreen;
