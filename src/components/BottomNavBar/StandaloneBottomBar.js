import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Icon, { Icons } from '../Icons';
import { whiteColor, primaryColor } from '../../utils/globalColors';

// activeTab: 'back' | 'doctors' | 'appointments' | 'more'
const StandaloneBottomBar = ({ activeTab = 'doctors' }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.goBack()}>
                <Icon
                    type={Icons.Ionicons}
                    name="arrow-back"
                    color={activeTab === 'back' ? primaryColor : '#888'}
                    size={ms(22)}
                />
                <Text style={[styles.navLabel, activeTab === 'back' && styles.navLabelActive]}>
                    Back
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('DoctorConsultation')}>
                <Icon
                    type={Icons.MaterialCommunityIcons}
                    name="stethoscope"
                    color={activeTab === 'doctors' ? primaryColor : '#888'}
                    size={ms(24)}
                />
                <Text style={[styles.navLabel, activeTab === 'doctors' && styles.navLabelActive]}>
                    Doctors
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('DoctorAppointments')}
            >
                <Icon
                    type={Icons.Ionicons}
                    name="calendar-outline"
                    color={activeTab === 'appointments' ? primaryColor : '#888'}
                    size={ms(22)}
                />
                <Text style={[styles.navLabel, activeTab === 'appointments' && styles.navLabelActive]}>
                    Appointments
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('More')}
            >
                <Icon
                    type={Icons.Ionicons}
                    name="ellipsis-horizontal"
                    color={activeTab === 'more' ? primaryColor : '#888'}
                    size={ms(22)}
                />
                <Text style={[styles.navLabel, activeTab === 'more' && styles.navLabelActive]}>
                    More
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default StandaloneBottomBar;

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: vs(10),
        paddingBottom: vs(14),
        backgroundColor: whiteColor,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -2 },
    },
    navItem: {
        alignItems: 'center',
        gap: vs(3),
        flex: 1,
    },
    navLabel: {
        fontSize: ms(10),
        color: '#888',
        fontWeight: '500',
    },
    navLabelActive: {
        color: primaryColor,
        fontWeight: '700',
    },
});
