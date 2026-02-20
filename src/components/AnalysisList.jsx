import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as colors from '../assets/css/Colors';
import { Data } from '../assets/json/analysis';
import { whiteColor } from '../utils/globalColors';

const { width } = Dimensions.get('window');

const CARD_MARGIN = 10;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2; // keeps perfect 2-column layout

const AnalysisList = () => {
  const navigation = useNavigation();

  const navigate = (item) => {
    navigation.navigate('HealthAnalysisScreen');
  };

  const Item = ({ item }) => {
    const bg =
      item.condition === 'Normal'
        ? 'green'
        : item.condition === 'Critical'
        ? 'red'
        : colors.light_yellow;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigate(item)}
        style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.testName} numberOfLines={2}>
            {item.testName}
          </Text>
          <Image resizeMode="contain" style={styles.icon} source={item.url} />
        </View>

        <View style={styles.measureSection}>
          <Text style={styles.measureLabel}>{item.messureName}:</Text>
          <Text style={styles.measureValue}>{item.messureUnit}</Text>
        </View>

        <View style={styles.conditionContainer}>
          <Text style={[styles.conditionText, { backgroundColor: bg }]}>
            {item.condition}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={Data}
      renderItem={({ item }) => <Item item={item} />}
      numColumns={2}
      keyExtractor={(_, index) => index.toString()}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default AnalysisList;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: CARD_MARGIN,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: whiteColor,
    borderRadius: 16,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testName: {
    color: '#10152C',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 5,
  },
  icon: {
    width: 28,
    height: 28,
  },
  measureSection: {
    marginTop: 8,
  },
  measureLabel: {
    color: '#10152C',
    fontSize: 13,
    fontWeight: 'bold',
  },
  measureValue: {
    color: '#10152C',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  conditionContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  conditionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
});
