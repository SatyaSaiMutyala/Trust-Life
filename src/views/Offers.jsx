import { StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView, TextInput, Modal, ActivityIndicator, FlatList } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { StatusBar, StatusBar2 } from '../components/StatusBar'
import { api_url, bold } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { blackColor, whiteColor } from '../utils/globalColors';
import { s, vs, ms } from 'react-native-size-matters';
import Clipboard from '@react-native-clipboard/clipboard';
import axios from 'axios';
import OffersShimmer from '../components/OffersShimmer';

const Offers = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Static terms and conditions
    const staticTerms = [
        "This offer is valid for a limited period only.",
        "The discount cannot be combined with other offers or promotions.",
        "Promo code must be applied at checkout to avail the discount.",
        "Discount applies on the test/package price only.",
        "TRUSTlab reserves the right to modify or cancel the offer at any time.",
        "Terms and conditions apply."
    ];

    useFocusEffect(
        useCallback(() => {
            setCurrentPage(1);
            fetchOffers(1, searchQuery);
        }, [])
    );

    // Backend search with debouncing
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            setCurrentPage(1);
            fetchOffers(1, searchQuery);
        }, 500); // 500ms debounce

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    const fetchOffers = async (page = 1, search = '', isLoadMore = false) => {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await axios.get(`${api_url}get-coupons`, {
                params: {
                    page: page,
                    per_page: 10,
                    search: search
                }
            });
            console.log('Offers API Response:', response.data);

            if (response.data.status && response.data.data) {
                if (isLoadMore) {
                    // Append new data for load more
                    setOffers(prevOffers => [...prevOffers, ...response.data.data]);
                } else {
                    // Replace data for initial load or search
                    setOffers(response.data.data);
                }

                // Update pagination metadata
                setCurrentPage(response.data.current_page);
                setLastPage(response.data.last_page);
            }
        } catch (error) {
            console.log('Error fetching offers:', error);
        } finally {
            if (isLoadMore) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    const getDiscountText = (offer) => {
        const amount = parseFloat(offer.amount);
        if (offer.type === 'discount') {
            return `Flat ${Math.floor(amount)}% OFF`;
        } else if (offer.type === 'fixed') {
            return `Flat ₹${Math.floor(amount)} OFF`;
        } else {
            return `₹${Math.floor(amount)} OFF`;
        }
    };

    const handleBackButtonClick = () => {
        navigation.goBack()
    }

    const handleOfferClick = (offer) => {
        setSelectedOffer(offer);
        setModalVisible(true);
    }

    const copyToClipboard = (code) => {
        Clipboard.setString(code);
        console.log('Copied code:', code);
    }

    const handleLoadMore = () => {
        if (!loadingMore && currentPage < lastPage) {
            fetchOffers(currentPage + 1, searchQuery, true);
        }
    }

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
                    <Text style={styles.headerTitle}>Offers</Text>
                </View>

                {loading ? (
                    <OffersShimmer />
                ) : (
                    <FlatList
                        ListHeaderComponent={
                            <View style={styles.searchContainer}>
                                <Icon type={Icons.Ionicons} name="search" color="#999" size={ms(20)} style={styles.searchIcon} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search for offers"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        }
                        data={offers}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item: offer }) => (
                            <TouchableOpacity onPress={() => handleOfferClick(offer)}>
                                <View style={styles.offerCard}>
                                    {/* Discount Badge and Package Type */}
                                    <View style={styles.cardHeader}>
                                        <View style={styles.discountBadge}>
                                            <Text style={styles.discountText}>{getDiscountText(offer)}</Text>
                                        </View>
                                        <Text style={styles.packageType}>{offer.type ? offer.type.toUpperCase() : 'OFFER'}</Text>
                                    </View>

                                    {/* Offer Title */}
                                    <Text numberOfLines={2} ellipsizeMode='tail' style={styles.offerTitle}>{offer.title}</Text>

                                    {/* Description */}
                                    {offer.description && (
                                        <Text numberOfLines={1} style={styles.descriptionText}>{offer.description}</Text>
                                    )}

                                    {/* Valid Till */}
                                    <Text style={styles.validText}>Valid till {formatDate(offer.expire_date)}</Text>

                                    {/* Terms and Conditions Link */}
                                    <TouchableOpacity>
                                        <Text style={styles.termsLink}>Terms and conditions</Text>
                                    </TouchableOpacity>

                                    {/* Promo Code Section */}
                                    <View style={styles.promoCodeContainer}>
                                        <Text style={styles.promoCodeLabel}>Use code: <Text style={styles.promoCode}>{offer.coupon_code}</Text></Text>
                                        <TouchableOpacity onPress={() => copyToClipboard(offer.coupon_code)}>
                                            <Icon type={Icons.Ionicons} name="copy-outline" color={blackColor} size={ms(18)} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Icon type={Icons.Ionicons} name="pricetag-outline" color="#999" size={ms(50)} />
                                <Text style={styles.emptyText}>No offers available</Text>
                            </View>
                        }
                        ListFooterComponent={
                            loadingMore && (
                                <View style={styles.loadingMoreContainer}>
                                    <ActivityIndicator size="small" color="#0D8B7A" />
                                </View>
                            )
                        }
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContent}
                    />
                )}
            </View>

            {/* Bottom Sheet Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        activeOpacity={1}
                        onPress={() => setModalVisible(false)}
                    />
                    <View style={styles.modalContent}>
                        {selectedOffer && (
                            <>
                                {/* Modal Header */}
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalHandle} />
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Icon type={Icons.Ionicons} name="close" color={blackColor} size={ms(24)} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView showsVerticalScrollIndicator={true} style={styles.modalScrollView}>
                                    {/* Discount Badge */}
                                    <View style={styles.modalCardHeader}>
                                        <View style={styles.discountBadge}>
                                            <Text style={styles.discountText}>{getDiscountText(selectedOffer)}</Text>
                                        </View>
                                    </View>

                                    {/* Package Type */}
                                    <Text style={styles.modalPackageType}>{selectedOffer.type || 'Offer'}</Text>

                                    {/* Offer Title */}
                                    <Text style={styles.modalOfferTitle}>{selectedOffer.title}</Text>

                                    {/* Description */}
                                    {selectedOffer.description && (
                                        <Text style={styles.modalDescriptionText}>{selectedOffer.description}</Text>
                                    )}

                                    {/* Valid Till */}
                                    <Text style={styles.modalValidText}>Valid till {formatDate(selectedOffer.expire_date)}</Text>

                                    {/* Terms and Conditions Link */}
                                    <TouchableOpacity style={styles.modalTermsButton}>
                                        <Text style={styles.modalTermsLink}>Terms and conditions</Text>
                                    </TouchableOpacity>

                                    {/* Promo Code Section */}
                                    <View style={styles.modalPromoCodeContainer}>
                                        <Text style={styles.modalPromoCodeLabel}>Use code : <Text style={styles.modalPromoCode}>{selectedOffer.coupon_code}</Text></Text>
                                        <TouchableOpacity onPress={() => copyToClipboard(selectedOffer.coupon_code)}>
                                            <Icon type={Icons.Ionicons} name="copy-outline" color={blackColor} size={ms(20)} />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Terms and Conditions Details (Static) */}
                                    <View style={styles.termsSection}>
                                        <Text style={styles.termsSectionTitle}>Terms and conditions</Text>
                                        {staticTerms.map((term, index) => (
                                            <View key={index} style={styles.termItem}>
                                                <Text style={styles.termBullet}>•</Text>
                                                <Text style={styles.termText}>{term}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default Offers;

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
        // paddingHorizontal: s(20),
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
        // marginLeft: s(10),
    },
    scrollView: {
        flex: 1,
        // paddingHorizontal: s(20),
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: ms(12),
        paddingHorizontal: s(15),
        paddingVertical: vs(10),
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
    offerCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: ms(15),
        padding: s(15),
        marginBottom: vs(15),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    discountBadge: {
        backgroundColor: '#0D8B7A',
        borderRadius: ms(20),
        paddingHorizontal: s(12),
        paddingVertical: vs(6),
    },
    discountText: {
        color: whiteColor,
        fontSize: ms(12),
        fontWeight: '700',
    },
    packageType: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    offerTitle: {
        fontSize: ms(16),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(10),
    },
    validText: {
        fontSize: ms(12),
        color: '#666',
        marginBottom: vs(8),
    },
    termsLink: {
        fontSize: ms(12),
        color: '#007AFF',
        textDecorationLine: 'underline',
        marginBottom: vs(12),
    },
    promoCodeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(8),
        padding: s(12),
    },
    promoCodeLabel: {
        fontSize: ms(14),
        color: blackColor,
    },
    promoCode: {
        fontWeight: '700',
        fontFamily: bold,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        backgroundColor: whiteColor,
        borderTopLeftRadius: ms(25),
        borderTopRightRadius: ms(25),
        paddingTop: vs(10),
        paddingBottom: vs(30),
        height: '70%',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: vs(15),
        paddingHorizontal: s(20),
    },
    modalHandle: {
        width: s(40),
        height: vs(4),
        backgroundColor: '#E0E0E0',
        borderRadius: ms(2),
        marginBottom: vs(10),
    },
    closeButton: {
        position: 'absolute',
        right: vs(10),
        top: vs(5),
        width: s(35),
        height: s(35),
        borderRadius: s(17.5),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalScrollView: {
        flex: 1,
        paddingHorizontal: s(20),
    },
    modalCardHeader: {
        marginBottom: vs(12),
        flexDirection:'row'
    },
    modalPackageType: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(8),
    },
    modalOfferTitle: {
        fontSize: ms(18),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(5),
        // lineHeight: vs(24),
    },
    modalValidText: {
        fontSize: ms(12),
        color: '#666',
        marginBottom: vs(10),
    },
    modalTermsButton: {
        marginBottom: vs(10),
    },
    modalTermsLink: {
        fontSize: ms(13),
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    modalPromoCodeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: ms(10),
        padding: s(15),
        marginBottom: vs(20),
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    modalPromoCodeLabel: {
        fontSize: ms(15),
        color: blackColor,
    },
    modalPromoCode: {
        fontWeight: '700',
        fontFamily: bold,
    },
    termsSection: {
        marginTop: vs(1),
    },
    termsSectionTitle: {
        fontSize: ms(16),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(5),
    },
    termItem: {
        flexDirection: 'row',
        marginBottom: vs(5),
        paddingRight: s(10),
    },
    termBullet: {
        fontSize: ms(14),
        color: blackColor,
        marginRight: s(10),
        marginTop: vs(2),
    },
    termText: {
        flex: 1,
        fontSize: ms(13),
        color: '#666',
        lineHeight: vs(20),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: vs(100),
    },
    loadingText: {
        marginTop: vs(15),
        fontSize: ms(14),
        color: '#666',
    },
    loadingMoreContainer: {
        paddingVertical: vs(20),
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatListContent: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: vs(100),
    },
    emptyText: {
        marginTop: vs(15),
        fontSize: ms(16),
        color: '#666',
        fontWeight: '500',
    },
    descriptionText: {
        fontSize: ms(12),
        color: '#888',
        marginBottom: vs(8),
    },
    modalDescriptionText: {
        fontSize: ms(13),
        color: '#666',
        marginBottom: vs(8),
        lineHeight: vs(18),
    },
});

/* ============================================
   OLD CODE - COMMENTED OUT
   ============================================

import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from '../components/StatusBar'
import LinearGradient from 'react-native-linear-gradient'
import * as colors from '../assets/css/Colors';
import { bold } from '../config/Constants';
import { CheckBox, Icon } from 'react-native-elements';
import { Icons } from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import lifestyle from '../assets/img/lifestyle.png';


const {width, height,fontScale} = Dimensions.get('window');

const Offers = () => {

    const navigation = useNavigation();
    const data = [{image:lifestyle},{image:lifestyle},{image:lifestyle},{image:lifestyle}]


    //   const navigate = ( type) => {
    //     navigation.navigate('MyReport', {  type: type })
    //   }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]} style={{marginBottom: height* 0.02}} >
        <View style={{ alignItems: 'center',height:50,justifyContent:'flex-end', marginBottom: 15 }}>

          <View style={styles.header}>
            <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 24, }}>Offers</Text>
          </View>
        </View>
      </LinearGradient>

        <View style={{justifyContent:'center',alignItems:'center',flex:1,marginBottom: height* 0.09}}>
            <View style={{justifyContent:'space-around',alignItems:'center'}}>

                <ScrollView>
                    {data.map((item)=>(
                        <TouchableOpacity
                        // onPress={() => {
                        // }}
                        style={{marginBottom: height * 0.03}}
                        >
                            <LinearGradient colors={[ colors.theme_color,colors.theme_color_One]} style={{borderRadius: 20}} >
                                <View style={styles.container2}>
                                    <Image
                                        source={item.image}
                                        style={styles.image}
                                        resizeMode="contain"
                                    />
                                    <View style={styles.textContainer}>
                                        <Text style={styles.text}>Package Name</Text>
                                        <Text style={styles.text2}>MRP {global.currency}2999</Text>
                                        <View style={styles.textContainer2}>
                                            <Text style={styles.text}>Offer Price</Text>
                                            <Text style={styles.text}>1999/-</Text>
                                        </View>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}

                </ScrollView>

            </View>
        </View>
    </SafeAreaView>
)}


export default Offers;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor:colors.theme_bg_three,
        justifyContent:'flex-start',
      },
      container2: {
        width: width * 0.9,
        height: height * 0.25,
        borderColor: colors.theme_black,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
        image: {
            width: '50%',
            height: '100%',
            marginLeft: width* 0.03,
        },
        textContainer: {
            width: '50%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            height: '100%',
            paddingHorizontal: 10,
        },
        textContainer2: {
            justifyContent: 'space-evenly',
            alignItems: 'center',
            paddingHorizontal: 10,
        },
        text: {
            fontSize: 16,
            color: '#fff',
        },
        text2: {
            fontSize: 16,
            color: '#fff',
            textDecorationLine: "line-through",
        },
})

============================================ */
