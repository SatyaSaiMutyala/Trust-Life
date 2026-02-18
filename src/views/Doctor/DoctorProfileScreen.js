import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';

const { width } = Dimensions.get('window');

// ── Wave generator ─────────────────────────────────────────────────────────────
const WAVE_H = vs(28);
const NUM_WAVES = 13;

const buildWave = (w) => {
    const period = w / NUM_WAVES;
    const midY = vs(14);
    const amp = vs(6);
    let wave = '';
    for (let i = 0; i < NUM_WAVES; i++) {
        const cx = ((i + 0.5) * period).toFixed(1);
        const ex = ((i + 1) * period).toFixed(1);
        const cy = i % 2 === 0 ? midY - amp : midY + amp;
        wave += ` Q ${cx},${cy} ${ex},${midY}`;
    }
    return {
        fill: `M 0,${WAVE_H} L 0,${midY}${wave} L ${w},${WAVE_H} Z`,
        stroke: `M 0,${midY}${wave}`,
    };
};

const WAVE = buildWave(width);

// ── Slot layout ────────────────────────────────────────────────────────────────
const SLOT_GAP = ms(8);
const SLOT_WIDTH = (width - ms(20) * 2 - SLOT_GAP * 3) / 4;

// ── Data ───────────────────────────────────────────────────────────────────────
const DAYS = [
    { day: 'Mon', date: 14 },
    { day: 'Tue', date: 15 },
    { day: 'Wed', date: 16 },
    { day: 'Thu', date: 17 },
    { day: 'Fri', date: 18 },
    { day: 'Sat', date: 19 },
    { day: 'Sun', date: 20 },
];

const TIME_SLOTS = [
    { id: '1', time: '11:30', status: 'available' },
    { id: '2', time: '12:30', status: 'available' },
    { id: '3', time: '13:00', status: 'booked' },
    { id: '4', time: '14:30', status: 'available' },
    { id: '5', time: '15:00', status: 'booked' },
    { id: '6', time: '15:30', status: 'available' },
    { id: '7', time: '16:40', status: 'available' },
    { id: '8', time: '16:00', status: 'booked' },
];

const TODAY_DATE = 15;

