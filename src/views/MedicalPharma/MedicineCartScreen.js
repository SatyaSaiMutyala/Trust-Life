import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, grayColor } from '../../utils/globalColors';
import { interMedium, interRegular } from '../../config/Constants';
import { PricingButton } from 'react-native-elements/dist/pricing/PricingCard';
import PrimaryButton from '../../utils/primaryButton';

const INITIAL_CART = [
    {
        id: '1',
        name: 'Paracetamol',
        subtitle: '500mg Tablets',
        price: 384,
        mrp: 480,
        qty: 1,
        discount: '20% OFF',
        image: require('../../assets/img/medicans.png'),
    },
    {
        id: '2',
        name: 'Paracetamol',
        subtitle: '500mg Tablets',
        price: 384,
        mrp: 480,
        qty: 1,
        discount: '20% OFF',
        image: require('../../assets/img/medicans.png'),
    },
];

const MedicineCartScreen = () => {
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState(INITIAL_CART);

    const updateQty = (id, delta) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, qty: Math.max(1, item.qty + delta) }
                    : item
            )
        );
    };

    const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const promoDiscount = 200;
    const gstTaxes = 10;
    const grandTotal = itemTotal - promoDiscount + gstTaxes;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart</Text>
                <TouchableOpacity style={styles.shareButton}>
                    <Icon type={Icons.Ionicons} name="share-social-outline" size={ms(18)} color={blackColor} />
                </TouchableOpacity>
            </View>

            {/* Address Bar */}
            <TouchableOpacity style={styles.addressBar} activeOpacity={0.7}>
                <Text style={styles.addressText} numberOfLines={1}>
                    #flatno.101, Shiva Appartments, Main Rd, Banjara Hi...
                </Text>
                <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(18)} color="#9CA3AF" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Store Card */}
                <View style={styles.storeCard}>
                    <View style={styles.storeRow}>
                        <View style={styles.storeBadge}>
                            <Text style={styles.storeBadgeText}>MedPlus Mart</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.addItemsText}>Add  Items</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Cart Items */}
                    {cartItems.map((item) => (
                        <View key={item.id} style={styles.cartItemRow}>
                            <View style={styles.cartItemImageWrap}>
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountBadgeText}>{item.discount}</Text>
                                </View>
                                <Image source={item.image} style={styles.cartItemImage} resizeMode="contain" />
                            </View>
                            <View style={styles.cartItemInfo}>
                                <Text style={styles.cartItemName}>{item.name}</Text>
                                <Text style={styles.cartItemSubtitle}>{item.subtitle}</Text>
                                <View style={styles.cartItemPriceRow}>
                                    <Text style={styles.cartItemPrice}>₹{item.price}</Text>
                                    <Text style={styles.cartItemMrp}>MRP ₹{item.mrp}</Text>
                                </View>
                            </View>
                            <View style={styles.qtyControl}>
                                <TouchableOpacity
                                    style={styles.qtyBtn}
                                    onPress={() => updateQty(item.id, -1)}
                                >
                                    <Text style={styles.qtyBtnText}>—</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyValue}>{item.qty}</Text>
                                <TouchableOpacity
                                    style={styles.qtyBtn}
                                    onPress={() => updateQty(item.id, 1)}
                                >
                                    <Text style={styles.qtyBtnText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Apply Coupons */}
                <View style={styles.couponCard}>
                    <View style={styles.couponRow}>
                        <Icon type={Icons.MaterialCommunityIcons} name="ticket-percent-outline" size={ms(22)} color={primaryColor} />
                        <Text style={styles.couponText}>Apply coupons</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.applyText}>Apply</Text>
                    </TouchableOpacity>
                </View>

                {/* Receiver Details */}
                <View style={styles.receiverCard}>
                    <Text style={styles.receiverTitle}>Receiver Details</Text>
                    <View style={styles.receiverRow}>
                        <View>
                            <Text style={styles.receiverName}>Raju</Text>
                            <Text style={styles.receiverPhone}>+91858456749</Text>
                        </View>
                        <TouchableOpacity>
                            <Icon type={Icons.Feather} name="edit-2" size={ms(16)} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bill Details */}
                <View style={styles.billCard}>
                    <Text style={styles.billTitle}>Bill Details</Text>

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Item total</Text>
                        <Text style={styles.billValue}>₹{itemTotal}</Text>
                    </View>

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Prom ( APPLT34 )</Text>
                        <Text style={[styles.billValue, { color: primaryColor }]}>-₹{promoDiscount}</Text>
                    </View>

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>GST Taxes</Text>
                        <Text style={styles.billValue}>₹{gstTaxes}</Text>
                    </View>

                    <View style={styles.billDivider} />

                    <View style={styles.billRow}>
                        <Text style={styles.grandTotalLabel}>Grand Total</Text>
                        <Text style={styles.grandTotalValue}>₹{grandTotal}</Text>
                    </View>
                </View>

                {/* Cancellation Policy */}
                <View style={styles.policyRow}>
                    <Text style={styles.policyText}>Cancellation </Text>
                    <TouchableOpacity>
                        <Text style={styles.policyLink}>Policy</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Proceed Button */}
            <View style={styles.proceedWrap}>
                <PrimaryButton title='Proceed' onPress={()=> navigation.navigate('MedicinePaymentSuccessScreen')} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(12),
    },
    backButton: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTitle: {
        flex: 1,
        fontFamily: interMedium,
        fontSize: ms(16),
        color: blackColor,
        marginLeft: ms(12),
    },
    shareButton: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },

    // Address Bar
    addressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingVertical: vs(10),
        backgroundColor:'#F1F5F9'
    },
    addressText: {
        flex: 1,
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
    },

    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: vs(16),
        paddingBottom: vs(100),
    },

    // Store Card
    storeCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    storeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(16),
    },
    storeBadge: {
        backgroundColor: '#E53935',
        borderRadius: ms(6),
        paddingHorizontal: ms(12),
        paddingVertical: vs(5),
    },
    storeBadgeText: {
        fontFamily: interMedium,
        fontSize: ms(11),
        color: whiteColor,
    },
    addItemsText: {
        fontFamily: interRegular,
        fontSize: ms(13),
        color: blackColor,
    },

    // Cart Item
    cartItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(12),
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    cartItemImageWrap: {
        width: ms(70),
        height: ms(60),
        borderRadius: ms(8),
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    discountBadge: {
        position: 'absolute',
        top: ms(2),
        left: ms(2),
        backgroundColor: '#E53935',
        borderRadius: ms(4),
        paddingHorizontal: ms(4),
        paddingVertical: vs(1),
        zIndex: 1,
    },
    discountBadgeText: {
        fontFamily: interMedium,
        fontSize: ms(7),
        color: whiteColor,
    },
    cartItemImage: {
        width: ms(50),
        height: ms(40),
    },
    cartItemInfo: {
        flex: 1,
    },
    cartItemName: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    cartItemSubtitle: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#9CA3AF',
        marginTop: vs(2),
    },
    cartItemPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(8),
        marginTop: vs(4),
    },
    cartItemPrice: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    cartItemMrp: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },

    // Qty Control
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: ms(8),
        overflow: 'hidden',
    },
    qtyBtn: {
        width: ms(28),
        height: ms(28),
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyBtnText: {
        fontSize: ms(14),
        fontFamily: interMedium,
        color: blackColor,
    },
    qtyValue: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
        paddingHorizontal: ms(6),
    },

    // Coupon Card
    couponCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        paddingHorizontal: ms(16),
        paddingVertical: vs(14),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(12),
    },
    couponRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
    },
    couponText: {
        fontFamily: interRegular,
        fontSize: ms(13),
        color: blackColor,
    },
    applyText: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: primaryColor,
    },

    // Receiver Card
    receiverCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    receiverTitle: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(12),
    },
    receiverRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    receiverName: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    receiverPhone: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#9CA3AF',
        marginTop: vs(2),
    },

    // Bill Card
    billCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    billTitle: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(14),
    },
    billRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(10),
    },
    billLabel: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    billValue: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: blackColor,
    },
    billDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: vs(6),
        borderStyle: 'dashed',
    },
    grandTotalLabel: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    grandTotalValue: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },

    // Policy
    policyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    policyText: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    policyLink: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: primaryColor,
    },

    // Proceed Button
    proceedWrap: {
        position: 'absolute',
        bottom: vs(20),
        left: ms(20),
        right: ms(20),
    },
    proceedBtn: {
        borderRadius: ms(12),
        paddingVertical: vs(14),
        alignItems: 'center',
    },
    proceedBtnText: {
        fontFamily: interMedium,
        fontSize: ms(15),
        color: whiteColor,
    },
});

export default MedicineCartScreen;
