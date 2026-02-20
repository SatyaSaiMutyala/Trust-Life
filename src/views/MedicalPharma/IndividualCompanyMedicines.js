import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { s, ms, vs } from 'react-native-size-matters';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon, { Icons } from '../../components/Icons';
import { StatusBar2 } from '../../components/StatusBar';
import { globalGradient, primaryColor, whiteColor, blackColor } from '../../utils/globalColors';
import { GOOGLE_KEY } from '../../config/Constants';

const { width } = Dimensions.get('window');

// ── Filter chips ──────────────────────────────────────────────────────────────
const FILTERS = ['Filters', 'Fast Relief', 'Sugar-Free', 'Suitable'];

// ── Mock medicines ────────────────────────────────────────────────────────────
const MEDICINES = [
  {
    id: 1,
    name: 'Paracetamol',
    subtitle: '500mg Tablets',
    rating: 4.5,
    mrp: '480',
    discount: '20%',
    netAmount: '384',
    image: require('../../assets/img/medicans.png'),
  },
  {
    id: 2,
    name: 'Aspirin',
    subtitle: '500mg Tablets',
    rating: 4.5,
    mrp: '480',
    discount: '20%',
    netAmount: '384',
    image: require('../../assets/img/medicans.png'),
  },
  {
    id: 3,
    name: 'Ibuprofen',
    subtitle: '500mg Tablets',
    rating: 4.5,
    mrp: '480',
    discount: '20%',
    netAmount: '384',
    image: require('../../assets/img/medicans.png'),
  },
  {
    id: 4,
    name: 'Diclofenac',
    subtitle: '500mg Tablets',
    rating: 4.5,
    mrp: '480',
    discount: '20%',
    netAmount: '384',
    image: require('../../assets/img/medicans.png'),
  },
];