// ── Screen ─────────────────────────────────────────────────────────────────────
const DoctorProfileScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const doctor = route.params?.doctor || {};

    const [selectedDay, setSelectedDay] = useState(17);
    const [selectedSlot, setSelectedSlot] = useState('7');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerDate, setPickerDate] = useState(new Date(2026, 1, 17));

    const onDateChange = (event, date) => {
        setShowDatePicker(false);
        if (event.type === 'set' && date) {
            setPickerDate(date);
            setSelectedDay(date.getDate());
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* ── Teal gradient header ── */}
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 1]}
                style={styles.header}
            >
                {/* Nav buttons */}
                <View style={styles.navRow}>
                    <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(18)} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.circleBtn}>
                        <Icon type={Icons.Ionicons} name="chatbubble-outline" color={blackColor} size={ms(16)} />
                    </TouchableOpacity>
                </View>

                {/* Doctor info + avatar row */}
                <View style={styles.headerBody}>
                    {/* Left: info */}
                    <View style={styles.infoBlock}>
                        <Text style={styles.doctorName}>{doctor.name || 'Dr. Anil Sharma'}</Text>
                        <Text style={styles.doctorId}>ID:584684745</Text>
                        <View style={styles.specialtyBadge}>
                            <Text style={styles.specialtyBadgeText}>
                                {doctor.specialty || 'General Physician'}
                            </Text>
                        </View>
                        <View style={styles.ratingRow}>
                            <Icon type={Icons.MaterialIcons} name="star" size={ms(15)} color="#FFC107" />
                            <Text style={styles.ratingVal}>{doctor.rating || '4.5'}</Text>
                            <Text style={styles.reviewsText}>  {doctor.reviews || '86k'} Reviews</Text>
                        </View>
                    </View>

                    {/* Right: avatar */}
                    <View style={styles.avatarWrap}>
                        <View style={styles.avatarBg}>
                            <Icon
                                type={Icons.MaterialIcons}
                                name="person"
                                size={ms(115)}
                                color="rgba(255,255,255,0.55)"
                            />
                        </View>
                    </View>
                </View>
            </LinearGradient>

            {/* ── Zigzag wave separator ── */}
            <Svg
                width={width}
                height={WAVE_H}
                style={styles.waveSvg}
            >
                {/* White fill below the wave (covers gradient bottom) */}
                <Path d={WAVE.fill} fill={whiteColor} />
                {/* Wave stroke line */}
                <Path
                    d={WAVE.stroke}
                    fill="none"
                    stroke="rgba(0,0,0,0.10)"
                    strokeWidth="1.5"
                />
            </Svg>

            {/* ── White appointment content ── */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentInner}
            >
                {/* Choose Appointment Slot */}
                <View style={styles.rowBetween}>
                    <Text style={styles.sectionTitle}>Choose Appointment Slot</Text>
                    <TouchableOpacity style={styles.calendarBtn} onPress={() => setShowDatePicker(true)}>
                        <Icon type={Icons.Ionicons} name="calendar-outline" color="#555" size={ms(17)} />
                    </TouchableOpacity>
                </View>

                {/* Month navigator */}
                <View style={styles.monthRow}>
                    <TouchableOpacity hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                        <Icon type={Icons.Ionicons} name="chevron-back" color="#555" size={ms(18)} />
                    </TouchableOpacity>
                    <Text style={styles.monthText}>February</Text>
                    <TouchableOpacity hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                        <Icon type={Icons.Ionicons} name="chevron-forward" color="#555" size={ms(18)} />
                    </TouchableOpacity>
                </View>

                {/* Days row */}
                <View style={styles.daysRow}>
                    {DAYS.map((d) => {
                        const isSelected = selectedDay === d.date;
                        const isToday = d.date === TODAY_DATE;
                        return (
                            <TouchableOpacity
                                key={d.date}
                                style={styles.dayCol}
                                onPress={() => setSelectedDay(d.date)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.dayLabel,
                                        (isSelected || isToday) && styles.dayLabelActive,
                                    ]}
                                >
                                    {d.day}
                                </Text>
                                <View
                                    style={[
                                        styles.dateBubble,
                                        isToday && !isSelected && styles.dateBubbleToday,
                                        isSelected && styles.dateBubbleSelected,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.dateNum,
                                            isToday && !isSelected && styles.dateNumToday,
                                            isSelected && styles.dateNumSelected,
                                        ]}
                                    >
                                        {d.date}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Today's slot header */}
                <View style={[styles.rowBetween, { marginBottom: vs(12) }]}>
                    <Text style={styles.slotTitle}>Today's Available Slot</Text>
                    <Text style={styles.slotCount}>6 Slots Available</Text>
                </View>

                {/* Slots 4-column grid */}
                <View style={styles.slotsGrid}>
                    {TIME_SLOTS.map((slot) => {
                        const isSelected = selectedSlot === slot.id;
                        const isBooked = slot.status === 'booked';
                        return (
                            <TouchableOpacity
                                key={slot.id}
                                disabled={isBooked}
                                activeOpacity={0.75}
                                style={[
                                    styles.slot,
                                    isBooked && styles.slotBooked,
                                    isSelected && styles.slotSelected,
                                ]}
                                onPress={() => setSelectedSlot(slot.id)}
                            >
                                <Text
                                    style={[
                                        styles.slotTime,
                                        isBooked && { color: '#EF5350' },
                                        isSelected && { color: whiteColor },
                                    ]}
                                >
                                    {slot.time}
                                </Text>
                                <View style={styles.slotStatusRow}>
                                    <View
                                        style={[
                                            styles.slotDot,
                                            { backgroundColor: isBooked ? '#EF5350' : '#4CAF50' },
                                            isSelected && { backgroundColor: whiteColor },
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            styles.slotStatusText,
                                            { color: isBooked ? '#EF5350' : '#4CAF50' },
                                            isSelected && { color: whiteColor },
                                        ]}
                                    >
                                        {isBooked ? 'Booked' : 'Available'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={{ height: vs(20) }} />
            </ScrollView>

            {showDatePicker && (
                <DateTimePicker
                    value={pickerDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            {/* ── Book Appointment button ── */}
            <View style={styles.footer}>
                <PrimaryButton
                    title="Book Appointment"
                    onPress={() => {
                        const slotObj = TIME_SLOTS.find(s => s.id === selectedSlot);
                        const dayObj = DAYS.find(d => d.date === selectedDay);
                        navigation.navigate('ReviewAppointmentScreen', {
                            doctor,
                            selectedSlot: slotObj?.time || '11:30',
                            selectedDate: `${dayObj?.day || 'Thu'}, ${selectedDay} Feb, 2026`,
                        });
                    }}
                    style={{ marginTop: 0 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default DoctorProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },

    // ── Header ──
    header: {
        paddingTop: ms(48),
        paddingHorizontal: ms(20),
        paddingBottom: ms(48),
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(16),
    },
    circleBtn: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBody: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    infoBlock: {
        flex: 1,
        paddingRight: ms(8),
    },
    doctorName: {
        fontSize: ms(21),
        fontWeight: 'bold',
        color: whiteColor,
        marginBottom: vs(3),
    },
    doctorId: {
        fontSize: ms(11),
        color: 'rgba(255,255,255,0.65)',
        marginBottom: vs(8),
    },
    specialtyBadge: {
        alignSelf: 'flex-start',
        backgroundColor: whiteColor,
        paddingHorizontal: ms(13),
        paddingVertical: vs(4),
        borderRadius: ms(20),
        marginBottom: vs(8),
    },
    specialtyBadgeText: {
        color: blackColor,
        fontSize: ms(11),
        fontWeight: '500',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingVal: {
        fontSize: ms(13),
        fontWeight: '700',
        color: blackColor,
        marginLeft: ms(3),
    },
    reviewsText: {
        fontSize: ms(11),
        color: 'rgba(255,255,255,0.7)',
    },
    avatarWrap: {
        width: ms(120),
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarBg: {
        width: ms(120),
        height: ms(120),
        borderRadius: ms(60),
        backgroundColor: 'rgba(255,255,255,0.18)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },

    // ── Wave ──
    waveSvg: {
        marginTop: -WAVE_H,
    },

    // ── Content ──
    content: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    contentInner: {
        paddingHorizontal: ms(20),
        paddingTop: vs(14),
        paddingBottom: vs(20),
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(14),
    },
    sectionTitle: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
    },
    calendarBtn: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(10),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Month
    monthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(25),
        marginBottom: vs(16),
    },
    monthText: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },

    // Days
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(22),
    },
    dayCol: {
        alignItems: 'center',
        gap: vs(5),
    },
    dayLabel: {
        fontSize: ms(10),
        color: '#999',
        fontWeight: '500',
    },
    dayLabelActive: {
        color: primaryColor,
        fontWeight: '600',
    },
    dateBubble: {
        width: ms(32),
        height: ms(32),
        borderRadius: ms(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateBubbleToday: {
        backgroundColor: '#B2DFDB',
    },
    dateBubbleSelected: {
        backgroundColor: primaryColor,
    },
    dateNum: {
        fontSize: ms(12),
        color: '#555',
        fontWeight: '500',
    },
    dateNumToday: {
        color: primaryColor,
        fontWeight: '700',
    },
    dateNumSelected: {
        color: whiteColor,
        fontWeight: '700',
    },

    // Slot header
    slotTitle: {
        fontSize: ms(13),
        fontWeight: '700',
        color: blackColor,
    },
    slotCount: {
        fontSize: ms(12),
        color: '#888',
    },

    // Slots grid
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SLOT_GAP,
    },
    slot: {
        width: SLOT_WIDTH,
        paddingVertical: vs(9),
        alignItems: 'center',
        borderRadius: ms(10),
        borderWidth: 1.5,
        borderColor: '#4CAF50',
        backgroundColor: whiteColor,
    },
    slotBooked: {
        borderColor: '#EF5350',
        backgroundColor: '#FFF3F3',
    },
    slotSelected: {
        borderColor: primaryColor,
        backgroundColor: primaryColor,
    },
    slotTime: {
        fontSize: ms(13),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(2),
    },
    slotStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(3),
    },
    slotDot: {
        width: ms(5),
        height: ms(5),
        borderRadius: ms(3),
    },
    slotStatusText: {
        fontSize: ms(9),
        fontWeight: '500',
    },

    // Footer
    footer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(25),
        paddingTop: vs(8),
        backgroundColor: whiteColor,
    },
});
