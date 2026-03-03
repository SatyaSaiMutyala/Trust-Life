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
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const AnnualTrustReportScreen = () => {
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
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Annual Trust Report</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Report Card */}
                    <View style={styles.reportCard}>
                        {/* Main Title */}
                        <Text style={styles.reportMainTitle}>
                            TrustLife Annual Trust Report 2026
                        </Text>
                        <Text style={styles.reportSubtitle}>
                            Health Continuity Infrastructure
                        </Text>
                        <Text style={styles.reportParagraph}>
                            Reporting Period: April 1, 2025 – March 31, 2026
                        </Text>

                        {/* Founder / CEO Letter */}
                        <Text style={styles.sectionHeading}>
                            Founder / CEO Letter
                        </Text>
                        <Text style={styles.reportParagraph}>
                            Health is continuous. Healthcare is episodic.
                        </Text>
                        <Text style={styles.reportParagraph}>
                            TrustLife was built to structure health continuity — responsibly, transparently, and securely.
                        </Text>
                        <Text style={styles.reportParagraph}>
                            In this report, we share how we protect user data, manage consent, ensure platform reliability, and uphold ethical analytics practices. Transparency is not a feature at TrustLife — it is governance.
                        </Text>
                        <Text style={styles.reportParagraph}>
                            — Venkata Cherukuri{'\n'}Founder, TrustLife
                        </Text>

                        {/* Data Governance Summary */}
                        <Text style={styles.sectionHeading}>
                            Data Governance Summary
                        </Text>

                        <Text style={styles.subHeading}>Data Processed in FY 2026</Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Registered Users:</Text> 42,300
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Active Monthly Users:</Text> 28,900
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Total Reports Stored:</Text> 318,000
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Average Reports per User:</Text> 7.5
                            </Text>
                        </View>

                        <Text style={styles.subHeading}>Data Categories Processed</Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Diagnostics</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Lifestyle inputs</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Medication logs</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Derived health analytics</Text>
                        </View>

                        <Text style={styles.statementText}>
                            Statement:{'\n'}TrustLife processes personal data solely for health continuity and analytics purposes in alignment with applicable Indian law
                        </Text>

                        {/* Consent & Access Transparency */}
                        <Text style={styles.sectionHeading}>
                            Consent & Access Transparency
                        </Text>

                        <Text style={styles.subHeading}>Consent Statistics</Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Total Active Consents:</Text> 12,450
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Doctor Consents:</Text> 8,100
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Lab Integrations:</Text> 3,900
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Insurance Sharing:</Text> 450
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Average Consent Duration:</Text> 37 days
                            </Text>
                        </View>

                        <Text style={styles.subHeading}>Access Log Summary</Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Total External Data Access Events:</Text> 21,320
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Unauthorized Access Events:</Text> 0
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Access Revocations by Users:</Text> 1,230
                            </Text>
                        </View>

                        <Text style={styles.statementText}>
                            Statement:{'\n'}All external access events were logged and linked to active user consent.
                        </Text>

                        {/* Security & Infrastructure */}
                        <Text style={styles.sectionHeading}>
                            Security & Infrastructure
                        </Text>

                        <Text style={styles.subHeading}>Security Measures Implemented</Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Encryption in transit (TLS)</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Encryption at rest</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Role-based internal access controls</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Periodic vulnerability assessments</Text>
                        </View>

                        <Text style={styles.subHeading}>Security Events in FY 2026</Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Confirmed Breaches:</Text> 0
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Attempted Intrusions Blocked:</Text> 18
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>User Notifications Issued:</Text> 0
                            </Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            If breach occurs, disclose clearly.
                        </Text>

                        {/* Data Protection & Compliance */}
                        <Text style={styles.sectionHeading}>
                            Data Protection & Compliance
                        </Text>

                        <Text style={styles.subHeading}>Legal Alignment</Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Digital Personal Data Protection Act, 2023</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Structured consent architecture implemented</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>In-app grievance redressal mechanism active</Text>
                        </View>

                        <Text style={styles.subHeading}>Grievance Summary</Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Complaints Received:</Text> 38
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Resolved Within Timeline:</Text> 100%
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Average Resolution Time:</Text> 3.2 days
                            </Text>
                        </View>

                        {/* Algorithm Transparency */}
                        <Text style={styles.sectionHeading}>
                            Algorithm Transparency
                        </Text>

                        <Text style={styles.subHeading}>Health Progression Score Methodology</Text>
                        <Text style={styles.reportParagraph}>
                            Derived from:
                        </Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Risk tier movement</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Biomarker stability</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Continuity engagement patterns</Text>
                        </View>

                        <Text style={styles.statementText}>
                            Statement:{'\n'}TrustLife analytics provide informational health pattern insights and do not constitute medical diagnosis.
                        </Text>

                        {/* Reliability & Uptime */}
                        <Text style={styles.sectionHeading}>
                            Reliability & Uptime
                        </Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Platform Uptime:</Text> 99.4%
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Average Response Time:</Text> 1.2 seconds
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Backup Redundancy:</Text> Multi-layered
                            </Text>
                        </View>
                        <Text style={styles.reportParagraph}>
                            This signals infrastructure maturity.
                        </Text>

                        {/* Data Retention & Deletion */}
                        <Text style={styles.sectionHeading}>
                            Data Retention & Deletion
                        </Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Account Deletion Requests:</Text> 412
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Data Erased in Compliance:</Text> 412
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Data Retained Under Legal Requirement:</Text> 0
                            </Text>
                        </View>

                        <Text style={styles.statementText}>
                            Statement:{'\n'}Data is retained only as long as required for stated purposes or under applicable law.
                        </Text>

                        {/* Independent Oversight */}
                        <Text style={styles.sectionHeading}>
                            Independent Oversight (Optional Future Layer)
                        </Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Third-party security audit completed (if applicable)</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Advisory board includes healthcare and technology experts</Text>
                        </View>
                        <Text style={styles.reportParagraph}>
                            Even mentioning roadmap here increases trust.
                        </Text>

                        {/* Looking Ahead */}
                        <Text style={styles.sectionHeading}>
                            Looking Ahead
                        </Text>
                        <Text style={styles.reportParagraph}>
                            Future commitments:
                        </Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Enhanced consent granularity</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>External security certification</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Structured research ethics review framework</Text>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradientBg: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(12),
    },
    backButton: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
        elevation: 2, shadowColor: blackColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: whiteColor,
        marginLeft: ms(12),
    },

    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(40),
    },

    // Report Card
    reportCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(20),
    },

    reportMainTitle: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
        marginBottom: vs(4),
    },
    reportSubtitle: {
        fontFamily: bold,
        fontSize: ms(13),
        color: primaryColor,
        marginBottom: vs(4),
    },

    // Section heading
    sectionHeading: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginTop: vs(18),
        marginBottom: vs(8),
    },

    subHeading: {
        fontFamily: bold,
        fontSize: ms(12),
        color: '#374151',
        marginTop: vs(8),
        marginBottom: vs(4),
    },

    // Paragraph
    reportParagraph: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#4B5563',
        lineHeight: ms(20),
        marginBottom: vs(8),
    },

    // Statement
    statementText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#4B5563',
        lineHeight: ms(20),
        marginTop: vs(8),
        marginBottom: vs(8),
        backgroundColor: '#F0FDF4',
        borderRadius: ms(8),
        padding: ms(12),
    },

    // Bullet items
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: vs(6),
        paddingLeft: ms(4),
    },
    bulletDot: {
        fontFamily: bold,
        fontSize: ms(12),
        color: primaryColor,
        marginRight: ms(8),
        lineHeight: ms(20),
    },
    bulletText: {
        flex: 1,
        fontFamily: regular,
        fontSize: ms(12),
        color: '#4B5563',
        lineHeight: ms(20),
    },
    boldText: {
        fontFamily: bold,
        color: blackColor,
    },
});

export default AnnualTrustReportScreen;
