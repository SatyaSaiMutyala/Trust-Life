// import React from 'react';
// import {
//     SafeAreaView,
//     StyleSheet,
//     View,
//     Text,
//     ScrollView,
//     TouchableOpacity,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { ms, vs } from 'react-native-size-matters';
// import LinearGradient from 'react-native-linear-gradient';
// import { StatusBar2 } from '../../components/StatusBar';
// import Icon, { Icons } from '../../components/Icons';
// import { blackColor, whiteColor, primaryColor, globalGradient } from '../../utils/globalColors';
// import { bold, regular } from '../../config/Constants';

// const DataTransparencyCenterScreen = () => {
//     const navigation = useNavigation();

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar2 />
//             <LinearGradient
//                 colors={globalGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 0, y: 3 }}
//                 locations={[0, 0.08]}
//                 style={styles.gradientBg}
//             >
//                 {/* Header */}
//                 <View style={styles.header}>
//                     <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//                         <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
//                     </TouchableOpacity>
//                     <Text style={styles.headerTitle}>Data Transparency Center</Text>
//                 </View>

//                 <ScrollView
//                     showsVerticalScrollIndicator={false}
//                     contentContainerStyle={styles.scrollContent}
//                 >
//                     {/* Report Card */}
//                     <View style={styles.reportCard}>

//                         {/* How Health Insights Are Calculated */}
//                         <Text style={styles.reportMainTitle}>
//                             How Health Insights Are Calculated
//                         </Text>
//                         <Text style={styles.reportParagraph}>
//                             TrustLife generates structured health insights using longitudinal data patterns across time.
//                         </Text>
//                         <Text style={styles.reportParagraph}>
//                             Your Health Progression Score and related indicators are derived from the following components:
//                         </Text>

//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>
//                                 <Text style={styles.boldText}>Risk Tier Movement</Text>
//                                 {'\n'}Changes in your relative health pattern classification over time, based on available data inputs.
//                             </Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>
//                                 <Text style={styles.boldText}>Biomarker Stability</Text>
//                                 {'\n'}Trend consistency and variability in key laboratory markers across multiple reports.
//                             </Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>
//                                 <Text style={styles.boldText}>Engagement Continuity</Text>
//                                 {'\n'}Regularity and completeness of health record updates, tracking inputs, and follow-up data.
//                             </Text>
//                         </View>

//                         <Text style={styles.reportParagraph}>
//                             These components are combined using structured statistical methods to provide directional health insights.
//                         </Text>

//                         {/* Important Notice */}
//                         <Text style={styles.statementText}>
//                             Important Notice{'\n\n'}TrustLife provides informational analytics based on available data patterns and does not provide medical diagnosis, treatment recommendations, or emergency medical services. Clinical decisions should be made in consultation with a qualified healthcare professional.
//                         </Text>

//                         {/* Security Summary */}
//                         <Text style={styles.sectionHeading}>
//                             Security Summary
//                         </Text>
//                         <Text style={styles.reportParagraph}>
//                             Your health information is protected using layered safeguards designed to maintain confidentiality and integrity.
//                         </Text>

//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>
//                                 <Text style={styles.boldText}>Encrypted in Transit</Text>
//                                 {'\n'}All data transmitted between your device and TrustLife systems is encrypted using secure communication protocols.
//                             </Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>
//                                 <Text style={styles.boldText}>Encrypted at Rest</Text>
//                                 {'\n'}Your stored health information remains encrypted within secure infrastructure environments.
//                             </Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>
//                                 <Text style={styles.boldText}>Role-Based Access Control</Text>
//                                 {'\n'}Access to data within TrustLife systems is restricted and granted only based on defined roles and operational necessity.
//                             </Text>
//                         </View>

//                         <Text style={styles.reportParagraph}>
//                             Security controls are continuously monitored and updated in alignment with applicable Indian data protection standards.
//                         </Text>

//                         {/* Consent Overview */}
//                         <Text style={styles.sectionHeading}>
//                             Consent Overview
//                         </Text>

