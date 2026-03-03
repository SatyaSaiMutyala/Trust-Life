import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold } from '../config/Constants';
import { blackColor, globalGradient, whiteColor } from '../utils/globalColors';

const BulletItem = ({ text }) => (
    <View style={styles.bulletItem}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

const PrivacyPolicyScreen = () => {
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
                    <Text style={styles.headerTitle}>Privacy Policy</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.contentCard}>

                        <Text style={styles.mainHeading}>PRIVACY POLICY</Text>
                        <Text style={styles.effectiveDate}>Effective Date: 01/04/2026</Text>
                        <Text style={styles.lastUpdated}>Last Updated: 01/04/2026</Text>

                        <Text style={styles.paragraph}>
                            TrustLife ("we", "our", "us") is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and share your information when you use the TrustLife platform.
                        </Text>

                        <Text style={styles.subHeading}>1. Information We Collect</Text>
                        <Text style={styles.paragraph}>We collect the following categories of personal information:</Text>
                        <Text style={styles.boldText}>A. Account Information</Text>
                        <BulletItem text="Full name and date of birth" />
                        <BulletItem text="Contact details (email address, phone number)" />
                        <BulletItem text="Login credentials (stored securely)" />
                        <Text style={[styles.boldText, { marginTop: vs(6) }]}>B. Health Information</Text>
                        <BulletItem text="Diagnostic reports and lab results you upload" />
                        <BulletItem text="Medication logs and prescription records" />
                        <BulletItem text="Vital signs and biomarker readings" />
                        <BulletItem text="Lifestyle data (sleep, activity, nutrition)" />
                        <Text style={[styles.boldText, { marginTop: vs(6) }]}>C. Usage Data</Text>
                        <BulletItem text="App interaction logs" />
                        <BulletItem text="Device identifiers and OS version" />
                        <BulletItem text="Session timestamps and feature usage" />

                        <Text style={styles.subHeading}>2. How We Use Your Information</Text>
                        <Text style={styles.paragraph}>We process your personal data only for the following defined purposes:</Text>
                        <BulletItem text="To maintain your structured health continuity record" />
                        <BulletItem text="To generate informational health analytics and trend reports" />
                        <BulletItem text="To provide pattern-based health alerts and guidance" />
                        <BulletItem text="To enable consent-based sharing of your health data" />
                        <BulletItem text="To improve platform performance and user experience" />
                        <BulletItem text="To comply with applicable legal obligations" />
                        <Text style={styles.importantText}>
                            TrustLife does not use your health data for advertising or sell your identifiable personal data to third parties.
                        </Text>

                        <Text style={styles.subHeading}>3. Data Sharing</Text>
                        <Text style={styles.paragraph}>Your data is shared only in the following circumstances:</Text>
                        <BulletItem text="With healthcare professionals or labs — only under your explicit consent" />
                        <BulletItem text="With service providers who assist in platform operations (under strict data processing agreements)" />
                        <BulletItem text="When required by law or a valid legal order" />
                        <Text style={styles.paragraph}>All external sharing events are logged and accessible to you in the Access Log.</Text>

                        <Text style={styles.subHeading}>4. Data Retention</Text>
                        <Text style={styles.paragraph}>
                            We retain your personal data for as long as your account is active or as needed to provide services.
                            Upon account deletion, identifiable personal data is erased unless retention is required under applicable law.
                        </Text>

                        <Text style={styles.subHeading}>5. Your Rights</Text>
                        <Text style={styles.paragraph}>Under applicable data protection law, you have the right to:</Text>
                        <BulletItem text="Access a copy of your personal data" />
                        <BulletItem text="Request correction of inaccurate data" />
                        <BulletItem text="Download your health records" />
                        <BulletItem text="Withdraw consent for data processing" />
                        <BulletItem text="Request deletion of your account and data" />
                        <BulletItem text="File a grievance with TrustLife or a regulatory authority" />
                        <Text style={styles.paragraph}>These rights can be exercised through in-app settings or by contacting our Grievance Officer.</Text>

                        <Text style={styles.subHeading}>6. Cookies & Tracking</Text>
                        <Text style={styles.paragraph}>
                            TrustLife uses minimal session-based identifiers for authentication and performance monitoring.
                            We do not use third-party advertising cookies or cross-site trackers.
                        </Text>

                        <Text style={styles.subHeading}>7. Children's Privacy</Text>
                        <Text style={styles.paragraph}>
                            The TrustLife platform is intended for users 18 years of age and older.
                            We do not knowingly collect data from individuals under 18 without verified parental or guardian consent.
                        </Text>

                        <Text style={styles.subHeading}>8. Data Security</Text>
                        <Text style={styles.paragraph}>We protect your data using:</Text>
                        <BulletItem text="End-to-end encryption in transit (TLS)" />
                        <BulletItem text="Encryption at rest for stored health data" />
                        <BulletItem text="Role-based access control for internal teams" />
                        <BulletItem text="Regular security audits and infrastructure monitoring" />
                        <Text style={styles.paragraph}>
                            While we implement industry-standard safeguards, no digital platform can guarantee absolute security.
                            In the event of a data breach affecting your personal data, we will notify you as required by law.
                        </Text>

                        <Text style={styles.subHeading}>9. Data Protection & Legal Alignment</Text>
                        <Text style={styles.paragraph}>
                            TrustLife is designed in alignment with applicable Indian data protection law, including the Digital Personal Data Protection Act, 2023.
                        </Text>
                        <Text style={styles.paragraph}>
                            TrustLife processes personal data only for clearly defined health continuity and analytics purposes.
                        </Text>

                        <Text style={styles.subHeading}>10. Changes to This Policy</Text>
                        <Text style={styles.paragraph}>
                            We may update this Privacy Policy from time to time. Material changes will be communicated through the application or website.
                            Continued use of the Services after updates constitutes your acceptance of the revised policy.
                        </Text>

                        <Text style={styles.subHeading}>11. Grievance Officer</Text>
                        <Text style={styles.paragraph}>For data-related concerns, contact:</Text>
                        <Text style={styles.boldText}>Grievance Officer — TrustLife</Text>
                        <Text style={styles.paragraph}>Email: grievance@trustlife.in</Text>
                        <Text style={styles.noteText}>We aim to respond within timelines prescribed under applicable law.</Text>

                        <View style={styles.disclaimerBox}>
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

export default PrivacyPolicyScreen;

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
    effectiveDate: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', marginBottom: vs(2) },
    lastUpdated: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', marginBottom: vs(15) },
    subHeading: {
        fontFamily: bold, fontSize: ms(14), color: '#374151',
        marginTop: vs(12), marginBottom: vs(4),
    },
    paragraph: {
        fontFamily: regular, fontSize: ms(12), color: '#4B5563',
        lineHeight: ms(20), marginBottom: vs(8),
    },
    boldText: { fontFamily: bold, color: colors.black },
    noteText: {
        fontFamily: regular, fontSize: ms(11), color: '#6B7280',
        lineHeight: ms(18), marginTop: vs(2), marginBottom: vs(8), fontStyle: 'italic',
    },
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
    disclaimerBox: {
        marginTop: vs(20), padding: ms(15),
        backgroundColor: '#FEF2F2', borderRadius: ms(10),
        borderWidth: 1, borderColor: '#FEE2E2',
    },
    disclaimerTitle: { fontFamily: bold, fontSize: ms(12), color: '#991B1B', marginBottom: vs(5) },
    disclaimerText: { fontFamily: regular, fontSize: ms(12), color: '#4B5563', lineHeight: ms(18) },
});
