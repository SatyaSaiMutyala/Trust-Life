import React, { useState } from 'react';
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
    primaryColor,
    whiteColor,
    globalGradient,
} from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';
import PrimaryButton from '../../utils/primaryButton';

const PhysicalActivityScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [exerciseFrequency, setExerciseFrequency] = useState('');
    const [exerciseType, setExerciseType] = useState('');
    const [averageDuration, setAverageDuration] = useState('');

    const RadioButton = ({ label, selected, onSelect }) => (
        <TouchableOpacity style={styles.radioContainer} onPress={onSelect}>
            <View
                style={[
                    styles.radioOuter,
                    selected && styles.radioOuterActive,
                ]}>
                {selected && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Physical Activity Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'LifestyleInfo',
            targetParams: {
                ...route.params,
                activityData: {
                    exerciseFrequency,
                    exerciseType,
                    averageDuration,
                },
                completedCategory: 'activity',
            },
            useNavigate: true,
        });
    };

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.18]}
            style={styles.flex1}>
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Physical Activity</Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.closeButton}>
                        <Icon
                            type={Icons.Feather}
                            name="x"
                            color={blackColor}
                            size={ms(18)}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}>
                    {/* Exercise Frequency */}
                    <Text style={styles.sectionTitle}>Exercise Frequency</Text>
                    <View style={styles.optionsRow}>
                        <RadioButton
                            label="Daily"
                            selected={exerciseFrequency === 'Daily'}
                            onSelect={() => setExerciseFrequency('Daily')}
                        />
                        <RadioButton
                            label="Weekly"
                            selected={exerciseFrequency === 'Weekly'}
                            onSelect={() => setExerciseFrequency('Weekly')}
                        />
                        <RadioButton
                            label="Rarely"
                            selected={exerciseFrequency === 'Rarely'}
                            onSelect={() => setExerciseFrequency('Rarely')}
                        />
                        <RadioButton
                            label="Never"
                            selected={exerciseFrequency === 'Never'}
                            onSelect={() => setExerciseFrequency('Never')}
                        />
                    </View>

                    {/* Exercise Type */}
                    <Text style={styles.sectionTitle}>Exercise Type</Text>
                    <View style={styles.optionsRow}>
                        <RadioButton
                            label="Walking"
                            selected={exerciseType === 'Walking'}
                            onSelect={() => setExerciseType('Walking')}
                        />
                        <RadioButton
                            label="Gym"
                            selected={exerciseType === 'Gym'}
                            onSelect={() => setExerciseType('Gym')}
                        />
                        <RadioButton
                            label="Yoga"
                            selected={exerciseType === 'Yoga'}
                            onSelect={() => setExerciseType('Yoga')}
                        />
                        <RadioButton
                            label="Sports"
                            selected={exerciseType === 'Sports'}
                            onSelect={() => setExerciseType('Sports')}
                        />
                    </View>

                    {/* Average Duration */}
                    <Text style={styles.sectionTitle}>Average Duration</Text>
                    <View style={styles.optionsRow}>
                        <RadioButton
                            label="30 Mns"
                            selected={averageDuration === '30 Mns'}
                            onSelect={() => setAverageDuration('30 Mns')}
                        />
                        <RadioButton
                            label="1 Hr"
                            selected={averageDuration === '1 Hr'}
                            onSelect={() => setAverageDuration('1 Hr')}
                        />
                        <RadioButton
                            label="2 Hrs"
                            selected={averageDuration === '2 Hrs'}
                            onSelect={() => setAverageDuration('2 Hrs')}
                        />
                        <RadioButton
                            label="3 Hrs"
                            selected={averageDuration === '3 Hrs'}
                            onSelect={() => setAverageDuration('3 Hrs')}
                        />
                    </View>
                </ScrollView>

                {/* Save Button */}
                <View style={styles.bottomContainer}>
                    <PrimaryButton title="Save" onPress={handleSave} />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(12),
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(22),
        color: whiteColor,
    },
    closeButton: {
        width: ms(30),
        height: ms(30),
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
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
    sectionTitle: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginTop: vs(20),
        marginBottom: vs(14),
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(20),
        marginBottom: vs(4),
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    radioOuter: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(11),
        borderWidth: ms(1),
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(8),
        backgroundColor: '#F3F4F6',
    },
    radioOuterActive: {
        borderColor: primaryColor,
        backgroundColor: whiteColor,
    },
    radioInner: {
        width: ms(12),
        height: ms(12),
        borderRadius: ms(6),
        backgroundColor: primaryColor,
    },
    radioLabel: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
    },
    bottomContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
});

export default PhysicalActivityScreen;