//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>
//                                 <Text style={styles.boldText}>Active Consents:</Text> 3
//                             </Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>
//                                 <Text style={styles.boldText}>Expired:</Text> 1
//                             </Text>
//                         </View>

//                         {/* Who Has Access */}
//                         <Text style={styles.sectionHeading}>
//                             Who Has Access
//                         </Text>

//                         <View style={styles.tableHeader}>
//                             <Text style={[styles.tableHeaderText, { flex: 1 }]}>Entity</Text>
//                             <Text style={[styles.tableHeaderText, { flex: 1 }]}>Purpose</Text>
//                             <Text style={[styles.tableHeaderText, { flex: 0.6 }]}>Date</Text>
//                         </View>

//                         {/* <TouchableOpacity style={styles.viewLogBtn}>
//                             <Text style={styles.viewLogBtnText}>View Full Access Log</Text>
//                         </TouchableOpacity> */}
//                         <Text style={styles.reportParagraph}>
//                            “View Full Access Log” button below
//                         </Text>


//                         {/* How Your Data Is Used */}
//                         <Text style={styles.sectionHeading}>
//                             How Your Data Is Used
//                         </Text>
//                         <Text style={styles.reportParagraph}>
//                             Your health information is used only for clearly defined platform functions and consent-based sharing.
//                         </Text>

//                         {/* Core Platform Function */}
//                         <Text style={styles.subHeading}>Core Platform Function</Text>
//                         <Text style={styles.reportParagraph}>
//                             Your data is used to:
//                         </Text>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Maintain structured health continuity over time</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Calculate Health Progression Score</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Monitor biomarker trends and stability</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Generate structured pattern-based health insights</Text>
//                         </View>

//                         <Text style={styles.statementText}>
//                             These insights are informational and are not a medical diagnosis.
//                         </Text>

//                         {/* Guidance & Alerts */}
//                         <Text style={styles.subHeading}>Guidance & Alerts</Text>
//                         <Text style={styles.reportParagraph}>
//                             Your data helps:
//                         </Text>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Identify significant trend changes</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Suggest follow-up timelines</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Highlight continuity gaps</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Provide health engagement reminders</Text>
//                         </View>

//                         <Text style={styles.reportParagraph}>
//                             Alerts are generated using statistical pattern recognition and available data inputs.
//                         </Text>

//                         {/* Consent-Based Sharing */}
//                         <Text style={styles.subHeading}>Consent-Based Sharing</Text>
//                         <Text style={styles.reportParagraph}>
//                             Your health information may be shared only when you explicitly approve access.
//                         </Text>
//                         <Text style={styles.reportParagraph}>Examples:</Text>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Sharing summaries with doctors</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Synchronizing reports from diagnostic labs</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Exporting structured data to authorized entities</Text>
//                         </View>

//                         <Text style={styles.reportParagraph}>
//                             All external access is logged and linked to your active consent.
//                         </Text>

//                         <Text style={styles.statementText}>
//                             TrustLife does not sell identifiable health data.{'\n'}Personal data is processed in alignment with applicable Indian data protection law.
//                         </Text>

//                         {/* Health Continuity with Accountability */}
//                         <Text style={styles.sectionHeading}>
//                             Health Continuity with Accountability
//                         </Text>
//                         <Text style={styles.reportParagraph}>
//                             Health data is sensitive. TrustLife is designed to structure health continuity while ensuring that users remain in control of their information at all times.
//                         </Text>

//                         {/* What Data We Process */}
//                         <Text style={styles.subHeading}>What Data We Process</Text>
//                         <Text style={styles.reportParagraph}>TrustLife processes:</Text>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Diagnostic records uploaded or synced by users</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Lifestyle and medication inputs entered voluntarily</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Derived health analytics generated from structured patterns</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Consent records and access logs</Text>
//                         </View>

//                         <Text style={styles.statementText}>
//                             Derived insights are informational and do not constitute medical diagnosis.
//                         </Text>

