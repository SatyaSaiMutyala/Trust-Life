import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';

const { width } = Dimensions.get('window');

const FoodNutritionDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const foodItem = route.params?.foodItem || {};
    const mealType = route.params?.mealType || 'Snacks';

    // Macro distribution percentages
    const totalMacroGrams = (foodItem.protein_g || 0) + (foodItem.carbohydrates_total_g || 0) + (foodItem.fat_total_g || 0);
    const proteinPct = totalMacroGrams > 0 ? Math.round((foodItem.protein_g / totalMacroGrams) * 100) : 0;
    const carbsPct = totalMacroGrams > 0 ? Math.round((foodItem.carbohydrates_total_g / totalMacroGrams) * 100) : 0;
    const fatPct = totalMacroGrams > 0 ? 100 - proteinPct - carbsPct : 0;

    const handleAddToMeal = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Food Added',
            subtitle: 'Successfully',
            delay: 1500,
            targetScreen: 'FoodTrackingDashboard',
            targetParams: {
                addedFood: {
                    ...foodItem,
                    mealType,
                    addedAt: new Date().toISOString(),
                },
            },
            useNavigate: true,
        });
    };

    const MacroCard = ({ label, value, unit, color, iconName }) => (
        <View style={[styles.macroCard, { borderLeftColor: color, borderLeftWidth: 3 }]}>
            <View style={styles.macroCardHeader}>
                <Icon type={Icons.Ionicons} name={iconName} color={color} size={ms(18)} />
                <Text style={styles.macroCardLabel}>{label}</Text>
            </View>
            <Text style={styles.macroCardValue}>
                {value}<Text style={styles.macroCardUnit}>{unit}</Text>
            </Text>
        </View>
    );

    const NutritionRow = ({ label, value, unit }) => (
        <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>{label}</Text>
            <Text style={styles.nutritionValue}>{value} {unit}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Nutrition Details</Text>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroIconCircle}>
                        <Icon type={Icons.Ionicons} name="nutrition" color={primaryColor} size={ms(36)} />
                    </View>
                    <Text style={styles.heroName}>{foodItem.name}</Text>
                    <Text style={styles.heroServing}>Serving: {foodItem.serving_size_g}g</Text>
                </View>

                {/* Macro Nutrient Cards */}
                <View style={styles.macroGrid}>
                    <MacroCard label="Calories" value={foodItem.calories} unit=" kcal" color="#FF6B6B" iconName="flame-outline" />
                    <MacroCard label="Protein" value={foodItem.protein_g} unit="g" color="#4ECDC4" iconName="barbell-outline" />
                    <MacroCard label="Carbs" value={foodItem.carbohydrates_total_g} unit="g" color="#FFE66D" iconName="grid-outline" />
                    <MacroCard label="Fat" value={foodItem.fat_total_g} unit="g" color="#A78BFA" iconName="water-outline" />
                </View>

                {/* Macro Distribution Bar */}
                {totalMacroGrams > 0 && (
                    <View style={styles.distributionSection}>
                        <Text style={styles.sectionTitle}>Macro Distribution</Text>
                        <View style={styles.distributionBar}>
                            {proteinPct > 0 && <View style={[styles.barSegment, { flex: proteinPct, backgroundColor: '#4ECDC4', borderTopLeftRadius: ms(4), borderBottomLeftRadius: ms(4) }]} />}
                            {carbsPct > 0 && <View style={[styles.barSegment, { flex: carbsPct, backgroundColor: '#FFE66D' }]} />}
                            {fatPct > 0 && <View style={[styles.barSegment, { flex: fatPct, backgroundColor: '#A78BFA', borderTopRightRadius: ms(4), borderBottomRightRadius: ms(4) }]} />}
                        </View>
                        <View style={styles.legendRow}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]} />
                                <Text style={styles.legendText}>Protein {proteinPct}%</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#FFE66D' }]} />
                                <Text style={styles.legendText}>Carbs {carbsPct}%</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#A78BFA' }]} />
                                <Text style={styles.legendText}>Fat {fatPct}%</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Detailed Breakdown */}
                <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Detailed Nutrition</Text>
                    <View style={styles.detailCard}>
                        <NutritionRow label="Fiber" value={foodItem.fiber_g} unit="g" />
                        <NutritionRow label="Sugar" value={foodItem.sugar_g} unit="g" />
                        <NutritionRow label="Sodium" value={foodItem.sodium_mg} unit="mg" />
                        <NutritionRow label="Potassium" value={foodItem.potassium_mg} unit="mg" />
                        <NutritionRow label="Cholesterol" value={foodItem.cholesterol_mg} unit="mg" />
                        <NutritionRow label="Saturated Fat" value={foodItem.fat_saturated_g} unit="g" />
                    </View>
                </View>

            </ScrollView>

            {/* Add to Meal Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title={`Add to ${mealType}`}
                    onPress={handleAddToMeal}
                    style={{ marginTop: 0 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default FoodNutritionDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingBottom: vs(20),
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

    // Hero
    heroSection: {
        alignItems: 'center',
        paddingVertical: vs(20),
    },
    heroIconCircle: {
        width: ms(80),
        height: ms(80),
        borderRadius: ms(40),
        backgroundColor: '#E8F5F3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroName: {
        fontSize: ms(20),
        fontWeight: 'bold',
        color: blackColor,
        marginTop: vs(12),
        textTransform: 'capitalize',
    },
    heroServing: {
        fontSize: ms(13),
        color: '#888',
        marginTop: vs(4),
    },

    // Macro Cards
    macroGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: ms(15),
        gap: ms(10),
    },
    macroCard: {
        width: (width - ms(45)) / 2,
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(15),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    macroCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(6),
        marginBottom: vs(8),
    },
    macroCardLabel: {
        fontSize: ms(12),
        color: '#888',
        fontWeight: '500',
    },
    macroCardValue: {
        fontSize: ms(22),
        fontWeight: 'bold',
        color: blackColor,
    },
    macroCardUnit: {
        fontSize: ms(12),
        fontWeight: '500',
        color: '#888',
    },

    // Distribution
    distributionSection: {
        paddingHorizontal: ms(15),
        marginTop: vs(25),
    },
    sectionTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(12),
    },
    distributionBar: {
        flexDirection: 'row',
        height: ms(10),
        borderRadius: ms(5),
        overflow: 'hidden',
    },
    barSegment: {
        height: '100%',
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: ms(20),
        marginTop: vs(10),
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(5),
    },
    legendDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
    },
    legendText: {
        fontSize: ms(11),
        color: '#666',
    },

    // Detail
    detailSection: {
        paddingHorizontal: ms(15),
        marginTop: vs(25),
    },
    detailCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: ms(12),
        padding: ms(5),
    },
    nutritionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(12),
        paddingHorizontal: ms(15),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    nutritionLabel: {
        fontSize: ms(14),
        color: '#666',
    },
    nutritionValue: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },

    // Button
    buttonContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(25),
        paddingTop: vs(10),
        backgroundColor: whiteColor,
    },
});
