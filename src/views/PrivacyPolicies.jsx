// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native';
// import * as colors from '../assets/css/Colors';
// import { regular, bold, customer_privacy_policy, api_url} from '../config/Constants';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import ContentLoader from "react-native-easy-content-loader";
// import { StatusBar } from '../components/StatusBar';

// const PrivacyPolicies = () => {
//   const navigation = useNavigation();
//   const [privacy_result, setPrivacyResult] = useState([]);
//   const [loading, setLoading] = useState('false');

//   useEffect(() => {
//     get_privacy();
//   },[]);

//   const get_privacy = async() => {
//     setLoading(true);
//     axios({
//     method: 'post',
//     url: api_url + customer_privacy_policy,
//     data:{ user_type:global.user_type }
//     })
//     .then(async response => {
//       setLoading(false);
//       setPrivacyResult(response.data.result)
//     })
//     .catch(error => {
//       setLoading(false);
//       alert('Sorry something went wrong')
//     });
//   }

//   const renderItem = ({ item }) => (
//     <View>
//       <View style={{ justifyContent:'center', alignItems:'flex-start', padding:10,}}>
//         <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>{item.title}</Text>
//         <View style={{ margin:10 }} />
//         <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14}}>{item.description}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar />
//       <View style={{ margin:10}} />
//       <ContentLoader
//         pRows={1}
//         pHeight={[10, 30, 20]}
//         pWidth={['80%', 70, 100]}
//         listSize={5}
//         loading={loading}>
//         <FlatList
//           data={privacy_result}
//           renderItem={renderItem}
//           keyExtractor={item => item.id}
//         />
//       </ContentLoader>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor:colors.theme_bg_three,
//     justifyContent:'flex-start'
//   },
//   logo:{
//     height:120,
//     width:120,
//   },

// });

// export default PrivacyPolicies;



import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { heading, interMedium, interRegular } from '../config/Constants';
import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors';

