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

const SleepPatternScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [sleepDuration, setSleepDuration] = useState('');
    const [sleepQuality, setSleepQuality] = useState('');

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
            title: 'Sleep Pattern Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'LifestyleInfo',
            targetParams: {
                ...route.params,
                sleepData: {
                    sleepDuration,
                    sleepQuality,
                },
                completedCategory: 'sleep',
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
                    <Text style={styles.headerTitle}>Sleep Pattern</Text>
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
                    {/* Average Sleep Duration */}
                    <Text style={styles.sectionTitle}>Average Sleep Duration</Text>
                    <View style={styles.optionsRow}>
                        <RadioButton
                            label="6 Hrs"
                            selected={sleepDuration === '6 Hrs'}
                            onSelect={() => setSleepDuration('6 Hrs')}
                        />
                        <RadioButton
                            label="7 Hrs"
                            selected={sleepDuration === '7 Hrs'}
                            onSelect={() => setSleepDuration('7 Hrs')}
                        />
                        <RadioButton
                            label="8 Hrs"
                            selected={sleepDuration === '8 Hrs'}
                            onSelect={() => setSleepDuration('8 Hrs')}
                        />
                        <RadioButton
                            label="Other"
                            selected={sleepDuration === 'Other'}
                            onSelect={() => setSleepDuration('Other')}
                        />
                    </View>

                    {/* Sleep Quality */}
                    <Text style={styles.sectionTitle}>Sleep Quality</Text>
                    <View style={styles.optionsRow}>
                        <RadioButton
                            label="Low"
                            selected={sleepQuality === 'Low'}
                            onSelect={() => setSleepQuality('Low')}
                        />
                        <RadioButton
                            label="Moderate"
                            selected={sleepQuality === 'Moderate'}
                            onSelect={() => setSleepQuality('Moderate')}
                        />
                        <RadioButton
                            label="High"
                            selected={sleepQuality === 'High'}
                            onSelect={() => setSleepQuality('High')}
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

export default SleepPatternScreen;
