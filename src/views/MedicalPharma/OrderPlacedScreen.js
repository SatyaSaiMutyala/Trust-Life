import React from 'react';
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
import { StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import { interMedium, interRegular } from '../../config/Constants';

const ORDER_ITEMS = [
    {
        id: '1',
        name: 'Paracetamol',
        subtitle: '500mg Tablets',
        qty: 2,
        price: 384,
        mrp: 480,
        discount: '20% OFF',
        image: require('../../assets/img/medicans.png'),
    },
    {
        id: '2',
        name: 'Paracetamol',
        subtitle: '500mg Tablets',
        qty: 2,
        price: 384,
        mrp: 480,
        discount: '20% OFF',
        image: require('../../assets/img/medicans.png'),
    },
];

const OrderPlacedScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Success Icon & Title */}
                <View style={styles.successSection}>
                    <View style={styles.successIconWrap}>
                        <Icon
                            type={Icons.Ionicons}
                            name="checkmark-circle"
                            size={ms(50)}
                            color={primaryColor}
                        />
                    </View>
                    <Text style={styles.orderPlacedTitle}>Order Placed</Text>
                    <Text style={styles.orderDateTime}>11:30, Mon, 17 Feb, 2026</Text>
                    <Text style={styles.orderDesc}>
                        Your order has been placed and is being processed. You will receive a confirmation shortly.
                    </Text>
                    <Text style={styles.waitingText}>Waiting for confirmation...</Text>
                </View>

                {/* Items Details */}
                <View style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>Items Details</Text>
                        <Text style={styles.itemCount}>{ORDER_ITEMS.length} Items</Text>
                    </View>

                    {ORDER_ITEMS.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <View style={styles.itemImageWrap}>
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountBadgeText}>{item.discount}</Text>
                                </View>
                                <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                            </View>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.qty}x {item.name}</Text>
                                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                                <View style={styles.itemPriceRow}>
                                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                                    <Text style={styles.itemMrp}>MRP ₹{item.mrp}</Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.viewMoreRow}>
                        <Text style={styles.viewMoreText}>View more Details</Text>
                    </TouchableOpacity>
                </View>

                {/* Receiver Details */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Receiver Details</Text>

                    <View style={styles.receiverRow}>
                        <Icon type={Icons.Ionicons} name="person-outline" size={ms(16)} color="#6B7280" />
                        <View style={styles.receiverInfo}>
                            <Text style={styles.receiverName}>Raju</Text>
                            <Text style={styles.receiverPhone}>+91858456749</Text>
                        </View>
                    </View>

                    <View style={styles.receiverRow}>
                        <Icon type={Icons.Ionicons} name="location-outline" size={ms(16)} color="#6B7280" />
                        <Text style={styles.receiverAddress}>
                            #flatno.101, Shiva Appartments, Main Rd, Banjara Hills, Hyderabad
                        </Text>
                    </View>
                </View>

                {/* Order Summary */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Order Summary</Text>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Order ID</Text>
                        <Text style={styles.summaryValue}>7453473454</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Payment Status</Text>
                        <View style={styles.paidRow}>
                            <Icon type={Icons.Ionicons} name="checkmark-circle" size={ms(16)} color={primaryColor} />
                            <Text style={styles.paidText}>Paid</Text>
                        </View>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Amount Paid</Text>
                        <Text style={styles.summaryValue}>₹568</Text>
                    </View>
                </View>

                {/* Support Link */}
                <TouchableOpacity style={styles.supportRow}>
                    <Text style={styles.supportText}>Facing an Issue? </Text>
                    <Text style={styles.supportLink}>Get Support</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: vs(50),
        paddingBottom: vs(40),
    },

    // Success Section
    successSection: {
        alignItems: 'center',
        marginBottom: vs(24),
    },
    successIconWrap: {
        marginBottom: vs(12),
    },
    orderPlacedTitle: {
        fontFamily: interMedium,
        fontSize: ms(20),
        color: blackColor,
        marginBottom: vs(6),
    },
    orderDateTime: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
        marginBottom: vs(10),
    },
    orderDesc: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: ms(18),
        paddingHorizontal: ms(10),
        marginBottom: vs(10),
    },
    waitingText: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: primaryColor,
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(12),
    },
    cardTitle: {
        fontFamily: interMedium,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(10),
    },
    itemCount: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
        marginBottom: vs(10),
    },

    // Item Row
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(10),
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    itemImageWrap: {
        width: ms(65),
        height: ms(55),
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
    itemImage: {
        width: ms(45),
        height: ms(35),
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    itemSubtitle: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#9CA3AF',
        marginTop: vs(2),
    },
    itemPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(8),
        marginTop: vs(4),
    },
    itemPrice: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    itemMrp: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },

    // View More
    viewMoreRow: {
        alignItems: 'center',
        paddingTop: vs(12),
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    viewMoreText: {
        fontFamily: interRegular,
        fontSize: ms(13),
        color: primaryColor,
    },

    // Receiver Details
    receiverRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: ms(10),
        marginBottom: vs(12),
    },
    receiverInfo: {
        flex: 1,
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
    receiverAddress: {
        flex: 1,
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
        lineHeight: ms(18),
    },

    // Order Summary
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(12),
    },
    summaryLabel: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    summaryValue: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    paidRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(6),
    },
    paidText: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: primaryColor,
    },

    // Support
    supportRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: vs(8),
        marginBottom: vs(20),
    },
    supportText: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    supportLink: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: primaryColor,
    },
});

export default OrderPlacedScreen;
