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
import { globalGradient, primaryColor, whiteColor, blackColor, grayColor, lightGrayColor } from '../../utils/globalColors';
import { GOOGLE_KEY } from '../../config/Constants';

const { width } = Dimensions.get('window');

const IndivudalCompanyTests = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const lab = route?.params?.lab || null;
  const [profilePic, setProfilePic] = useState(null);
  const [locationModal, setLocationModal] = useState(false);
  const [savedLocation, setSavedLocation] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);

  const filterChips = ['Men', 'women', 'Kids'];

  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = async () => {
    try {
      const data = await AsyncStorage.getItem('location');
      if (data) {
        const loc = JSON.parse(data);
        setSavedLocation(loc);
      }
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
          const locationData = { latitude, longitude, address: 'Location detected' };
          setSavedLocation(locationData);
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

  // Test data matching your screenshot
  const testData = {
    testName: 'Glycosylated Haemoglobin (GHb/HbA1c)',
    description: 'Contaminated Specimen, Incomplete Test Requisition Form, Insufficient specimen quantity (QNS), Improper specimen for the test, Leaking or broken specimen...',
    labs: [
      {
        id: 1,
        name: 'TrustLab DIAGNOSTICS',
        logo: require('../../assets/img/3dlogo.png'),
        mrp: '480',
        discount: '20%',
        netAmount: '350',
        reportDays: '3',
      },
      {
        id: 2,
        name: 'VIJAYA DIAGNOSTIC CENTRE',
        logo: require('../../assets/img/vijayalogo.png'),
        mrp: '480',
        discount: '20%',
        netAmount: '350',
        reportDays: '3',
      },
      {
        id: 3,
        name: 'teNET DIAGNOSTICS',
        logo: require('../../assets/img/tenetlogo.png'),
        mrp: '480',
        discount: '30%',
        netAmount: '350',
        reportDays: '3',
      },
      {
        id: 4,
        name: 'Apollo DIAGNOSTICS',
        logo: require('../../assets/img/apollologo.png'),
        mrp: '480',
        discount: '20%',
        netAmount: '350',
        reportDays: '3',
      },
      {
        id: 5,
        name: 'METROPOLIS',
        logo: require('../../assets/img/metropoleslogo.png'),
        mrp: '480',
        discount: '20%',
        netAmount: '350',
        reportDays: '3',
      },
    ]
  };

  const renderLabCard = ({ item }) => (
    <TouchableOpacity
      style={styles.labCard}
      onPress={() => navigation.navigate('SelectedTest', { data: 'row', name: 'Profiles' })}
      activeOpacity={0.7}
    >
      <View style={styles.cardBody}>
        {/* Left Section */}
        <View style={styles.cardLeft}>
          <Text style={styles.cardTestName}>
            Glycosylated Haemoglobin{'\n'}(GHb/HbA1c)
          </Text>
          <View style={styles.cardPricing}>
            <View style={styles.cardPricingLabels}>
              <Text style={styles.cardPriceLabel}>MRP</Text>
              <Text style={styles.cardPriceLabel}>Discount</Text>
              <Text style={styles.cardPriceLabel}>{'Net\nAmount'}</Text>
            </View>
            <View style={styles.cardPricingValues}>
              <Text style={styles.cardMrp}>₹{item.mrp}</Text>
              <Text style={styles.cardDiscount}>{item.discount}</Text>
              <Text style={styles.cardNet}>₹{item.netAmount}</Text>
            </View>
          </View>
        </View>

        {/* Right Section */}
        <View style={styles.cardRight}>
          <Text style={styles.cardReportIn}>Report in</Text>
          <Text style={styles.cardReportDays}>{item.reportDays}</Text>
          <Text style={styles.cardReportLabel}>Days</Text>
          <TouchableOpacity
            style={styles.cardAddButton}
            onPress={() => console.log('Add to cart', item.id)}
          >
            <Text style={styles.cardAddText}>ADD</Text>
          </TouchableOpacity>
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
        locations={[0, 0.16]}
        style={{ flex: 1 }}
      >
        {/* Header - Exactly matching Dashboard */}
        <View style={styles.headerWrapper}>
          <View style={styles.headerContent}>
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon
                type={Icons.Ionicons}
                name="arrow-back"
                size={ms(20)}
                color={primaryColor}
              />
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
              <View style={styles.greetingRow}>
                <Text style={styles.greetingText}>Hello,</Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.userName}
                >
                  {global.customer_name || 'Suresh'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setLocationModal(true)}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.locationText}
                >
                  {savedLocation?.address || 'Set your location'} ▼
                </Text>
              </TouchableOpacity>
            </View>

            {/* Right Section */}
            <View style={styles.rightHeaderSection}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
                style={styles.headerButton}
              >
                <Icon
                  type={Icons.Ionicons}
                  name="notifications-outline"
                  size={ms(18)}
                  color={blackColor}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('LabCart')}
                style={styles.headerButton}
              >
                <Icon
                  type={Icons.Ionicons}
                  name="cart-outline"
                  size={ms(18)}
                  color={blackColor}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                {profilePic ? (
                  <Image
                    source={{ uri: profilePic }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={[styles.profileImage, styles.defaultProfileIcon]}>
                    <Icon type={Icons.MaterialIcons} name="person" size={ms(18)} color={blackColor} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar - Active with test name */}
          <TouchableOpacity
            style={styles.searchContainer}
            onPress={() => {}}
            activeOpacity={1}
          >
            <Icon type={Icons.Feather} name="search" color="#999" size={ms(20)} style={{ marginRight: s(4) }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search test or lab"
              placeholderTextColor="#999"
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Results Header */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Lab Search Results</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Company Logo */}
            {lab && (
              <View style={styles.companyLogoContainer}>
                <Image source={lab.image} style={styles.companyLogo} resizeMode="contain" />
              </View>
            )}

            {/* Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollView}
              contentContainerStyle={styles.filterScrollContent}
            >
              <TouchableOpacity
                style={[styles.filterChip, activeFilters.length > 0 && styles.filterChipActive]}
                onPress={() => navigation.navigate('LabFilterScreen')}
              >
                <Icon type={Icons.Ionicons} name="options-outline" size={ms(16)} color={activeFilters.length > 0 ? whiteColor : blackColor} />
                <Text style={[styles.filterChipText, activeFilters.length > 0 && styles.filterChipTextActive]}>Filters</Text>
                {activeFilters.length > 0 && (
                  <TouchableOpacity onPress={() => setActiveFilters([])}>
                    <Icon type={Icons.Ionicons} name="close-circle" size={ms(16)} color={whiteColor} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
              {filterChips.map((chip, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.filterChip, activeFilters.includes(chip) && styles.filterChipActive]}
                  onPress={() => {
                    setActiveFilters(prev =>
                      prev.includes(chip) ? prev.filter(f => f !== chip) : [...prev, chip]
                    );
                  }}
                >
                  <Text style={[styles.filterChipText, activeFilters.includes(chip) && styles.filterChipTextActive]}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Lab Cards List */}
            <View style={styles.labCardsContainer}>
              {testData.labs.map((labItem) => (
                <View key={labItem.id}>
                  {renderLabCard({ item: labItem })}
                </View>
              ))}
            </View>

            {/* Bottom Padding */}
            <View style={{ height: ms(30) }} />
          </ScrollView>
        </View>
      </LinearGradient>

      {/* Location Bottom Sheet Modal */}
      <Modal
        visible={locationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setLocationModal(false)}
          />
          <View style={styles.bottomSheetContainer}>
            <View style={styles.pullBar} />

            {/* Current Location */}
            <TouchableOpacity
              style={styles.optionRow}
              onPress={fetchCurrentLocation}
              activeOpacity={0.7}
            >
              <View style={styles.iconBox}>
                <Icon type={Icons.MaterialIcons} name="gps-fixed" size={ms(20)} color="#1BA672" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Current location</Text>
                <Text style={styles.optionSubtitle}>Allow location to get accurate delivery</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.sheetDivider} />

            {/* Select Different Location */}
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                setLocationModal(false);
                navigation.navigate('LocationSearch');
              }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
  },
  headerWrapper: {
    paddingTop: ms(50),
    paddingBottom: ms(20),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(30),
    paddingHorizontal: ms(10),
  },
  backButton: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(8),
    backgroundColor: whiteColor,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: ms(8),
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    color: '#fff',
    fontSize: ms(15),
    fontWeight: 'bold',
  },
  userName: {
    color: '#fff',
    fontSize: ms(15),
    fontWeight: 'bold',
    marginLeft: 4,
    flexShrink: 1,
  },
  locationText: {
    color: '#fff',
    fontSize: ms(10),
    maxWidth: ms(200),
  },
  rightHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  headerButton: {
    backgroundColor: whiteColor,
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    borderWidth: 1.5,
    borderColor: whiteColor,
  },
  defaultProfileIcon: {
    backgroundColor: whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  contentContainer: {
    flex: 1,
    marginHorizontal: ms(20),
  },
  scrollContent: {
    paddingTop: ms(10),
    paddingBottom: ms(30),
  },
  resultsHeader: {
    marginBottom: ms(10),
  },
  resultsTitle: {
    fontSize: ms(18),
    fontWeight: '400',
    color: blackColor,
  },
  companyLogoContainer: {
    alignItems: 'flex-start',
    marginBottom: ms(15),
  },
  companyLogo: {
    width: ms(120),
    height: ms(60),
  },
  filterScrollView: {
    marginBottom: ms(15),
  },
  filterScrollContent: {
    gap: ms(8),
    paddingRight: ms(10),
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: whiteColor,
    borderRadius: ms(20),
    paddingHorizontal: ms(14),
    paddingVertical: vs(8),
    gap: ms(6),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  },
  filterChipText: {
    fontSize: ms(13),
    fontWeight: '500',
    color: blackColor,
  },
  filterChipTextActive: {
    color: whiteColor,
  },
  labCardsContainer: {
    gap: ms(12),
  },

  // Updated Lab Card - Two Column Layout
  labCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: ms(12),
    overflow: 'hidden',
  },
  cardBody: {
    flexDirection: 'row',
  },
  cardLeft: {
    flex: 1,
    padding: ms(14),
    justifyContent: 'space-between',
  },
  cardTestName: {
    fontSize: ms(13),
    fontWeight: 'bold',
    color: blackColor,
    lineHeight: ms(18),
    marginBottom: vs(12),
  },
  cardPricing: {
    gap: vs(4),
  },
  cardPricingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(2),
  },
  cardPriceLabel: {
    fontSize: ms(12),
    color: '#888',
    fontWeight: '500',
    flex: 1,
    textAlign:'center'
  },
  cardPricingValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardMrp: {
    fontSize: ms(13),
    fontWeight: 'bold',
    color: blackColor,
    flex: 1,
    textAlign:'center',
    textDecorationLine: 'line-through',
    textDecorationColor: '#EF4444',
  },
  cardDiscount: {
    fontSize: ms(13),
    fontWeight: 'bold',
    color: blackColor,
    flex: 1,
    textAlign:'center'
  },
  cardNet: {
    fontSize: ms(13),
    fontWeight: 'bold',
    color: blackColor,
    flex: 1,
    textAlign:'center'
  },
  cardRight: {
    width: ms(110),
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(5),
    paddingHorizontal: ms(8),
    margin:ms(10),
    borderRadius:ms(20)
  },
  cardImageBox: {
    width: ms(55),
    height: ms(45),
    borderRadius: ms(8),
    backgroundColor: '#D5E0D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  cardReportIn: {
    fontSize: ms(10),
    color: '#555',
    fontWeight: '500',
  },
  cardReportDays: {
    fontSize: ms(18),
    fontWeight: 'bold',
    color: blackColor,
  },
  cardReportLabel: {
    fontSize: ms(10),
    color: '#555',
    fontWeight: '500',
    marginBottom: vs(6),
  },
  cardAddButton: {
    backgroundColor: primaryColor,
    paddingHorizontal: ms(22),
    paddingVertical: vs(7),
    borderRadius: ms(6),
  },
  cardAddText: {
    color: whiteColor,
    fontSize: ms(12),
    fontWeight: 'bold',
  },

  // Location Bottom Sheet
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
    elevation: 10,
  },
  pullBar: {
    width: 40,
    height: 4,
    backgroundColor: '#DADADA',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTitle: {
    fontSize: ms(14),
    fontWeight: '600',
    color: blackColor,
  },
  optionSubtitle: {
    fontSize: ms(11),
    color: '#888',
    marginTop: 2,
  },
  sheetDivider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 2,
  },
});

export default IndivudalCompanyTests;
