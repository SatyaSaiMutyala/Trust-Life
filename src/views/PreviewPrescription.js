import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { s, vs, ms } from 'react-native-size-matters';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { bold, regular } from '../config/Constants';
import { blackColor, primaryColor, whiteColor } from '../utils/globalColors';
import { StatusBar } from '../components/StatusBar';
import PrimaryButton from '../utils/primaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PREVIEW_IMAGE_HEIGHT = vs(300);
const THUMBNAIL_SIZE = ms(90);


const pickerOptions = {
  mediaType: 'photo',
  quality: 0.8,
  selectionLimit: 1,
};

const PreviewPrescription = ({ route, navigation }) => {
  const initialUri = route.params?.initialImageUri ?? null;

  /* ✅ SINGLE SOURCE OF TRUTH */
  const [uploadedImages, setUploadedImages] = useState([]);
  const [mainPreviewUri, setMainPreviewUri] = useState(null);
  const insets = useSafeAreaInsets();
  const hasBottomOverlap = insets.bottom > 20;

  /* ✅ Load image from props ONCE */
  useEffect(() => {
    if (initialUri) {
      setUploadedImages([initialUri]);
      setMainPreviewUri(initialUri);
    }
  }, [initialUri]);

  const handleAddMore = () => {
    launchImageLibrary(pickerOptions, res => {
      if (res.didCancel || res.errorCode) return;

      const uri = res.assets?.[0]?.uri;
      if (!uri) return;

      setUploadedImages(prev => [...prev, uri]);
      setMainPreviewUri(uri);
    });
  };

  const handleRemoveImage = index => {
    setUploadedImages(prev => {
      const updated = prev.filter((_, i) => i !== index);

      if (prev[index] === mainPreviewUri) {
        setMainPreviewUri(updated[0] ?? null);
      }

      if (!updated.length) {
        navigation.goBack();
      }

      return updated;
    });
  };


  const handleSubmit = () => {
    console.log('yeah man this is hiting --------------');
    navigation.navigate('SubmitPrescription');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />

      <View style={styles.secondHeader}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon
              type={Icons.Ionicons}
              name="arrow-back"
              color={blackColor}
              size={ms(20)}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Uploaded Prescription</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ✅ MAIN PREVIEW */}
          <View style={styles.mainPreviewWrapper}>
            {mainPreviewUri && (
              <Image
                source={{ uri: mainPreviewUri }}
                style={styles.mainPreviewImage}
                resizeMode="cover"
              />
            )}
          </View>

          {/* ✅ THUMBNAILS */}
          <ScrollView contentContainerStyle={styles.thumbnailsRow} horizontal showsHorizontalScrollIndicator={false}>
            {/* Add More */}
            <TouchableOpacity
              style={styles.addMoreContainer}
              onPress={handleAddMore}
            >
              <Icon
                type={Icons.Ionicons}
                name="add"
                color={colors.theme_fg_two}
                size={ms(30)}
              />
              <Text style={styles.addMoreText}>
                Add more prescription
              </Text>
            </TouchableOpacity>

            {/* ✅ SHOW ALL IMAGES (INCLUDING PROP IMAGE) */}
            {uploadedImages.map((uri, index) => (
              <TouchableOpacity
                key={`${uri}-${index}`}
                style={[
                  styles.thumbnailContainer,
                  uri === mainPreviewUri && styles.thumbnailSelected,
                ]}
                onPress={() => setMainPreviewUri(uri)}
              >
                <Image source={{ uri }} style={styles.thumbnailImage} />

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Icon
                    type={Icons.Ionicons}
                    name="close-circle"
                    color={colors.theme_fg_two}
                    size={ms(25)}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>

        <View style={{ marginBottom: ms(30), marginHorizontal: ms(15), marginBottom: hasBottomOverlap ? insets.bottom + ms(10) : ms(25), }}>
          <PrimaryButton title="Submit" onPress={handleSubmit} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PreviewPrescription;

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
  },
  secondHeader: {
    flex: 1,
    paddingTop: ms(50),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(10),
  },
  headerButton: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    backgroundColor: whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: ms(10),
  },
  headerTitle: {
    fontFamily: bold,
    fontSize: ms(18),
    color: blackColor,
    marginLeft: ms(10),
  },
  scrollContent: {
    paddingHorizontal: ms(15),
    // paddingBottom: vs(120),
  },
  mainPreviewWrapper: {
    marginTop: vs(20),
    marginBottom: vs(30),
    width: '100%',
    height: PREVIEW_IMAGE_HEIGHT,
    borderRadius: ms(15),
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5.46,
      },
      android: { elevation: 10 },
    }),
  },
  mainPreviewImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(15),
    columnGap: ms(15),
  },
  addMoreContainer: {
    width: ms(90),
    height: ms(90),
    borderRadius: ms(15),
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(10),
  },
  addMoreText: {
    fontFamily: regular,
    fontSize: ms(10),
    color: colors.theme_fg_two,
    textAlign: 'center',
    marginTop: vs(5),
  },
  thumbnailContainer: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: ms(8),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailSelected: {
    borderColor: colors.theme_color,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    // backgroundColor: 'colors.theme_fg_three',
    borderRadius: ms(10),
  },
});
