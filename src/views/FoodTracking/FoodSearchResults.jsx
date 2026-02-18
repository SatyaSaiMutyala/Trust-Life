import React, { useState, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import { searchFoodUSDA } from '../../utils/NutritionService';

const FoodSearchResults = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const mealType = route.params?.mealType || 'Snacks';

    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const debounceRef = useRef(null);

    const handleSearch = (text) => {
        setSearchQuery(text);

        // Clear previous debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (text.trim().length < 2) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            setHasSearched(true);
            const data = await searchFoodUSDA(text.trim());
            setResults(data);
            setIsLoading(false);
        }, 300);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setResults([]);
        setHasSearched(false);
    };

    const renderFoodItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.resultCard}
            onPress={() => navigation.navigate('FoodNutritionDetail', { foodItem: item, mealType })}
            activeOpacity={0.7}
        >
            <View style={styles.resultIconBg}>
                <Icon type={Icons.Ionicons} name="leaf-outline" color={primaryColor} size={ms(20)} />
            </View>
            <View style={styles.resultInfo}>
                <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.resultServing}>{item.serving_size_g}g serving</Text>
            </View>
            <View style={styles.resultCalories}>
                <Text style={styles.resultCalValue}>{item.calories}</Text>
                <Text style={styles.resultCalUnit}>cal</Text>
            </View>
            <Icon type={Icons.Ionicons} name="chevron-forward" color="#CCC" size={ms(18)} />
        </TouchableOpacity>
    );

    const renderEmpty = () => {
        if (isLoading) return null;
        if (!hasSearched) {
            return (
                <View style={styles.emptyContainer}>
                    <Icon type={Icons.Ionicons} name="search-outline" color="#DDD" size={ms(50)} />
                    <Text style={styles.emptyTitle}>Search for any food</Text>
                    <Text style={styles.emptyDesc}>
                        Try searching for rice, dal, rasam,{'\n'}soya chunks, chapati, paneer...
                    </Text>
                </View>
            );
        }
        return (
            <View style={styles.emptyContainer}>
                <Icon type={Icons.Ionicons} name="sad-outline" color="#DDD" size={ms(50)} />
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptyDesc}>
                    Try a different food name or{'\n'}add quantity like "100g rice"
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add to {mealType}</Text>
                <View style={{ width: ms(40) }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon type={Icons.Ionicons} name="search" color="#999" size={ms(18)} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search food (e.g., 100g rice, dal)"
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    autoFocus={true}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch}>
                        <Icon type={Icons.Ionicons} name="close-circle" color="#CCC" size={ms(20)} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Loading */}
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={primaryColor} />
                    <Text style={styles.loadingText}>Searching...</Text>
                </View>
            )}

            {/* Results */}
            <FlatList
                data={results}
                renderItem={renderFoodItem}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default FoodSearchResults;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
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

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(25),
        paddingHorizontal: ms(15),
        paddingVertical: vs(10),
        marginHorizontal: ms(15),
        marginBottom: vs(10),
        gap: ms(8),
    },
    searchInput: {
        flex: 1,
        fontSize: ms(14),
        color: blackColor,
        paddingVertical: 0,
    },

    // Loading
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: ms(8),
        paddingVertical: vs(10),
    },
    loadingText: {
        fontSize: ms(13),
        color: '#888',
    },

    // Results
    listContent: {
        paddingHorizontal: ms(15),
        paddingBottom: vs(30),
        flexGrow: 1,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F8FB',
        borderRadius: ms(12),
        paddingHorizontal: ms(12),
        paddingVertical: vs(14),
        marginBottom: vs(8),
    },
    resultIconBg: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        backgroundColor: '#E8F5F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    resultInfo: {
        flex: 1,
    },
    resultName: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
        textTransform: 'capitalize',
    },
    resultServing: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
    },
    resultCalories: {
        alignItems: 'center',
        marginRight: ms(8),
    },
    resultCalValue: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    resultCalUnit: {
        fontSize: ms(10),
        color: '#888',
    },

    // Empty
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: vs(80),
    },
    emptyTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: '#999',
        marginTop: vs(15),
    },
    emptyDesc: {
        fontSize: ms(12),
        color: '#BBB',
        textAlign: 'center',
        lineHeight: ms(18),
        marginTop: vs(8),
    },
});
