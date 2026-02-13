import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native';
import Icon, { Icons } from '../components/Icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar2 } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';
import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors';
import { s, vs, ms } from 'react-native-size-matters';
import { bold, regular } from '../config/Constants';

const plansData = [
    {
        id: 1,
        name: 'Self Care Plan',
        price: '₹499',
        period: 'Annual Plan',
        includes: ['Members Covered'],
        expiry: 'Expire with 4 Days',
    },
    {
        id: 2,
        name: 'Family Care Plan',
        price: '₹999',
        period: 'Annual Plan',
        includes: ['Members Covered', 'Test Discounts'],
    },
    {
        id: 3,
        name: 'Extended Family Care',
        price: '₹1999',
        period: 'Annual Plan',
        includes: ['Members Covered', 'Test Discounts'],
    },
];

const CANCEL_REASONS = [
    'The plan is too expensive',
    'Found a better alternative',
    'Temporary financial reasons',
    'Facing technical or app issues',
    'Benefits did not meet expectations',
    'Subscription not needed anymore',
    'Switching to another plan',
    'Other (Please specify)',
];

const SubscriptionPlans = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const hasPlan = route.params?.hasPlan ?? false;
    const currentPlanId = route.params?.currentPlanId ?? 1;

    const [selectedPlan, setSelectedPlan] = useState(hasPlan ? currentPlanId : 1);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [selectedReasons, setSelectedReasons] = useState([]);

    const toggleReason = (reason) => {
        setSelectedReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason],
        );
    };

    const handleCancelSubscription = () => {
        setCancelModalVisible(false);
        setSelectedReasons([]);
        navigation.navigate('SuccessScreen', {
            title: 'Subscription Cancelled',
            subtitle: 'Successfully',
            type: 'cancel',
            delay: 2000,
            targetScreen: 'Home',
        });
    };

    // Current plan mode card (active plan)
    const renderCurrentPlanCard = (plan) => (
        <View key={plan.id} style={[styles.card, styles.cardSelected]}>
            <View style={styles.cardHeader}>
                <View style={styles.cardLeft}>
                    <Icon
                        type={Icons.MaterialCommunityIcons}
                        name="check-circle"
                        color={primaryColor}
                        size={ms(22)}
                    />
                    <Text style={[styles.planName, { marginLeft: ms(10) }]}>{plan.name}</Text>
                </View>
                <View style={styles.cardRight}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
            </View>

            {plan.expiry && (
                <Text style={styles.expiryText}>{plan.expiry}</Text>
            )}

            <View style={styles.includesSection}>
                <Text style={styles.includesLabel}>Includes</Text>
                {plan.includes.map((item, index) => (
                    <View key={index} style={styles.includeItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.includeText}>{item}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity>
                <Text style={styles.viewMore}>View more</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.managePlanRow}>
                <Icon type={Icons.MaterialCommunityIcons} name="crown-outline" color={primaryColor} size={ms(18)} />
                <Text style={styles.managePlanText}>Manage Self Care Plan</Text>
                <Icon type={Icons.Ionicons} name="arrow-forward" color={blackColor} size={ms(16)} />
            </TouchableOpacity>
        </View>
    );

    // Upgrade plan card (non-active plans when hasPlan)
    const renderUpgradePlanCard = (plan) => (
        <View key={plan.id} style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.cardLeft}>
                    <View style={styles.radioOuter} />
                    <Text style={styles.planName}>{plan.name}</Text>
                </View>
                <View style={styles.cardRight}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
            </View>

            <View style={styles.includesSection}>
                <Text style={styles.includesLabel}>Includes</Text>
                {plan.includes.map((item, index) => (
                    <View key={index} style={styles.includeItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.includeText}>{item}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity>
                <Text style={styles.viewMore}>View more</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.upgradeButton}>
                <Icon type={Icons.MaterialCommunityIcons} name="crown-outline" color={primaryColor} size={ms(16)} />
                <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
            </TouchableOpacity>
        </View>
    );

    // Normal selectable plan card (new users)
    const renderSelectablePlanCard = (plan) => {
        const isSelected = selectedPlan === plan.id;
        return (
            <TouchableOpacity
                key={plan.id}
                activeOpacity={0.8}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelectedPlan(plan.id)}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.cardLeft}>
                        <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                            {isSelected && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.planName}>{plan.name}</Text>
                    </View>
                    <View style={styles.cardRight}>
                        <Text style={styles.planPrice}>{plan.price}</Text>
                        <Text style={styles.planPeriod}>{plan.period}</Text>
                    </View>
                </View>

                <View style={styles.includesSection}>
                    <Text style={styles.includesLabel}>Includes</Text>
                    {plan.includes.map((item, index) => (
                        <View key={index} style={styles.includeItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.includeText}>{item}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity>
                    <Text style={styles.viewMore}>View more</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
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
                {/* Close Button */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon type={Icons.Ionicons} name="close" color={blackColor} size={ms(20)} />
                </TouchableOpacity>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header */}
                    <Text style={styles.title}>Smarter Care, Better Health</Text>
                    <Text style={styles.subtitle}>
                        Manage your medicines, get timely reminders, follow doctor-guided courses,all in one simple, reliable plan.
                    </Text>

                    {/* Plan Cards */}
                    {hasPlan
                        ? plansData.map((plan) =>
                            plan.id === currentPlanId
                                ? renderCurrentPlanCard(plan)
                                : renderUpgradePlanCard(plan),
                        )
                        : plansData.map((plan) => renderSelectablePlanCard(plan))
                    }
                </ScrollView>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {hasPlan ? (
                        <>
                            <TouchableOpacity
                                style={styles.compareRow}
                                onPress={() => navigation.navigate('CompareSubscriptionPlans')}
                            >
                                <Text style={[styles.compareText, { color: primaryColor }]}>Compare Plans</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setCancelModalVisible(true)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel my subscription</Text>
                            </TouchableOpacity>

                            <Text style={styles.cancelNote}>
                                Subscription amount will not be refunded after cancellation. You can choose and subscribe to a new plan anytime.
                            </Text>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => navigation.navigate('ChoosePreferredOption')}
                            >
                                <Text style={styles.continueText}>Continue</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.compareRow}
                                onPress={() => navigation.navigate('CompareSubscriptionPlans')}
                            >
                                <Text style={styles.compareText}>Compare Plans</Text>
                                <Icon type={Icons.Ionicons} name="arrow-forward" color={blackColor} size={ms(14)} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </LinearGradient>

            {/* Cancel Subscription Modal */}
            <Modal
                visible={cancelModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setCancelModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Reasons for Cancelling Subscription</Text>
                            <TouchableOpacity onPress={() => setCancelModalVisible(false)}>
                                <Icon type={Icons.Ionicons} name="close" color={blackColor} size={ms(20)} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.reasonsList}>
                            {CANCEL_REASONS.map((reason) => {
                                const isChecked = selectedReasons.includes(reason);
                                return (
                                    <TouchableOpacity
                                        key={reason}
                                        style={styles.reasonRow}
                                        onPress={() => toggleReason(reason)}
                                    >
                                        <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
                                            {isChecked && (
                                                <Icon type={Icons.Feather} name="check" color={whiteColor} size={ms(14)} />
                                            )}
                                        </View>
                                        <Text style={styles.reasonText}>{reason}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={handleCancelSubscription}
                        >
                            <Text style={styles.modalCancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    closeButton: {
        alignSelf: 'flex-end',
        marginRight: ms(15),
        marginBottom: ms(10),
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
    title: {
        fontSize: ms(20),
        fontFamily: bold,
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(8),
    },
    subtitle: {
        fontSize: ms(12),
        fontFamily: regular,
        color: '#666',
        textAlign: 'center',
        lineHeight: ms(18),
        marginBottom: vs(25),
        paddingHorizontal: ms(10),
    },

    // Card
    card: {
        borderWidth: ms(1.5),
        borderColor: '#E5E7EB',
        borderRadius: ms(16),
        padding: ms(16),
        marginBottom: vs(15),
    },
    cardSelected: {
        borderColor: primaryColor,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    radioOuter: {
        width: ms(20),
        height: ms(20),
        borderRadius: ms(10),
        borderWidth: ms(2),
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
    },
    radioOuterSelected: {
        borderColor: primaryColor,
    },
    radioInner: {
        width: ms(10),
        height: ms(10),
        borderRadius: ms(5),
        backgroundColor: primaryColor,
    },
    planName: {
        fontSize: ms(15),
        fontFamily: bold,
        color: blackColor,
    },
    cardRight: {
        alignItems: 'flex-end',
    },
    planPrice: {
        fontSize: ms(18),
        fontFamily: bold,
        color: blackColor,
    },
    planPeriod: {
        fontSize: ms(11),
        fontFamily: regular,
        color: blackColor,
        marginTop: vs(2),
    },
    expiryText: {
        fontSize: ms(12),
        fontFamily: regular,
        color: '#6B7280',
        marginTop: vs(10),
        marginLeft: ms(32),
    },

    // Includes
    includesSection: {
        marginLeft: ms(10),
        marginTop: vs(6),
    },
    includesLabel: {
        fontSize: ms(12),
        fontFamily: regular,
        color: '#666',
        marginBottom: vs(4),
    },
    includeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(2),
    },
    bullet: {
        fontSize: ms(14),
        color: blackColor,
        marginRight: ms(8),
    },
    includeText: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
    },
    viewMore: {
        fontSize: ms(12),
        color: primaryColor,
        fontFamily: bold,
        marginTop: vs(8),
        marginLeft: ms(10),
    },

    // Manage Plan
    managePlanRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(14),
        paddingTop: vs(12),
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    managePlanText: {
        flex: 1,
        fontSize: ms(13),
        fontFamily: bold,
        color: blackColor,
        marginLeft: ms(8),
    },

    // Upgrade Button
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E6F7F5',
        borderRadius: ms(25),
        paddingVertical: vs(12),
        marginTop: vs(12),
        gap: ms(6),
    },
    upgradeButtonText: {
        fontSize: ms(14),
        fontFamily: bold,
        color: primaryColor,
    },

    // Bottom
    bottomSection: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
    continueButton: {
        backgroundColor: primaryColor,
        borderRadius: ms(25),
        paddingVertical: vs(14),
        alignItems: 'center',
    },
    continueText: {
        fontSize: ms(16),
        fontFamily: bold,
        color: whiteColor,
    },
    compareRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: vs(15),
        gap: s(5),
    },
    compareText: {
        fontSize: ms(13),
        fontFamily: bold,
        color: blackColor,
    },

    // Cancel
    cancelButton: {
        backgroundColor: '#FEE2E2',
        borderRadius: ms(25),
        paddingVertical: vs(14),
        alignItems: 'center',
        marginTop: vs(15),
    },
    cancelButtonText: {
        fontSize: ms(15),
        fontFamily: bold,
        color: '#DC2626',
    },
    cancelNote: {
        fontSize: ms(11),
        fontFamily: regular,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: vs(10),
        lineHeight: ms(16),
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: whiteColor,
        borderTopLeftRadius: ms(20),
        borderTopRightRadius: ms(20),
        paddingTop: vs(20),
        paddingBottom: vs(20),
        maxHeight: '65%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(20),
        marginBottom: vs(16),
    },
    modalTitle: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
        flex: 1,
    },
    reasonsList: {
        paddingHorizontal: ms(20),
    },
    reasonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(10),
    },
    checkbox: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(4),
        borderWidth: ms(1),
        borderColor: '#D1D5DB',
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    checkboxActive: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },
    reasonText: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
        flex: 1,
    },
    modalCancelButton: {
        backgroundColor: '#FEE2E2',
        borderRadius: ms(25),
        paddingVertical: vs(14),
        alignItems: 'center',
        marginHorizontal: ms(20),
        marginTop: vs(16),
    },
    modalCancelButtonText: {
        fontSize: ms(15),
        fontFamily: bold,
        color: '#DC2626',
    },
});

export default SubscriptionPlans;
