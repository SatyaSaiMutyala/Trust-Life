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

const CONDITIONS = [
    'Diabetes',
    'Blood Pressure (Hypertension)',
    'Heart Disease',
    'Thyroid Disorders',
    'Asthma',
    'Kidney Disease',
    'Liver Disease',
    'Allergies',
];

const ExistingConditionsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [selectedConditions, setSelectedConditions] = useState([]);

    const toggleCondition = (condition) => {
        setSelectedConditions((prev) =>
            prev.includes(condition)
                ? prev.filter((c) => c !== condition)
                : [...prev, condition],
        );
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Medical Conditions Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'MedicalHistory',
            targetParams: {
                ...route.params,
                conditionsData: selectedConditions,
                completedCategory: 'conditions',
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
                    <Text style={styles.headerTitle}>Existing Medical Conditions</Text>
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
                    <Text style={styles.sectionTitle}>Select Existing Medical Conditions</Text>

                    {CONDITIONS.map((condition) => {
                        const isSelected = selectedConditions.includes(condition);
                        return (
                            <TouchableOpacity
                                key={condition}
                                style={styles.checkboxRow}
                                activeOpacity={0.7}
                                onPress={() => toggleCondition(condition)}>
                                <Text style={styles.checkboxLabel}>{condition}</Text>
                                <View
                                    style={[
                                        styles.checkbox,
                                        isSelected && styles.checkboxActive,
                                    ]}>
                                    {isSelected && (
                                        <Icon
                                            type={Icons.Feather}
                                            name="check"
                                            color={whiteColor}
                                            size={ms(14)}
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
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
        flex: 1,
        fontFamily: bold,
        fontSize: ms(20),
        color: whiteColor,
        marginRight: ms(12),
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
        marginTop: vs(16),
        marginBottom: vs(16),
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: vs(14),
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    checkboxLabel: {
        flex: 1,
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
    },
    checkbox: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(4),
        borderWidth: ms(1),
        borderColor: '#D1D5DB',
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },
    bottomContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
});

export default ExistingConditionsScreen;
