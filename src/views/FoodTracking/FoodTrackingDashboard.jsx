import React, { useState, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import { getDailyNutritionSummary } from '../../utils/NutritionService';

const { width } = Dimensions.get('window');
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const MEAL_ICONS = {
    Breakfast: 'sunny-outline',
    Lunch: 'restaurant-outline',
    Dinner: 'moon-outline',
    Snacks: 'cafe-outline',
};

const FoodTrackingDashboard = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [mealData, setMealData] = useState({
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: [],
    });

    // Listen for addedFood param when returning from FoodNutritionDetail
    useFocusEffect(
        useCallback(() => {
            const addedFood = route.params?.addedFood;
            if (addedFood) {
                const meal = addedFood.mealType || 'Snacks';
                setMealData((prev) => ({
                    ...prev,
                    [meal]: [...prev[meal], { ...addedFood, id: `food-${Date.now()}` }],
                }));
                // Clear params so it doesn't re-add on next focus
                navigation.setParams({ addedFood: undefined });
            }
        }, [route.params?.addedFood]),
    );

    // Get all logged food items for summary
    const allFoods = Object.values(mealData).flat();
    const summary = getDailyNutritionSummary(allFoods);

    const getMealCalories = (mealType) => {
        return Math.round(
            mealData[mealType].reduce((sum, item) => sum + (item.calories || 0), 0),
        );
    };

    const handleRemoveFood = (mealType, foodId) => {
        setMealData((prev) => ({
            ...prev,
            [mealType]: prev[mealType].filter((item) => item.id !== foodId),
        }));
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
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Food Tracking</Text>
                        <Text style={styles.headerSubtitle}>Today's Nutrition</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.headerIconBg}
                        onPress={() => navigation.navigate('FoodSearchResults', { mealType: 'Snacks' })}
                    >
                        <Icon type={Icons.Ionicons} name="add" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                </View>

                {/* Daily Summary Card */}
                <LinearGradient
                    colors={['#1A7E70', '#2BA695']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.summaryCard}
                >
                    <View style={styles.summaryTop}>
                        <View>
                            <Text style={styles.summaryCalLabel}>Total Calories</Text>
                            <Text style={styles.summaryCalValue}>{summary.totalCalories}</Text>
                            <Text style={styles.summaryCalUnit}>kcal</Text>
                        </View>
                        <View style={styles.summaryCircle}>
                            <Icon type={Icons.Ionicons} name="nutrition-outline" color={whiteColor} size={ms(32)} />
                        </View>
                    </View>

                    <View style={styles.macroRow}>
                        <View style={styles.macroPill}>
                            <View style={[styles.macroDot, { backgroundColor: '#FF6B6B' }]} />
                            <Text style={styles.macroLabel}>Protein</Text>
                            <Text style={styles.macroValue}>{summary.totalProtein}g</Text>
                        </View>
                        <View style={styles.macroPill}>
                            <View style={[styles.macroDot, { backgroundColor: '#4ECDC4' }]} />
                            <Text style={styles.macroLabel}>Carbs</Text>
                            <Text style={styles.macroValue}>{summary.totalCarbs}g</Text>
                        </View>
                        <View style={styles.macroPill}>
                            <View style={[styles.macroDot, { backgroundColor: '#FFE66D' }]} />
                            <Text style={styles.macroLabel}>Fat</Text>
                            <Text style={styles.macroValue}>{summary.totalFat}g</Text>
                        </View>
                        <View style={styles.macroPill}>
                            <View style={[styles.macroDot, { backgroundColor: '#A78BFA' }]} />
                            <Text style={styles.macroLabel}>Fiber</Text>
                            <Text style={styles.macroValue}>{summary.totalFiber}g</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Meal Sections */}
                {MEAL_TYPES.map((mealType) => (
                    <View key={mealType} style={styles.mealSection}>
                        <View style={styles.mealHeader}>
                            <View style={styles.mealTitleRow}>
                                <Icon
                                    type={Icons.Ionicons}
                                    name={MEAL_ICONS[mealType]}
                                    color={primaryColor}
                                    size={ms(18)}
                                />
                                <Text style={styles.mealTitle}>{mealType}</Text>
                            </View>
                            <View style={styles.mealHeaderRight}>
                                {getMealCalories(mealType) > 0 && (
                                    <Text style={styles.mealCalories}>{getMealCalories(mealType)} cal</Text>
                                )}
                                <TouchableOpacity
                                    style={styles.mealAddBtn}
                                    onPress={() => navigation.navigate('FoodSearchResults', { mealType })}
                                >
                                    <Icon type={Icons.Ionicons} name="add" color={whiteColor} size={ms(16)} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {mealData[mealType].length > 0 ? (
                            mealData[mealType].map((item) => (
                                <View key={item.id} style={styles.foodItemCard}>
                                    <View style={styles.foodIconBg}>
                                        <Icon type={Icons.Ionicons} name="leaf-outline" color={primaryColor} size={ms(16)} />
                                    </View>
                                    <View style={styles.foodItemInfo}>
                                        <Text style={styles.foodItemName} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.foodItemServing}>
                                            {item.serving_size_g}g • P: {item.protein_g}g • C: {item.carbohydrates_total_g}g • F: {item.fat_total_g}g
                                        </Text>
                                    </View>
                                    <Text style={styles.foodItemCal}>{item.calories} cal</Text>
                                    <TouchableOpacity
                                        onPress={() => handleRemoveFood(mealType, item.id)}
                                        style={styles.removeBtn}
                                    >
                                        <Icon type={Icons.Ionicons} name="close-circle-outline" color="#CCC" size={ms(18)} />
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <TouchableOpacity
                                style={styles.emptyMeal}
                                onPress={() => navigation.navigate('FoodSearchResults', { mealType })}
                            >
                                <Icon type={Icons.Ionicons} name="add-circle-outline" color="#CCC" size={ms(20)} />
                                <Text style={styles.emptyMealText}>Tap to add food</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default FoodTrackingDashboard;

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
    headerCenter: {
        flex: 1,
    },
    headerTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    headerSubtitle: {
        fontSize: ms(12),
        color: '#888',
        marginTop: vs(2),
    },
    headerIconBg: {
        width: ms(38),
        height: ms(38),
        borderRadius: ms(19),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Summary Card
    summaryCard: {
        marginHorizontal: ms(15),
        marginTop: vs(10),
        borderRadius: ms(16),
        padding: ms(18),
    },
    summaryTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(15),
    },
    summaryCalLabel: {
        fontSize: ms(12),
        color: 'rgba(255,255,255,0.8)',
    },
    summaryCalValue: {
        fontSize: ms(32),
        fontWeight: 'bold',
        color: whiteColor,
    },
    summaryCalUnit: {
        fontSize: ms(12),
        color: 'rgba(255,255,255,0.7)',
        marginTop: vs(-2),
    },
    summaryCircle: {
        width: ms(60),
        height: ms(60),
        borderRadius: ms(30),
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    macroRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    macroPill: {
        alignItems: 'center',
        flex: 1,
    },
    macroDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        marginBottom: vs(4),
    },
    macroLabel: {
        fontSize: ms(10),
        color: 'rgba(255,255,255,0.7)',
    },
    macroValue: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: whiteColor,
        marginTop: vs(2),
    },

    // Meal Sections
    mealSection: {
        marginHorizontal: ms(15),
        marginTop: vs(20),
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    mealTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(8),
    },
    mealTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    mealHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
    },
    mealCalories: {
        fontSize: ms(13),
        color: '#888',
        fontWeight: '500',
    },
    mealAddBtn: {
        width: ms(28),
        height: ms(28),
        borderRadius: ms(14),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Food Item Card
    foodItemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F8FB',
        borderRadius: ms(12),
        paddingHorizontal: ms(12),
        paddingVertical: vs(12),
        marginBottom: vs(8),
    },
    foodIconBg: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        backgroundColor: '#E8F5F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
    },
    foodItemInfo: {
        flex: 1,
    },
    foodItemName: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
        textTransform: 'capitalize',
    },
    foodItemServing: {
        fontSize: ms(10),
        color: '#888',
        marginTop: vs(2),
    },
    foodItemCal: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: blackColor,
        marginRight: ms(8),
    },
    removeBtn: {
        padding: ms(4),
    },

    // Empty Meal
    emptyMeal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: ms(8),
        backgroundColor: '#F9FAFB',
        borderRadius: ms(12),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        paddingVertical: vs(16),
    },
    emptyMealText: {
        fontSize: ms(13),
        color: '#BBB',
    },
});
