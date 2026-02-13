// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Keyboard,
// } from 'react-native';
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';

// // --- Sample Data Structure (To simulate search results) ---
// const mockResults = [
//   {
//     id: '1',
//     name: 'Madhapur',
//     location: '9-120, Madhapur metro station, Hyderabad, Telangana',
//   },
//   {
//     id: '2',
//     name: 'Madhapur',
//     location: '9-120, Madhapur metro station, Hyderabad, Telangana',
//   },
//   {
//     id: '3',
//     name: 'Madhapur',
//     location: '9-120, Madhapur metro station, Hyderabad, Telangana',
//   },
//   {
//     id: '4',
//     name: 'Madhapur',
//     location: '9-120, Madhapur metro station, Hyderabad, Telangana',
//   },
// ];

// // --- Component for a Single Search Result Item ---
// const SearchResultItem = ({ name, location }) => (
//   <View style={styles.itemContainer}>
//     <Text style={styles.itemName}>{name}</Text>
//     <Text style={styles.itemLocation}>{location}</Text>
//     {/* Separator line */}
//     <View style={styles.separator} />
//   </View>
// );

// // --- Main Screen Component ---
// const LocationSearch = () => {
//   const [searchText, setSearchText] = useState('Madhapur');
//   const [searchResults, setSearchResults] = useState(mockResults);

//   // In a real application, this function would filter data or call an API
//   const handleSearch = (text) => {
//     setSearchText(text);
//     // Dummy logic to simulate search when input changes
//     if (text.toLowerCase().includes('madhapur')) {
//       setSearchResults(mockResults);
//     } else {
//       setSearchResults([]);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* --- Header/Navigation Bar --- */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => console.log('Go Back')} style={styles.backButton}>
//           {/* Back Arrow Icon */}
//           <Icon name="arrow-back" size={moderateScale(24)} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Search</Text>
//       </View>

//       {/* --- Search Bar Container --- */}
//       <View style={styles.searchBarContainer}>
//         <View style={styles.searchBox}>
//           {/* Search Icon */}
//           <Icon
//             name="search-outline"
//             size={moderateScale(18)}
//             color="#8E8E93"
//             style={styles.searchIcon}
//           />
//           {/* Input Field */}
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Madhapur"
//             value={searchText}
//             onChangeText={handleSearch}
//             placeholderTextColor="#C7C7CC"
//             returnKeyType="search"
//             onSubmitEditing={Keyboard.dismiss}
//           />
//         </View>
//       </View>

//       {/* --- Search Results List --- */}
//       <Text style={styles.resultsHeader}>Search results</Text>
//       <FlatList
//         data={searchResults}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <SearchResultItem name={item.name} location={item.location} />
//         )}
//         // We use an empty list footer to match the screenshot's bottom spacing
//         ListFooterComponent={<View style={{ height: verticalScale(20) }} />}
//         keyboardShouldPersistTaps="handled"
//       />
//     </SafeAreaView>
//   );
// };

// // --- Stylesheet using react-native-size-matters ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff', // White background
//   },
//   // --- Header Styles ---
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: scale(15),
//     paddingVertical: verticalScale(10),
//     borderBottomWidth: 0, // No border for a clean look
//   },
//   backButton: {
//     // Add margin to push the 'Search' title slightly
//     marginRight: scale(10),
//   },
//   headerTitle: {
//     fontSize: moderateScale(18), // Slightly larger font for the title
//     fontWeight: 'bold', // Match the visual weight
//     color: '#000',
//   },
//   // --- Search Bar Styles ---
//   searchBarContainer: {
//     paddingHorizontal: scale(15),
//     paddingBottom: verticalScale(10),
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F2F2F7', // Light gray background for the input
//     borderRadius: moderateScale(10),
//     paddingHorizontal: scale(10),
//     height: verticalScale(40), // Define height with verticalScale
//   },
//   searchIcon: {
//     marginRight: scale(8),
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: moderateScale(16),
//     color: '#000',
//     paddingVertical: 0, // Remove default vertical padding
//   },
//   // --- Results Header Styles ---
//   resultsHeader: {
//     fontSize: moderateScale(16),
//     color: '#000',
//     fontWeight: '600', // Semi-bold for "Search results"
//     paddingHorizontal: scale(15),
//     paddingTop: verticalScale(15),
//     paddingBottom: verticalScale(10),
//   },
//   // --- Result Item Styles ---
//   itemContainer: {
//     paddingHorizontal: scale(15),
//     paddingVertical: verticalScale(12),
//   },
//   itemName: {
//     fontSize: moderateScale(16),
//     fontWeight: '500', // Semi-bold-like for the place name
//     color: '#000',
//     marginBottom: verticalScale(2),
//   },
//   itemLocation: {
//     fontSize: moderateScale(14),
//     color: '#8E8E93', // Gray text for the location details
//   },
//   separator: {
//     height: StyleSheet.hairlineWidth,
//     backgroundColor: '#C7C7CC', // Light gray line
//     // Position the line to match the text indentation (not touching the left edge)
//     marginTop: verticalScale(12),
//     marginLeft: scale(0), // Full width line
//   },
// });

