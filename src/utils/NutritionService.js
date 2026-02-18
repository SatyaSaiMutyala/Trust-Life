import { USDA_API_KEY, USDA_BASE_URL } from '../config/Constants';

// ── USDA nutrient IDs ──────────────────────────────────────────────────────
const NUTRIENT = {
    calories:     1008,
    protein:      1003,
    fat:          1004,
    carbs:        1005,
    fiber:        1079,
    sugar:        1063,
    sodium:       1093,
    potassium:    1092,
    cholesterol:  1253,
    saturatedFat: 1258,
};

const getNutrientValue = (foodNutrients, nutrientId) => {
    const n = foodNutrients.find((item) => item.nutrientId === nutrientId);
    return n ? Math.round((n.value || 0) * 10) / 10 : 0;
};

const mapUSDAFood = (fdcFood) => ({
    name:                   fdcFood.description || 'Unknown',
    calories:               getNutrientValue(fdcFood.foodNutrients, NUTRIENT.calories),
    protein_g:              getNutrientValue(fdcFood.foodNutrients, NUTRIENT.protein),
    carbohydrates_total_g:  getNutrientValue(fdcFood.foodNutrients, NUTRIENT.carbs),
    fat_total_g:            getNutrientValue(fdcFood.foodNutrients, NUTRIENT.fat),
    fiber_g:                getNutrientValue(fdcFood.foodNutrients, NUTRIENT.fiber),
    sugar_g:                getNutrientValue(fdcFood.foodNutrients, NUTRIENT.sugar),
    sodium_mg:              getNutrientValue(fdcFood.foodNutrients, NUTRIENT.sodium),
    potassium_mg:           getNutrientValue(fdcFood.foodNutrients, NUTRIENT.potassium),
    cholesterol_mg:         getNutrientValue(fdcFood.foodNutrients, NUTRIENT.cholesterol),
    fat_saturated_g:        getNutrientValue(fdcFood.foodNutrients, NUTRIENT.saturatedFat),
    serving_size_g:         fdcFood.servingSize || 100,
    fdcId:                  fdcFood.fdcId,
    dataType:               fdcFood.dataType,
});

/**
 * Search food using USDA FoodData Central API
 * @param {string} query - food name to search
 * @returns {Promise<Array>} matching food items in app nutrition format
 */

export const searchFoodUSDA = async (query) => {
    const q = query.trim();
    if (q.length < 2) return [];

    try {
        const params = new URLSearchParams({
            api_key: USDA_API_KEY,
            query: q,
            pageSize: '25',
            dataType: 'Foundation,SR Legacy',
        });
        const url = `${USDA_BASE_URL}/foods/search?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`USDA API ${response.status}`);

        const data = await response.json();
        const mapped = (data.foods || [])
            .map(mapUSDAFood)
            .filter((f) => f.calories > 0);

        console.log('[USDA] query:', q, '| results:', mapped.length);
        return mapped;
    } catch (_err) {
        console.log('[USDA] API error:', _err?.message);
        return [];
    }
};

/**
 * Aggregate daily nutrition totals from logged food items
 * @param {Array} foodItems - array of food objects with nutrition data
 * @returns {Object} { totalCalories, totalProtein, totalCarbs, totalFat, totalFiber }
 */
export const getDailyNutritionSummary = (foodItems) => {
    const summary = {
        totalCalories: 0,
        totalProtein:  0,
        totalCarbs:    0,
        totalFat:      0,
        totalFiber:    0,
    };

    foodItems.forEach((item) => {
        summary.totalCalories += item.calories || 0;
        summary.totalProtein  += item.protein_g || 0;
        summary.totalCarbs    += item.carbohydrates_total_g || 0;
        summary.totalFat      += item.fat_total_g || 0;
        summary.totalFiber    += item.fiber_g || 0;
    });

    summary.totalCalories = round(summary.totalCalories);
    summary.totalProtein  = round(summary.totalProtein);
    summary.totalCarbs    = round(summary.totalCarbs);
    summary.totalFat      = round(summary.totalFat);
    summary.totalFiber    = round(summary.totalFiber);

    return summary;
};

function round(val) {
    return Math.round((val || 0) * 10) / 10;
}
