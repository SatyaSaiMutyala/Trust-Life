import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold } from '../config/Constants';
import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors';

const BulletItem = ({ text }) => (
    <View style={styles.bulletItem}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

const UserConsentAgreementScreen = () => {
    const navigation = useNavigation();
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [consentProcessing, setConsentProcessing] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.gradientBg}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={colors.black} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>User Consent Agreement</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.contentCard}>

                        <Text style={styles.mainHeading}>USER CONSENT AGREEMENT</Text>
                        <Text style={styles.effectiveDate}>Effective Date: 01/04/2026</Text>
                        <Text style={styles.paragraph}>
                            This User Consent Agreement ("Consent Agreement") forms part of the Terms of Service and Privacy Policy of TrustLife.
                            By selecting "I Agree" or using the TrustLife platform, you provide your explicit consent to the processing of your personal data in accordance with the terms below.
                        </Text>

                        <Text style={styles.subHeading}>1. Nature of the Platform</Text>
                        <Text style={styles.paragraph}>TrustLife is a health continuity and analytics platform designed to:</Text>
                        <BulletItem text="Store and structure health records" />
                        <BulletItem text="Generate informational health analytics" />
                        <BulletItem text="Enable consent-based sharing of health data" />
                        <Text style={styles.importantText}>TrustLife does not provide medical diagnosis, treatment, or emergency services.</Text>

                        <Text style={styles.subHeading}>2. Consent to Collection of Personal Data</Text>
                        <Text style={styles.paragraph}>You voluntarily consent to the collection and processing of the following categories of personal data:</Text>
                        <Text style={styles.boldText}>A. Account Information</Text>
                        <BulletItem text="Name, Contact details, Login credentials" />
                        <Text style={[styles.boldText, { marginTop: vs(5) }]}>B. Health Information (Provided by You)</Text>
                        <BulletItem text="Diagnostic reports, Laboratory values, Medication logs, Lifestyle inputs, Other health-related data you choose to upload" />
                        <Text style={[styles.boldText, { marginTop: vs(5) }]}>C. Derived Insights</Text>
                        <BulletItem text="TrustLife may generate statistical and informational health analytics derived from your submitted data. Derived outputs are informational only and do not constitute medical advice." />

                        <Text style={styles.subHeading}>3. Purpose of Processing</Text>
                        <Text style={styles.paragraph}>You consent to processing of your personal data strictly for:</Text>
                        <BulletItem text="Maintaining structured health continuity" />
                        <BulletItem text="Generating informational health analytics" />
                        <BulletItem text="Providing pattern-based guidance and alerts" />
                        <BulletItem text="Enabling consent-based data sharing" />
                        <Text style={styles.paragraph}>Personal data will not be processed beyond these purposes without additional consent.</Text>

                        <Text style={styles.subHeading}>4. Consent-Based Data Sharing</Text>
                        <Text style={styles.paragraph}>You may separately grant consent for sharing your personal data with:</Text>
                        <BulletItem text="Healthcare professionals" />
                        <BulletItem text="Diagnostic laboratories" />
                        <BulletItem text="Authorized third parties" />
                        <Text style={styles.paragraph}>Each sharing event shall:</Text>
                        <BulletItem text="Specify purpose" />
                        <BulletItem text="Specify scope" />
                        <BulletItem text="Specify duration" />
                        <BulletItem text="Be revocable at your discretion" />
                        <Text style={styles.paragraph}>All external access is logged.</Text>

                        <Text style={styles.subHeading}>5. Duration of Consent</Text>
                        <Text style={styles.paragraph}>This consent remains valid until:</Text>
                        <BulletItem text="You withdraw consent, or" />
                        <BulletItem text="You delete your account, or" />
                        <BulletItem text="Processing is no longer required for stated purposes" />
                        <Text style={styles.paragraph}>
                            You may withdraw consent at any time through the TrustLife application.
                            Withdrawal of consent shall not affect lawful processing undertaken prior to withdrawal.
                        </Text>

                        <Text style={styles.subHeading}>6. Data Security Acknowledgment</Text>
                        <Text style={styles.paragraph}>You acknowledge that TrustLife implements layered safeguards, including:</Text>
                        <BulletItem text="Encryption in transit" />
                        <BulletItem text="Encryption at rest" />
                        <BulletItem text="Role-based access control" />
                        <Text style={styles.paragraph}>While reasonable safeguards are implemented, no digital platform can guarantee absolute security.</Text>

                        <Text style={styles.subHeading}>7. Accuracy of Information</Text>
                        <Text style={styles.paragraph}>You acknowledge that:</Text>
                        <BulletItem text="Health analytics generated by TrustLife depend on the accuracy and completeness of data you provide." />
                        <BulletItem text="You are responsible for ensuring uploaded information is accurate." />
                        <BulletItem text="TrustLife shall not be liable for decisions made based on inaccurate or incomplete data." />

                        <Text style={styles.subHeading}>8. User Rights</Text>
                        <Text style={styles.paragraph}>You acknowledge that you may:</Text>
                        <BulletItem text="Access your personal data" />
                        <BulletItem text="Request correction" />
                        <BulletItem text="Download your data" />
                        <BulletItem text="Withdraw consent" />
                        <BulletItem text="Request deletion" />
                        <BulletItem text="File a grievance" />
                        <Text style={styles.paragraph}>These rights may be exercised through in-app controls or by contacting the Grievance Officer.</Text>

                        <Text style={styles.subHeading}>9. Children's Data</Text>
                        <Text style={styles.paragraph}>You confirm that:</Text>
                        <BulletItem text="You are 18 years of age or older, or" />
                        <BulletItem text="You are legally authorized to provide consent on behalf of a minor in compliance with applicable law." />

                        <Text style={styles.subHeading}>10. Cross-Border Processing</Text>
                        <Text style={styles.paragraph}>You acknowledge that your personal data may be processed using secure infrastructure in compliance with applicable Indian law.</Text>

                        <Text style={styles.subHeading}>11. Limitation of Medical Use</Text>
                        <Text style={styles.paragraph}>You acknowledge and agree that:</Text>
                        <BulletItem text="TrustLife analytics are informational and statistical in nature." />
                        <BulletItem text="TrustLife does not diagnose diseases." />
                        <BulletItem text="TrustLife does not replace consultation with a licensed healthcare professional." />
                        <BulletItem text="In case of medical emergency, you shall contact a qualified healthcare provider immediately." />

                        <Text style={styles.subHeading}>12. Grievance Redressal</Text>
                        <Text style={styles.paragraph}>For concerns relating to data processing, contact:</Text>
                        <Text style={styles.boldText}>Grievance Officer</Text>
                        <Text style={styles.paragraph}>Email: support@trustlife.in</Text>
                        <Text style={styles.paragraph}>TrustLife will respond within timelines prescribed under applicable law.</Text>

                        <Text style={styles.subHeading}>13. Affirmation of Consent</Text>
                        <Text style={styles.paragraph}>By selecting "I Agree" or continuing to use TrustLife, you confirm that:</Text>
                        <BulletItem text="You have read and understood this Consent Agreement." />
                        <BulletItem text="You voluntarily provide consent for processing as described." />
                        <BulletItem text="You understand your rights and control mechanisms" />

                        {/* Consent Checkboxes */}
                        <View style={styles.consentFooter}>
                            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreeTerms(!agreeTerms)}>
                                <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                                    {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                                <Text style={styles.checkboxText}>I agree to the Terms of Service</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreePrivacy(!agreePrivacy)}>
                                <View style={[styles.checkbox, agreePrivacy && styles.checkboxChecked]}>
                                    {agreePrivacy && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                                <Text style={styles.checkboxText}>I agree to the Privacy Policy</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.checkboxRow} onPress={() => setConsentProcessing(!consentProcessing)}>
                                <View style={[styles.checkbox, consentProcessing && styles.checkboxChecked]}>
                                    {consentProcessing && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                                <Text style={styles.checkboxText}>I provide consent for processing my personal data as described in the User Consent Agreement</Text>
                            </TouchableOpacity>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.declineButton} onPress={() => navigation.goBack()}>
                                    <Text style={styles.declineButtonText}>Decline</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.agreeButton, (!agreeTerms || !agreePrivacy || !consentProcessing) && styles.agreeButtonDisabled]}
                                    disabled={!agreeTerms || !agreePrivacy || !consentProcessing}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Text style={styles.agreeButtonText}>I Agree & Continue</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Final Disclaimer */}
                        <View style={styles.finalDisclaimer}>
                            <Text style={styles.disclaimerTitle}>IMPORTANT NOTICE</Text>
                            <Text style={styles.disclaimerText}>
                                TrustLife is a health continuity and analytics platform. It does not provide medical diagnosis, treatment, or emergency medical services.
                            </Text>
                        </View>

                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default UserConsentAgreementScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    gradientBg: { flex: 1, paddingTop: ms(40) },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(20), paddingTop: ms(20), paddingBottom: vs(12),
    },
    backButton: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
        elevation: 2, shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    headerTitle: { fontFamily: bold, fontSize: ms(16), color: whiteColor, marginLeft: ms(12) },
    scrollContent: { paddingHorizontal: ms(20), paddingBottom: vs(40) },
    contentCard: { borderRadius: ms(14), padding: ms(20) },
    mainHeading: {
        fontFamily: bold, fontSize: ms(18), color: colors.black,
        marginBottom: vs(5), textAlign: 'center',
    },
    effectiveDate: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', marginBottom: vs(15) },
    subHeading: {
        fontFamily: bold, fontSize: ms(14), color: '#374151',
        marginTop: vs(12), marginBottom: vs(4),
    },
    paragraph: {
        fontFamily: regular, fontSize: ms(12), color: '#4B5563',
        lineHeight: ms(20), marginBottom: vs(8),
    },
    boldText: { fontFamily: bold, color: colors.black },
    importantText: {
        fontFamily: bold, fontSize: ms(12), color: '#DC2626',
        lineHeight: ms(20), marginTop: vs(4), marginBottom: vs(8),
        backgroundColor: '#FEE2E2', padding: ms(10), borderRadius: ms(8),
    },
    bulletItem: {
        flexDirection: 'row', alignItems: 'flex-start',
        marginBottom: vs(6), paddingLeft: ms(4),
    },
    bulletDot: {
        fontFamily: bold, fontSize: ms(14), color: colors.theme_fg,
        marginRight: ms(8), lineHeight: ms(20),
    },
    bulletText: {
        flex: 1, fontFamily: regular, fontSize: ms(12),
        color: '#4B5563', lineHeight: ms(20),
    },
    consentFooter: {
        marginTop: vs(20), padding: ms(15),
        backgroundColor: '#F9FAFB', borderRadius: ms(10),
    },
    checkboxRow: {
        flexDirection: 'row', alignItems: 'flex-start',
        marginBottom: vs(14),
    },
    checkbox: {
        width: ms(20), height: ms(20), borderRadius: ms(4),
        borderWidth: 2, borderColor: '#D1D5DB',
        justifyContent: 'center', alignItems: 'center',
        marginRight: ms(10), marginTop: ms(1),
    },
    checkboxChecked: { backgroundColor: primaryColor, borderColor: primaryColor },
    checkmark: { color: whiteColor, fontSize: ms(12), fontFamily: bold },
    checkboxText: {
        flex: 1, fontFamily: regular, fontSize: ms(12),
        color: '#374151', lineHeight: ms(18),
    },
    buttonRow: { flexDirection: 'row', gap: ms(10), marginTop: vs(8) },
    declineButton: {
        flex: 1, height: vs(44), backgroundColor: '#F3F4F6',
        borderRadius: ms(10), justifyContent: 'center', alignItems: 'center',
    },
    declineButtonText: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    agreeButton: {
        flex: 2, height: vs(44), backgroundColor: primaryColor,
        borderRadius: ms(10), justifyContent: 'center', alignItems: 'center',
    },
    agreeButtonDisabled: { backgroundColor: '#A7D7CC' },
    agreeButtonText: { fontFamily: bold, fontSize: ms(14), color: whiteColor },
    finalDisclaimer: {
        marginTop: vs(20), padding: ms(15),
        backgroundColor: '#FEF2F2', borderRadius: ms(10),
        borderWidth: 1, borderColor: '#FEE2E2',
    },
    disclaimerTitle: { fontFamily: bold, fontSize: ms(12), color: '#991B1B', marginBottom: vs(5) },
    disclaimerText: { fontFamily: regular, fontSize: ms(12), color: '#4B5563', lineHeight: ms(18) },
});
