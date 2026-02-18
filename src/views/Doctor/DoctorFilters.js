import React, { useState, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    PanResponder,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';

const { width } = Dimensions.get('window');
const TRACK_WIDTH = width - ms(30) * 2;
const FEE_MIN = 0;
const FEE_MAX = 1000;
const THUMB_SIZE = ms(20);

const FILTER_SECTIONS = [
    {
        key: 'specialization',
        label: 'Specialization',
        options: ['General Physician', 'Cardiologist', 'Orthopedic', 'Gynecologist'],
        multi: true,
    },
    {
        key: 'experience',
        label: 'Experience',
        options: ['1-5 Years', '5-10 Years', '10+ Years'],
        multi: false,
    },
    {
        key: 'consultationType',
        label: 'Consultation Type',
        options: ['Online', 'Offline'],
        multi: true,
    },
    {
        key: 'rating',
        label: 'Rating',
        options: ['4★ & Above', '4.5★ & Above'],
        multi: false,
    },
    {
        key: 'gender',
        label: 'Gender',
        options: ['Male', 'Female'],
        multi: true,
    },
];

// ── Range Slider ─────────────────────────────────────────────────────────────
const RangeSlider = ({ minVal, maxVal, onMinChange, onMaxChange }) => {
    const minX = useRef(((minVal - FEE_MIN) / (FEE_MAX - FEE_MIN)) * TRACK_WIDTH);
    const maxX = useRef(((maxVal - FEE_MIN) / (FEE_MAX - FEE_MIN)) * TRACK_WIDTH);
    const [positions, setPositions] = useState({ min: minX.current, max: maxX.current });

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    const minPan = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, g) => {
                const next = clamp(minX.current + g.dx, 0, maxX.current - THUMB_SIZE);
                setPositions((p) => ({ ...p, min: next }));
                const val = Math.round((next / TRACK_WIDTH) * (FEE_MAX - FEE_MIN) + FEE_MIN);
                onMinChange(val);
            },
            onPanResponderRelease: (_, g) => {
                minX.current = clamp(minX.current + g.dx, 0, maxX.current - THUMB_SIZE);
            },
        }),
    ).current;

    const maxPan = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, g) => {
                const next = clamp(maxX.current + g.dx, positions.min + THUMB_SIZE, TRACK_WIDTH);
                setPositions((p) => ({ ...p, max: next }));
                const val = Math.round((next / TRACK_WIDTH) * (FEE_MAX - FEE_MIN) + FEE_MIN);
                onMaxChange(val);
            },
            onPanResponderRelease: (_, g) => {
                maxX.current = clamp(maxX.current + g.dx, minX.current + THUMB_SIZE, TRACK_WIDTH);
            },
        }),
    ).current;

    return (
        <View style={sliderStyles.container}>
            {/* Track */}
            <View style={sliderStyles.track}>
                {/* Filled range */}
                <View
                    style={[
                        sliderStyles.fill,
                        { left: positions.min, width: positions.max - positions.min },
                    ]}
                />
                {/* Min thumb */}
                <View
                    style={[sliderStyles.thumb, { left: positions.min - THUMB_SIZE / 2 }]}
                    {...minPan.panHandlers}
                />
                {/* Max thumb */}
                <View
                    style={[sliderStyles.thumb, { left: positions.max - THUMB_SIZE / 2 }]}
                    {...maxPan.panHandlers}
                />
            </View>
            {/* Labels */}
            <View style={sliderStyles.labels}>
                <Text style={sliderStyles.labelText}>₹{minVal}</Text>
                <Text style={sliderStyles.labelText}>₹{maxVal}</Text>
            </View>
        </View>
    );
};

