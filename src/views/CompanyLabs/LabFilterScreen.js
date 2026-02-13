import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';
import Icon, { Icons } from '../../components/Icons';
import { StatusBar2 } from '../../components/StatusBar';
import { globalGradient, primaryColor, whiteColor, blackColor } from '../../utils/globalColors';

const filterData = {
  Gender: [
    { label: 'Male', icon: 'search-outline' },
    { label: 'Female', icon: 'search-outline' },
  ],
  Age: [
    { label: 'Infant' },
    { label: 'Kids' },
    { label: 'Teenage' },
    { label: 'Adults' },
  ],
  Organs: [
    { label: 'Heart' },
    { label: 'Thyroid' },
    { label: 'Lungs' },
    { label: 'Adults' },
  ],
  Lifestyle: [
    { label: 'Smoker' },
    { label: 'Drinker' },
    { label: 'Fitness' },
    { label: 'Obesity' },
  ],
  Seasonal: [
    { label: 'Summer' },
    { label: 'Winter' },
    { label: 'Monsoon' },
    { label: 'Rainy' },
  ],
  'Medical Conditions': [
    { label: 'Fever' },
    { label: 'Diabetes' },
    { label: 'Vitamins Deficiency' },
  ],
};

const defaultSelected = {
  Gender: ['Male'],
  Age: ['Adults'],
  Organs: ['Thyroid'],
  Lifestyle: ['Fitness'],
  Seasonal: ['Summer'],
  'Medical Conditions': ['Fever'],
};

const LabFilterScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(defaultSelected);

  const toggleFilter = (category, label) => {
    setSelected(prev => {
      const current = prev[category] || [];
      if (current.includes(label)) {
        return { ...prev, [category]: current.filter(item => item !== label) };
      }
      return { ...prev, [category]: [...current, label] };
    });
  };

  const isSelected = (category, label) => {
    return (selected[category] || []).includes(label);
  };

  const handleApply = () => {
    navigation.goBack();
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Icon type={Icons.Ionicons} name="close" size={ms(20)} color={blackColor} />
          </TouchableOpacity>
        </View>

        {/* Filter Sections */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {Object.entries(filterData).map(([category, items]) => (
            <View key={category} style={styles.section}>
              <Text style={styles.sectionTitle}>{category}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                {items.map((item) => {
                  const active = isSelected(category, item.label);
                  return (
                    <TouchableOpacity
                      key={item.label}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => toggleFilter(category, item.label)}
                      activeOpacity={0.7}
                    >
                      {item.icon && (
                        <Icon
                          type={Icons.Ionicons}
                          name={item.icon}
                          size={ms(14)}
                          color={active ? whiteColor : '#666'}
                        />
                      )}
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {item.label}
                      </Text>
                      {active && (
                        <TouchableOpacity
                          onPress={() => toggleFilter(category, item.label)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Icon type={Icons.Ionicons} name="close-circle" size={ms(16)} color={whiteColor} />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ))}

          <View style={{ height: ms(100) }} />
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.applyContainer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: ms(55),
    paddingBottom: ms(15),
    paddingHorizontal: ms(20),
  },
  headerTitle: {
    fontSize: ms(22),
    fontWeight: 'bold',
    color: blackColor,
  },
  closeButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scrollContent: {
    paddingHorizontal: ms(20),
    paddingTop: ms(10),
  },
  section: {
    marginBottom: ms(22),
  },
  sectionTitle: {
    fontSize: ms(14),
    fontWeight: '600',
    color: blackColor,
    marginBottom: ms(12),
  },
  chipsRow: {
    flexDirection: 'row',
    gap: ms(10),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: whiteColor,
    borderRadius: ms(22),
    paddingHorizontal: ms(16),
    paddingVertical: vs(10),
    gap: ms(6),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipActive: {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  },
  chipText: {
    fontSize: ms(13),
    fontWeight: '500',
    color: blackColor,
  },
  chipTextActive: {
    color: whiteColor,
  },
  applyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: ms(20),
    paddingBottom: ms(30),
    paddingTop: ms(10),
    backgroundColor: whiteColor,
  },
  applyButton: {
    backgroundColor: primaryColor,
    borderRadius: ms(25),
    paddingVertical: vs(15),
    alignItems: 'center',
  },
  applyText: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: whiteColor,
  },
});

export default LabFilterScreen;