// ── Medicine Card ─────────────────────────────────────────────────────────────
const MedicineCard = ({ item, onPress }) => {
  const [qty, setQty] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onPress(item)}>
      <View style={styles.cardBody}>
        {/* Left */}
        <View style={styles.cardLeft}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          <View style={styles.cardRatingRow}>
            <Icon type={Icons.Ionicons} name="star" size={ms(14)} color="#FFB300" />
            <Text style={styles.cardRating}>{item.rating}</Text>
          </View>

          <View style={styles.cardPricing}>
            <View style={styles.cardPricingLabels}>
              <Text style={styles.priceLabel}>MRP</Text>
              <Text style={styles.priceLabel}>Discount</Text>
              <Text style={styles.priceLabel}>Net Amount</Text>
            </View>
            <View style={styles.cardPricingValues}>
              <Text style={styles.priceMrp}>₹{item.mrp}</Text>
              <Text style={styles.priceDiscount}>{item.discount}</Text>
              <Text style={styles.priceNet}>₹{item.netAmount}</Text>
            </View>
          </View>
        </View>

        {/* Right */}
        <View style={styles.cardRight}>
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={() => setWishlisted(!wishlisted)}
          >
            <Icon
              type={Icons.Ionicons}
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={ms(18)}
              color={wishlisted ? '#E53935' : '#999'}
            />
          </TouchableOpacity>

          <Image source={item.image} style={styles.cardImage} resizeMode="contain" />

          {qty === 0 ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setQty(1)}
            >
              <Text style={styles.addBtnText}>ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(Math.max(0, qty - 1))}
              >
                <Icon type={Icons.Ionicons} name="remove" size={ms(16)} color={whiteColor} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(qty + 1)}
              >
                <Icon type={Icons.Ionicons} name="add" size={ms(16)} color={whiteColor} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const IndividualCompanyMedicines = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const brand = route.params?.brand || {};
  const [profilePic, setProfilePic] = useState(null);
  const [locationModal, setLocationModal] = useState(false);
  const [savedLocation, setSavedLocation] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = async () => {
    try {
      const data = await AsyncStorage.getItem('location');
      if (data) setSavedLocation(JSON.parse(data));
    } catch (error) {
      console.log('Error loading saved location:', error);
    }
  };

  const fetchCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_KEY}`
          );
          const json = await res.json();
          const address = json.results?.length > 0
            ? json.results[0].formatted_address
            : 'Location detected';
          const locationData = { latitude, longitude, address };
          await AsyncStorage.setItem('location', JSON.stringify(locationData));
          setSavedLocation(locationData);
        } catch (e) {
          console.log('Geocoding error:', e);
          setSavedLocation({ latitude, longitude, address: 'Location detected' });
        }
        setLocationModal(false);
      },
      (error) => {
        console.log('Location error:', error);
        Alert.alert('Location Error', 'Please enable location permissions');
        setLocationModal(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleMedicinePress = (item) => {
    navigation.navigate('MedicineDetail', {
      medicine: { medicineName: `${item.name} ${item.subtitle}` },
      productImage: item.image,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar2 />
      <LinearGradient
        colors={globalGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 3 }}
        locations={[0, 0.16]}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.headerWrapper}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={primaryColor} />
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
              <View style={styles.greetingRow}>
                <Text style={styles.greetingText}>Hello,</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userName}>
                  {global.customer_name || 'Suresh'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setLocationModal(true)}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.locationText}>
                  {savedLocation?.address || 'Set your location'} ▼
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rightHeaderSection}>
              <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.headerButton}>
                <Icon type={Icons.Ionicons} name="notifications-outline" size={ms(18)} color={blackColor} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('PharmCart')} style={styles.headerButton}>
                <Icon type={Icons.Ionicons} name="cart-outline" size={ms(18)} color={blackColor} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                {profilePic ? (
                  <Image source={{ uri: profilePic }} style={styles.profileImage} />
                ) : (
                  <View style={[styles.profileImage, styles.defaultProfileIcon]}>
                    <Icon type={Icons.MaterialIcons} name="person" size={ms(18)} color={blackColor} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            style={styles.searchContainer}
            activeOpacity={1}
            onPress={() => navigation.navigate('MedicineSearchResults')}
          >
            <Icon type={Icons.Feather} name="search" color="#999" size={ms(20)} style={{ marginRight: s(4) }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for Medicines"
              placeholderTextColor="#999"
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            {/* Title */}
            <Text style={styles.resultsTitle}>Pharma Search Results</Text>

            {/* Brand Logo */}
            {brand.image && (
              <View style={styles.brandLogoContainer}>
                <Image source={brand.image} style={styles.brandLogo} resizeMode="contain" />
              </View>
            )}

            {/* Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersRow}
            >
              {FILTERS.map((filter, idx) => {
                const isActive = activeFilter === filter;
                const isFilterBtn = filter === 'Filters';
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                    onPress={() => isFilterBtn ? navigation.navigate('MedicineFilters') : setActiveFilter(isActive ? null : filter)}
                  >
                    {isFilterBtn && (
                      <Icon type={Icons.Ionicons} name="options-outline" size={ms(14)} color={isActive ? whiteColor : '#555'} />
                    )}
                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                      {filter}
                    </Text>
                    {isFilterBtn && (
                      <Icon type={Icons.Ionicons} name="chevron-down" size={ms(14)} color={isActive ? whiteColor : '#555'} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Medicine Cards */}
            <View style={styles.cardsContainer}>
              {MEDICINES.map((item) => (
                <MedicineCard key={item.id} item={item} onPress={handleMedicinePress} />
              ))}
            </View>

            <View style={{ height: ms(30) }} />
          </ScrollView>
        </View>
      </LinearGradient>

      {/* Location Bottom Sheet */}
      <Modal
        visible={locationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setLocationModal(false)} />
          <View style={styles.bottomSheetContainer}>
            <View style={styles.pullBar} />
            <TouchableOpacity style={styles.optionRow} onPress={fetchCurrentLocation} activeOpacity={0.7}>
              <View style={styles.iconBox}>
                <Icon type={Icons.MaterialIcons} name="gps-fixed" size={ms(20)} color="#1BA672" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Current location</Text>
                <Text style={styles.optionSubtitle}>Allow location to get accurate delivery</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.sheetDivider} />
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => { setLocationModal(false); navigation.navigate('LocationSearch'); }}
            >
              <View style={styles.iconBox}>
                <Icon type={Icons.MaterialIcons} name="location-on" size={ms(20)} color="#000" />
              </View>
              <Text style={styles.optionTitle}>Select different location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default IndividualCompanyMedicines;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: whiteColor },

  // Header
  headerWrapper: { paddingTop: ms(50), paddingBottom: ms(20) },
  headerContent: {
    flexDirection: 'row', alignItems: 'center', marginBottom: ms(30), paddingHorizontal: ms(10),
  },
  backButton: {
    width: ms(34), height: ms(34), borderRadius: ms(17),
    justifyContent: 'center', alignItems: 'center', marginRight: ms(8), backgroundColor: whiteColor,
  },
  headerTextContainer: { flex: 1, marginRight: ms(8) },
  greetingRow: { flexDirection: 'row', alignItems: 'center' },
  greetingText: { color: '#fff', fontSize: ms(15), fontWeight: 'bold' },
  userName: { color: '#fff', fontSize: ms(15), fontWeight: 'bold', marginLeft: 4, flexShrink: 1 },
  locationText: { color: '#fff', fontSize: ms(10), maxWidth: ms(200) },
  rightHeaderSection: { flexDirection: 'row', alignItems: 'center', gap: ms(6) },
  headerButton: {
    backgroundColor: whiteColor, width: ms(34), height: ms(34), borderRadius: ms(17),
    justifyContent: 'center', alignItems: 'center',
  },
  profileImage: { width: ms(34), height: ms(34), borderRadius: ms(17), borderWidth: 1.5, borderColor: whiteColor },
  defaultProfileIcon: { backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: whiteColor,
    borderRadius: ms(25), paddingHorizontal: ms(18), paddingVertical: vs(10), marginHorizontal: ms(15),
  },
  searchInput: { flex: 1, fontSize: ms(16), color: '#000', paddingVertical: 0 },

  // Content
  contentContainer: { flex: 1 },
  scrollContent: { paddingTop: ms(10), paddingBottom: ms(30), paddingHorizontal: ms(16) },

  resultsTitle: { fontSize: ms(18), fontWeight: '400', color: blackColor, marginBottom: ms(10) },

  // Brand logo
  brandLogoContainer: { alignItems: 'flex-start', marginBottom: ms(15) },
  brandLogo: { width: ms(120), height: ms(40) },

  // Filters
  filtersRow: { gap: ms(8), marginBottom: ms(16), paddingRight: ms(10) },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: ms(5), borderRadius: ms(20),
    paddingVertical: vs(7), paddingHorizontal: ms(14), backgroundColor: whiteColor,
  },
  filterChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
  filterChipText: { fontSize: ms(12), color: '#555', fontWeight: '500' },
  filterChipTextActive: { color: whiteColor },

  // Cards
  cardsContainer: { gap: ms(12) },

  // Card
  card: {
    backgroundColor: '#F1F5F9', borderRadius: ms(14),
  },
  cardBody: { flexDirection: 'row' },
  cardLeft: { flex: 1, padding: ms(14), justifyContent: 'space-between' },
  cardName: { fontSize: ms(15), fontWeight: 'bold', color: blackColor },
  cardSubtitle: { fontSize: ms(12), color: '#888', marginTop: vs(1) },
  cardRatingRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4), marginTop: vs(4), marginBottom: vs(8) },
  cardRating: { fontSize: ms(13), color: blackColor, fontWeight: '600' },

  cardPricing: { gap: vs(3) },
  cardPricingLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  priceLabel: { fontSize: ms(11), color: '#888', fontWeight: '500', flex: 1 },
  cardPricingValues: { flexDirection: 'row', justifyContent: 'space-between' },
  priceMrp: {
    fontSize: ms(13), fontWeight: 'bold', color: blackColor, flex: 1,
    textDecorationLine: 'line-through', textDecorationColor: '#EF4444',
  },
  priceDiscount: { fontSize: ms(13), fontWeight: 'bold', color: blackColor, flex: 1 },
  priceNet: { fontSize: ms(13), fontWeight: 'bold', color: blackColor, flex: 1 },

  // Card right
  cardRight: {
    width: ms(120), alignItems: 'center', justifyContent: 'center',
    paddingVertical: vs(10), paddingHorizontal: ms(8),
  },
  heartBtn: {
    position: 'absolute', top: ms(8), right: ms(8), zIndex: 1,
    width: ms(30), height: ms(30), borderRadius: ms(15),
    backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
  },
  cardImage: { width: ms(90), height: ms(75), marginBottom: vs(8), marginTop: vs(8) },

  addBtn: {
    backgroundColor: primaryColor, paddingHorizontal: ms(24), paddingVertical: vs(8),
    borderRadius: ms(8),
  },
  addBtnText: { color: whiteColor, fontSize: ms(13), fontWeight: 'bold' },

  // Qty counter
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: ms(10) },
  qtyBtn: {
    backgroundColor: primaryColor, width: ms(28), height: ms(28), borderRadius: ms(14),
    justifyContent: 'center', alignItems: 'center',
  },
  qtyText: { fontSize: ms(15), fontWeight: 'bold', color: blackColor },

  // Location Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'transparent' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  bottomSheetContainer: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10, elevation: 10,
  },
  pullBar: { width: 40, height: 4, backgroundColor: '#DADADA', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  iconBox: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  optionTitle: { fontSize: ms(14), fontWeight: '600', color: blackColor },
  optionSubtitle: { fontSize: ms(11), color: '#888', marginTop: 2 },
  sheetDivider: { height: 1, backgroundColor: '#EEE', marginVertical: 2 },
});
