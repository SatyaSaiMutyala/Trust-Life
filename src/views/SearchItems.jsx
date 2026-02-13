import { StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView, TextInput, FlatList, Image, ActivityIndicator, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { StatusBar } from '../components/StatusBar'
import Icon, { Icons } from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { blackColor, whiteColor, primaryColor } from '../utils/globalColors';
import { s, vs, ms } from 'react-native-size-matters';
import axios from 'axios';
import { api_url, BaseUrl } from '../config/Constants';
import axiosInstance from './AxiosInstance';
import LinearGradient from 'react-native-linear-gradient';

const IMAGE_SIZE = ms(80);

const SearchItems = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedOrgans, setSelectedOrgans] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cartData, setCartData] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [addingToCart, setAddingToCart] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const genderOptions = [
        { id: 1, name: 'Men', link: 'Male' },
        { id: 2, name: 'Women', link: 'Female' },
        { id: 3, name: 'Children', link: 'Male' }
    ];
    const serviceOptions = ['Home collection', 'Lab Test'];
    const organOptions = ['Heart', 'Liver', 'Joint Pain', 'Lungs'];

    useEffect(() => {
        handleGetCartData();
    }, []);

    useEffect(() => {
        if (search.length > 2) {
            const timer = setTimeout(() => {
                setCurrentPage(1);
                setHasMore(true);
                handleSearch(1, true);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
            setCurrentPage(1);
            setHasMore(true);
        }
    }, [search]);

    const handleSearch = async (page = 1, isNewSearch = false) => {
        if (isNewSearch) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const response = await axios.get(`${BaseUrl}search?typewords=${search}&page=${page}&per_page=20`);
            const newResults = response.data?.data || [];

            if (isNewSearch) {
                setSearchResults(newResults);
            } else {
                setSearchResults(prev => [...prev, ...newResults]);
            }

            // Check if there are more results
            if (newResults.length < 20) {
                setHasMore(false);
            }
        } catch (e) {
            console.log('Search Error:', e);
            if (isNewSearch) {
                setSearchResults([]);
            }
        } finally {
            if (isNewSearch) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    };

    const loadMoreResults = () => {
        if (!loadingMore && hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            handleSearch(nextPage, false);
        }
    };

    const handleGetCartData = async () => {
        try {
            if (!global.id) {
                console.warn('Global ID not set. Cannot fetch cart data.');
                return;
            }
            const response = await axios.get(`${api_url}customer/${global.id}/cart`);
            const items = response.data?.cart_items ?? [];
            setCartData(items);
            setCartCount(items.length);
        } catch (e) {
            console.log('ERROR OCCURED:', e);
        }
    };

    const handleDeleteCart = async (cartid) => {
        const ids = {
            customer_id: global.id,
            cart_id: cartid,
        };
        try {
            const response = await axiosInstance.post(`${api_url}customer/cart/delete`, ids);
            handleGetCartData();
        } catch (e) {
            console.log('Error Occured:', e);
        }
    };

    const add_to_cart = async (item_id, price, type) => {
        if (global.id == 0) {
            setShowLoginModal(true);
        } else {
            setAddingToCart(item_id);
            const cartPayload = {
                service_id: item_id,
                customer_id: global.id,
                price: price,
                service_type: type || 'Tests',
            };
            await addCartItem(cartPayload);
            setAddingToCart(null);
        }
    };

    const addCartItem = async (data) => {
        try {
            const response = await axiosInstance.post('/customer/cart', data);
            await handleGetCartData();
        } catch (e) {
            if (e.response) {
                console.log('Validation Error:', e.response.data);
            }
            console.log('ERROR OCCURRED:', e);
        }
    };

    const handleLoginNavigation = () => {
        setShowLoginModal(false);
        navigation.navigate('CheckPhone');
    };

    const handleBackButtonClick = () => {
        navigation.goBack()
    }

    const handleGenderClick = (gender) => {
        navigation.navigate('RelevanceDetails', { data: gender, name: gender.link });
    }

    const toggleService = (service) => {
        if (selectedServices.includes(service)) {
            setSelectedServices(selectedServices.filter(item => item !== service));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    }

    const toggleOrgan = (organ) => {
        if (selectedOrgans.includes(organ)) {
            setSelectedOrgans(selectedOrgans.filter(item => item !== organ));
        } else {
            setSelectedOrgans([...selectedOrgans, organ]);
        }
    }

    const renderSearchResultItem = ({ item }) => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("SelectedTest", {
                    data: item,
                    name: item.test_name,
                })
            }
            style={[
                styles.cardContainer,
                {
                    marginHorizontal: ms(15),
                    marginVertical: vs(8),
                    padding: ms(10),
                    paddingVertical: vs(20),
                }
            ]}
        >
            {/* Left Image and Tag Container */}
            <View style={{ marginRight: ms(15), position: 'relative' }}>
                <View
                    style={{
                        width: IMAGE_SIZE,
                        height: IMAGE_SIZE,
                        backgroundColor: '#EBFEFB',
                        borderRadius: ms(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <Image
                        source={require('../assets/img/cardImg.png')}
                        style={{
                            width: ms(60),
                            height: ms(60),
                            resizeMode: 'contain',
                        }}
                    />
                </View>

                {/* Reports Tag */}
                <View
                    style={{
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
                    }}
                >
                    <Text
                        style={{
                            fontSize: ms(8),
                            fontWeight: '600',
                            color: whiteColor
                        }}
                        numberOfLines={1}
                    >
                        Reports in {(item.report_tat || "").split("by")[0].trim()}
                    </Text>
                </View>
            </View>

            {/* Middle Details Container */}
            <View style={{ flex: 1, height: IMAGE_SIZE, justifyContent: 'space-between' }}>
                <View>
                    <Text
                        style={{
                            fontSize: ms(14),
                            fontWeight: 'bold',
                            color: '#000000',
                            lineHeight: ms(18),
                        }}
                        numberOfLines={2}
                    >
                        {item.test_name}
                    </Text>
                    <Text
                        style={{
                            fontSize: ms(11),
                            color: '#666666',
                            marginTop: vs(3)
                        }}
                        numberOfLines={1}
                    >
                        {item.sample_container}
                    </Text>
                </View>

                {/* Bottom Section: Price and Cart Button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(5) }}>
                    <Text style={{
                        fontSize: ms(16),
                        fontWeight: 'bold',
                        color: '#000000',
                    }}>
                        ₹{item.mrp}
                    </Text>
                    {
                        addingToCart === item.id ? (
                            <View style={styles.addButton}>
                                <ActivityIndicator size="small" color={primaryColor} />
                            </View>
                        ) : Array.isArray(cartData) && cartData.some(cartItem => cartItem.service_id === item.id) ? (
                            <View style={styles.removeButtonView}>
                                <TouchableOpacity
                                    style={styles.removeButtonTouch}
                                    onPress={() => {
                                        const matchedItem = cartData.find(cardItem => cardItem.service_id === item.id);
                                        handleDeleteCart(matchedItem?.id);
                                    }}>
                                    <Icon type={Icons.Feather} name='x' size={ms(16)} color='#FF725E' />
                                    <Text style={styles.removeButtonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => add_to_cart(item.id, item.mrp, 'Tests')}
                            >
                                <Text style={styles.addButtonText}>
                                    ADD
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            <View style={styles.fullGradient}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={handleBackButtonClick}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Search</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Icon type={Icons.Ionicons} name="search" color="#999" size={ms(20)} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search tests or packages"
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Show Search Results or Filters */}
                {search.length > 2 && searchResults.length > 0 ? (
                    <FlatList
                        data={searchResults}
                        renderItem={renderSearchResultItem}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        contentContainerStyle={[styles.content, { paddingBottom: cartCount > 0 ? vs(80) : vs(20) }]}
                        onEndReached={loadMoreResults}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            loadingMore ? (
                                <View style={styles.footerLoader}>
                                    <ActivityIndicator size="small" color={primaryColor} />
                                    <Text style={styles.loadingMoreText}>Loading more...</Text>
                                </View>
                            ) : null
                        }
                    />
                ) : search.length > 2 && searchResults.length === 0 && !loading ? (
                    <View style={styles.emptyContainer}>
                        <Icon
                            type={Icons.MaterialIcons}
                            name="search-off"
                            color="gray"
                            size={ms(80)}
                        />
                        <Text style={styles.emptyText}>
                            No results found
                        </Text>
                    </View>
                ) : loading ? (
                    <View style={styles.emptyContainer}>
                        <ActivityIndicator size="large" color={primaryColor} />
                        <Text style={styles.emptyText}>Searching...</Text>
                    </View>
                ) : (
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {/* Search with */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Search with</Text>
                            <View style={styles.chipContainer}>
                                {genderOptions.map((gender) => (
                                    <TouchableOpacity
                                        key={gender.id}
                                        style={styles.chip}
                                        onPress={() => handleGenderClick(gender)}
                                    >
                                        <Text style={styles.chipText}>
                                            {gender.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Available services */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Available services</Text>
                            <View style={styles.chipContainer}>
                                {serviceOptions.map((service) => (
                                    <TouchableOpacity
                                        key={service}
                                        style={[
                                            styles.chip,
                                            selectedServices.includes(service) && styles.chipSelected
                                        ]}
                                        onPress={() => toggleService(service)}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            selectedServices.includes(service) && styles.chipTextSelected
                                        ]}>
                                            {service}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Organs */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Organs</Text>
                            <View style={styles.chipContainer}>
                                {organOptions.map((organ) => (
                                    <TouchableOpacity
                                        key={organ}
                                        style={[
                                            styles.chip,
                                            selectedOrgans.includes(organ) && styles.chipSelected
                                        ]}
                                        onPress={() => toggleOrgan(organ)}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            selectedOrgans.includes(organ) && styles.chipTextSelected
                                        ]}>
                                            {organ}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                )}

                {/* Fixed Cart Bottom Bar */}
                {/* {cartCount > 0 && (
                    <View style={styles.cartBar}>
                        <Text style={styles.cartBarText}>
                            {cartCount === 1 ? '1 Test Added' : `${cartCount} Tests Added`}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('LabCart')}
                            style={styles.goToCartButton}
                        >
                            <Text style={styles.goToCartButtonText}>
                                Go to Cart
                            </Text>
                        </TouchableOpacity>
                    </View>
                )} */}

                {/* Login Modal */}
                <Modal
                    visible={showLoginModal}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setShowLoginModal(false)}
                >
                    <View style={loginStyles.modalOverlay}>
                        <View style={loginStyles.loginModal}>
                            <View style={loginStyles.iconContainer}>
                                <LinearGradient
                                    colors={['#FF6B6B', '#FF8E53']}
                                    style={loginStyles.iconGradient}
                                >
                                    <Icon
                                        type={Icons.MaterialIcons}
                                        name="lock-outline"
                                        color="#fff"
                                        size={ms(30)}
                                    />
                                </LinearGradient>
                            </View>

                            <Text style={loginStyles.modalTitle}>Login Required</Text>

                            <Text style={loginStyles.modalMessage}>
                                Please login to add items to your cart and continue with booking
                            </Text>

                            <TouchableOpacity
                                onPress={handleLoginNavigation}
                                style={loginStyles.okButton}
                            >
                                <View style={loginStyles.buttonGradient}>
                                    <Text style={loginStyles.buttonText}>Login Now</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setShowLoginModal(false)}
                                style={loginStyles.cancelButton}
                            >
                                <Text style={loginStyles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )
}
export default SearchItems;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    fullGradient: {
        flex: 1,
        paddingHorizontal: ms(15),
        paddingTop: ms(30),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(15),
        backgroundColor: whiteColor,
    },
    headerButton: {
        width: ms(38),
        height: ms(38),
        borderRadius: ms(19),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: ms(20),
        fontWeight: '600',
        color: blackColor,
        marginLeft: s(15),
    },
    scrollView: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: ms(12),
        paddingHorizontal: s(15),
        paddingVertical: vs(12),
        marginTop: vs(4),
        marginBottom: vs(20),
    },
    searchIcon: {
        marginRight: s(10),
    },
    searchInput: {
        flex: 1,
        fontSize: ms(14),
        color: blackColor,
        paddingVertical: 0,
    },
    section: {
        marginBottom: vs(25),
    },
    sectionTitle: {
        fontSize: ms(16),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(12),
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: s(10),
    },
    chip: {
        backgroundColor: '#F5F5F5',
        borderRadius: ms(20),
        paddingHorizontal: s(18),
        paddingVertical: vs(10),
        marginRight: s(8),
        marginBottom: vs(8),
    },
    chipSelected: {
        backgroundColor: '#0D8B7A',
    },
    chipText: {
        fontSize: ms(14),
        color: '#666',
        fontWeight: '500',
    },
    chipTextSelected: {
        color: whiteColor,
        fontWeight: '600',
    },
    // Card Styles
    cardContainer: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(15),
        flexDirection: 'row',
        alignItems: 'center',
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
        alignItems: 'center'
    },
    removeButtonText: {
        marginLeft: ms(5),
        fontSize: ms(12),
        fontWeight: '900',
        color: '#FF725E'
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
        color: whiteColor
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: vs(100),
    },
    emptyText: {
        fontSize: ms(14),
        color: "gray",
        marginTop: vs(10),
    },
    footerLoader: {
        paddingVertical: vs(20),
        alignItems: 'center',
    },
    loadingMoreText: {
        fontSize: ms(12),
        color: primaryColor,
        marginTop: vs(5),
    },
    content: {
        paddingTop: vs(10),
    },
    cartBar: {
        position: 'absolute',
        bottom: vs(25),
        left: ms(20),
        right: ms(20),
        backgroundColor: whiteColor,
        paddingVertical: vs(10),
        paddingHorizontal: ms(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: ms(1),
        borderTopColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: ms(-3) },
        shadowOpacity: 0.1,
        shadowRadius: ms(4),
        elevation: 10,
        borderRadius: ms(10)
    },
    cartBarText: {
        fontSize: ms(14),
        fontWeight: '600',
        color: '#000',
    },
    goToCartButton: {
        backgroundColor: primaryColor,
        borderRadius: ms(25),
        paddingVertical: vs(10),
        paddingHorizontal: ms(25),
    },
    goToCartButtonText: {
        color: whiteColor,
        fontSize: ms(14),
        fontWeight: 'bold',
    }
});

const loginStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: ms(20),
    },
    loginModal: {
        backgroundColor: '#fff',
        borderRadius: ms(20),
        padding: ms(20),
        width: '100%',
        maxWidth: ms(400),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: ms(10),
        },
        shadowOpacity: 0.3,
        shadowRadius: ms(20),
        elevation: 10,
    },
    iconContainer: {
        marginBottom: vs(15),
    },
    iconGradient: {
        width: ms(60),
        height: ms(60),
        borderRadius: ms(40),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF6B6B',
        shadowOffset: {
            width: 0,
            height: ms(5),
        },
        shadowOpacity: 0.3,
        shadowRadius: ms(10),
        elevation: 8,
    },
    modalTitle: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: vs(2),
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: ms(12),
        color: '#666',
        textAlign: 'center',
        marginBottom: vs(25),
        paddingHorizontal: ms(10),
    },
    okButton: {
        width: '100%',
        marginBottom: vs(12),
        borderRadius: ms(12),
        overflow: 'hidden',
        shadowColor: primaryColor,
        shadowOffset: {
            width: 0,
            height: ms(4),
        },
        shadowOpacity: 0.3,
        shadowRadius: ms(8),
        elevation: 6,
    },
    buttonGradient: {
        paddingVertical: vs(12),
        paddingHorizontal: ms(30),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: primaryColor
    },
    buttonText: {
        color: '#fff',
        fontSize: ms(14),
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    cancelButton: {
        paddingBottom: vs(8),
        paddingTop: ms(4),
        paddingHorizontal: ms(20),
    },
    cancelText: {
        color: '#999',
        fontSize: ms(15),
        fontWeight: '600',
    },
});