//                         {/* How Data Is Used */}
//                         <Text style={styles.subHeading}>How Data Is Used</Text>
//                         <Text style={styles.reportParagraph}>
//                             Personal data is used exclusively to:
//                         </Text>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Maintain longitudinal health continuity</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Generate structured health analytics</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Provide continuity reminders and pattern insights</Text>
//                         </View>

//                         <Text style={styles.reportParagraph}>
//                             Data is not used beyond clearly defined purposes without user consent.
//                         </Text>

//                         {/* Consent-Based Sharing (Policy) */}
//                         <Text style={styles.subHeading}>Consent-Based Sharing</Text>
//                         <Text style={styles.reportParagraph}>
//                             TrustLife shares health information only when:
//                         </Text>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Explicit user consent is provided</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Purpose is clearly defined</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Duration is specified</Text>
//                         </View>

//                         <Text style={styles.reportParagraph}>
//                             Users may revoke access at any time.{'\n'}All access events are logged.
//                         </Text>

//                         {/* Security Measures */}
//                         <Text style={styles.sectionHeading}>
//                             Security Measures
//                         </Text>
//                         <Text style={styles.reportParagraph}>
//                             TrustLife employs layered safeguards including:
//                         </Text>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Encryption in transit</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Encryption at rest</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Role-based internal access control</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Secure infrastructure monitoring</Text>
//                         </View>

//                         <Text style={styles.reportParagraph}>
//                             In the event of a security incident affecting user data, affected users will be notified as required under applicable law.
//                         </Text>

//                         {/* User Rights */}
//                         <Text style={styles.sectionHeading}>
//                             User Rights
//                         </Text>
//                         <Text style={styles.reportParagraph}>Users may:</Text>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Access their stored data</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Correct inaccuracies</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Download their records</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Withdraw consent</Text>
//                         </View>
//                         <View style={styles.bulletItem}>
//                             <Text style={styles.bulletDot}>•</Text>
//                             <Text style={styles.bulletText}>Request account deletion</Text>
//                         </View>

//                         <Text style={styles.reportParagraph}>
//                             Requests may be initiated directly through the TrustLife application.
//                         </Text>

//                         {/* Legal Alignment */}
//                         <Text style={styles.sectionHeading}>
//                             Legal Alignment
//                         </Text>
//                         <Text style={styles.reportParagraph}>
//                             TrustLife is designed in alignment with applicable Indian data protection law, including the Digital Personal Data Protection Act, 2023.
//                         </Text>

//                         <Text style={styles.statementText}>
//                             TrustLife does not provide medical diagnosis, treatment recommendations, or emergency services.
//                         </Text>

//                         {/* Contact & Grievance */}
//                         <Text style={styles.sectionHeading}>
//                             Contact & Grievance
//                         </Text>
//                         <Text style={styles.reportParagraph}>
//                             <Text style={styles.boldText}>Grievance Officer</Text>
//                             {'\n'}Email: support@trustlife.in
//                         </Text>
//                         <Text style={styles.reportParagraph}>
//                             We aim to respond within the timeline prescribed under applicable law.
//                         </Text>

//                     </View>
//                 </ScrollView>
//             </LinearGradient>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     gradientBg: { flex: 1 },

//     // Header
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: ms(20),
//         paddingTop: ms(50),
//         paddingBottom: vs(12),
//     },
//     backButton: {
//         width: ms(34), height: ms(34), borderRadius: ms(17),
//         backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
//         elevation: 2, shadowColor: blackColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
//     },
//     headerTitle: {
//         fontFamily: bold,
//         fontSize: ms(16),
//         color: whiteColor,
//         marginLeft: ms(12),
//     },

//     scrollContent: {
//         paddingHorizontal: ms(20),
//         paddingBottom: vs(40),
//     },

//     // Report Card
//     reportCard: {
//         backgroundColor: whiteColor,
//         borderRadius: ms(14),
//         padding: ms(20),
//     },

