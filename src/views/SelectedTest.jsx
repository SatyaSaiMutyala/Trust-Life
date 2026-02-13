import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, testTube, testTubeLab, secondBaseUrl, api_url, text, } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LoadLabCartItemsAction } from '../redux/actions/LabCartItemsActions';
import { AddToCartAction } from '../redux/actions/AddToCartActions';
import { DeleteCartItemAction } from '../redux/actions/DeleteCartItemActions';
import axios from 'axios';
import SelectedTestShimmer from '../components/SelectedTestShimmer';
import { connect } from 'react-redux';
import { updatePromo } from '../actions/LabOrderActions';
import { StatusBar } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';
import { Linking } from 'react-native';
import { Modal, Pressable } from 'react-native';
import { blackColor, globalGradient, grayColor, primaryColor, whiteColor } from '../utils/globalColors';
import { s, vs, ms } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const IMAGE_SIZE = ms(80);

// Static data
const suggestedBundles = [
    { id: 1, name: 'Heart', title: '3X Quarterly', save: '₹1200', desc: 'Lipid Profile, ECG, 2D Echo & Troponin tests together help assess heart health', image: require('../assets/img/cardImg.png') },
    { id: 2, name: 'Thyroid', title: '3X Quarterly', save: '₹1200', desc: 'Lipid Profile, ECG, 2D Echo & Troponin tests together help assess heart health', image: require('../assets/img/cardImg.png') },
    { id: 3, name: 'Joint Pain', title: '3X Quarterly', save: '₹1200', desc: 'Lipid Profile, ECG, 2D Echo & Troponin tests together help assess heart health', image: require('../assets/img/cardImg.png') },
];

const faqsData = [
    { id: 1, question: 'What is an FBS test?', answer: 'The Fasting Blood Sugar (FBS) test measures your blood glucose level after fasting to check for diabetes or prediabetes.' },
    { id: 2, question: 'Why is the FBS test done?', answer: 'The FBS test is done to diagnose diabetes, monitor blood sugar levels, and check for prediabetes.' },
    { id: 3, question: 'How should I prepare for the test?', answer: 'You should fast for 8-12 hours before the test. Only water is allowed during the fasting period.' },
    { id: 4, question: 'When is the best time to take this test?', answer: 'The best time is early morning after an overnight fast of 8-12 hours.' },
];

const packagesData = [
    { id: 1, name: 'Glucose Fasting and PP test', covers: 'Covers 5 Test : Diabetes', price: '20,400.00', report_days: '3 days' },
    { id: 2, name: 'Complete Blood Count', covers: 'Covers 3 Test : General', price: '15,200.00', report_days: '2 days' },
];

