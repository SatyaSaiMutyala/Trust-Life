


import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Dimensions,
    Image,
    Alert,
    Modal,
    Pressable
} from "react-native";
import * as colors from '../assets/css/Colors';
import { StatusBar, StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import TestListShimmer, { FooterShimmer } from "../components/TestListShimmer";
import { globalGradient, primaryColor, whiteColor } from "../utils/globalColors";
import LinearGradient from "react-native-linear-gradient";
import { LoadRelevanceDataAction } from '../redux/actions/RelevanceDataActions';
import { AddToCartAction } from '../redux/actions/AddToCartActions';
import { LoadLabCartItemsAction } from '../redux/actions/LabCartItemsActions';
import { DeleteCartItemAction } from '../redux/actions/DeleteCartItemActions';
const { width, height } = Dimensions.get('window');
import { vs, ms } from 'react-native-size-matters';

const RelevanceDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { data, name } = route.params;
    const dispatch = useDispatch();

    // Redux selectors
    const { data: relevanceData, loading: relevanceLoading } = useSelector(state => state.relevance_data);
    const { data: labCartData, loading: cartLoading } = useSelector(state => state.lab_cart_items);
    const { loading: addToCartLoading } = useSelector(state => state.add_to_cart_item);
    const { loading: deleteCartLoading } = useSelector(state => state.delete_cart_item);

    const [type, setType] = useState(name);
    const [search, setSearch] = useState('');
    const [getData, setGetData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [fetchingNextPage, setFetchingNextPage] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Only block UI for INITIAL load, not pagination
    const loading = (relevanceLoading || cartLoading) && isInitialLoad;
    const [cartData, setCartData] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [addingItemIds, setAddingItemIds] = useState(new Set()); // Track items being added
    const [removingItemIds, setRemovingItemIds] = useState(new Set()); // Track items being removed

    // Responsive dimensions using size-matters
    const CARD_MARGIN = ms(15); // Used ms for horizontal margin
    const CARD_PADDING = ms(10);
    const IMAGE_SIZE = ms(80); // Adjusted to be fixed based on the visual design estimate

    const getEndpoint = () => {
        console.log('this is the name im getting form the before screen ---------->', type);
        switch (type) {
            case 'Packages': return 'packages';
            case 'Profiles': return 'profiles';
            case 'Tests': return 'testsList';
            case 'Male': return 'gender/male';
            case 'Female': return 'gender/female';
            case 'VitaminD': return 'vitamins?vitaminD';
            case 'VitaminB9': return 'vitamins?vitaminB9';
            case 'VitaminB12': return 'vitamins?vitaminB12';
            case 'VitaminA': return 'vitamins?vitaminA';
            case 'VitaminK': return 'vitamins?vitaminK';
            case 'VitaminC': return 'vitamins?vitaminC';
            default: return 'profiles';
        }
    };

    const fetchData = async (loadMore = false) => {
        if (relevanceLoading || fetchingNextPage || (loadMore && !hasMore)) return;

        if (loadMore) setFetchingNextPage(true);

        try {
            const endpoint = getEndpoint();
            console.log('this is endpoint man ----------->', endpoint);
            const response = await dispatch(LoadRelevanceDataAction(endpoint, page));
            const result = response.data || [];

            setGetData(prev => [...prev, ...result]);
            setPage(prev => prev + 1);

            // Disable pagination if we got less than 10 records
            if (result.length === 0 || result.length < 10) {
                setHasMore(false);
            }

            // Mark initial load as complete
            if (!loadMore && isInitialLoad) {
                setIsInitialLoad(false);
            }
        } catch (e) {
            console.log("Error fetching data:", e);
        } finally {
            if (loadMore) setFetchingNextPage(false);
        }
    };

    useEffect(() => {
        console.log('--------------> this is RelevanceDetails Screen');
        // Reset for new type load
        setIsInitialLoad(true);
        setGetData([]);
        setPage(1);
        setHasMore(true);

        fetchData();
        handleGetCartData();
    }, [type]);

    // Auto-sync cart data from Redux
    useEffect(() => {
        if (labCartData.cart_items) {
            const items = labCartData.cart_items ?? [];
            setCartData(items);
            setCartCount(items.length);
        }
    }, [labCartData]);

    // Refresh cart data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            handleGetCartData();
        }, [])
    );

    const handleBackButtonClick = () => navigation.goBack();

    const dataToRender = type === 'Relevance'
        ? Array.isArray(data?.profiles) ? data.profiles : []
        : getData;

    const filteredData = dataToRender.filter(item =>
        item.test_name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleGetCartData = async () => {
        try {
            // Check if global.id is set before making the API call
            if (!global.id) {
                console.warn('Global ID not set. Cannot fetch cart data.');
                return;
            }
            await dispatch(LoadLabCartItemsAction(global.id));
            const items = labCartData.cart_items ?? [];
            setCartData(items);
            const count = items.length;
            setCartCount(count);
        } catch (e) {
            console.log('ERROR OCCURED 2 :', e);
        }
    }


    const handleDeleteCart = async (cartid, serviceId) => {
        // Store the removed item in case we need to revert
        let removedItem = null;

        try {
            // Add to removing set
            setRemovingItemIds(prev => new Set([...prev, serviceId]));

            // Store the item before removing (for revert)
            setCartData(prev => {
                removedItem = prev.find(item => item.id === cartid);
                return prev.filter(item => item.id !== cartid);
            });
            setCartCount(prev => Math.max(0, prev - 1));

            // Call API
            await dispatch(DeleteCartItemAction(global.id, cartid));
        } catch (e) {
            console.log('Error Occured :', e);
            // Revert on error - add the item back
            if (removedItem) {
                setCartData(prev => [...prev, removedItem]);
                setCartCount(prev => prev + 1);
            }
        } finally {
            // Remove from removing set
            setRemovingItemIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(serviceId);
                return newSet;
            });
        }
    }


    const add_to_cart = async (item_id, price) => {
        if (global.id == 0) {
            setShowLoginModal(true);
        } else {
            await addCartItem(item_id, global.id, price, type);
        }
    }

    const handleLoginNavigation = () => {
        setShowLoginModal(false);
        navigation.navigate('CheckPhone');
    };


    const addCartItem = async (serviceId, customerId, price, serviceType) => {
        try {
            // Add to adding set
            setAddingItemIds(prev => new Set([...prev, serviceId]));

            // Optimistically add to cart
            const optimisticItem = {
                id: Date.now(), // temporary ID
                service_id: serviceId,
                price: price,
                service_type: serviceType,
                customer_id: customerId
            };
            setCartData(prev => [...prev, optimisticItem]);
            setCartCount(prev => prev + 1);

            // Call API
            const response = await dispatch(AddToCartAction(serviceId, customerId, price, serviceType));

            // Update the optimistic item with real ID from response
            if (response?.data?.cart_item_id) {
                setCartData(prev => prev.map(item =>
                    item.service_id === serviceId && item.id === optimisticItem.id
                        ? { ...item, id: response.data.cart_item_id }
                        : item
                ));
            }
        } catch (e) {
            if (e.response) {
                console.log('Validation Error:', e.response.data);
            }
            console.log('ERROR OCCURRED:', e);
            // Revert on error
            setCartData(prev => prev.filter(item => item.service_id !== serviceId));
            setCartCount(prev => Math.max(0, prev - 1));
        } finally {
            // Remove from adding set
            setAddingItemIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(serviceId);
                return newSet;
            });
        }
    }


    const renderItem = ({ item }) => (
        <TouchableOpacity
            // Full card container style
            onPress={() =>
                navigation.navigate("SelectedTest", {
                    data: item,
                    name: type === 'Relevance' ? data.relevance_name : item.test_name,
                })
            }
            style={[
                styles.cardContainer,
                {
                    marginHorizontal: ms(15),
                    marginVertical: vs(8),
                    padding: ms(10), // Use ms for padding
                    paddingVertical: vs(20), // Use vs for vertical padding
                }
            ]}
        >
            {/* 1. Left Image and Tag Container */}
            <View style={{ marginRight: ms(15), position: 'relative' }}>

                {/* Image Background Circle/Square (Light Purple/Blue) */}
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
                        source={require('../assets/img/cardImg.png')} // Replace with actual image source or conditional logic
                        style={{
                            width: ms(60), // Responsive image size
                            height: ms(60), // Responsive image size
                            resizeMode: 'contain',
                        }}
                    />
                </View>

                {/* "Reports in X days" Tag (Absolute positioning) */}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: IMAGE_SIZE * 0.3, // Calculated relative to IMAGE_SIZE
                        backgroundColor: '#1EAE55', // Green color
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

            {/* 2. Middle Details Container (Test Name, Covers, Price) */}
            <View style={{ flex: 1, height: IMAGE_SIZE, justifyContent: 'space-between' }}>

                {/* Top Section: Name and Covers */}
                <View>
                    <Text
                        style={{
                            fontSize: ms(14), // Responsive font size
                            fontWeight: 'bold',
                            color: '#000000',
                            lineHeight: ms(18), // Responsive line height
                        }}
                        numberOfLines={2}
                    >
                        {item.test_name}
                    </Text>
                    {/* Placeholder for 'Covers 1 Test' or similar */}
                    <Text
                        style={{
                            fontSize: ms(11), // Responsive font size
                            color: '#666666',
                            marginTop: vs(3) // Responsive margin
                        }}
                        numberOfLines={1}
                    >
                        {item.sample_container}
                    </Text>
                </View>

                {/* Bottom Section: Price and Cart Button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(5) }}>

                    {/* Price (Left side) */}
                    <Text style={{
                        fontSize: ms(16),
                        fontWeight: 'bold',
                        color: '#000000',
                    }}>
                        ₹{item.mrp}
                    </Text>
                    {
                        (() => {
                            const isInCart = Array.isArray(cartData) && cartData.some(cartItem => cartItem.service_id === item.id);
                            const isAdding = addingItemIds.has(item.id);
                            const isRemoving = removingItemIds.has(item.id);
                            const isLoading = isAdding || isRemoving;

                            if (isInCart || isAdding) {
                                return (
                                    <View style={styles.removeButtonView}>
                                        <TouchableOpacity
                                            style={[styles.removeButtonTouch, isLoading && { opacity: 0.6 }]}
                                            onPress={() => {
                                                if (!isLoading) {
                                                    const matchedItem = cartData.find(cardItem => cardItem.service_id === item.id);
                                                    handleDeleteCart(matchedItem?.id, item.id);
                                                }
                                            }}
                                            disabled={isLoading}
                                        >
                                            {isRemoving ? (
                                                <ActivityIndicator size="small" color="#FF725E" />
                                            ) : (
                                                <>
                                                    <Icon type={Icons.Feather} name='x' size={ms(16)} color='#FF725E' />
                                                    <Text style={styles.removeButtonText}>Remove</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                );
                            } else {
                                return (
                                    <TouchableOpacity
                                        style={[styles.addButton, isLoading && { opacity: 0.6 }]}
                                        onPress={() => !isLoading && add_to_cart(item.id, item.mrp)}
                                        disabled={isLoading}
                                    >
                                        {isAdding ? (
                                            <ActivityIndicator size="small" color={primaryColor} />
                                        ) : (
                                            <Text style={styles.addButtonText}>ADD</Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            }
                        })()
                    }
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.fullGradient}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleBackButtonClick}
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
                    <View style={{ width: '80%' }}>
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            {type === 'Relevance'
                                ? data.relevance_name
                                : type === 'Male'
                                    ? 'Men'
                                    : type === 'Female'
                                        ? 'Women'
                                        : name.replace(/([A-Z])/g, ' $1').trim()}
                        </Text>
                    </View>
                </View>
                {/* Search Input */}
                <TouchableOpacity
                    style={styles.searchContainer}
                    onPress={() => navigation.navigate('SearchItems')}
                    activeOpacity={1}
                >
                    <Icon type={Icons.Feather} name="search" color="#999" size={ms(20)} style={{ marginRight: ms(4) }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        // value={search}
                        // onChangeText={setSearch}
                        placeholderTextColor="#999"
                        editable={false}
                        pointerEvents="none"
                    />
                </TouchableOpacity>

                {/* Shimmer Loading */}
                {loading ? (
                    <TestListShimmer />
                ) : filteredData.length > 0 ? (
                    <FlatList
                        data={filteredData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={[styles.content, { paddingBottom: cartCount > 0 ? vs(80) : vs(20) }]}
                        onEndReachedThreshold={0.1}
                        onEndReached={() => {
                            // Only paginate if initial load is complete and we have 10+ records
                            if (!isInitialLoad && !loading && !fetchingNextPage && hasMore && filteredData.length >= 10) {
                                fetchData(true);
                            }
                        }}
                        ListFooterComponent={
                            fetchingNextPage ? <FooterShimmer /> : null
                        }
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Icon
                            type={Icons.MaterialIcons}
                            name="search-off"
                            color="gray"
                            size={ms(80)}
                        />
                        <Text style={styles.emptyText}>
                            No Data available
                        </Text>
                    </View>
                )}
                {/* Fixed Cart Bottom Bar */}
                {cartCount > 0 && (
                    <View style={styles.cartBar}>
                        {/* Left: Text */}
                        <Text style={styles.cartBarText}>
                            {cartCount === 1 ? '1 Test Added' : `${cartCount} Tests Added`}
                        </Text>

                        {/* Right: Button */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('LabCart')}
                            style={styles.goToCartButton}
                        >
                            <Text style={styles.goToCartButtonText}>
                                Go to Cart
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Login Modal */}
                <Modal
                    visible={showLoginModal}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setShowLoginModal(false)}
                >
                    <View style={loginStyles.modalOverlay}>
                        <View style={loginStyles.loginModal}>
                            {/* Icon Container */}
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

                            {/* Title */}
                            <Text style={loginStyles.modalTitle}>Login Required</Text>

                            {/* Message */}
                            <Text style={loginStyles.modalMessage}>
                                Please login to add items to your cart and continue with booking
                            </Text>

                            {/* Button */}
                            <TouchableOpacity
                                onPress={handleLoginNavigation}
                                style={loginStyles.okButton}
                            >
                                <View style={loginStyles.buttonGradient}>
                                    <Text style={loginStyles.buttonText}>Login Now</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Cancel Button */}
                            <TouchableOpacity
                                onPress={() => setShowLoginModal(false)}
                                style={loginStyles.cancelButton}
                            >
                                <Text style={loginStyles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
        paddingTop: vs(50),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingBottom: vs(5),
    },
    backButton: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: ms(10),
    },
    headerTitle: {
        color: whiteColor,
        fontSize: ms(20),
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(25),
        paddingHorizontal: ms(18),
        paddingVertical: vs(10),
        marginHorizontal: ms(15),
        marginVertical: vs(10),
    },
    searchInput: {
        flex: 1,
        fontSize: ms(16),
        color: '#000',
        paddingVertical: 0,
    },
    content: {
        // paddingTop: vs(10), // Removed as flatlist content container handles padding
    },
    // --- Card Styles ---
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

    // --- Empty and Loading Styles ---
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
    },

    // --- Cart Bar Styles ---
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

export default RelevanceDetailsScreen;
