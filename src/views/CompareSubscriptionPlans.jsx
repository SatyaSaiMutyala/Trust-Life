import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Icon, { Icons } from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar2 } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';
import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors';
import { s, vs, ms } from 'react-native-size-matters';

const comparisonData = [
    { label: 'Members Covered', values: ['1', 'Upto 4', '6 - 8'] },
    { label: 'Test Discounts', values: ['60%', '60%', '60%'] },
    { label: 'Free Tests', values: ['check', 'cross', 'cross'] },
    { label: 'Home Sample Collection', values: ['Free', 'Free', 'Free'] },
    { label: 'Subscription Discount on Regular Tests', values: ['60%', '60%', '60%'] },
    { label: 'Annual Health Checkups', values: ['1 Basic', '2 Basic', 'Multiple'] },
    { label: 'Digital Health Vault', values: ['check', 'Shared', 'Shared'] },
    { label: 'Priority Booking', values: ['check', 'cross', 'cross'] },
    { label: 'Doctor / Expert review', values: ['check', 'cross', 'cross'] },
    { label: 'Dedicated Support', values: ['check', 'cross', 'cross'] },
    { label: 'Best For', values: ['Individuals', 'Families', 'Extended Families & Seniors'] },
];

const CompareSubscriptionPlans = () => {
    const navigation = useNavigation();

    const renderValue = (val) => {
        if (val === 'check') {
            return (
                <View style={styles.iconCircle}>
                    <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(12)} />
                </View>
            );
        }
        if (val === 'cross') {
            return (
                <View style={styles.iconCircleCross}>
                    <Icon type={Icons.Ionicons} name="close" color={whiteColor} size={ms(12)} />
                </View>
            );
        }
        return <Text style={styles.cellText}>{val}</Text>;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.fullGradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Compare Subscription Plans</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Plan Names Header */}
                    <View style={styles.planHeader}>
                        <View style={styles.benefitLabelCol}>
                            <Text style={styles.benefitHeaderText}>Benefits</Text>
                        </View>
                        <View style={styles.planCol}>
                            <Text style={styles.planHeaderName}>Self{'\n'}care Plan</Text>
                            <Text style={styles.planHeaderPrice}>₹499</Text>
                        </View>
                        <View style={styles.planCol}>
                            <Text style={styles.planHeaderName}>Family{'\n'}Care Plan</Text>
                            <Text style={styles.planHeaderPrice}>₹999</Text>
                        </View>
                        <View style={styles.planCol}>
                            <Text style={styles.planHeaderName}>Extended{'\n'}Family Care</Text>
                            <Text style={styles.planHeaderPrice}>₹1999</Text>
                        </View>
                    </View>

                    {/* Comparison Rows */}
                    {comparisonData.map((row, index) => (
                        <View
                            key={index}
                            style={[
                                styles.comparisonRow,
                                index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                            ]}
                        >
                            <View style={styles.benefitLabelCol}>
                                <Text style={styles.benefitLabel}>{row.label}</Text>
                            </View>
                            {row.values.map((val, i) => (
                                <View key={i} style={styles.planCol}>
                                    {renderValue(val)}
                                </View>
                            ))}
                        </View>
                    ))}
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
        paddingTop: ms(50),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        marginBottom: vs(15),
    },
    backButton: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    headerTitle: {
        fontSize: ms(17),
        fontWeight: 'bold',
        color: whiteColor,
    },
    scrollContent: {
        paddingBottom: vs(30),
    },

    // Plan Header
    planHeader: {
        flexDirection: 'row',
        backgroundColor: primaryColor,
        marginHorizontal: ms(15),
        borderRadius: ms(12),
        paddingVertical: vs(12),
        paddingHorizontal: ms(10),
        marginBottom: vs(5),
    },
    benefitLabelCol: {
        flex: 1.2,
        justifyContent: 'center',
    },
    benefitHeaderText: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: whiteColor,
    },
    planCol: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    planHeaderName: {
        fontSize: ms(10),
        fontWeight: '600',
        color: whiteColor,
        textAlign: 'center',
        lineHeight: ms(14),
    },
    planHeaderPrice: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: whiteColor,
        marginTop: vs(4),
    },

    // Comparison Rows
    comparisonRow: {
        flexDirection: 'row',
        paddingVertical: vs(12),
        paddingHorizontal: ms(25),
        alignItems: 'center',
    },
    rowEven: {
        backgroundColor: whiteColor,
    },
    rowOdd: {
        backgroundColor: '#F8F9FA',
    },
    benefitLabel: {
        fontSize: ms(11),
        color: blackColor,
        fontWeight: '500',
    },
    cellText: {
        fontSize: ms(11),
        color: blackColor,
        textAlign: 'center',
    },

    // Icons
    iconCircle: {
        width: ms(20),
        height: ms(20),
        borderRadius: ms(10),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleCross: {
        width: ms(20),
        height: ms(20),
        borderRadius: ms(10),
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CompareSubscriptionPlans;