// export default LocationSearch;



import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { GOOGLE_KEY } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icons } from '../components/Icons';
import { s, vs, ms } from 'react-native-size-matters';
import { primaryColor, whiteColor } from '../utils/globalColors';
import { StatusBar } from '../components/StatusBar';


// Converts Google Places Text Search response into your list item shape
const mapPlacesToResults = (places = []) =>
  places.map((p, index) => ({
    id: p.place_id || String(index),
    name: p.name,
    location: p.formatted_address,
  }));

const SearchResultItem = ({ name, location, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.itemName}>{name}</Text>
    <Text style={styles.itemLocation}>{location}</Text>
    <View style={styles.separator} />
  </TouchableOpacity>
);

const LocationSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  const fetchPlaces = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setErrorMsg('');
      return;
    }
    try {
      setLoading(true);
      setErrorMsg('');
      // Using Google Places Autocomplete API (older version that's more commonly enabled)
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_KEY}`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.status === 'REQUEST_DENIED' || json.status === 'INVALID_REQUEST') {
        setErrorMsg(json.error_message || 'API request failed');
        console.log('errorr man --------->', json.error_message);
        setSearchResults([]);
        return;
      }

      if (json.status === 'OK' && json.predictions) {
        const mapped = json.predictions.map((p) => ({
          id: p.place_id,
          name: p.structured_formatting?.main_text || p.description,
          location: p.description,
        }));
        setSearchResults(mapped);
      } else {
        setSearchResults([]);
      }
    } catch (e) {
      setErrorMsg('Failed to load places');
      console.error('Error fetching places:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchChange = (text) => {
    setSearchText(text);
    // Hit API on change OR debounce as per your need
    fetchPlaces(text);
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    fetchPlaces(searchText);
  };

  const handleLocationSelect = async (item) => {
    try {
      // Create location object to save
      const locationData = {
        name: item.name,
        address: item.location,
        id: item.id,
      };

      // Check where to navigate back to
      const returnTo = route.params?.returnTo;

      if (returnTo === 'AddressList') {
        // Navigate back to AddressList with the selected location
        navigation.navigate('AddressList', { selectedLocation: locationData });
      } else {
        // Default behavior: save to AsyncStorage and go to Home
        await AsyncStorage.setItem('location', JSON.stringify(locationData));
        console.log('Location saved:', locationData);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar/>
      <View style={styles.fullGradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBox}>
            <Icon
              name="search-outline"
              size={moderateScale(18)}
              color="#8E8E93"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Location..."
              value={searchText}
              onChangeText={handleSearchChange}
              placeholderTextColor="#C7C7CC"
              returnKeyType="search"
              onSubmitEditing={handleSubmit}
            />
          </View>
        </View>

        <Text style={styles.resultsHeader}>Search results</Text>

        {loading && (
          <View style={{ paddingHorizontal: scale(15), paddingVertical: verticalScale(10) }}>
            <ActivityIndicator />
          </View>
        )}

        {!!errorMsg && (
          <View style={{ paddingHorizontal: scale(15), paddingVertical: verticalScale(10) }}>
            <Text style={{ color: 'red' }}>{errorMsg}</Text>
          </View>
        )}
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SearchResultItem
              name={item.name}
              location={item.location}
              onPress={() => handleLocationSelect(item)}
            />
          )}
          ListEmptyComponent={
            !loading && !errorMsg && (
              <View style={{ paddingHorizontal: scale(15), paddingTop: verticalScale(10) }}>
                <Text>No results</Text>
              </View>
            )
          }
          ListFooterComponent={<View style={{ height: verticalScale(20) }} />}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
    fullGradient: {
        flex: 1,
        paddingTop: ms(10),
    },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    marginBottom:ms(15)
  },
  headerButton: {
    width: ms(35),
    height: ms(35),
    borderRadius: ms(17.5),
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(10)
  },
  backButton: {
    marginRight: scale(10),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#000',
  },
  searchBarContainer: {
    paddingHorizontal: scale(15),
    paddingBottom: verticalScale(10),
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(10),
    height: verticalScale(40),
  },
  searchIcon: {
    marginRight: scale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: '#000',
    paddingVertical: 0,
  },
  resultsHeader: {
    fontSize: moderateScale(16),
    color: '#000',
    fontWeight: '600',
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(10),
  },
  itemContainer: {
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(12),
  },
  itemName: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#000',
    marginBottom: verticalScale(2),
  },
  itemLocation: {
    fontSize: moderateScale(14),
    color: '#8E8E93',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C7C7CC',
    marginTop: verticalScale(12),
    marginLeft: scale(0),
  },
});

export default LocationSearch;
