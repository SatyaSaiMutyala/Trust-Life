import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Icon, { Icons } from '../../components/Icons';
import { StatusBar2 } from '../../components/StatusBar';
import { primaryColor, whiteColor, blackColor } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';

// ── Filter options ────────────────────────────────────────────────────────────
const CATEGORIES = ['Fever', 'Pain Relief', 'Cold & Cough', 'Allergy', 'Antibiotics'];
const DOSAGES = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Drops'];
const STRENGTHS = ['250 mg', '500 mg', '650 mg', '5 ml'];
const DISCOUNTS = ['10%', '15%', '20%', '25%', '30%'];
const RATINGS = ['4★ & Above', '4.5★ & Above'];

// ── Chip component ────────────────────────────────────────────────────────────
const Chip = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    {selected && (
      <Icon type={Icons.Ionicons} name="close-circle" size={ms(16)} color={primaryColor} style={{ marginLeft: ms(4) }} />
    )}
  </TouchableOpacity>
);

// ── Section component ─────────────────────────────────────────────────────────
const FilterSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.chipsRow}>{children}</View>
  </View>
);

// ── Main Screen ───────────────────────────────────────────────────────────────
const MedicineFilters = () => {
  const navigation = useNavigation();

  const [selectedCategories, setSelectedCategories] = useState(['Fever']);
  const [selectedDosage, setSelectedDosage] = useState([]);
  const [selectedStrength, setSelectedStrength] = useState(['500 mg']);
  const [selectedDiscount, setSelectedDiscount] = useState(['20%']);
  const [selectedRating, setSelectedRating] = useState([]);
  const [priceRange] = useState([200, 500]);

  const toggleSelection = useCallback((arr, setArr, value) => {
    if (arr.includes(value)) {
      setArr(arr.filter((v) => v !== value));
    } else {
      setArr([...arr, value]);
    }
  }, []);

  const handleApply = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar2 />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Icon type={Icons.Ionicons} name="close" size={ms(22)} color="#888" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Category */}
        <FilterSection title="Category">
          {CATEGORIES.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={selectedCategories.includes(item)}
              onPress={() => toggleSelection(selectedCategories, setSelectedCategories, item)}
            />
          ))}
        </FilterSection>

        {/* Dosage */}
        <FilterSection title="Dosage">
          {DOSAGES.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={selectedDosage.includes(item)}
              onPress={() => toggleSelection(selectedDosage, setSelectedDosage, item)}
            />
          ))}
        </FilterSection>

        {/* Strength */}
        <FilterSection title="Strength (mg/ml)">
          {STRENGTHS.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={selectedStrength.includes(item)}
              onPress={() => toggleSelection(selectedStrength, setSelectedStrength, item)}
            />
          ))}
        </FilterSection>

        {/* Discounts */}
        <FilterSection title="Discounts">
          {DISCOUNTS.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={selectedDiscount.includes(item)}
              onPress={() => toggleSelection(selectedDiscount, setSelectedDiscount, item)}
            />
          ))}
        </FilterSection>

        {/* Price Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.sliderContainer}>
            {/* Visual slider track */}
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { left: '20%', right: '50%' }]} />
              <View style={[styles.sliderThumb, { left: '20%' }]} />
              <View style={[styles.sliderThumb, { left: '50%' }]} />
            </View>
            <View style={styles.priceLabelsRow}>
              <View style={styles.priceLabelBox}>
                <Text style={styles.priceLabelText}>₹{priceRange[0]}</Text>
              </View>
              <View style={styles.priceLabelBox}>
                <Text style={styles.priceLabelText}>₹{priceRange[1]}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rating */}
        <FilterSection title="Rating">
          {RATINGS.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={selectedRating.includes(item)}
              onPress={() => toggleSelection(selectedRating, setSelectedRating, item)}
            />
          ))}
        </FilterSection>

        <View style={{ height: vs(30) }} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.applyContainer}>
        <PrimaryButton onPress={handleApply} title='Apply Filters' />
      </View>
    </SafeAreaView>
  );
};

export default MedicineFilters;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(20),
    paddingTop: ms(55),
    paddingBottom: vs(10),
  },
  headerTitle: {
    fontSize: ms(24),
    fontWeight: 'bold',
    color: blackColor,
  },
  closeBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    paddingHorizontal: ms(20),
    paddingTop: vs(10),
  },

  // Section
  section: {
    marginBottom: vs(22),
  },
  sectionTitle: {
    fontSize: ms(15),
    fontWeight: '600',
    color: blackColor,
    marginBottom: vs(10),
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(8),
  },

  // Chip
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: ms(20),
    paddingVertical: vs(8),
    paddingHorizontal: ms(16),
    backgroundColor: whiteColor,
  },
  chipSelected: {
    borderColor: primaryColor,
    backgroundColor: '#E8F5E9',
  },
  chipText: {
    fontSize: ms(13),
    color: '#555',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: blackColor,
    fontWeight: '600',
  },

  // Slider
  sliderContainer: {
    paddingHorizontal: ms(10),
    marginTop: vs(5),
  },
  sliderTrack: {
    height: vs(4),
    backgroundColor: '#E5E7EB',
    borderRadius: ms(2),
    marginVertical: vs(14),
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: primaryColor,
    borderRadius: ms(2),
  },
  sliderThumb: {
    position: 'absolute',
    top: vs(-8),
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    backgroundColor: whiteColor,
    borderWidth: 2,
    borderColor: primaryColor,
    marginLeft: ms(-10),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  priceLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(6),
  },
  priceLabelBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: ms(8),
    paddingVertical: vs(6),
    paddingHorizontal: ms(14),
  },
  priceLabelText: {
    fontSize: ms(13),
    fontWeight: '600',
    color: blackColor,
  },

  // Apply button
  applyContainer: {
    paddingHorizontal: ms(20),
    paddingBottom: vs(25),
    paddingTop: vs(10),
    backgroundColor: whiteColor,
  },
  applyBtn: {
    backgroundColor: primaryColor,
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: ms(16),
    fontWeight: '700',
    color: whiteColor,
  },
});