const PrivacyPolicies = () => {
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
                    <Text style={styles.headerTitle}>Security Center</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Main Content Card */}
                    <View style={styles.contentCard}>

                        {/* SECURITY STATUS CARD - Dynamic based on conditions */}
                        <Text style={styles.sectionHeading}>Security Status Card</Text>

                        {/* Green Status - Secure */}
                        <View style={[styles.statusCard, styles.greenStatus]}>
                            <View style={styles.statusTitleRow}>
                                <Text style={styles.statusTitle}>Account Security</Text>
                                <View style={styles.badgeGreen}>
                                    <Text style={styles.badgeTextGreen}>Secure</Text>
                                </View>
                            </View>
                            <View style={styles.statusItem}>
                                <Text style={styles.bulletDot}>•</Text>
                                <Text style={styles.statusText}>Data Encryption</Text>
                                <View style={styles.badgeGreen}>
                                    <Text style={styles.badgeTextGreen}>Active</Text>
                                </View>
                            </View>
                            <View style={styles.statusItem}>
                                <Text style={styles.bulletDot}>•</Text>
                                <Text style={styles.statusText}>Verified Device</Text>
                                <View style={styles.badgeGreen}>
                                    <Text style={styles.badgeTextGreen}>Active</Text>
                                </View>
                            </View>
                            <View style={styles.statusItem}>
                                <Text style={styles.bulletDot}>•</Text>
                                <Text style={styles.statusText}>2-Factor Authentication</Text>
                                <View style={styles.badgeGreen}>
                                    <Text style={styles.badgeTextGreen}>Enabled</Text>
                                </View>
                            </View>
                            <View style={styles.statusItem}>
                                <Text style={styles.bulletDot}>•</Text>
                                <Text style={styles.statusText}>Unusual Access</Text>
                                <View style={styles.badgeGreen}>
                                    <Text style={styles.badgeTextGreen}>None</Text>
                                </View>
                            </View>
                            <Text style={styles.statusFooter}>Last security review: 12 Feb 2026</Text>
                            <Text style={styles.statusNote}>Your account security is currently strong. Continue reviewing your privacy controls periodically.</Text>
                        </View>

                        {/* How We Protect Your Data */}
                        <Text style={styles.sectionHeading}>How We Protect Your Data</Text>

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
                                {'\n'}Internal access to user data is restricted and granted only based on defined roles and operational necessity.
                            </Text>
                        </View>

                        <View style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>
                                <Text style={styles.boldText}>Infrastructure Monitoring</Text>
                                {'\n'}Our systems are monitored to detect and respond to unauthorized access attempts using industry-standard safeguards.
                            </Text>
                        </View>

                        <Text style={styles.noteText}>
                            Security safeguards are periodically reviewed in alignment with applicable data protection standards.
                        </Text>

                        {/* Your Privacy Controls */}
                        <Text style={styles.sectionHeading}>Your Privacy Controls</Text>

                        <View style={styles.controlSection}>
                            <Text style={styles.controlTitle}>Consent Manager</Text>
                            <Text style={styles.controlDescription}>
                                Control who can access your health information, for what purpose, and for how long.
                            </Text>
                            <TouchableOpacity style={styles.controlButton}>
                                <Text style={styles.controlButtonText}>Manage Consents</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.controlSection}>
                            <Text style={styles.controlTitle}>Access Log</Text>
                            <Text style={styles.controlDescription}>
                                View every instance where your health data was accessed under your consent.
                            </Text>
                            <TouchableOpacity style={styles.controlButton}>
                                <Text style={styles.controlButtonText}>Download Your Data</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.controlSection}>
                            <Text style={styles.controlTitle}>Delete Account</Text>
                            <Text style={styles.controlDescription}>
                                Request deletion of your account and associated personal data, subject to legal retention requirements.
                                Upon deletion, identifiable personal data will be erased unless retention is required under applicable law.
                            </Text>
                        </View>

                        {/* Data Protection & Compliance */}
                        <Text style={styles.sectionHeading}>Data Protection & Compliance</Text>

                        <Text style={styles.subHeading}>Data Use Statement</Text>
                        <Text style={styles.paragraph}>
                            TrustLife processes personal data only for clearly defined health continuity and analytics purposes.
                        </Text>

                        <Text style={styles.subHeading}>Legal Alignment</Text>
                        <Text style={styles.paragraph}>
                            TrustLife is designed in alignment with applicable Indian data protection law, including the Digital Personal Data Protection Act, 2023.
                        </Text>

                        <Text style={styles.disclaimerText}>
                            TrustLife does not provide medical diagnosis or emergency services.
                        </Text>

                        {/* Grievance Officer */}
                        <Text style={styles.sectionHeading}>Grievance Officer</Text>
                        <Text style={styles.paragraph}>
                            For data-related concerns, contact:
                        </Text>
                        <Text style={styles.boldText}>Grievance Officer</Text>
                        <Text style={styles.paragraph}>Email: grievance@trustlife.in</Text>
                        <Text style={styles.noteText}>
                            We aim to respond within timelines prescribed under applicable law.
                        </Text>


                    </View>
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
    gradientBg: {
        flex: 1,
        paddingTop: ms(40)
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(20),
        paddingBottom: vs(12),
    },
    backButton: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTitle: {
        fontFamily: heading,
        fontSize: ms(18),
        color: whiteColor,
        marginLeft: ms(12),
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(40),
    },
    contentCard: {
        borderRadius: ms(14),
        padding: ms(20),
    },
    mainHeading: {
        fontFamily: interMedium,
        fontSize: ms(18),
        color: colors.black,
        marginTop: vs(20),
        marginBottom: vs(5),
        textAlign: 'center',
    },
    effectiveDate: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
        marginBottom: vs(2),
    },
    lastUpdated: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
        marginBottom: vs(15),
    },
    sectionHeading: {
        fontFamily: interMedium,
        fontSize: ms(16),
        color: colors.black,
        marginTop: vs(18),
        marginBottom: vs(10),
    },
    subHeading: {
        fontFamily: interMedium,
        fontSize: ms(14),
        color: '#374151',
        marginTop: vs(12),
        marginBottom: vs(4),
    },
    paragraph: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#4B5563',
        lineHeight: ms(20),
        marginBottom: vs(8),
    },
    boldText: {
        fontFamily: interMedium,
        color: colors.black,
    },
    noteText: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#6B7280',
        lineHeight: ms(18),
        marginTop: vs(4),
        marginBottom: vs(8),
        fontStyle: 'italic',
    },
    importantText: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: '#DC2626',
        lineHeight: ms(20),
        marginTop: vs(4),
        marginBottom: vs(8),
        backgroundColor: '#FEE2E2',
        padding: ms(10),
        borderRadius: ms(8),
    },
    disclaimerText: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#4B5563',
        lineHeight: ms(20),
        marginTop: vs(4),
        marginBottom: vs(8),
        backgroundColor: '#F3F4F6',
        padding: ms(10),
        borderRadius: ms(8),
    },
    finalDisclaimer: {
        marginTop: vs(20),
        padding: ms(15),
        backgroundColor: '#FEF2F2',
        borderRadius: ms(10),
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    disclaimerTitle: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: '#991B1B',
        marginBottom: vs(5),
    },
    separator: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: vs(20),
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: vs(6),
        paddingLeft: ms(4),
    },
    bulletDot: {
        fontFamily: interMedium,
        fontSize: ms(14),
        color: colors.theme_fg,
        marginRight: ms(8),
        lineHeight: ms(20),
    },
    bulletText: {
        flex: 1,
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#4B5563',
        lineHeight: ms(20),
    },

    // Status Card Styles
    statusCard: {
        borderRadius: ms(10),
        padding: ms(15),
        marginBottom: vs(5),
    },
    greenStatus: {
        backgroundColor: '#F0FDF4',
        borderColor: '#86EFAC',
    },
    amberStatus: {
        backgroundColor: '#FEF9C3',
        borderColor: '#FDE047',
    },
    redStatus: {
        backgroundColor: '#FEE2E2',
        borderColor: '#FCA5A5',
    },
    statusTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(8),
    },
    statusTitle: {
        fontFamily: interMedium,
        fontSize: ms(14),
        color: colors.black,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    statusText: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#4B5563',
        flex: 1,
    },
    badgeGreen: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: ms(8),
        paddingVertical: vs(2),
        borderRadius: ms(20),
    },
    badgeTextGreen: {
        fontFamily: interMedium,
        fontSize: ms(10),
        color: '#16A34A',
    },
    badgeRed: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: ms(8),
        paddingVertical: vs(2),
        borderRadius: ms(20),
    },
    badgeTextRed: {
        fontFamily: interMedium,
        fontSize: ms(10),
        color: '#DC2626',
    },
    statusFooter: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#6B7280',
        marginTop: vs(8),
        marginBottom: vs(4),
    },
    statusNote: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#4B5563',
        marginTop: vs(8),
        fontStyle: 'italic',
    },
    actionButton: {
        backgroundColor: colors.white,
        paddingVertical: vs(8),
        paddingHorizontal: ms(15),
        borderRadius: ms(6),
        alignSelf: 'flex-start',
        marginTop: vs(8),
        borderWidth: 1,
        borderColor: colors.theme_fg,
    },
    actionButtonText: {
        fontFamily: interMedium,
        fontSize: ms(11),
        color: colors.theme_fg,
    },

    // Control Section Styles
    controlSection: {
        marginBottom: vs(15),
        padding: ms(12),
        backgroundColor: '#F9FAFB',
        borderRadius: ms(8),
    },
    controlTitle: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: '#3B82F6',
        marginBottom: vs(4),
    },
    controlDescription: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#6B7280',
        lineHeight: ms(18),
        marginBottom: vs(8),
    },
    controlButton: {
        // backgroundColor: colors.theme_fg,
        // paddingVertical: vs(8),
        // paddingHorizontal: ms(15),
        borderRadius: ms(6),
        alignSelf: 'flex-start',
    },
    controlButtonText: {
        fontFamily: interMedium,
        fontSize: ms(11),
        color: colors.white,
    },

    // Consent Footer
    consentFooter: {
        marginTop: vs(20),
        padding: ms(15),
        backgroundColor: '#F9FAFB',
        borderRadius: ms(10),
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: vs(12),
    },
    checkbox: {
        width: ms(20),
        height: ms(20),
        borderWidth: 2,
        borderColor: primaryColor,
        borderRadius: ms(4),
        marginRight: ms(10),
        marginTop: vs(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: primaryColor,
    },
    checkmark: {
        color: whiteColor,
        fontSize: ms(12),
        fontWeight: 'bold',
    },
    checkboxText: {
        flex: 1,
        fontFamily: interRegular,
        fontSize: ms(11),
        color: primaryColor,
        lineHeight: ms(18),
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(15),
    },
    declineButton: {
        flex: 1,
        paddingVertical: vs(10),
        marginRight: ms(8),
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: ms(6),
        alignItems: 'center',
    },
    declineButtonText: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: '#6B7280',
    },
    agreeButton: {
        flex: 2,
        paddingVertical: vs(10),
        backgroundColor: primaryColor,
        borderRadius: ms(6),
        alignItems: 'center',
    },
    agreeButtonDisabled: {
        backgroundColor: '#9CA3AF',
        opacity: 0.5,
    },
    agreeButtonText: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: whiteColor,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(13),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: ms(12),
    },
    navRowText: {
        flex: 1,
        fontFamily: interRegular,
        fontSize: ms(14),
        color: blackColor,
    },
});

export default PrivacyPolicies;
