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
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { s, ms, vs } from 'react-native-size-matters';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon, { Icons } from '../../components/Icons';
import { StatusBar2 } from '../../components/StatusBar';
import { globalGradient, primaryColor, whiteColor, blackColor } from '../../utils/globalColors';
import { GOOGLE_KEY } from '../../config/Constants';

const { width } = Dimensions.get('window');

const CompanyMedicines = () => {
  const navigation = useNavigation();
  const [profilePic, setProfilePic] = useState(null);
  const [locationModal, setLocationModal] = useState(false);
  const [savedLocation, setSavedLocation] = useState(null);

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

  // Pharmacy brands
  const pharmacyCategories = [
    {
      title: 'MEDICAL PHARMA',
      brands: [
        { id: 1, name: 'Apollo Pharmacy', image: require('../../assets/img/apollologo.png') },
        { id: 2, name: 'MedPlus Mart', image: require('../../assets/img/medpluse.png') },
        { id: 3, name: 'Netmeds', image: require('../../assets/img/netmeds.png') },
      ],
    },
  ];

  const renderBrandGrid = (brands) => {
    const rows = [];
    for (let i = 0; i < brands.length; i += 3) {
      rows.push(brands.slice(i, i + 3));
    }

    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.gridRow}>
        {row.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            style={styles.brandCard}
            onPress={() => navigation.navigate('IndividualCompanyMedicines', { brand })}
          >
            <View style={styles.brandImageContainer}>
              <Image source={brand.image} style={styles.brandImage} resizeMode="contain" />
            </View>
          </TouchableOpacity>
        ))}
        {row.length < 3 && [...Array(3 - row.length)].map((_, i) => (
          <View key={`empty-${i}`} style={styles.emptyCard} />
        ))}
      </View>
    ));
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
                onPress={() => navigation.navigate('PharmCart')}
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
            <TouchableOpacity onPress={() => navigation.navigate('MedicineSearchResults')}>
              <Icon type={Icons.Ionicons} name="options-outline" color="#555" size={ms(20)} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.contentContainer}
          contentContainerStyle={styles.contentContainerStyle}
        >
          {pharmacyCategories.map((category, index) => (
            <View key={index} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <View style={styles.brandsGridContainer}>
                {renderBrandGrid(category.brands)}
              </View>
            </View>
          ))}

          <View style={{ height: ms(30) }} />
        </ScrollView>
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
  },
  searchInput: {
    flex: 1,
    fontSize: ms(16),
    color: '#000',
    paddingVertical: 0,
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: ms(25),
    borderTopRightRadius: ms(25),
  },
  contentContainerStyle: {
    paddingTop: ms(20),
    paddingBottom: ms(30),
  },
  categorySection: {
    paddingHorizontal: ms(15),
    marginBottom: ms(20),
  },
  categoryTitle: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: blackColor,
    marginBottom: ms(15),
    textAlign: 'center',
  },
  brandsGridContainer: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ms(15),
  },
  brandCard: {
    width: (width - ms(50)) / 3,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: ms(12),
    paddingVertical: ms(15),
    paddingHorizontal: ms(8),
  },
  brandImageContainer: {
    width: ms(60),
    height: ms(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(8),
  },
  brandImage: {
    width: ms(85),
    height: ms(85),
  },
  brandName: {
    fontSize: ms(10),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: ms(14),
  },
  emptyCard: {
    width: (width - ms(50)) / 3,
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

export default CompanyMedicines;
