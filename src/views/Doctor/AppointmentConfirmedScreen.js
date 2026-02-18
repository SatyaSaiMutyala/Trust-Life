import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Icon, { Icons } from '../../components/Icons';
import { StatusBar2 } from '../../components/StatusBar';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';

const InfoCard = ({ title, children }) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        {children}
    </View>
);

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const AppointmentConfirmedScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const { selectedSlot, selectedDate } = route.params || {};
    const appointmentDateTime = `${selectedSlot || '11:30'}, ${selectedDate || 'Mon, 17 Feb, 2026'}`;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {/* ── Top green confirmation block ── */}
                <View style={styles.topBlock}>
                    <View style={styles.iconCircle}>
                        <Icon type={Icons.MaterialIcons} name="check" size={ms(36)} color="#fff" />
                    </View>
                    <Text style={styles.confirmedTitle}>Appointment Confirmed</Text>
                    <Text style={styles.confirmedSubtitle}>
                        Your Appointment Is Confirmed. You'll Receive{'\n'}The Details Shortly.
                    </Text>
                    <TouchableOpacity style={styles.arrivePill} activeOpacity={0.85}>
                        <Text style={styles.arriveText}>Arrive 10–15 minutes early</Text>
                    </TouchableOpacity>
                    <Text style={styles.idLabel}>Appointment ID</Text>
                    <Text style={styles.idValue}>7326453845</Text>
                </View>

                {/* ── Cards ── */}
                <View style={styles.cardsWrap}>

                    <InfoCard title="Appointment Date & Time">
                        <Text style={styles.cardBody}>{appointmentDateTime}</Text>
                    </InfoCard>

                    <InfoCard title="Clinic Address">
                        <Text style={styles.cardBody}>
                            9-547/77/67 Beside Metro station Prakash Nagar, Hyderabad
                        </Text>
                        <TouchableOpacity
                            style={styles.directionBtn}
                            activeOpacity={0.8}
                            onPress={() => Linking.openURL('https://maps.google.com')}
                        >
                            <Icon type={Icons.MaterialIcons} name="near-me" size={ms(15)} color={primaryColor} />
                            <Text style={styles.directionText}>Direction</Text>
                        </TouchableOpacity>
                    </InfoCard>

                    <InfoCard title="Payment Details">
                        <DetailRow label="Amount Paid" value="₹620" />
                        <DetailRow label="Payment via" value="Phone pay" />
                        <DetailRow label="Transaction ID" value="8373753609606" />
                    </InfoCard>

                    <View style={styles.supportRow}>
                        <Text style={styles.supportText}>Facing an Issue? </Text>
                        <TouchableOpacity activeOpacity={0.7}>
                            <Text style={styles.supportLink}>Get Support</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={{ height: vs(20) }} />
            </ScrollView>

            {/* ── Footer ── */}
            <View style={styles.footer}>
                <PrimaryButton
                    title="Back to home"
                    onPress={() =>
                        navigation.reset({
                            index: 1,
                            routes: [
                                { name: 'Home' },
                                { name: 'DoctorConsultation' },
                            ],
                        })
                    }
                    style={{ marginTop: 0 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default AppointmentConfirmedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    scroll: {
        paddingBottom: vs(110),
    },

    // ── Top block ──
    topBlock: {
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        paddingTop: vs(32),
        paddingBottom: vs(24),
        paddingHorizontal: ms(24),
        borderBottomLeftRadius: ms(28),
        borderBottomRightRadius: ms(28),
        marginBottom: vs(14),
    },
    iconCircle: {
        width: ms(72),
        height: ms(72),
        borderRadius: ms(36),
        backgroundColor: '#43A047',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(14),
    },
    confirmedTitle: {
        fontSize: ms(19),
        fontWeight: '800',
        color: blackColor,
        marginBottom: vs(6),
    },
    confirmedSubtitle: {
        fontSize: ms(12),
        color: '#777',
        textAlign: 'center',
        lineHeight: ms(19),
        marginBottom: vs(16),
    },
    arrivePill: {
        backgroundColor: '#43A047',
        borderRadius: ms(30),
        paddingHorizontal: ms(22),
        paddingVertical: vs(9),
        marginBottom: vs(18),
    },
    arriveText: {
        color: whiteColor,
        fontSize: ms(13),
        fontWeight: '600',
    },
    idLabel: {
        fontSize: ms(11),
        color: '#999',
        marginBottom: vs(3),
    },
    idValue: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
    },

    // ── Cards wrapper ──
    cardsWrap: {
        paddingHorizontal: ms(16),
    },

    // ── Card ──
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(14),
        marginBottom: vs(10),
    },
    cardTitle: {
        fontSize: ms(13),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(6),
    },
    cardBody: {
        fontSize: ms(13),
        color: '#444',
        lineHeight: ms(20),
    },

    // ── Direction ──
    directionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(6),
        marginTop: vs(10),
        backgroundColor: '#EAF4F0',
        alignSelf: 'flex-start',
        paddingHorizontal: ms(14),
        paddingVertical: vs(7),
        borderRadius: ms(20),
    },
    directionText: {
        fontSize: ms(13),
        color: primaryColor,
        fontWeight: '600',
    },

    // ── Detail row ──
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: vs(5),
    },
    detailLabel: {
        fontSize: ms(12),
        color: '#888',
    },
    detailValue: {
        fontSize: ms(12),
        color: blackColor,
        fontWeight: '500',
    },

    // ── Support ──
    supportRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: vs(6),
        marginBottom: vs(4),
    },
    supportText: {
        fontSize: ms(13),
        color: '#555',
    },
    supportLink: {
        fontSize: ms(13),
        color: primaryColor,
        fontWeight: '600',
    },

    // ── Footer ──
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: ms(16),
        paddingBottom: vs(28),
        paddingTop: vs(10),
    },
});