//     reportMainTitle: {
//         fontFamily: bold,
//         fontSize: ms(18),
//         color: blackColor,
//         marginBottom: vs(8),
//     },

//     // Section heading
//     sectionHeading: {
//         fontFamily: bold,
//         fontSize: ms(14),
//         color: blackColor,
//         marginTop: vs(18),
//         marginBottom: vs(8),
//     },

//     subHeading: {
//         fontFamily: bold,
//         fontSize: ms(12),
//         color: '#374151',
//         marginTop: vs(8),
//         marginBottom: vs(4),
//     },

//     // Paragraph
//     reportParagraph: {
//         fontFamily: regular,
//         fontSize: ms(12),
//         color: '#4B5563',
//         lineHeight: ms(20),
//         marginBottom: vs(8),
//     },

//     // Statement
//     statementText: {
//         fontFamily: regular,
//         fontSize: ms(12),
//         color: '#4B5563',
//         lineHeight: ms(20),
//         marginTop: vs(8),
//         marginBottom: vs(8),
//         backgroundColor: '#F0FDF4',
//         borderRadius: ms(8),
//         padding: ms(12),
//     },

//     // Bullet items
//     bulletItem: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         marginBottom: vs(6),
//         paddingLeft: ms(4),
//     },
//     bulletDot: {
//         fontFamily: bold,
//         fontSize: ms(12),
//         color: primaryColor,
//         marginRight: ms(8),
//         lineHeight: ms(20),
//     },
//     bulletText: {
//         flex: 1,
//         fontFamily: regular,
//         fontSize: ms(12),
//         color: '#4B5563',
//         lineHeight: ms(20),
//     },
//     boldText: {
//         fontFamily: bold,
//         color: blackColor,
//     },

//     // Table header
//     tableHeader: {
//         flexDirection: 'row',
//         backgroundColor: '#F3F4F6',
//         borderRadius: ms(8),
//         padding: ms(10),
//         marginBottom: vs(8),
//     },
//     tableHeaderText: {
//         fontFamily: bold,
//         fontSize: ms(11),
//         color: '#6B7280',
//     },

//     // View log button
//     viewLogBtn: {
//         alignItems: 'center',
//         paddingVertical: vs(10),
//         borderWidth: 1,
//         borderColor: primaryColor,
//         borderRadius: ms(8),
//         marginBottom: vs(8),
//     },
//     viewLogBtnText: {
//         fontFamily: bold,
//         fontSize: ms(12),
//         color: primaryColor,
//     },
// });

// export default DataTransparencyCenterScreen;



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