const sliderStyles = StyleSheet.create({
    container: { paddingVertical: vs(10) },
    track: {
        height: ms(4),
        backgroundColor: '#E0E0E0',
        borderRadius: ms(2),
        marginHorizontal: ms(0),
        position: 'relative',
    },
    fill: {
        position: 'absolute',
        height: ms(4),
        backgroundColor: primaryColor,
        borderRadius: ms(2),
        top: 0,
    },
    thumb: {
        position: 'absolute',
        top: -(THUMB_SIZE / 2 - ms(2)),
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: primaryColor,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(10),
    },
    labelText: {
        fontSize: ms(12),
        color: '#555',
        fontWeight: '500',
    },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
const DoctorFilters = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const onApply = route.params?.onApply;

    const [selected, setSelected] = useState({
        specialization: [],
        experience: [],
        consultationType: [],
        rating: [],
        gender: [],
    });
    const [minFee, setMinFee] = useState(200);
    const [maxFee, setMaxFee] = useState(500);

    const toggle = (sectionKey, option, multi) => {
        setSelected((prev) => {
            const current = prev[sectionKey];
            if (multi) {
                return {
                    ...prev,
                    [sectionKey]: current.includes(option)
                        ? current.filter((o) => o !== option)
                        : [...current, option],
                };
            } else {
                return {
                    ...prev,
                    [sectionKey]: current.includes(option) ? [] : [option],
                };
            }
        });
    };

    const handleApply = () => {
        onApply?.({ ...selected, feeRange: { min: minFee, max: maxFee } });
        navigation.goBack();
    };

    const handleClear = () => {
        setSelected({ specialization: [], experience: [], consultationType: [], rating: [], gender: [] });
        setMinFee(200);
        setMaxFee(500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Filters</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <Icon type={Icons.Ionicons} name="close" color="#555" size={ms(18)} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {FILTER_SECTIONS.map((section) => (
                    <View key={section.key} style={styles.section}>
                        <Text style={styles.sectionLabel}>{section.label}</Text>
                        <View style={styles.chipsRow}>
                            {section.options.map((opt) => {
                                const active = selected[section.key].includes(opt);
                                return (
                                    <TouchableOpacity
                                        key={opt}
                                        style={[styles.chip, active && styles.chipActive]}
                                        onPress={() => toggle(section.key, opt, section.multi)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                                            {opt}
                                        </Text>
                                        {active && (
                                            <Icon
                                                type={Icons.Ionicons}
                                                name="close-circle"
                                                color={whiteColor}
                                                size={ms(13)}
                                                style={{ marginLeft: ms(4) }}
                                            />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}

                {/* Fee Range */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Fee Range</Text>
                    <RangeSlider
                        minVal={minFee}
                        maxVal={maxFee}
                        onMinChange={setMinFee}
                        onMaxChange={setMaxFee}
                    />
                </View>

                <View style={{ height: vs(100) }} />
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                    <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <PrimaryButton title="Apply Filters" onPress={handleApply} style={{ marginTop: 0 }} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default DoctorFilters;

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
        paddingTop: ms(50),
        paddingBottom: ms(15),
    },
    headerTitle: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: blackColor,
    },
    closeBtn: {
        width: ms(32),
        height: ms(32),
        borderRadius: ms(16),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Scroll
    scroll: {
        paddingHorizontal: ms(20),
        paddingTop: vs(10),
    },

    // Section
    section: {
        marginBottom: vs(20),
    },
    sectionLabel: {
        fontSize: ms(13),
        fontWeight: '700',
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
        paddingHorizontal: ms(14),
        paddingVertical: vs(7),
        borderRadius: ms(20),
        borderWidth: 1,
        borderColor: '#D0D0D0',
        backgroundColor: whiteColor,
    },
    chipActive: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },
    chipText: {
        fontSize: ms(12),
        color: '#555',
        fontWeight: '500',
    },
    chipTextActive: {
        color: whiteColor,
        fontWeight: '600',
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
        paddingTop: vs(12),
        backgroundColor: whiteColor,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: ms(12),
    },
    clearBtn: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(12),
        borderRadius: ms(25),
        borderWidth: 1,
        borderColor: '#D0D0D0',
    },
    clearText: {
        fontSize: ms(13),
        color: '#555',
        fontWeight: '600',
    },
});