const SelectedTest = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const { data: labCartData, loading: cartLoading } = useSelector(state => state.lab_cart_items);
    const { loading: addToCartLoading } = useSelector(state => state.add_to_cart_item);
    const { loading: deleteCartLoading } = useSelector(state => state.delete_cart_item);

    const [loading, setLoading] = useState(false);
    const { data, name } = route.params;
    const [filteredList, setFilteredList] = useState([]);
    const [isType, setIsType] = useState();
    const [cartData, setCartData] = useState([]);
    const [countTest, setCountTest] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState(1);
    const [selectedBundles, setSelectedBundles] = useState([]);

    const insets = useSafeAreaInsets();
    const hasBottomOverlap = insets.bottom > 20;

    useEffect(() => {
        setLoading(true);
        handleGetCartData();
        setIsType(name);
        const list = data.parameters ? data.parameters.split(',').map(item => item.trim()) : [];
        setFilteredList(list);
        setCountTest(list.length);
    }, [data.parameters]);

    useEffect(() => {
        if (labCartData?.cart_items) {
            const items = labCartData.cart_items ?? [];
            setCartData(items);
            handlegetAllIds(items);
        }
    }, [labCartData]);

    const handleGetCartData = async () => {
        setLoading(true);
        try {
            await dispatch(LoadLabCartItemsAction(global.id));
            setLoading(false);
        } catch (e) {
            console.log('ERROR OCCURED 2 :', e);
            setLoading(false);
        }
    }

    const handlegetAllIds = (data) => {
        const extracted = data.map(item => ({
            serviceId: item.service_id,
        }));
    }

    const handleBackButtonClick = () => {
        navigation.goBack()
    }

    const addCartItem = async (serviceId, customerId, price, serviceType) => {
        try {
            setIsAdding(true);
            const optimisticItem = {
                id: Date.now(),
                service_id: serviceId,
                price: price,
                service_type: serviceType,
                customer_id: customerId
            };
            setCartData(prev => [...prev, optimisticItem]);
            const response = await dispatch(AddToCartAction(serviceId, customerId, price, serviceType));
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
            setCartData(prev => prev.filter(item => item.service_id !== serviceId));
        } finally {
            setIsAdding(false);
        }
    }

    const handleDeleteCart = async (cartid) => {
        let removedItem = null;
        try {
            setIsRemoving(true);
            setCartData(prev => {
                removedItem = prev.find(item => item.id === cartid);
                return prev.filter(item => item.id !== cartid);
            });
            await dispatch(DeleteCartItemAction(global.id, cartid));
        } catch (e) {
            if (removedItem) {
                setCartData(prev => [...prev, removedItem]);
            }
        } finally {
            setIsRemoving(false);
        }
    }

    const add_to_cart = async (item_id, price) => {
        if (global.id == 0) {
            setShowLoginModal(true);
        } else {
            await addCartItem(item_id, global.id, price, isType);
        }
    }

    const handleLoginNavigation = () => {
        setShowLoginModal(false);
        navigation.navigate('CheckPhone');
    };

    const navigateTocart = () => {
        navigation.navigate("LabCart")
    }

    const handleBookCall = () => {
        const phoneNumber = 7440075400;
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const toggleBundle = (id) => {
        setSelectedBundles(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        );
    };

    const isInCart = Array.isArray(cartData) && cartData.some(cartItem => cartItem.service_id === data.id);
    const cartCount = Array.isArray(cartData) ? cartData.length : 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            {loading ? (
                <SelectedTestShimmer />
            ) : (
                <LinearGradient
                    colors={globalGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 3 }}
                    locations={[0, 0.07]}
                    style={styles.fullGradient}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBackButtonClick} style={styles.backButton}>
                            <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Test Details</Text>
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={navigateTocart} style={styles.headerIcon}>
                                <Icon type={Icons.Ionicons} name="cart-outline" color={blackColor} size={ms(22)} />
                                {cartCount > 0 && (
                                    <View style={styles.cartBadge}>
                                        <Text style={styles.cartBadgeText}>{cartCount}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerIcon}>
                                <Icon type={Icons.Ionicons} name="share-social-outline" color={blackColor} size={ms(20)} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isInCart ? vs(100) : vs(30) }}>
                        {/* Address Bar */}
                        <TouchableOpacity style={styles.addressBar}>
                            <Text style={styles.addressText} numberOfLines={1}>
                                <Text style={styles.addressLabel}>Address : </Text>
                                {props.current_address || '9-5/5/9 Ameerpet, Hyderabad, Telangana,567899'}
                            </Text>
                            <Icon type={Icons.Ionicons} name="chevron-forward" color={blackColor} size={ms(14)} />
                        </TouchableOpacity>

                        {/* Test Name & Info */}
                        <View style={styles.contentCard}>
                            <Text style={styles.testName}>{data.test_name || 'Glycosylated Haemoglobin (GHb/HbA1c)'}</Text>
                            <Text style={styles.chosenText}>
                                Chosen by <Text style={{ color: primaryColor, fontWeight: 'bold' }}>500+</Text> user recently
                            </Text>

                            {/* Gender & Availability Row */}
                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <Icon type={Icons.FontAwesome5} name="male" color={blackColor} size={ms(16)} />
                                    <Text style={styles.infoText}>Male</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Icon type={Icons.FontAwesome5} name="female" color={blackColor} size={ms(16)} />
                                    <Text style={styles.infoText}>Female</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Icon type={Icons.Ionicons} name="home" color={blackColor} size={ms(16)} />
                                    <Text style={styles.infoText}>{data.home_collection == 'Y' ? 'Available' : 'Not Available'}</Text>
                                </View>
                            </View>

                            {/* Details List */}
                            <View style={styles.detailsList}>
                                <View style={styles.detailItem}>
                                    <Image source={require('../assets/img/ltube.png')} style={styles.detailIcon} />
                                    <Text style={styles.detailText}>{countTest < 10 ? `0${countTest}` : countTest} Tests Covers</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Image source={require('../assets/img/lreport.png')} style={styles.detailIcon} />
                                    <Text style={styles.detailText}>{data.report_tat || 'Reports in 3 Days by 9:00 PM'}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Icon type={Icons.MaterialCommunityIcons} name="clock-outline" color={primaryColor} size={ms(18)} />
                                    <Text style={[styles.detailText, { marginLeft: ms(10) }]}>
                                        <Text style={{ fontWeight: 'bold' }}>12 Hr</Text> Fasting Required
                                    </Text>
                                </View>
                            </View>

                            {/* Price & ADD */}
                            <View style={styles.priceRow}>
                                <View>
                                    <Text style={styles.price}>₹{data.mrp || 499}</Text>
                                    <Text style={styles.taxText}>Inclusive of all taxes</Text>
                                </View>
                                {isInCart ? (
                                    <View style={styles.removeButtonView}>
                                        <TouchableOpacity
                                            style={[styles.removeButtonTouch, { opacity: isRemoving ? 0.6 : 1 }]}
                                            onPress={() => {
                                                const matchedItem = cartData.find(cardItem => cardItem.service_id === data.id);
                                                handleDeleteCart(matchedItem?.id);
                                            }}
                                            disabled={isRemoving}
                                        >
                                            {isRemoving ? (
                                                <ActivityIndicator size="small" color='#FF725E' />
                                            ) : (
                                                <>
                                                    <Icon type={Icons.Feather} name='x' size={ms(16)} color='#FF725E' />
                                                    <Text style={styles.removeButtonText}>Remove</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={[styles.addButton, { opacity: isAdding ? 0.6 : 1 }]}
                                        onPress={() => add_to_cart(data.id, data.mrp)}
                                        disabled={isAdding}
                                    >
                                        {isAdding ? (
                                            <ActivityIndicator size="small" color={primaryColor} />
                                        ) : (
                                            <Text style={styles.addButtonText}>ADD</Text>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* About this Test */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About this Test</Text>
                            <Text style={styles.sectionDesc}>
                                {data.special_instructions || 'No fasting needed. Drink water, wear loose sleeves, continue regular medicines (unless doctor says otherwise). Inform us if on steroids/ Sit relaxed, our team will collect the sample safely at your home.'}
                            </Text>
                        </View>

                        {/* Tests Included */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Tests Included</Text>
                            {filteredList.slice(0, 3).map((param, index) => (
                                <View key={index} style={styles.testIncludedItem}>
                                    <Text style={styles.testIncludedText}>{param}</Text>
                                </View>
                            ))}
                            {filteredList.length > 3 && (
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Text style={styles.viewAllText}>View All ({countTest})</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Recommended By */}
                        <View style={styles.section}>
                            <View style={styles.doctorCard}>
                                <View style={{ flexDirection:'row'}}>
                            <Text style={{fontSize:ms(12), paddingVertical:ms(6), paddingHorizontal:ms(15), backgroundColor:whiteColor, marginBottom:ms(10), borderRadius:ms(20), fontWeight:'bold', color:blackColor}}>Recommended By</Text>
                                </View>
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Image
                                    source={require('../assets/img/dr.png')}
                                    style={styles.doctorImage}
                                />
                                <View style={styles.doctorInfo}>
                                    <Text style={styles.doctorName}>Dr.Sharath</Text>
                                    <Text style={styles.doctorSpeciality}>Specialists in blood Studies</Text>
                                </View>
                                </View>
                            </View>
                        </View>

                        {/* Tests Included in Packages */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Tests Included in Packages</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {packagesData.map((pkg) => (
                                    <TouchableOpacity key={pkg.id} activeOpacity={0.8} style={styles.packageCard}>
                                        <LinearGradient
                                            colors={['#DCE0FF', '#F9FAFB']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.packageCardGradient}
                                        >
                                            <View style={{ marginRight: ms(12), position: 'relative' }}>
                                                <View style={styles.packageImageBg}>
                                                    <Image
                                                        source={require('../assets/img/cardImg.png')}
                                                        style={styles.packageImage}
                                                    />
                                                </View>
                                                <View style={styles.packageBadge}>
                                                    <Text style={styles.packageBadgeText}>Reports in {pkg.report_days}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                                <View>
                                                    <Text style={styles.packageName} numberOfLines={1}>{pkg.name}</Text>
                                                    <Text style={styles.packageCovers}>{pkg.covers}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={styles.packagePrice}>₹{pkg.price}</Text>
                                                    <TouchableOpacity style={styles.packageAddBtn}>
                                                        <Text style={styles.packageAddText}>ADD</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Suggested Bundles */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Suggested Bundles</Text>
                            {suggestedBundles.map((bundle) => (
                                <TouchableOpacity
                                    key={bundle.id}
                                    style={styles.bundleCard}
                                    activeOpacity={0.8}
                                    onPress={() => toggleBundle(bundle.id)}
                                >
                                    <Image source={bundle.image} style={styles.bundleImage} />
                                    <View style={styles.bundleInfo}>
                                        <Text style={styles.bundleSave}>Save {bundle.save}</Text>
                                        <Text style={styles.bundleTitle}>{bundle.title}</Text>
                                        <Text style={styles.bundleDesc} numberOfLines={2}>{bundle.desc}</Text>
                                    </View>
                                    <View style={[styles.checkbox, selectedBundles.includes(bundle.id) && styles.checkboxSelected]}>
                                        {selectedBundles.includes(bundle.id) && (
                                            <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(14)} />
                                        )}
                                    </View>
                                    <Text style={styles.bundleOrganName}>{bundle.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* FAQs */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>FAQs</Text>
                            {faqsData.map((faq) => (
                                <View key={faq.id} style={styles.faqItem}>
                                    <TouchableOpacity
                                        style={styles.faqHeader}
                                        onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                    >
                                        <Text style={styles.faqQuestion}>{faq.question}</Text>
                                        <Icon
                                            type={Icons.Ionicons}
                                            name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                                            color={blackColor}
                                            size={ms(18)}
                                        />
                                    </TouchableOpacity>
                                    {expandedFaq === faq.id && (
                                        <Text style={styles.faqAnswer}>{faq.answer}</Text>
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Bottom Branding */}
                        <View style={styles.brandingSection}>
                            <Image source={text} resizeMode='contain' style={styles.brandingImage} />
                        </View>
                    </ScrollView>

                    {/* Bottom Cart Bar */}
                    {isInCart && (
                        <View style={[styles.bottomCartBar, { bottom: hasBottomOverlap ? insets.bottom + ms(10) : ms(20) }]}>
                            <View>
                                <Text style={styles.bottomPrice}>₹{data.mrp}</Text>
                                <Text style={styles.bottomTaxText}>Inclusive of all taxes</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('LabCart')}
                                style={styles.goToCartBtn}
                            >
                                <Text style={styles.goToCartText}>Go to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Tests Modal */}
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{countTest} Tests Included</Text>
                                    <Pressable onPress={() => setModalVisible(false)}>
                                        <Icon type={Icons.Ionicons} name="close-circle" style={{ fontSize: ms(25), color: primaryColor }} />
                                    </Pressable>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {filteredList.map((parameter, index) => (
                                        <View key={index} style={styles.modalItem}>
                                            <Image
                                                source={require('../assets/img/tube.png')}
                                                style={{ width: ms(25), height: ms(25), marginRight: ms(10) }}
                                            />
                                            <Text style={styles.modalItemText}>{parameter}</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>

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
                                        <Icon type={Icons.Ionicons} name="lock-closed" size={ms(35)} color="#fff" />
                                    </LinearGradient>
                                </View>
                                <Text style={loginStyles.modalTitle}>Login Required</Text>
                                <Text style={loginStyles.modalMessage}>
                                    Please login to add items to your cart and continue with booking
                                </Text>
                                <TouchableOpacity
                                    style={loginStyles.okButton}
                                    onPress={handleLoginNavigation}
                                    activeOpacity={0.8}
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
                </LinearGradient>
            )}
        </SafeAreaView>
    )
}

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
        paddingBottom: vs(12),
    },
    backButton: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: whiteColor,
        marginLeft: ms(12),
        flex: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(12),
    },
    headerIcon: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadge: {
        position: 'absolute',
        top: -vs(5),
        right: -s(8),
        backgroundColor: '#FF3B30',
        borderRadius: ms(10),
        width: ms(18),
        height: ms(18),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: whiteColor,
        fontSize: ms(10),
        fontWeight: 'bold',
    },

    // Address Bar
    addressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        marginHorizontal: ms(15),
        paddingHorizontal: ms(15),
        paddingVertical: vs(10),
        borderRadius: ms(8),
        marginBottom: vs(5),
    },
    addressText: {
        flex: 1,
        fontSize: ms(12),
        color: blackColor,
    },
    addressLabel: {
        fontWeight: 'bold',
        color: blackColor,
    },

    // Content Card
    contentCard: {
        backgroundColor: whiteColor,
        marginHorizontal: ms(15),
        borderRadius: ms(15),
        padding: ms(15),
        marginTop: vs(10),
    },
    testName: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(5),
    },
    chosenText: {
        fontSize: ms(12),
        color: '#666',
        marginBottom: vs(15),
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(15),
        gap: s(20),
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(6),
    },
    infoText: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
    },
    detailsList: {
        marginBottom: vs(15),
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(8),
        paddingHorizontal: ms(10),
        backgroundColor: '#F9FAFB',
        borderRadius: ms(8),
        marginBottom: vs(8),
    },
    detailIcon: {
        width: ms(18),
        height: ms(18),
        marginRight: ms(10),
    },
    detailText: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: ms(20),
        fontWeight: 'bold',
        color: blackColor,
    },
    taxText: {
        fontSize: ms(12),
        color: '#666',
        marginTop: vs(2),
    },
    removeButtonView: {
        backgroundColor: '#FFF5F4',
        borderRadius: ms(20),
        paddingHorizontal: ms(20),
        paddingVertical: vs(8),
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: ms(4) },
        shadowOpacity: 0.1,
        shadowRadius: ms(4),
        elevation: 1,
    },
    removeButtonTouch: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        marginLeft: ms(8),
        fontSize: ms(13),
        fontWeight: '900',
        color: '#FF725E',
    },
    addButton: {
        backgroundColor: primaryColor,
        borderRadius: ms(20),
        paddingHorizontal: ms(25),
        paddingVertical: vs(8),
        justifyContent: 'center',
    },
    addButtonText: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: whiteColor,
    },

    // Sections
    section: {
        paddingHorizontal: ms(15),
        marginTop: vs(10),
    },
    sectionTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(10),
    },
    sectionDesc: {
        fontSize: ms(13),
        color: '#666',
        lineHeight: ms(20),
    },

    // Tests Included
    testIncludedItem: {
        backgroundColor: '#F9FAFB',
        paddingHorizontal: ms(15),
        paddingVertical: vs(12),
        borderRadius: ms(10),
        marginBottom: vs(8),
    },
    testIncludedText: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
    },
    viewAllText: {
        fontSize: ms(13),
        color: primaryColor,
        fontWeight: 'bold',
        marginTop: vs(5),
    },

    // Doctor Card
    doctorCard: {
        // flexDirection: 'row',
        // alignItems: 'center',
        backgroundColor: '#FFEDD5',
        borderRadius: ms(12),
        padding: ms(12),
        overflow: 'hidden',
    },
    // doctorCardBorder: {
    //     position: 'absolute',
    //     left: 0,
    //     top: 0,
    //     bottom: 0,
    //     width: ms(4),
    //     backgroundColor: '#FFEDD5',
    //     borderTopLeftRadius: ms(12),
    //     borderBottomLeftRadius: ms(12),
    // },
    doctorImage: {
        width: ms(50),
        height: ms(50),
        borderRadius:ms(10),
        marginRight: ms(12),
    },
    doctorInfo: {
        flex: 1,
    },
    doctorName: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
    },
    doctorSpeciality: {
        fontSize: ms(12),
        color: '#666',
        marginTop: vs(2),
    },

    // Package Cards
    packageCard: {
        marginRight: ms(12),
        width: ms(280),
        borderRadius: ms(15),
    },
    packageCardGradient: {
        flexDirection: 'row',
        borderRadius: ms(15),
        padding: ms(10),
        overflow: 'hidden',
    },
    packageImageBg: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        backgroundColor: '#EBFEFB',
        borderRadius: ms(10),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    packageImage: {
        width: ms(55),
        height: ms(55),
        resizeMode: 'contain',
    },
    packageBadge: {
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
    },
    packageBadgeText: {
        fontSize: ms(8),
        fontWeight: '600',
        color: whiteColor,
    },
    packageName: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
        marginTop:ms(10)
    },
    packageCovers: {
        fontSize: ms(11),
        color: '#666',
        marginTop: vs(3),
    },
    packagePrice: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
    },
    packageAddBtn: {
        borderWidth: 1,
        borderColor: primaryColor,
        borderRadius: ms(15),
        paddingHorizontal: ms(15),
        paddingVertical: vs(4),
    },
    packageAddText: {
        fontSize: ms(12),
        fontWeight: 'bold',
        color: primaryColor,
    },

    // Bundle Cards
    bundleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: grayColor,
        borderRadius: ms(12),
        padding: ms(12),
        marginBottom: vs(10),

    },
    bundleImage: {
        width: ms(45),
        height: ms(45),
        resizeMode: 'contain',
        marginRight: ms(12),
    },
    bundleInfo: {
        flex: 1,
    },
    bundleSave: {
        fontSize: ms(11),
        color: '#3B82F6',
        fontWeight: 'bold',
    },
    bundleTitle: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: blackColor,
        marginTop: vs(2),
    },
    bundleDesc: {
        fontSize: ms(11),
        color: '#666',
        marginTop: vs(3),
        lineHeight: ms(16),
    },
    bundleOrganName: {
        position: 'absolute',
        bottom: ms(12),
        left: ms(17),
        fontSize: ms(9),
        color: blackColor,
        fontWeight: '600',
        textAlign: 'center',
    },
    checkbox: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(4),
        borderWidth: ms(1),
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: ms(10),
    },
    checkboxSelected: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },

    // FAQs
    faqItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingVertical: vs(12),
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
        flex: 1,
        marginRight: ms(10),
    },
    faqAnswer: {
        fontSize: ms(13),
        color: '#666',
        lineHeight: ms(20),
        marginTop: vs(8),
    },

    // Bottom Cart Bar
    bottomCartBar: {
        position: 'absolute',
        left: ms(20),
        right: ms(20),
        backgroundColor: whiteColor,
        paddingVertical: vs(12),
        paddingHorizontal: ms(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: ms(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -ms(3) },
        shadowOpacity: 0.1,
        shadowRadius: ms(4),
        elevation: 10,
    },
    bottomPrice: {
        fontSize: ms(16),
        fontWeight: '600',
        color: blackColor,
    },
    bottomTaxText: {
        fontSize: ms(12),
        color: '#666',
        marginTop: vs(2),
    },
    goToCartBtn: {
        backgroundColor: primaryColor,
        borderRadius: ms(25),
        paddingVertical: vs(10),
        paddingHorizontal: ms(25),
    },
    goToCartText: {
        color: whiteColor,
        fontSize: ms(15),
        fontWeight: 'bold',
    },

    // Branding
    brandingSection: {
        paddingHorizontal: ms(20),
        marginTop: vs(20),
    },
    brandingImage: {
        width: '100%',
        height: vs(120),
    },

    // Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: whiteColor,
        borderTopLeftRadius: ms(20),
        borderTopRightRadius: ms(20),
        maxHeight: '70%',
        padding: ms(20),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(15),
    },
    modalTitle: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: blackColor,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: ms(12),
        borderRadius: ms(10),
        marginBottom: vs(10),
    },
    modalItemText: {
        color: blackColor,
        fontSize: ms(14),
        fontWeight: '500',
    },
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
        shadowOffset: { width: 0, height: ms(10) },
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
        shadowOffset: { width: 0, height: ms(5) },
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
        shadowOffset: { width: 0, height: ms(4) },
        shadowOpacity: 0.3,
        shadowRadius: ms(8),
        elevation: 6,
    },
    buttonGradient: {
        paddingVertical: vs(12),
        paddingHorizontal: ms(30),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: primaryColor,
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

function mapStateToProps(state) {
    return {
        promo: state.lab_order.promo,
        sub_total: state.lab_order.sub_total,
        cart_items: state.lab_order.cart_items,
        total: state.lab_order.total,
        current_lab_id: state.lab_order.current_lab_id,
        lab_id: state.lab_order.lab_id,
        current_address: state.current_location.current_address,
    };
}

const mapDispatchToProps = (dispatch) => ({
    updateLabPromo: (data) => dispatch(updateLabPromo(data)),
    updateLabAddToCart: (data) => dispatch(updateLabAddToCart(data)),
    updateLabSubTotal: (data) => dispatch(updateLabSubTotal(data)),
    updateLabCalculateTotal: (data) => dispatch(updateLabCalculateTotal(data)),
    updateLabTotal: (data) => dispatch(updateLabTotal(data)),
    updateLabId: (data) => dispatch(updateLabId(data)),
    updateCurrentLabId: (data) => dispatch(updateCurrentLabId(data)),
    labReset: () => dispatch(labReset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedTest);
