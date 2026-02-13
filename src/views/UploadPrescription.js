import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors';
import LinearGradient from 'react-native-linear-gradient';
import { s, vs, ms } from 'react-native-size-matters';
import Icon, { Icons } from '../components/Icons';
import { agent, bold, text } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');

const stepColors = ['#48b6a3', '#5f95e6', '#e6b05f', '#e6705f'];

const UploadPrescription = ({ navigation }) => {
  const [previewUri, setPreviewUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // const navigation = useNavigation();
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs camera access to take pictures',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImageSelection = (response) => {
    console.log('Image selection response:', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (response.errorCode) {
      console.log('Image picker error:', response.errorCode, response.errorMessage);
      Alert.alert('Error', response.errorMessage);
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      console.log('Navigating with image URI:', uri);
      // Navigate to the new screen, passing the selected image URI
      navigation.navigate('PreviewPrescription', { initialImageUri: uri });
    } else {
      console.log('No assets found in response');
    }
  };

  const onGalleryPress = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      console.log('Gallery result:', result);
      handleImageSelection(result);
    } catch (error) {
      console.log('Gallery error:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const onCameraPress = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required.');
      return;
    }

    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
      });

      console.log('Camera result:', result);
      handleImageSelection(result);
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const onUpload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={globalGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 3 }}
        locations={[0, 0.08]}
        style={styles.fullGradient}
      >
        {/* Header - Back Button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ms(16) }}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
          </TouchableOpacity>
          <Text style={{ fontFamily: bold, fontSize: ms(20), color: whiteColor }}>Order by Prescription</Text>
        </View>
        <View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Upload Options */}
          <View style={styles.uploadSection}>
            <Text style={styles.uploadLabel}>Upload your prescription to get personalized test recommendations based on it.</Text>
            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.uploadButton} onPress={onGalleryPress} activeOpacity={0.8}>
                <Icon type={Icons.Ionicons} name="image-outline" size={20} color="#174453" />
                <Text style={styles.uploadButtonText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={onCameraPress} activeOpacity={0.8}>
                <Icon type={Icons.Ionicons} name="camera-outline" size={20} color="#174453" />
                <Text style={styles.uploadButtonText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Image
              source={agent}
              style={{ width: ms(70), height: ms(70), marginRight: ms(10) }}
              resizeMode="contain"
            />
            <View style={{ flexDirection: 'column', justifyContent: 'start', flex: 1, flexShrink: 1 }}>
              <Text style={{ fontSize: ms(11), color: '#6B7280' }} numberOfLines={2} ellipsizeMode='tail'>After you upload your prescription, our agent will get in touch with you</Text>
              <Text style={{ color: '#208A7B', fontFamily: bold, marginTop: ms(2) }}>5 Mins</Text>
            </View>
          </View>

          {/* Prescription Card */}
          <View style={styles.cardShadow}>
            <View style={styles.card}>
              <View style={styles.sampleBanner}>
                <Text style={styles.bannerText}>SAMPLE PRESCRIPTION</Text>
              </View>

              <View style={styles.prescriptionBox}>
                <>
                  <View style={styles.boxRow}>
                    <View style={styles.dashedBox}>
                      <Text style={styles.drName}>Dr. Nidhi Sharma</Text>
                      <Text style={styles.drText}>Name of the Hospital/Clinic</Text>
                      <Text style={styles.drText}>Address of Hospital/Clinic</Text>
                      <Text style={styles.drText}>Regd. no.: 1234567</Text>
                    </View>
                    <View style={styles.arrowLine}>
                      <View style={styles.circleStep}>
                        <Text style={styles.stepNum}>1</Text>
                      </View>
                      <Text style={styles.arrowLabel}>Doctor’s details</Text>
                    </View>
                  </View>
                  <View style={styles.boxRow}>
                    <View style={styles.dashedBox}>
                      <Text style={styles.drText}>10.10.2020</Text>
                    </View>
                    <View style={styles.arrowLine}>
                      <View style={[styles.circleStep, { backgroundColor: stepColors[1] }]}>
                        <Text style={styles.stepNum}>2</Text>
                      </View>
                      <Text style={styles.arrowLabel}>Date of prescription</Text>
                    </View>
                  </View>
                  <View style={styles.boxRow}>
                    <View style={styles.dashedBox}>
                      <Text style={styles.drText}>Rahul Rane    20/M</Text>
                    </View>
                    <View style={styles.arrowLine}>
                      <View style={[styles.circleStep, { backgroundColor: stepColors[2] }]}>
                        <Text style={styles.stepNum}>3</Text>
                      </View>
                      <Text style={styles.arrowLabel}>Patient’s details</Text>
                    </View>
                  </View>
                  <View style={styles.boxRow}>
                    <View style={styles.dashedBox}>
                      <Text style={styles.drText}>...</Text>
                    </View>
                    <View style={styles.arrowLine}>
                      <View style={[styles.circleStep, { backgroundColor: stepColors[3] }]}>
                        <Text style={styles.stepNum}>4</Text>
                      </View>
                      <Text style={styles.arrowLabel}>Lab Test details</Text>
                    </View>
                  </View>
                </>
              </View>
            </View>
          </View>

          <View>
            <Text style={{ fontSize: ms(11), color: '#6B7280' }} numberOfLines={2} ellipsizeMode='tail'>Note : Your prescription will be kept secure and used only for verification purposes.</Text>
          </View>

          <View>
            <View style={{ marginBottom: ms(60), marginTop: ms(20) }}>
              <Image source={text} resizeMode='contain' style={{ width: 'auto', height: vs(120) }} />
            </View>
          </View>

          {/* Success Modal */}
          <Modal
            visible={showSuccessModal}
            transparent
            animationType="fade"
            onRequestClose={closeSuccessModal}
          >
            <View style={modalStyles.modalOverlay}>
              <View style={modalStyles.modalContainer}>
                <Text style={modalStyles.title}>Uploaded Successfully</Text>
                <Text style={modalStyles.message}>
                  Your prescription has been uploaded successfully.
                </Text>
                <TouchableOpacity style={modalStyles.button} onPress={closeSuccessModal}>
                  <Text style={modalStyles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: whiteColor },
  fullGradient: {
    flex: 1,
    paddingHorizontal: ms(20),
    paddingTop: ms(50),
  },
  headerButton: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    backgroundColor: whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(10)
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    marginTop: 10,
    marginBottom: 3,
  },
  header: { fontSize: 22, fontWeight: '800', color: '#1a232f' },
  cardShadow: {
    alignSelf: 'center',
    width: width * 0.93,
    shadowColor: '#b8c1d1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderRadius: 18,
    backgroundColor: 'transparent',
    marginTop: 6,
    marginBottom: 24,
  },
  sampleImagePreview: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 14,
    backgroundColor: '#f0f5fa',
    alignSelf: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#dde5f3',
  },
  card: {
    borderRadius: 18,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 2,
  },
  sampleBanner: {
    backgroundColor: '#16ad92',
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginLeft: 20,
    marginBottom: 9,
  },
  bannerText: { color: '#fff', fontWeight: '700', letterSpacing: 1, fontSize: 13 },
  prescriptionBox: {
    padding: 12,
    paddingLeft: 17,
  },
  boxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 13 },
  dashedBox: {
    borderWidth: 1.5,
    borderColor: '#bccddb',
    borderRadius: 7,
    borderStyle: 'dashed',
    width: width * 0.39,
    minHeight: 38,
    justifyContent: 'center',
    padding: 7,
    backgroundColor: '#f7faf9',
  },
  arrowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 18,
  },
  circleStep: {
    backgroundColor: '#65bdb4',
    borderRadius: 16,
    width: 29,
    height: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },
  stepNum: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  arrowLabel: { fontSize: 15, color: '#5d778c', fontWeight: '600' },
  drName: { fontWeight: '700', fontSize: 13, marginBottom: 2, color: '#0c3e4c' },
  drText: { color: '#395470', fontSize: 12, fontWeight: '400' },
  uploadSection: { marginTop: 6, alignItems: 'center' },
  uploadLabel: { color: '#6B7280', fontSize: ms(12), marginBottom: 12, textAlign: 'center', },
  uploadButtons: { flexDirection: 'row', marginBottom: 14, gap: 16 },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f9fc',
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: primaryColor,
  },
  uploadButtonText: { color: '#174453', fontWeight: '700', fontSize: 16, marginLeft: 7 },
  uploadMainButton: {
    backgroundColor: '#00b894',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 25,
    alignItems: 'center',
    width: width * 0.52,
    alignSelf: 'center',
  },
  uploadMainText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(33,33,33,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00b894',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#556974',
    textAlign: 'center',
    marginBottom: 22,
  },
  button: {
    backgroundColor: '#00b894',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
});

export default UploadPrescription;
