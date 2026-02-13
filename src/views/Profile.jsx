
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  Keyboard,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { connect, useDispatch } from 'react-redux';
import { updateProfilePicture } from '../actions/CurrentAddressActions';
import { StatusBar, StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { bold, img_url, regular, doctor } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { ms, vs } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "react-native-image-picker";
import ImgToBase64 from 'react-native-image-base64';
import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors';
import {
  LoadCustomerProfileAction,
  UpdateCustomerProfileAction,
  UploadProfilePictureAction,
  UpdateProfilePictureAction
} from '../redux/actions/CustomerProfileActions';
import ProfileShimmer from '../components/ProfileShimmer';
import SuccessModal from '../components/SuccessModal';

const { width, height } = Dimensions.get('window');

const PROFILE_IMAGE_SIZE = ms(70);

const imagePickerOptions = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery',
  base64: true,
  quality: 1,
  maxWidth: 500,
  maxHeight: 500,
};

// Helper to calculate age from DOB string
const calculateAge = (dobString) => {
  if (!dobString) return '';
  let birthDate;
  if (dobString.includes('/')) {
    const [day, month, year] = dobString.split('/');
    birthDate = new Date(year, month - 1, day);
  } else if (dobString.includes('-')) {
    birthDate = new Date(dobString);
  } else {
    return '';
  }
  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  if (now.getDate() < birthDate.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  return `${years} Years, ${months} Months`;
};

// Helper to format DOB for display (e.g. "14 June 2001")
const formatDOBDisplay = (dobString) => {
  if (!dobString) return '';
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let day, month, year;
  if (dobString.includes('/')) {
    [day, month, year] = dobString.split('/');
  } else if (dobString.includes('-')) {
    [year, month, day] = dobString.split('-');
  } else {
    return dobString;
  }
  return `${parseInt(day)} ${monthNames[parseInt(month) - 1]} ${year}`;
};

const MANAGE_ITEMS = [
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    subtitle: 'View and manage your lifestyle information.',
    iconType: Icons.MaterialCommunityIcons,
    iconName: 'run',
  },
  {
    id: 'medical',
    title: 'Medical History',
    subtitle: 'View and manage your medical history details.',
    iconType: Icons.MaterialCommunityIcons,
    iconName: 'clipboard-pulse-outline',
  },
  {
    id: 'family',
    title: 'Family Members',
    subtitle: 'Add, view, and manage your family members.',
    iconType: Icons.MaterialCommunityIcons,
    iconName: 'account-group-outline',
  },
];