const DataTransparencyCenterScreen = () => {
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
                    <Text style={styles.headerTitle}>Data Transparency Center</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Report Card */}
                    <View style={styles.reportCard}>

                        {/* How Health Insights Are Calculated */}
                        <Text style={styles.reportMainTitle}>
                            How Health Insights Are Calculated
                        </Text>
                        <Text style={styles.reportParagraph}>
                            TrustLife generates structured health insights using longitudinal data patterns across time.
                        </Text>
                        <Text style={styles.reportParagraph}>
                            Your Health Progression Score and related indicators are derived from the following components:
                        </Text>

                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Risk Tier Movement</Text>
                                {'\n'}Changes in your relative health pattern classification over time, based on available data inputs.
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Biomarker Stability</Text>
                                {'\n'}Trend consistency and variability in key laboratory markers across multiple reports.
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Engagement Continuity</Text>
                                {'\n'}Regularity and completeness of health record updates, tracking inputs, and follow-up data.
                            </Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            These components are combined using structured statistical methods to provide directional health insights.
                        </Text>

                        {/* Important Notice */}
                        <Text style={styles.statementText}>
                            Important Notice{'\n\n'}TrustLife provides informational analytics based on available data patterns and does not provide medical diagnosis, treatment recommendations, or emergency medical services. Clinical decisions should be made in consultation with a qualified healthcare professional.
                        </Text>

                        {/* Security Summary */}
                        <Text style={styles.sectionHeading}>
                            Security Summary
                        </Text>
                        <Text style={styles.reportParagraph}>
                            Your health information is protected using layered safeguards designed to maintain confidentiality and integrity.
                        </Text>

                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Encrypted in Transit</Text>
                                {'\n'}All data transmitted between your device and TrustLife systems is encrypted using secure communication protocols.
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Encrypted at Rest</Text>
                                {'\n'}Your stored health information remains encrypted within secure infrastructure environments.
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Role-Based Access Control</Text>
                                {'\n'}Access to data within TrustLife systems is restricted and granted only based on defined roles and operational necessity.
                            </Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            Security controls are continuously monitored and updated in alignment with applicable Indian data protection standards.
                        </Text>

                        {/* Consent Overview */}
                        <Text style={styles.sectionHeading}>
                            Consent Overview
                        </Text>

                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Active Consents:</Text> 3
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Expired:</Text> 1
                            </Text>
                        </View>

                        {/* Who Has Access */}
                        <Text style={styles.sectionHeading}>
                            Who Has Access
                        </Text>

                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Entity</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Purpose</Text>
                            <Text style={[styles.tableHeaderText, { flex: 0.6 }]}>Date</Text>
                        </View>

                        {/* <TouchableOpacity style={styles.viewLogBtn}>
                            <Text style={styles.viewLogBtnText}>View Full Access Log</Text>
                        </TouchableOpacity> */}
                        <Text style={styles.reportParagraph}>
                           “View Full Access Log” button below
                        </Text>

                        {/* How Your Data Is Used */}
                        <Text style={styles.sectionHeading}>
                            How Your Data Is Used
                        </Text>
                        <Text style={styles.reportParagraph}>
                            Your health information is used only for clearly defined platform functions and consent-based sharing.
                        </Text>

                        {/* Core Platform Function */}
                        <Text style={styles.subHeading}>Core Platform Function</Text>
                        <Text style={styles.reportParagraph}>
                            Your data is used to:
                        </Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Maintain structured health continuity over time</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Calculate Health Progression Score</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Monitor biomarker trends and stability</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Generate structured pattern-based health insights</Text>
                        </View>

                        <Text style={styles.statementText}>
                            These insights are informational and are not a medical diagnosis.
                        </Text>

                        {/* Guidance & Alerts */}
                        <Text style={styles.subHeading}>Guidance & Alerts</Text>
                        <Text style={styles.reportParagraph}>
                            Your data helps:
                        </Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Identify significant trend changes</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Suggest follow-up timelines</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Highlight continuity gaps</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Provide health engagement reminders</Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            Alerts are generated using statistical pattern recognition and available data inputs.
                        </Text>

                        {/* Consent-Based Sharing */}
                        <Text style={styles.subHeading}>Consent-Based Sharing</Text>
                        <Text style={styles.reportParagraph}>
                            Your health information may be shared only when you explicitly approve access.
                        </Text>
                        <Text style={styles.reportParagraph}>Examples:</Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Sharing summaries with doctors</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Synchronizing reports from diagnostic labs</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Exporting structured data to authorized entities</Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            All external access is logged and linked to your active consent.
                        </Text>

                        <Text style={styles.statementText}>
                            TrustLife does not sell identifiable health data.{'\n'}Personal data is processed in alignment with applicable Indian data protection law.
                        </Text>

                        {/* Health Continuity with Accountability */}
                        <Text style={styles.sectionHeading}>
                            Health Continuity with Accountability
                        </Text>
                        <Text style={styles.reportParagraph}>
                            Health data is sensitive. TrustLife is designed to structure health continuity while ensuring that users remain in control of their information at all times.
                        </Text>

                        {/* What Data We Process */}
                        <Text style={styles.subHeading}>What Data We Process</Text>
                        <Text style={styles.reportParagraph}>TrustLife processes:</Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Diagnostic records uploaded or synced by users</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Lifestyle and medication inputs entered voluntarily</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Derived health analytics generated from structured patterns</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Consent records and access logs</Text>
                        </View>

                        <Text style={styles.statementText}>
                            Derived insights are informational and do not constitute medical diagnosis.
                        </Text>

                        {/* How Data Is Used */}
                        <Text style={styles.subHeading}>How Data Is Used</Text>
                        <Text style={styles.reportParagraph}>
                            Personal data is used exclusively to:
                        </Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Maintain longitudinal health continuity</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Generate structured health analytics</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Provide continuity reminders and pattern insights</Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            Data is not used beyond clearly defined purposes without user consent.
                        </Text>

                        {/* Consent-Based Sharing (Policy) */}
                        <Text style={styles.subHeading}>Consent-Based Sharing</Text>
                        <Text style={styles.reportParagraph}>
                            TrustLife shares health information only when:
                        </Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Explicit user consent is provided</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Purpose is clearly defined</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Duration is specified</Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            Users may revoke access at any time.{'\n'}All access events are logged.
                        </Text>

                        {/* Security Measures */}
                        <Text style={styles.sectionHeading}>
                            Security Measures
                        </Text>
                        <Text style={styles.reportParagraph}>
                            TrustLife employs layered safeguards including:
                        </Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Encryption in transit</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Encryption at rest</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Role-based internal access control</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Secure infrastructure monitoring</Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            In the event of a security incident affecting user data, affected users will be notified as required under applicable law.
                        </Text>

                        {/* User Rights */}
                        <Text style={styles.sectionHeading}>
                            User Rights
                        </Text>
                        <Text style={styles.reportParagraph}>Users may:</Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Access their stored data</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Correct inaccuracies</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Download their records</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Withdraw consent</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Request account deletion</Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            Requests may be initiated directly through the TrustLife application.
                        </Text>

                        {/* Legal Alignment */}
                        <Text style={styles.sectionHeading}>
                            Legal Alignment
                        </Text>
                        <Text style={styles.reportParagraph}>
                            TrustLife is designed in alignment with applicable Indian data protection law, including the Digital Personal Data Protection Act, 2023.
                        </Text>

                        <Text style={styles.statementText}>
                            TrustLife does not provide medical diagnosis, treatment recommendations, or emergency services.
                        </Text>

                        {/* Contact & Grievance */}
                        <Text style={styles.sectionHeading}>
                            Contact & Grievance
                        </Text>
                        <Text style={styles.reportParagraph}>
                            <Text style={styles.boldText}>Grievance Officer</Text>
                            {'\n'}Email: support@trustlife.in
                        </Text>
                        <Text style={styles.reportParagraph}>
                            We aim to respond within the timeline prescribed under applicable law.
                        </Text>

                        {/* How Health Insights Are Calculated (Repeated Section) */}
                        <Text style={styles.reportMainTitle}>
                            How Health Insights Are Calculated
                        </Text>
                        <Text style={styles.reportParagraph}>
                            TrustLife generates structured health insights using longitudinal data patterns across time.
                        </Text>
                        <Text style={styles.reportParagraph}>
                            Your Health Progression Score and related indicators are derived from the following components:
                        </Text>

                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Risk Tier Movement</Text>
                                {'\n'}Changes in your relative health pattern classification over time, based on available data inputs.
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Biomarker Stability</Text>
                                {'\n'}Trend consistency and variability in key laboratory markers across multiple reports.
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Engagement Continuity</Text>
                                {'\n'}Regularity and completeness of health record updates, tracking inputs, and follow-up data.
                            </Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            These components are combined using structured statistical methods to provide directional health insights.
                        </Text>

                        {/* Important Notice */}
                        <Text style={styles.statementText}>
                            Important Notice{'\n\n'}TrustLife provides informational analytics based on available data patterns and does not provide medical diagnosis, treatment recommendations, or emergency medical services. Clinical decisions should be made in consultation with a qualified healthcare professional.
                        </Text>

                        {/* Security Summary */}
                        <Text style={styles.sectionHeading}>
                            Security Summary
                        </Text>
                        <Text style={styles.reportParagraph}>
                            Your health information is protected using layered safeguards designed to maintain confidentiality and integrity.
                        </Text>

                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Encrypted in Transit</Text>
                                {'\n'}All data transmitted between your device and TrustLife systems is encrypted using secure communication protocols.
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Encrypted at Rest</Text>
                                {'\n'}Your stored health information remains encrypted within secure infrastructure environments.
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Role-Based Access Control</Text>
                                {'\n'}Access to data within TrustLife systems is restricted and granted only based on defined roles and operational necessity.
                            </Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            Security controls are continuously monitored and updated in alignment with applicable Indian data protection standards.
                        </Text>

                        {/* Consent Overview */}
                        <Text style={styles.sectionHeading}>
                            Consent Overview
                        </Text>

                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Active Consents:</Text> 3
                            </Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Expired:</Text> 1
                            </Text>
                        </View>

                        {/* Who Has Access */}
                        <Text style={styles.sectionHeading}>
                            Who Has Access
                        </Text>

                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Entity</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Purpose</Text>
                            <Text style={[styles.tableHeaderText, { flex: 0.6 }]}>Date</Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                           “View Full Access Log” button below
                        </Text>

                        {/* How Your Data Is Used */}
                        <Text style={styles.sectionHeading}>
                            How Your Data Is Used
                        </Text>
                        <Text style={styles.reportParagraph}>
                            Your health information is used only for clearly defined platform functions and consent-based sharing.
                        </Text>

                        {/* Core Platform Function */}
                        <Text style={styles.subHeading}>Core Platform Function</Text>
                        <Text style={styles.reportParagraph}>
                            Your data is used to:
                        </Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Maintain structured health continuity over time</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Calculate Health Progression Score</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Monitor biomarker trends and stability</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Generate structured pattern-based health insights</Text>
                        </View>

                        <Text style={styles.statementText}>
                            These insights are informational and are not a medical diagnosis.
                        </Text>

                        {/* Guidance & Alerts */}
                        <Text style={styles.subHeading}>Guidance & Alerts</Text>
                        <Text style={styles.reportParagraph}>
                            Your data helps:
                        </Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Identify significant trend changes</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Suggest follow-up timelines</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Highlight continuity gaps</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Provide health engagement reminders</Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            Alerts are generated using statistical pattern recognition and available data inputs.
                        </Text>

                        {/* Consent-Based Sharing */}
                        <Text style={styles.subHeading}>Consent-Based Sharing</Text>
                        <Text style={styles.reportParagraph}>
                            Your health information may be shared only when you explicitly approve access.
                        </Text>
                        <Text style={styles.reportParagraph}>Examples:</Text>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Sharing summaries with doctors</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Synchronizing reports from diagnostic labs</Text>
                        </View>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>Exporting structured data to authorized entities</Text>
                        </View>

                        <Text style={styles.reportParagraph}>
                            All external access is logged and linked to your active consent.
                        </Text>

                        <Text style={styles.statementText}>
                            TrustLife does not sell identifiable health data.{'\n'}Personal data is processed in alignment with applicable Indian data protection law.
                        </Text>

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
        marginBottom: vs(8),
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

    // Table header
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: ms(8),
        padding: ms(10),
        marginBottom: vs(8),
    },
    tableHeaderText: {
        fontFamily: bold,
        fontSize: ms(11),
        color: '#6B7280',
    },

    // View log button
    viewLogBtn: {
        alignItems: 'center',
        paddingVertical: vs(10),
        borderWidth: 1,
        borderColor: primaryColor,
        borderRadius: ms(8),
        marginBottom: vs(8),
    },
    viewLogBtnText: {
        fontFamily: bold,
        fontSize: ms(12),
        color: primaryColor,
    },
});

export default DataTransparencyCenterScreen;
