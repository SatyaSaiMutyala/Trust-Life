import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { bold, regular } from '../config/Constants';
import { primaryColor, whiteColor } from '../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';

const STEPS = [
    { label: 'Person Details' },
    { label: 'Lifestyle Info' },
    { label: 'Medical History' },
    { label: 'Add Family' },
];

const SignUpStepper = ({ currentStep = 0 }) => {
    return (
        <View style={styles.stepperRow}>
            {STEPS.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;
                const isFirst = index === 0;
                const isLast = index === STEPS.length - 1;
                const leftDone = index <= currentStep && !isFirst;
                const rightDone = index < currentStep && !isLast;

                return (
                    <View key={index} style={styles.stepColumn}>
                        <View style={styles.stepCircleRow}>
                            <View
                                style={[
                                    styles.stepHalfLine,
                                    { backgroundColor: isFirst ? 'transparent' : (leftDone ? primaryColor : '#E5E7EB') },
                                ]}
                            />
                            <View
                                style={[
                                    styles.stepCircle,
                                    (isCompleted || isActive) ? styles.stepCircleActive : styles.stepCircleUpcoming,
                                ]}>
                                {isCompleted ? (
                                    <Image source={require('../assets/img/stepperImg.png')} style={styles.completedImage} />
                                ) : (
                                    <Text style={[styles.stepNumber, (isActive || isCompleted) && styles.stepNumberActive]}>
                                        {index + 1}
                                    </Text>
                                )}
                            </View>
                            <View
                                style={[
                                    styles.stepHalfLine,
                                    { backgroundColor: isLast ? 'transparent' : (rightDone ? primaryColor : '#E5E7EB') },
                                ]}
                            />
                        </View>
                        <Text
                            style={[styles.stepLabel, (isActive || isCompleted) && styles.stepLabelActive]}
                            numberOfLines={1}>
                            {step.label}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

export default SignUpStepper;

const styles = StyleSheet.create({
    stepperRow: {
        flexDirection: 'row',
        marginTop: vs(10),
        marginBottom: vs(20),
    },
    stepColumn: {
        flex: 1,
        alignItems: 'center',
    },
    stepCircleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    stepHalfLine: {
        flex: 1,
        height: ms(2),
    },
    stepCircle: {
        width: ms(30),
        height: ms(30),
        borderRadius: ms(15),
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepCircleActive: {
        backgroundColor: primaryColor,
    },
    stepCircleUpcoming: {
        backgroundColor: '#E5E7EB',
    },
    stepNumber: {
        fontFamily: bold,
        fontSize: ms(12),
        color: '#6B7280',
    },
    stepNumberActive: {
        color: whiteColor,
    },
    completedImage: {
        width: ms(20),
        height: ms(20),
        borderRadius: ms(15),
        resizeMode: 'contain',
    },
    stepLabel: {
        fontFamily: regular,
        fontSize: ms(9),
        color: '#6B7280',
        textAlign: 'center',
        marginTop: vs(5),
    },
    stepLabelActive: {
        color: primaryColor,
    },
});
