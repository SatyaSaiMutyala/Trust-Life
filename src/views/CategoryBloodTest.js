import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon, { Icons } from '../components/Icons';
import { StatusBar, StatusBar2 } from '../components/StatusBar';
import { primaryColor, whiteColor, blackColor, globalGradient, grayColor } from '../utils/globalColors';
import { s, vs, ms } from 'react-native-size-matters';

const TAB_WIDTH = ms(80);
const IMAGE_SIZE = ms(80);

const ageCategories = [
    { id: 1, label: 'Infant', sub: '0-1 Year' },
    { id: 2, label: 'Kids', sub: '0-1 Year' },
    { id: 3, label: 'Teenage', sub: '0-1 Year' },
    { id: 4, label: 'Adults', sub: '0-1 Year' },
    { id: 5, label: 'Adults', sub: '0-1 Year' },
    { id: 6, label: 'Adults', sub: '0-1 Year' },
];

const organs = [
    {id:1, lable:'Heart'},
    {id:2, lable:'Thyroid'},
    {id:3, lable:'Lungs'},
    {id:4, lable:'Kidney'},
    {id:5, lable:'Brain'},
]

const lifeStyle = [
    {id:1, lable:'Smoker'},
    {id:2, lable:'Fitness'},
    {id:3, lable:'Drinker'},
    {id:4, lable:'Obesity'},
]

const seasons = [
    {id:1, lable:'Summer'},
    {id:2, lable:'Winter'},
    {id:3, lable:'Monsoon'},
    {id:4, lable:'Rainy'},
]

const medicalCondition = [
    {id:1, lable:'Fever'},
    {id:2, lable:'Diabetes'},
    {id:3, lable:'Vitamincs Defivines'},
    {id:4, lable:'Tyroid'},
]

const popularPackagesData = [
    { id: 1, name: 'Neuronal (Paraneoplastic )...', testsCount: 'Covers 1 Test', originalPrice: '₹24,599', discountedPrice: '₹20,400.00', bgColor: '#E0F5F0' },
    { id: 2, name: 'Neuronal (Paraneoplastic )...', testsCount: 'Covers 1 Test', originalPrice: '₹24,599', discountedPrice: '₹20,400.00', bgColor: '#E0F5F0' },
    { id: 2, name: 'Neuronal (Paraneoplastic )...', testsCount: 'Covers 1 Test', originalPrice: '₹24,599', discountedPrice: '₹20,400.00', bgColor: '#E0F5F0' },
    { id: 2, name: 'Neuronal (Paraneoplastic )...', testsCount: 'Covers 1 Test', originalPrice: '₹24,599', discountedPrice: '₹20,400.00', bgColor: '#E0F5F0' },
];

const profilesData = [
    { id: 1, test_name: 'Neuronal ( Paraneoplastic ) Autoantibodies', covers: 'Covers 1 Test', price: '20400.00', report_days: '3 days', inCart: true },
    { id: 2, test_name: 'Neuronal ( Paraneoplastic ) Autoantibodies', covers: 'Covers 1 Test', price: '20400.00', report_days: '3 days', inCart: false },
    { id: 3, test_name: 'Neuronal ( Paraneoplastic ) Autoantibodies', covers: 'Covers 1 Test', price: '20400.00', report_days: '3 days', inCart: false },
];

