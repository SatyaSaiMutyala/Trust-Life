import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const EXERCISE_CATEGORIES = [
    {
        title: 'Cardio Exercises',
        exercises: [
            { name: 'Walking', icon: 'walk-outline', caloriesPerMin: 4 },
            { name: 'Running', icon: 'fitness-outline', caloriesPerMin: 10 },
            { name: 'Jogging', icon: 'body-outline', caloriesPerMin: 7 },
            { name: 'Swimming', icon: 'water-outline', caloriesPerMin: 8 },
            { name: 'Cycling', icon: 'bicycle-outline', caloriesPerMin: 7 },
            { name: 'Jump Rope', icon: 'pulse-outline', caloriesPerMin: 12 },
        ],
    },
    {
        title: 'Strength Exercises',
        exercises: [
            { name: 'Chest', icon: 'barbell-outline', caloriesPerMin: 6 },
            { name: 'Shoulders', icon: 'barbell-outline', caloriesPerMin: 5 },
            { name: 'Back Upper Arms', icon: 'barbell-outline', caloriesPerMin: 5 },
            { name: 'Front Upper Arms', icon: 'barbell-outline', caloriesPerMin: 5 },
            { name: 'Legs', icon: 'barbell-outline', caloriesPerMin: 7 },
            { name: 'Core', icon: 'barbell-outline', caloriesPerMin: 5 },
        ],
    },
    {
        title: 'Flexibility Exercises',
        exercises: [
            { name: 'Yoga', icon: 'leaf-outline', caloriesPerMin: 4 },
            { name: 'Stretching', icon: 'body-outline', caloriesPerMin: 3 },
            { name: 'Back Stretch', icon: 'body-outline', caloriesPerMin: 3 },
            { name: 'Swimming', icon: 'water-outline', caloriesPerMin: 8 },
            { name: 'Pilates', icon: 'leaf-outline', caloriesPerMin: 5 },
        ],
    },
];

const SelectExercise = () => {
    const navigation = useNavigation();

    const handleSelectExercise = (exercise, category) => {
        navigation.navigate('ExerciseDetailForm', {
            exerciseName: exercise.name,
            category: category,
            caloriesPerMin: exercise.caloriesPerMin,
        });
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
                    <Text style={styles.headerTitle}>Select your exercise</Text>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Categories */}
                {EXERCISE_CATEGORIES.map((category) => (
                    <View key={category.title} style={styles.categorySection}>
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.exerciseGrid}
                        >
                            {category.exercises.map((exercise) => (
                                <TouchableOpacity
                                    key={`${category.title}-${exercise.name}`}
                                    style={styles.exerciseItem}
                                    activeOpacity={0.7}
                                    onPress={() => handleSelectExercise(exercise, category.title)}
                                >
                                    <View style={styles.exerciseIconCircle}>
                                        <Icon
                                            type={Icons.Ionicons}
                                            name={exercise.icon}
                                            color={primaryColor}
                                            size={ms(24)}
                                        />
                                    </View>
                                    <Text style={styles.exerciseName} numberOfLines={2}>{exercise.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                ))}

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default SelectExercise;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingBottom: vs(30),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(10),
    },
    backButton: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        flex: 1,
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        textAlign: 'center',
    },

    // Category
    categorySection: {
        paddingHorizontal: ms(15),
        marginTop: vs(20),
    },
    categoryTitle: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(12),
    },
    exerciseGrid: {
        flexDirection: 'row',
        gap: ms(12),
        paddingRight: ms(15),
    },
    exerciseItem: {
        alignItems: 'center',
        width: ms(70),
    },
    exerciseIconCircle: {
        width: ms(56),
        height: ms(56),
        borderRadius: ms(28),
        backgroundColor: '#E8F5F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    exerciseName: {
        fontSize: ms(10),
        color: '#555',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: ms(14),
    },
});
