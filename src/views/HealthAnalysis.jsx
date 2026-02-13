import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { StatusBar, StatusBar2 } from '../components/StatusBar'
import LinearGradient from 'react-native-linear-gradient'
import { bold, docIcon, graph, progress, text } from '../config/Constants';
import { Icon } from 'react-native-elements';
import { Icons } from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { blackColor, globalGradient, grayColor, primaryColor, whiteColor } from '../utils/globalColors';
import { Image } from 'react-native';
import { s, vs, ms,  } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const HealthAnalysis = () => {

  const navigation = useNavigation();
  const [group, setGroup] = useState(false);
  const [individual, setIndividual] = useState(false);

  const navigate = (type) => {
    navigation.navigate('MyReport', { type: type })
  }
  const cardWidth = (width - (4 * 15)) / 2;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar2 />

      {/* Full Screen Gradient */}
      <LinearGradient
        colors={globalGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.3]}
        style={styles.fullGradient}
      >

        {/* Header Section */}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Health Analysis</Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentArea}>
          <View style={{ alignItems: 'center', paddingVertical: 20, }}>
            <Image source={docIcon} style={{ width: 52, height: 55, }} />
          </View>
          <Text style={styles.checkHealthStatus}>Track Your Medical Reports</Text>
          <Text style={styles.checkHealthStatusSubtitle}>
            Get quick insights from your latest test and track your health with confidence.
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10, gap: 15 }}>
            <TouchableOpacity
              onPress={() => {
                setGroup(false);
                setIndividual(true);
                navigate('individual');
              }}
              style={{
                width: cardWidth,
                backgroundColor: '#FFFFFF',
                borderRadius: 15,
                padding: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 5,
                marginHorizontal: 5,
                marginBottom: 15,
              }}
            >
              <View style={{ marginBottom: 10, justifyContent: 'flex-end' }}>
                <Image
                  source={progress}
                  style={{
                    width: cardWidth * 0.8,
                    height: cardWidth * 0.5,
                    resizeMode: 'contain',
                    // alignSelf: 'end',
                  }}
                />
              </View>
              {/* Title */}
              <Text
                style={{
                  fontSize: width * 0.045,
                  fontWeight: 'bold',
                  color: '#000000',
                  marginBottom: 8,
                }}
                numberOfLines={2}
              >
                Search Individual Tests
              </Text>
              {/* Subtitle/Description */}
              <Text
                style={{
                  fontSize: width * 0.032,
                  color: '#666666',
                  lineHeight: 18,
                }}
                numberOfLines={3}
              >
                Your latest health insight — clear, simple, and easy to track.
              </Text>
              <View style={{ marginLeft: 'auto', paddingVertical: 2 }}>
                <Icon
                  type={Icons.Ionicons}
                  name="arrow-forward"
                  color={whiteColor}
                  size={20}
                  style={styles.headerButton}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIndividual(false);
                setGroup(true);
                navigate('group');
              }}
              style={{
                width: cardWidth,
                backgroundColor: '#FFFFFF',
                borderRadius: 15,
                padding: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 5,
                marginHorizontal: 5,
                marginBottom: 15,
              }}
            >
              <View style={{ marginBottom: 10, justifyContent: 'flex-end' }}>
                <Image
                  source={graph}
                  style={{
                    width: cardWidth * 0.8,
                    height: cardWidth * 0.5,
                    resizeMode: 'contain',
                    // alignSelf: 'end',
                  }}
                />
              </View>

              {/* Title */}
              <Text
                style={{
                  fontSize: width * 0.045,
                  fontWeight: 'bold',
                  color: '#000000',
                  marginBottom: 8,
                }}
              >
                Quarterly / Annual Analysis
              </Text>
              <Text
                style={{
                  fontSize: width * 0.032,
                  color: '#666666',
                  lineHeight: 18,
                }}
                numberOfLines={3}
              >
                View your past results, compare trends, and keep your health in check all year round.
              </Text>
              <View style={{ marginLeft: 'auto', paddingVertical: 2 }}>
                <Icon
                  type={Icons.Ionicons}
                  name="arrow-forward"
                  color={whiteColor}
                  size={20}
                  style={styles.headerButton}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: ms(60) }}>
            <Image source={text} style={{ width: 'auto', height: vs(120), resizeMode:'contain' }} />
          </View>

        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

export default HealthAnalysis

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullGradient: {
    flex: 1,
    paddingHorizontal: ms(20),
    // paddingTop: height * 0.06
    paddingTop: ms(50),
  },
  headerContent: {
    alignItems: 'flex-start',
    // marginBottom: 15,
  },
  headerTitle: {
    color: whiteColor,
    fontFamily: bold,
    fontSize: ms(22),
  },
  contentArea: {
    flex: 1,
    paddingTop: ms(50),
    justifyContent: 'center'
  },
  checkHealthStatus: {
    fontSize: 20,
    fontFamily: bold,
    color: blackColor,
    marginBottom: 5,
    textAlign: 'center'
  },
  checkHealthStatusSubtitle: {
    fontSize: 14,
    color: blackColor,
    marginBottom: 30,
    textAlign: 'center'
  },
  card: {
    backgroundColor: whiteColor,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'red'
  },
  cardImagePlaceholder: {
    width: 'auto',
    height: 100,
    backgroundColor: '#F0E7E7',
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: bold,
    color: blackColor,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'gray',
  },

  headerButton: {
    backgroundColor: whiteColor,
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    justifyContent: 'center',
    alignItems: 'center',
  },

})
