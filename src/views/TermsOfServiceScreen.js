import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { heading, interMedium, interRegular } from '../config/Constants';
import { blackColor, globalGradient, whiteColor } from '../utils/globalColors';

const BulletItem = ({ text }) => (
    <View style={styles.bulletItem}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

const TermsOfServiceScreen = () => {
    const navigation = useNavigation();

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
                    <Text style={styles.headerTitle}>Terms of Service</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.contentCard}>

                        {/* <Text style={styles.mainHeading}>TERMS OF SERVICE</Text> */}
                        <Text style={styles.effectiveDate}>Effective Date: 01/04/2026</Text>
                        <Text style={styles.lastUpdated}>Last Updated: 01/04/2026</Text>

                        <Text style={styles.subHeading}>1. Acceptance of Terms</Text>
                        <Text style={styles.paragraph}>
                            By accessing or using the TrustLife mobile application, website, or related services ("Services"), you agree to be bound by these Terms of Service ("Terms").
                            If you do not agree to these Terms, you must not use the Services.
                        </Text>

                        <Text style={styles.subHeading}>2. About TrustLife</Text>
                        <Text style={styles.paragraph}>TrustLife is a health continuity and analytics platform that enables users to:</Text>
                        <BulletItem text="Store and organize health records" />
                        <BulletItem text="Structure longitudinal health data" />
                        <BulletItem text="Generate informational health analytics" />
                        <BulletItem text="Manage consent-based sharing of health data" />
                        <Text style={styles.importantText}>TrustLife is not a hospital, clinic, diagnostic laboratory, or medical practitioner.</Text>

                        <Text style={styles.subHeading}>3. Not Medical Advice</Text>
                        <Text style={styles.paragraph}>TrustLife provides informational health analytics derived from user-provided data. TrustLife:</Text>
                        <BulletItem text="Does not provide medical diagnosis" />
                        <BulletItem text="Does not prescribe treatment" />
                        <BulletItem text="Does not replace consultation with a qualified healthcare professional" />
                        <BulletItem text="Does not provide emergency services" />
                        <Text style={styles.importantText}>In case of medical emergency, contact a licensed healthcare provider immediately.</Text>

                        <Text style={styles.subHeading}>4. Eligibility</Text>
                        <Text style={styles.paragraph}>You must be at least 18 years of age to use the Services. By using TrustLife, you represent that:</Text>
                        <BulletItem text="You are legally capable of entering into a binding agreement" />
                        <BulletItem text="All information provided is accurate and truthful" />

                        <Text style={styles.subHeading}>5. User Account Responsibilities</Text>
                        <Text style={styles.paragraph}>You are responsible for:</Text>
                        <BulletItem text="Maintaining confidentiality of login credentials" />
                        <BulletItem text="Securing your device" />
                        <BulletItem text="Ensuring accuracy of uploaded data" />
                        <BulletItem text="Reviewing your consent settings" />
                        <Text style={styles.paragraph}>You agree to notify TrustLife promptly of any unauthorized access to your account.</Text>

                        <Text style={styles.subHeading}>6. User-Provided Data</Text>
                        <Text style={styles.paragraph}>You retain ownership of the personal data you upload. By using the Services, you grant TrustLife a limited, non-exclusive license to:</Text>
                        <BulletItem text="Store your data" />
                        <BulletItem text="Process your data for defined purposes" />
                        <BulletItem text="Generate informational analytics" />
                        <BulletItem text="Share data only under your explicit consent" />
                        <Text style={styles.importantText}>TrustLife does not sell identifiable personal data</Text>

                        <Text style={styles.subHeading}>7. Consent-Based Sharing</Text>
                        <Text style={styles.paragraph}>Data sharing with third parties occurs only when:</Text>
                        <BulletItem text="You explicitly approve access" />
                        <BulletItem text="The purpose is defined" />
                        <BulletItem text="The duration is specified" />
                        <Text style={styles.paragraph}>All access events are logged. You may revoke consent at any time using in-app controls.</Text>

                        <Text style={styles.subHeading}>8. Data Accuracy Disclaimer</Text>
                        <Text style={styles.paragraph}>TrustLife analytics rely on the accuracy and completeness of user-provided data. TrustLife is not responsible for:</Text>
                        <BulletItem text="Incomplete uploads" />
                        <BulletItem text="Incorrect biomarker entries" />
                        <BulletItem text="Delayed report synchronization" />
                        <BulletItem text="Third-party errors" />

                        <Text style={styles.subHeading}>9. Intellectual Property</Text>
                        <Text style={styles.paragraph}>All intellectual property rights in:</Text>
                        <BulletItem text="The TrustLife platform" />
                        <BulletItem text="Algorithms" />
                        <BulletItem text="Interface design" />
                        <BulletItem text="Branding" />
                        <BulletItem text="Content" />
                        <Text style={styles.paragraph}>Remain the property of TrustLife. You may not copy, reverse engineer, distribute, or exploit the platform without written authorization.</Text>

                        <Text style={styles.subHeading}>10. Prohibited Use</Text>
                        <Text style={styles.paragraph}>You agree not to:</Text>
                        <BulletItem text="Misuse the platform" />
                        <BulletItem text="Upload fraudulent medical data" />
                        <BulletItem text="Attempt unauthorized access" />
                        <BulletItem text="Reverse engineer scoring algorithms" />
                        <BulletItem text="Use the platform for unlawful purposes" />
                        <Text style={styles.paragraph}>TrustLife reserves the right to suspend accounts for violations.</Text>

                        <Text style={styles.subHeading}>11. Limitation of Liability</Text>
                        <Text style={styles.paragraph}>To the extent permitted by law, TrustLife shall not be liable for:</Text>
                        <BulletItem text="Clinical decisions made by users" />
                        <BulletItem text="Misinterpretation of analytics" />
                        <BulletItem text="Loss arising from third-party services" />
                        <BulletItem text="Indirect or consequential damages" />
                        <Text style={styles.paragraph}>Analytics provided are informational only.</Text>

                        <Text style={styles.subHeading}>12. Platform Availability</Text>
                        <Text style={styles.paragraph}>While we aim for high reliability, TrustLife does not guarantee uninterrupted access. We may:</Text>
                        <BulletItem text="Perform maintenance" />
                        <BulletItem text="Update systems" />
                        <BulletItem text="Improve features" />
                        <Text style={styles.paragraph}>without prior notice.</Text>

                        <Text style={styles.subHeading}>13. Security</Text>
                        <Text style={styles.paragraph}>TrustLife implements layered safeguards including:</Text>
                        <BulletItem text="Encryption in transit" />
                        <BulletItem text="Encryption at rest" />
                        <BulletItem text="Role-based internal access controls" />
                        <Text style={styles.paragraph}>However, no digital system can guarantee absolute security. In case of a security incident affecting personal data, users will be notified as required by applicable law.</Text>

                        <Text style={styles.subHeading}>14. Account Termination</Text>
                        <Text style={styles.paragraph}>
                            You may delete your account at any time. Upon deletion, identifiable personal data will be erased unless retention is required under applicable law.
                            TrustLife may suspend or terminate accounts for violation of these Terms.
                        </Text>

                        <Text style={styles.subHeading}>15. Indemnification</Text>
                        <Text style={styles.paragraph}>You agree to indemnify and hold harmless TrustLife from claims arising out of:</Text>
                        <BulletItem text="Your misuse of the platform" />
                        <BulletItem text="Violation of these Terms" />
                        <BulletItem text="Uploading inaccurate or unauthorized data" />

                        <Text style={styles.subHeading}>16. Governing Law</Text>
                        <Text style={styles.paragraph}>These Terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts located in India.</Text>

                        <Text style={styles.subHeading}>17. Amendments</Text>
                        <Text style={styles.paragraph}>TrustLife may modify these Terms from time to time. Material changes will be communicated through the application or website. Continued use of the Services after updates constitutes acceptance.</Text>

                        <Text style={styles.subHeading}>18. Grievance Redressal</Text>
                        <Text style={styles.paragraph}>For concerns relating to data protection or service use, contact:</Text>
                        <Text style={styles.boldText}>Grievance Officer</Text>
                        <Text style={styles.paragraph}>Email: grievance@trustlife.in</Text>
                        <Text style={styles.paragraph}>We aim to respond within timelines prescribed under applicable law.</Text>

                        <Text style={styles.subHeading}>19. Entire Agreement</Text>
                        <Text style={styles.paragraph}>
                            These Terms, together with the Privacy Policy, constitute the entire agreement between you and TrustLife regarding use of the Services.
                        </Text>

                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default TermsOfServiceScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    gradientBg: { flex: 1, paddingTop: ms(40) },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(20),
        paddingBottom: vs(12),
    },
    backButton: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
        elevation: 2, shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    headerTitle: { fontFamily: heading, fontSize: ms(18), color: whiteColor, marginLeft: ms(12) },
    scrollContent: { paddingHorizontal: ms(20), paddingBottom: vs(40) },
    contentCard: { borderRadius: ms(14), padding: ms(20) },
    mainHeading: {
        fontFamily: interMedium, fontSize: ms(18), color: colors.black,
        marginBottom: vs(5), textAlign: 'center',
    },
    effectiveDate: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280', marginBottom: vs(2) },
    lastUpdated: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280', marginBottom: vs(15) },
    subHeading: {
        fontFamily: interMedium, fontSize: ms(14), color: '#374151',
        marginTop: vs(12), marginBottom: vs(4),
    },
    paragraph: {
        fontFamily: interRegular, fontSize: ms(12), color: '#4B5563',
        lineHeight: ms(20), marginBottom: vs(8),
    },
    boldText: { fontFamily: interMedium, color: colors.black },
    importantText: {
        fontFamily: interMedium, fontSize: ms(12), color: '#DC2626',
        lineHeight: ms(20), marginTop: vs(4), marginBottom: vs(8),
        backgroundColor: '#FEE2E2', padding: ms(10), borderRadius: ms(8),
    },
    bulletItem: {
        flexDirection: 'row', alignItems: 'flex-start',
        marginBottom: vs(6), paddingLeft: ms(4),
    },
    bulletDot: {
        fontFamily: interMedium, fontSize: ms(14), color: colors.theme_fg,
        marginRight: ms(8), lineHeight: ms(20),
    },
    bulletText: {
        flex: 1, fontFamily: interRegular, fontSize: ms(12),
        color: '#4B5563', lineHeight: ms(20),
    },
});
