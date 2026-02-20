import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Icon, { Icons } from '../../components/Icons';
import { StatusBar2 } from '../../components/StatusBar';
import { primaryColor, whiteColor, blackColor } from '../../utils/globalColors';

const { width } = Dimensions.get('window');

// ── Tab data ──────────────────────────────────────────────────────────────────
const TABS = ['Overview', 'Uses', 'Dosage', 'Safety'];

// ── Common Uses chips ─────────────────────────────────────────────────────────
const COMMON_USES = [
  { icon: 'thermometer-outline', label: 'Fever' },
  { icon: 'flash-outline', label: 'Headache' },
  { icon: 'body-outline', label: 'Body pain' },
  { icon: 'medkit-outline', label: 'Toothache' },
  { icon: 'snow-outline', label: 'Cold & flu' },
];

// ── Dosage instructions ───────────────────────────────────────────────────────
const DOSAGE_ITEMS = [
  '1 tablet every 6–8 hours',
  'Maximum daily limit',
  'Children dosage',
];

// ── Safety warnings ───────────────────────────────────────────────────────────
const SAFETY_ITEMS = [
  'Check for Paracetamol allergies',
  'Consult doctor if you have liver disease',
  'Do not exceed 4g (8 tablets) per day',
];

// ── Rating bar component ──────────────────────────────────────────────────────
const RatingBar = ({ stars, value, maxValue }) => {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <View style={styles.ratingBarRow}>
      <Text style={styles.ratingBarStar}>{stars}</Text>
      <View style={styles.ratingBarTrack}>
        <View style={[styles.ratingBarFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const MedicineDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const medicine = route.params?.medicine || {};
  const productImage = route.params?.productImage || null;
  const [activeTab, setActiveTab] = useState('Overview');
  const [expandedDosage, setExpandedDosage] = useState(null);

  const medicineName = medicine.medicineName || 'Paracetamol';
  const [quantity, setQuantity] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar2 />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <ImageBackground
          source={require('../../assets/img/medicanbackgroundimg.png')}
          style={styles.heroBg}
          resizeMode="cover"
        >
          {/* Header row */}
          <View style={styles.heroHeader}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Icon type={Icons.Ionicons} name="arrow-back" size={ms(22)} color={whiteColor} />
            </TouchableOpacity>

            <View style={styles.heroRightIcons}>
              <TouchableOpacity
                style={styles.heroIconBtn}
                onPress={() => navigation.navigate('PharmCart')}
              >
                <Icon type={Icons.Ionicons} name="cart-outline" size={ms(18)} color={blackColor} />
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>2</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroIconBtn}>
                <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(18)} color={blackColor} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Product image */}
          <Image
            source={productImage || require('../../assets/img/medicans.png')}
            style={styles.handImage}
            resizeMode="contain"
          />
        </ImageBackground>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <View style={styles.content}>

          {/* Discount badge */}
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>20% OFF</Text>
          </View>

          {/* Title + Rating */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.medicineName}>{medicineName}</Text>
              <Text style={styles.medicineSubtitle}>500mg Tablets</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Icon type={Icons.Ionicons} name="star" size={ms(14)} color="#FFB300" />
              <Text style={styles.ratingNum}>4.5</Text>
              <Text style={styles.ratingCount}>86k Reviews</Text>
            </View>
          </View>

          {/* Price + ADD */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceText}>Price ₹384</Text>
              <Text style={styles.mrpText}>MRP ₹480</Text>
            </View>
            {quantity === 0 ? (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setQuantity(1)}
                activeOpacity={0.8}
              >
                <Text style={styles.addBtnText}>ADD</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(Math.max(0, quantity - 1))}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Description */}
          <Text style={styles.descriptionText}>
            Paracetamol 500mg helps reduce fever and relieve mild to moderate pain including headache, toothache, and muscle aches. It i...
          </Text>

          {/* Form + Strength */}
          <View style={styles.infoChipsRow}>
            <View style={styles.infoChip}>
              <Text style={styles.infoChipLabel}>Form</Text>
              <Text style={styles.infoChipValue}>Tablet</Text>
            </View>
            <View style={styles.infoChip}>
              <Text style={styles.infoChipLabel}>Strength</Text>
              <Text style={styles.infoChipValue}>500mg</Text>
            </View>
          </View>

          {/* ── Common Uses ────────────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>Common Uses</Text>
          <View style={styles.usesGrid}>
            {COMMON_USES.map((item, idx) => (
              <View key={idx} style={styles.useChip}>
                <Icon type={Icons.Ionicons} name={item.icon} size={ms(16)} color={primaryColor} />
                <Text style={styles.useChipLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* ── Dosage Instructions ────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>Dosage Instructions</Text>
          {DOSAGE_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.dosageRow}
              onPress={() => setExpandedDosage(expandedDosage === idx ? null : idx)}
              activeOpacity={0.7}
            >
              <Text style={styles.dosageText}>{item}</Text>
              <Icon
                type={Icons.Ionicons}
                name={expandedDosage === idx ? 'chevron-up' : 'chevron-down'}
                size={ms(18)}
                color="#888"
              />
            </TouchableOpacity>
          ))}

          {/* ── Safety & Warnings ──────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>Safety & Warnings</Text>
          {SAFETY_ITEMS.map((item, idx) => (
            <View key={idx} style={styles.safetyRow}>
              <Icon type={Icons.Ionicons} name="alert-circle-outline" size={ms(18)} color="#E53935" />
              <Text style={styles.safetyText}>{item}</Text>
            </View>
          ))}

          {/* ── Product Details ─────────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>Product Details</Text>
          <View style={styles.productDetailsCard}>
            <View style={styles.productDetailRow}>
              <View style={styles.productDetailCol}>
                <Text style={styles.productDetailLabel}>Generic Name</Text>
                <Text style={styles.productDetailValue}>Acetaminophen</Text>
              </View>
              <View style={styles.productDetailCol}>
                <Text style={styles.productDetailLabel}>Manufacturer</Text>
                <Text style={styles.productDetailValue}>PharmaHealth Ltd.</Text>
              </View>
            </View>
            <View style={styles.productDetailRow}>
              <View style={styles.productDetailCol}>
                <Text style={styles.productDetailLabel}>Expiry</Text>
                <Text style={styles.productDetailValue}>Dec 2026</Text>
              </View>
              <View style={styles.productDetailCol}>
                <Text style={styles.productDetailLabel}>Salt Composition</Text>
                <Text style={styles.productDetailValue}>Paracetamol (500mg)</Text>
              </View>
            </View>
          </View>

          {/* ── Reviews ────────────────────────────────────────────────── */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.writeReviewText}>Write a Review</Text>
            </TouchableOpacity>
          </View>

          {/* Rating summary */}
          <View style={styles.ratingSummaryRow}>
            <View style={styles.ratingSummaryLeft}>
              <Text style={styles.ratingBigNum}>4.3</Text>
              <View style={styles.ratingStarsRow}>
                {[1, 2, 3, 4].map((i) => (
                  <Icon key={i} type={Icons.Ionicons} name="star" size={ms(12)} color="#FFB300" />
                ))}
                <Icon type={Icons.Ionicons} name="star-half" size={ms(12)} color="#FFB300" />
              </View>
            </View>
            <View style={styles.ratingSummaryRight}>
              <RatingBar stars={5} value={85} maxValue={100} />
              <RatingBar stars={4} value={60} maxValue={100} />
              <RatingBar stars={3} value={20} maxValue={100} />
              <RatingBar stars={2} value={8} maxValue={100} />
              <RatingBar stars={1} value={5} maxValue={100} />
            </View>
          </View>

          {/* Single review */}
          <View style={styles.reviewCard}>
            <View style={styles.reviewCardHeader}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.reviewAvatarText}>RK</Text>
              </View>
              <View>
                <Text style={styles.reviewerName}>Rahul K.</Text>
                <View style={styles.reviewerStars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icon key={i} type={Icons.Ionicons} name="star" size={ms(10)} color="#FFB300" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>
              Always reliable for fever. The delivery was incredibly fast, arrived in 25 minutes!
            </Text>
          </View>

          <View style={{ height: vs(30) }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MedicineDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryColor,
  },

  // Hero
  heroBg: {
    width: ms(width),
    height: vs(260),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  heroHeader: {
    position: 'absolute',
    top: ms(50),
    left: 0,
    width: width,
    paddingHorizontal: ms(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  backBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroRightIcons: {
    flexDirection: 'row',
    gap: ms(8),
  },
  heroIconBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: ms(-2),
    right: ms(-2),
    backgroundColor: primaryColor,
    width: ms(16),
    height: ms(16),
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: whiteColor,
    fontSize: ms(9),
    fontWeight: 'bold',
  },
  handImage: {
    width: ms(180),
    height: vs(180),
    marginBottom: vs(10),
  },

  // Content
  content: {
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    marginTop: vs(-20),
    paddingHorizontal: ms(18),
    paddingTop: vs(22),
  },

  // Discount badge
  discountBadge: {
    backgroundColor: primaryColor,
    alignSelf: 'flex-start',
    paddingHorizontal: ms(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    marginBottom: vs(12),
  },
  discountBadgeText: {
    color: whiteColor,
    fontSize: ms(12),
    fontWeight: '700',
  },

  // Title row
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(16),
  },
  medicineName: {
    fontSize: ms(20),
    fontWeight: 'bold',
    color: blackColor,
  },
  medicineSubtitle: {
    fontSize: ms(12),
    color: '#888',
    marginTop: vs(3),
  },
  ratingBadge: {
    alignItems: 'center',
  },
  ratingNum: {
    fontSize: ms(14),
    fontWeight: 'bold',
    color: blackColor,
    marginTop: vs(1),
  },
  ratingCount: {
    fontSize: ms(10),
    color: '#888',
  },

  // Price row
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(16),
  },
  priceText: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: blackColor,
  },
  mrpText: {
    fontSize: ms(12),
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: vs(2),
  },
  addBtn: {
    backgroundColor: primaryColor,
    paddingHorizontal: ms(25),
    paddingVertical: vs(8),
    borderRadius: ms(14),
  },
  addBtnText: {
    color: whiteColor,
    fontSize: ms(14),
    fontWeight: '700',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: primaryColor,
    borderRadius: ms(8),
    paddingHorizontal: ms(6),
    paddingVertical: vs(4),
  },
  qtyBtn: {
    width: ms(28),
    height: ms(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    color: whiteColor,
    fontSize: ms(16),
    fontWeight: 'bold',
  },
  qtyValue: {
    color: whiteColor,
    fontSize: ms(14),
    fontWeight: '700',
    marginHorizontal: ms(8),
  },

  // Tabs
  tabsContainer: {
    gap: ms(8),
    marginBottom: vs(16),
  },
  tabBtn: {
    paddingHorizontal: ms(16),
    paddingVertical: vs(8),
    borderRadius: ms(20),
    backgroundColor: whiteColor,
  },
  tabBtnActive: {
    backgroundColor: primaryColor,
  },
  tabText: {
    fontSize: ms(13),
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: whiteColor,
    fontWeight: '600',
  },

  // Description
  descriptionText: {
    fontSize: ms(13),
    color: '#555',
    lineHeight: ms(21),
    marginBottom: vs(16),
  },

  // Info chips
  infoChipsRow: {
    flexDirection: 'row',
    gap: ms(12),
    marginBottom: vs(20),
  },
  infoChip: {
    flex: 1,
    borderRadius: ms(12),
    paddingVertical: vs(10),
    paddingHorizontal: ms(14),
    backgroundColor:whiteColor
  },
  infoChipLabel: {
    fontSize: ms(11),
    color: '#888',
    marginBottom: vs(3),
  },
  infoChipValue: {
    fontSize: ms(14),
    fontWeight: '600',
    color: blackColor,
  },

  // Section title
  sectionTitle: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: blackColor,
    marginBottom: vs(12),
  },

  // Uses grid
  usesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(10),
    marginBottom: vs(20),
  },
  useChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    borderRadius: ms(20),
    paddingVertical: vs(8),
    paddingHorizontal: ms(14),
    backgroundColor:whiteColor
  },
  useChipLabel: {
    fontSize: ms(13),
    color: '#444',
    fontWeight: '500',
  },

  // Dosage
  dosageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: ms(12),
    paddingVertical: vs(12),
    paddingHorizontal: ms(14),
    marginBottom: vs(8),
    backgroundColor:whiteColor
  },
  dosageText: {
    fontSize: ms(13),
    color: '#444',
    fontWeight: '500',
    flex: 1,
  },

  // Safety
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    marginBottom: vs(10),
  },
  safetyText: {
    fontSize: ms(13),
    color: '#E53935',
    fontWeight: '500',
    flex: 1,
  },

  // Product details
  productDetailsCard: {
    backgroundColor:whiteColor,
    borderRadius: ms(12),
    padding: ms(14),
    marginBottom: vs(20),
  },
  productDetailRow: {
    flexDirection: 'row',
    marginBottom: vs(12),
  },
  productDetailCol: {
    flex: 1,
  },
  productDetailLabel: {
    fontSize: ms(11),
    color: '#888',
    marginBottom: vs(3),
  },
  productDetailValue: {
    fontSize: ms(13),
    fontWeight: '600',
    color: blackColor,
  },

  // Reviews header
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  writeReviewText: {
    fontSize: ms(13),
    color: primaryColor,
    fontWeight: '600',
  },

  // Rating summary
  ratingSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(16),
    gap: ms(16),
  },
  ratingSummaryLeft: {
    alignItems: 'center',
  },
  ratingBigNum: {
    fontSize: ms(32),
    fontWeight: 'bold',
    color: blackColor,
  },
  ratingStarsRow: {
    flexDirection: 'row',
    gap: ms(2),
    marginTop: vs(2),
  },
  ratingSummaryRight: {
    flex: 1,
    gap: vs(4),
  },

  // Rating bar
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  ratingBarStar: {
    fontSize: ms(12),
    color: '#555',
    width: ms(12),
    textAlign: 'center',
  },
  ratingBarTrack: {
    flex: 1,
    height: vs(6),
    backgroundColor: '#E5E7EB',
    borderRadius: ms(3),
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: primaryColor,
    borderRadius: ms(3),
  },

  // Review card
  reviewCard: {
    marginBottom: vs(12),
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
    marginBottom: vs(6),
  },
  reviewAvatar: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewAvatarText: {
    color: whiteColor,
    fontWeight: 'bold',
    fontSize: ms(13),
  },
  reviewerName: {
    fontSize: ms(13),
    fontWeight: '600',
    color: blackColor,
  },
  reviewerStars: {
    flexDirection: 'row',
    gap: ms(1),
    marginTop: vs(2),
  },
  reviewText: {
    fontSize: ms(13),
    color: '#555',
    lineHeight: ms(20),
  },
});
