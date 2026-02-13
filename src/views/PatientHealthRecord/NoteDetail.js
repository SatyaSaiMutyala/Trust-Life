import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { bold, regular } from '../../config/Constants';
import {
    blackColor,
    whiteColor,
    primaryColor,
    globalGradient,
} from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';

const SEVERITY_COLORS = {
    High: { bg: '#FEE2E2', text: '#DC2626' },
    Medium: { bg: '#FFF3E0', text: '#E65100' },
    Low: { bg: '#E8F5E9', text: '#2E7D32' },
};

const NoteDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {
        title = 'Fever',
        startedText = '2 Days ago',
        severity = 'Medium',
        emoji = '\uD83D\uDE0C',
        mood = 'Relaxed',
        description = '"Feeling slightly weak with mild fever and occasional cough since yesterday. Experiencing tiredness and slight throat irritation but able to manage daily activities."',
        symptoms = ['Cough', 'Fatigue', 'Fatigue', 'Fatigue', 'Cough'],
        frequency = 'Comes & Goes',
        reliefTaken = 'Rest',
        date = '10 Feb,2026',
    } = route.params || {};

    const severityStyle = SEVERITY_COLORS[severity] || SEVERITY_COLORS.Low;

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.16]}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.fullGradient}>
                <StatusBar2 />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon
                            type={Icons.Ionicons}
                            name="arrow-back"
                            color={blackColor}
                            size={ms(20)}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{date}</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Subtitle */}
                    <Text style={styles.subtitle}>
                        Detailed notes help your doctor Provide more{'\n'}accurate care and tracking
                    </Text>

                    {/* Title + Severity */}
                    <View style={styles.titleRow}>
                        <View style={styles.titleLeft}>
                            <Text style={styles.noteTitle}>{title}</Text>
                            <Text style={styles.noteStarted}>{startedText}</Text>
                        </View>
                        <View style={[styles.severityBadge, { backgroundColor: severityStyle.bg }]}>
                            <Text style={[styles.severityText, { color: severityStyle.text }]}>
                                {severity}
                            </Text>
                        </View>
                    </View>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Frequency</Text>
                            <Text style={styles.infoValue}>{frequency}</Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Feeling</Text>
                            <View style={styles.feelingRow}>
                                <Text style={styles.feelingEmoji}>{emoji}</Text>
                                <Text style={styles.infoValue}>{mood}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Relief Taken */}
                    <Text style={styles.sectionLabel}>Relief Taken</Text>
                    <Text style={styles.sectionValue}>{reliefTaken}</Text>

                    {/* Note */}
                    <Text style={styles.sectionLabel}>Note</Text>
                    <View style={styles.noteBox}>
                        <Text style={styles.noteText}>{description}</Text>
                    </View>

                    {/* Additional Symptoms */}
                    <Text style={styles.sectionLabel}>Additional Symptoms</Text>
                    <View style={styles.symptomsRow}>
                        {symptoms.map((symptom, idx) => (
                            <View key={idx} style={styles.symptomChip}>
                                <Text style={styles.symptomText}>{symptom}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    fullGradient: {
        flex: 1,
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: vs(5),
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
        flex: 1,
        fontFamily: bold,
        fontSize: ms(18),
        color: whiteColor,
        marginLeft: ms(12),
    },

    // Scroll
    scrollContent: {
        paddingTop: vs(20),
        paddingBottom: vs(40),
    },

    // Subtitle
    subtitle: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: ms(20),
        marginBottom: vs(24),
    },

    // Title + Severity
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: vs(20),
    },
    titleLeft: {
        flex: 1,
    },
    noteTitle: {
        fontFamily: bold,
        fontSize: ms(20),
        color: blackColor,
    },
    noteStarted: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
        marginTop: vs(3),
    },
    severityBadge: {
        paddingHorizontal: ms(20),
        paddingVertical: vs(7),
        borderRadius: ms(10),
    },
    severityText: {
        fontFamily: bold,
        fontSize: ms(13),
    },

    // Info Card
    infoCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(14),
        paddingHorizontal: ms(16),
        paddingVertical: vs(4),
        marginBottom: vs(20),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(12),
    },
    infoLabel: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#6B7280',
    },
    infoValue: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
    },
    infoDivider: {
        height: ms(0.5),
        backgroundColor: '#E5E7EB',
    },
    feelingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(6),
    },
    feelingEmoji: {
        fontSize: ms(18),
    },

    // Sections
    sectionLabel: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#6B7280',
        marginBottom: vs(6),
    },
    sectionValue: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(20),
    },

    // Note Box
    noteBox: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(20),
    },
    noteText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
        lineHeight: ms(20),
    },

    // Symptoms
    symptomsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(10),
        marginTop: vs(4),
    },
    symptomChip: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(8),
        borderRadius: ms(20),
        backgroundColor: '#F1F5F9',
    },
    symptomText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: blackColor,
    },
});

export default NoteDetail;
