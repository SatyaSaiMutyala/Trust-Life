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
import { globalGradient, primaryColor, whiteColor, blackColor, grayColor } from '../../utils/globalColors';
import { GOOGLE_KEY } from '../../config/Constants';

const { width } = Dimensions.get('window');

const CompanyLabTests = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
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

  // Lab data organized by category
  const labCategories = [
    {
      title: 'NABL Accurate labs',
      labs: [
        { id: 1, name: 'TrustLab DIAGNOSTICS', image: require('../../assets/img/app3dlogo.png') },
        { id: 2, name: 'VIJAYA DIAGNOSTIC CENTRE', image: require('../../assets/img/vijayalogo.png') },
        { id: 3, name: 'teNET DIAGNOSTICS', image: require('../../assets/img/tenetlogo.png') },
        { id: 4, name: 'Apollo DIAGNOSTICS', image: require('../../assets/img/apollologo.png') },
        { id: 5, name: 'METROPOLIS', image: require('../../assets/img/metropoleslogo.png') },
        { id: 6, name: 'agilus >> diagnostics', image: require('../../assets/img/agiluslogo.png') },
        { id: 7, name: 'AMPATH', image: require('../../assets/img/ampatlogo.png') },
        { id: 8, name: 'LUCID MEDICAL DIAGNOSTICS', image: require('../../assets/img/lucidlogo.png') },
        { id: 9, name: 'Unipath SPECIALTY LABORATORIES LTD.', image: require('../../assets/img/unipathlogo.png') },
      ]
    },
    {
      title: 'NON -NABL Accurate labs',
      labs: [
        { id: 10, name: 'TrustLab DIAGNOSTICS', image: require('../../assets/img/app3dlogo.png') },
        { id: 11, name: 'VIJAYA DIAGNOSTIC CENTRE', image: require('../../assets/img/vijayalogo.png') },
        { id: 12, name: 'teNET DIAGNOSTICS', image: require('../../assets/img/tenetlogo.png') },
        { id: 13, name: 'Apollo DIAGNOSTICS', image: require('../../assets/img/apollologo.png') },
        { id: 14, name: 'METROPOLIS', image: require('../../assets/img/metropoleslogo.png') },
        { id: 15, name: 'agilus >> diagnostics', image: require('../../assets/img/agiluslogo.png') },
        { id: 16, name: 'AMPATH', image: require('../../assets/img/ampatlogo.png') },
        { id: 17, name: 'LUCID MEDICAL DIAGNOSTICS', image: require('../../assets/img/lucidlogo.png') },
        { id: 18, name: 'Unipath SPECIALTY LABORATORIES LTD.', image: require('../../assets/img/unipathlogo.png') },
      ]
    }
  ];

  const renderLabGrid = (labs) => {
    // Split into chunks of 3 for 3-column grid
    const rows = [];
    for (let i = 0; i < labs.length; i += 3) {
      rows.push(labs.slice(i, i + 3));
    }

    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.gridRow}>
        {row.map((lab) => (
          <TouchableOpacity
            key={lab.id}
            style={styles.labCard}
            onPress={() => navigation.navigate('IndivudalCompanyTests', { lab: { id: lab.id, name: lab.name, image: lab.image } })}
          >
            <View style={styles.labImageContainer}>
              <Image source={lab.image} style={styles.labImage} resizeMode="contain" />
            </View>
            <Text style={styles.labName} numberOfLines={2}>
              {lab.name}
            </Text>
          </TouchableOpacity>
        ))}
        {/* Fill empty slots with empty views to maintain grid */}
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
        {/* Header - Exactly matching your Dashboard header */}
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

            {/* Right Section - Notification, Cart, Profile */}
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

          {/* Search Bar - Exactly matching Dashboard */}
          <TouchableOpacity
            style={styles.searchContainer}
            onPress={() => navigation.navigate('TestSearchResultsScreen')}
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.contentContainer}
          contentContainerStyle={styles.contentContainerStyle}
        >
          {labCategories.map((category, index) => (
            <View key={index} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <View style={styles.labsGridContainer}>
                {renderLabGrid(category.labs)}
              </View>
              {/* {index < labCategories.length - 1 && <View style={styles.categoryDivider} />} */}
            </View>
          ))}

          {/* Bottom padding */}
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
    // marginBottom: vs(10),
  },
  searchInput: {
    flex: 1,
    fontSize: ms(16),
    color: '#000',
    paddingVertical: 0,
  },
  contentContainer: {
    flex: 1,
    // backgroundColor: whiteColor,
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
    textAlign:'center'
  },
  labsGridContainer: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ms(15),
  },
  labCard: {
    width: (width - ms(50)) / 3,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: ms(12),
    paddingVertical: ms(15),
    paddingHorizontal: ms(8),
  },
  labImageContainer: {
    width: ms(60),
    height: ms(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(8),
  },
  labImage: {
    width: '100%',
    height: '100%',
  },
  labName: {
    fontSize: ms(10),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: ms(14),
  },
  emptyCard: {
    width: (width - ms(50)) / 3,
  },
  categoryDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: ms(20),
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

export default CompanyLabTests;
