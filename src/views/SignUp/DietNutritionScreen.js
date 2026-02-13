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

const DietNutritionScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [dietType, setDietType] = useState('');
    const [waterIntake, setWaterIntake] = useState('');
    const [caffeineIntake, setCaffeineIntake] = useState('');

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
            title: 'Diet & Nutrition Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'LifestyleInfo',
            targetParams: {
                ...route.params,
                dietData: {
                    dietType,
                    waterIntake,
                    caffeineIntake,
                },
                completedCategory: 'diet',
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
                    <Text style={styles.headerTitle}>Diet & Nutrition</Text>
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
                    {/* Diet Type */}
                    <Text style={styles.sectionTitle}>Diet Type</Text>
                    <View style={styles.optionsRow}>
                        <RadioButton
                            label="Vegetarian"
                            selected={dietType === 'Vegetarian'}
                            onSelect={() => setDietType('Vegetarian')}
                        />
                        <RadioButton
                            label="Non-Vegetarian"
                            selected={dietType === 'Non-Vegetarian'}
                            onSelect={() => setDietType('Non-Vegetarian')}
                        />
                        <RadioButton
                            label="Vegan"
                            selected={dietType === 'Vegan'}
                            onSelect={() => setDietType('Vegan')}
                        />
                    </View>
                    <View style={styles.optionsRow}>
                        <RadioButton
                            label="Mixed"
                            selected={dietType === 'Mixed'}
                            onSelect={() => setDietType('Mixed')}
                        />
                    </View>

                    {/* Daily Water Intake */}
                    <Text style={styles.sectionTitle}>Daily Water Intake</Text>
                    <View style={styles.optionsRow}>
                        <RadioButton
                            label="500ml"
                            selected={waterIntake === '500ml'}
                            onSelect={() => setWaterIntake('500ml')}
                        />
                        <RadioButton
                            label="1 Liter"
                            selected={waterIntake === '1 Liter'}
                            onSelect={() => setWaterIntake('1 Liter')}
                        />
                        <RadioButton
                            label="2 Liter"
                            selected={waterIntake === '2 Liter'}
                            onSelect={() => setWaterIntake('2 Liter')}
                        />
                    </View>

                    {/* Caffeine Intake */}
                    <Text style={styles.sectionTitle}>Caffeine Intake</Text>
                    <View style={styles.optionsRow}>
                        <RadioButton
                            label="None"
                            selected={caffeineIntake === 'None'}
                            onSelect={() => setCaffeineIntake('None')}
                        />
                        <RadioButton
                            label="1 Cup per Day"
                            selected={caffeineIntake === '1 Cup per Day'}
                            onSelect={() => setCaffeineIntake('1 Cup per Day')}
                        />
                    </View>
                    <View style={styles.optionsRow}>
                        <RadioButton
                            label="2-3 Cups per Day"
                            selected={caffeineIntake === '2-3 Cups per Day'}
                            onSelect={() => setCaffeineIntake('2-3 Cups per Day')}
                        />
                        <RadioButton
                            label="3-4 Cups per Day"
                            selected={caffeineIntake === '3-4 Cups per Day'}
                            onSelect={() => setCaffeineIntake('3-4 Cups per Day')}
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

export default DietNutritionScreen;