const CategoryBloodTest = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const categoryName = route.params?.name || 'Age';

    const [selectedCategory, setSelectedCategory] = useState(1);
    const [maleEnabled, setMaleEnabled] = useState(true);
    const [femaleEnabled, setFemaleEnabled] = useState(categoryName !== 'Gender');
    const [search, setSearch] = useState('');

    const tabsMap = {
        'Organs': organs,
        'Lifestyle': lifeStyle,
        'Seasonal': seasons,
        'Medical Condition': medicalCondition,
    };
    const tabsData = tabsMap[categoryName] || ageCategories;
    const selectedTab = tabsData.find(c => c.id === selectedCategory) || tabsData[0];
    const selectedCategoryLabel = selectedTab?.label || selectedTab?.lable;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.115]}
                style={styles.fullGradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                        style={styles.backButton}
                    >
                        <Icon
                            type={Icons.Ionicons}
                            name="arrow-back"
                            size={ms(18)}
                            color={whiteColor}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{categoryName}</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Icon type={Icons.Ionicons} name="search" color="#999" size={ms(20)} style={{ marginRight: s(10) }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor="#999"
                    />
                </View>

                    {/* Age Category Tabs */}
                    {categoryName !== 'Gender' && <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.tabsContainer}
                        contentContainerStyle={{ padding: ms(4) }}
                    >
                        {tabsData.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.tabItem,
                                    selectedCategory === cat.id && styles.tabItemActive,
                                ]}
                                onPress={() => setSelectedCategory(cat.id)}
                            >
                                <Text style={[
                                    styles.tabLabel,
                                    selectedCategory === cat.id && styles.tabLabelActive,
                                ]}>
                                    {cat.label || cat.lable}
                                </Text>
                                {cat.sub && (
                                    <Text style={[
                                        styles.tabSub,
                                        selectedCategory === cat.id && styles.tabSubActive,
                                    ]}>
                                        {cat.sub}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: vs(30) }}
                >
                    {/* Gender Toggle Section */}
                    {(categoryName === 'Age' || categoryName === 'Gender') && <View style={styles.genderSection}>
                        <View style={styles.genderItem}>
                            <Image
                                source={require('../assets/img/kid.png')}
                                style={styles.genderImage}
                            />
                            <Text style={styles.genderLabel}>Male</Text>
                            <Switch
                                value={maleEnabled}
                                onValueChange={setMaleEnabled}
                                trackColor={{ false: '#D1D5DB', true: primaryColor }}
                                thumbColor={whiteColor}
                            />
                        </View>
                        <View style={styles.genderItem}>
                            <Image
                                source={require('../assets/img/kid1.png')}
                                style={styles.genderImage}
                            />
                            <Text style={styles.genderLabel}>Female</Text>
                            <Switch
                                value={femaleEnabled}
                                onValueChange={setFemaleEnabled}
                                trackColor={{ false: '#D1D5DB', true: primaryColor }}
                                thumbColor={whiteColor}
                            />
                        </View>
                    </View>}

                    {/* Popular Packages Section */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionHeading}>Popular Packages</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: ms(5) }}
                        >
                            {popularPackagesData.map((pkg, index) => (
                                <View key={index} style={[styles.packageCard, { backgroundColor: pkg.bgColor }]}>
                                    <Text style={styles.packageName}>{pkg.name}</Text>
                                    <Text style={styles.packageTests}>{pkg.testsCount}</Text>
                                    <View style={styles.packagePriceRow}>
                                        <View style={styles.priceContainer}>
                                            <Text style={styles.discountedPrice}>{pkg.discountedPrice}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.arrowButton}>
                                            <Icon type={Icons.Entypo} name="chevron-with-circle-right" color={blackColor} size={ms(20)} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Profiles Section */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionHeading}>{selectedCategoryLabel} Profiles</Text>
                        {profilesData.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.8}
                                style={styles.cardContainer}
                            >
                                {/* Left Image and Tag */}
                                <View style={{ marginRight: ms(15), position: 'relative' }}>
                                    <View style={{
                                        width: IMAGE_SIZE,
                                        height: IMAGE_SIZE,
                                        backgroundColor: '#EBFEFB',
                                        borderRadius: ms(10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        overflow: 'hidden',
                                    }}>
                                        <Image
                                            source={require('../assets/img/cardImg.png')}
                                            style={{
                                                width: ms(60),
                                                height: ms(60),
                                                resizeMode: 'contain',
                                            }}
                                        />
                                    </View>
                                    <View style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: IMAGE_SIZE * 0.3,
                                        backgroundColor: '#1EAE55',
                                        borderBottomLeftRadius: ms(10),
                                        borderBottomRightRadius: ms(10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingHorizontal: ms(5),
                                    }}>
                                        <Text
                                            style={{ fontSize: ms(8), fontWeight: '600', color: whiteColor }}
                                            numberOfLines={1}
                                        >
                                            Reports in {item.report_days}
                                        </Text>
                                    </View>
                                </View>

                                {/* Details */}
                                <View style={{ flex: 1, height: IMAGE_SIZE, justifyContent: 'space-between' }}>
                                    <View>
                                        <Text
                                            style={{ fontSize: ms(14), fontWeight: 'bold', color: '#000000', lineHeight: ms(18) }}
                                            numberOfLines={2}
                                        >
                                            {item.test_name}
                                        </Text>
                                        <Text
                                            style={{ fontSize: ms(11), color: '#666666', marginTop: vs(3) }}
                                            numberOfLines={2}
                                        >
                                            {item.covers}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(5) }}>
                                        <Text style={{ fontSize: ms(16), fontWeight: 'bold', color: '#000000' }}>
                                            ₹{item.price}
                                        </Text>
                                        {item.inCart ? (
                                            <View style={styles.removeButtonView}>
                                                <TouchableOpacity style={styles.removeButtonTouch}>
                                                    <Icon type={Icons.Feather} name="x" size={ms(16)} color="#FF725E" />
                                                    <Text style={styles.removeButtonText}>Remove</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <TouchableOpacity style={styles.addButton}>
                                                <Text style={styles.addButtonText}>ADD</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fullGradient: {
        flex: 1,
        paddingTop: ms(50),
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        paddingVertical: vs(12),
    },
    backButton: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    headerTitle: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: whiteColor,
    },

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(25),
        paddingHorizontal: ms(18),
        paddingVertical: vs(10),
        marginHorizontal: ms(15),
        marginBottom: vs(10),
    },
    searchInput: {
        flex: 1,
        fontSize: ms(16),
        color: '#000',
        paddingVertical: 0,
    },

    // Tabs
    tabsContainer: {
        marginHorizontal: ms(15),
        marginBottom: vs(15),
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        minHeight: vs(60),
        // borderBottomWidth:1
    },
    tabItem: {
        width: TAB_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: vs(12),
        borderRadius: ms(10),
    },
    tabItemActive: {
        backgroundColor: '#F3F4F6',
        borderBottomWidth: 3,
        borderBottomColor: primaryColor,
        // paddingVertical:ms(20),
    },
    tabLabel: {
        fontSize: ms(13),
        fontWeight: '600',
        color: '#666',
    },
    tabLabelActive: {
        color: blackColor,
        fontWeight: 'bold',
    },
    tabSub: {
        fontSize: ms(10),
        color: '#999',
        marginTop: vs(2),
    },
    tabSubActive: {
        color: '#666',
    },

    // Gender
    genderSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: ms(15),
        marginBottom: vs(20),
    },
    genderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(10),
        paddingHorizontal: ms(12),
        paddingVertical: vs(8),
    },
    genderImage: {
        width: ms(40),
        height: ms(40),
        marginRight: ms(8),
        borderRadius:ms(10)
    },
    genderLabel: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
        marginRight: ms(8),
    },

    // Sections
    sectionContainer: {
        paddingHorizontal: ms(15),
        marginBottom: vs(15),
    },
    sectionHeading: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: ms(12),
    },

    // Popular Packages Horizontal Cards
    packageCard: {
        width: ms(200),
        borderRadius: ms(15),
        padding: s(15),
        marginRight: ms(10),
    },
    packageName: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(8),
    },
    packageTests: {
        fontSize: ms(11),
        color: '#666',
        marginBottom: vs(15),
    },
    packagePriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: whiteColor,
        paddingHorizontal: s(10),
        paddingVertical: vs(2),
        borderRadius: ms(25),
        marginTop: vs(10),

    },
    priceContainer: {
        flex: 1,
    },
    originalPrice: {
        fontSize: ms(11),
        color: '#999',
        textDecorationLine: 'line-through',
        marginBottom: vs(2),
    },
    discountedPrice: {
        fontSize: ms(14),
        fontWeight: '700',
        color: blackColor,
    },
    arrowButton: {
        width: s(32),
        height: s(32),
        borderRadius: s(16),
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Profile List Cards
    cardContainer: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(15),
        flexDirection: 'row',
        alignItems: 'center',
        padding: ms(10),
        paddingVertical: vs(20),
        marginBottom: vs(10),
    },
    removeButtonView: {
        backgroundColor: '#FFF5F4',
        borderRadius: ms(20),
        paddingHorizontal: ms(15),
        paddingVertical: vs(5),
        justifyContent: 'center',
        marginLeft: ms(10),
    },
    removeButtonTouch: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        marginLeft: ms(5),
        fontSize: ms(12),
        fontWeight: '900',
        color: '#FF725E',
    },
    addButton: {
        backgroundColor: primaryColor,
        borderWidth: ms(1),
        borderColor: primaryColor,
        borderRadius: ms(20),
        paddingHorizontal: ms(18),
        paddingVertical: vs(6),
        justifyContent: 'center',
        marginLeft: ms(10),
    },
    addButtonText: {
        fontSize: ms(12),
        fontWeight: 'bold',
        color: whiteColor,
    },
});

export default CategoryBloodTest;