// --- Main Profile Component ---
const Profile = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [customer_name, setCustomerName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [profile_timer, setProfileTimer] = useState(true);
  const [wallet_amount, setWalletAmount] = useState(0);

  // Success Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Profile Details States
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [heightValue, setHeightValue] = useState('');
  const [healthConditions, setHealthConditions] = useState([]);
  const [habbitsValue, setHabbitsValue] = useState('');

  // Date Picker States
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState('');

  // Show success modal helper
  const showSuccess = (title, message) => {
    setSuccessTitle(title);
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setIsInitialLoad(true);
      view_profile(true);
    });
    return unsubscribe;
  }, []);

  // --- Image Picker & Upload Logic ---
  const select_photo = async () => {
    if (profile_timer) {
      ImagePicker.launchImageLibrary(imagePickerOptions, async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          Alert.alert('ImagePicker Error', response.error);
        } else {
          await ImgToBase64.getBase64String(response.assets[0].uri)
            .then(async base64String => {
              await profileimageupdate(base64String);
            }).catch(err => console.log(err));
        }
      });
    } else {
      Alert.alert('Hold On', 'Please try uploading after 20 seconds');
    }
  };

  const profileimageupdate = async (data_img) => {
    setUpdating(true);
    dispatch(UploadProfilePictureAction(data_img))
      .then(async (response) => {
        if (response.result) {
          await profile_image_update(response.result);
        } else {
          setUpdating(false);
        }
      })
      .catch((error) => {
        setUpdating(false);
        Alert.alert('Error', 'Error while uploading profile picture. Try again later.');
      });
  };

  const profile_image_update = async (image_url) => {
    dispatch(UpdateProfilePictureAction(global.id, image_url))
      .then(async (response) => {
        setUpdating(false);
        if (response.status == 1) {
          showSuccess("Profile Picture Updated!", "Your profile picture has been updated successfully.");
          saveProfilePicture(image_url);
          setProfileTimer(false);
          setTimeout(function () { setProfileTimer(true); }, 20000);
        } else {
          Alert.alert("Error", response.message);
        }
      })
      .catch((error) => {
        setUpdating(false);
        Alert.alert("Error", "Sorry something went wrong during profile picture update.");
      });
  };

  const saveProfilePicture = async (data) => {
    try {
      await AsyncStorage.setItem('profile_picture', data.toString());
      props.updateProfilePicture(data.toString());
    } catch (e) {
      console.log("AsyncStorage Error", e);
    }
  };

  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem('id', data.result.id.toString());
      await AsyncStorage.setItem('customer_name', data.result.customer_name.toString());
      await AsyncStorage.setItem('email', data.result.email.toString());
      global.id = data.result.id.toString();
      global.customer_name = data.result.customer_name.toString();
      global.email = data.result.email.toString();
      view_profile(false);
    } catch (e) {
      console.log("Save Data Error", e);
    }
  };

  const view_profile = async (showShimmer = true) => {
    if (showShimmer && isInitialLoad) {
      setLoading(true);
    } else if (!isInitialLoad) {
      setUpdating(true);
    }
    dispatch(LoadCustomerProfileAction(global.id))
      .then((response) => {
        setLoading(false);
        setUpdating(false);
        setIsInitialLoad(false);
        const result = response.result;

        setEmail(result.email);
        setCustomerName(result.customer_name);
        setSurname(result.surname || '');
        props.updateProfilePicture(result.profile_picture);
        setWalletAmount(result.wallet);
        setGender(result.gender || 'male');
        setDate(result.date_of_birth || '');
        setWeight(result.weight ? String(result.weight) : '');
        setHeightValue(result.height ? String(result.height) : '');
        setHealthConditions(result.health_condition ? result.health_condition.split(',') : []);
        setHabbitsValue(result.habbits || '');

        global.phone_number = result.phone_number;
        global.phone_with_code = result.phone_with_code;

        if (result.date_of_birth) {
          const [day, month, year] = result.date_of_birth.split('/');
          setDefaultDate(new Date(year, month - 1, day));
        }
      })
      .catch((error) => {
        setLoading(false);
        setUpdating(false);
        setIsInitialLoad(false);
        console.log('Fetch Profile Error:', error);
      });
  };

  const handleManagePress = (id) => {
    switch (id) {
      case 'lifestyle':
        navigation.navigate('LifestyleInfo', { isEdit: true });
        break;
      case 'medical':
        navigation.navigate('MedicalHistory', { isEdit: true });
        break;
      case 'family':
        navigation.navigate('AddFamilyScreen', { isEdit: true });
        break;
      default:
        break;
    }
  };

  // Show shimmer loading while fetching profile
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar2 />
        <ProfileShimmer />
      </SafeAreaView>
    );
  }

  const genderDisplay = gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : '';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar2 />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successTitle}
        message={successMessage}
        buttonText="Done"
      />

      {/* Updating Overlay */}
      {updating && (
        <View style={styles.updatingOverlay}>
          <View style={styles.updatingBox}>
            <Text style={styles.updatingText}>Updating...</Text>
          </View>
        </View>
      )}

      <LinearGradient
        colors={globalGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.12]}
        style={styles.flex1}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackButtonClick}
          >
            <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Personal Information Card */}
          <View style={styles.personalCard}>
            <Text style={styles.cardSectionTitle}>Personal Information</Text>

            {/* Profile Row */}
            <View style={styles.profileRow}>
              <TouchableOpacity onPress={select_photo} activeOpacity={0.8}>
                <View style={styles.profileImageWrapper}>
                  <Image
                    style={styles.profileImage}
                    resizeMode="cover"
                    source={
                      props.profile_picture
                        ? { uri: `${img_url}${props.profile_picture}` }
                        : doctor
                    }
                  />
                  <View style={styles.verifiedBadge}>
                    <Icon type={Icons.Entypo} name="camera" color={whiteColor} size={ms(10)} />
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{customer_name || 'User'}</Text>
                {date ? (
                  <Text style={styles.profileAge}>{calculateAge(date)}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('PersonalDetails', { isEdit: true })}
                activeOpacity={0.7}
              >
                <Icon type={Icons.Feather} name="edit-2" color={blackColor} size={ms(14)} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Info Rows */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Surname</Text>
                <Text style={styles.infoValue}>{surname || '-'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{genderDisplay || '-'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{formatDOBDisplay(date) || '-'}</Text>
              </View>
            </View>
          </View>

          {/* Manage Your Details */}
          <Text style={styles.manageSectionTitle}>Manage Your Details</Text>

          {MANAGE_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.manageCard}
              activeOpacity={0.7}
              onPress={() => handleManagePress(item.id)}
            >
              <View style={styles.manageIconWrapper}>
                <Icon
                  type={item.iconType}
                  name={item.iconName}
                  color={blackColor}
                  size={ms(22)}
                />
              </View>
              <View style={styles.manageTextWrapper}>
                <Text style={styles.manageTitle}>{item.title}</Text>
                <Text style={styles.manageSubtitle}>{item.subtitle}</Text>
              </View>
              <Icon
                type={Icons.Feather}
                name="chevron-right"
                color={blackColor}
                size={ms(20)}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
  },
  flex1: {
    flex: 1,
  },
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
  scrollContent: {
    paddingHorizontal: ms(20),
    paddingBottom: vs(30),
  },

  // Personal Information Card
  personalCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: ms(16),
    padding: ms(18),
  },
  cardSectionTitle: {
    fontFamily: bold,
    fontSize: ms(16),
    color: blackColor,
    marginBottom: vs(16),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(18),
  },
  profileImageWrapper: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    borderWidth: ms(2),
    borderColor: '#E5E7EB',
    overflow: 'visible',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: PROFILE_IMAGE_SIZE / 2,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: ms(2),
    borderColor: whiteColor,
  },
  profileInfo: {
    flex: 1,
    marginLeft: ms(14),
  },
  profileName: {
    fontFamily: bold,
    fontSize: ms(16),
    color: blackColor,
  },
  profileAge: {
    fontFamily: regular,
    fontSize: ms(12),
    color: '#6B7280',
    marginTop: vs(2),
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    borderRadius: ms(20),
    paddingHorizontal: ms(14),
    paddingVertical: vs(6),
    gap: ms(6),
  },
  editButtonText: {
    fontFamily: bold,
    fontSize: ms(13),
    color: blackColor,
  },

  // Info Rows
  infoSection: {
    marginTop: vs(4),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(12),
  },
  infoLabel: {
    fontFamily: regular,
    fontSize: ms(13),
    color: '#6B7280',
  },
  infoValue: {
    fontFamily: bold,
    fontSize: ms(13),
    color: blackColor,
  },
  divider: {
    height: ms(0.5),
    backgroundColor: '#E5E7EB',
  },

  // Manage Your Details
  manageSectionTitle: {
    fontFamily: bold,
    fontSize: ms(16),
    color: blackColor,
    marginTop: vs(24),
    marginBottom: vs(14),
  },
  manageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: ms(14),
    padding: ms(16),
    marginBottom: vs(12),
  },
  manageIconWrapper: {
    width: ms(44),
    height: ms(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageTextWrapper: {
    flex: 1,
    marginLeft: ms(14),
    marginRight: ms(10),
  },
  manageTitle: {
    fontFamily: bold,
    fontSize: ms(14),
    color: blackColor,
  },
  manageSubtitle: {
    fontFamily: regular,
    fontSize: ms(11),
    color: '#6B7280',
    marginTop: vs(2),
    lineHeight: ms(16),
  },

  // Updating Overlay
  updatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  updatingBox: {
    backgroundColor: whiteColor,
    paddingHorizontal: ms(30),
    paddingVertical: vs(15),
    borderRadius: ms(10),
    elevation: 5,
    shadowColor: blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  updatingText: {
    fontSize: ms(14),
    fontFamily: regular,
    color: blackColor,
  },
});

function mapStateToProps(state) {
  return {
    profile_picture: state.current_location.profile_picture,

  };
}

const mapDispatchToProps = (dispatch) => ({
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
