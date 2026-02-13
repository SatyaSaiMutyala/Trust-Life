// DashboardHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon, { Icons } from './path_to_your_icons'; // Adjust import

const { width } = Dimensions.get('window');

const DashboardHeader = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: '#007AFF', 
      }}
    >
      {/* Hello, [Name] */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: width * 0.055, fontWeight: 'bold' }}>Hello,</Text>
        <Text
          style={{
            color: '#fff',
            fontSize: width * 0.055,
            fontWeight: 'bold',
            marginLeft: 5,
          }}
        >
          {global.customer_name}
        </Text>
      </View>

      {/* Icons */}
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={{ paddingHorizontal: 5 }}
        >
          <Icon
            type={Icons.Ionicons}
            name="notifications-outline"
            style={{ fontSize: width * 0.06, color: '#fff' }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('More')}
          style={{ paddingHorizontal: 7 }}
        >
          <Icon
            type={Icons.Ionicons}
            name="person-circle-outline"
            style={{ fontSize: width * 0.06, color: '#fff' }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardHeader;
