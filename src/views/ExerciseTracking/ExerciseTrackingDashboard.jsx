import React, { useState, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const { width } = Dimensions.get('window');

const EXERCISE_COLORS = {
    Cardio: '#4ECDC4',
    Strength: '#4CAF50',
    Flexibility: '#7C4DFF',
};

const ExerciseTrackingDashboard = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [exercises, setExercises] = useState([]);

    // Listen for added exercise from form
    useFocusEffect(
        useCallback(() => {
            const addedExercise = route.params?.addedExercise;
            if (addedExercise) {
                setExercises((prev) => [
                    { ...addedExercise, id: `ex-${Date.now()}` },
                    ...prev,
                ]);
                navigation.setParams({ addedExercise: undefined });
            }
        }, [route.params?.addedExercise]),
    );

    // Calculate totals
    const totalCalories = exercises.reduce((sum, ex) => sum + (ex.calories || 0), 0);
    const totalDuration = exercises.reduce((sum, ex) => sum + (parseInt(ex.duration) || 0), 0);
    const totalSteps = exercises.reduce((sum, ex) => sum + (ex.steps || 0), 0);

    const cardioMins = exercises
        .filter((e) => e.category === 'Cardio Exercises')
        .reduce((sum, e) => sum + (parseInt(e.duration) || 0), 0);
    const strengthMins = exercises
        .filter((e) => e.category === 'Strength Exercises')
        .reduce((sum, e) => sum + (parseInt(e.duration) || 0), 0);
    const flexMins = exercises
        .filter((e) => e.category === 'Flexibility Exercises')
        .reduce((sum, e) => sum + (parseInt(e.duration) || 0), 0);

    // Main Donut chart
    const donutRadius = ms(48);
    const donutStroke = ms(10);
    const donutCenter = donutRadius + donutStroke / 2;
    const circumference = 2 * Math.PI * donutRadius;

    const totalMins = cardioMins + strengthMins + flexMins || 1;
    const segments = [
        { color: EXERCISE_COLORS.Cardio, value: cardioMins },
        { color: EXERCISE_COLORS.Strength, value: strengthMins },
        { color: EXERCISE_COLORS.Flexibility, value: flexMins },
    ];

    let cumulativeOffset = 0;
    const donutPaths = segments.map((seg) => {
        const pct = seg.value / totalMins;
        const dashLength = pct * circumference;
        const offset = cumulativeOffset;
        cumulativeOffset += dashLength;
        return { ...seg, dashLength, offset };
    });

    // Small calorie ring for steps card
    const smallRingRadius = ms(22);
    const smallRingStroke = ms(4);
    const smallRingCenter = smallRingRadius + smallRingStroke / 2;
    const smallCircumference = 2 * Math.PI * smallRingRadius;
    const calorieGoal = 500;
    const caloriePct = Math.min(totalCalories / calorieGoal, 1);

    const handleRemoveExercise = (id) => {
        setExercises((prev) => prev.filter((e) => e.id !== id));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Exercise Tracking</Text>
                </View>

                {/* Date Navigation */}
                <View style={styles.dateNav}>
                    <TouchableOpacity style={styles.dateArrow}>
                        <Icon type={Icons.Ionicons} name="chevron-back" color={blackColor} size={ms(18)} />
                    </TouchableOpacity>
                    <Text style={styles.dateText}>Today</Text>
                    <TouchableOpacity style={styles.dateArrow}>
                        <Icon type={Icons.Ionicons} name="chevron-forward" color={blackColor} size={ms(18)} />
                    </TouchableOpacity>
                </View>

                {/* Donut Chart Card */}
                <View style={styles.donutCard}>
                    <View style={styles.donutRow}>
                        {/* Left — Donut */}
                        <View style={styles.donutChartWrap}>
                            <Svg width={donutCenter * 2} height={donutCenter * 2}>
                                <Circle
                                    cx={donutCenter}
                                    cy={donutCenter}
                                    r={donutRadius}
                                    stroke="#EEEEEE"
                                    strokeWidth={donutStroke}
                                    fill="transparent"
                                />
                                {donutPaths.map((seg, i) => (
                                    seg.dashLength > 0 && (
                                        <Circle
                                            key={i}
                                            cx={donutCenter}
                                            cy={donutCenter}
                                            r={donutRadius}
                                            stroke={seg.color}
                                            strokeWidth={donutStroke}
                                            fill="transparent"
                                            strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
                                            strokeDashoffset={-seg.offset}
                                            strokeLinecap="round"
                                            rotation="-90"
                                            origin={`${donutCenter}, ${donutCenter}`}
                                        />
                                    )
                                ))}
                            </Svg>
                            <View style={styles.donutCenterText}>
                                <Icon type={Icons.Ionicons} name="flame" color="#FF6B35" size={ms(16)} />
                                <Text style={styles.donutCalValue}>{totalCalories || 0}kcal</Text>
                                <Text style={styles.donutCalSub}>Calories Burned</Text>
                            </View>
                        </View>

                        {/* Right — Legend */}
                        <View style={styles.legendContainer}>
                            {/* Cardio */}
                            <View style={styles.legendRow}>
                                <View style={styles.legendLeft}>
                                    <View style={[styles.legendDot, { backgroundColor: EXERCISE_COLORS.Cardio }]} />
                                    <Text style={styles.legendLabel}>Cardio</Text>
                                </View>
                                <View style={styles.legendRight}>
                                    <Icon type={Icons.Ionicons} name="time-outline" color="#999" size={ms(13)} />
                                    <Text style={styles.legendValue}>{cardioMins} mins</Text>
                                </View>
                            </View>
                            {/* Strength */}
                            <View style={styles.legendRow}>
                                <View style={styles.legendLeft}>
                                    <View style={[styles.legendDot, { backgroundColor: EXERCISE_COLORS.Strength }]} />
                                    <Text style={styles.legendLabel}>Strength</Text>
                                </View>
                                <View style={styles.legendRight}>
                                    <Icon type={Icons.Ionicons} name="time-outline" color="#999" size={ms(13)} />
                                    <Text style={styles.legendValue}>{strengthMins} mins</Text>
                                </View>
                            </View>
                            {/* Flexibility */}
                            <View style={styles.legendRow}>
                                <View style={styles.legendLeft}>
                                    <View style={[styles.legendDot, { backgroundColor: EXERCISE_COLORS.Flexibility }]} />
                                    <Text style={styles.legendLabel}>Flexibility</Text>
                                </View>
                                <View style={styles.legendRight}>
                                    <Icon type={Icons.Ionicons} name="time-outline" color="#999" size={ms(13)} />
                                    <Text style={styles.legendValue}>{flexMins} mins</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Steps Card */}
                <View style={styles.stepsCard}>
                    <View style={styles.stepsLeft}>
                        <View style={styles.stepsIconBg}>
                            <Image source={require('../../assets/img/de2.png')} style={styles.stepsIcon} />
                        </View>
                        <View>
                            <Text style={styles.stepsValue}>{totalSteps > 0 ? totalSteps.toLocaleString() : '0'}</Text>
                            <Text style={styles.stepsLabel}>Total Steps Covered</Text>
                            <Text style={styles.stepsDate}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</Text>
                        </View>
                    </View>
                    {/* Circular calorie ring */}
                    <View style={styles.stepsRingWrap}>
                        <Svg width={smallRingCenter * 2} height={smallRingCenter * 2}>
                            <Circle
                                cx={smallRingCenter}
                                cy={smallRingCenter}
                                r={smallRingRadius}
                                stroke="#F0F0F0"
                                strokeWidth={smallRingStroke}
                                fill="transparent"
                            />
                            <Circle
                                cx={smallRingCenter}
                                cy={smallRingCenter}
                                r={smallRingRadius}
                                stroke="#FF9800"
                                strokeWidth={smallRingStroke}
                                fill="transparent"
                                strokeDasharray={`${caloriePct * smallCircumference} ${smallCircumference}`}
                                strokeLinecap="round"
                                rotation="-90"
                                origin={`${smallRingCenter}, ${smallRingCenter}`}
                            />
                        </Svg>
                        <View style={styles.stepsRingCenter}>
                            <Text style={styles.stepsRingText}>{totalCalories}</Text>
                            <Text style={styles.stepsRingUnit}>kcal</Text>
                        </View>
                    </View>
                </View>

                {/* Exercise Card */}
                <View style={styles.exerciseCard}>
                    <View style={styles.exerciseCardTop}>
                        <View style={styles.exerciseCardLeft}>
                            <Text style={styles.exerciseCardTitle}>Exercise</Text>
                            <View style={styles.exerciseMetaRow}>
                                <View style={styles.exerciseMetaItem}>
                                    <Icon type={Icons.Ionicons} name="time-outline" color="#888" size={ms(14)} />
                                    <Text style={styles.exerciseMetaText}>{totalDuration || 0} mins</Text>
                                </View>
                                <View style={styles.exerciseMetaItem}>
                                    <Icon type={Icons.Ionicons} name="flame-outline" color="#888" size={ms(14)} />
                                    <Text style={styles.exerciseMetaText}>{totalCalories}kcal</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.addExerciseBtn}
                                onPress={() => navigation.navigate('SelectExercise')}
                            >
                                <Icon type={Icons.Ionicons} name="add" color={blackColor} size={ms(15)} />
                                <Text style={styles.addExerciseText}>Add Exercise</Text>
                            </TouchableOpacity>
                        </View>
                        <Image source={require('../../assets/img/de1.png')} style={styles.exerciseCardImage} />
                    </View>
                </View>

                {/* Logged Exercises */}
                {exercises.length > 0 && (
                    <View style={styles.loggedSection}>
                        <Text style={styles.sectionTitle}>Today's Exercises</Text>
                        {exercises.map((ex) => (
                            <View key={ex.id} style={styles.loggedItem}>
                                <View style={styles.loggedIconBg}>
                                    <Icon type={Icons.Ionicons} name="fitness-outline" color={primaryColor} size={ms(18)} />
                                </View>
                                <View style={styles.loggedInfo}>
                                    <Text style={styles.loggedName} numberOfLines={1}>{ex.exerciseName}</Text>
                                    <Text style={styles.loggedMeta}>
                                        {ex.duration} mins  •  {ex.intensity}  •  {ex.calories || 0} kcal
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => handleRemoveExercise(ex.id)} style={styles.removeBtn}>
                                    <Icon type={Icons.Ionicons} name="close-circle-outline" color="#CCC" size={ms(18)} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>How to Add Heart Rate Reading</Text>
                    <Text style={styles.infoDesc}>
                        Enter your heart rate value manually, add activity or symptoms i...{' '}
                        <Text style={styles.infoLink} onPress={() => navigation.navigate('HeartRateDashboard')}>Learn More</Text>
                    </Text>
                </View>

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ExerciseTrackingDashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingBottom: vs(30),
    },

    // Header — left aligned
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(5),
    },
    backButton: {
        width: ms(36),
        height: ms(40),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },

    // Date Nav
    dateNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(15),
        paddingVertical: vs(10),
    },
    dateArrow: {
        padding: ms(4),
    },
    dateText: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },

    // Donut Card
    donutCard: {
        marginHorizontal: ms(15),
        marginTop: vs(5),
        backgroundColor: '#F1F5F9',
        borderRadius: ms(16),
        paddingVertical: vs(20),
        paddingHorizontal: ms(15),
    },
    donutRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    donutChartWrap: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    donutCenterText: {
        position: 'absolute',
        alignItems: 'center',
    },
    donutCalValue: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: blackColor,
        marginTop: vs(1),
    },
    donutCalSub: {
        fontSize: ms(7),
        color: '#BBB',
        marginTop: vs(1),
    },

    // Legend
    legendContainer: {
        flex: 1,
        marginLeft: ms(15),
        gap: vs(14),
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    legendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(8),
    },
    legendRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
    },
    legendDot: {
        width: ms(10),
        height: ms(10),
        borderRadius: ms(5),
    },
    legendLabel: {
        fontSize: ms(12),
        fontWeight: '500',
        color: '#444',
    },
    legendValue: {
        fontSize: ms(11),
        color: '#888',
    },

    // Steps Card
    stepsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: ms(15),
        marginTop: vs(15),
        backgroundColor: '#F1F5F9',
        borderRadius: ms(16),
        paddingVertical: vs(15),
        paddingHorizontal: ms(15),
    },
    stepsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(12),
    },
    stepsIconBg: {
        width: ms(42),
        height: ms(42),
        borderRadius: ms(10),
        backgroundColor: '#FCE4EC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepsIcon: {
        width: ms(28),
        height: ms(28),
        resizeMode: 'contain',
    },
    stepsValue: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: blackColor,
    },
    stepsLabel: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(1),
    },
    stepsDate: {
        fontSize: ms(10),
        color: '#BBB',
        marginTop: vs(1),
    },
    stepsRingWrap: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepsRingCenter: {
        position: 'absolute',
        alignItems: 'center',
    },
    stepsRingText: {
        fontSize: ms(10),
        fontWeight: 'bold',
        color: '#FF9800',
    },
    stepsRingUnit: {
        fontSize: ms(7),
        color: '#FF9800',
        marginTop: vs(-1),
    },

    // Exercise Card
    exerciseCard: {
        marginHorizontal: ms(15),
        marginTop: vs(15),
        backgroundColor: '#F1F5F9',
        borderRadius: ms(16),
        paddingVertical: vs(15),
        paddingHorizontal: ms(15),
    },
    exerciseCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    exerciseCardLeft: {
        flex: 1,
    },
    exerciseCardTitle: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
    },
    exerciseMetaRow: {
        flexDirection: 'row',
        gap: ms(15),
        marginTop: vs(8),
    },
    exerciseMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
    },
    exerciseMetaText: {
        fontSize: ms(12),
        color: '#888',
    },
    exerciseCardImage: {
        width: ms(90),
        height: ms(70),
        resizeMode: 'contain',
        borderRadius: ms(10),
    },
    addExerciseBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(5),
        marginTop: vs(14),
        // paddingTop: vs(10),
        paddingVertical:ms(6),
        paddingHorizontal:ms(10),
        backgroundColor:whiteColor,
        borderRadius:ms(20),
        width:ms(120),
        justifyContent:'center'
    },
    addExerciseText: {
        fontSize: ms(12),
        color: blackColor,
        fontWeight: '500',
    },

    // Logged Exercises
    loggedSection: {
        marginHorizontal: ms(15),
        marginTop: vs(20),
    },
    sectionTitle: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(10),
    },
    loggedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F8FB',
        borderRadius: ms(12),
        paddingHorizontal: ms(12),
        paddingVertical: vs(12),
        marginBottom: vs(8),
    },
    loggedIconBg: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: '#E8F5F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
    },
    loggedInfo: {
        flex: 1,
    },
    loggedName: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },
    loggedMeta: {
        fontSize: ms(10),
        color: '#888',
        marginTop: vs(2),
    },
    removeBtn: {
        padding: ms(4),
    },

    // Info Card
    infoCard: {
        marginHorizontal: ms(15),
        marginTop: vs(20),
        backgroundColor: '#F6F8FB',
        borderRadius: ms(16),
        padding: ms(15),
    },
    infoTitle: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(6),
    },
    infoDesc: {
        fontSize: ms(11),
        color: '#888',
        lineHeight: ms(18),
    },
    infoLink: {
        color: primaryColor,
        fontWeight: '600',
    },
});
