import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const ViewDoctorNoteScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Doctor Note</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Doctor Note Card */}
                <View style={styles.card}>
                    {/* Date & Time */}
                    <View style={styles.dateRow}>
                        <Text style={styles.dateText}>4 Feb 2026</Text>
                        <Text style={styles.timeText}>10:30 AM</Text>
                    </View>

                    {/* Hospital Name */}
                    <Text style={styles.hospitalName}>Rama Hospital</Text>

                    {/* Doctor Info */}
                    <View style={styles.doctorRow}>
                        <View style={styles.doctorAvatar}>
                            <Icon type={Icons.MaterialIcons} name="person" size={ms(32)} color="#BDBDBD" />
                        </View>
                        <View style={styles.doctorInfo}>
                            <Text style={styles.doctorName}>Dr.sindhu</Text>
                            <Text style={styles.doctorDegree}>MBBS, MD</Text>
                        </View>
                        <View style={styles.specialtyBadge}>
                            <Text style={styles.specialtyText}>Cardiologist</Text>
                        </View>
                    </View>

                    {/* View Details Button */}
                    <TouchableOpacity
                        style={styles.viewDetailsBtn}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('DoctorNoteDetailScreen')}
                    >
                        <Text style={styles.viewDetailsBtnText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewDoctorNoteScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        paddingTop: ms(48),
        paddingBottom: ms(12),
    },
    backBtn: {
        marginRight: ms(10),
    },
    headerTitle: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
    },
    scroll: {
        paddingHorizontal: ms(16),
        paddingTop: vs(14),
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
    },

    // Date row
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    dateText: {
        fontSize: ms(13),
        fontWeight: '450',
        color: blackColor,
    },
    timeText: {
        fontSize: ms(13),
        fontWeight: '400',
        color: blackColor,
    },

    // Hospital
    hospitalName: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(12),
    },

    // Doctor
    doctorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(16),
    },
    doctorAvatar: {
        width: ms(48),
        height: ms(48),
        borderRadius: ms(24),
        backgroundColor: '#F1F1F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    doctorInfo: {
        flex: 1,
    },
    doctorName: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    doctorDegree: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
    },
    specialtyBadge: {
        backgroundColor: '#F1F5F9',
        borderRadius: ms(16),
        paddingHorizontal: ms(12),
        paddingVertical: vs(5),
    },
    specialtyText: {
        fontSize: ms(11),
        color: '#555',
        fontWeight: '500',
    },

    // View Details Button
    viewDetailsBtn: {
        backgroundColor:'#F1F5F9',
        borderRadius: ms(20),
        paddingVertical: vs(10),
        alignItems: 'center',
    },
    viewDetailsBtnText: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },
});
