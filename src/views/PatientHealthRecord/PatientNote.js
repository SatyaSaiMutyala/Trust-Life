import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
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

const NOTES_DATA = [
    {
        dateLabel: 'Today',
        notes: [
            {
                id: '1',
                title: 'Fever',
                startedText: 'Started 2 days ago',
                severity: 'Medium',
                emoji: '\uD83D\uDE14',
                mood: 'Sad',
                description: 'Feeling slightly weak with mild fever and occasional cough since yesterday. Experiencing tiredness and slight throat irritation but able to manage daily activities.',
                symptoms: ['Cough', 'Fatigue', 'Cough'],
                extraCount: 2,
            },
        ],
    },
    {
        dateLabel: 'Yesterday',
        notes: [
            {
                id: '2',
                title: 'Fever',
                startedText: 'Started Yesterday',
                severity: 'High',
                emoji: '\uD83D\uDE0C',
                mood: 'Relaxed',
                description: 'Mild fever and cough since yesterday',
                symptoms: ['Cough', 'Cough', 'Cough'],
                extraCount: 2,
            },
        ],
    },
    {
        dateLabel: '07 Feb ,2026',
        notes: [
            {
                id: '3',
                title: 'Fever',
                startedText: 'Started today',
                severity: 'Low',
                emoji: '\uD83D\uDE0C',
                mood: 'Relaxed',
                description: 'Mild fever and cough since yesterday',
                symptoms: ['Cough', 'Cough', 'Cough'],
                extraCount: 2,
            },
        ],
    },
];

const PatientNote = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [records] = useState(NOTES_DATA);
    const hasNotes = records.length > 0;

    const renderNoteCard = (note) => {
        const severityStyle = SEVERITY_COLORS[note.severity] || SEVERITY_COLORS.Low;
        return (
            <TouchableOpacity
                key={note.id}
                style={styles.noteCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('NoteDetail', {
                    title: note.title,
                    startedText: note.startedText,
                    severity: note.severity,
                    emoji: note.emoji,
                    mood: note.mood,
                    description: note.description,
                    symptoms: note.symptoms,
                })}
            >
                <View style={styles.noteCardHeader}>
                    <View style={styles.noteCardLeft}>
                        <Text style={styles.noteTitle}>{note.title}</Text>
                        <Text style={styles.noteStarted}>{note.startedText}</Text>
                    </View>
                    <View style={[styles.severityBadge, { backgroundColor: severityStyle.bg }]}>
                        <Text style={[styles.severityText, { color: severityStyle.text }]}>
                            {note.severity}
                        </Text>
                    </View>
                </View>

                <View style={styles.moodRow}>
                    <Text style={styles.moodEmoji}>{note.emoji}</Text>
                    <Text style={styles.moodText}>{note.mood}</Text>
                </View>

                <Text style={styles.noteDescription} numberOfLines={2} ellipsizeMode="tail">{note.description}</Text>

                <View style={styles.symptomsRow}>
                    {note.symptoms.map((symptom, idx) => (
                        <View key={idx} style={styles.symptomChip}>
                            <Text style={styles.symptomText}>{symptom}</Text>
                        </View>
                    ))}
                    {note.extraCount > 0 && (
                        <View style={styles.symptomChip}>
                            <Text style={styles.symptomText}>+{note.extraCount}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.25]}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.fullGradient}>
                <StatusBar2 />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Reports')}
                        style={styles.backButton}
                    >
                        <Icon
                            type={Icons.Ionicons}
                            name="arrow-back"
                            color={blackColor}
                            size={ms(20)}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Patient Note</Text>
                </View>

                {hasNotes ? (
                    <>
                        {/* Search */}
                        <View style={styles.searchContainer}>
                            <Icon
                                type={Icons.Feather}
                                name="search"
                                color="#9CA3AF"
                                size={ms(18)}
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search"
                                placeholderTextColor="#9CA3AF"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>

                        <FlatList
                            data={records}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                            renderItem={({ item: group }) => (
                                <View style={styles.dateGroup}>
                                    <Text style={styles.dateHeader}>{group.dateLabel}</Text>
                                    {group.notes.map((note) => renderNoteCard(note))}
                                </View>
                            )}
                        />

                        {/* FAB */}
                        <TouchableOpacity style={styles.fab} activeOpacity={0.7} onPress={() => navigation.navigate('AddPatientNote', { fromFab: true })}>
                            <Icon
                                type={Icons.Feather}
                                name="plus"
                                color={whiteColor}
                                size={ms(24)}
                            />
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Image
                            source={require('../../assets/img/emptynote.png')}
                            style={styles.emptyImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.emptyTitle}>No Notes Available</Text>
                        <Text style={styles.emptyDesc}>
                            Start adding notes to record symptoms{'\n'}and health information for future reference.
                        </Text>
                        <TouchableOpacity style={styles.addNotesBtn} activeOpacity={0.7} onPress={() => navigation.navigate('AddPatientNote', { fromFab: false })}>
                            <Icon
                                type={Icons.Feather}
                                name="plus"
                                color={whiteColor}
                                size={ms(18)}
                            />
                            <Text style={styles.addNotesBtnText}>Add Notes</Text>
                        </TouchableOpacity>
                    </View>
                )}
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

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(25),
        paddingHorizontal: ms(20),
        height: vs(45),
        marginVertical: vs(16),
    },
    searchInput: {
        flex: 1,
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        marginLeft: ms(5),
        paddingVertical: 0,
    },

    // List
    listContent: {
        paddingTop: vs(16),
        paddingBottom: vs(100),
    },

    // Date Group
    dateGroup: {
        marginBottom: vs(8),
    },
    dateHeader: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(10),
    },

    // Note Card
    noteCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    noteCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    noteCardLeft: {
        flex: 1,
    },
    noteTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
    },
    noteStarted: {
        fontFamily: regular,
        fontSize: ms(11),
        color: blackColor,
        marginTop: vs(2),
    },
    severityBadge: {
        paddingHorizontal: ms(25),
        paddingVertical: vs(8),
        borderRadius: ms(10),
    },
    severityText: {
        fontFamily: bold,
        fontSize: ms(12),
    },

    // Mood
    moodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(10),
    },
    moodEmoji: {
        fontSize: ms(18),
    },
    moodText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
        marginLeft: ms(6),
    },

    // Description
    noteDescription: {
        fontFamily: regular,
        fontSize: ms(12),
        color: primaryColor,
        marginTop: vs(8),
        lineHeight: ms(18),
    },

    // Symptoms
    symptomsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(8),
        marginTop: vs(10),
    },
    symptomChip: {
        paddingHorizontal: ms(12),
        paddingVertical: vs(5),
        borderRadius: ms(16),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: whiteColor,
    },
    symptomText: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: vs(30),
        right: ms(20),
        width: ms(52),
        height: ms(52),
        borderRadius: ms(15),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: ms(30),
    },
    emptyImage: {
        width: ms(180),
        height: ms(180),
        marginBottom: vs(24),
    },
    emptyTitle: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
        marginBottom: vs(8),
    },
    emptyDesc: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: ms(20),
        marginBottom: vs(24),
    },
    addNotesBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: primaryColor,
        paddingHorizontal: ms(24),
        paddingVertical: vs(12),
        borderRadius: ms(10),
        gap: ms(8),
    },
    addNotesBtnText: {
        fontFamily: bold,
        fontSize: ms(14),
        color: whiteColor,
    },
});

export default PatientNote;
